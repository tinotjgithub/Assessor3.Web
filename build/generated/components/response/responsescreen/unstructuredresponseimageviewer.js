"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var ReactDom = require('react-dom');
var ImageViewerBase = require('./imageviewerbase');
var AnnotationOverlay = require('./annotationoverlay');
var enums = require('../../utility/enums');
var LoadingIndicator = require('../../utility/loadingindicator/loadingindicator');
var localeStore = require('../../../stores/locale/localestore');
var SuppressedPage = require('./suppressedpage');
var bookmarkactioncreator = require('../../../actions/bookmarks/bookmarkactioncreator');
var markingStore = require('../../../stores/marking/markingstore');
var bookmarkhelper = require('../../../stores/marking/bookmarkhelper');
var BookmarkStamp = require('../annotations/bookmarks/bookmarkstamp');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var deviceHelper = require('../../../utility/touch/devicehelper');
var eventTypes = require('../../base/eventmanager/eventtypes');
var responseStore = require('../../../stores/response/responsestore');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var messageStore = require('../../../stores/message/messagestore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var constants = require('../../utility/constants');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var domManager = require('../../../utility/generic/domhelper');
/**
 * React component class for UnStructuredResponseImageViewer
 */
var UnStructuredResponseImageViewer = (function (_super) {
    __extends(UnStructuredResponseImageViewer, _super);
    /**
     * constructor
     */
    function UnStructuredResponseImageViewer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * On tap event fired
         *
         * @private
         * @memberof UnStructuredResponseImageViewer
         */
        this.onTapHandler = function (event) {
            // if click is not allowed due to open panels
            if (_this.isClickDisallowed) {
                return;
            }
            var markSheetElementClientRect = _this.markSheetElement.getBoundingClientRect();
            var left = event.changedPointers[0].clientX - markSheetElementClientRect.left;
            var top = event.changedPointers[0].clientY - markSheetElementClientRect.top;
            left = (left / _this.markSheetElement.clientWidth) * _this.naturalWidth;
            top = (top / _this.markSheetElement.clientHeight) * _this.naturalHeight;
            var bookmark = bookmarkhelper.getBookmarksToAdd(top, left, _this.props.pageNo, _this.props.pageNoWithoutSuppressed);
            // new Bookmark to be added to the marks and annotations collection in markingstore
            bookmarkactioncreator.bookmarkAdded(bookmark);
        };
        /**
         * on touch and hold handler
         * @param event
         */
        this.onTouchHold = function (event) {
            event.srcEvent.stopPropagation();
            event.srcEvent.preventDefault();
            // find the position of pan start for finding stamp element.
            var stampX = event.center.x;
            var stampY = event.center.y;
            // find the stamp element
            var element = htmlUtilities.getElementFromPosition(stampX, stampY);
            var clientToken = element.getAttribute('data-token');
            // The below logic should execute only if we try to remove a bookmark.
            // for other stamps, a separate logic is there. no need to show the remove bookmark context menu.
            if (clientToken && event.target !== undefined &&
                domManager.searchParentNode(event.target, function (el) { return el.id === 'script-bookmark_' + clientToken; })) {
                if (event.changedPointers && event.changedPointers.length > 0 && !deviceHelper.isMSTouchDevice()) {
                    var bookmarkContextMenuData = bookmarkhelper.getContextMenuData(clientToken, _this.markSheetElement.getBoundingClientRect().right);
                    // Pass the currently clicked annotation along with the X and Y because Remove Context menu
                    // is under marksheet div and we need to show the context menu at this position
                    stampActionCreator.showOrHideComment(false);
                    // Close Bookmark Name Entry Box
                    stampActionCreator.showOrHideBookmarkNameBox(false);
                    markingActionCreator.showOrHideRemoveContextMenu(true, event.changedPointers[event.changedPointers.length - 1].clientX, event.changedPointers[event.changedPointers.length - 1].clientY, bookmarkContextMenuData);
                }
            }
        };
        /**
         * Get the Annotation Overlay Element
         */
        this.getMarkSheetElement = function () {
            var element = ReactDom.findDOMNode(_this);
            return element;
        };
        /**
         * Sets the properties of an unstructured response image viewer.
         */
        this.setImagePropertiesForUnstructuredImage = function () {
            var that = _this;
            _this.getImageProperties(_this.props.imageUrl, function (context) {
                that.naturalWidth = context.width;
                that.naturalHeight = context.height;
                that.setState({ renderedOn: Date.now() });
            });
        };
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
    UnStructuredResponseImageViewer.prototype.componentDidUpdate = function () {
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
    };
    /**
     * This function gets invoked when the component will receive props
     */
    UnStructuredResponseImageViewer.prototype.componentWillReceiveProps = function (nxtProps) {
        // This is the simple way to reset the rotate angle for different file content.
        // Otherwise we need to change the state rotateAngle to a property and should maintain it accordingly
        // Since there is a huge impact, we are just setting the state here.
        if (nxtProps.imageUrl !== this.props.imageUrl) {
            this.setPageNumber(nxtProps.pageNo);
            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg
             * or from previous images rotated angle.
             */
            var displayAngle = this.getOriginalDisplayAngle('img_' + nxtProps.pageNo + '_0', true);
            this.setState({ rotateAngle: displayAngle, isAllScriptImageLoaded: false });
        }
    };
    /**
     * Render method of the component
     */
    UnStructuredResponseImageViewer.prototype.render = function () {
        var _this = this;
        var aspectRatio = 0;
        var rotatedAspectRatio = 0;
        var marksheetStyle;
        var wrapperStyle;
        var scalerStyles;
        if (this.props.isECourseworkComponent) {
            var that_1 = this;
            this.getImageProperties(this.props.imageUrl, function (context) {
                that_1.naturalWidth = context.width;
                that_1.naturalHeight = context.height;
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
            return (React.createElement(SuppressedPage, {imageOrder: this.props.imageOrder, showPageNumber: false, isECourseworkComponent: this.props.isECourseworkComponent}));
        }
        else if (this.state.renderedOn === 0) {
            return (React.createElement(LoadingIndicator, {id: enums.BusyIndicatorInvoker.none.toString(), key: enums.BusyIndicatorInvoker.none.toString(), cssClass: 'section-loader loading'}));
        }
        else {
            this.setPageNumber(this.props.pageNo);
            /**
             * To render the response with the saved display angle from the collection rather than starting rotation from 0 deg.
             * This is useful when user comes back from FR view
             */
            var displayAngle = this.getOriginalDisplayAngle('img_' + this.pageNo + '_0');
            var naturalImageHeight = this.props.isECourseworkComponent ? this.naturalHeight : this.props.naturalImageHeight;
            var naturalImageWidth = this.props.isECourseworkComponent ? this.naturalWidth : this.props.naturalImageWidth;
            var biggestRatio = 0;
            if (this.props.hasRotatedImages) {
                biggestRatio = naturalImageHeight / naturalImageWidth;
            }
            else {
                biggestRatio = naturalImageWidth / naturalImageHeight;
            }
            var _pageNo = this.pageNo === undefined ? this.props.pageNo : this.pageNo;
            var bookmarksOnScript = bookmarkhelper.getBookmarkList(this.props.isECourseworkComponent);
            var idCounter_1 = 0;
            var renderBookmarks = null;
            if (bookmarksOnScript && bookmarksOnScript.length > 0) {
                renderBookmarks = bookmarksOnScript.map(function (bookmarkData) {
                    idCounter_1++;
                    if (bookmarkData.pageNo === _this.props.pageNo) {
                        return (React.createElement(BookmarkStamp, {id: 'bookmark_' + idCounter_1, key: 'bookmark' + idCounter_1, toolTip: bookmarkData.comment, bookmarkId: 'script-bookmark_' + bookmarkData.clientToken, isDisplayingInScript: true, isNewBookmark: bookmarkData.clientToken === markingStore.instance.selectedBookmarkClientToken, wrapperStyle: _this.getBoomarkStyle(bookmarkData), selectedLanguage: _this.props.selectedLanguage, isVisible: bookmarkData.markingOperation === enums.MarkingOperation.deleted ? false : true, clientToken: bookmarkData.clientToken, rotatedAngle: annotationHelper.getAngleforRotation(_this.getOriginalDisplayAngle('img_' + _this.pageNo + '_0'))}));
                    }
                    else {
                        return null;
                    }
                });
            }
            // Appending 0 since unstructured doesnt have output page number (to make the ids unique across diff imageviewer)
            var _imgId = 'img_' + this.pageNo + '_0';
            //To Re-calculate the width / height of the response as per the Fit Width/Height user selection
            _a = this.calculateImageStyleOnZoom(this.state.zoomPreference, displayAngle, aspectRatio, rotatedAspectRatio, 0, 0, 0, biggestRatio, this.props.enableCommentsSideView, _imgId, this.marksheetHeight, this.marksheetWidth), marksheetStyle = _a[0], wrapperStyle = _a[1], scalerStyles = _a[2];
            return (React.createElement("div", {className: this.getClassNames(), id: 'img_' + this.pageNo, ref: 'img_' + this.pageNo + '_0', key: 'key_' + this.props.id + this.pageNo, style: marksheetStyle}, React.createElement("div", {className: 'marksheet-holder-inner'}, React.createElement("div", {className: 'scaler-wrapper', style: scalerStyles}), React.createElement("div", {className: 'marksheet-wrapper', style: wrapperStyle, onClick: this.onClickHandler}, React.createElement("div", {id: this.props.id, className: 'marksheet-img', ref: 'marksheet_img_' + _pageNo}, React.createElement("img", {src: this.props.imageUrl, onLoad: this.imageLoaded, alt: localeStore.instance.TranslateText('marking.response.script-images.script-image-tooltip')})), renderBookmarks, this.state.isAllScriptImageLoaded ? (React.createElement(AnnotationOverlay, {outputPageNo: 0, selectedLanguage: this.props.selectedLanguage, imageClusterId: 0, currentOutputImageHeight: this.naturalHeight, currentImageMaxWidth: this.naturalWidth, getMarkSheetContainerProperties: this.props.getMarkSheetContainerProperties, pageNo: parseInt(this.pageNo), id: 'annotationOverlay' + this.props.id + this.pageNo, key: 'annotationOverlay' + this.props.id + this.pageNo, isDrawStart: this.props.isDrawStart, renderedOn: this.props.renderedOn, displayAngle: displayAngle, zoomPreference: this.state.isFitHeight, isResponseEditable: this.props.isResponseEditable, enableImageContainerScroll: this.props.enableImageContainerScroll, currentImageNaturalWidth: this.naturalWidth, enableCommentsSideView: this.props.enableCommentsSideView, getImageNaturalDimension: this.props.getImageNaturalDimension, refreshCommnetContainer: this.props.refreshCommnetContainer})) : null))));
        }
        var _a;
    };
    /**
     * Set the props if image loaded.
     */
    UnStructuredResponseImageViewer.prototype.imageLoaded = function () {
        var _this = this;
        // Split the url and get the page No. For identifying the element
        var pageNo = this.props.imageUrl.split('/')[9];
        // for non convertable files, pageNo is undefined, so use this.props.pageNo
        pageNo = pageNo === undefined ? this.props.pageNo : pageNo;
        this.getImageProperties(this.props.imageUrl, function (x) {
            var imageElement = ReactDom.findDOMNode(_this.refs['marksheet_img_' + pageNo]);
            if (imageElement) {
                _this.props.onImageLoaded(parseInt(pageNo), imageElement.top, x.naturalWidth, imageElement.clientWidth, x.naturalHeight);
                _this.setState({ isAllScriptImageLoaded: true });
            }
        });
    };
    /**
     * set page number property
     */
    UnStructuredResponseImageViewer.prototype.setPageNumber = function (pageNo) {
        // Split the url and get the page No. For identifying the element
        this.pageNo = this.props.imageUrl.split('/')[9];
        // for non convertable files, pageNo is undefined, so use this.props.pageNo
        this.pageNo = this.pageNo === undefined ? pageNo.toString() : this.pageNo;
    };
    /**
     * Hammer Implementation
     */
    UnStructuredResponseImageViewer.prototype.setUpHammer = function () {
        /* for current annotations only we need to attach hammer */
        /** To perform move functionality the parent span is attached with the hammer events */
        var element = this.getMarkSheetElement();
        if (element && this.state.isAllScriptImageLoaded === true) {
            var touchActionValue = deviceHelper.isTouchDevice() && !deviceHelper.isMSTouchDevice() ? 'auto' : 'none';
            this.eventHandler.initEvents(element, touchActionValue, true);
            if (htmlUtilities.isTabletOrMobileDevice) {
                if (toolbarStore.instance.isBookMarkSelected) {
                    this.eventHandler.on(eventTypes.TAP, this.onTapHandler);
                }
                this.eventHandler.get(eventTypes.PRESS, { time: UnStructuredResponseImageViewer.PRESS_TIME_DELAY });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchHold);
            }
        }
    };
    Object.defineProperty(UnStructuredResponseImageViewer.prototype, "isClickDisallowed", {
        /* return true if click handler is enabled */
        get: function () {
            return (!toolbarStore.instance.isBookMarkSelected ||
                responseStore.instance.isZoomOptionOpen ||
                userInfoStore.instance.isUserInfoPanelOpen ||
                responseStore.instance.isMarkByOptionOpen ||
                exceptionStore.instance.isExceptionSidePanelOpen ||
                toolbarStore.instance.isBookMarkPanelOpen ||
                messageStore.instance.isMessageSidePanelOpen);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * called on stamping of a selected new bookmark in script
     * @param event on click event when a bookmark is stamped
     */
    UnStructuredResponseImageViewer.prototype.onClickHandler = function (event) {
        // if click is not allowed due to open panels
        if (this.isClickDisallowed) {
            return;
        }
        var annotationHolderElement = this.markSheetElement.getElementsByClassName('annotation-holder')[0];
        var markSheetElementClientRect = annotationHolderElement.getBoundingClientRect();
        var left = event.clientX - markSheetElementClientRect.left;
        var top;
        var angle = annotationHelper.getAngleforRotation(this.getOriginalDisplayAngle('img_' + this.pageNo + '_0'));
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
        var bookmark = bookmarkhelper.getBookmarksToAdd(top, left, this.props.pageNo, this.props.pageNoWithoutSuppressed);
        // new Bookmark to be added to the marks and annotations collection in markingstore
        bookmarkactioncreator.bookmarkAdded(bookmark);
    };
    /**
     * get the style for the bookmark wrap
     * @param bookmark bookmark data
     */
    UnStructuredResponseImageViewer.prototype.getBoomarkStyle = function (bookmark) {
        var bookmarkStyle = {};
        // Set the top value for bookmark in UI
        bookmarkStyle.top = (100 * (bookmark.top / this.naturalHeight)) + '%';
        return bookmarkStyle;
    };
    /**
     * Hammer destroy
     */
    UnStructuredResponseImageViewer.prototype.destroyHammer = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    // Set press time delay by 0.5 sec
    UnStructuredResponseImageViewer.PRESS_TIME_DELAY = 500;
    return UnStructuredResponseImageViewer;
}(ImageViewerBase));
module.exports = UnStructuredResponseImageViewer;
//# sourceMappingURL=unstructuredresponseimageviewer.js.map