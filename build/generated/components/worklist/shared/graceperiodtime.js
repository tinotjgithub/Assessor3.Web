"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
    React component for time to end the grace period
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var localeHelper = require('../../../utility/locale/localehelper');
var stringHelper = require('../../../utility/generic/stringhelper');
/**
 * React component class for time to end the grace period
 */
var GracePeriodTime = (function (_super) {
    __extends(GracePeriodTime, _super);
    /**
     * Constructor for Grace period time
     * @param props
     * @param state
     */
    function GracePeriodTime(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     */
    GracePeriodTime.prototype.render = function () {
        var elementId = 'dtGrace_' + this.props.id;
        var resourceString = this.props.timeToEndOfGracePeriod === 1 ? 'marking.worklist.response-data.hour-to-end-of-grace' :
            'marking.worklist.response-data.hours-to-end-of-grace';
        var remaingPeriod = stringHelper.format(localeStore.instance.TranslateText(resourceString), [localeHelper.toLocaleString(this.props.timeToEndOfGracePeriod)]);
        remaingPeriod = (this.props.isTileView) ? remaingPeriod +
            localeStore.instance.TranslateText('marking.worklist.tile-view-labels.to-end-of-grace-period') : remaingPeriod;
        return ((this.props.isTileView) ?
            React.createElement("div", {id: elementId, className: 'small-text '}, remaingPeriod)
            :
                React.createElement("div", {className: ' wl-grace-period'}, React.createElement("span", {id: elementId, className: 'small-text'}, remaingPeriod)));
    };
    return GracePeriodTime;
}(pureRenderComponent));
module.exports = GracePeriodTime;
//# sourceMappingURL=graceperiodtime.js.map