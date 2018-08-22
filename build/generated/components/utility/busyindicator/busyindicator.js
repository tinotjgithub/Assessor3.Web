"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Busy Indicator.
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var enums = require('../enums');
var busyIndicatorHelper = require('./busyindicatorhelper');
var timerHelper = require('../../../utility/generic/timerhelper');
/**
 * React component class for Busy Indicator implementation.
 */
var BusyIndicator = (function (_super) {
    __extends(BusyIndicator, _super);
    /**
     * @constructor
     * @param props
     * @param state
     */
    function BusyIndicator(props, state) {
        _super.call(this, props, state);
        this.timeInterval = 0;
        this.selfDistruct = this.selfDistruct.bind(this);
    }
    /**
     * Render component
     */
    BusyIndicator.prototype.render = function () {
        if (!this.props.isBusy) {
            return null;
        }
        if (this.props.busyIndicatorInvoker === enums.BusyIndicatorInvoker.loadingResponse &&
            !this.props.doShowDialog) {
            return null;
        }
        /** decide class to be added based on the response mode */
        var wrapperClass = 'loading';
        var busyLoaderClass = 'worklist-loader vertical-middle';
        wrapperClass += busyIndicatorHelper.getResponseModeBusyClass(this.props.responseMode);
        if (!this.props.showBackgroundScreen) {
            if (this.props.isMarkingBusy) {
                wrapperClass += ' marking-wrapper';
            }
            else {
                wrapperClass += ' worklist-wrapper';
            }
        }
        if (this.props.isMarkingBusy) {
            busyLoaderClass = 'marking-loader vertical-middle';
        }
        var busyIndicatorParameter = busyIndicatorHelper.getBusyIndicatorParameter(this.props.busyIndicatorInvoker, this.props.isOffline);
        return (React.createElement("div", {className: busyIndicatorParameter.BusyIndicatorStyle}, React.createElement("div", {className: wrapperClass}, React.createElement("div", {className: busyLoaderClass, id: this.props.id, key: 'key_' + this.props.id}, React.createElement("span", {className: 'loader middle-content'}, React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("span", {className: 'dot'}), React.createElement("div", {className: 'loading-text padding-top-30'}, busyIndicatorParameter.BusyIndicatorText))))));
    };
    /**
     * Component did mount
     */
    BusyIndicator.prototype.componentDidMount = function () {
        this.addSelfDistruction();
    };
    /**
     * component did update
     */
    BusyIndicator.prototype.componentDidUpdate = function () {
        this.addSelfDistruction();
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    BusyIndicator.prototype.componentWillUnmount = function () {
        // clear Interval while moving out from response container
        timerHelper.clearInterval(this.timeInterval);
    };
    /**
     * Invoke self distruction
     */
    BusyIndicator.prototype.selfDistruct = function () {
        if (this.props.initiateSelfDistruction) {
            this.props.initiateSelfDistruction();
            timerHelper.clearInterval(this.timeInterval);
        }
    };
    /**
     * Add self discruction time
     */
    BusyIndicator.prototype.addSelfDistruction = function () {
        if (this.props.selfDistructAt === undefined) {
            return;
        }
        if (this.props.isBusy) {
            this.timeInterval = timerHelper.setInterval(this.props.selfDistructAt, this.selfDistruct, this.timeInterval);
        }
        else {
            timerHelper.clearInterval(this.timeInterval);
        }
    };
    return BusyIndicator;
}(pureRenderComponent));
module.exports = BusyIndicator;
//# sourceMappingURL=busyindicator.js.map