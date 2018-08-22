"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var localeHelper = require('../../utility/locale/localehelper');
var localeStore = require('../../stores/locale/localestore');
/**
 * Class for the Target Submit section
 */
var TargetDate = (function (_super) {
    __extends(TargetDate, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function TargetDate(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for Qig group.
     */
    TargetDate.prototype.render = function () {
        if (this.props.displayTargetDate) {
            return (React.createElement("div", {key: this.props.id + '_targetDateSection', className: 'target-date-holder small-text grey-text clearfix align-middle'}, React.createElement("span", {id: this.props.id + '_targetDateText'}, localeStore.instance.TranslateText('marking.worklist.left-panel.target-date-label') + ' '), React.createElement("span", {id: this.props.id + '_targetDate'}, this.getFormattedMarkingCompletionDate(this.props.markingCompletionDate))));
        }
        else {
            return null;
        }
    };
    /**
     * Method which gets the formatted date to be shown in the UI
     * @param markingTargetDate
     */
    TargetDate.prototype.getFormattedMarkingCompletionDate = function (markingTargetDate) {
        var targetCompletedDate = new Date(markingTargetDate.toString());
        return localeHelper.toLocaleDateString(targetCompletedDate);
    };
    return TargetDate;
}(pureRenderComponent));
module.exports = TargetDate;
//# sourceMappingURL=targetdate.js.map