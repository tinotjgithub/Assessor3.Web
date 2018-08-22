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
var TargetItem = require('./targetitem');
var LiveOrPooledRemarkTargetItem = require('./liveorpooledremarktargetitem');
var qigStore = require('../../../stores/qigselector/qigstore');
var worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
var targetHelper = require('../../../utility/target/targethelper');
var Immutable = require('immutable');
var markerOperationModeFactory = require('../../utility/markeroperationmode/markeroperationmodefactory');
var worklistStore = require('../../../stores/worklist/workliststore');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
/**
 * Class for the Targts in the worklist.
 */
var Targets = (function (_super) {
    __extends(Targets, _super);
    /**
     * The constructor for the target component.
     * @param props
     */
    function Targets(props) {
        var _this = this;
        _super.call(this, props, null);
        /**
         * render the targetItemElement
         */
        this.renderTargetItem = function (markingTarget, isTargetDisabled, idString) {
            return (React.createElement(TargetItem, {target: markingTarget, isDisabled: isTargetDisabled, isOverAllTargetCompleted: (targetHelper.getExaminerQigStatus()
                === enums.ExaminerQIGStatus.OverAllTargetCompleted) ? true : false, isSelected: _this.isSelectedTarget(markingTarget.markingModeID, undefined), onClickCallback: _this.onTargetClick, selectedLanguage: _this.props.selectedLanguage, id: 'target_id' + idString, key: 'target_key' + idString, renderedOn: _this.props.liveTargetRenderedOn, remarkRequestTypeID: undefined, isDirectedRemark: false, isTeamManagementMode: _this.props.isTeamManagementMode}));
        };
        /**
         * Get selected worklist type disabled.
         */
        this.isSelectedWorklistTypeDisabled = function () {
            var isDisabledtarget = false;
            var markingModeByWorklistType = targetHelper.getMarkingModeByWorklistType(worklistStore.instance.currentWorklistType);
            if (markingModeByWorklistType) {
                var targetByWorklistType = _this.props.markingTargetsSummary.filter(function (target) { return target.markingModeID === markingModeByWorklistType; }).first();
                // The markingTargetsSummary will not be get refreshed soon when we switching through recent history link.
                if (targetByWorklistType) {
                    isDisabledtarget = markerOperationModeFactory.operationMode.isTargetDisabled(targetByWorklistType, undefined);
                }
            }
            return isDisabledtarget;
        };
        this.selectedMarkingMode = enums.MarkingMode.None;
        this.state = {
            currentlySelectedMarkingMode: undefined,
            currentlySelectedremarkRequestTypeId: undefined
        };
        this.onTargetClick = this.onTargetClick.bind(this);
    }
    /**
     * Renders component
     * @returns
     */
    Targets.prototype.render = function () {
        var _this = this;
        if (this.props.markingTargetsSummary === undefined || this.props.markingTargetsSummary.count() === 0) {
            return null;
        }
        this.selectedMarkingMode = targetHelper.getWorklistTargetToBeSelected(undefined, this.isSelectedWorklistTypeDisabled());
        var that = this;
        var previousTarget;
        var standardisationSetupComplete = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete : false;
        // Loop through the marking targets
        var torender = this.props.markingTargetsSummary.map(function (markingTarget) {
            var idString = '_' + markingTarget.markingModeID;
            var isTargetDisabled = that.isTargetDisabled(markingTarget, previousTarget);
            switch (markingTarget.markingModeID) {
                case enums.MarkingMode.LiveMarking:
                    previousTarget = markingTarget;
                    // Only closed tab is displaying in help examiners,
                    // update the open count with closed closed count, Also should not render progress bar component.
                    if (markerOperationModeFactory.operationMode.isHelpExaminersView) {
                        markingTarget.examinerProgress.openResponsesCount = markingTarget.examinerProgress.closedResponsesCount;
                        return that.renderTargetItem(markingTarget, isTargetDisabled, idString);
                    }
                    return (React.createElement(LiveOrPooledRemarkTargetItem, {target: markingTarget, isOverAllTargetCompleted: (targetHelper.getExaminerQigStatus()
                        === enums.ExaminerQIGStatus.OverAllTargetCompleted) ? true : false, isDisabled: isTargetDisabled, isSelected: that.isSelectedTarget(markingTarget.markingModeID, undefined), onClickCallback: that.onTargetClick, id: 'target_id' + idString, key: 'target_key' + idString, selectedLanguage: _this.props.selectedLanguage, renderedOn: _this.props.liveTargetRenderedOn, directedRemarkTarget: _this.getDirectedRemarkTargets(), remarkRequestTypeID: undefined, isDirectedRemark: false, isTeamManagementMode: _this.props.isTeamManagementMode}));
                case enums.MarkingMode.Practice:
                case enums.MarkingMode.Approval:
                case enums.MarkingMode.ES_TeamApproval:
                    previousTarget = markingTarget;
                    if (markingTarget.maximumMarkingLimit > 0) {
                        return that.renderTargetItem(markingTarget, isTargetDisabled, idString);
                    }
                    break;
                case enums.MarkingMode.Remarking:
                    previousTarget = markingTarget;
                    if (markingTarget.examinerProgress.isDirectedRemark === false) {
                        return (React.createElement(LiveOrPooledRemarkTargetItem, {target: markingTarget, isDisabled: isTargetDisabled, isOverAllTargetCompleted: false, isSelected: that.isSelectedTarget(markingTarget.markingModeID, markingTarget.remarkRequestTypeID), onClickCallback: that.onTargetClick, selectedLanguage: _this.props.selectedLanguage, id: 'target_id' + idString + enums.RemarkRequestType[markingTarget.remarkRequestTypeID], key: 'target_key' + idString + enums.RemarkRequestType[markingTarget.remarkRequestTypeID], renderedOn: _this.props.liveTargetRenderedOn, remarkRequestTypeID: markingTarget.remarkRequestTypeID, isDirectedRemark: markingTarget.examinerProgress.isDirectedRemark, isTeamManagementMode: _this.props.isTeamManagementMode}));
                    }
                    break;
                case enums.MarkingMode.Simulation:
                    previousTarget = markingTarget;
                    if (!standardisationSetupComplete) {
                        return that.renderTargetItem(markingTarget, false, idString);
                    }
                    break;
                default: return null;
            }
        });
        // Render the marking targets to the wrapper
        return (React.createElement("div", {className: 'left-menu-holder'}, React.createElement("ul", {id: 'left_menu_panel_group', className: 'left-menu panel-group'}, torender)));
    };
    /**
     * This will set state currently selected marking mode
     * @param nxtProps
     */
    Targets.prototype.componentWillReceiveProps = function (nxtProps) {
        if (this.props.markingTargetsSummary === undefined || this.props.markingTargetsSummary.count() === 0) {
            return;
        }
        this.setState({ currentlySelectedMarkingMode: undefined, currentlySelectedremarkRequestTypeId: undefined });
    };
    /**
     * This will return the selection status.
     * @param markingModeId
     */
    Targets.prototype.isSelectedTarget = function (markingModeId, remarkRequestTypeId) {
        if (this.state.currentlySelectedMarkingMode === undefined) {
            if (this.selectedMarkingMode === enums.MarkingMode.Remarking) {
                return targetHelper.getCurrentRemarkRequestType() === remarkRequestTypeId;
            }
            else {
                return this.selectedMarkingMode === markingModeId;
            }
        }
        else if (remarkRequestTypeId !== undefined) {
            return this.state.currentlySelectedremarkRequestTypeId === remarkRequestTypeId;
        }
        else {
            return this.state.currentlySelectedMarkingMode === markingModeId;
        }
    };
    /**
     * On target clicked
     * @param markingModeId
     */
    Targets.prototype.onTargetClick = function (markingModeId, remarkRequestTypeId, isDirectedRemark) {
        if (!applicationStore.instance.isOnline) {
            applicationActionCreator.checkActionInterrupted();
        }
        else {
            var worklistType = void 0;
            switch (markingModeId) {
                case enums.MarkingMode.Practice:
                    worklistType = enums.WorklistType.practice;
                    break;
                case enums.MarkingMode.LiveMarking:
                    worklistType = enums.WorklistType.live;
                    break;
                case enums.MarkingMode.Approval:
                    worklistType = enums.WorklistType.standardisation;
                    break;
                case enums.MarkingMode.ES_TeamApproval:
                    worklistType = enums.WorklistType.secondstandardisation;
                    break;
                case enums.MarkingMode.Remarking:
                    worklistType = enums.WorklistType.pooledRemark;
                    break;
                case enums.MarkingMode.Simulation:
                    worklistType = enums.WorklistType.simulation;
                    break;
            }
            var isTargetCompleted_1;
            isTargetCompleted_1 = false;
            var responseMode = void 0;
            responseMode = enums.ResponseMode.open;
            if (markingModeId === enums.MarkingMode.Practice || markingModeId === enums.MarkingMode.Remarking) {
                this.props.markingTargetsSummary.map(function (markingTarget) {
                    if (markingTarget.markingModeID === markingModeId) {
                        if (markingTarget.isTargetCompleted) {
                            isTargetCompleted_1 = true;
                        }
                    }
                });
            }
            else if (markingModeId === enums.MarkingMode.Approval ||
                markingModeId === enums.MarkingMode.ES_TeamApproval) {
                isTargetCompleted_1 = targetHelper.isESTargetCompleted(markingModeId);
            }
            if (isTargetCompleted_1) {
                responseMode = enums.ResponseMode.closed;
            }
            if (qigStore.instance.selectedQIGForMarkerOperation) {
                responseMode = markerOperationModeFactory.operationMode.responseModeBasedOnQualityFeedback(responseMode, markingModeId, remarkRequestTypeId);
                worklistActionCreator.notifyWorklistTypeChange(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, worklistType, responseMode, remarkRequestTypeId, isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
            }
            this.setState({ currentlySelectedMarkingMode: markingModeId, currentlySelectedremarkRequestTypeId: remarkRequestTypeId });
        }
    };
    /**
     * This method will determine whether a target in disabled state or not
     * @param target - target
     * @param previousTarget - previous target
     */
    Targets.prototype.isTargetDisabled = function (target, previousTarget) {
        // Determine if the item is shown in a disabled status here.
        // In the future state the item is disabled.
        //When the marker has quality feedback outstanding, the remarking tab should be disabled
        return markerOperationModeFactory.operationMode.isTargetDisabled(target, previousTarget);
    };
    /**
     * Check is ES Team Approval Status
     */
    Targets.prototype.isESTeamApprovalStatus = function () {
        if (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === true
            || (qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember === false
                && this.isSecondStandardisation() === true)) {
            return true;
        }
        return false;
    };
    /**
     * Check if Second Standardisation
     */
    Targets.prototype.isSecondStandardisation = function () {
        var secondStandardisationTarget = this.props.markingTargetsSummary.filter(function (target) {
            return target.markingModeID === enums.MarkingMode.ES_TeamApproval;
        }).first();
        if (secondStandardisationTarget !== undefined) {
            return true;
        }
        return false;
    };
    /**
     * Get directed remark targets
     */
    Targets.prototype.getDirectedRemarkTargets = function () {
        var filteredDirectedRemarkTargets = this.props.markingTargetsSummary.filter(function (markingTarget) {
            return markingTarget.examinerProgress.isDirectedRemark === true;
        });
        return Immutable.List(filteredDirectedRemarkTargets);
    };
    return Targets;
}(pureRenderComponent));
module.exports = Targets;
//# sourceMappingURL=targets.js.map