import enums = require('../../components/utility/enums');
import Promise = require('es6-promise');
import Immutable = require('immutable');

import stringHelper = require('../../utility/generic/stringhelper');
import targetHelper = require('../../utility/target/targethelper');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import userOptionsHelper = require('../useroption/useroptionshelper');
import dataServiceHelper = require('../../utility/generic/dataservicehelper');
import scriptImageDownloadHelper = require('../../components/utility/backgroundworker/scriptimagedownloadhelper');
import scriptImageDownloader = require('../../utility/backgroundworkers/scriptimagedownloader/scriptimagedownloader');

import qigStore = require('../../stores/qigselector/qigstore');
import stampStore = require('../../stores/stamp/stampstore');
import sriptStore = require('../../stores/script/scriptstore');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import markschemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
import markingStore = require('../../stores/marking/markingstore');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');

import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import qigActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
import markerInformationActionCreator = require('../../actions/markerinformation/markerinformationactioncreator');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import markingCheckActionCreator = require('../../actions/markingcheck/markingcheckactioncreator');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import acetatesActionCreator = require('../../actions/acetates/acetatesactioncreator');
import markingInstructionActionCreator = require('../../actions/markinginstructions/markinginstructionactioncreator');
import standardisationsetupActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');

import useroptionKeys = require('../useroption/useroptionkeys');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import targetSummaryStore = require('../../stores/worklist/targetsummarystore');
import configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../configurablecharacteristic/configurablecharacteristicsnames');
import responseHelper = require('../../components/utility/responsehelper/responsehelper');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
import getExceptionTypesArguments = require('../../dataservices/exception/getexceptiontypesarguments');
import exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
import configurableCharacteristicsValues = require('../configurablecharacteristic/configurablecharacteristicsvalues');
import eCourseworkHelper = require('../../components/utility/ecoursework/ecourseworkhelper');
import xmlHelper = require('../generic/xmlhelper');
import stampData = require('../../stores/stamp/typings/stampdata');
import toolbarStore = require('../../stores/toolbar/toolbarstore');

class ResponseSearchHelper {
    /**
     * Listen Events
     */
    private static addResponseSearchEvents() {
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, ResponseSearchHelper.onQIGDataLoaded);
        worklistStore.instance.addListener(
            worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
            ResponseSearchHelper.onWorkListSelected
        );
        sriptStore.instance.addListener(
            sriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            ResponseSearchHelper.openResponse
        );
        markschemeStructureStore.instance.addListener(
            markschemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT,
            ResponseSearchHelper.openResponse
        );
        stampStore.instance.addListener(
            stampStore.StampStore.STAMPS_LOADED_EVENT,
            ResponseSearchHelper.loadFavoriteStampForSelectedQig
        );
        markingStore.instance.addListener(
            markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            ResponseSearchHelper.loadFavoriteStampForSelectedQig
        );

        responseStore.instance.addListener(
            responseStore.ResponseStore.RESPONSE_CHANGED,
            ResponseSearchHelper.loadFavoriteStampForSelectedQig
        );

        standardisationSetupStore.instance.addListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_SCRIPT_METADATA_FETCH_EVENT,
            ResponseSearchHelper.onWorkListSelected);
    }

    /**
     * Remove Event Reference
     */
    private static removeResponseSearchEvents() {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, ResponseSearchHelper.onQIGDataLoaded);
        worklistStore.instance.removeListener(
            worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE,
            ResponseSearchHelper.onWorkListSelected
        );
        sriptStore.instance.removeListener(
            sriptStore.ScriptStore.CANDIDATE_RESPONSE_METADATA_RETRIEVAL_EVENT,
            ResponseSearchHelper.openResponse
        );
        markschemeStructureStore.instance.removeListener(
            markschemeStructureStore.MarkSchemeStructureStore.MARK_SCHEME_STRUCTURE_LOADED_EVENT,
            ResponseSearchHelper.openResponse
        );

        stampStore.instance.removeListener(
            stampStore.StampStore.STAMPS_LOADED_EVENT,
            ResponseSearchHelper.loadFavoriteStampForSelectedQig
        );
        markingStore.instance.removeListener(
            markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            ResponseSearchHelper.loadFavoriteStampForSelectedQig
        );

        responseStore.instance.removeListener(
            responseStore.ResponseStore.RESPONSE_CHANGED,
            ResponseSearchHelper.loadFavoriteStampForSelectedQig
        );

        standardisationSetupStore.instance.removeListener(
            standardisationSetupStore.StandardisationSetupStore.STANDARDISATION_SETUP_SCRIPT_METADATA_FETCH_EVENT,
            ResponseSearchHelper.onWorkListSelected);
    }

    /*
     * Data Received For Opening the response. Get the All required data for opening response
     */
    public static initiateSerachResponse = (searchedResponseData: SearchedResponseData) => {
        let canUseCache =
            searchedResponseData.examinerId === searchedResponseData.loggedInExaminerId &&
            qigStore.instance.selectedQIGForMarkerOperation !== undefined;
        if (!canUseCache) {
            // Check the autherised id and selected id for team management check
            if (searchedResponseData.isTeamManagement) {
                // Get QIG data for the logged in data
                qigActionCreator.getQIGSelectorData(searchedResponseData.markSchemeGroupId, true);

                // Open team management related data
                ResponseSearchHelper.openTeamManagementQIGDetails(
                    searchedResponseData.loggedInExaminerRoleId,
                    searchedResponseData.markSchemeGroupId,
                    searchedResponseData.questionPaperId,
                    false
                );
            } else if (searchedResponseData.isStandardisationSetup) {
                // set the marker operation mode as StandardisationSetup
                userInfoActionCreator.changeOperationMode(
                    enums.MarkerOperationMode.StandardisationSetup);
                // Get QIG data for the logged in data
                qigActionCreator.getQIGSelectorData(searchedResponseData.markSchemeGroupId, true, true);
            }

            if (searchedResponseData.triggerPoint !== enums.TriggerPoint.SupervisorRemark && !searchedResponseData.isStandardisationSetup) {
                // Get the QIG selector data, indicate the data loading for search
                qigActionCreator.getQIGSelectorData(searchedResponseData.markSchemeGroupId, false, true);
            }
        } else {
            ResponseSearchHelper.onQIGDataLoaded(true);
        }
    };

    /*
     * Check the Required datas are loaded for openig response. If so open Response open action for re directing the page
     */
    private static onQIGDataLoaded = (isFromSearch: boolean): void => {
        if (isFromSearch && qigStore.instance.selectedQIGForMarkerOperation) {
            // Get the data from store
            let searchedResponseData = responseStore.instance.searchedResponseData;

            // Check cache can be re used or not
            let canUseCache =
                searchedResponseData.examinerId === searchedResponseData.loggedInExaminerId &&
                qigStore.instance.selectedQIGForMarkerOperation !== undefined;
            if (searchedResponseData.isStandardisationSetup) {
                // set the marker operation mode as StandardisationSetup
                userInfoActionCreator.changeOperationMode(
                    enums.MarkerOperationMode.StandardisationSetup);
                ResponseSearchHelper.getStandardisationSetupQigDetails(isFromSearch, false, searchedResponseData);
            } else {
                ResponseSearchHelper.openQIGDetails(
                    searchedResponseData.questionPaperId,
                    searchedResponseData.markSchemeGroupId,
                    searchedResponseData.examinerRoleId,
                    canUseCache,
                    searchedResponseData.approvalStatusId,
                    searchedResponseData.markingMethodId,
                    true,
                    qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                    true
                );
            }
        }
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
    public static openQIGDetails(
        questionPaperId: number,
        markSchemeGroupId: number,
        examinerRoleId: number,
        canUseCache: boolean,
        currentApprovalStatus: enums.ExaminerApproval,
        markingMethod: enums.MarkingMethod,
        dispatchEvents: boolean,
        isElectronicStandardisationTeamMember: boolean,
        isOpeningFromMessage: boolean = false
    ) {
        // Clear the existing background image download queue
        new scriptImageDownloader().clearBackgroundImageDownloadQueue();

        // Preparing initial loading for. This is to ensure that corresponding marking target
        // is loaded before worklist is loaded.
        // (1) Markschemestruture
        // (2) CC
        // (3) Target summary
        // to make ready the application to load associated worklist or progress associated functionality.

        let markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperId, true);

        // If this call from response search, skip dispatching event for avoiding multiple dispatch.
        markSchemeGroupCCPromise.then(function (result: any) {
            // For aggregated qigs the marker progress needs to be cleared on response allocation, because
            // on navigating to another qig new aggregated data needs to be fetched.
            let canUseCacheForMarkerProgress: boolean = qigStore.instance.isAggregatedQigCCEnabledForCurrentQig ?
                false : !targetSummaryStore.instance.isSupervisorRemarkCreated;
            let markingTargetPromise = worklistActionCreator.getWorklistMarkerProgressData(
                examinerRoleId,
                markSchemeGroupId,
                isElectronicStandardisationTeamMember,
                isOpeningFromMessage ? false : dispatchEvents,
                canUseCacheForMarkerProgress
            );

            // Reseting the markscheme loaded status in markSchemeStructureStore
            let resetLoadStatusPromise = markingActionCreator.resetMarkInfoLoadStatus(true);
            let markschemePromise = markSchemeStructureActionCreator.getmarkSchemeStructureList(
                markSchemeGroupId,
                questionPaperId,
                canUseCache,
                dispatchEvents
            );

            // Defect fix: #43078 - We've to skip the cache if examiner approval status in qig is different from current examiner status'
            let canUseCacheForMarkerInformation: boolean =
                qigStore.instance.selectedQIGForMarkerOperation &&
                !(
                    qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus !== currentApprovalStatus &&
                    markerOperationModeFactory.operationMode.isMarkingMode
                ) &&
                canUseCache;

            let markerInformationPromise = markerInformationActionCreator.GetMarkerInformation(
                examinerRoleId,
                markSchemeGroupId,
                dispatchEvents,
                canUseCacheForMarkerInformation,
                currentApprovalStatus
            );

            // Retrieves the acetates data only if not ebookmarking component.
            // TODO: set includeRelatedQigs as true for Multi-Qig component else set as false.
            let acetatesDataPromise = !responseHelper.isOverlayAnnotationsVisible
                ? null
                : acetatesActionCreator.loadAcetatesData(questionPaperId, markSchemeGroupId, true);

            // Retrieves MarkingInstructions Details
            let markingInstructionsPromise = markerOperationModeFactory.operationMode.isMarkingInstructionLinkVisible ?
                markingInstructionActionCreator.getMarkingInstructionsActionCreator(markSchemeGroupId,
                    configurableCharacteristicsHelper.markingInstructionCCValue, false) : null;

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
                .then(function (resultList: any) {
                    qigActionCreator.initialiseWorklist(resultList[0], resultList[1], resultList[2], resultList[3]);
                    markingCheckActionCreator.getMarkingCheckInfo(
                        ResponseSearchHelper.isMarkingCheckAvailable(),
                        examinerRoleId
                    );

                    // While opening a response from message, set the worklist data
                    if (isOpeningFromMessage) {
                        let searchedResponseData = responseStore.instance.searchedResponseData;
                        // Fill The Worklist related data.
                        // Always refresh from cache as the navigation from inbox need to update marking progress
                        worklistActionCreator.notifyWorklistTypeChange(
                            searchedResponseData.markSchemeGroupId,
                            searchedResponseData.examinerRoleId,
                            searchedResponseData.questionPaperId,
                            ResponseSearchHelper.getWorklistTypeByMarkingMode(
                                searchedResponseData.markingModeId,
                                searchedResponseData.isDirectedRemark,
                                searchedResponseData.isAtypical
                            ),
                            searchedResponseData.responseMode,
                            searchedResponseData.remarkRequestType,
                            searchedResponseData.isDirectedRemark,
                            qigStore.instance.selectedQIGForMarkerOperation.isElectronicStandardisationTeamMember,
                            false
                        );
                    }
                });
        });

        // load imagezonelist
        imagezoneActionCreator.getImagezoneList(questionPaperId, markSchemeGroupId, markingMethod, true);

        // Load the exception types for selected QIG
        this.getExceptionTypesForSelectedQig(markSchemeGroupId, examinerRoleId);
    }

    /**
     * returns a value indicating whether marking check button is available
     */
    public static isMarkingCheckAvailable = (): boolean => {
        let operationMode = markerOperationModeFactory.operationMode;

        if (operationMode.isTeamManagementMode) {
            return false;
        }

        let role = qigStore.instance.selectedQIGForMarkerOperation.role;

        let approvalStatus = qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus;

        let isSeniorExaminerPoolCCEnabled =
            configurableCharacteristicsHelper
                .getCharacteristicValue(
                    configurableCharacteristicsNames.SeniorExaminerPool,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                )
                .toLowerCase() === 'true'
                ? true
                : false;

        let isRequestMarkingCheckCCEnabled =
            configurableCharacteristicsHelper
                .getCharacteristicValue(
                    configurableCharacteristicsNames.RequestMarkingCheck,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                )
                .toLowerCase() === 'true'
                ? true
                : false;

        // If SeniorExaminerPool CC is ON, RequestMarkingCheck CC functionality needs to be ignored.
        if (
            !isSeniorExaminerPoolCCEnabled &&
            isRequestMarkingCheckCCEnabled &&
            approvalStatus !== enums.ExaminerApproval.NotApproved &&
            approvalStatus !== enums.ExaminerApproval.Suspended &&
            (role === enums.ExaminerRole.principalExaminer ||
                role === enums.ExaminerRole.assistantPrincipalExaminer ||
                role === enums.ExaminerRole.autoApprovedSeniorTeamLeader)
        ) {
            return true;
        }
    };

    /**
     * After Worklist data loaded, Load the Scripts Information
     */
    public static onWorkListSelected = (markSchemeGroupId: number, questionPaperPartId: number) => {
        let candidateScriptInfoCollection: Immutable.List<candidateScriptInfo>;
        let isStandardisationSetupMode: boolean = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
        if (isStandardisationSetupMode) {
            // set candidate script info collection.
            candidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(Immutable.List<ResponseBase>
                (standardisationSetupStore.instance.standardisationSetUpResponsedetails.standardisationResponses).toArray());
        } else {
            // set candidate script info collection.  
            candidateScriptInfoCollection = scriptImageDownloadHelper.constructCandidateScriptInfo(Immutable.List<ResponseBase>
                (worklistStore.instance.getCurrentWorklistResponseBaseDetails()).toArray());
            worklistStore.instance.setCandidateScriptInfoCollection = candidateScriptInfoCollection;
        }

        let isMarkByQuestionModeSet: boolean = userOptionsHelper.getUserOptionByName(useroptionKeys.IS_MBQ_SELECTED,
            qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId) === 'true';

        let eBookMarkingCCValue = configurableCharacteristicsHelper
            .getCharacteristicValue(configurableCharacteristicsNames.eBookmarking)
            .toLowerCase()
            ? true
            : false;

        // initial call for fetching candidate script meta data.
        let candidateScriptMetadataPromise = scriptActionCreator.fetchCandidateScriptMetadata(
            candidateScriptInfoCollection,
            questionPaperPartId,
            markSchemeGroupId,
            isStandardisationSetupMode ? false : !isMarkByQuestionModeSet,
            false, // TODO: pass includeRelatedQigs value as true, if anyone of the candidate script is whole response.
            false,
            eCourseworkHelper ? eCourseworkHelper.isECourseworkComponent : false,
            eBookMarkingCCValue,
            enums.StandardisationSetup.None,
            false,
            false,
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod === enums.MarkingMethod.MarkFromObject
        );
    };

    /*
     * Check the Required datas are loaded for openig response. If so open Response open action for re directing the page
     */
    public static openResponse = (): void => {
        if (
            qigStore.instance.selectedQIGForMarkerOperation !== undefined &&
            examinerStore.instance.getMarkerInformation !== undefined &&
            (worklistStore.instance.getCurrentWorklistResponseBaseDetails() !== undefined
                || standardisationSetupStore.instance.standardisationSetUpResponsedetails !== undefined) &&
            markschemeStructureStore.instance.isMarkSchemeStructureLoaded() &&
            sriptStore.instance.getCandidateResponseMetadata !== undefined
        ) {
            // load stamps defined for the selected mark scheme groupId
            let getStampPromise = stampActionCreator.getStampData(
                responseStore.instance.searchedResponseData.markSchemeGroupId,
                stampStore.instance.stampIdsForSelectedQIG,
                responseStore.instance.markingMethod,
                responseHelper.isEbookMarking,
                true
            );

            Promise.Promise.all([getStampPromise]).then(function (result: any) {
                // if response is not belongs in team management, it would be in Marking check. Load marking check details
                if (
                    configurableCharacteristicsValues.requestMarkingCheck(
                        responseStore.instance.searchedResponseData.markSchemeGroupId
                    ) &&
                    !responseStore.instance.searchedResponseData.isTeamManagement &&
                    responseStore.instance.searchedResponseData.examinerId !==
                    responseStore.instance.searchedResponseData.loggedInExaminerId &&
                    responseStore.instance.searchedResponseData.triggerPoint !== enums.TriggerPoint.SupervisorRemark
                ) {
                    markingCheckActionCreator.getMarkCheckExaminers(
                        responseStore.instance.searchedResponseData.markSchemeGroupId
                    );
                }

                let markGroupId: number = responseStore.instance.searchedResponseData.markGroupId;

                if (stampStore.instance.stampIdsForSelectedQIG) {
                    let displayId;

                    // If display Id is Null, Find the display id using mark group Id.
                    if (responseStore.instance.searchedResponseData.displayId == null) {
                        // identify the markgroup for which display id can be found
                        // this is required for whole response remark mark now which creates multiple markgroupids
                        // among which only one can find the display id from the worklist data.

                        responseStore.instance.searchedResponseData.wholeresponseMarkGroupIds.forEach(
                            (mgid: number) => {
                                if (
                                    worklistStore.instance.getResponseDetailsByMarkGroupId(mgid) &&
                                    worklistStore.instance.getResponseDetailsByMarkGroupId(mgid).displayId
                                ) {
                                    markGroupId = mgid;
                                }
                            }
                        );

                        displayId = worklistStore.instance.getResponseDetailsByMarkGroupId(markGroupId).displayId;
                    } else {
                        let searchedData = responseStore.instance.searchedResponseData;
                        if (searchedData.isStandardisationSetup) {
                            /* Since displayId holds rig order, 
                            esDisplayId is used to get responseDetails in classified worklist*/
                            displayId = parseInt(responseStore.instance.searchedResponseData.esDisplayId);
                        } else {
                            displayId = parseInt(responseStore.instance.searchedResponseData.displayId);
                        }
                    }

                    if (markGroupId == null) {
                        markGroupId = responseStore.instance.searchedResponseData.esMarkGroupId;
                    }

                    responseHelper.openResponse(
                        displayId,
                        enums.ResponseNavigation.specific,
                        responseStore.instance.searchedResponseData.responseMode,
                        markGroupId,
                        enums.ResponseViewMode.zoneView,
                        responseStore.instance.searchedResponseData.triggerPoint
                    );

                    markSchemeHelper.getMarks(displayId, responseStore.instance.searchedResponseData.markingModeId);
                    eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(displayId);
                }
            });
        }
    };

    /**
     * Get the Worklist Type based on Marking Mode Id
     * @param markingMode
     */
    public static getWorklistTypeByMarkingMode(
        markingMode: enums.MarkingMode,
        isDirectedRemark: boolean,
        isAtypical: boolean
    ): enums.WorklistType {
        let worklistType: enums.WorklistType;
        switch (markingMode) {
            case enums.MarkingMode.Practice:
                worklistType = enums.WorklistType.practice;
                break;
            case enums.MarkingMode.LiveMarking:
                if (isAtypical) {
                    worklistType = enums.WorklistType.atypical;
                } else {
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
                } else {
                    worklistType = enums.WorklistType.pooledRemark;
                }
                break;
            case enums.MarkingMode.Simulation:
                worklistType = enums.WorklistType.simulation;
                break;
        }
        return worklistType;
    }

    /**
     * Load favorite Stamp for selected QIG
     */
    public static loadFavoriteStampForSelectedQig = () => {
        if (!markerOperationModeFactory.operationMode.isAwardingMode &&
            markingStore.instance.selectedQIGExaminerRoleId !== undefined &&
            !standardisationSetupStore.instance.isSelectResponsesWorklist
        ) {
            var favoriteStamps = userOptionsHelper.getUserOptionByName(
                useroptionKeys.REMEMBER_CHOSEN_STAMPS,
                markingStore.instance.selectedQIGExaminerRoleId
            );

            // if favorite stamps from user options is undefined, reset to an empty list.
            // This is needed in case of whole response, when QIGs are changed in Markscheme panel
            favoriteStamps = favoriteStamps ? favoriteStamps : '';

            // Split the comma separated favorite stamp and convert it to array of number
            var favoriteStampList: number[] =
                favoriteStamps === '' ? [] : stringHelper.split(favoriteStamps, stringHelper.COMMA_SEPARATOR).map(Number);

            // Get the favourite stamps having maximum count in the component
            if (favoriteStampList.length === 0) {
                favoriteStampList = ResponseSearchHelper.getFavoriteStampsHavingMaximumCountInAllQIGs(
                    markingStore.instance.selectedQIGExaminerRoleId, responseStore.instance.isWholeResponse);

                if (favoriteStampList.length > 0) {
                    stampActionCreator.updateFavoriteStampCollection(enums.FavoriteStampActionType.Add,
                        undefined,
                        Immutable.List<number>(favoriteStampList));
                }
            }

            stampActionCreator.updateFavoriteStampCollection(
                enums.FavoriteStampActionType.LoadFromUserOption,
                undefined,
                Immutable.List<number>(favoriteStampList)
            );

            let stampIdList: Immutable.List<number> = stampStore.instance.
                stampIdsForQIG(markingStore.instance.selectedQIGMarkSchemeGroupId);

            // Deselect the stamp cursor if the annotation is not in the QIG's stamp list
            if (stampIdList !== undefined && toolbarStore.instance.selectedStampId !== 0 &&
                !stampIdList.contains(toolbarStore.instance.selectedStampId)) {
                stampActionCreator.deSelectAnnotation();
            }
        }
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
    private static getFavoriteStampsHavingMaximumCountInAllQIGs(examinerRoleId: number, isWholeResponse: boolean): number[] {
        let favoriteStamps: string;
        let favoriteStampMaxList: number[] = [];
        let examinerRoleIds: number[] = [];
        let roleId: number = 0;
        let maxStampCount: number = 0;

        // Get the list of all related QIGs from the multiQig component
        let relatedQigList = qigStore.instance.relatedQigList;

        // Get all examinerRoleIds of the logged in user against the current component
        if (relatedQigList && relatedQigList !== undefined) {
            relatedQigList.map((value, key) => {
                examinerRoleIds.push(value.examinerRoleId);
            });
        }

        if (examinerRoleIds !== undefined && examinerRoleIds.length > 0) {
            // Get favorite Stamps against all QIGs
            examinerRoleIds.map((examinerRoleId: number) => {
                favoriteStamps = '';

                // Get favorite Stamps against a QIG
                favoriteStamps = userOptionsHelper.getUserOptionByName(
                    useroptionKeys.REMEMBER_CHOSEN_STAMPS,
                    examinerRoleId
                );

                if (favoriteStamps !== '' && favoriteStamps !== undefined) {
                    // Split the comma separated favorite stamps and convert it to array of number
                    var favoriteStampList: number[] =
                        favoriteStamps === ''
                            ? []
                            : stringHelper.split(favoriteStamps, stringHelper.COMMA_SEPARATOR).map(Number);

                    // Check for the maximum favorite stamps QIG
                    if (favoriteStampList.length > maxStampCount) {
                        // Reset array
                        favoriteStampMaxList.length = 0;

                        // Add current QIG's stamps to array
                        favoriteStampList.map((stampId: number) => {
                            favoriteStampMaxList.push(stampId);
                        });

                        roleId = examinerRoleId;
                        maxStampCount = favoriteStampList.length;
                    }
                }
            });
        }

        return favoriteStampMaxList;
    }

    /**
     * Get exception types for the selected QIG
     */
    private static getExceptionTypesForSelectedQig(markSchemeGroupId: number, examinerRoleId: number) {
        //arguments for getting the exception types.
        let args: getExceptionTypesArguments = {
            QIGId: markSchemeGroupId,
            SelectedExaminerRoleId: examinerRoleId,
            GetAllExceptionTypes: false,
            ISMarkFromPaper: false,
            IncludeRelatedQigs: qigStore.instance.selectedQIGForMarkerOperation.hasPermissionInRelatedQIGs
        };
        exceptionActionCreator.getExceptionTypes(args);
    }

    /**
     * Open Team Management details
     */
    public static openTeamManagementQIGDetails(
        examinerRoleId: number,
        markSchemeGroupId: number,
        questionPaperPartId: number,
        loadTeamManagementScreen: boolean
    ) {
        // Get the Mark Scheme Level CC's, It is used to display the Team List Grids coulmns.
        ccActionCreator.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperPartId);

        // If call from, as part of search in message and its team management already store have the team management value.
        if (loadTeamManagementScreen) {
            // set the marker operation mode as Team Management
            userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.TeamManagement);

            // Invoke the action creator to Open the QIG
            qigActionCreator.openQIG(markSchemeGroupId);
        }

        teamManagementActionCreator.openTeamManagement(
            examinerRoleId,
            markSchemeGroupId,
            false,
            loadTeamManagementScreen
        );
    }

    /**
     * Getting data for opening response in standardisation setup mode.
     */
    public static getStandardisationSetupQigDetails = (isDataFromSearch: boolean = false,
        isDataFromHistory: boolean = false, searchedResponseData?: SearchedResponseData): void => {
        if (isDataFromHistory) {
            return;
        }
        let standardisationWorklistDetailPromise: any;
        if (isDataFromSearch) {
            standardisationWorklistDetailPromise = standardisationsetupActionCreator.
                getStandardisationWorklistDetails(searchedResponseData.examinerRoleId,
                    searchedResponseData.examinerId,
                    searchedResponseData.markSchemeGroupId,
                    searchedResponseData.standardisationSetupWorklistType);
        } else {
            stampActionCreator.getStampData(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                stampStore.instance.stampIdsForSelectedQIG,
                qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
                responseHelper.isEbookMarking,
                true);
            standardisationWorklistDetailPromise = true;
        }

        let getStandardisationTargetDetails = standardisationsetupActionCreator.getStandardisationTargetDetails
            (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);

        let markSchemeGroupCCPromise = ccActionCreator.getMarkSchemeGroupCCs(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);

        let markschemePromise = markSchemeStructureActionCreator.getmarkSchemeStructureList(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            false,
            true);

        let markerInformationPromise = markerInformationActionCreator.GetMarkerInformation(
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            true,
            true,
            qigStore.instance.selectedQIGForMarkerOperation.examinerApprovalStatus);

        let acetatesDataPromise = responseHelper.isOverlayAnnotationsVisible
            ? acetatesActionCreator.loadAcetatesData(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, true) : null;

        imagezoneActionCreator.getImagezoneList
            (qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId,
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod, true);

        Promise.Promise.all([
            markSchemeGroupCCPromise,
            markerInformationPromise,
            standardisationWorklistDetailPromise
        ]).then(function (result: any) {
            standardisationsetupActionCreator.getStandardisationSetupPermissionCCData
                (qigStore.instance.selectedQIGForMarkerOperation.role,
                qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            if (isDataFromSearch) {
                standardisationsetupActionCreator.stdSetupcandidateScriptMetadataFetchAction(searchedResponseData.markSchemeGroupId,
                    searchedResponseData.questionPaperId);
            } else {
                // If the selected Standardisation Setup WorkList is none then navigate to select responses
                let selectedStandardisationSetupWorkList =
                    standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.None ?
                        enums.StandardisationSetup.SelectResponse : standardisationSetupStore.instance.selectedStandardisationSetupWorkList;
                let standardisationSetupCCData =
                    qigStore.instance.getSSUPermissionsData(qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
                let cpsCCValue = configurableCharacteristicsHelper.getCharacteristicValue
                    (configurableCharacteristicsNames.CommonProvisionalStandardisation,
                    qigStore.instance.getSelectedQIGForTheLoggedInUser.markSchemeGroupId);
                if (cpsCCValue === 'true' && standardisationSetupCCData
                    && !standardisationSetupCCData.role.permissions.viewCommonProvisionalAvailableResponses
                    && selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
                    selectedStandardisationSetupWorkList = enums.StandardisationSetup.ProvisionalResponse;
                }
                // load select Responses details on loading from standardisation setup button.
                standardisationsetupActionCreator.standardisationSetupWorkListSelection
                    (selectedStandardisationSetupWorkList,
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
            }
        });
    }
}

export = ResponseSearchHelper;
