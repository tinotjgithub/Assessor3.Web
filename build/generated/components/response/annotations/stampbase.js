"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReactDom = require('react-dom');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var deviceHelper = require('../../../utility/touch/devicehelper');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var markingStore = require('../../../stores/marking/markingstore');
var enums = require('../../utility/enums');
var stampStore = require('../../../stores/stamp/stampstore');
var EventManagerBase = require('../../base/eventmanager/eventmanagerbase');
var annotationHelper = require('../../utility/annotation/annotationhelper');
var messageStore = require('../../../stores/message/messagestore');
var responseStore = require('../../../stores/response/responsestore');
var userInfoStore = require('../../../stores/userinfo/userinfostore');
var colouredannotationshelper = require('../../../utility/stamppanel/colouredannotationshelper');
var bookMarkHelper = require('../../../stores/marking/bookmarkhelper');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
/**
 * React component class for Text Stamp.
 */
var StampBase = (function (_super) {
    __extends(StampBase, _super);
    /**
     * @constructor
     */
    function StampBase(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.onContextMenu = function (event) {
            // Prevent default right click browser context menu
            event.preventDefault();
            event.stopPropagation();
            // to avoid showing 'RemoveAnnotation' context menu while right clicking
            // on OnpageComment Icon which is already opened
            // Also check if exception panel is open or maximized, then prevent the context menu
            if (!_this.props.bookmarkId &&
                _this.props.clientToken === stampStore.instance.SelectedOnPageCommentClientToken ||
                _this.props.clientToken === stampStore.instance.SelectedSideViewCommentToken ||
                _this.props.clientToken === markingStore.instance.selectedBookmarkClientToken ||
                annotationHelper.isResponseReadOnly()) {
                return;
            }
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
            _this.showOrHideRemoveContextMenu(true, _this.props.clientToken, event.clientX, event.clientY, _this.getAnnotationOverlayWidth(), _this.props.annotationData === undefined ? null : _this.props.annotationData, (_this.props.bookmarkId) ? true : false);
        };
        /**
         * on touch and hold handler
         * @param event
         */
        // This will call from dynamic stamp base, this method is copied to AnnotationOverlay for all other stamp types
        this.onTouchHold = function (event) {
            event.preventDefault();
            if (event.changedPointers && event.changedPointers.length > 0 && !deviceHelper.isMSTouchDevice()) {
                // Pass the currently clicked annotation along with the X and Y because Remove Context menu
                // is under marksheet div and we need to show the context menu at this position
                stampActionCreator.showOrHideComment(false);
                // Close Bookmark Name Entry Box
                stampActionCreator.showOrHideBookmarkNameBox(false);
                _this.showOrHideRemoveContextMenu(true, _this.props.clientToken, event.changedPointers[event.changedPointers.length - 1].clientX, event.changedPointers[event.changedPointers.length - 1].clientY, _this.getAnnotationOverlayWidth(), _this.props.annotationData, (_this.props.bookmarkId) ? true : false);
            }
        };
        /**
         * Updates the status of the comment.
         */
        this.updateCommentStatus = function () {
            if (_this.state.isOpen && stampStore.instance.SelectedSideViewCommentToken !== _this.props.clientToken) {
                _this.setState({
                    isOpen: false
                });
            }
        };
        this.openOrCloseComment = function (isOpen) {
            var isCommentOpen = false;
            // if the comment is selected to close set open is false
            // or if the comment is open set the open value only to those comment
            // which is opened
            if (isOpen) {
                if (stampStore.instance.SelectedOnPageCommentClientToken === _this.props.annotationData.clientToken) {
                    isCommentOpen = true;
                }
            }
            else {
                isCommentOpen = isOpen;
            }
            _this.setState({
                isOpen: isCommentOpen
            });
        };
        /**
         * Get the annotation color
         */
        this.getAnnotationColor = function () {
            return _this.props.annotationData.red + ',' + _this.props.annotationData.green + ',' +
                _this.props.annotationData.blue;
        };
        this.state = {
            renderedOn: 0,
            isVisible: true,
            isOpen: false
        };
        this.onCommentOpenedForUpdate = this.onCommentOpenedForUpdate.bind(this);
    }
    /**
     * Show or hide remove context menu
     * @param isVisible
     * @param currentlySelectedAnnotationToken
     * @param clientX
     * @param clientY
     * @param annotationOverlayWidth
     */
    StampBase.prototype.showOrHideRemoveContextMenu = function (isVisible, currentlySelectedAnnotationToken, clientX, clientY, annotationOverlayWidth, annotationData, isBookMark) {
        //check if exception panel is opened/ maximized
        if (exceptionStore.instance.isExceptionPanelVisible) {
            return;
        }
        /*
         * When we navigate away from response and there are marks to save to db, response screen would be shown untill
         * save marks completed. But Marking progress will be immediately set to false. Then annotation overlay will be hidden.
         * in order to avoid that we need to check where we are navigating as well.navigateTo will only be set when navigating
         * from open or ingarce response
         */
        if ((this.props.clientToken !== undefined
            && this.props.isActive
            && (this.props.isResponseEditable)) || this.props.bookmarkId) {
            // show context menu only if the annotation is for current marking
            if (!this.isPreviousAnnotation) {
                var contextMenuData = void 0;
                contextMenuData = isBookMark ? bookMarkHelper.getContextMenuData(currentlySelectedAnnotationToken, annotationOverlayWidth) :
                    annotationHelper.getContextMenuData(currentlySelectedAnnotationToken, annotationOverlayWidth, annotationData);
                markingActionCreator.showOrHideRemoveContextMenu(isVisible, clientX, clientY, contextMenuData);
            }
        }
    };
    /**
     * checks if the element is an annotation
     * @param element
     */
    StampBase.prototype.checkIfElementIsAnAnnotation = function (element) {
        var elementId = element.id;
        return elementId.indexOf('annotation-wrap') > 0 || elementId.indexOf('svg-icon') > 0;
    };
    /**
     * On Mouse Enter handler
     * @param event
     */
    StampBase.prototype.onMouseEnterHandler = function (event) {
        if ((toolbarStore.instance.panStampId > 0) &&
            !(messageStore.instance.isMessagePanelVisible || exceptionStore.instance.isExceptionPanelVisible) &&
            responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed) {
            markingActionCreator.onAnnotationDraw(false);
        }
        if (this.props.isDisplayingInScript && !this.isPreviousAnnotation) {
            // Hide the SVG from mouse pointer
            responseActionCreator.setMousePosition(-1, -1);
            if (toolbarStore.instance.panStampId > 0) {
                // Get the proper cursor icon from the CSS based on the class
                this.setState({
                    renderedOn: Date.now()
                });
            }
        }
    };
    /**
     * On Mouse Enter handler
     * @param event
     */
    StampBase.prototype.onMouseMoveHandler = function (event) {
        if (!this.isPreviousAnnotation && this.props.isDisplayingInScript) {
            if (this.checkIfElementIsAnAnnotation(event.target)) {
                responseActionCreator.setMousePosition(-1, -1);
            }
            event.preventDefault();
            event.stopPropagation();
        }
    };
    /**
     * trigged when mouse leaves the annotation area
     * @param event
     */
    StampBase.prototype.onMouseLeaveHandler = function (event) {
        markingActionCreator.onAnnotationDraw(true);
    };
    Object.defineProperty(StampBase.prototype, "isStampSelected", {
        /*returns true if a stamp is selected from the toolbar*/
        get: function () {
            return toolbarStore.instance.selectedStampId > 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add listeners
     */
    StampBase.prototype.componentDidMount = function () {
        // Attaching event only if the annotation is onpagecomment, to set open class
        // attribute to indicate comment is open
        if (this.props.annotationData &&
            this.props.stampData &&
            this.props.stampData.stampId === enums.DynamicAnnotation.OnPageComment) {
            stampStore.instance.addListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.openOrCloseComment);
            stampStore.instance.addListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.onCommentOpenedForUpdate);
            // If new comment is added
            if (this.props.annotationData.annotationId === 0 &&
                this.props.annotationData.comment === undefined) {
                this.onEnterCommentSelected(null);
            }
        }
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.updateCommentStatus);
    };
    /**
     * Remove listeners
     */
    StampBase.prototype.componentWillUnmount = function () {
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, this.openOrCloseComment);
        stampStore.instance.removeListener(stampStore.StampStore.INVOKE_ONPAGE_COMMENT, this.onCommentOpenedForUpdate);
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT, this.updateCommentStatus);
    };
    /**
     * Set the selected comment as opened.
     */
    StampBase.prototype.onCommentOpenedForUpdate = function (comment, leftOffset, topOffset, qustionHierarhy, windowsWidth, overlayHeight, overlayWidth, wrapper, isCommentBoxReadOnly, isCommentBoxInActive) {
        this.openOrCloseComment(true);
    };
    /**
     * Get annotation overlay width
     */
    StampBase.prototype.getAnnotationOverlayWidth = function () {
        var element = ReactDom.findDOMNode(this).parentElement;
        // Get parent element i.e. annotation overlay right edge boundary
        if (element !== undefined) {
            element = ReactDom.findDOMNode(element);
            return element.getBoundingClientRect().right;
        }
        return 0;
    };
    Object.defineProperty(StampBase.prototype, "isPreviousAnnotation", {
        /**
         * return true if the annotation is of a remarking
         */
        get: function () {
            return this.props.annotationData !== undefined
                && this.props.annotationData.isPrevious === true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampBase.prototype, "remarkIdPostText", {
        /**
         * return the post id text for an annotation
         */
        get: function () {
            return this.isPreviousAnnotation ?
                '-previous-' + this.props.annotationData.remarkRequestTypeId : '';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open comment edit box while clicking.
     * @param {Event} event
     */
    StampBase.prototype.onEnterCommentSelected = function (e) {
        if (this.props.isActive !== undefined &&
            this.props.stampData.stampId === enums.DynamicAnnotation.OnPageComment) {
            // Preventing markscheme panel gets selected.
            if (e &&
                (!this.isPreviousAnnotation
                    || toolbarStore.instance.selectedStampId === 0)) {
                if (markingStore.instance.selectedBookmarkClientToken) {
                    stampActionCreator.showOrHideBookmarkNameBox(false);
                }
                e.preventDefault();
                e.stopPropagation();
            }
            // If the comment is already open we dont need to trigger to
            // reset the comment. This will ensure that when a new/old comment is already opened
            // and click on the same will persist the commentbox as well as clicking on another comment
            if (this.state.isOpen) {
                return;
            }
            // restrict previous commentbox from opening while stamping an annotation on it.
            if (this.isPreviousAnnotation && toolbarStore.instance.selectedStampId !== 0) {
                return;
            }
            markingActionCreator.showOrHideRemoveContextMenu(false);
            var element = ReactDom.findDOMNode(this);
            var commmentWrapperWidth = 0;
            var editCommentContainerWidth = 187;
            var wrapper = void 0;
            if (element !== undefined) {
                element = ReactDom.findDOMNode(element);
                wrapper = element.getBoundingClientRect();
                this.overlayWidth = element.parentElement.clientWidth + element.parentElement.clientLeft;
                this.overlayHeight = element.parentElement.clientHeight + element.parentElement.clientTop;
                commmentWrapperWidth = element.clientWidth;
                this.windowsWidth = window.innerWidth;
                this.windowsHeight = window.innerHeight;
                var wrappertop = (wrapper.top + editCommentContainerWidth) < this.windowsHeight ?
                    wrapper.top :
                    (wrapper.top - editCommentContainerWidth + commmentWrapperWidth);
                this.left = 100 * ((wrapper.left + commmentWrapperWidth - 58) / this.overlayWidth);
                this.top = 100 * (wrappertop - 60) / this.overlayHeight;
            }
            this.isCommentBoxReadOnly = this.isPreviousAnnotation || !this.props.isActive
                || markingStore.instance.currentResponseMode === enums.ResponseMode.closed
                || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement
                || (markerOperationModeFactory.operationMode.isUnclassifiedTabInStdSetup &&
                    !markerOperationModeFactory.operationMode.isDefinitveMarkingStarted);
            this.isCommentBoxInActive = !this.props.isActive;
            if (this.props.isActive !== undefined) {
                stampActionCreator.editOnPageComment(this.props.annotationData, this.left, this.top, this.props.toolTip, this.windowsWidth, this.overlayWidth, this.overlayHeight, wrapper, this.isCommentBoxReadOnly, this.isCommentBoxInActive);
                this.setState({ isOpen: true });
            }
        }
    };
    /**
     * Restrict Static annotation Placing outside of the response
     * @param wrapperStyle
     */
    StampBase.prototype.getAnnotationWrapperStyle = function (wrapperStyle) {
        var left = 0;
        var top = 0;
        var style = {};
        if (wrapperStyle) {
            // avoid any reference from props or other objects
            style = JSON.parse(JSON.stringify(wrapperStyle));
            left = parseFloat(style.left);
            top = parseFloat(style.top);
            if (left < 0) {
                style.left = '0%';
            }
            if (top < 0) {
                style.top = '0%';
            }
            if (left > 100) {
                style.left = (left - 1) + '%';
            }
            if (top > 100) {
                style.top = (top - 1) + '%';
            }
            var rgb = colouredannotationshelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None).fill;
            style.color = rgb;
            // for Inactive annoataions .
            if (this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView) {
                style.color = colouredannotationshelper.getTintedRgbColor(rgb);
            }
        }
        if (this.props.isInFullResponseView) {
            style.pointerEvents = 'none';
        }
        return style;
    };
    return StampBase;
}(EventManagerBase));
module.exports = StampBase;
//# sourceMappingURL=stampbase.js.map