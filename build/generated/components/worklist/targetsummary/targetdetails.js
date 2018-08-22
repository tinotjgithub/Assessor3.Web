"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var enums = require('../../utility/enums');
var WorklistType = require('./worklisttype');
var sortHelper = require('../../../utility/sorting/sorthelper');
var comparerList = require('../../../utility/sorting/sortbase/comparerlist');
var Immutable = require('immutable');
/**
 * Class for the Target Details => Progress Graph, Marking Name + Target section and the worklist items for the target.
 */
var TargetDetails = (function (_super) {
    __extends(TargetDetails, _super);
    /**
     * Constructor for Target Details
     * @param props
     */
    function TargetDetails(props) {
        _super.call(this, props, null);
    }
    /**
     * Render component
     */
    TargetDetails.prototype.render = function () {
        return (React.createElement("div", {className: 'panel-content clearfix', "aria-hidden": 'true'}, this.renderWorklistTypes()));
    };
    /**
     * Render worklist types
     */
    TargetDetails.prototype.renderWorklistTypes = function () {
        if (this.props.markingTargetsSummary.markingModeID === enums.MarkingMode.LiveMarking) {
            var directedRemarkRequestRenderer = this.renderDirectedRemarkWorklistType();
            return (React.createElement("ul", {className: 'shift-right'}, React.createElement(WorklistType, {id: 'worklist_live', key: 'worklist_live', targetCount: this.props.markingTargetsSummary.examinerProgress.openResponsesCount, worklistType: enums.WorklistType.live, remarkRequestType: enums.RemarkRequestType.Unknown, isDirectedRemark: false, selectedLanguage: this.props.selectedLanguage, isTeamManagementMode: this.props.isTeamManagementMode}), React.createElement(WorklistType, {id: 'worklist_atypical', key: 'worklist_atypical', targetCount: this.props.markingTargetsSummary.examinerProgress.atypicalOpenResponsesCount, worklistType: enums.WorklistType.atypical, remarkRequestType: enums.RemarkRequestType.Unknown, isDirectedRemark: false, selectedLanguage: this.props.selectedLanguage, isTeamManagementMode: this.props.isTeamManagementMode}), directedRemarkRequestRenderer));
        }
        else {
            return (React.createElement("ul", {className: 'shift-right'}, React.createElement(WorklistType, {id: 'worklist_' + this.props.id, key: 'worklist_key_' + this.props.id, targetCount: this.props.markingTargetsSummary.examinerProgress.openResponsesCount, worklistType: this.props.markingTargetsSummary.markingModeID, remarkRequestType: enums.RemarkRequestType.Unknown, isDirectedRemark: false, selectedLanguage: this.props.selectedLanguage, isTeamManagementMode: this.props.isTeamManagementMode})));
        }
    };
    /**
     * Render directed remark worklist type
     */
    TargetDetails.prototype.renderDirectedRemarkWorklistType = function () {
        var _this = this;
        var directedRemarkTargets = this.props.directedRemarkTarget;
        if (directedRemarkTargets != null && directedRemarkTargets !== undefined) {
            if (directedRemarkTargets !== undefined && directedRemarkTargets.count() > 0) {
                // Sort the directed remark target based on their locale string
                directedRemarkTargets = Immutable.List(sortHelper.sort(directedRemarkTargets.toArray(), comparerList.remarkRequestTypeComparer));
                var directedRemarkTargetsList = directedRemarkTargets.map(function (markingTarget) {
                    // Get the total response count
                    var responseCount = markingTarget.examinerProgress.openResponsesCount
                        + markingTarget.examinerProgress.pendingResponsesCount
                        + markingTarget.examinerProgress.closedResponsesCount;
                    // Only if open + closed + pending response count is > 0 then display the remark request type
                    if (responseCount > 0) {
                        return (React.createElement(WorklistType, {id: 'worklist_directed_remark_' + enums.RemarkRequestType[markingTarget.remarkRequestTypeID], key: 'worklist_directed_remark_' + enums.RemarkRequestType[markingTarget.remarkRequestTypeID], targetCount: markingTarget.examinerProgress.openResponsesCount, remarkRequestType: markingTarget.remarkRequestTypeID, worklistType: enums.WorklistType.directedRemark, isDirectedRemark: true, selectedLanguage: _this.props.selectedLanguage, isTeamManagementMode: _this.props.isTeamManagementMode}));
                    }
                });
                return directedRemarkTargetsList;
            }
        }
        return null;
    };
    return TargetDetails;
}(pureRenderComponent));
module.exports = TargetDetails;
//# sourceMappingURL=targetdetails.js.map