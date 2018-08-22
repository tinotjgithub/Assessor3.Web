"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var stampStore = require('../../../../stores/stamp/stampstore');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
var responseStore = require('../../../../stores/response/responsestore');
var ImageStamp = require('../../annotations/static/imagestamp');
var DynamicStamp = require('../../toolbar/stamppanel/stamptype/dynamicstamp');
var TextStamp = require('../../annotations/static/textstamp');
var ToolsStamp = require('../../annotations/static/toolsstamp');
var enums = require('../../../utility/enums');
var htmlUtilities = require('../../../../utility/generic/htmlutilities');
var messageStore = require('../../../../stores/message/messagestore');
var exceptionStore = require('../../../../stores/exception/exceptionstore');
var BookmarkStamp = require('../../annotations/bookmarks/bookmarkstamp');
var qigStore = require('../../../../stores/qigselector/qigstore');
var constants = require('../../../utility/constants');
var classNames = require('classnames');
/**
 * React component class for stamp cursor.
 */
var StampCursor = (function (_super) {
    __extends(StampCursor, _super);
    // private isAddNewBookmarkSelected: boolean = false;
    /**
     * Constructor
     * @param props
     * @param state
     */
    function StampCursor(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.onMousePositionUpdated = function () {
            if (((_this.props.cursorType === enums.CursorType.Pan
                && toolbarStore.instance.panStampId === 0)
                ||
                    (_this.props.cursorType === enums.CursorType.Select
                        && (toolbarStore.instance.selectedStampId === 0
                            || toolbarStore.instance.panStampId !== 0))) && !toolbarStore.instance.isBookMarkSelected) {
                // No need to set state in these scenarios.
                return;
            }
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Invoked on starting the stamp pan
         */
        this.onStampPanStart = function () {
            _this.setState({ renderedOn: Date.now() });
        };
        /**
         * Invoked on ending the stamp pan
         */
        this.onStampPanEnd = function () {
            if (_this.props.cursorType === enums.CursorType.Pan) {
                _this.setState({ renderedOn: Date.now() + 100 });
            }
            else {
                _this.setState({ renderedOn: Date.now() });
            }
        };
        /*
         * Called when a bookmark is placed on the script
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * Component did mount
     */
    StampCursor.prototype.componentDidMount = function () {
        responseStore.instance.addListener(responseStore.ResponseStore.MOUSE_POSITION_UPDATED_EVENT, this.onMousePositionUpdated);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PAN, this.onStampPanStart);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_END, this.onStampPanEnd);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT, this.reRender);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.reRender);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_CANCEL, this.onStampPanEnd);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.DE_SELECT_ANNOTATION_EVENT, this.reRender);
    };
    /**
     * Component will unmount
     */
    StampCursor.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.MOUSE_POSITION_UPDATED_EVENT, this.onMousePositionUpdated);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PAN, this.onStampPanStart);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.onStampPanEnd);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT, this.reRender);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.reRender);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_CANCEL, this.onStampPanEnd);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.DE_SELECT_ANNOTATION_EVENT, this.reRender);
    };
    /**
     * Render component
     * @returns
     */
    StampCursor.prototype.render = function () {
        // If it is tablet/mobile devices,no need to render the cursor for stamp action.
        if (this.props.cursorType === enums.CursorType.Select) {
            if (htmlUtilities.isTabletOrMobileDevice
                || toolbarStore.instance.panStampId !== 0) {
                return null;
            }
        }
        if (responseStore.instance.selectedResponseMode === enums.ResponseMode.closed) {
            return null;
        }
        var cursorDivStyle = this.getCursorDivStyle();
        var cursorStyle = this.getCursorStyle();
        var stampId = this.getStampId();
        var style;
        if (toolbarStore.instance.isBookMarkSelected && this.props.cursorType !== enums.CursorType.Pan) {
            style = { 'width': constants.BOOKMARK_SVG_STYLE };
        }
        return (React.createElement("div", {id: this.props.cursorType === enums.CursorType.Pan ? 'dragCursor' : 'cursor', className: this.getCursorClass()}, React.createElement("div", {className: cursorStyle, style: style}, (toolbarStore.instance.isBookMarkSelected && this.props.cursorType !== enums.CursorType.Pan) ?
            this.renderBookmark(cursorDivStyle) :
            this.renderStamp(stampStore.instance.getStamp(stampId), cursorDivStyle))));
    };
    /**
     * gets the class name for the cursor
     */
    StampCursor.prototype.getCursorClass = function () {
        return (this.props.cursorType === enums.CursorType.Pan ? 'drag-cursor-holder' : 'stamp-cursor-holder') +
            ' cursor-holder ' + this.getAnnotationClass();
    };
    /**
     * gets the glassname for the cursor
     */
    StampCursor.prototype.renderBookmark = function (cursorDivStyle) {
        if (this.props.cursorType === enums.CursorType.Pan) {
            return null;
        }
        else {
            return (React.createElement(BookmarkStamp, {id: 'select-bm-icon', key: 'select-bm-icon', isDisplayingInScript: false, isNewBookmark: false, selectedLanguage: this.props.selectedLanguage, leftPos: cursorDivStyle.left, topPos: cursorDivStyle.top, isVisible: true}));
        }
    };
    /**
     * Create stamp based on the stamp data
     * @param groupIndex
     */
    StampCursor.prototype.renderStamp = function (stampData, cursorDivStyle) {
        if (stampData != null && stampData !== undefined) {
            switch (stampData.stampType) {
                case enums.StampType.image:
                    return (React.createElement(ImageStamp, {id: stampData.name + '-icon', toolTip: stampData.displayName, key: stampData.name + '-icon', stampData: stampData, isDisplayingInScript: false, selectedLanguage: this.props.selectedLanguage, leftPos: cursorDivStyle.left, topPos: cursorDivStyle.top, isVisible: true}));
                case enums.StampType.dynamic:
                    return (React.createElement(DynamicStamp, {id: stampData.name + '-icon', toolTip: stampData.displayName, key: stampData.name + '-icon', stampData: stampData, isDisplayingInScript: false, selectedLanguage: this.props.selectedLanguage, leftPos: cursorDivStyle.left, topPos: cursorDivStyle.top, isVisible: true}));
                case enums.StampType.text:
                    return (React.createElement(TextStamp, {id: stampData.name + '-icon', toolTip: stampData.displayName, key: stampData.name + '-icon', stampData: stampData, isDisplayingInScript: false, selectedLanguage: this.props.selectedLanguage, leftPos: cursorDivStyle.left, topPos: cursorDivStyle.top, isVisible: true}));
                case enums.StampType.tools:
                    return (React.createElement(ToolsStamp, {id: stampData.name + '-icon', toolTip: stampData.displayName, key: stampData.name + '-icon', stampData: stampData, isDisplayingInScript: false, selectedLanguage: this.props.selectedLanguage, leftPos: cursorDivStyle.left, topPos: cursorDivStyle.top, isVisible: true}));
            }
        }
        return null;
    };
    /**
     * getCursorDivStyle
     */
    StampCursor.prototype.getCursorDivStyle = function () {
        var mousePosition = responseStore.instance.mousePosition;
        return {
            'top': mousePosition.yPosition,
            'left': mousePosition.xPosition
        };
    };
    /**
     * Returns the cursor style corresponding to the action invoked.
     */
    StampCursor.prototype.getCursorStyle = function () {
        return this.props.cursorType === enums.CursorType.Pan ? 'cursor-drag' : 'cursor';
    };
    /**
     * Returns the stamp id corresponding to the action invoked.
     */
    StampCursor.prototype.getStampId = function () {
        return this.props.cursorType === enums.CursorType.Pan ? toolbarStore.instance.panStampId
            : toolbarStore.instance.selectedStampId;
    };
    Object.defineProperty(StampCursor.prototype, "isMessageOrExceptionPanelOpen", {
        /**
         * returns true if message or exception panel is in open state
         */
        get: function () {
            return messageStore.instance.isMessagePanelVisible ||
                exceptionStore.instance.isExceptionPanelVisible;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * getAnnotationClass
     */
    StampCursor.prototype.getAnnotationClass = function () {
        if (qigStore.instance.isAcetateMoving ||
            (responseStore.instance.mousePosition.xPosition <= 0 && responseStore.instance.mousePosition.yPosition <= 0)) {
            return '';
        }
        else if (this.props.cursorType === enums.CursorType.Pan
            && toolbarStore.instance.panStampId !== 0) {
            return classNames({ 'annotating': !this.isMessageOrExceptionPanelOpen }, {
                'dragging': (toolbarStore.instance.draggedAnnotationClientToken !== undefined ? true : false)
            });
        }
        else if (this.props.cursorType === enums.CursorType.Select
            && toolbarStore.instance.selectedStampId !== 0
            && !toolbarStore.instance.isBookMarkSelected) {
            var stamp = stampStore.instance.getStamp(toolbarStore.instance.selectedStampId);
            if (stamp.stampType === enums.StampType.dynamic &&
                stamp.stampId !== enums.DynamicAnnotation.OnPageComment) {
                return this.isMessageOrExceptionPanelOpen ? '' : 'annotating dynamic';
            }
            else {
                return this.isMessageOrExceptionPanelOpen ? '' : 'annotating hover';
            }
        }
        else if (toolbarStore.instance.isBookMarkSelected) {
            return this.props.cursorType === enums.CursorType.Select ? 'annotating hover' : '';
        }
    };
    return StampCursor;
}(pureRenderComponent));
module.exports = StampCursor;
//# sourceMappingURL=stampcursor.js.map