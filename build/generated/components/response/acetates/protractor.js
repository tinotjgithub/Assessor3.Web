"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var AcetateBase = require('./acetatebase');
var enums = require('../../utility/enums');
var constants = require('../../utility/constants');
var markingStore = require('../../../stores/marking/markingstore');
var overlayHelper = require('../../utility/overlay/overlayhelper');
/**
 * React component class for protractor.
 */
var Protractor = (function (_super) {
    __extends(Protractor, _super);
    /**
     * constructor for protractor
     * @param props
     * @param state
     */
    function Protractor(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /* fired on acetate position updated action */
        this.onAcetatePositionUpdated = function (acetate, acetateAction) {
            if (acetate && _this.props.acetateDetails.clientToken === acetate.clientToken) {
                _this._acetateData = acetate.acetateData;
                var stateAdjuster = acetateAction === enums.AcetateAction.none ? 10 : 0;
                _this.reRender(stateAdjuster);
            }
        };
        this.state = {
            isHovering: false
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.zIndex = this.getZIndex(this.props.imageProps);
    }
    /**
     * The component will mount for protractor
     */
    Protractor.prototype.componentWillMount = function () {
        this._imageDimension = this.getImageDimension();
        this._acetateData = this.props.acetateDetails.acetateData;
    };
    /**
     * component will receive props for protractor
     * @param nxtProps
     */
    Protractor.prototype.componentWillReceiveProps = function (nxtProps) {
        this.overlayHolderElement = this.props.getoverlayHolderElement();
        this._acetateData = nxtProps.acetateDetails.acetateData;
    };
    /**
     * component did mount for protractor
     */
    Protractor.prototype.componentDidMount = function () {
        this.overlayHolderElement = this.props.getoverlayHolderElement();
        markingStore.instance.addListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    };
    /**
     * component will unmount for protractor
     */
    Protractor.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    };
    /**
     * Render method
     */
    Protractor.prototype.render = function () {
        var protractorPoints = this._acetateData.acetateLines[0].points;
        var p1 = protractorPoints[0];
        var p2 = protractorPoints[1];
        var p3 = protractorPoints[2];
        p1 = this.getAdjustedPoints(p1, this._acetateData).p;
        p2 = this.getAdjustedPoints(p2, this._acetateData).p;
        p3 = this.getAdjustedPoints(p3, this._acetateData).p;
        this._imageDimension = this.getImageDimension();
        var x1 = this.findPercentage(p1.x, this._imageDimension.imageWidth);
        var x2 = this.findPercentage(p2.x, this._imageDimension.imageWidth);
        var x3 = this.findPercentage(p3.x, this._imageDimension.imageWidth);
        var y1 = this.findPercentage(p1.y, this._imageDimension.imageHeight);
        var y2 = this.findPercentage(p2.y, this._imageDimension.imageHeight);
        var y3 = this.findPercentage(p3.y, this._imageDimension.imageHeight);
        // find stiched image gap and adjust y coordinates
        var stitchedImageGapOffset1 = this.findStitchedImageGapOffset(y1);
        var stitchedImageGapOffset2 = this.findStitchedImageGapOffset(y2);
        var stitchedImageGapOffset3 = this.findStitchedImageGapOffset(y3);
        y1 += stitchedImageGapOffset1;
        y2 += stitchedImageGapOffset2;
        y3 += stitchedImageGapOffset3;
        var viewBox = this.setSVGViewBox(0, 0, this._imageDimension.imageWidth, this._imageDimension.imageHeight);
        var labelPosition = this.getLabelPosition([p1, p2, p3]);
        // set styles for protractor wrapper
        var protractorStyle = {
            transform: 'translate(0px, 0px)',
            zIndex: this.zIndex
        };
        var labelStyle = {};
        if (labelPosition) {
            labelStyle = {
                left: labelPosition.x + '%',
                top: labelPosition.y + stitchedImageGapOffset2 + '%'
            };
        }
        return (React.createElement("div", {id: 'protractor_' + this.props.acetateDetails.clientToken, key: 'protractor_' + this.props.acetateDetails.clientToken, "data-client-token": this.props.acetateDetails.clientToken, className: this.getClassName(enums.ToolType.protractor), onMouseOver: this.onMouseOver, onMouseLeave: this.onMouseLeave, style: protractorStyle, "data-tool-type": 'protractor'}, React.createElement("div", {style: labelStyle, className: 'overlay-text bolder'}, this.getLabelText([p1, p2, p3])), React.createElement("svg", {className: 'overlay-svg', xmlns: constants.SVG_XMLNS, version: constants.SVG_VERSION, xmlnsXlink: constants.SVG_XMLNS_XLINK, height: '100%'}, React.createElement("g", {className: 'overlay-wrap-group', transform: 'translate(0,0)'}, React.createElement("svg", {viewBox: viewBox, x: '0', y: '0', width: '100%', height: '100%', preserveAspectRatio: 'none', className: 'overlay-element-svg'}, React.createElement("g", {className: 'red-overlay'}, this.renderAcetateLine(x1, y1, x2, y2, 'overlay-element protractor-line l1'), this.renderAcetateLine(x3, y3, x2, y2, 'overlay-element protractor-line l2'))), React.createElement("g", {className: 'overlay-hit-area'}, React.createElement("svg", {xmlns: constants.SVG_XMLNS, version: constants.SVG_VERSION, viewBox: viewBox, x: '0', y: '0', width: '100%', height: '100%', preserveAspectRatio: 'none', className: 'overlay-hit-element-svg'}, this.renderAcetateLine(x1, y1, x2, y2, 'overlay-hit-area-line l1'), this.renderAcetateLine(x3, y3, x2, y2, 'overlay-hit-area-line l2')), this.renderAcetatePoint(x1, y1, 'p1'), this.renderAcetatePoint(x2, y2, 'p2'), this.renderAcetatePoint(x3, y3, 'p3'))))));
    };
    /**
     * return lable text
     * @param points
     */
    Protractor.prototype.getLabelText = function (points) {
        var angle = this.getAngle(points[0], points[1], points[2]);
        var angleText = angle > 180 ? 360 - angle : angle;
        return Math.round(angleText).toString() + '°';
    };
    /**
     * return angle
     * @param p1
     * @param p2
     * @param p3
     */
    Protractor.prototype.getAngle = function (p1, p2, p3) {
        var radian = Math.atan2(p1.y - p2.y, p1.x - p2.x) - Math.atan2(p3.y - p2.y, p3.x - p2.x);
        var angle = (360 - radian * 180 / Math.PI) % 360;
        return angle;
    };
    /**
     * return label position
     * @param points
     */
    Protractor.prototype.getLabelPosition = function (points) {
        var p1 = points[0];
        var p2 = points[1];
        var p3 = points[2];
        var x = 0;
        var y = 0;
        var overlayHolderElement = this.props.getoverlayHolderElement();
        if (overlayHolderElement) {
            var txPx = 0;
            var tyPx = 0;
            // Angle label distance from the point. (Considered based on the zoom value.)
            var angleTextDistance = 20 + (10 * this.currentZoomPercentage / 100);
            var x1 = this.findPercentage(p1.x, this._imageDimension.imageWidth);
            var x2 = this.findPercentage(p2.x, this._imageDimension.imageWidth);
            var x3 = this.findPercentage(p3.x, this._imageDimension.imageWidth);
            var y1 = this.findPercentage(p1.y, this._imageDimension.imageHeight);
            var y2 = this.findPercentage(p2.y, this._imageDimension.imageHeight);
            var y3 = this.findPercentage(p3.y, this._imageDimension.imageHeight);
            var angle = this.getAngle(p1, p2, p3);
            var angleL2 = Math.atan2((y3 - y2) * overlayHolderElement.clientHeight / 100, (x3 - x2)
                * overlayHolderElement.clientWidth / 100) % Math.PI;
            // the angle in second line is returning zero when it is expecting 180, so re-assign 180(ie, PI in radius)
            if (angleL2 === 0) {
                angleL2 = Math.PI;
            }
            var angleMiddle = angleL2 - ((angle / 2) * Math.PI / 180);
            if (angle > 270) {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle);
            }
            else if (angle > 180) {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle - Math.PI);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle - Math.PI);
            }
            else if (angle > 90) {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle);
            }
            else {
                txPx = x2 * overlayHolderElement.clientWidth / 100 + angleTextDistance * Math.cos(angleMiddle - Math.PI);
                tyPx = y2 * overlayHolderElement.clientHeight / 100 + angleTextDistance * Math.sin(angleMiddle - Math.PI);
            }
            x = 100 * txPx / overlayHolderElement.clientWidth;
            y = 100 * tyPx / overlayHolderElement.clientHeight;
        }
        return { x: x, y: y };
    };
    /**
     * get zIndex for protractor
     * @param imageProps
     */
    Protractor.prototype.getZIndex = function (imageProps) {
        var imageDimension = overlayHelper.getImageDimension(imageProps);
        // Z index calculation based on priority and the protractor overlay having the second priority.
        return Math.round(imageDimension.imageWidth * imageDimension.imageHeight + 2);
    };
    return Protractor;
}(AcetateBase));
module.exports = Protractor;
//# sourceMappingURL=protractor.js.map