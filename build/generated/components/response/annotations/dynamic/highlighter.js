"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Reactdom = require('react-dom');
var DynamicStampBase = require('./dynamicstampbase');
var markingStore = require('../../../../stores/marking/markingstore');
var enums = require('../../../utility/enums');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
/**
 * React component class for Highlighter.
 */
var Highlighter = (function (_super) {
    __extends(Highlighter, _super);
    /**
     * Constructor fopr highlighter
     * @param props
     * @param state
     */
    function Highlighter(props, state) {
        var _this = this;
        _super.call(this, props, state);
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
        /**
         * Called once highlighter color reset/updated
         */
        this.onChange = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.resizeMinVal = { width: 20, height: 20 };
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0,
            renderedOn: 0
        };
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    /**
     * Component did mount
     */
    Highlighter.prototype.componentDidMount = function () {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.resetOverlayStitchedBoundary();
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    };
    /**
     * Component will unmount
     */
    Highlighter.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onChange);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.destroyHammer();
    };
    /**
     * Component Did Update
     */
    Highlighter.prototype.componentDidUpdate = function () {
        if (this.isPreviousAnnotation || !this.props.isActive) {
            this.destroyHammer();
        }
        else {
            this.setUpHammer();
        }
        this.resetOverlayStitchedBoundary();
    };
    /**
     * Render component
     * @returns
     */
    Highlighter.prototype.render = function () {
        var resizePointerStyle = {};
        // Get the Classname for annotation.
        var className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);
        var isPreviousAnnotation = this.isPreviousAnnotation;
        var dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';
        var styleSpan = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: Math.max(this.state.width) + '%',
            height: Math.max(this.state.height) + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse ||
                !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.Highlighter)
        };
        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;
        if (!this.props.isActive) {
            resizePointerStyle.pointerEvents = 'none';
        }
        return (React.createElement("span", {id: this.props.id + '_' + className, className: className, style: styleSpan, onContextMenu: !this.props.isActive && !isPreviousAnnotation ? null : this.onContextMenu, onMouseOver: !this.props.isActive && !isPreviousAnnotation ? null : this.onMouseOver, onMouseLeave: !this.props.isActive && !isPreviousAnnotation ? null : this.onMouseLeave, title: this.props.toolTip, "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id}, React.createElement("span", {className: 'resizer', id: this.props.id + '_resizer', style: resizePointerStyle, key: this.props.id + '_resizer', "data-annotation-relevance": dataAnnotationRelevance}, this.showBorder()), React.createElement("svg", {id: this.props.id, style: { display: 'block' }, "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_rectwrapper'}, React.createElement("rect", {width: '100%', height: '100%', style: { color: styleSpan.color }, "data-type": 'dynamicannotation', key: this.props.id + '_rectangle', "data-annotation-relevance": dataAnnotationRelevance}))));
    };
    return Highlighter;
}(DynamicStampBase));
module.exports = Highlighter;
//# sourceMappingURL=highlighter.js.map