"use strict";
var enums = require('../../../components/utility/enums');
var qigStore = require('../../../stores/qigselector/qigstore');
var teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
var qigActionCreator = require('../../../actions/qigselector/qigselectoractioncreator');
var loadContainerActionCreator = require('../../../actions/navigation/loadcontaineractioncreator');
var navigationHelper = require('../../../components/utility/navigation/navigationhelper');
var storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
var worklistStore = require('../../../stores/worklist/workliststore');
var worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
var markerInformationActionCreator = require('../../../actions/markerinformation/markerinformationactioncreator');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var responseActionCreator = require('../../../actions/response/responseactioncreator');
var markingCheckActionCreator = require('../../../actions/markingcheck/markingcheckactioncreator');
/**
 * Helper class for warning message navigation
 */
var WarningMessageNavigationHelper = (function () {
    function WarningMessageNavigationHelper() {
    }
    /**
     * Refresh worklist data.
     */
    WarningMessageNavigationHelper.refreshworklistData = function (failureCode) {
        // Clear worklist cache and do content refresh
        var markingMode = worklistStore.instance.
            getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        WarningMessageNavigationHelper._storageAdapterHelper.
            clearCache(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, markingMode, worklistStore.instance.getRemarkRequestType, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, worklistStore.instance.currentWorklistType);
        var worklistType = worklistStore.instance.currentWorklistType;
        var responseMode = worklistStore.instance.getResponseMode;
        if (failureCode === enums.FailureCode.ExaminerStatusAlreadyChanged) {
            worklistType = enums.WorklistType.live;
            responseMode = enums.ResponseMode.open;
        }
        // Load work list.
        if (failureCode === enums.FailureCode.ExaminerStatusAlreadyChanged ||
            failureCode === enums.FailureCode.Suspended) {
            var markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            var examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            var questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            var remarkRequestType = worklistStore.instance.getRemarkRequestType;
            var isDirectedRemark = worklistStore.instance.isDirectedRemark;
            worklistActionCreator.notifyWorklistTypeChange(markSchemeGroupId, examinerRoleId, questionPaperPartId, worklistType, responseMode, remarkRequestType, isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false);
        }
        // Load the marking progress
        worklistActionCreator.getWorklistMarkerProgressData(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember);
        // Load the marker information
        markerInformationActionCreator.
            GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true, false, enums.ExaminerApproval.None);
    };
    /**
     * Method to handle the supervisor sampling navigation.
     */
    WarningMessageNavigationHelper.supervisorSamplingFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                WarningMessageNavigationHelper.clearMyTeamDataCache();
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.HierarchyChanged:
                WarningMessageNavigationHelper.clearQIGSelectorCache();
                navigationHelper.loadQigSelector();
                break;
        }
    };
    /**
     * method to handle the promote to seed failure navigation.
     */
    WarningMessageNavigationHelper.promoteSeedCheckFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Suspended:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                break;
            case enums.FailureCode.Withdrawn:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.HierarchyChanged:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
                break;
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toTeam);
                break;
        }
    };
    /**
     * method to handle the worklist failure navigation.
     */
    WarningMessageNavigationHelper.teamWorklistFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.NotTeamLead:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                WarningMessageNavigationHelper.clearMyTeamDataCache();
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.Suspended:
                WarningMessageNavigationHelper.refreshworklistData(failureCode);
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                break;
        }
    };
    /**
     * Method to handle the supervisor remark check failure navigation
     */
    WarningMessageNavigationHelper.superVisorRemarkCheckFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Suspended:
                responseActionCreator.doVisibleSupervisorRemarkButton(false);
                break;
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.NotTeamLead:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.HierarchyChanged:
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toTeam);
                break;
        }
    };
    /**
     * Method to handle the change examiner status failure navigation.
     */
    WarningMessageNavigationHelper.checkingExaminerViewingResponseFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Suspended:
                // Load the marker information
                markerInformationActionCreator.
                    GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true, false, enums.ExaminerApproval.None);
                markingCheckActionCreator.getMarkingCheckInfo(true, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                break;
        }
    };
    /**
     * Method to handle the change examiner status failure navigation.
     */
    WarningMessageNavigationHelper.changeExaminerStatusFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.NotTeamLead:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.ExaminerStatusAlreadyChanged:
            case enums.FailureCode.Suspended:
                WarningMessageNavigationHelper.refreshworklistData(failureCode);
                break;
        }
    };
    /**
     * Method to handle the marking check failure navigation.
     */
    WarningMessageNavigationHelper.markingCheckFailureNavigation = function (failureCode, warningMessageAction) {
        switch (worklistStore.instance.markingCheckFailureCode) {
            case enums.FailureCode.Suspended:
                if (warningMessageAction === enums.WarningMessageAction.CheckMyMarks &&
                    qigStore.instance.selectedQIGForMarkerOperation) {
                    markingCheckActionCreator.getMarkingCheckInfo(true, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                }
                else {
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                }
                break;
            case enums.FailureCode.Withdrawn:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
                break;
            case enums.FailureCode.HierarchyChanged:
                if (warningMessageAction === enums.WarningMessageAction.MarksChecked) {
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
                }
                else {
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                    if (qigStore.instance.selectedQIGForMarkerOperation) {
                        markingCheckActionCreator.getMarkingCheckInfo(true, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                    }
                }
                break;
        }
    };
    /**
     * Method to handle the set as reviewd failure navigation.
     */
    WarningMessageNavigationHelper.setAsReviewedFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.NotTeamLead:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                WarningMessageNavigationHelper.clearMyTeamDataCache();
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.Suspended:
                WarningMessageNavigationHelper.refreshworklistData(failureCode);
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                break;
        }
    };
    /**
     * Method to handle the set as reviewd failure navigation.
     */
    WarningMessageNavigationHelper.exceptionActionFailureNavigation = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.NotTeamLead:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.HierarchyChanged:
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                WarningMessageNavigationHelper.clearMyTeamDataCache();
                WarningMessageNavigationHelper.clearUnActionedExceptionDataCache();
                WarningMessageNavigationHelper.clearTeamOverViewDataCache();
                teamManagementActionCreator.teammanagementTabSelect(enums.TeamManagement.MyTeam);
                navigationHelper.loadTeamManagement();
                break;
        }
    };
    /**
     * Clear the unactioned exception cache.
     */
    WarningMessageNavigationHelper.clearUnActionedExceptionDataCache = function () {
        var cacheKey = 'team';
        var cacheValue = 'unActionedException_' +
            teamManagementStore.instance.selectedMarkSchemeGroupId;
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
    };
    /**
     * Clear the my team data cache.
     */
    WarningMessageNavigationHelper.clearMyTeamDataCache = function () {
        var cacheKey = 'team';
        var cacheValue = 'myTeamData_' +
            teamManagementStore.instance.selectedExaminerRoleId + '_' +
            teamManagementStore.instance.selectedMarkSchemeGroupId;
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
    };
    /**
     * Clear cache for team overview.
     */
    WarningMessageNavigationHelper.clearTeamOverViewDataCache = function () {
        // Clear cache for team overview
        var cacheKey = 'team';
        var cacheValue = 'teamOverviewCount_' + teamManagementStore.instance.selectedExaminerRoleId + '_' +
            teamManagementStore.instance.selectedMarkSchemeGroupId;
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
    };
    // Storage adapter helper
    WarningMessageNavigationHelper._storageAdapterHelper = new storageAdapterHelper();
    /**
     * Handle Withdrawn Scenarios.
     */
    WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate = function () {
        WarningMessageNavigationHelper.clearQIGSelectorCache();
        if (qigStore.instance.getOverviewData && qigStore.instance.getSelectedQIGForTheLoggedInUser) {
            var currentQig = qigStore.instance.getOverviewData.qigSummary.filter(function (qig) {
                return qig.examinerRoleId === qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
            }).first();
            teamManagementActionCreator.removeHistoryItem(currentQig ?
                currentQig.markSchemeGroupId : 0);
        }
        qigActionCreator.getQIGSelectorData(0);
        loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
        navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
    };
    /**
     * Method to handle the warning message navigation.
     */
    WarningMessageNavigationHelper.handleWarningMessageNavigation = function (failureCode, warningMessageAction, args) {
        switch (warningMessageAction) {
            case enums.WarningMessageAction.SupervisorSampling:
                WarningMessageNavigationHelper.supervisorSamplingFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.PromoteToSeed:
                WarningMessageNavigationHelper.promoteSeedCheckFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.SuperVisorRemarkCheck:
                WarningMessageNavigationHelper.superVisorRemarkCheckFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.CheckingExaminerViewingResponse:
                WarningMessageNavigationHelper.checkingExaminerViewingResponseFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.SEPAction:
                WarningMessageNavigationHelper.sepActionFailureActions(failureCode);
                break;
            case enums.WarningMessageAction.ChangeExaminerStatus:
                WarningMessageNavigationHelper.changeExaminerStatusFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.MarksChecked:
            case enums.WarningMessageAction.CheckMyMarks:
                WarningMessageNavigationHelper.markingCheckFailureNavigation(failureCode, warningMessageAction);
                break;
            case enums.WarningMessageAction.MyTeamAction:
                WarningMessageNavigationHelper.myTeamActionFailureActions(failureCode);
                break;
            case enums.WarningMessageAction.SetAsReviewed:
                WarningMessageNavigationHelper.setAsReviewedFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.ExceptionAction:
                WarningMessageNavigationHelper.exceptionActionFailureNavigation(failureCode);
                break;
            case enums.WarningMessageAction.TeamWorklist:
                WarningMessageNavigationHelper.teamWorklistFailureNavigation(failureCode);
                break;
        }
    };
    /**
     * Actions for the SEP failure
     */
    WarningMessageNavigationHelper.sepActionFailureActions = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.NotApproved:
            case enums.FailureCode.NotInLockStatus:
                WarningMessageNavigationHelper.clearQIGSelectorCache();
                teamManagementActionCreator.teammanagementTabSelect(enums.TeamManagement.MyTeam);
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.Withdrawn:
            case enums.FailureCode.NotASeniorExaminer:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.InvalidPriority:
            case enums.FailureCode.LockLimitMet:
            case enums.FailureCode.LockIsRequired:
            case enums.FailureCode.AlreadyLocked:
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                navigationHelper.loadTeamManagement();
                break;
            case enums.FailureCode.Suspended:
                teamManagementActionCreator.teammanagementTabSelect(enums.TeamManagement.MyTeam);
                navigationHelper.loadTeamManagement();
                break;
        }
    };
    /**
     * Clear the QIG Selector Cache
     */
    WarningMessageNavigationHelper.clearQIGSelectorCache = function () {
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
    };
    /**
     * Actions for the my team failure
     */
    WarningMessageNavigationHelper.myTeamActionFailureActions = function (failureCode) {
        switch (failureCode) {
            case enums.FailureCode.NotTeamLead:
            case enums.FailureCode.Withdrawn:
                WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                navigationHelper.loadTeamManagement();
                break;
        }
    };
    return WarningMessageNavigationHelper;
}());
module.exports = WarningMessageNavigationHelper;
//# sourceMappingURL=warningmessagenavigationhelper.js.map