"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var classNames = require('classnames');
var toolbarStore = require('../../../stores/toolbar/toolbarstore');
/**
 * React component class for AnnotationBin.
 */
var AnnotationBin = (function (_super) {
    __extends(AnnotationBin, _super);
    /**
     * @constructor
     */
    function AnnotationBin(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.locationStyle = {};
        /**
         * Invoked on stamp pan to an area where deletion of the annotation dragged is possible
         */
        this.onStampPanToDeleteArea = function (canDelete, xPos, yPos) {
            _this.locationStyle = {
                'top': yPos,
                'left': xPos
            };
            /* Defect Fix: #56738 Unwanted rerendering occured due to renderedOn state has been corrected
               we don't need to re-render bin icon if bin icon is not displaying for avoiding performance issues */
            if (!canDelete) {
                _this.setState({
                    isVisible: false
                });
            }
            else {
                _this.setState({
                    isVisible: true,
                    renderedOn: Date.now()
                });
            }
        };
        this.state = {
            renderedOn: 0,
            isVisible: false
        };
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    AnnotationBin.prototype.componentDidMount = function () {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
    };
    /**
     * Unsubscribe events
     */
    AnnotationBin.prototype.componentWillUnmount = function () {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
    };
    /**
     * Render method
     */
    AnnotationBin.prototype.render = function () {
        return (React.createElement("div", {className: classNames('annotation-bin', { 'open': this.state.isVisible }), id: 'annotationbin', style: this.locationStyle}, React.createElement("span", {className: 'svg-icon'}, React.createElement("svg", {viewBox: '0 0 32 32', className: 'icon-bin'}, React.createElement("use", {xlinkHref: '#icon-bin'})))));
    };
    return AnnotationBin;
}(pureRenderComponent));
module.exports = AnnotationBin;
//# sourceMappingURL=annotationbin.js.map