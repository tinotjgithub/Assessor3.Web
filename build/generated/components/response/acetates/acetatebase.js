"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var enums = require('../../utility/enums');
var pureRenderComponent = require('../../base/purerendercomponent');
var responseStore = require('../../../stores/response/responsestore');
var overlayHelper = require('../../utility/overlay/overlayhelper');
var messageStore = require('../../../stores/message/messagestore');
var exceptionStore = require('../../../stores/exception/exceptionstore');
var qigStore = require('../../../stores/qigselector/qigstore');
/**
 * React component class for acetate base.
 */
var AcetateBase = (function (_super) {
    __extends(AcetateBase, _super);
    function AcetateBase() {
        var _this = this;
        _super.apply(this, arguments);
        this.overlayBoundary = [];
        this.SCRIPT_RESOLUTION = 200;
        this.zIndex = 0;
        this.isLabelInsideScript = true;
        /**
         * mouse over handler
         */
        this.onMouseOver = function (event) {
            if (!_this.state.isHovering &&
                !messageStore.instance.isMessagePanelVisible &&
                !exceptionStore.instance.isExceptionPanelVisible) {
                // donot set isHovering when message/exception panel is open
                _this.setState({ isHovering: true });
            }
        };
        /**
         * mouse leave handler
         */
        this.onMouseLeave = function (event) {
            if (_this.state.isHovering) {
                _this.setState({ isHovering: false });
            }
        };
    }
    /**
     * return class name for acetate
     * @param toolType
     */
    AcetateBase.prototype.getClassName = function (toolType) {
        var className = 'overlay-wrap ';
        switch (toolType) {
            case enums.ToolType.ruler:
                className += 'ruler ';
                break;
            case enums.ToolType.multiline:
                className += 'multiline ';
                break;
            case enums.ToolType.protractor:
                className += 'protractor ';
                break;
        }
        if (this.state.isHovering) {
            className += 'hover';
        }
        return className;
    };
    /**
     * find the percentage
     * @param numerator
     * @param denominator
     */
    AcetateBase.prototype.findPercentage = function (numerator, denominator) {
        return overlayHelper.findPercentage(numerator, denominator);
    };
    /**
     * get points adjusted for image linkning scenario
     * @param p
     */
    AcetateBase.prototype.getAdjustedPoints = function (p, acetateData) {
        var adjustedPoints = { p: { x: 0, y: 0 } };
        if (this.props.doApplyLinkingScenarios) {
            var linkProps = this.props.linkingScenarioProps;
            // in linked page, linked page will be act as a seperate output page. so we will
            // calculating x,y position w.r.t output page
            if (this.props.imageProps.isALinkedPage && acetateData.wholePageNumber > 0) {
                adjustedPoints = {
                    p: { x: p.x, y: p.y }
                };
            }
            else if (this.props.imageProps.isALinkedPage && acetateData.outputPageNumber > 0) {
                // acetate from skipped zone. in this scenario we need to add the current zone top and height of
                // zones above current skipped zone. these values will be populated when acetates is filtered in overlayholder
                if (this.props.acetateDetails.imageLinkingData) {
                    var linkData = this.props.acetateDetails.imageLinkingData;
                    adjustedPoints = {
                        p: { x: p.x + linkData.skippedZoneLeft, y: Math.abs((p.y - linkData.topAboveZone) + linkData.skippedZoneTop) }
                    };
                }
                else {
                    // topAboveCurrentZone will be the height of zones above the current zone which made up the current output page
                    // zoneLeft will be left value of the current zone. zoneTop is the top edge from which the current zone is made
                    // we need to substract topAboveCurrentZone from y value as y value in zone will be w.r.t output page before linking.
                    adjustedPoints = {
                        p: { x: p.x + linkProps.zoneLeft, y: Math.abs((p.y - linkProps.topAboveCurrentZone) + linkProps.zoneTop) }
                    };
                }
            }
            else {
                adjustedPoints = {
                    p: { x: p.x, y: Math.abs(p.y - linkProps.topAboveCurrentZone) }
                };
            }
        }
        else {
            adjustedPoints = {
                p: { x: p.x, y: p.y }
            };
        }
        return adjustedPoints;
    };
    /**
     * Calculates the stitched image gap offset
     * @param y1
     */
    AcetateBase.prototype.findStitchedImageGapOffset = function (y1) {
        var stitchedImageSeperator = 0;
        var annotationOverlayParentElement = this.props.getAnnotationOverlayElement ?
            this.props.getAnnotationOverlayElement : undefined;
        return overlayHelper.findStitchedImageGapOffset(y1, this.rotatedAngle, annotationOverlayParentElement);
    };
    /**
     *  Sets SVG view box
     * @param x
     * @param y
     * @param width
     * @param height
     */
    AcetateBase.prototype.setSVGViewBox = function (x, y, width, height) {
        return [x, y, width, height].join(' ');
    };
    /**
     * return point for acetate
     * @param x
     * @param y
     * @param pointName
     */
    AcetateBase.prototype.renderAcetatePoint = function (x, y, pointName) {
        return (React.createElement("svg", {x: x.toString() + '%', y: y.toString() + '%', id: pointName, key: pointName, className: 'overlay-plus-svg ' + pointName}, React.createElement("use", {transform: 'translate(-6,-6)', xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#overlay-point', className: 'overlay-plus-normal', width: '12', height: '12'}), React.createElement("use", {transform: 'translate(-6,-6)', xmlnsXlink: 'http://www.w3.org/1999/xlink', xlinkHref: '#overlay-point-hover', className: 'overlay-plus-hover', width: '30', height: '30'}), React.createElement("rect", {className: 'overlay-mover-area', width: '30', height: '30', transform: 'translate(-15,-15)'}), React.createElement("circle", {cx: '0', cy: '0', r: '4', stroke: 'black', strokeWidth: '1', fill: 'white', className: 'overlay-circle-point'})));
    };
    /**
     * return image dimension
     */
    AcetateBase.prototype.getImageDimension = function () {
        return overlayHelper.getImageDimension(this.props.imageProps);
    };
    /**
     * return line for acetate
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param className
     */
    AcetateBase.prototype.renderAcetateLine = function (x1, y1, x2, y2, className) {
        return (React.createElement("line", {x1: x1.toString() + '%', x2: x2.toString() + '%', y1: y1.toString() + '%', y2: y2.toString() + '%', className: className}));
    };
    /**
     * get color for acetate
     * @param color
     */
    AcetateBase.prototype.getAcetateColor = function (color) {
        var colorClass = '';
        switch (color) {
            case enums.OverlayColor.red:
                colorClass = 'red-overlay';
                break;
            case enums.OverlayColor.black:
                colorClass = 'black-overlay';
                break;
            case enums.OverlayColor.blue:
                colorClass = 'blue-overlay';
                break;
            case enums.OverlayColor.green:
                colorClass = 'green-overlay';
                break;
            case enums.OverlayColor.pink:
                colorClass = 'pink-overlay';
                break;
            case enums.OverlayColor.yellow:
                colorClass = 'yellow-overlay';
                break;
        }
        return colorClass;
    };
    Object.defineProperty(AcetateBase.prototype, "currentZoomPercentage", {
        /* return current zoom percentage */
        get: function () {
            return responseStore.instance.currentZoomPercentage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * render ruler
     * @param stateAdjuster
     */
    AcetateBase.prototype.reRender = function (stateAdjuster) {
        if (stateAdjuster === void 0) { stateAdjuster = 0; }
        this.setState({
            renderedOn: Date.now() + stateAdjuster
        });
    };
    Object.defineProperty(AcetateBase.prototype, "rotatedAngle", {
        /* return rotated angle for current page */
        get: function () {
            return overlayHelper.getRotatedAngle(this.props.imageProps.pageNo, this.props.imageProps.linkedOutputPageNo);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AcetateBase.prototype, "isAcetateMoving", {
        /* return true if acetate is moving */
        get: function () {
            return qigStore.instance.isAcetateMoving;
        },
        enumerable: true,
        configurable: true
    });
    return AcetateBase;
}(pureRenderComponent));
module.exports = AcetateBase;
//# sourceMappingURL=acetatebase.js.map