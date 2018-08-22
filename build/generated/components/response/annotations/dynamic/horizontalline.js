"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var Reactdom = require('react-dom');
var DynamicStampBase = require('./dynamicstampbase');
var markingStore = require('../../../../stores/marking/markingstore');
var enums = require('../../../utility/enums');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
/**
 * React component class for Annotation Panel.
 */
var HorizontalLine = (function (_super) {
    __extends(HorizontalLine, _super);
    /**
     * @constructor
     */
    function HorizontalLine(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Forcefully rerendering component
         */
        this.onChange = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * Called once highlighter reset/updated
         */
        this.onUpdate = function (clientToken) {
            if (clientToken === _this.props.annotationData.clientToken) {
                _this.isDrawMode = _this.props.isDrawEnd ? false : true;
                _this.setInitialDimensions(clientToken, _this.props.isDrawEnd, _this.props.isStamping);
                if (_this.isDrawMode) {
                    _this.props.setCurrentAnnotationElement(Reactdom.findDOMNode(_this));
                }
                else {
                    _this.props.setCurrentAnnotationElement(undefined);
                }
            }
        };
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0
        };
        this.resizeMinVal = { width: 20, height: 5 };
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.initiateRender = this.initiateRender.bind(this);
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    HorizontalLine.prototype.componentDidMount = function () {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        window.addEventListener('resize', this.checkThickness);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.checkThicknessOnAnimationCompleted);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        /** Initiated when response view mode is changed to 1page/2page/4page */
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT, this.initiateRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    HorizontalLine.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.checkThickness);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.checkThicknessOnAnimationCompleted);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT, this.initiateRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.destroyHammer();
    };
    /**
     * Component Did Update
     */
    HorizontalLine.prototype.componentDidUpdate = function () {
        if (this.isPreviousAnnotation || !this.props.isActive) {
            this.destroyHammer();
        }
        else {
            this.setUpHammer();
        }
    };
    /**
     * Render method
     */
    HorizontalLine.prototype.render = function () {
        var isPreviousAnnotation = this.isPreviousAnnotation;
        var dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';
        var styleSpan = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: this.state.width + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.HorizontalLine)
        };
        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;
        // Get the Classname for annotation.
        var className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);
        /** Loaded only when response mode is changed to single page/ 2 page/ 4 page  */
        if (this.loadEmpty) {
            return (React.createElement("span", {id: this.props.id + '_' + className, className: className, style: styleSpan, onContextMenu: !this.props.isActive ? null : this.onContextMenu, onMouseOver: !this.props.isActive ? null : this.onMouseOver, onMouseLeave: !this.props.isActive ? null : this.onMouseLeave, title: this.props.toolTip, "data-type": 'dynamicannotation', key: this.props.id, "data-annotation-relevance": dataAnnotationRelevance}));
        }
        else {
            return (React.createElement("span", {id: this.props.id + '_' + className, className: className, style: styleSpan, title: this.props.toolTip, key: this.props.id, onContextMenu: !this.props.isActive ? null : this.onContextMenu, onMouseOver: !this.props.isActive ? null : this.onMouseOver, onMouseLeave: !this.props.isActive ? null : this.onMouseLeave, "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance}, this.getLineAnnotationHitArea(), React.createElement("span", {className: 'resizer', id: this.props.id + '_resizer', "data-type": 'dynamicannotation', key: this.props.id + '_resizer', "data-annotation-relevance": dataAnnotationRelevance}, this.showBorder()), React.createElement("svg", {id: this.props.id, "data-type": 'dynamicannotation', key: this.props.id + '_svgwrapper'}, React.createElement("line", {x1: '0', y1: '50%', x2: '100%', y2: '50%', "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_line'}))));
        }
    };
    return HorizontalLine;
}(DynamicStampBase));
module.exports = HorizontalLine;
//# sourceMappingURL=horizontalline.js.map