import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import courseWorkFile = require('../../../../stores/response/digital/typings/courseworkfile');
import MetaData = require('./metadata');
let classNames = require('classnames');
import htmlUtilities = require('../../../../utility/generic/htmlutilities');
import eCourseworkHelper = require('../../../utility/ecoursework/ecourseworkhelper');
import constants = require('../../../utility/constants');
import enums = require('../../../../components/utility/enums');
import ThumbnailItem = require('./thumbnailitem');
import applicationStore = require('../../../../stores/applicationoffline/applicationstore');
const METAPOPOUT_BOTTOM_CORRECTION_PIXEL: number = 10;

interface Props extends PropsBase, LocaleSelectionBase {
    eCourseWorkFile: courseWorkFile;
    isSelected: boolean;
    onCouseWorkFileClick: Function;
    doAddStartView: boolean;
    doAddEndView: boolean;
    isUnread: boolean;
    metaData: Immutable.List<CoverSheetMetaData>;
    isFilelistPanelCollapsed: boolean;
    scrollHeight: number;
    fileListPanelView: enums.FileListPanelView;
    renderedOn?: number;
    onError: Function;
    docPageId: number;
    onSuccess: Function;
    onFileItemHover: Function;
}

interface State {
    renderedOn: number;
}

class FileItem extends pureRenderComponent<Props, State> {
    private fileItemElement: HTMLLIElement;
    private metaWrapperElement: HTMLElement;
    private menuCallOutElement: HTMLElement;
    private metaPopoutTop: number = 0;
    private menuCalloutTop: number = 0;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0
        };
        this.onFileItemHover = this.onFileItemHover.bind(this);
        this.metaWrapperRefCallback = this.metaWrapperRefCallback.bind(this);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {

        let _classnames = eCourseworkHelper.getIconStyleForSvg(this.props.eCourseWorkFile.linkType);

        let calloutStyle: React.CSSProperties = {
            top: (this.menuCalloutTop) ? (this.menuCalloutTop + 'px') : '0px'
        };

        let doShowThumbnailImage: boolean = this.props.eCourseWorkFile.linkData.mediaType === enums.MediaType.Image;

            let thumbnailImage: JSX.Element = doShowThumbnailImage ? (<ThumbnailItem
            key='key_thumbnailItem'
            id='thumbnailItem'
            url={eCourseworkHelper.getECourseworkFileContentUrl(this.props.eCourseWorkFile.linkData.url)}
            fileName={this.props.eCourseWorkFile.title}
            fileListPanelView={this.props.fileListPanelView} renderedOn={this.props.renderedOn}
            onError={this.props.onError}
            docPageId={this.props.docPageId}
            onSuccess={this.props.onSuccess} />) : null;

        return (
            <li role='listitem'
                className={
                    classNames(_classnames.listItemClass,
                        { 'active': this.props.isSelected },
                        { 'unread': this.props.isUnread },
                        { 'start-view': this.props.doAddStartView },
                        { 'end-view': this.props.doAddEndView })
                }
                id={'li_' + this.props.id}
                onMouseOver = { this.onFileItemHover }
                ref={(fileItem) => { this.fileItemElement = fileItem; } }>
                <a href='javascript:void(0);' className='file-list-anchor'
                    onClick={() => { this.props.onCouseWorkFileClick(this.props.eCourseWorkFile); } }>
                    <div className='file-icon'>
                        <span className='svg-icon'>
                            <svg className={_classnames.svgClass} viewBox={_classnames.viewBox}>
                                <use xmlnsXlink={'http://www.w3.org/1999/xlink'} xlinkHref={'#' + _classnames.icon} />
                            </svg>
                        </span>
                    </div>
                    {<div className='file-name'>{this.props.eCourseWorkFile.title}</div>}
                    {thumbnailImage}
                </a>
                {this.isPopoutEmpty() ? null :
                    <div className='menu-callout' style = { calloutStyle }
                        ref={(menuCallOut) => { this.menuCallOutElement = menuCallOut; } }></div>}
                { this.metaDataElement() }
            </li>
        );
    }

    /**
     * returns whether the metadata popout should be visible or not.
     */
    private isPopoutEmpty() {
        let _isPopoutEmpty: boolean = (htmlUtilities.isTabletOrMobileDevice || (!this.props.metaData &&
            (this.props.isFilelistPanelCollapsed === false && this.props.fileListPanelView === enums.FileListPanelView.List)));
        return _isPopoutEmpty;
    }

    /**
     * returns the meta data JSX element
     */
    private metaDataElement = (): JSX.Element => {
        return (<MetaData
            selectedLanguage = { this.props.selectedLanguage }
            metadata = { this.props.metaData }
            title = { this.props.eCourseWorkFile.title }
            id = { this.props.id + '_' + this.props.eCourseWorkFile.docPageID }
            key = { this.props.key + '_' + this.props.eCourseWorkFile.docPageID }
            isFilelistPanelCollapsed = { this.props.isFilelistPanelCollapsed }
            isSelected = { this.props.isSelected }
            scrollHeight = { this.props.scrollHeight }
            metaWrapperRefCallback = { this.metaWrapperRefCallback }
            metaPopoutTop = { this.metaPopoutTop }
            fileListPanelView = { this.props.fileListPanelView } />);
    };

    /**
     * Comparing the props to check the updates are made by self
     * @param {Props} nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.isFilelistPanelCollapsed !== nextProps.isFilelistPanelCollapsed) {
            this.metaPopoutTop = 0;
            this.menuCalloutTop = 0;
        }
    }

    /**
     * event handle for file item  mouse over - It calculate the position of pop out div and correct it position to fully visible.
     */
    private onFileItemHover = (event: any): void => {

        if (!this.isPopoutEmpty()) {

            event.stopPropagation();

            if (this.props.isFilelistPanelCollapsed) {
                this.setMetaPopoupPositionOnCollapsedView();
            } else {
                this.setMetaPopoupPositionOnStdView();
            }
            this.props.onFileItemHover();
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * function to set the callout menu top and meta popup top on the collapsed file list view ( expanded)
     */
    private setMetaPopoupPositionOnCollapsedView() {

        let wrapperRect = this.metaWrapperElement.getBoundingClientRect();
        /* if the top + height of of pop-out is higher than window height we need to shift this up*/
        if ((window.innerHeight) < (wrapperRect.top + wrapperRect.height)) {
            let topValueDiff = ((wrapperRect.top + wrapperRect.height) - window.innerHeight);

            this.metaPopoutTop = - ((this.fileItemElement.offsetHeight + topValueDiff) + METAPOPOUT_BOTTOM_CORRECTION_PIXEL);
        } else if (wrapperRect.top < 0) {
            /* this is to reset the top for those poput which has negative top value*/
            this.metaPopoutTop = 0;
        }
    }

    /**
     * function to set the callout menu top and meta popup top on the standard view
     */
    private setMetaPopoupPositionOnStdView() {
        let wrapperRect = this.metaWrapperElement.getBoundingClientRect();

        // Defect fix #53684, added renderedTopItem to set the pop out position correctly for the last file items in an ecoursework response
        let renderedTopItem = this.fileItemElement.getBoundingClientRect().top +
            ((this.fileItemElement.getBoundingClientRect().height) - constants.ECOURSEWORK_FILELIST_PANEL_TOP);

        // Used for menu call out position
        let renderedTopMenu = this.fileItemElement.getBoundingClientRect().top +
            ((this.fileItemElement.getBoundingClientRect().height / 2) - constants.ECOURSEWORK_FILELIST_PANEL_TOP);

        /* if the top + height of of pop-out is higher than window height we need to shift this up*/
        if ((window.innerHeight) < (renderedTopItem + wrapperRect.height)) {
            let topValueDiff = (renderedTopItem + wrapperRect.height) - window.innerHeight;
            this.metaPopoutTop = ((renderedTopItem - topValueDiff) - (constants.COMMON_HEADER_HEIGHT + METAPOPOUT_BOTTOM_CORRECTION_PIXEL));
        } else {
            this.metaPopoutTop = renderedTopMenu;
        }

        this.menuCalloutTop = renderedTopMenu;
    }

    /**
     * this is a callback to get the child element ref
     */
    private metaWrapperRefCallback = (metaWrapper: HTMLElement): void => {
        this.metaWrapperElement = metaWrapper;
    };
}

export = FileItem;