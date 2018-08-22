"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var stampStore = require('../../../../stores/stamp/stampstore');
var enums = require('../../../utility/enums');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
var CommentLine = (function (_super) {
    __extends(CommentLine, _super);
    /**
     * @constructor
     */
    function CommentLine(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isInNoDropArea = false;
        this.isZooming = false;
        /**
         * Re render the line on reset annotation
         */
        this.reRenderOnResetCursor = function () {
            if (_this.props.clientToken === stampStore.instance.movingCommentToken) {
                _this.isInGreyArea = false;
                _this.setState({
                    renderedOn: Date.now()
                });
            }
        };
        this.isAnnotationMoving = false;
        this.isInGreyArea = false;
        this.onAnnotationMove = this.onAnnotationMove.bind(this);
        this.reRenderOnResetCursor = this.reRenderOnResetCursor.bind(this);
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render method
     */
    CommentLine.prototype.render = function () {
        var x1 = (this.props.enableCommentsSideView === false ? this.props.lineX1 : 0) + '%';
        var y1 = this.props.lineY1 + '%';
        var lineHolderStyle;
        var _a = [0, 0], lineLeft1Diff = _a[0], lineTop1Diff = _a[1];
        var markSheetHolderLeftBasedOnRotation = this.getMarkSheetHolderLeftBasedOnRotation(this.props.annotationWidth);
        var commentLineHolderLeft = this.refs.commentLineHolder ?
            this.refs.commentLineHolder.getBoundingClientRect().left : 0;
        if (!this.props.enableCommentsSideView) {
            lineHolderStyle = null;
        }
        else {
            _b = this.getLineOffsetBasedOnRotation(this.props.annotationWidth), lineLeft1Diff = _b[0], lineTop1Diff = _b[1];
            // side view logic for line calculations
            y1 = this.props.lineY1 + lineTop1Diff + '%';
            switch (this.props.selectedZoomPreference) {
                case enums.ZoomPreference.FitWidth:
                    lineHolderStyle = { left: (this.props.lineX1 + lineLeft1Diff) + '%' };
                    break;
                case enums.ZoomPreference.FitHeight:
                case enums.ZoomPreference.Percentage:
                case enums.ZoomPreference.MarkschemePercentage:
                    lineHolderStyle = { left: (this.props.annotationLeftPx * this.props.overlayWidth) +
                            (markSheetHolderLeftBasedOnRotation -
                                commentLineHolderLeft) + 'px' };
                    break;
            }
            // calculations during the move of comment annotation
            if (this.isAnnotationMoving === true) {
                x1 = '0%';
                y1 = this.stampY.toString();
                switch (this.props.selectedZoomPreference) {
                    case enums.ZoomPreference.FitWidth:
                        lineHolderStyle = { left: (this.stampX + lineLeft1Diff) + 'px' };
                        break;
                    case enums.ZoomPreference.FitHeight:
                    case enums.ZoomPreference.Percentage:
                    case enums.ZoomPreference.MarkschemePercentage:
                        lineHolderStyle = {
                            left: (this.stampX + lineLeft1Diff) +
                                (this.props.marksheetHolderLeft -
                                    commentLineHolderLeft) + 'px' };
                        break;
                }
                this.isAnnotationMoving = false;
            }
            // hide the line when the comment is dragged to grey area
            if ((this.isInGreyArea === true || this.isZooming === true) && this.props.enableCommentsSideView === true) {
                x1 = this.props.lineX2 + '%';
                y1 = this.props.lineY2.toString();
            }
        }
        return (React.createElement("div", {className: 'comment-line-holder', ref: 'commentLineHolder'}, React.createElement("div", {className: 'line-svg-holder', style: lineHolderStyle}, React.createElement("svg", {className: 'line-svg'}, React.createElement("line", {className: 'comment-connector', x1: x1, y1: y1, x2: this.props.lineX2 + '%', y2: this.props.lineY2 + (this.props.enableCommentsSideView === false ? '%' : ''), mask: this.props.enableCommentsSideView === true ? '' : 'url(#comment-line-mask)'})))));
        var _b;
    };
    /**
     * This function gets invoked after the component is mounted
     */
    CommentLine.prototype.componentDidMount = function () {
        stampStore.instance.addListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT, this.onAnnotationMove);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_END, this.reRenderOnResetCursor);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    CommentLine.prototype.componentWillUnmount = function () {
        stampStore.instance.removeListener(stampStore.StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT, this.onAnnotationMove);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_END, this.reRenderOnResetCursor);
    };
    /**
     *  annotation move
     */
    CommentLine.prototype.onAnnotationMove = function (stampX, stampY, clientToken, isInGreyArea) {
        if (this.props.clientToken === clientToken) {
            this.isAnnotationMoving = true;
            this.isInGreyArea = isInGreyArea;
            this.stampX = stampX;
            this.stampY = stampY;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };
    /**
     * Gets the line offset to calculate to set the comment line dimensions
     * @param annotationSize size of annotation in pixels
     */
    CommentLine.prototype.getLineOffsetBasedOnRotation = function (annotationSize) {
        var lineLeft1Diff = 0;
        var lineTop1Diff = 0;
        switch (this.props.displayAngle) {
            case 90:
                lineLeft1Diff = 0;
                lineTop1Diff = annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
            case 180:
                lineLeft1Diff = 0;
                lineTop1Diff = -1 * annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
            case 270:
                //Get the annotation size in percentage. ratio * annotation width in percentage
                lineLeft1Diff = (this.props.overlayHeight / this.props.overlayWidth) * 4;
                lineTop1Diff = -1 * annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
            default:
                lineLeft1Diff = annotationSize * 100 / (this.props.overlayWidth);
                lineTop1Diff = annotationSize * 100 / (2 * this.props.overlayHeight);
                break;
        }
        return [lineLeft1Diff, lineTop1Diff];
    };
    /**
     * Get the value for marksheetholderLeft to set the comment lines positions
     *
     * @private
     * @param {number} annotationSize
     * @returns {number} marksheetholderLeft
     *
     * @memberof CommentHolder
     */
    CommentLine.prototype.getMarkSheetHolderLeftBasedOnRotation = function (annotationSize) {
        var _markSheetHolderLeft = this.props.marksheetHolderLeft;
        // add the annotation size in case of 0 and 270 rotated case
        switch (this.props.displayAngle) {
            case 0:
                _markSheetHolderLeft = _markSheetHolderLeft + annotationSize;
                break;
            case 270:
                _markSheetHolderLeft = _markSheetHolderLeft + annotationSize;
                break;
        }
        return _markSheetHolderLeft;
    };
    return CommentLine;
}(pureRenderComponent));
module.exports = CommentLine;
//# sourceMappingURL=commentline.js.map