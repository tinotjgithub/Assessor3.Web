"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var AcetateBase = require('./acetatebase');
var enums = require('../../utility/enums');
var overlayHelper = require('../../utility/overlay/overlayhelper');
var SVG_XMLNS = 'http://www.w3.org/2000/svg';
var SVG_VERSION = '1.1';
var SVG_XMLNS_XLINK = 'http://www.w3.org/1999/xlink';
var classNames = require('classnames');
var markingStore = require('../../../stores/marking/markingstore');
/**
 * React component class for multiline.
 */
var Multiline = (function (_super) {
    __extends(Multiline, _super);
    /**
     * constructor for multiline
     * @param props
     * @param state
     */
    function Multiline(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.imageDimension = { imageWidth: 0, imageHeight: 0 };
        /* fired on acetate position updated action */
        this.onAcetatePositionUpdated = function (acetate, acetateAction) {
            if (acetate && _this.props.acetateDetails.clientToken === acetate.clientToken) {
                _this._acetateData = acetate.acetateData;
                var stateAdjuster = acetateAction === enums.AcetateAction.none ? 10 : 0;
                _this.reRender(stateAdjuster);
            }
        };
        this.state = {
            renderedOn: 0,
            isHovering: false
        };
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.zIndex = this.getZIndex(this.props.imageProps);
    }
    /**
     * Render method
     */
    Multiline.prototype.render = function () {
        var renderPoints = this.constructPoints();
        var renderPath = this.constructPathWithColor();
        var renderHitAreaPath = renderPath ? renderPath.map(function (path, index) {
            var _id = 'multiLinePathArea_' + index;
            return path ? (React.createElement("path", {d: path.path, className: classNames('overlay-hit-area-line', { 'hidden': path.lineType === enums.LineType.none }), key: _id, id: _id})) : null;
        }) : null;
        var renderElementPath = renderPath ? renderPath.map(function (path, index) {
            var _id = 'multiLinePath_' + index;
            return path ? (React.createElement("g", {className: path.color, key: _id + 'g'}, React.createElement("path", {d: path.path, className: classNames('overlay-element multi-line', { 'hidden': path.lineType === enums.LineType.none }), key: _id, id: _id}))) : null;
        }) : null;
        var viewBox = this.setSVGViewBox(0, 0, this.imageDimension.imageWidth, this.imageDimension.imageHeight);
        // set styles
        var multilineStyle = {
            transform: 'translate(0px, 0px)',
            zIndex: this.zIndex
        };
        return (React.createElement("div", {id: 'multiline_' + this.props.acetateDetails.clientToken, key: 'multiline' + this.props.acetateDetails.clientToken, "data-client-token": this.props.acetateDetails.clientToken, className: classNames(this.getClassName(enums.ToolType.multiline), { 'shared-overlay': this.props.acetateDetails.shared }), onMouseOver: this.onMouseOver, onMouseLeave: this.onMouseLeave, style: multilineStyle, "data-tool-type": 'multiline'}, React.createElement("svg", {className: 'overlay-svg', xmlns: SVG_XMLNS, version: SVG_VERSION, xmlnsXlink: SVG_XMLNS_XLINK, height: '100%'}, React.createElement("g", {className: 'overlay-wrap-group', transform: 'translate(0,0)'}, React.createElement("svg", {viewBox: viewBox, x: '0', y: '0', width: '100%', height: '100%', preserveAspectRatio: 'none', className: 'overlay-element-svg'}, renderElementPath), React.createElement("g", {className: 'overlay-hit-area'}, React.createElement("svg", {viewBox: viewBox, x: '0', y: '0', width: '100%', height: '100%', preserveAspectRatio: 'none', className: 'overlay-hit-element-svg'}, renderHitAreaPath), renderPoints)))));
    };
    /**
     * contructing path along with color details for multiline
     */
    Multiline.prototype.constructPathWithColor = function () {
        var _this = this;
        return this._acetateData.acetateLines.map(function (acetateLine, lineIndex) {
            var pathstr = { color: '', path: '', lineType: enums.LineType.none };
            pathstr.color = _this.getAcetateColor(acetateLine.colour);
            pathstr.lineType = acetateLine.lineType;
            // points for constructing curve path
            var points = [];
            acetateLine.points.map(function (acetatePoint, pointIndex) {
                var _acetatePoint = _this.getAdjustedPoints(acetatePoint, _this.props.acetateDetails.acetateData).p;
                var x = _acetatePoint.x;
                var y = _acetatePoint.y;
                var ypointInPercent = _this.findPercentage(_acetatePoint.y, _this.imageDimension.imageHeight);
                var stitchedImageGapOffset = _this.findStitchedImageGapOffset(ypointInPercent);
                var ypointInPixel = ((ypointInPercent + stitchedImageGapOffset) / 100) * _this.imageDimension.imageHeight;
                if (stitchedImageGapOffset > 0) {
                    y = ypointInPixel;
                }
                pathstr.path = pathstr.path + (pathstr.path === '' ? 'M' : ' L') + x + ' ' + y;
                points.push(x);
                points.push(y);
            });
            if (acetateLine.lineType === enums.LineType.curve) {
                // changing the path based on linetype
                pathstr.path = _this.contructCurvePath(points);
            }
            return pathstr;
        });
    };
    /**
     * contructing points for multiline
     */
    Multiline.prototype.constructPoints = function () {
        var _this = this;
        return this._acetateData.acetateLines.map(function (acetateLine, lineIndex) {
            return acetateLine.points.map(function (acetatePoint, pointIndex) {
                var point = _this.getAdjustedPoints(acetatePoint, _this.props.acetateDetails.acetateData).p;
                var x = _this.findPercentage(point.x, _this.imageDimension.imageWidth);
                var y = _this.findPercentage(point.y, _this.imageDimension.imageHeight);
                var stitchedImageGapOffset = _this.findStitchedImageGapOffset(y);
                var pointName = 'p_' + lineIndex + '_' + pointIndex;
                return _this.renderAcetatePoint(x, y + stitchedImageGapOffset, pointName);
            });
        });
    };
    /**
     * contruct Curve Path (logic reused from WA)
     * @param data
     */
    Multiline.prototype.contructCurvePath = function (data) {
        var k = 1;
        var size = data.length;
        var last = size - 4;
        var path = 'M' + [data[0], data[1]];
        for (var i = 0; i < size - 2; i += 2) {
            var x0 = i ? data[i - 2] : data[0];
            var y0 = i ? data[i - 1] : data[1];
            var x1 = data[i + 0];
            var y1 = data[i + 1];
            var x2 = data[i + 2];
            var y2 = data[i + 3];
            var x3 = i !== last ? data[i + 4] : x2;
            var y3 = i !== last ? data[i + 5] : y2;
            var cp1x = x1 + (x2 - x0) / 6 * k;
            var cp1y = y1 + (y2 - y0) / 6 * k;
            var cp2x = x2 - (x3 - x1) / 6 * k;
            var cp2y = y2 - (y3 - y1) / 6 * k;
            path += 'C' + [cp1x, cp1y, cp2x, cp2y, x2, y2];
        }
        return path;
    };
    /**
     * The component will mount for multiline
     */
    Multiline.prototype.componentWillMount = function () {
        this.imageDimension = this.getImageDimension();
        this._acetateData = this.props.acetateDetails.acetateData;
    };
    /**
     * The component will receive props for multiline
     */
    Multiline.prototype.componentWillReceiveProps = function (nxtProps) {
        this._acetateData = nxtProps.acetateDetails.acetateData;
    };
    /**
     * The component did mount for multi line
     */
    Multiline.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    };
    /**
     * The component will unmount for multi line
     */
    Multiline.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.ACETATE_POSITION_UPDATED, this.onAcetatePositionUpdated);
    };
    /**
     * return null for multiline
     * @param acetatePoints
     */
    Multiline.prototype.getLabelText = function (acetatePoints) {
        return null;
    };
    /**
     * return null for multiline
     * @param acetatePoints
     */
    Multiline.prototype.getLabelPosition = function (acetatePoints) {
        return null;
    };
    /**
     * get zIndex for ruler
     * @param imageProps
     */
    Multiline.prototype.getZIndex = function (imageProps) {
        var imageDimension = overlayHelper.getImageDimension(imageProps);
        // Z index calculation based on priority and the multi line overlay having the third priority.
        return Math.round(imageDimension.imageWidth * imageDimension.imageHeight + 1);
    };
    return Multiline;
}(AcetateBase));
module.exports = Multiline;
//# sourceMappingURL=multiline.js.map