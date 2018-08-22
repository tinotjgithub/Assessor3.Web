/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
import ImageViewerBase = require('./imageviewerbase');
import AnnotationOverlay = require('./annotationoverlay');
import BusyIndicator = require('../../utility/busyindicator/busyindicator');
import enums = require('../../utility/enums');
import LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
import localeStore = require('../../../stores/locale/localestore');
import SuppressedPage = require('./suppressedpage');
import bookmarkactioncreator = require('../../../actions/bookmarks/bookmarkactioncreator');
import bookmark = require('../../../stores/response/typings/bookmark');
import markingStore = require('../../../stores/marking/markingstore');
import bookmarkhelper = require('../../../stores/marking/bookmarkhelper');
import bookmarkComponentWrapper = require('../../../stores/marking/bookmarkcomponentwrapper');
import BookmarkStamp = require('../annotations/bookmarks/bookmarkstamp');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');
import ecourseworkfilestore = require('../../../stores/response/digital/ecourseworkfilestore');
import deviceHelper = require('../../../utility/touch/devicehelper');
import eventTypes = require('../../base/eventmanager/eventtypes');
import toolbarActionCreator = require('../../../actions/toolbar/toolbaractioncreator');
import responseStore = require('../../../stores/response/responsestore');
import userInfoStore = require('../../../stores/userinfo/userinfostore');
import exceptionStore = require('../../../stores/exception/exceptionstore');
import messageStore = require('../../../stores/message/messagestore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import responsestore = require('../../../stores/response/responsestore');
import constants = require('../../utility/constants');
import stampActionCreator = require('../../../actions/stamp/stampactioncreator');
import markingActionCreator = require('../../../actions/marking/markingactioncreator');
import annotationHelper = require('../../utility/annotation/annotationhelper');
import domManager = require('../../../utility/generic/domhelper');

interface Props extends PropsBase, LocaleSelectionBase, PropsAnnotationOverlay {
    imageUrl: string;
    onImageLoaded: Function;
    onMouseMove: Function;
    zoomPreference: enums.ZoomPreference;
    switchViewCallback: Function;
    imageOrder: number;
    pageNo: number;
    isResponseEditable: boolean;
    enableImageContainerScroll: Function;
    enableCommentBox: boolean;
    naturalImageWidth: number;
    naturalImageHeight: number;
    hasRotatedImages: number;
    enableCommentsSideView: boolean;
    onScrollForZoom: Function;
    isECourseworkComponent: boolean;
    getImageNaturalDimension?: Function;
    refreshCommnetContainer: Function;
    pageNoWithoutSuppressed: number;
    setScrollPositionCallback?: Function;
    marksheetContainerHeight: number;
    marksheetContainerWidth: number;
}

interface State {
    renderedOn: number;
    rotateAngle?: number;
    zoomPreference?: enums.ZoomPreference;
    nonConvertableImageLoaded?: boolean;
    isAllScriptImageLoaded: boolean;
    markSheetDimensionChangedOn?: number;
}

/**
 * React component class for UnStructuredResponseImageViewer
 */
class UnStructuredResponseImageViewer extends ImageViewerBase {
    private naturalWidth: number;
    private naturalHeight: number;
    // Set press time delay by 0.5 sec
    private static PRESS_TIME_DELAY: number = 500;

    // To check whether or not to set the image properties.
    private setImageProperties: boolean;

    /**
     * constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.setImageProperties = true;
        this.state = {
            renderedOn: 0,
            rotateAngle: 0,
            zoomPreference: this.props.zoomPreference,
            nonConvertableImageLoaded: false,
            isAllScriptImageLoaded: false,
            markSheetDimensionChangedOn: 0
        };

        this.markingMethod = enums.MarkingMethod.Unstructured;
        this.imageLoaded = this.imageLoaded.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    /**
     * This function gets invoked when the component is about to be updated.
     */
    public componentDidUpdate() {
        this.markSheetElement = this.getMarkSheetElement();
        this.checkForMarksheetDimensionChange(this.markSheetElement);
        /* We don't get the image element in did mount to set up hammer events.
          So setting the same in didupdate only when all the scripts are loaded and the handler is not initilaized */
        if (!this.eventHandler.isInitialized) {
            this.setUpHammer();
        }

        if (this.setImageProperties) {
            // Sets the image properties oncce after first render.
            this.setImagePropertiesForUnstructuredImage();
            this.setImageProperties = false;
        }
    }

    /**
     * This function gets invoked when the component will receive props
     */
    public componentWillReceiveProps(nxtProps: Props): void {

        // This is the simple way to reset the rotate angle for different file content.
        // Otherwise we need to change the state rotateAngle to a property and should maintain it accordingly
        // Since there is a huge impact, we are just setting the state here.
        if (nxtProps.imageUrl !== this.props.imageUrl) {

            this.setPageNumber(nxtProps.pageNo);

            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg
             * or from previous images rotated angle.
             */
            let displayAngle = this.getOriginalDisplayAngle('img_' + nxtProps.pageNo + '_0', true);
            this.setState({ rotateAngle: displayAngle, isAllScriptImageLoaded: false });
        }
    }

    /**
     * Render method of the component
     */
    public render(): JSX.Element {
        let aspectRatio: number = 0;
        let rotatedAspectRatio: number = 0;
        let marksheetStyle: React.CSSProperties;
        let wrapperStyle: React.CSSProperties;
        let scalerStyles: React.CSSProperties;

        if (this.props.isECourseworkComponent) {
            let that = this;
            this.getImageProperties(this.props.imageUrl, function (context: any) {
                that.naturalWidth = context.width;
                that.naturalHeight = context.height;
            });
        }

        this.marksheetContainerHeight = this.props.marksheetContainerHeight;
        this.marksheetContainerWidth = this.props.marksheetContainerWidth;

        aspectRatio = this.naturalWidth / this.naturalHeight;

        //Settig the min height to 0 if sideview comment is not enabled
        if (this.props.enableCommentBox === false) {
            this.marksheetHolderMinHeight = 0;
        }

        rotatedAspectRatio = this.naturalHeight / this.naturalWidth;
        // url is empty if this is a suppressed page. This is shown in booklet view
        if (this.props.imageUrl === '') {
            return (
                <SuppressedPage
                    imageOrder={this.props.imageOrder}
                    showPageNumber={false}
                    isECourseworkComponent={this.props.isECourseworkComponent} />
            );
        } else if (this.state.renderedOn === 0) {
            return (
                <LoadingIndicator id={enums.BusyIndicatorInvoker.none.toString()}
                    key={enums.BusyIndicatorInvoker.none.toString()} cssClass='section-loader loading' />
            );
        } else {

            this.setPageNumber(this.props.pageNo);

            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg.
             * This is useful when user comes back from FR view
             */
            let displayAngle = this.getOriginalDisplayAngle('img_' + this.pageNo + '_0');

            let naturalImageHeight = this.props.isECourseworkComponent ? this.naturalHeight : this.props.naturalImageHeight;
            let naturalImageWidth = this.props.isECourseworkComponent ? this.naturalWidth : this.props.naturalImageWidth;

            let biggestRatio: number = 0;
            if (this.props.hasRotatedImages) {
                biggestRatio = naturalImageHeight / naturalImageWidth;
            } else {
                biggestRatio = naturalImageWidth / naturalImageHeight;
            }

            let _pageNo = this.pageNo === undefined ? this.props.pageNo : this.pageNo;
            let bookmarksOnScript: Array<bookmarkComponentWrapper> = bookmarkhelper.getBookmarkList(this.props.isECourseworkComponent);
            let idCounter: number = 0;
            let renderBookmarks: JSX.Element[] = null;
            if (bookmarksOnScript && bookmarksOnScript.length > 0) {
                renderBookmarks = bookmarksOnScript.map(
                    (bookmarkData: bookmarkComponentWrapper) => {
                        idCounter++;
                        if (bookmarkData.pageNo === this.props.pageNo) {
                            return (
                                <BookmarkStamp
                                    id={'bookmark_' + idCounter}
                                    key={'bookmark' + idCounter}
                                    toolTip={bookmarkData.comment}
                                    bookmarkId={'script-bookmark_' + bookmarkData.clientToken}
                                    isDisplayingInScript={true}
                                    isNewBookmark={bookmarkData.clientToken === markingStore.instance.selectedBookmarkClientToken}
                                    wrapperStyle={this.getBoomarkStyle(bookmarkData)}
                                    selectedLanguage={this.props.selectedLanguage}
                                    isVisible={bookmarkData.markingOperation === enums.MarkingOperation.deleted ? false : true}
                                    clientToken={bookmarkData.clientToken}
                                    rotatedAngle={annotationHelper.getAngleforRotation
                                        (this.getOriginalDisplayAngle('img_' + this.pageNo + '_0'))} />
                            );
                        } else {
                            return null;
                        }
                    });
            }
            // Appending 0 since unstructured doesnt have output page number (to make the ids unique across diff imageviewer)
            let _imgId: string = 'img_' + this.pageNo + '_0';
            //To Re-calculate the width / height of the response as per the Fit Width/Height user selection
            [marksheetStyle, wrapperStyle, scalerStyles] = this.calculateImageStyleOnZoom(this.state.zoomPreference,
                displayAngle, aspectRatio, rotatedAspectRatio, 0, 0, 0, biggestRatio, this.props.enableCommentsSideView, _imgId,
                this.marksheetHeight, this.marksheetWidth);
            return (
                <div className={this.getClassNames()}
                    id={'img_' + this.pageNo}
                    ref={'img_' + this.pageNo + '_0'}
                    key={'key_' + this.props.id + this.pageNo}
                    style={marksheetStyle}>
                    <div className='marksheet-holder-inner'>
                        <div className='scaler-wrapper' style={scalerStyles}></div>
                        <div className='marksheet-wrapper' style={wrapperStyle} onClick={this.onClickHandler}>
                            <div id={this.props.id} className='marksheet-img' ref={'marksheet_img_' + _pageNo}>
                                <img src={this.props.imageUrl} onLoad={this.imageLoaded}
                                    alt={localeStore.instance.TranslateText('marking.response.script-images.script-image-tooltip')} />
                            </div>
                            {renderBookmarks}
                            {this.state.isAllScriptImageLoaded ? (
                                <AnnotationOverlay outputPageNo={0}
                                    selectedLanguage={this.props.selectedLanguage}
                                    imageClusterId={0}
                                    currentOutputImageHeight={this.naturalHeight}
                                    currentImageMaxWidth={this.naturalWidth}
                                    getMarkSheetContainerProperties={this.props.getMarkSheetContainerProperties}
                                    pageNo={parseInt(this.pageNo)}
                                    id={'annotationOverlay' + this.props.id + this.pageNo}
                                    key={'annotationOverlay' + this.props.id + this.pageNo}
                                    isDrawStart={this.props.isDrawStart}
                                    renderedOn={this.props.renderedOn}
                                    displayAngle={displayAngle}
                                    zoomPreference={this.state.isFitHeight}
                                    isResponseEditable={this.props.isResponseEditable}
                                    enableImageContainerScroll={this.props.enableImageContainerScroll}
                                    currentImageNaturalWidth={this.naturalWidth}
                                    enableCommentsSideView={this.props.enableCommentsSideView}
                                    getImageNaturalDimension={this.props.getImageNaturalDimension}
                                    refreshCommnetContainer={this.props.refreshCommnetContainer} />) : null}
                        </div>
                    </div>
                </div>);
        }
    }

    /**
     * Set the props if image loaded.
     */
    private imageLoaded(): void {
        // Split the url and get the page No. For identifying the element
        let pageNo: string = this.props.imageUrl.split('/')[9];

        // for non convertable files, pageNo is undefined, so use this.props.pageNo
        pageNo = pageNo === undefined ? this.props.pageNo : pageNo;

        this.getImageProperties(this.props.imageUrl, (x: any) => {
            let imageElement = ReactDom.findDOMNode(this.refs['marksheet_img_' + pageNo]) as any;
            if (imageElement) {
                this.props.onImageLoaded(parseInt(pageNo), imageElement.top, x.naturalWidth, imageElement.clientWidth, x.naturalHeight);
                this.setState({ isAllScriptImageLoaded: true });
            }
        });
    }


    /**
     * set page number property
     */
    private setPageNumber(pageNo: number): void {

        // Split the url and get the page No. For identifying the element
        this.pageNo = this.props.imageUrl.split('/')[9];

        // for non convertable files, pageNo is undefined, so use this.props.pageNo
        this.pageNo = this.pageNo === undefined ? pageNo.toString() : this.pageNo;

    }

    /**
     * Hammer Implementation
     */
    protected setUpHammer() {
        /* for current annotations only we need to attach hammer */

        /** To perform move functionality the parent span is attached with the hammer events */
        let element = this.getMarkSheetElement();
        if (element && this.state.isAllScriptImageLoaded === true) {
            let touchActionValue: string = deviceHelper.isTouchDevice() && !deviceHelper.isMSTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(element, touchActionValue, true);
            if (htmlUtilities.isTabletOrMobileDevice) {
                if (toolbarStore.instance.isBookMarkSelected) {
                    this.eventHandler.on(eventTypes.TAP, this.onTapHandler);
                }
                this.eventHandler.get(eventTypes.PRESS, { time: UnStructuredResponseImageViewer.PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchHold);
            }
        }
    }

    /**
     * On tap event fired
     *
     * @private
     * @memberof UnStructuredResponseImageViewer
     */
    private onTapHandler = (event: TouchEvent) => {
        // if click is not allowed due to open panels
        if (this.isClickDisallowed) {
            return;
        }

        let markSheetElementClientRect = this.markSheetElement.getBoundingClientRect();
        let left = event.changedPointers[0].clientX - markSheetElementClientRect.left;
        let top = event.changedPointers[0].clientY - markSheetElementClientRect.top;
        left = (left / this.markSheetElement.clientWidth) * this.naturalWidth;
        top = (top / this.markSheetElement.clientHeight) * this.naturalHeight;

        let bookmark: bookmark = bookmarkhelper.getBookmarksToAdd(top, left, this.props.pageNo, this.props.pageNoWithoutSuppressed);

        // new Bookmark to be added to the marks and annotations collection in markingstore
        bookmarkactioncreator.bookmarkAdded(bookmark);
    }

    /**
     * on touch and hold handler
     * @param event
     */
    protected onTouchHold = (event: EventCustom) => {
        event.srcEvent.stopPropagation();
        event.srcEvent.preventDefault();
        // find the position of pan start for finding stamp element.
        let stampX: number = event.center.x;
        let stampY: number = event.center.y;

        // find the stamp element
        let element: any = htmlUtilities.getElementFromPosition(stampX, stampY);

        let clientToken: string = element.getAttribute('data-token');

        // The below logic should execute only if we try to remove a bookmark.
        // for other stamps, a separate logic is there. no need to show the remove bookmark context menu.
        if (clientToken && event.target !== undefined && !annotationHelper.isResponseReadOnly() &&
            domManager.searchParentNode(event.target, function (el: any) { return el.id === 'script-bookmark_' + clientToken; })) {
            if (event.changedPointers && event.changedPointers.length > 0 && !deviceHelper.isMSTouchDevice()) {
                let bookmarkContextMenuData = bookmarkhelper.getContextMenuData(clientToken,
                    this.markSheetElement.getBoundingClientRect().right);
                // Pass the currently clicked annotation along with the X and Y because Remove Context menu
                // is under marksheet div and we need to show the context menu at this position
                stampActionCreator.showOrHideComment(false);
                // Close Bookmark Name Entry Box
                stampActionCreator.showOrHideBookmarkNameBox(false);
                markingActionCreator.showOrHideRemoveContextMenu(true, event.changedPointers[event.changedPointers.length - 1].clientX,
                    event.changedPointers[event.changedPointers.length - 1].clientY, bookmarkContextMenuData);
            }
        }
    };

    /* return true if click handler is enabled */
    private get isClickDisallowed(): boolean {
        return (!toolbarStore.instance.isBookMarkSelected ||
            responseStore.instance.isZoomOptionOpen ||
            userInfoStore.instance.isUserInfoPanelOpen ||
            responseStore.instance.isMarkByOptionOpen ||
            exceptionStore.instance.isExceptionSidePanelOpen ||
            toolbarStore.instance.isBookMarkPanelOpen ||
            messageStore.instance.isMessageSidePanelOpen);
    }

    /**
     * called on stamping of a selected new bookmark in script
     * @param event on click event when a bookmark is stamped
     */
    private onClickHandler(event: any) {
        // if click is not allowed due to open panels
        if (this.isClickDisallowed) {
            return;
        }

        let annotationHolderElement = this.markSheetElement.getElementsByClassName('annotation-holder')[0];
        let markSheetElementClientRect = annotationHolderElement.getBoundingClientRect();
        let left = event.clientX - markSheetElementClientRect.left;
        let top: number;
        var angle: enums.RotateAngle = annotationHelper.getAngleforRotation
            (this.getOriginalDisplayAngle('img_' + this.pageNo + '_0'));

        switch (angle) {
            case enums.RotateAngle.Rotate_180:
                top = markSheetElementClientRect.bottom - (event.clientY + constants.BOOKMARK_SVG_SCALE);
                break;
            case enums.RotateAngle.Rotate_270:
                top = (event.clientX - constants.BOOKMARK_SVG_WIDTH) - markSheetElementClientRect.left;
                break;
            case enums.RotateAngle.Rotate_90:
                top = markSheetElementClientRect.right - (event.clientX + constants.BOOKMARK_SVG_WIDTH);
                break;
            default:
                top = (event.clientY - constants.BOOKMARK_SVG_SCALE) - markSheetElementClientRect.top;
                break;
        }

        // Don't allow bookmark to be added on the edges of the script image
        if ((top + (2 * constants.BOOKMARK_SVG_SCALE)) >
            annotationHolderElement.clientHeight) {
            return;
        }

        left = (left / annotationHolderElement.clientWidth) * this.naturalWidth;
        top = (top / annotationHolderElement.clientHeight) * this.naturalHeight;

        let bookmark: bookmark = bookmarkhelper.getBookmarksToAdd(top, left, this.props.pageNo, this.props.pageNoWithoutSuppressed);

        // new Bookmark to be added to the marks and annotations collection in markingstore
        bookmarkactioncreator.bookmarkAdded(bookmark);
    }

    /**
     * get the style for the bookmark wrap
     * @param bookmark bookmark data
     */
    private getBoomarkStyle(bookmark: bookmarkComponentWrapper): React.CSSProperties {
        let bookmarkStyle: React.CSSProperties = {};

        // Set the top value for bookmark in UI
        bookmarkStyle.top = (100 * (bookmark.top / this.naturalHeight)) + '%';

        return bookmarkStyle;
    }

    /**
     * Get the Annotation Overlay Element
     */
    protected getMarkSheetElement = (): Element => {
        let element: Element = ReactDom.findDOMNode(this);
        return element;
    };

    /**
     * Hammer destroy
     */
    protected destroyHammer() {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    }

    /**
     * Sets the properties of an unstructured response image viewer.
     */
    private setImagePropertiesForUnstructuredImage = () => {
        let that = this;
        this.getImageProperties(this.props.imageUrl, function (context: any) {
            that.naturalWidth = context.width;
            that.naturalHeight = context.height;
            that.setState({ renderedOn: Date.now() });
        });
    }
}

export = UnStructuredResponseImageViewer;