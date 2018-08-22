"use strict";
var enums = require('../../components/utility/enums');
var Promise = require('es6-promise');
var Immutable = require('immutable');
var stringHelper = require('../../utility/generic/stringhelper');
var markSchemeHelper = require('../../utility/markscheme/markschemehelper');
var userOptionsHelper = require('../useroption/useroptionshelper');
var scriptImageDownloadHelper = require('../../components/utility/backgroundworker/scriptimagedownloadhelper');
var scriptImageDownloader = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader');
var qigStore = require('../../stores/qigselector/qigstore');
var stampStore = require('../../stores/stamp/stampstore');
var sriptStore = require('../../stores/script/scriptstore');
var worklistStore = require('../../stores/worklist/workliststore');
var responseStore = require('../../stores/response/responsestore');
var examinerStore = require('../../stores/markerinformation/examinerstore');
var markschemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
var markingStore = require('../../stores/marking/markingstore');
var ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
var qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
var stampActionCreator = require('../../actions/stamp/stampactioncreator');
var scriptActionCreator = require('../../actions/script/scriptactioncreator');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
var imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
var markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
var markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
var markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
var teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
var userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
var acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
var markingInstructionActionCreator = require('../../actions/markinginstructions/markinginstructionactioncreator');
var useroptionKeys = require('../useroption/useroptionkeys');
var targetSummaryStore = require('../../stores/worklist/targetsummarystore');
var configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../configurablecharacteristic/configurablecharacteristicsnames');
var responseHelper = require('../../components/utility/responsehelper/responsehelper');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
var configurableCharacteristicsValues = require('../configurablecharacteristic/configurablecharacteristicsvalues');
var eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
var xmlHelper = require('../generic/xmlhelper');
var toolbarStore = require('../../stores/toolbar/toolbarstore');
var ResponseSearchHelper = (function () {
    function ResponseSearchHelper() {
    }
    /**
     * Listen Events
     */
    ResponseSearchHelper.addResponseSearchEvents = function () {
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, ResponseSearchHelper.onQIGDataLoaded);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, ResponseSearchHelper.onWorkListSelected);
        sriptStore.instance.addListener(sriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, ResponseSearchHelper.openResponse);
        markschemeStructureStore.instance.addListener(markschemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT, ResponseSearchHelper.openResponse);
        stampStore.instance.addListener(stampStore.StampStore.STAMPS_LOADED_EVENT, ResponseSearchHelper.loadFavoriteStampForSelectedQig);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, ResponseSearchHelper.loadFavoriteStampForSelectedQig);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, ResponseSearchHelper.loadFavoriteStampForSelectedQig);
    };
    /**
     * Remove Event Reference
     */
    ResponseSearchHelper.removeResponseSearchEvents = function () {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, ResponseSearchHelper.onQIGDataLoaded);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, ResponseSearchHelper.onWorkListSelected);
        sriptStore.instance.removeListener(sriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT, ResponseSearchHelper.openResponse);
        markschemeStructureStore.instance.removeListener(markschemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT, ResponseSearchHelper.openResponse);
        stampStore.instance.removeListener(stampStore.StampStore.STAMPS_LOADED_EVENT, ResponseSearchHelper.loadFavoriteStampForSelectedQig);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT, ResponseSearchHelper.loadFavoriteStampForSelectedQig);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, ResponseSearchHelper.loadFavoriteStampForSelectedQig);
    };
    /**
     * Details needed to open the qig
     * @param questionPaperId
     * @param markSchemeGroupId
     * @param examinerRoleId
     * @param canUseCache
     * @param currentApprovalStatus
     * @param markingMethod
     * @param dispatchEvents
     * @param isOpeningFromMessage
     */
    ResponseSearchHelper.openQIGDetails = function (questionPaperId, markSchemeGroupId, examinerRoleId, canUseCache, currentApprovalStatus, markingMethod, dispatchEvents, isElectronicStandardisationTeamMember, isOpeningFromMessage) {
        if (isOpeningFromMessage === void 0) { isOpeningFromMessage = false; }
        // Clear the existing background image download queue
        new scriptImageDownloader().clearBackgroundImageDownloadQueue();
        // Preparing initial loading for. This is to ensure that corresponding marking target
        // is loaded before worklist is loaded.
        // (1) Markschemestruture
        // (2) CC
        // (3) Target summary
        // to make ready the application to load associated worklist or progress associated functionality.
        var markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperId, true);
        // If this call from response search, skip dispatching event for avoiding multiple dispatch.
        markSchemeGroupCCPromise.then(function (result) {
            var markingTargetPromise = worklistActionCreator.getWorklistMarkerProgressData(examinerRoleId, markSchemeGroupId, isElectronicStandardisationTeamMember, isOpeningFromMessage ? false : dispatchEvents, !targetSummaryStore.instance.isSupervisorRemarkCreated);
            // Reseting the markscheme loaded status in markSchemeStructureStore
            var resetLoadStatusPromise = markingActionCreator.resetMarkInfoLoadStatus(true);
            var markschemePromise = markSchemeStructureActionCreator.getmarkSchemeStructureList(markSchemeGroupId, questionPaperId, canUseCache, dispatchEvents);
            // Defect fix: #43078 - We've to skip the cache if examiner approval status in qig is different from current examiner status'
            var canUseCacheForMarkerInformation = qigStore.instance.selectedQIGForMarkerOperation &&
                !(qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus !== currentApprovalStatus &&
                    markerOperationModeFactory.operationMode.isMarkingMode) &&
                canUseCache;
            var markerInformationPromise = markerInformationActionCreator.GetMarkerInformation(examinerRoleId, markSchemeGroupId, dispatchEvents, canUseCacheForMarkerInformation, currentApprovalStatus);
            // Retrieves the acetates data only if not ebookmarking component.
            // TODO: set includeRelatedQigs as true for Multi-Qig component else set as false.
            var acetatesDataPromise = !responseHelper.isOverlayAnnotationsVisible
                ? null
                : acetatesActionCreator.loadAcetatesData(questionPaperId, markSchemeGroupId, true);
            // Retrieves MarkingInstructions Details
            var markingInstructionsPromise = markerOperationModeFactory.operationMode.isMarkingInstructionLinkVisible ?
                markingInstructionActionCreator.getMarkingInstructionsActionCreator(markSchemeGroupId, ResponseSearchHelper.markingInstructionCCValue, false) : null;
            Promise.Promise
                .all([
                markschemePromise,
                markSchemeGroupCCPromise,
                markerInformationPromise,
                markingTargetPromise,
                resetLoadStatusPromise,
                acetatesDataPromise,
                markingInstructionsPromise
            ])
                .then(function (resultList) {
                qigActionCreator.initialiseWorklist(resultList[0], resultList[1], resultList[2], resultList[3]);
                markingCheckActionCreator.getMarkingCheckInfo(ResponseSearchHelper.isMarkingCheckAvailable(), examinerRoleId);
                // While opening a response from message, set the worklist data
                if (isOpeningFromMessage) {
                    var searchedResponseData = responseStore.instance.searchedResponseData;
                    // Fill The Worklist related data.
                    // Always refresh from cache as the navigation from inbox need to update marking progress
                    worklistActionCreator.notifyWorklistTypeChange(searchedResponseData.markSchemeGroupId, searchedResponseData.examinerRoleId, searchedResponseData.questionPaperId, ResponseSearchHelper.getWorklistTypeByMarkingMode(searchedResponseData.markingModeId, searchedResponseData.isDirectedRemark, searchedResponseData.isAtypical), searchedResponseData.responseMode, searchedResponseData.remarkRequestType, searchedResponseData.isDirectedRemark, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, false);
                }
            });
        });
        // load imagezonelist
        imagezoneActionCreator.getImagezoneList(questionPaperId, markSchemeGroupId, markingMethod, true);
        // Load the exception types for selected QIG
        this.getExceptionTypesForSelectedQig(markSchemeGroupId, examinerRoleId);
    };
    /**
     * Get the Worklist Type based on Marking Mode Id
     * @param markingMode
     */
    ResponseSearchHelper.getWorklistTypeByMarkingMode = function (markingMode, isDirectedRemark, isAtypical) {
        var worklistType;
        switch (markingMode) {
            case enums.MarkingMode.Practice:
                worklistType = enums.WorklistType.practice;
                break;
            case enums.MarkingMode.LiveMarking:
                if (isAtypical) {
                    worklistType = enums.WorklistType.atypical;
                }
                else {
                    worklistType = enums.WorklistType.live;
                }
                break;
            case enums.MarkingMode.Approval:
                worklistType = enums.WorklistType.standardisation;
                break;
            case enums.MarkingMode.ES_TeamApproval:
                worklistType = enums.WorklistType.secondstandardisation;
                break;
            case enums.MarkingMode.Remarking:
                if (isDirectedRemark) {
                    worklistType = enums.WorklistType.directedRemark;
                }
                else {
                    worklistType = enums.WorklistType.pooledRemark;
                }
                break;
        }
        return worklistType;
    };
    /**
     * For a Multi QIG component, auto populate the annotation favorites toolbar:
     * If the currently selected QIG has no annotation in its favorites toolbar,
     * Get favorite annotations from a QIG in the question paper that has the maximum number of favorites annotation available.
     * If multiple QIGs has equal number of annotations in the favorites bar,
     * Then select the QIG which is listed first in the markscheme panel(from the equal list)
     * Then copy those annotations to the favorite list of the currently selected QIG
     * This method will return favorite stamp Ids collection to save in user options.
     */
    ResponseSearchHelper.getFavoriteStampsHavingMaximumCountInAllQIGs = function (examinerRoleId, isWholeResponse) {
        var favoriteStamps;
        var favoriteStampMaxList = [];
        var examinerRoleIds = [];
        var roleId = 0;
        var maxStampCount = 0;
        // Get the list of all related QIGs from the multiQig component
        var relatedQigList = qigStore.instance.relatedQigList;
        // Get all examinerRoleIds of the logged in user against the current component
        if (relatedQigList && relatedQigList !== undefined) {
            relatedQigList.map(function (value, key) {
                examinerRoleIds.push(value.examinerRoleId);
            });
        }
        if (examinerRoleIds !== undefined && examinerRoleIds.length > 0) {
            // Get favorite Stamps against all QIGs
            examinerRoleIds.map(function (examinerRoleId) {
                favoriteStamps = '';
                // Get favorite Stamps against a QIG
                favoriteStamps = userOptionsHelper.getUserOptionByName(useroptionKeys.REMEMBER_CHOSEN_STAMPS, examinerRoleId);
                if (favoriteStamps !== '' && favoriteStamps !== undefined) {
                    // Split the comma separated favorite stamps and convert it to array of number
                    var favoriteStampList = favoriteStamps === ''
                        ? []
                        : stringHelper.split(favoriteStamps, stringHelper.COMMA_SEPARATOR).map(Number);
                    // Check for the maximum favorite stamps QIG
                    if (favoriteStampList.length > maxStampCount) {
                        // Reset array
                        favoriteStampMaxList.length = 0;
                        // Add current QIG's stamps to array
                        favoriteStampList.map(function (stampId) {
                            favoriteStampMaxList.push(stampId);
                        });
                        roleId = examinerRoleId;
                        maxStampCount = favoriteStampList.length;
                    }
                }
            });
        }
        return favoriteStampMaxList;
    };
    /**
     * Get exception types for the selected QIG
     */
    ResponseSearchHelper.getExceptionTypesForSelectedQig = function (markSchemeGroupId, examinerRoleId) {
        //arguments for getting the exception types.
        var args = {
            QIGId: markSchemeGroupId,
            SelectedExaminerRoleId: examinerRoleId,
            GetAllExceptionTypes: false,
            ISMarkFromPaper: false,
            IncludeRelatedQigs: qigStore.instance.selectedQIGForMarkerOperation.hasPermissionInRelatedQIGs
        };
        exceptionActionCreator.getExceptionTypes(args);
    };
    /**
     * Open Team Management details
     */
    ResponseSearchHelper.openTeamManagementQIGDetails = function (examinerRoleId, markSchemeGroupId, questionPaperPartId, loadTeamManagementScreen) {
        // Get the Mark Scheme Level CC's, It is used to display the Team List Grids coulmns.
        ccActionCreator.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperPartId);
        // If call from, as part of search in message and its team management already store have the team management value.
        if (loadTeamManagementScreen) {
            // set the marker operation mode as Team Management
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement);
            // Invoke the action creator to Open the QIG
            qigActionCreator.openQIG(markSchemeGroupId);
        }
        teamManagementActionCreator.openTeamManagement(examinerRoleId, markSchemeGroupId, false, loadTeamManagementScreen);
    };
    Object.defineProperty(ResponseSearchHelper, "markingInstructionCCValue", {
        /**
         * Gets the marking instruction cc value
         */
        get: function () {
            var markingInstructionCC = configurableCharacteristicsHelper.getCharacteristicValue('MarkingInstructions');
            var xmlHelperObj = new xmlHelper(markingInstructionCC);
            var ccValue = xmlHelperObj.getNodeValueByName('Level');
            if (ccValue === 'Question Paper') {
                return enums.MarkingInstructionCC.QuestionPaper;
            }
            else {
                return enums.MarkingInstructionCC.QIG;
            }
        },
        enumerable: true,
        configurable: true
    });
    /*
     * Data Received For Opening the response. Get the All required data for opening response
     */
    ResponseSearchHelper.initiateSerachResponse = function (searchedResponseData) {
        var canUseCache = searchedResponseData.examinerId === searchedResponseData.loggedInExaminerId &&
            qigStore.instance.selectedQIGForMarkerOperation !== undefined;
        if (!canUseCache) {
            // Check the autherised id and selected id for team management check
            if (searchedResponseData.isTeamManagement) {
                // Get QIG data for the logged in data
                qigActionCreator.getQIGSelectorData(searchedResponseData.markSchemeGroupId, true);
                // Open team management related data
                ResponseSearchHelper.openTeamManagementQIGDetails(searchedResponseData.loggedInExaminerRoleId, searchedResponseData.markSchemeGroupId, searchedResponseData.questionPaperId, false);
            }
            if (searchedResponseData.triggerPoint !== enums.TriggerPoint.SupervisorRemark) {
                // Get the QIG selector data, indicate the data loading for search
                qigActionCreator.getQIGSelectorData(searchedResponseData.markSchemeGroupId, false, true);
            }
        }
        else {
            ResponseSearchHelper.onQIGDataLoaded(true);
        }
    };
    /*
     * Check the Required datas are loaded for openig response. If so open Response open action for re directing the page
     */
    ResponseSearchHelper.onQIGDataLoaded = function (isFromSearch) {
        if (isFromSearch && qigStore.instance.selectedQIGForMarkerOperation) {
            // Get the data from store
            var searchedResponseData = responseStore.instance.searchedResponseData;
            // Check cache can be re used or not
            var canUseCache = searchedResponseData.examinerId === searchedResponseData.loggedInExaminerId &&
                qigStore.instance.selectedQIGForMarkerOperation !== undefined;
            ResponseSearchHelper.openQIGDetails(searchedResponseData.questionPaperId, searchedResponseData.markSchemeGroupId, searchedResponseData.examinerRoleId, canUseCache, searchedResponseData.approvalStatusId, searchedResponseData.markingMethodId, true, qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember, true);
        }
    };
    /**
     * returns a value indicating whether marking check button is available
     */
    ResponseSearchHelper.isMarkingCheckAvailable = function () {
        var operationMode = markerOperationModeFactory.operationMode;
        if (operationMode.isTeamManagementMode) {
            return false;
        }
        var role = qigStore.instance.selectedQIGForMarkerOperation.role;
        var approvalStatus = qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus;
        var isSeniorExaminerPoolCCEnabled = configurableCharacteristicsHelper
            .getCharacteristicValue(configurableCharacteristicsNames.SeniorExaminerPool, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId)
            .toLowerCase() === 'true'
            ? true
            : false;
        var isRequestMarkingCheckCCEnabled = configurableCharacteristicsHelper
            .getCharacteristicValue(configurableCharacteristicsNames.RequestMarkingCheck, qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId)
            .toLowerCase() === 'true'
            ? true
            : false;
        // If SeniorExaminerPool CC is ON, RequestMarkingCheck CC functionality needs to be ignored.
        if (!isSeniorExaminerPoolCCEnabled &&
            isRequestMarkingCheckCCEnabled &&
            approvalStatus !== enums.ExaminerApproval.NotApproved &&
            approvalStatus !== enums.ExaminerApproval.Suspended &&
            (role === enums.ExaminerRole.principalExaminer ||
                role === enums.ExaminerRole.assistantPrincipalExaminer ||
                role === enums.ExaminerRole.autoApprovedSeniorTeamLeader)) {
            return true;
        }
    };
    /**
     * After Worklist data loaded, Load the Scripts Information
     */
    ResponseSearchHelper.onWorkListSelected = function (markSchemeGroupId, questionPaperPartId) {
        // set candidate script info collection.
        worklistStore.instance.setCandidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(worklistStore.instance.getCurrentWorklistResponseBaseDetails().toArray());
        var isMarkByQuestionModeSet = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';
        var eBookMarkingCCValue = configurableCharacteristicsHelper
            .getCharacteristicValue(configurableCharacteristicsNames.eBookmarking)
            .toLowerCase()
            ? true
            : false;
        // initial call for fetching candidate script meta data.
        var candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(worklistStore.instance.getCandidateScriptInfoCollection, questionPaperPartId, markSchemeGroupId, !isMarkByQuestionModeSet, false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
        false, eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false, eBookMarkingCCValue, enums.StandardisationSetup.None, false, false, qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject);
    };
    /*
     * Check the Required datas are loaded for openig response. If so open Response open action for re directing the page
     */
    ResponseSearchHelper.openResponse = function () {
        if (qigStore.instance.selectedQIGForMarkerOperation !== undefined &&
            examinerStore.instance.getMarkerInformation !== undefined &&
            worklistStore.instance.getCurrentWorklistResponseBaseDetails() !== undefined &&
            markschemeStructureStore.instance.isMarkSchemeStructureLoaded() &&
            sriptStore.instance.getCandidateResponseMetadata !== undefined) {
            // load stamps defined for the selected mark scheme groupId
            var getStampPromise = stampActionCreator.getStampData(responseStore.instance.searchedResponseData.markSchemeGroupId, stampStore.instance.stampIdsForSelectedQIG, responseStore.instance.markingMethod, responseHelper.isEbookMarking, true);
            Promise.Promise.all([getStampPromise]).then(function (result) {
                // if response is not belongs in team management, it would be in Marking check. Load marking check details
                if (configurableCharacteristicsValues.requestMarkingCheck(responseStore.instance.searchedResponseData.markSchemeGroupId) &&
                    !responseStore.instance.searchedResponseData.isTeamManagement &&
                    responseStore.instance.searchedResponseData.examinerId !==
                        responseStore.instance.searchedResponseData.loggedInExaminerId &&
                    responseStore.instance.searchedResponseData.triggerPoint !== enums.TriggerPoint.SupervisorRemark) {
                    markingCheckActionCreator.getMarkCheckExaminers(responseStore.instance.searchedResponseData.markSchemeGroupId);
                }
                var markGroupId = responseStore.instance.searchedResponseData.markGroupId;
                if (stampStore.instance.stampIdsForSelectedQIG) {
                    var displayId = void 0;
                    // If display Id is Null, Find the display id using mark group Id.
                    if (responseStore.instance.searchedResponseData.displayId == null) {
                        // identify the markgroup for which display id can be found
                        // this is required for whole response remark mark now which creates multiple markgroupids
                        // among which only one can find the display id from the worklist data.
                        responseStore.instance.searchedResponseData.wholeresponseMarkGroupIds.forEach(function (mgid) {
                            if (worklistStore.instance.getResponseDetailsByMarkGroupId(mgid) &&
                                worklistStore.instance.getResponseDetailsByMarkGroupId(mgid).displayId) {
                                markGroupId = mgid;
                            }
                        });
                        displayId = worklistStore.instance.getResponseDetailsByMarkGroupId(markGroupId).displayId;
                    }
                    else {
                        displayId = parseInt(responseStore.instance.searchedResponseData.displayId);
                    }
                    if (markGroupId == null) {
                        markGroupId = responseStore.instance.searchedResponseData.esMarkGroupId;
                    }
                    responseHelper.openResponse(displayId, enums.ResponseNavigation.specific, responseStore.instance.searchedResponseData.responseMode, markGroupId, enums.ResponseViewMode.zoneView, responseStore.instance.searchedResponseData.triggerPoint);
                    markSchemeHelper.getMarks(displayId, responseStore.instance.searchedResponseData.markingModeId);
                    eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(displayId);
                }
            });
        }
    };
    /**
     * Load favorite Stamp for selected QIG
     */
    ResponseSearchHelper.loadFavoriteStampForSelectedQig = function () {
        if (markingStore.instance.selectedQIGExaminerRoleId !== undefined &&
            !markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            var favoriteStamps = userOptionsHelper.getUserOptionByName(useroptionKeys.REMEMBER_CHOSEN_STAMPS, markingStore.instance.selectedQIGExaminerRoleId);
            // if favorite stamps from user options is undefined, reset to an empty list.
            // This is needed in case of whole response, when QIGs are changed in Markscheme panel
            favoriteStamps = favoriteStamps ? favoriteStamps : '';
            // Split the comma separated favorite stamp and convert it to array of number
            var favoriteStampList = favoriteStamps === '' ? [] : stringHelper.split(favoriteStamps, stringHelper.COMMA_SEPARATOR).map(Number);
            // Get the favourite stamps having maximum count in the component
            if (favoriteStampList.length === 0) {
                favoriteStampList = ResponseSearchHelper.getFavoriteStampsHavingMaximumCountInAllQIGs(markingStore.instance.selectedQIGExaminerRoleId, responseStore.instance.isWholeResponse);
                if (favoriteStampList.length > 0) {
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add, undefined, Immutable.List(favoriteStampList));
                }
            }
            stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.LoadFromUserOption, undefined, Immutable.List(favoriteStampList));
            var stampIdList = stampStore.instance.stampIdsForQIG(markingStore.instance.selectedQIGMarkSchemeGroupId);
            // Deselect the stamp cursor if the annotation is not in the QIG's stamp list
            if (stampIdList !== undefined && toolbarStore.instance.selectedStampId !== 0 &&
                !stampIdList.contains(toolbarStore.instance.selectedStampId)) {
                stampActionCreator.deSelectAnnotation();
            }
        }
    };
    return ResponseSearchHelper;
}());
module.exports = ResponseSearchHelper;
//# sourceMappingURL=responsesearchhelper.js.map