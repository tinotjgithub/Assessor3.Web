"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var AcetateBase = require('./acetatebase');
var enums = require('../../utility/enums');
var constants = require('../../utility/constants');
var markingStore = require('../../../stores/marking/markingstore');
var overlayHelper = require('../../utility/overlay/overlayhelper');
var X_OFFSET = 30;
var Y_OFFSET = 15;
/**
 * React component class for ruler.
 */
var Ruler = (function (_super) {
    __extends(Ruler, _super);
    /**
     * constructor for ruler
     * @param props
     * @param state
     */
    function Ruler(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.imageDimension = { imageWidth: 0, imageHeight: 0 };
        this._renderCount = 0;
        /* fired on acetate position updated action */
        this.onAcetatePositionUpdated = function (acetate, acetateAction) {
            if (acetate && _this.props.acetateDetails.clientToken === acetate.clientToken) {
                _this._acetateData = acetate.acetateData;
                var stateAdjuster = acetateAction === enums.AcetateAction.none ? 10 : 0;
                _this.reRender(stateAdjuster);
            }
        };
        this.state = {
            isHovering: false,
            renderedOn: 0
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.zIndex = this.getZIndex(this.props.imageProps);
    }
    /**
     * The component will mount for ruler
     */
    Ruler.prototype.componentWillMount = function () {
        this.imageDimension = this.getImageDimension();
        this._acetateData = this.props.acetateDetails.acetateData;
    };
    /**
     * component will receive props for ruler
     * @param nxtProps
     */
    Ruler.prototype.componentWillReceiveProps = function (nxtProps) {
        this._renderCount = 0;
        this._acetateData = nxtProps.acetateDetails.acetateData;
    };
    /**
     * component did mount for ruler
     */
    Ruler.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
        this.checkLabelPosition();
    };
    /**
     * component will unmount for ruler
     */
    Ruler.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    };
    /**
     * component did update for ruler
     */
    Ruler.prototype.componentDidUpdate = function () {
        // Defect 66736 fix - limit the rendering for adjusting label position to 5 
        // (out of that 2 renders are for mouse over and mouse leve), to avoid cyclic- render in a small zoom level. 
        // And reset this value on componentWillReceiveProps for handling any other update
        if (this._renderCount < 5) {
            this.checkLabelPosition();
        }
    };
    /**
     * Render method
     */
    Ruler.prototype.render = function () {
        this._overlayBoundary =
            overlayHelper.getStitchedImageBoundary(this.props.getAnnotationOverlayElement, this.rotatedAngle);
        var rulerPoints = this._acetateData.acetateLines[0].points;
        var p1 = rulerPoints[0];
        var p2 = rulerPoints[1];
        var point1 = this.getAdjustedPoints(p1, this._acetateData).p;
        var point2 = this.getAdjustedPoints(p2, this._acetateData).p;
        var x1 = this.findPercentage(point1.x, this.imageDimension.imageWidth);
        var x2 = this.findPercentage(point2.x, this.imageDimension.imageWidth);
        var y1 = this.findPercentage(point1.y, this.imageDimension.imageHeight);
        var y2 = this.findPercentage(point2.y, this.imageDimension.imageHeight);
        var stitchedImageGapOffset1 = this.findStitchedImageGapOffset(y1);
        var stitchedImageGapOffset2 = this.findStitchedImageGapOffset(y2);
        y1 += stitchedImageGapOffset1;
        y2 += stitchedImageGapOffset2;
        point1.y += stitchedImageGapOffset1;
        point2.y += stitchedImageGapOffset2;
        var labelPosition = this.getLabelPosition([point1, point2], this.isLabelInsideScript);
        var viewBox = this.setSVGViewBox(0, 0, this.imageDimension.imageWidth, this.imageDimension.imageHeight);
        // set styles
        var ruleStyle = {
            transform: 'translate(0px, 0px)',
            zIndex: this.zIndex
        };
        var rulerTextStyle = {
            left: labelPosition.x + '%',
            top: labelPosition.y + stitchedImageGapOffset1 + '%'
        };
        return (React.createElement("div", {id: 'ruler_' + this.props.acetateDetails.clientToken, key: 'ruler_' + this.props.acetateDetails.clientToken, "data-client-token": this.props.acetateDetails.clientToken, className: this.getClassName(enums.ToolType.ruler), onMouseOver: this.onMouseOver, onMouseLeave: this.onMouseLeave, style: ruleStyle, "data-tool-type": 'ruler'}, React.createElement("div", {style: rulerTextStyle, className: 'overlay-text bolder'}, this.getLabelText([point1, point2])), React.createElement("svg", {className: 'overlay-svg', xmlns: constants.SVG_XMLNS, version: constants.SVG_VERSION, xmlnsXlink: constants.SVG_XMLNS_XLINK, height: '100%'}, React.createElement("g", {className: 'overlay-wrap-group', transform: 'translate(0,0)'}, React.createElement("svg", {viewBox: viewBox, x: '0', y: '0', width: '100%', height: '100%', preserveAspectRatio: 'none', className: 'overlay-element-svg'}, React.createElement("g", {className: 'red-overlay'}, this.renderAcetateLine(x1, y1, x2, y2, 'overlay-element ruler-line'))), React.createElement("g", {className: 'overlay-hit-area'}, React.createElement("svg", {xmlns: constants.SVG_XMLNS, version: constants.SVG_VERSION, viewBox: viewBox, x: '0', y: '0', width: '100%', height: '100%', preserveAspectRatio: 'none', className: 'overlay-hit-element-svg'}, this.renderAcetateLine(x1, y1, x2, y2, 'overlay-hit-area-line')), this.renderAcetatePoint(x1, y1, 'p1'), this.renderAcetatePoint(x2, y2, 'p2'))))));
    };
    /**
     * return label text for ruler
     * @param points
     */
    Ruler.prototype.getLabelText = function (points) {
        var millimetres = this.getRulerLength(points);
        return Math.round(millimetres).toString() + 'mm';
    };
    /**
     * get ruler length
     * @param points
     */
    Ruler.prototype.getRulerLength = function (points) {
        var p1 = points[0];
        var p2 = points[1];
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var pixels = Math.sqrt((dx * dx) + (dy * dy));
        var inches = pixels / this.SCRIPT_RESOLUTION;
        var millimetres = inches * 25.4;
        return millimetres;
    };
    /**
     * get angle between two points
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    Ruler.prototype.getTwoPointDegree = function (x1, y1, x2, y2) {
        var dy = y2 - y1;
        var dx = x2 - x1;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        theta = (theta < 0) ? 360 + theta : theta;
        return theta;
    };
    /**
     * get label position for ruler
     * @param points
     * @param isLabelInsideScript
     */
    Ruler.prototype.getLabelPosition = function (points, isLabelInsideScript) {
        var p1 = points[0];
        var p2 = points[1];
        var position = { x: 0, y: 0 };
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        // get a point halfway between the points
        var x = p1.x + (dx / 2);
        var y = p1.y + (dy / 2);
        var deltaX = X_OFFSET * (100 / this.currentZoomPercentage);
        var deltaY = Y_OFFSET * (100 / this.currentZoomPercentage);
        _a = this.deltaValuesForRulerLabel(deltaX, deltaY, this.rotatedAngle), deltaX = _a[0], deltaY = _a[1];
        var rulerLength = this.getRulerLength(points);
        var vectorLength = Math.sqrt((dx * dx) + (dy * dy));
        if (vectorLength > 0) {
            if (!isLabelInsideScript && !isNaN(this.currentZoomPercentage)) {
                x = x + ((dy * (deltaX)) / vectorLength);
                y = y + ((-dx * (deltaY)) / vectorLength);
            }
            else {
                x = x + ((-dy * (deltaX)) / vectorLength);
                y = y + ((dx * (deltaY)) / vectorLength);
            }
        }
        else {
            // assume label should be underneath point(s)
            y += deltaY;
        }
        position = {
            x: this.findPercentage(x, this.imageDimension.imageWidth),
            y: this.findPercentage(y, this.imageDimension.imageHeight)
        };
        return position;
        var _a;
    };
    /**
     * get zIndex for ruler
     * @param imageProps
     */
    Ruler.prototype.getZIndex = function (imageProps) {
        var imageDimension = overlayHelper.getImageDimension(imageProps);
        // Z index calculation based on priority and the ruler overlay having the first priority.
        return Math.round(imageDimension.imageWidth * imageDimension.imageHeight + 3);
    };
    /**
     * Returns the delta values for the ruler label
     * @param deltaX
     * @param deltaY
     * @param rotatedAngle
     */
    Ruler.prototype.deltaValuesForRulerLabel = function (deltaX, deltaY, rotatedAngle) {
        var adjustedDeltaX = deltaX;
        var adjustedDeltaY = deltaY;
        switch (rotatedAngle) {
            case enums.RotateAngle.Rotate_90:
                adjustedDeltaX = deltaY;
                adjustedDeltaY = deltaX;
                break;
            case enums.RotateAngle.Rotate_180:
                adjustedDeltaX = -deltaX;
                adjustedDeltaY = -deltaY;
                break;
            case enums.RotateAngle.Rotate_270:
                adjustedDeltaX = -deltaY;
                adjustedDeltaY = -deltaX;
                break;
        }
        return [adjustedDeltaX, adjustedDeltaY];
    };
    /**
     * chcek the position of label
     */
    Ruler.prototype.checkLabelPosition = function () {
        var overlayHolder = ReactDom.findDOMNode(this);
        if (overlayHolder && !this.isAcetateMoving) {
            var annotationOverlay = this.props.getAnnotationOverlayElement;
            if (annotationOverlay && !isNaN(this.currentZoomPercentage)) {
                var textElement = overlayHolder.getElementsByClassName('overlay-text')[0];
                var textElementClientRect = textElement.getBoundingClientRect();
                var annotationOverlayClientRect = annotationOverlay.getBoundingClientRect();
                this.isLabelInsideScript = overlayHelper.isAcetateInsideHolder(textElementClientRect, annotationOverlayClientRect);
                if (!this.isLabelInsideScript) {
                    this._renderCount++;
                    this.reRender();
                }
            }
        }
    };
    return Ruler;
}(AcetateBase));
module.exports = Ruler;
//# sourceMappingURL=ruler.js.map