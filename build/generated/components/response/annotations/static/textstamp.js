"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var colouredannotationshelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var StampBase = require('../stampbase');
var classNames = require('classnames');
var enums = require('../../../utility/enums');
/**
 * React component class for Text Stamp.
 */
var TextStamp = (function (_super) {
    __extends(TextStamp, _super);
    /**
     * @constructor
     */
    function TextStamp(props, state) {
        _super.call(this, props, state);
        this.onMouseMoveHandler = this.onMouseMoveHandler.bind(this);
        this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
        this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }
    /**
     * Render method
     */
    TextStamp.prototype.render = function () {
        // Creating the annotation style based on the Coloured Annotations CC
        var style = {};
        var wrapperStyle = {};
        var isDisplayingInScript = false;
        var svgId = '';
        var classToApply;
        isDisplayingInScript = this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript;
        if (!this.props.isVisible) {
            classToApply = '';
            wrapperStyle.display = 'none';
            style.display = 'none';
        }
        else {
            // Check if current annotation is dragged then we should hide the annotation
            // so that it will not be dispalyed to the user at the initial position from
            wrapperStyle = this.getAnnotationWrapperStyle(this.props.wrapperStyle);
            style.top = this.props.topPos != null && this.props.topPos !== undefined ? this.props.topPos : style.top;
            style.left = this.props.leftPos != null && this.props.leftPos !== undefined ? this.props.leftPos : style.left;
            style.pointerEvents = 'none';
            classToApply = classNames({ 'annotation-wrap': this.props.isDisplayingInScript !== undefined && this.props.isDisplayingInScript }, { 'static': isDisplayingInScript }, { 'inactive': this.props.isActive !== undefined && !this.props.isActive && !this.props.isInFullResponseView }, { 'previous': this.isPreviousAnnotation });
        }
        svgId = isDisplayingInScript ? 'svgScriptStamp' : 'svgStamp';
        // If the stamp is not in the script no need to render the parent span.
        if (!isDisplayingInScript) {
            var annotationStyle = colouredannotationshelper.createAnnotationStyle(this.props.annotationData, enums.DynamicAnnotation.None);
            style.fill = annotationStyle.fill;
            style.border = annotationStyle.border;
            return this.renderStamp(style);
        }
        return (React.createElement("span", {className: classToApply, style: wrapperStyle, id: this.props.uniqueId + '-wrapperspan' + this.remarkIdPostText, onMouseEnter: this.onMouseEnterHandler, onMouseMove: this.onMouseMoveHandler, onMouseLeave: this.onMouseLeaveHandler, onContextMenu: this.onContextMenu, "data-stamp": this.props.stampData.stampId, "data-token": this.props.clientToken}, this.renderStamp(style)));
    };
    /**
     * Render the Samp.
     * @param svgPointerEventsStyle
     * @param style
     * @param svgId
     */
    TextStamp.prototype.renderStamp = function (style) {
        if (style === void 0) { style = {}; }
        return (React.createElement("span", {className: 'txt-icon', title: this.props.toolTip, id: this.props.uniqueId + this.remarkIdPostText, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current', "data-stamp": this.props.stampData.stampId, "data-token": this.props.clientToken}, React.createElement("svg", {viewBox: '0 0 32 21', className: this.props.id, style: style, id: this.props.uniqueId + this.remarkIdPostText, "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}, React.createElement("text", {id: this.props.stampData.name + '-icon' + this.remarkIdPostText, className: 'caption', style: style, x: '50%', y: '50%', dy: '.3em', "data-annotation-relevance": this.isPreviousAnnotation ? 'previous' : 'current'}, this.props.stampData.svgImage === '' ? this.props.stampData.name : this.props.stampData.svgImage))));
    };
    return TextStamp;
}(StampBase));
module.exports = TextStamp;
//# sourceMappingURL=textstamp.js.map