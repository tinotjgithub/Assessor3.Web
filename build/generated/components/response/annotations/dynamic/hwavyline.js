"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Reactdom = require('react-dom');
var DynamicStampBase = require('./dynamicstampbase');
var toolbarStore = require('../../../../stores/toolbar/toolbarstore');
var markingStore = require('../../../../stores/marking/markingstore');
var enums = require('../../../utility/enums');
var annotationHelper = require('../../../utility/annotation/annotationhelper');
/**
 * React component class for Highlighter.
 */
var HWavyLine = (function (_super) {
    __extends(HWavyLine, _super);
    /**
     * Constructor for Hwavyline
     * @param props
     * @param state
     */
    function HWavyLine(props, state) {
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
        this.resizeMinVal = { width: 20, height: 20 };
        this.state = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            isShowBorder: false,
            zIndex: 0
        };
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.initiateRender = this.initiateRender.bind(this);
    }
    /**
     * Component did mount
     */
    HWavyLine.prototype.componentDidMount = function () {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        window.addEventListener('resize', this.checkThickness);
        markingStore.instance.addListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.checkThicknessOnAnimationCompleted);
        /** Initiated when response view mode is changed to 1page/2page/4page */
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT, this.initiateRender);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    };
    /**
     * Component will unmount
     */
    HWavyLine.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.checkThickness);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT, this.initiateRender);
        markingStore.instance.removeListener(markingStore.MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, this.checkThicknessOnAnimationCompleted);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.destroyHammer();
    };
    /**
     * Component Did Update
     */
    HWavyLine.prototype.componentDidUpdate = function () {
        if (this.isPreviousAnnotation || !this.props.isActive) {
            this.destroyHammer();
        }
        else {
            this.setUpHammer();
        }
    };
    /**
     * Render component
     * @returns
     */
    HWavyLine.prototype.render = function () {
        var isPreviousAnnotation = this.isPreviousAnnotation;
        var dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';
        var line1 = { x1: '0', x2: '0', y1: '0', y2: '0', patternWidth: '0%' };
        var line2 = { x1: '0', x2: '0', y1: '0', y2: '0', patternWidth: '0%' };
        var styleSpan = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: Math.max(this.state.width) + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.VWavyLine)
        };
        var svgStyle = {
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            display: this.annotationOutsideResponse || !this.props.isVisible ? 'none' : 'block'
        };
        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;
        var imageWidth = 0;
        var patternWidth = 0;
        // Get the Classname for annotation.
        var className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);
        if (this.state.width > 0) {
            imageWidth = (this.state.width / 100) * this.props.imageWidth;
            patternWidth = (this.props.imageWidth / 100) * 0.9;
            var calculatedPatternWidth = annotationHelper.calculatePercentage(patternWidth, imageWidth);
            line1 = {
                x1: '0%', y1: '20%', x2: Number(calculatedPatternWidth) / 2 + '%', y2: '80%',
                patternWidth: String(calculatedPatternWidth) + '%'
            };
            line2 = {
                x1: Number(calculatedPatternWidth) / 2 + '%', y1: '80%', x2: calculatedPatternWidth + '%', y2: '20%',
                patternWidth: String(calculatedPatternWidth) + '%'
            };
        }
        /** Loaded only when response mode is changed to single page/ 2 page/ 4 page  */
        if (this.loadEmpty) {
            return (React.createElement("div", {id: this.props.id + '_' + className, className: className, style: styleSpan, onContextMenu: !this.props.isActive ? null : this.onContextMenu, onMouseOver: !this.props.isActive ? null : this.onMouseOver, onMouseLeave: !this.props.isActive ? null : this.onMouseLeave, title: this.props.toolTip, "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id}));
        }
        else {
            return (React.createElement("div", {id: this.props.id + '_' + className, className: className, style: styleSpan, onContextMenu: !this.props.isActive ? null : this.onContextMenu, onMouseOver: !this.props.isActive ? null : this.onMouseOver, onMouseLeave: !this.props.isActive ? null : this.onMouseLeave, title: this.props.toolTip, "data-type": 'dynamicannotation', key: this.props.id, "data-annotation-relevance": dataAnnotationRelevance}, this.getLineAnnotationHitArea(), React.createElement("span", {className: 'resizer', id: this.props.id + '_resizer', "data-type": 'dynamicannotation', key: this.props.id + '_resizer', "data-annotation-relevance": dataAnnotationRelevance}, this.showBorder()), React.createElement("svg", {id: this.getDynamicPatternId, "data-annotation-relevance": dataAnnotationRelevance, style: svgStyle, key: this.props.id + '_svgwrapper'}, React.createElement("pattern", {id: this.getDynamicPatternId + '_Pattern', ref: 'pattern', key: this.props.id + '_pattern', x: '0', y: '0', width: line1.patternWidth, height: '30', patternUnits: 'userSpaceOnUse'}, React.createElement("g", {className: 'wavy-line', key: this.props.id + '_linewrapper'}, React.createElement("line", {x1: line1.x1, y1: line1.y1, x2: line1.x2, y2: line1.y2, key: this.props.id + '_line1'}), React.createElement("line", {x1: line2.x1, y1: line2.y1, x2: line2.x2, y2: line2.y2, key: this.props.id + '_line2'}))), React.createElement("rect", {fill: 'url(#' + this.getDynamicPatternId + '_Pattern' + ')', x: '0', y: '0', width: '100%', height: '100%', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_rect'}))));
        }
    };
    return HWavyLine;
}(DynamicStampBase));
module.exports = HWavyLine;
//# sourceMappingURL=hwavyline.js.map