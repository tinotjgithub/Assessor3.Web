"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var StampBase = require('../stampbase');
var classNames = require('classnames');
var enums = require('../../../utility/enums');
var colouredannotationshelper = require('../../../../utility/stamppanel/colouredannotationshelper');
/**
 * React component class for Image Stamp.
 */
var ImageStamp = (function (_super) {
    __extends(ImageStamp, _super);
    /**
     * @constructor
     */
    function ImageStamp(props, state) {
        _super.call(this, props, state);
        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.enterComment = this.onEnterCommentSelected.bind(this);
        this.left = 0;
        this.top = 0;
    }
    /**
     * Render method
     */
    ImageStamp.prototype.render = function () {
        // SVG pointer event style added for IE browser fix where use by default will have mouse pointer events
        // which was showing browser default context menu.
        var svgPointerEventsStyle = {};
        var style = {};
        var wrapperStyle = {};
        var isDisplayingInScript = false;
        var svgId = '';
        var classToApply;
        isDisplayingInScript = this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript;
        // Check if current annotation is dragged then we should hide the annotation
        // so that it will not be dispalyed to the user at the initial position from
        // where it is being dragged
        if (!this.props.isVisible) {
            classToApply = '';
            wrapperStyle.display = 'none';
            style.display = 'none';
            svgPointerEventsStyle.display = 'none';
        }
        else {
            var isPrevious = this.isPreviousAnnotation;
            wrapperStyle = this.getAnnotationWrapperStyle(this.props.wrapperStyle);
            style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
            style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
            style.pointerEvents = 'none';
            this.top = style.top;
            this.left = style.left;
            svgPointerEventsStyle.pointerEvents = 'none';
            classToApply = classNames({ 'annotation-wrap': isDisplayingInScript }, { 'static': isDisplayingInScript }, {
                'comment': this.props.stampData !== undefined &&
                    this.props.stampData.stampId === enums.DynamicAnnotation.OnPageComment
            }, { 'open': this.state.isOpen === undefined ? false : this.state.isOpen }, { 'inactive': this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView }, { 'previous': isPrevious });
        }
        svgId = isDisplayingInScript ? 'svgScriptStamp' : 'svgStamp';
        //If the stamp is not in the script no need to render the parent span.
        if (!isDisplayingInScript) {
            style.fill = colouredannotationshelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None).fill;
            return this.renderStamp(svgPointerEventsStyle, style, svgId);
        }
        return (React.createElement("span", {className: classToApply, style: wrapperStyle, id: this.props.uniqueId + '-wrapperspan' + this.remarkIdPostText, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current', onMouseEnter: this.onMouseEnterHandler, onMouseMove: this.onMouseMoveHandler, onMouseLeave: this.onMouseLeaveHandler, onContextMenu: this.onContextMenu, onClick: this.enterComment, onDoubleClick: this.enterComment, "data-stamp": this.props.stampData.stampId, "data-token": this.props.clientToken}, this.renderStamp(svgPointerEventsStyle, style, svgId)));
    };
    /**
     * Render the Samp.
     * @param svgPointerEventsStyle
     * @param style
     * @param svgId
     */
    ImageStamp.prototype.renderStamp = function (svgPointerEventsStyle, style, svgId) {
        if (style === void 0) { style = {}; }
        return (React.createElement("span", {className: 'svg-icon', title: this.props.toolTip, id: this.props.uniqueId + this.remarkIdPostText, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current', "data-stamp": this.props.stampData.stampId, "data-token": this.props.clientToken}, React.createElement("svg", {viewBox: '0 0 32 32', className: this.props.id, style: style, id: svgId + this.remarkIdPostText, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}, React.createElement("use", {style: svgPointerEventsStyle, xlinkHref: '#' + this.props.id, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}))));
    };
    return ImageStamp;
}(StampBase));
module.exports = ImageStamp;
//# sourceMappingURL=imagestamp.js.map