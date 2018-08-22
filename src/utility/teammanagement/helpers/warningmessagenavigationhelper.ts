import enums = require('../../../components/utility/enums');
import localeStore = require('../../../stores/locale/localestore');
import qigStore = require('../../../stores/qigselector/qigstore');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
import qigActionCreator = require('../../../actions/qigselector/qigselectoractioncreator');
import loadContainerActionCreator = require('../../../actions/navigation/loadcontaineractioncreator');
import navigationHelper = require('../../../components/utility/navigation/navigationhelper');
import qigSummary = require('../../../stores/qigselector/typings/qigsummary');
import storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
import worklistStore = require('../../../stores/worklist/workliststore');
import worklistActionCreator = require('../../../actions/worklist/worklistactioncreator');
import markerInformationActionCreator = require('../../../actions/markerinformation/markerinformationactioncreator');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import operationModeHelper = require('../../../components/utility/userdetails/userinfo/operationmodehelper');
import responseActionCreator = require('../../../actions/response/responseactioncreator');
import markingCheckActionCreator = require('../../../actions/markingcheck/markingcheckactioncreator');

/**
 * Helper class for warning message navigation
 */
class WarningMessageNavigationHelper {

    // Storage adapter helper
    private static _storageAdapterHelper = new storageAdapterHelper();

    /**
     * Handle Withdrawn Scenarios.
     */
    public static removeQIGSelectorCacheRemoveHistoryAndNavigate = () => {
        WarningMessageNavigationHelper.clearQIGSelectorCache();
        if (qigStore.instance.getOverviewData && qigStore.instance.getSelectedQIGForTheLoggedInUser) {
            let currentQig = qigStore.instance.getOverviewData.qigSummary.filter((qig: qigSummary) =>
                qig.examinerRoleId === qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId).first();

            teamManagementActionCreator.removeHistoryItem(currentQig ?
                currentQig.markSchemeGroupId : 0);
        }
        qigActionCreator.getQIGSelectorData(0);
        loadContainerActionCreator.loadContainer(enums.PageContainers.QigSelector);
        navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
    }

    /**
     * Refresh worklist data.
     */
    public static refreshworklistData(failureCode) {
        // Clear worklist cache and do content refresh
        let markingMode = worklistStore.instance.
            getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

        WarningMessageNavigationHelper._storageAdapterHelper.
            clearCache(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingMode,
            worklistStore.instance.getRemarkRequestType,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            worklistStore.instance.currentWorklistType);

        let worklistType: enums.WorklistType = worklistStore.instance.currentWorklistType;
        let responseMode = worklistStore.instance.getResponseMode;
        if (failureCode === enums.FailureCode.ExaminerStatusAlreadyChanged) {
            worklistType = enums.WorklistType.live;
            responseMode = enums.ResponseMode.open;
        }

        // Load work list.
        if (failureCode === enums.FailureCode.ExaminerStatusAlreadyChanged ||
            failureCode === enums.FailureCode.Suspended) {
            let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
            let examinerRoleId = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
            let questionPaperPartId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
            let remarkRequestType = worklistStore.instance.getRemarkRequestType;
            let isDirectedRemark = worklistStore.instance.isDirectedRemark;
            worklistActionCreator.notifyWorklistTypeChange
                (markSchemeGroupId,
                examinerRoleId,
                questionPaperPartId,
                worklistType,
                responseMode,
                remarkRequestType,
                isDirectedRemark,
                qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                false);
        }

        // Load the marking progress
        worklistActionCreator.getWorklistMarkerProgressData(
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember
        );

        // Load the marker information
        markerInformationActionCreator.
            GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            true,
            false,
            enums.ExaminerApproval.None);
    }

    /**
     * Method to handle the warning message navigation.
     */
    public static handleWarningMessageNavigation = (failureCode: enums.FailureCode,
        warningMessageAction: enums.WarningMessageAction, args?: any): void => {

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
    }

    /**
     * Method to handle the supervisor sampling navigation.
     */
    private static supervisorSamplingFailureNavigation(failureCode: enums.FailureCode) {
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
    }

    /**
     * method to handle the promote to seed failure navigation.
     */
    private static promoteSeedCheckFailureNavigation(failureCode: enums.FailureCode) {
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
    }

   /**
    * method to handle the worklist failure navigation.
    */
    private static teamWorklistFailureNavigation(failureCode: enums.FailureCode) {
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
    }

    /**
     * Method to handle the supervisor remark check failure navigation
     */
    private static superVisorRemarkCheckFailureNavigation(failureCode: enums.FailureCode) {
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
    }

    /**
     * Method to handle the change examiner status failure navigation.
     */
    private static checkingExaminerViewingResponseFailureNavigation(failureCode: enums.FailureCode) {
        switch (failureCode) {
            case enums.FailureCode.Suspended:
                // Load the marker information
                markerInformationActionCreator.
                    GetMarkerInformation(qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    true,
                    false,
                    enums.ExaminerApproval.None);
                markingCheckActionCreator.getMarkingCheckInfo(true,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                break;
        }
    }


    /**
     * Actions for the SEP failure
     */
    private static sepActionFailureActions = (failureCode: enums.FailureCode) => {
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
    }

    /**
     * Method to handle the change examiner status failure navigation.
     */
    private static changeExaminerStatusFailureNavigation(failureCode: enums.FailureCode) {
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
    }

    /**
     * Method to handle the marking check failure navigation.
     */
    private static markingCheckFailureNavigation(failureCode: enums.FailureCode,
        warningMessageAction: enums.WarningMessageAction) {
        switch (worklistStore.instance.markingCheckFailureCode) {

            case enums.FailureCode.Suspended:
                if (warningMessageAction === enums.WarningMessageAction.CheckMyMarks &&
                    qigStore.instance.selectedQIGForMarkerOperation) {
                    markingCheckActionCreator.getMarkingCheckInfo(true,
                        qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                } else {
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                }
                break;

            case enums.FailureCode.Withdrawn:
                navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
                break;

            case enums.FailureCode.HierarchyChanged:
                if (warningMessageAction === enums.WarningMessageAction.MarksChecked) {
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toQigSelector);
                } else {
                    navigationHelper.handleNavigation(enums.SaveAndNavigate.toWorklist);
                    if (qigStore.instance.selectedQIGForMarkerOperation) {
                        markingCheckActionCreator.getMarkingCheckInfo(true,
                            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                    }
                }
                break;
        }
    }

    /**
     * Method to handle the set as reviewd failure navigation.
     */
    private static setAsReviewedFailureNavigation(failureCode: enums.FailureCode) {
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
    }

    /**
     * Method to handle the set as reviewd failure navigation.
     */
    private static exceptionActionFailureNavigation(failureCode: enums.FailureCode) {
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
    }

    /**
     * Clear the QIG Selector Cache
     */
    private static clearQIGSelectorCache = () => {
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey('qigselector', 'overviewdata');
    }

    /**
     * Clear the unactioned exception cache.
     */
    private static clearUnActionedExceptionDataCache() {
        let cacheKey = 'team';
        let cacheValue = 'unActionedException_' +
            teamManagementStore.instance.selectedMarkSchemeGroupId;
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
    }

    /**
     * Clear the my team data cache.
     */
    private static clearMyTeamDataCache() {
        let cacheKey = 'team';
        let cacheValue = 'myTeamData_' +
            teamManagementStore.instance.selectedExaminerRoleId + '_' +
            teamManagementStore.instance.selectedMarkSchemeGroupId;
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey(cacheKey, cacheValue);
    }

    /**
     * Clear cache for team overview.
     */
    private static clearTeamOverViewDataCache() {
        // Clear cache for team overview
        let cacheKey = 'team';
        let cacheValue = 'teamOverviewCount_' + teamManagementStore.instance.selectedExaminerRoleId + '_' +
            teamManagementStore.instance.selectedMarkSchemeGroupId;
        WarningMessageNavigationHelper._storageAdapterHelper.clearCacheByKey(
            cacheKey,
            cacheValue);
    }

    /**
     * Actions for the my team failure
     */
    private static myTeamActionFailureActions = (failureCode: enums.FailureCode) => {
        switch (failureCode) {
            case enums.FailureCode.NotTeamLead:
            case enums.FailureCode.Withdrawn:
            WarningMessageNavigationHelper.removeQIGSelectorCacheRemoveHistoryAndNavigate();
                break;
            case enums.FailureCode.SubordinateExaminerWithdrawn:
                navigationHelper.loadTeamManagement();
                break;
        }
    }
}

export = WarningMessageNavigationHelper;