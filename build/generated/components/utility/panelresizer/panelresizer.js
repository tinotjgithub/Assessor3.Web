"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var markingStore = require('../../../stores/marking/markingstore');
var responseStore = require('../../../stores/response/responsestore');
var markingActionCreator = require('../../../actions/marking/markingactioncreator');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var markSchemeHelper = require('../../../utility/markscheme/markschemehelper');
var deviceHelper = require('../../../utility/touch/devicehelper');
var annotationHelper = require('../annotation/annotationhelper');
var qigStore = require('../../../stores/qigselector/qigstore');
var eventManagerBase = require('../../base/eventmanager/eventmanagerbase');
var eventTypes = require('../../base/eventmanager/eventtypes');
var direction = require('../../base/eventmanager/direction');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var stampActionCreator = require('../../../actions/stamp/stampactioncreator');
var enums = require('../enums');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var classNames = require('classnames');
var constants = require('../constants');
/**
 * Panel resizer component
 */
var PanelResizer = (function (_super) {
    __extends(PanelResizer, _super);
    /**
     * @constructor
     */
    function PanelResizer(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.markingSchemePanelWidth = 0;
        this.enhancedOffpageCommentHeight = 0;
        this.favoriteToolbarPanelOverlapped = false;
        this.offpageCommentHeight = 0;
        this.hasContainerHeightChanged = false;
        /* touch move event for panelResizer */
        this.onTouchMoveHandler = function (event) {
            event.preventDefault();
        };
        /**
         * Called when panelresizer is started dragging
         * @param panelWidthOrHeight
         * @param evt
         */
        this.onPanStart = function (panelWidthOrHeight, evt) {
            _this.resizePanelClassName = 'resizing';
            /*remove the selection from Document (script image) before dragging the resizer*/
            htmlUtilities.removeSelectionFromDocument();
            if (_this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
                _this.startX = evt.center.x;
                var markingSchemePanelWidth = parseFloat(userOptionsHelper.getUserOptionByName(userOptionKeys.MARKSCHEME_PANEL_WIDTH, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId));
                _this._defaultMarkSchemePanelWidth = markingStore.instance.getDefaultPanelWidth();
                if (markingSchemePanelWidth > 0) {
                    _this.markingPanelWidth = annotationHelper.percentToPixelConversion(markingSchemePanelWidth, window.innerWidth);
                }
                else {
                    // panelWidthOrHeight - panel width
                    _this.markingPanelWidth = panelWidthOrHeight;
                }
            }
            else if (_this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment) {
                eCourseworkHelper.pauseVideo();
                _this.startY = evt.center.y;
                _this.onEnhancedoffpageCommentPanStart(panelWidthOrHeight, evt);
            }
            else if (_this.props.resizerType === enums.ResizePanelType.OffPageComment) {
                _this.startY = evt.center.y;
                // Calculating Half of the response script
                _this.markSheetInnerHalfHeight = (((window.innerHeight - constants.COMMON_HEADER_HEIGHT) / 100) * 50);
                var offPageCommentHeight = parseFloat(userOptionsHelper.getUserOptionByName(userOptionKeys.OFFPAGE_COMMENT_PANEL_HEIGHT, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId));
                if (offPageCommentHeight > 0) {
                    _this.offpageCommentHeightOnStart = offPageCommentHeight;
                }
                else {
                    _this.offpageCommentHeightOnStart = panelWidthOrHeight;
                }
            }
            // hide open comment box on starting mark scheme panel resize
            stampActionCreator.showOrHideComment(false);
            // Close Bookmark Name Entry Box
            stampActionCreator.showOrHideBookmarkNameBox(false);
        };
        /**
         * Called when panelresizer is dragging towards left/right
         * @param evt
         */
        this.onPanMove = function (evt) {
            if (_this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
                _this.updatePanelWidth(enums.ResizePanelType.MarkSchemePanel, enums.PanActionType.Move, evt);
            }
            else if (_this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment) {
                var newContainerHeight = _this.enhancedOffpageCommentHeightOnStart - (_this.startY - evt.center.y);
                if (newContainerHeight < _this.markSheetInnerHalfHeight && newContainerHeight > _this.enhancedOffpageCommentMinimumHeight) {
                    _this.enhancedOffpageCommentHeight = newContainerHeight;
                    _this.hasContainerHeightChanged = true;
                    _this.favoriteToolbarPanelOverlapped = _this.enhancedOffpageCommentHeight > _this.annotationPanelholderOffset;
                    _this.heightInPercentage =
                        annotationHelper.pixelsToPercentConversion(_this.enhancedOffpageCommentHeight, _this.marksheetInnerHeight);
                    markingActionCreator.updatePanelHeight(_this.heightInPercentage.toString(), _this.resizePanelClassName, _this.favoriteToolbarPanelOverlapped, enums.PanActionType.Move, enums.ResizePanelType.EnhancedOffPageComment);
                }
            }
            else if (_this.props.resizerType === enums.ResizePanelType.OffPageComment) {
                var newContainerHeight = _this.offpageCommentHeightOnStart + (_this.startY - evt.center.y);
                if (newContainerHeight < _this.markSheetInnerHalfHeight && newContainerHeight > constants.OFFPAGE_COMMENT_MIN_HEIGHT) {
                    _this.offpageCommentHeight = newContainerHeight;
                }
                markingActionCreator.updateOffPageCommentPanelHeight(_this.offpageCommentHeight, enums.PanActionType.Move);
            }
        };
        /**
         * Called when panelresizer is stopped dragging
         * @param event
         */
        this.onPanEnd = function (event) {
            _this.resizePanelClassName = '';
            _this.startX = 0;
            _this.startY = 0;
            if (_this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
                var _defaultMarkSchemePanelWidth = markingStore.instance.getDefaultPanelWidth();
                var miniPanelWidth = markingStore.instance.getMinimumPanelWidth();
                if (_this.markingSchemePanelWidth > parseFloat(_defaultMarkSchemePanelWidth)) {
                    _this.markingSchemePanelWidth = parseFloat(_defaultMarkSchemePanelWidth);
                }
                else if (_this.markingSchemePanelWidth < parseFloat(miniPanelWidth)) {
                    _this.markingSchemePanelWidth = parseFloat(miniPanelWidth);
                }
                //convert pixel to heightInPercentage
                var _markingSchemePanelWidth = annotationHelper.pixelsToPercentConversion(_this.markingSchemePanelWidth, window.innerWidth);
                _this.updatePanelWidth(enums.ResizePanelType.MarkSchemePanel, enums.PanActionType.End, event);
                //update resizing classname
                markingActionCreator.updatePanelResizingClassName(_this.resizePanelClassName);
                // Change and Save the User options.
                userOptionsHelper.save(userOptionKeys.MARKSCHEME_PANEL_WIDTH, _markingSchemePanelWidth.toString(), true, true);
            }
            else if (_this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment) {
                if (_this.hasContainerHeightChanged) {
                    markingActionCreator.updatePanelHeight(_this.heightInPercentage.toString(), _this.resizePanelClassName, _this.favoriteToolbarPanelOverlapped, enums.PanActionType.End, enums.ResizePanelType.EnhancedOffPageComment);
                    userOptionsHelper.save(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT, _this.heightInPercentage.toString(), true);
                }
                _this.hasContainerHeightChanged = false;
            }
            else if (_this.props.resizerType === enums.ResizePanelType.OffPageComment && _this.offpageCommentHeight) {
                markingActionCreator.updateOffPageCommentPanelHeight(_this.offpageCommentHeight, enums.PanActionType.End);
                userOptionsHelper.save(userOptionKeys.OFFPAGE_COMMENT_PANEL_HEIGHT, _this.offpageCommentHeight.toString(), true, true, false, true, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
                var zoomUserOption = userOptionsHelper.getUserOptionByName(userOptionKeys.ZOOM_PREFERENCE, responseStore.instance.markingMethod === enums.MarkingMethod.Structured ?
                    markingStore.instance.selectedQIGExaminerRoleIdOfLoggedInUser :
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
            }
        };
        /**
         * Returns Resizer Id.
         */
        this.getResizerID = function (resizerType) {
            var id;
            switch (resizerType) {
                case enums.ResizePanelType.EnhancedOffPageComment:
                    id = 'enhancedOffPageCommentResizer';
                    break;
                case enums.ResizePanelType.MarkSchemePanel:
                    id = 'markSchemePanelResizer';
                    break;
                case enums.ResizePanelType.OffPageComment:
                    id = 'offPageCommentResizer';
            }
            return id;
        };
        /**
         * Enhanced offpage comment pan start.
         */
        this.onEnhancedoffpageCommentPanStart = function (panelWidthOrHeight, evt) {
            // annotationHolderRect + (padding - headerHeight)
            _this.annotationPanelholderOffset = htmlUtilities.getBoundingClientRect('annotation-panel-holder').top +
                (10 - constants.COMMON_HEADER_HEIGHT);
            _this.marksheetInnerHeight = htmlUtilities.getBoundingClientRect('markSheetContainerInner', true).height;
            // Getting half height of Response screen.
            _this.markSheetInnerHalfHeight = ((_this.marksheetInnerHeight / 100) * 50);
            var enhancedOffPageCommentHeight = parseFloat(userOptionsHelper.getUserOptionByName(userOptionKeys.ENHANCED_OFFPAGE_COMMENT_PANEL_HEIGHT));
            // Set current container height as initial value
            _this.enhancedOffpageCommentHeightOnStart = htmlUtilities.getBoundingClientRect('enhanced-off-page-comments-container', true).height;
            // Mininmum panel height in tabular and detailed views.
            _this.enhancedOffpageCommentMinimumHeight =
                evt.target.parentElement.className === 'enhanced offpage-comment-container detail-view ' ?
                    constants.ENHANCED_OFFPAGE_COMMENT_DETAIL_VIEW_MIN_HEIGHT : constants.ENHANCED_OFFPAGE_COMMENT_TABULAR_VIEW_MIN_HEIGHT;
        };
    }
    /**
     * Render method for Panel resizer.
     */
    PanelResizer.prototype.render = function () {
        // Render the panel resize
        return (React.createElement("div", {id: this.getResizerID(this.props.resizerType), className: classNames('panel-resizer', {
            'horizontal align-bottom': this.props.resizerType === enums.ResizePanelType.EnhancedOffPageComment
        }, {
            'horizontal': this.props.resizerType === enums.ResizePanelType.OffPageComment
        }), ref: 'panelResizer'}, React.createElement("div", {className: 'resizer-icon-holder'}, React.createElement("span", {className: 'resizer-dot'}), React.createElement("span", {className: 'resizer-dot'}), React.createElement("span", {className: 'resizer-dot'}), React.createElement("span", {className: 'resizer-dot'}), React.createElement("span", {className: 'resizer-dot'}))));
    };
    /**
     * Component mounted
     */
    PanelResizer.prototype.componentDidMount = function () {
        this.setUpEvents();
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
        this.getDefaultPanelWidth();
        // Appending the touchmove event handler to the  panelResizer element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.appendEventHandler(this.refs.panelResizer, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isAndroidChrome());
    };
    /**
     * component DidUpdate
     */
    PanelResizer.prototype.componentDidUpdate = function () {
        this.getDefaultPanelWidth();
    };
    /**
     * Component unmounted
     */
    PanelResizer.prototype.componentWillUnmount = function () {
        /* Please do not add any store event listeners here. Please add that in ImageContainer and pass as props to avoid possible
        EventEmitter memory leak node.js warning because this component will repeat based on no of pages */
        this.unRegisterEvents();
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
        // Removing the touchmove event handler to the panelResizer element
        // The passive flag is disabled here if the browser-device combination is Android-Chrome
        // From Chrome 56 onwards, in touch related native events, the preventDefault is by default made as passive
        // Here we are overriding this by disabling the passive flag so that preventDefault shall still work.
        this.removeEventHandler(this.refs.panelResizer, 'touchmove', this.onTouchMoveHandler, htmlUtilities.isAndroidChrome());
    };
    /**
     *  on response mode changed
     */
    PanelResizer.prototype.onResponseChanged = function () {
        // reset the new default panel width when response view is changed
        markingActionCreator.updateDefaultPanelWidth();
    };
    /**
     * Get the default mark scheme panel width
     */
    PanelResizer.prototype.getDefaultPanelWidth = function () {
        if (this.props.resizerType === enums.ResizePanelType.MarkSchemePanel) {
            var defaultPanelWidthFromStore = markingStore.instance.getDefaultPanelWidth();
            var previousMarkListWidth = markingStore.instance.getPreviousMarkListWidth();
            var previousMarkColumnWidth = 0;
            var minimumPanelWidth = 0;
            if (!defaultPanelWidthFromStore) {
                _a = markSchemeHelper.getLongestQuestionItemWidth(this.props.hasPreviousColumn), this.defaultPanelWidth = _a[0], previousMarkColumnWidth = _a[1], minimumPanelWidth = _a[2];
                if (this.defaultPanelWidth > 0) {
                    markingActionCreator.setDefaultPanelWidth(this.defaultPanelWidth + 'px', previousMarkColumnWidth);
                }
                if (minimumPanelWidth > 0) {
                    markingActionCreator.setMinimumPanelWidth(minimumPanelWidth + 'px');
                }
            }
            else {
                var previousMarkColumnWidth_1 = markSchemeHelper.getPreviousMarksColumnnWidth();
                if (this.defaultPanelWidth > 0 && previousMarkListWidth === 0) {
                    markingActionCreator.updateDefaultPanelWidth(this.defaultPanelWidth + previousMarkColumnWidth_1 + 'px');
                }
            }
        }
        var _a;
    };
    /**
     * Hammer Implementation
     */
    PanelResizer.prototype.setUpEvents = function () {
        var element = ReactDom.findDOMNode(this);
        var panel = element.parentElement ? element.parentElement.className : '';
        var renderedSize;
        if (element.parentElement.id === 'markSchemePanel') {
            var parentElement = ReactDom.findDOMNode(element.parentElement);
            renderedSize = parentElement.getBoundingClientRect().width;
        }
        else if (element.parentElement.id === 'enhanced-off-page-comments-container' ||
            element.parentElement.id === 'offpage-comment-container') {
            var parentElement = ReactDom.findDOMNode(element.parentElement);
            renderedSize = parentElement.getBoundingClientRect().height;
        }
        if (element && !this.eventHandler.isInitialized) {
            // we don't want hammer in MS Touch devices like surface because it containes pointer events
            var touchActionValue = 'pan-y tap';
            this.eventHandler.initEvents(element, touchActionValue, true);
            this.eventHandler.get(eventTypes.PAN, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: 0 });
            this.eventHandler.on(eventTypes.PAN_START, this.onPanStart.bind(this, renderedSize));
            this.eventHandler.on(eventTypes.PAN_END, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN_CANCEL, this.onPanEnd);
            this.eventHandler.on(eventTypes.PAN_MOVE, this.onPanMove);
            /** To add classname for panelresizer while click on touch in ipad/surface */
            if (deviceHelper.isTouchDevice()) {
                this.eventHandler.get(eventTypes.PRESS, { direction: direction.DirectionOptions.DIRECTION_ALL, threshold: 0 });
                this.eventHandler.on(eventTypes.PRESS, this.onTouchStart);
            }
        }
    };
    /**
     * unregister events
     */
    PanelResizer.prototype.unRegisterEvents = function () {
        if (this.eventHandler.isInitialized) {
            this.eventHandler.destroy();
        }
    };
    /**
     * onTouchStart
     */
    PanelResizer.prototype.onTouchStart = function () {
        var resizePanelClassName = 'resizing';
        markingActionCreator.updatePanelResizingClassName(this.resizePanelClassName);
    };
    /**
     *  to update the panel width
     */
    PanelResizer.prototype.updatePanelWidth = function (panelType, panActionType, event) {
        var newMarkingPanelWidth = 0;
        newMarkingPanelWidth = this.markingPanelWidth + (this.startX - event.center.x);
        this.markingSchemePanelWidth = newMarkingPanelWidth;
        this.markingSchemePanelWidth = Math.round(this.markingSchemePanelWidth);
        markingActionCreator.updatePanelWidth(this.markingSchemePanelWidth + 'px', this.resizePanelClassName, panelType, panActionType);
    };
    return PanelResizer;
}(eventManagerBase));
module.exports = PanelResizer;
//# sourceMappingURL=panelresizer.js.map