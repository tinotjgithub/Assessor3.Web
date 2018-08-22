/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import BookmarkHolder = require('../../responsescreen/bookmark/bookmarkholder');
import domManager = require('../../../../utility/generic/domhelper');
import bookmarkcomponentwrapper = require('../../../../stores/marking/bookmarkcomponentwrapper');
import toolBarActionCreator = require('../../../../actions/toolbar/toolbaractioncreator');
let classNames = require('classnames');
import responseStore = require('../../../../stores/response/responsestore');

/**
 * Component props
 * @param {Props} props
 * @param {any} any
 */
interface Props extends LocaleSelectionBase, PropsBase {
    bookmarkItems: Array<bookmarkcomponentwrapper>;
}

interface State {
    renderedOn: number;
    isBookmarkPanelOpen?: boolean;
}

class BookmarkIcon extends pureRenderComponent<Props, State> {
    private _openCloseBookmarkPanel: any = null;
    private _boundHandleOnClick: EventListenerObject = null;

    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0,
            isBookmarkPanelOpen: false
        };
        this._openCloseBookmarkPanel = this.openCloseBookmarkPanel.bind(this);
    }

    /**
     * Open/Close the Bookmark panel
     * @param {any} source - The source element
     */
    private openCloseBookmarkPanel(e: MouseEvent | TouchEvent) {
        // both touchend and click event is fired one after other, 
        // this avoid resetting store in touchend
        /** check if the clicked element is a child of the user details list item. if not close the bookmark window */
        if (this.state.isBookmarkPanelOpen !== undefined &&
            e.type !== 'touchend' &&
            e.target !== undefined && domManager.searchParentNode(e.target, function (el: any) {
            return (el.id === 'bookmark-list-content' || el.id === 'go-back-header');
            }) == null) {
            toolBarActionCreator.isBookmarkSidePanelOpen(!this.state.isBookmarkPanelOpen);
        }
        if (this.state.isBookmarkPanelOpen === false) {
            this.setState({ isBookmarkPanelOpen: true });
        } else {
            if (e.target !== undefined && domManager.searchParentNode(e.target, function (el: any) {
                return (el.id === 'go-back-header' || el.id === 'bookmark-list-content');
                }) == null) {
                this.setState({ isBookmarkPanelOpen: false });
            }
        }
    }

    /**
     * Handle click events outside the bookmark panel
     * @param {any} e - The source element
     */
    private handleClickOutsideElement = (e: MouseEvent | TouchEvent): any => {
        /** check if the clicked element is a child of the user details list item. if not close the bookmark window */
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function(el: any) { return el.id === 'bookmark-toolbar-icon'; }) == null) {
            if (this.state.isBookmarkPanelOpen === true) {
                this.setState({
                    renderedOn: Date.now(),
                    isBookmarkPanelOpen: false
                });
            }

            // both touchend and click event is fired one after other, 
            // this avoid resetting store in touchend
            if (this.state.isBookmarkPanelOpen !== undefined && e.type !== 'touchend') {
                toolBarActionCreator.isBookmarkSidePanelOpen(this.state.isBookmarkPanelOpen);
            }
        }
    };

    /**
     * Subscribe window click event
     */
    public componentDidMount() {
        this._boundHandleOnClick = this.handleClickOutsideElement.bind(this);
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);

        responseStore.instance.addListener(responseStore.ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT, this.reRender);
    }

    /**
     * Unsubscribe window click event
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);

        responseStore.instance.removeListener(responseStore.ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT, this.reRender);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        let svgStyle = {
            pointerEvents: 'none'
        };
        return (
            <li onClick={this._openCloseBookmarkPanel} id='bookmark-toolbar-icon'
                className ={classNames('bookmark-dropdown dropdown-wrap', this.state.isBookmarkPanelOpen ? 'open' : '') }>
                <a href='javascript:void(0);' className='menu-button'
                 title={localeStore.instance.TranslateText('marking.response.left-toolbar.bookmarks-button-tooltip')}
                 id='bookmark-panel'>
                        <span className='svg-icon'>
                            <svg viewBox='0 0 32 32' className='add-bm-mark' style={svgStyle}>
                                <use xlinkHref='#add-bm-mark'>
                                 #shadow-root (closed)
                                <g id='add-bm-mark'></g>
                                </use>
                            </svg>
                        </span>
                        <span className='sprite-icon toolexpand-icon'>
                            {localeStore.instance.TranslateText('marking.response.left-toolbar.bookmarks-button-tooltip')}
                        </span>
                    </a>
                    <BookmarkHolder id='bookmark-holder'
                                    key='bookmark-holder'
                                    selectedLanguage={this.props.selectedLanguage}
                                    bookmarkItems={this.props.bookmarkItems} />
            </li>
        );
    }

    /**
     * This will re-render the component
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now()
        });
    };
}
export = BookmarkIcon;