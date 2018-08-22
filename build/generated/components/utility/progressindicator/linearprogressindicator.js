"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var stringHelper = require('../../../utility/generic/stringhelper');
var qigvalidationHelper = require('../qigselector/qigselectorvalidationhelper');
/**
 * Class for the Linear Progress Indicator.
 */
var LinearProgressIndicator = (function (_super) {
    __extends(LinearProgressIndicator, _super);
    function LinearProgressIndicator() {
        _super.apply(this, arguments);
        this._openResponseCount = 0;
        this._pendingResponseCount = 0;
        this._closedResponseCount = 0;
        this.qigHelper = new qigvalidationHelper();
    }
    /**
     * Render method for Linear Progress Indicator.
     */
    LinearProgressIndicator.prototype.render = function () {
        if (this.props.qigValidationResult.displayProgressBar) {
            // The maximum marking limit.
            var maximumMarkingLimit = 0;
            if (this.props.isAggregatedTarget) {
                var validationResult = this.props.qigValidationResult;
                // If the qigs is included in the aggregated a target, used aggregated counts.
                this._openResponseCount = validationResult.aggregatedOpenResponsesCount;
                this._pendingResponseCount = validationResult.aggregatedPendingResponsesCount;
                this._closedResponseCount = validationResult.aggregatedClosedResponsesCount;
                maximumMarkingLimit = validationResult.aggregatedMaxMarkingLimit;
            }
            else {
                // Invoking the method to find the response count in open/pending/closed worklist.
                var responseCounts = this.qigHelper.findResponseCountInWorklist(this.props.directedRemarkMarkingTargets, this.props.currentMarkingTarget);
                this._openResponseCount = responseCounts[0];
                this._pendingResponseCount = responseCounts[1];
                this._closedResponseCount = responseCounts[2];
                // For Correcting the progress values, If the target is 0
                maximumMarkingLimit = this.props.currentMarkingTarget.maximumMarkingLimit === 0 ? 1
                    : this.props.currentMarkingTarget.maximumMarkingLimit;
            }
            // Total response count.
            var totalResponsesCount = this._closedResponseCount + this._pendingResponseCount + this._openResponseCount;
            // Get the closed response count. It can be more than 1, If so limit to 100 for progress representation
            var closedValue = this._closedResponseCount / maximumMarkingLimit;
            var pendingValue = 0;
            var openValue = 0;
            if (closedValue > 1) {
                closedValue = 1;
            }
            else {
                // Get the pending response count. If it exceeds 1, calculate the closed as well as pending for progress representation
                pendingValue = (this._closedResponseCount + this._pendingResponseCount) / maximumMarkingLimit;
                if (pendingValue > 1) {
                    pendingValue = 1;
                }
                else {
                    // Get the open response count.
                    // If it exceeds 1, calculate the closed, pending as well as pending for progress representation
                    openValue = totalResponsesCount / maximumMarkingLimit;
                    if (openValue > 1) {
                        openValue = 1;
                    }
                }
            }
            // Convert the value to percentage.
            var openResponsePercentage = (openValue * 100) + '%';
            var pendingResponsePercentage = (pendingValue * 100) + '%';
            var closedResponsePercentage = (closedValue * 100) + '%';
            if (totalResponsesCount > maximumMarkingLimit) {
                return (React.createElement("div", {id: this.props.id + '_progress', className: 'linear-progress-holder'}, React.createElement("div", {className: 'progress progress1 open', style: { width: openResponsePercentage }, id: this.props.id + '_openProgress'}), React.createElement("div", {className: 'progress progress2 ingrace', style: { width: pendingResponsePercentage }, id: this.props.id + '_pendingProgress'}), React.createElement("div", {className: 'progress progress3 closed', style: { width: closedResponsePercentage }, id: this.props.id + '_closedProgress'}), React.createElement("div", {className: 'progress-track', id: this.props.id + '_progressTrack'})));
            }
            else {
                var progressIndicatorTooltip = stringHelper.format(localeStore.instance.TranslateText('home.qig-data.marking-progress-tooltip'), [String(this._closedResponseCount),
                    String(this._pendingResponseCount),
                    String(this._openResponseCount)]);
                return (React.createElement("div", {title: progressIndicatorTooltip, id: this.props.id + '_progress', className: 'linear-progress-holder'}, React.createElement("div", {className: 'progress progress1 open', style: { width: openResponsePercentage }, id: this.props.id + '_openProgress'}), React.createElement("div", {className: 'progress progress2 ingrace', style: { width: pendingResponsePercentage }, id: this.props.id + '_pendingProgress'}), React.createElement("div", {className: 'progress progress3 closed', style: { width: closedResponsePercentage }, id: this.props.id + '_closedProgress'}), React.createElement("div", {className: 'progress-track', id: this.props.id + '_progressTrack'})));
            }
        }
        else {
            return null;
        }
    };
    return LinearProgressIndicator;
}(pureRenderComponent));
module.exports = LinearProgressIndicator;
//# sourceMappingURL=linearprogressindicator.js.map