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
var localeHelper = require('../../../utility/locale/localehelper');
var enums = require('../../utility/enums');
var qiqStore = require('../../../stores/qigselector/qigstore');
var classNames = require('classnames');
var targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
var TargetItem = (function (_super) {
    __extends(TargetItem, _super);
    /**
     * constructor
     * @param props
     * @param state
     */
    function TargetItem(props, state) {
        _super.call(this, props, state);
        this.onTargetClickFn = this.onTargetClick.bind(this, this.props.target.markingModeID, this.props.remarkRequestTypeID, this.props.isDirectedRemark);
    }
    /**
     * Render component
     */
    TargetItem.prototype.render = function () {
        var markingModeName;
        if (this.props.target.markingModeID === enums.MarkingMode.Remarking) {
            markingModeName = enums.RemarkRequestType[this.props.remarkRequestTypeID];
        }
        else {
            markingModeName = enums.MarkingMode[this.props.target.markingModeID];
        }
        if (this.props.target.markingModeID === enums.MarkingMode.ES_TeamApproval &&
            qiqStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false) {
            markingModeName = 'SecondStandardisation';
        }
        return (React.createElement("li", {id: 'target_' + markingModeName, className: classNames('panel', {
            'completed': (this.props.target.isTargetCompleted
                || this.props.isOverAllTargetCompleted), 'disabled': this.props.isDisabled, 'open': this.props.isSelected,
            'active': markingModeName === 'Simulation'
        }), onClick: this.onTargetClickFn}, React.createElement("span", {id: markingModeName + '_status', className: this.determineMenuClass()}, React.createElement("span", {id: markingModeName + '_indicator', className: this.determineStatusClass()}), this.getOpenResponsesCount()), React.createElement("a", {href: 'javascript:void(0)', id: markingModeName + '_title', title: markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
            localeStore.instance.TranslateText('generic.marking-modes.Marking') :
            localeStore.instance.TranslateText('generic.marking-modes.' + markingModeName), className: 'left-menu-link panel-link'}, React.createElement("span", {id: markingModeName + '_menutext', className: 'menu-text large-text'}, markingModeName === enums.getEnumString(enums.MarkingMode, enums.MarkingMode.LiveMarking) ?
            localeStore.instance.TranslateText('generic.marking-modes.Marking') :
            localeStore.instance.TranslateText('generic.marking-modes.' + markingModeName)), this.renderHighlightedCompletedText(), this.renderRemainingDaysSection(), this.renderMarkingCompletionDate(markingModeName))));
    };
    /**
     * Handle the click event in the Target.
     * @param selectedMarkingModeID
     */
    TargetItem.prototype.onTargetClick = function (selectedMarkingModeID, remarkRequestTypeId, isDirectedRemark) {
        if (!this.props.isDisabled && !this.props.isSelected) {
            this.props.onClickCallback(selectedMarkingModeID, remarkRequestTypeId, isDirectedRemark);
        }
    };
    /**
     * Method which gets the formatted date to be shown in the UI
     * @param markingCompletionDate
     */
    TargetItem.prototype.getFormattedMarkingCompletionDate = function () {
        var targetCompletedDateString = (this.props.target.isTargetCompleted
            || this.props.isOverAllTargetCompleted) ? this.props.target.targetCompletedDate.toString() :
            this.props.target.markingTargetDate.toString();
        var targetCompletedDate = new Date(targetCompletedDateString);
        return localeHelper.toLocaleDateString(targetCompletedDate);
    };
    /**
     * Get the remaining days for the completion date. Shouldn't be negetive.
     * If target is met return the value as 0.
     * @param markingCompletionDate
     */
    TargetItem.prototype.remainingDaysForMarkingCompletion = function () {
        var today = new Date();
        var markingDate = new Date(this.props.target.markingTargetDate.toString());
        // Converting milli seconds to 1 day.
        var oneDay = 1000 * 60 * 60 * 24;
        var noOfDays = (Math.ceil((markingDate.getTime() - today.getTime()) / (oneDay)));
        if (noOfDays < 0) {
            return 0;
        }
        else {
            return noOfDays;
        }
    };
    /**
     * Deteremines the menu class
     */
    TargetItem.prototype.determineMenuClass = function () {
        return (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) ? 'menu-count-completed' : 'menu-count';
    };
    /**
     * Renders the highlighted completed text
     * @returns
     */
    TargetItem.prototype.renderHighlightedCompletedText = function () {
        if (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return (React.createElement("span", {className: 'menu-highlight-text'}, localeStore.instance.TranslateText('marking.worklist.left-panel.target-completed')));
        }
    };
    /**
     * Renders the remaining day section
     */
    TargetItem.prototype.renderRemainingDaysSection = function () {
        if (this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return null;
        }
        if (!this.props.target.isCurrentTarget || this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return null;
        }
        var style = {
            'display': 'block'
        };
        return (React.createElement("span", {className: 'menu-highlight-text', style: style}, React.createElement("span", {id: enums.MarkingMode[this.props.target.markingModeID] + '_days_until_target_date', className: 'remaining-date'}, this.remainingDaysForMarkingCompletion(), " "), localeStore.instance.TranslateText('marking.worklist.left-panel.days-until-target')));
    };
    /**
     * Method to render marking completion date.
     * @param markingModeName
     */
    TargetItem.prototype.renderMarkingCompletionDate = function (markingModeName) {
        if (this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return null;
        }
        return (React.createElement("div", {id: markingModeName + '_target_date', className: 'menu-text-small small-text'}, React.createElement("span", {className: 'menu-label'}, localeStore.instance.TranslateText('marking.worklist.left-panel.target' +
            ((this.props.target.isTargetCompleted
                || this.props.isOverAllTargetCompleted) ? '-completed-date-label' : '-date-label'))), React.createElement("span", {id: markingModeName + '_datetext', className: 'date-text'}, this.getFormattedMarkingCompletionDate())));
    };
    /**
     * Method to determine the status class to apply for the item.
     */
    TargetItem.prototype.determineStatusClass = function () {
        // Determine the Status of the target item. tick/dots/pencil.
        // TargetComplete = tick, Current = pencil, Future = dots.
        if (this.props.target.isTargetCompleted || this.props.isOverAllTargetCompleted) {
            return 'sprite-icon tick-circle-icon menu-count-completed';
        }
        else if (this.props.target.isCurrentTarget && this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return '';
        }
        else if (this.props.target.isCurrentTarget || this.props.target.markingModeID === enums.MarkingMode.Remarking
            && targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.LiveMarking) {
            return this.props.target.markingModeID === enums.MarkingMode.LiveMarking
                || this.props.target.markingModeID === enums.MarkingMode.Remarking ? '' : 'sprite-icon pencil-icon';
        }
        else {
            return 'sprite-icon dot-dot-dot-icon';
        }
    };
    /**
     * This method will return the open responses count
     */
    TargetItem.prototype.getOpenResponsesCount = function () {
        if (this.props.target.isCurrentTarget &&
            this.props.target.markingModeID === enums.MarkingMode.LiveMarking && !this.props.target.isTargetCompleted
            || (this.props.target.markingModeID === enums.MarkingMode.Remarking && !this.props.target.isTargetCompleted
                && targetSummaryStore.instance.getCurrentTarget().markingModeID === enums.MarkingMode.LiveMarking)
            || this.props.target.isCurrentTarget && this.props.target.markingModeID === enums.MarkingMode.Simulation) {
            return this.props.target.examinerProgress.openResponsesCount;
        }
    };
    return TargetItem;
}(pureRenderComponent));
module.exports = TargetItem;
//# sourceMappingURL=targetitem.js.map