"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var localeStore = require('../../../stores/locale/localestore');
var TargetDetails = require('./targetdetails');
var TargetItem = require('./targetitem');
var ProgressIndicator = require('../../utility/progressindicator/circularprogressindicator');
var enums = require('../../utility/enums');
var classNames = require('classnames');
var LiveOrPooledRemarkTargetItem = (function (_super) {
    __extends(LiveOrPooledRemarkTargetItem, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function LiveOrPooledRemarkTargetItem(props, state) {
        _super.call(this, props, state);
        this.onTargetClickFun = this.onTargetClick.bind(this, this.props.target.markingModeID, this.props.remarkRequestTypeID, this.props.isDirectedRemark);
        var markingModeName;
        if (this.props.target.markingModeID === enums.MarkingMode.Remarking) {
            this.markingModeName = enums.RemarkRequestType[this.props.remarkRequestTypeID];
        }
        else {
            this.markingModeName = enums.MarkingMode[this.props.target.markingModeID];
        }
    }
    /**
     * Render component
     */
    LiveOrPooledRemarkTargetItem.prototype.render = function () {
        var idString = this.props.id;
        //If the maximum remarking target is 0, then we don't have to show the particular remark tab
        if (this.props.target.maximumMarkingLimit === 0 && this.props.remarkRequestTypeID !== undefined) {
            return null;
        }
        else {
            return (React.createElement("li", {id: 'target_' + this.markingModeName, className: classNames('panel', {
                'completed': (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted),
                'disabled': this.props.isDisabled, 'open': this.props.isSelected
            }), onClick: this.onTargetClickFun}, this.renderTargetIndicator(), this.renderProgressIndicatorSection(idString), this.renderTickSection(), React.createElement("a", {href: 'javascript:void(0)', id: this.markingModeName + '_title', className: 'left-menu-link panel-link', title: this.markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
                localeStore.instance.TranslateText('generic.marking-modes.Marking') :
                localeStore.instance.TranslateText('generic.marking-modes.' + this.markingModeName)}, React.createElement("span", {id: this.markingModeName + '_menutext', className: 'menu-text large-text'}, this.markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
                localeStore.instance.TranslateText('generic.marking-modes.Marking') :
                localeStore.instance.TranslateText('generic.marking-modes.' + this.markingModeName)), this.renderRemaingDaysSection(), React.createElement("div", {className: 'menu-text-small small-text'}, React.createElement("span", {id: this.markingModeName + '_target_date', className: 'menu-label'}, localeStore.instance.TranslateText('marking.worklist.left-panel.target' +
                ((this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted)
                    ? '-completed-date-label' : '-date-label'))), React.createElement("span", {id: this.markingModeName + '_targetCompleteDate', className: 'date-text'}, this.getFormattedMarkingCompletionDate()))), this.renderTargetDetails()));
        }
    };
    /**
     * Render Target details
     */
    LiveOrPooledRemarkTargetItem.prototype.renderTargetDetails = function () {
        if (this.props.target.markingModeID === enums.MarkingMode.LiveMarking) {
            return (React.createElement(TargetDetails, {id: this.props.id, key: this.props.id, markingTargetsSummary: this.props.target, selectedLanguage: this.props.selectedLanguage, renderdOn: this.props.renderedOn, directedRemarkTarget: this.props.directedRemarkTarget, isTeamManagementMode: this.props.isTeamManagementMode}));
        }
    };
    /**
     * Render the Target Status section, If target is not completed then display open response count for progress wheel animation
     */
    LiveOrPooledRemarkTargetItem.prototype.renderTargetIndicator = function () {
        if ((this.props.target.isCurrentTarget || this.props.target.markingModeID === enums.MarkingMode.Remarking)
            && !this.props.isDisabled && (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted)) {
            return React.createElement("span", {id: this.markingModeName + '_status', className: 'menu-count graph-transition'}, this.getTotalOpenResponsesCount());
        }
        else if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return (React.createElement("span", {id: this.markingModeName + '_status', className: 'menu-count'}, React.createElement("span", {id: this.markingModeName + '_dotindicator', className: 'sprite-icon dot-dot-dot-icon'})));
        }
    };
    /**
     * Render the tick section
     * @returns
     */
    LiveOrPooledRemarkTargetItem.prototype.renderTickSection = function () {
        if (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return (React.createElement("span", {id: this.markingModeName + '_status', className: 'menu-count-completed'}, React.createElement("span", {className: 'sprite-icon tick-circle-icon'})));
        }
    };
    /**
     * Renders the progress indicator section
     * @param idString
     */
    LiveOrPooledRemarkTargetItem.prototype.renderProgressIndicatorSection = function (idString) {
        if (!this.props.isOverAllTargetCompleted && !this.props.target.isTargetCompleted && this.props.isSelected) {
            return (React.createElement("div", {className: 'radial-progress-holder animated', id: this.markingModeName + '_progress'}, this.renderProgressIndicator(), this.renderProgressIndicatorContents(idString)));
        }
    };
    /**
     * Render the progress indicator contents, If target is completed no need to display this section
     */
    LiveOrPooledRemarkTargetItem.prototype.renderProgressIndicatorContents = function (idString) {
        var directedRemarkResponseCountList = this.getDirectedRemarkRequestProgress();
        var totalResponsesCount = this.props.target.examinerProgress.closedResponsesCount +
            +this.props.target.examinerProgress.pendingResponsesCount
            + this.props.target.examinerProgress.openResponsesCount
            + (isNaN(this.props.target.examinerProgress.atypicalOpenResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalOpenResponsesCount)
            + (isNaN(this.props.target.examinerProgress.atypicalPendingResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalPendingResponsesCount)
            + (isNaN(this.props.target.examinerProgress.atypicalClosedResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalClosedResponsesCount)
            + directedRemarkResponseCountList[0]
            + directedRemarkResponseCountList[1]
            + directedRemarkResponseCountList[2];
        // Rendering over allocation
        var overAllocationIndicator = this.renderOverAllocationIndicator(this.props.target, totalResponsesCount);
        if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return React.createElement("div", {className: 'inset-text'}, overAllocationIndicator, React.createElement("div", {id: 'targetSummaryCount' + idString, className: 'large-text'}, this.props.target.examinerProgress.closedResponsesCount
                + this.props.target.examinerProgress.pendingResponsesCount
                + (isNaN(this.props.target.examinerProgress.atypicalPendingResponsesCount) ?
                    0 : this.props.target.examinerProgress.atypicalPendingResponsesCount)
                + (isNaN(this.props.target.examinerProgress.atypicalClosedResponsesCount) ?
                    0 : this.props.target.examinerProgress.atypicalClosedResponsesCount)
                + directedRemarkResponseCountList[1]
                + directedRemarkResponseCountList[2], "/", (this.props.target.maximumMarkingLimit)), React.createElement("div", {className: 'small-text', id: 'submitted-text' + idString}, localeStore.instance.TranslateText('marking.worklist.left-panel.submitted-count-label')));
        }
    };
    /**
     * Renders the over allocation indicator in the progress summary
     * @param target
     * @param totalResponsesCount
     */
    LiveOrPooledRemarkTargetItem.prototype.renderOverAllocationIndicator = function (target, totalResponsesCount) {
        var currentlyInOverAllocation = target.overAllocationCount > 0 ?
            totalResponsesCount >= target.maximumMarkingLimit : false;
        return currentlyInOverAllocation ?
            React.createElement("span", {className: 'sprite-icon lock-open-icon', title: localeStore.instance.TranslateText('marking.worklist.left-panel.over-allocation-tooltip')}) : null;
    };
    /**
     * Render the progress indicator, If target is completed no need to display this section
     */
    LiveOrPooledRemarkTargetItem.prototype.renderProgressIndicator = function () {
        if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return React.createElement(ProgressIndicator, {size: 104, startDegree: 0, endDegree: 360, trackWidth: 6, trackStyle: 'target-track-style', progress: this.getProgressDetails()});
        }
    };
    /**
     * Get the remaining days section, If target is completed no need to display the section
     * @param markingTarget
     */
    LiveOrPooledRemarkTargetItem.prototype.renderRemaingDaysSection = function () {
        if (!this.props.target.isTargetCompleted && !this.props.isOverAllTargetCompleted) {
            return React.createElement("span", {id: this.markingModeName + '_targetremainingDays', className: 'menu-highlight-text'}, this.remainingDaysForMarkingCompletion(), ' ' + localeStore.instance.TranslateText('marking.worklist.left-panel.days-until-target'));
        }
        else {
            return React.createElement("span", {id: this.markingModeName + '_targetremainingDays', className: 'menu-highlight-text'}, localeStore.instance.TranslateText('marking.worklist.left-panel.target-completed'));
        }
    };
    /**
     * Method will return an array of progress items.
     */
    LiveOrPooledRemarkTargetItem.prototype.getProgressDetails = function () {
        var progressItems = new Array();
        var directedRemarkResponseCountList = this.getDirectedRemarkRequestProgress();
        var total = this.props.target.maximumMarkingLimit;
        // If there are any responses, then colour should be applied to the progress wheel
        if (total > 0) {
            var closedResponsesCount = 0;
            var inGraceResponsesCount = 0;
            var openResponsesCount = 0;
            // Determining the closed responses count
            closedResponsesCount = this.props.target.examinerProgress.closedResponsesCount
                + (isNaN(this.props.target.examinerProgress.atypicalClosedResponsesCount) ?
                    0 : this.props.target.examinerProgress.atypicalClosedResponsesCount)
                + directedRemarkResponseCountList[2];
            // If closed responses count doesn't meet the actual marking target, then determine the in-grace responses count
            if (closedResponsesCount < total) {
                // Determining the in-grace responses count
                inGraceResponsesCount = this.props.target.examinerProgress.pendingResponsesCount
                    + (isNaN(this.props.target.examinerProgress.atypicalPendingResponsesCount) ?
                        0 : this.props.target.examinerProgress.atypicalPendingResponsesCount)
                    + directedRemarkResponseCountList[1];
                // If the in-grace + closed responses count doesn't meet the actual marking target,
                // then determine the open responses count
                if ((inGraceResponsesCount + closedResponsesCount) < total) {
                    // Determining the open responses count
                    openResponsesCount = this.props.target.examinerProgress.openResponsesCount
                        + (isNaN(this.props.target.examinerProgress.atypicalOpenResponsesCount) ?
                            0 : this.props.target.examinerProgress.atypicalOpenResponsesCount)
                        + directedRemarkResponseCountList[0];
                    // If the open + in-grace + closed responses count crosses the actual marking target,
                    // then the open responses count should be the difference between the marking target limit
                    // and the sum of closed and in-grace responses
                    if ((openResponsesCount + inGraceResponsesCount + closedResponsesCount) > total) {
                        openResponsesCount = total - (closedResponsesCount + inGraceResponsesCount);
                    }
                }
                else {
                    // If the in-grace + closed responses count crosses the actual marking target,
                    // then the in-grace responses count should be the difference between the marking target limit
                    // and the count of closed responses
                    inGraceResponsesCount = total - closedResponsesCount;
                }
            }
            else {
                // If the closed responses count crosses the actual marking target,
                // then the closed responses count should be the set as the marking target limit
                closedResponsesCount = total;
            }
            // Determining the closed responses percentage
            var closedPercentage = 100 / total * closedResponsesCount;
            // Determining the pending responses percentage
            var inGracePercentage = 100 / total * inGraceResponsesCount;
            // Determining the open responses percentage
            var openPercentage = 100 / total * openResponsesCount;
            if (closedPercentage > 0) {
                progressItems.push({ progress: closedPercentage, className: 'target-progress-style' });
            }
            if (inGracePercentage > 0) {
                progressItems.push({ progress: inGracePercentage, className: 'target-progress-style2' });
            }
            if (openPercentage > 0) {
                progressItems.push({ progress: openPercentage, className: 'target-progress-style1' });
            }
        }
        return progressItems;
    };
    /**
     * Get directed remark request progress count
     */
    LiveOrPooledRemarkTargetItem.prototype.getDirectedRemarkRequestProgress = function () {
        var directedRemarkTargets = this.props.directedRemarkTarget;
        var directedRemarkResponseCountList = [];
        var open = 0;
        var closed = 0;
        var inGrace = 0;
        if (directedRemarkTargets != null && directedRemarkTargets !== undefined) {
            var directedRemarkTargetsList = directedRemarkTargets.map(function (markingTarget) {
                if (markingTarget.markingModeID === enums.MarkingMode.Remarking
                    && markingTarget.examinerProgress.isDirectedRemark === true) {
                    open += markingTarget.examinerProgress.openResponsesCount;
                    inGrace += markingTarget.examinerProgress.pendingResponsesCount;
                    closed += markingTarget.examinerProgress.closedResponsesCount;
                }
            });
        }
        directedRemarkResponseCountList.push(open);
        directedRemarkResponseCountList.push(inGrace);
        directedRemarkResponseCountList.push(closed);
        return directedRemarkResponseCountList;
    };
    /**
     * Method to return the total open responses count
     */
    LiveOrPooledRemarkTargetItem.prototype.getTotalOpenResponsesCount = function () {
        var directedRemarkResponseCountList = this.getDirectedRemarkRequestProgress();
        var openResponseCount = 0;
        openResponseCount += this.props.target.examinerProgress.openResponsesCount
            + (isNaN(this.props.target.examinerProgress.atypicalOpenResponsesCount) ?
                0 : this.props.target.examinerProgress.atypicalOpenResponsesCount)
            + directedRemarkResponseCountList[0];
        return openResponseCount;
    };
    return LiveOrPooledRemarkTargetItem;
}(TargetItem));
module.exports = LiveOrPooledRemarkTargetItem;
//# sourceMappingURL=liveorpooledremarktargetitem.js.map