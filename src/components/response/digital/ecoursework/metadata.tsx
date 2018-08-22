import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import Immutable = require('immutable');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import constants = require('../../../utility/constants');
import localeStore = require('../../../../stores/locale/localestore');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import enums = require('../../../utility/enums');
let classNames = require('classnames');
/* this is the sum of heights of  header panel and the two divs above file list panel */
const FILE_LIST_PANEL_TOP = 120;

interface MetaDataItemProps extends PropsBase, LocaleSelectionBase {
    metaKey: string;
    metaValue: string;
}

/* tslint:disable:variable-name */
const MetaDataItem: React.StatelessComponent<MetaDataItemProps> = (props: MetaDataItemProps) => {
    return (
        <div className = 'meta-item'>
            <span className = 'meta-key'> { props.metaKey } </span>
            <span className = 'meta-value' > { props.metaValue } </span>
        </div >
    );
};
/* tslint:enable:variable-name */

interface Props extends PropsBase, LocaleSelectionBase {
    metadata: Immutable.List<CoverSheetMetaData>;
    title: string;
    isFilelistPanelCollapsed: boolean;
    isSelected: boolean;
    scrollHeight: number;
    metaWrapperRefCallback: Function;
    metaPopoutTop: number;
    fileListPanelView: enums.FileListPanelView;
}

interface State {
    renderedOn: number;
}

/**
 * React component class for meta data
 */
class MetaData extends pureRenderComponent<Props, State> {
    private isShowMore: boolean = undefined;
    private isFloating: boolean = false;
    private metaWrapper: HTMLDivElement;
    private prevPageY: number = 0;
    private allowUp: boolean = false;
    private allowDown: boolean = false;

    /** refs */
    public refs: {
        [key: string]: (Element);
        metaData: (HTMLDivElement);
        metaDataInner: (HTMLDivElement);
        metaViewControl: (HTMLDivElement);
    };

    /**
     * Constructor for metadata class
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            renderedOn: Date.now()
        };

        this.showMoreOrLessButtton = this.showMoreOrLessButtton.bind(this);
    }

    /**
     * render method
     */
    public render(): JSX.Element {
        let that = this;
        let metDataItems;
        let element;

        if (this.props.metadata) {
            metDataItems = this.props.metadata.map(function (item: CoverSheetMetaData) {
                return (<MetaDataItem
                    metaKey={ item.key }
                    metaValue={ item.value }
                    id={ 'metadata_' + item.key + '_' + item.sequence }
                    key={ 'metadata_' + item.key + '_' + item.sequence }
                    selectedLanguage = { that.props.selectedLanguage } />
                );
            });
        }

        if (htmlUtilities.isTabletOrMobileDevice && this.props.isFilelistPanelCollapsed) {
            return null;
        } else {
            let doShowTitle: boolean = (this.props.isSelected === false ||
                (this.props.isSelected && this.props.fileListPanelView === enums.FileListPanelView.Thumbnail)
                || this.props.isFilelistPanelCollapsed === true);
            element = <div id = 'metadataContainer' className = 'file-meta-inner'
                ref={'metaData'} onWheel={this.onMousewheel}>
                <div ref={'metaDataInner'} id='metaDataInnerContainer'>
                    { doShowTitle ?
                    <div className='collapsed-dropdown-title'>{this.props.title}</div> : null}
                    { metDataItems }
                </div>
            </div>;
            let style: React.CSSProperties = {
                top: (this.props.metaPopoutTop) ? (this.props.metaPopoutTop + 'px') : '0px'
            };
            if (this.doRenderMetaWrapper) {
                return (
                    <div className = {classNames('file-meta-wrapper ',
                        { 'more': (this.isShowMore === undefined || this.isShowMore === true) },
                        { 'less': this.isShowMore === false }) }
                        style = { style }
                        ref = {(metaWrapper) => {
                            this.metaWrapper = metaWrapper;
                            this.props.metaWrapperRefCallback(metaWrapper);
                        } }
                        onScroll={this.onScroll}
                        onWheel={this.onScroll}>
                        { element }
                        <div className ='meta-view-controll' ref = { 'metaViewControl' } >
                            { this.showMoreLessElement() }
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        }
    }

    /**
     * handle logic for showing meta data wrapper
     */
    private get doRenderMetaWrapper(): boolean {
        return (this.props.metadata !== undefined || this.props.isFilelistPanelCollapsed ||
            this.props.fileListPanelView === enums.FileListPanelView.Thumbnail);
    }

    /**
     * handler for scroll and wheel - to prevent the event propagation to stop the scroll of
     */
    private onScroll = (event: any) => {
        event.stopPropagation();
    };

    /**
     * handler for Mousewheel event of popout content - to prevent the scroll propagation to filelist panel.
     */
    private onMousewheel = (event: any) => {
        if ((htmlUtilities.isIE || htmlUtilities.isEdge) &&  this.props.isSelected !== true
             && this.props.isFilelistPanelCollapsed !== true) {
            let height = this.refs.metaData.clientHeight;
            let scrollHeight = this.refs.metaData.scrollHeight;
            let scrollTop = this.refs.metaData.scrollTop;

            if (((scrollTop === (scrollHeight - height) && event.deltaY > 0)
                || (scrollTop === 0 && event.deltaY < 0))) {
                event.preventDefault();
            }
        }
    };

    /**
     * returns the show more or  less JSX element
     */
    private showMoreLessElement = (): JSX.Element => {

        let showMoreLessElement: JSX.Element = null;

        if (this.isShowMore !== undefined) {
            showMoreLessElement =
                <a href='javascript:void(0);'
                    className={classNames('meta-change-view ', { 'fixed': (this.isFloating && (this.isShowMore === false)) }) }
                    onClick = { this.onShowMoreLessClick } id = {'showmorelessbutton'} >
                    {
                        (this.isShowMore === true) ?
                            localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.show-more-metadata') :
                            localeStore.instance.TranslateText('marking.response.ecoursework-file-browser.show-less-metadata')
                    }
                </a>;
        }

        return showMoreLessElement;
    };

    /**
     * click event handler of show more or less button .
     */
    private onShowMoreLessClick = () => {
        this.isShowMore = !this.isShowMore;
        this.isFloating = false;
        this.setState({ renderedOn: Date.now() });
    };

    /**
     * componentDidUpdate
     */
    public componentDidUpdate() {
        this.showMoreOrLessButtton();
    }

    /**
     * componentDidMount
     */
    public componentDidMount() {
        this.showMoreOrLessButtton();
        window.addEventListener('resize', this.showMoreOrLessButtton);
        /* These events are used to block default scrolling in ipad and implement custom 
            scrolling logic to prevent the elastic scroll behavior of safari */
        if (htmlUtilities.isIPadDevice && this.metaWrapper) {
            this.metaWrapper.addEventListener('touchstart', this.onTouchStart);
            this.metaWrapper.addEventListener('touchmove', this.onTouchMove);
            this.metaWrapper.addEventListener('touchend', this.onTouchEnd);
        }
    }

    /**
     * event handler for touch start
     */
    private onTouchStart = (event: any) => {
        this.prevPageY = (event.changedTouches) ? event.changedTouches[0].pageY : 0;
        // TODO: find an alterantive to avoid document.getElementById
        let content = document.getElementById('File_List');
        this.allowUp = (content.scrollTop > 0);
        this.allowDown = (content.scrollTop <= content.scrollHeight - content.clientHeight);
    };

    /**
     * event handler for touch move
     */
    private onTouchMove = (event: any) => {
        event.preventDefault();
        // TODO: find an alterantive to avoid document.getElementById
        let content = document.getElementById('File_List');
        let pageY = event.changedTouches[0].pageY;
        var up = (pageY > this.prevPageY);
        var down = (pageY < this.prevPageY);
        let diff = Math.abs(this.prevPageY - event.pageY);

        this.prevPageY = event.pageY;

        if ((up && this.allowUp)) {
            content.scrollTop = (content.scrollTop - diff);
        } else if (down && this.allowDown) {
            content.scrollTop = (content.scrollTop + diff);
        }
    };

    /**
     * event handler for touch end
     */
    private onTouchEnd = (event: any) => {
        this.prevPageY = 0;
    };

    /**
     * componentDidMount
     */
    public componentWillunmount() {
        window.removeEventListener('resize', this.showMoreOrLessButtton);
        this.metaWrapper.removeEventListener('touchstart', this.onTouchStart);
        this.metaWrapper.removeEventListener('touchmove', this.onTouchMove);
        this.metaWrapper.removeEventListener('touchend', this.onTouchEnd);
    }

    /**
     * Comparing the props to check the updates are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.isFilelistPanelCollapsed !== nextProps.isFilelistPanelCollapsed
            || this.props.isSelected !== nextProps.isSelected) {
            this.isShowMore = undefined;
            this.isFloating = false;
        }
    }

    /**
     * to show the Show more or less buttons based on the content size.
     */
    private showMoreOrLessButtton = () => {
        let timeOut: number;
        if (this.props.isSelected === true &&  eCourseWorkFileStore.instance.fileListPanelCurrentView === enums.FileListPanelView.List) {

            if (this.refs.metaData) {
                /* this is to reset the top of metadata div even after scrolling the popout of the same */
                this.refs.metaData.scrollTop = 0;
            }

            if (htmlUtilities.isAndroidDevice || htmlUtilities.isEdge) {
                timeOut = 0;
            } else {
                timeOut = constants.GENERIC_ANIMATION_TIMEOUT;
            }
            setTimeout(() => {

                let that = this;
                let scrollValue = (that.refs.metaViewControl) ? (that.refs.metaViewControl.getBoundingClientRect().top) : undefined;
                let _isFloating = that.isFloating;
                let _isShowMore = that.isShowMore;
                let metadatTop = (that.refs.metaData) ? that.refs.metaData.getBoundingClientRect().top : 0;
                let windowHeight = window.innerHeight;

                /*  Conditions for displaying the floating show less button. (Based on the scrolling) */
                if (scrollValue > windowHeight && windowHeight > metadatTop) {
                    that.isFloating = true;
                } else {
                    that.isFloating = false;
                }

                let containerHeight = (that.refs.metaData) ? that.refs.metaData.clientHeight : 0;
                let innerHeight = (that.refs.metaDataInner) ? that.refs.metaDataInner.clientHeight : 0;

                /* Conditions for displaying the show more button based on the meta data content size.*/
                if (innerHeight > containerHeight && that.isShowMore === undefined) {
                    that.isShowMore = true;
                }

                /* Defect Fix : #57280 , Added condition for rechecking the display of showmore link after resizing the window*/
                if (innerHeight === containerHeight && that.isShowMore === true) {
                    that.isShowMore = undefined;
                }

                /* re rendering if floating or show more options changed - Using private variables for these to avoid mutating of state
                in will receive props*/
                if (_isFloating !== that.isFloating || _isShowMore !== that.isShowMore) {
                    that.setState({ renderedOn: Date.now() });
                }
            }, timeOut);
        }
    };
}
export = MetaData;