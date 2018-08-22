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
 * React component class for Highlighter.
 */
var Ellipse = (function (_super) {
    __extends(Ellipse, _super);
    /**
     * Constructor for Ellipse
     * @param props
     * @param state
     */
    function Ellipse(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /**
         * Called once highlighter color reset/updated
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
        /**
         * Called once highlighter color reset/updated
         */
        this.onColorUpdated = function () {
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
            renderedOn: Date.now()
        };
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    /**
     * Component did mount
     */
    Ellipse.prototype.componentDidMount = function () {
        toolbarStore.instance.setMaxListeners(0);
        this.setInitialDimensions(this.props.annotationData.clientToken, false, false, true);
        this.setUpHammer();
        markingStore.instance.addListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onColorUpdated);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.addListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        /* This will set default selection in devices while stamping */
        this.setBorderOnStamping();
    };
    /**
     * Component will unmount
     */
    Ellipse.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.UPDATE_ANNOTATION_COLOR, this.onColorUpdated);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_UPDATED, this.onUpdate);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_SELECTED, this.onStampSelected);
        markingStore.instance.removeListener(markingStore.MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, this.updateSelection);
        this.destroyHammer();
    };
    /**
     * Component Did Update
     */
    Ellipse.prototype.componentDidUpdate = function () {
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
    Ellipse.prototype.render = function () {
        var isPreviousAnnotation = this.isPreviousAnnotation;
        var dataAnnotationRelevance = isPreviousAnnotation ? 'previous' : 'current';
        var styleSpan = {
            left: this.state.left + '%',
            top: this.state.top + '%',
            width: Math.max(this.state.width) + '%',
            height: Math.max(this.state.height) + '%',
            zIndex: this.zIndex,
            visibility: this.annotationOutsideResponse || !this.props.isVisible ? 'hidden' : 'visible',
            color: this.getAnnotationColorInRGB(this.props.isFade, enums.DynamicAnnotation.Ellipse)
        };
        var styleG = {};
        // To enable drawing in Faded Annotation
        styleSpan.pointerEvents = this.getStyleSpanPointerEvents;
        if (this.props.isInFullResponseView) {
            styleG.pointerEvents = 'none';
        }
        var resizePointerStyle = {};
        if (!this.props.isActive) {
            resizePointerStyle.pointerEvents = 'none';
        }
        // Get the Classname for annotation.
        var className = this.getAnnotationClassName(this.props.isFade, this.state.isShowBorder);
        return (React.createElement("span", {id: this.props.id + '_' + className, className: className, style: styleSpan, title: this.props.toolTip, onContextMenu: !this.props.isActive ? null : this.onContextMenu, onMouseOver: !this.props.isActive ? null : this.onMouseOver, onMouseLeave: !this.props.isActive ? null : this.onMouseLeave, "data-annotation-relevance": dataAnnotationRelevance, "data-type": 'dynamicannotation', key: this.props.id}, React.createElement("span", {className: 'resizer', id: this.props.id + '_resizer' + this.remarkIdPostText, "data-type": 'dynamicannotation', style: resizePointerStyle, "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_resizer'}, this.showBorder()), React.createElement("svg", {id: this.props.id + this.remarkIdPostText, "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_ellipsewrapper'}, React.createElement("ellipse", {className: 'ellipse-shape', cx: '50%', cy: '50%', rx: '50%', ry: '50%', "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_ellipse1'}), React.createElement("g", {className: 'ellipse-area', "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, id: this.props.id + '_clickable' + this.remarkIdPostText, style: styleG, key: this.props.id + '_ellipsepathwrapper'}, React.createElement("svg", {x: '0px', y: '0px', viewBox: '0 0 200 200', preserveAspectRatio: 'none', "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_ellipsesvg'}, React.createElement("g", {className: 'ellipse-area-shape', "data-type": 'dynamicannotation', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_ellipseg'}, React.createElement("path", {d: 'M100,200h100V100C200,155.2,155.2,200,100,200z', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_path1'}), React.createElement("path", {d: 'M0,100v100h100C44.8,200,0,155.2,0,100z', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_path2'}), React.createElement("path", {d: 'M100,0H0v100C0,44.8,44.8,0,100,0z', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_path3'}), React.createElement("path", {d: 'M100,0c55.2,0,100,44.8,100,100V0H100z', "data-annotation-relevance": dataAnnotationRelevance, key: this.props.id + '_path4'}))), React.createElement("ellipse", {className: 'ellipse-area-circle', cx: '50%', cy: '50%', rx: '50%', ry: '50%', "data-type": 'dynamicannotation', key: this.props.id + '_ellipse2', "data-annotation-relevance": dataAnnotationRelevance})))));
    };
    return Ellipse;
}(DynamicStampBase));
module.exports = Ellipse;
//# sourceMappingURL=ellipse.js.map