import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import Promise = require('es6-promise');
import base = require('../base/actioncreatorbase');
import standardisationsetupleftPanelToggleAction = require('./standardisationsetupleftpaneltoggleaction');
import standardisationSetupWorkListSelectAction = require('./standardisationsetupworklistselectaction');
import standardisationSetupDataServices = require('../../dataservices/standardisationsetup/standardisationsetupdataservices');
import standardisationSetupTargetDetailsAction = require('./getstandardisationsetuptargetdetailsaction');
import getScriptsOfSelectedCentreAction = require('./getscriptsofselectedcentreaction');
import standardisationCentreScriptOpenAction = require('./standardisationcentrescriptopenaction');
import standardisationSetupCentresDetailsAction = require('./getstandardisationsetupcentresdetailsaction');
import standardisationTargetDetails = require('../../stores/standardisationsetup/typings/standardisationtargetdetails');
import sortAction = require('./sortaction');
import standardisationSortDetails = require('../../components/utility/grid/standardisationsortdetails');
import standardisationResponseDetailsAction = require('./getstandardisationresponsedetailsaction');
import stdSetupPermissionCCDataGetAction = require('./standardisationsetuppermissionccdatagetaction');
import selectToMarkPopupAction = require('./selecttomarkpopupaction');
import createStandardisationRigAction = require('./createstandardisationrigaction');
import stdDeclassifyPopupDisplayAction = require('./declassifypopupdisplayaction');
import stdReclassifyPopupDisplayAction = require('./reclassifypopupdisplayaction');
import reclassifyResponseAction = require('./reclassifyresponseaction');
import stdReclassifyErrorPopupDisplayAction = require('./reclassifyerrorpopupdisplayaction');
import reorderResponseAction = require('./reorderresponseaction');
import updateHideResponseStatusAction = require('./updatehideresponsestatusaction');
import hideReuseToggleAction = require('./hidereusetoggleaction');

import getReUseRigDetailsAction = require('./getreuserigdetailsaction');
import createStandardisationRIGArgument = require('../../stores/standardisationsetup/typings/createstandardisationrigarguments');
import createStandardisationRIGReturnData = require('../../stores/standardisationsetup/typings/createstandardisationrigreturndata');
import createStandardisationRIGReturn = require('../../stores/standardisationsetup/typings/createstandardisationrigreturn');
import updateBlueHelperMessageVisibilityAction = require('./updateselecttomarkhelpermessagevisibilityaction');
import completeStandardisationSetupAction = require('./completestandardisationsetupaction');
import updateStdResponseCollectionAction = require('./updatestandardisationsetupresponsecollectionaction');
import Immutable = require('immutable');

import declassifyResponseAction = require('./declassifyresponseaction');
import updateESMarkGroupMarkingModeData = require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');
import updateMousePositionAction = require('../response/updatemousepositionaction');
import copymarksandannotationasdefinitiveaction = require('./copymarksandannotationasdefinitiveaction');
import stdReclassifyMultiOptionPopupDisplayAction = require('./reclassifymultioptionpopupdisplayaction');
import saveNoteAction = require('./savenoteaction');
import discardStandardisationResponseArgument = require('../../stores/standardisationsetup/typings/discardstandardisationresponseargument');
import discardStandardisationResponseAction = require('./discardstandardisationresponseaction');
import standardisationCentreScriptFilterDetails = require('../../components/utility/grid/standardisationcentrescriptfilterdetails');
import standardisationCentreScriptFilterAction = require('../../actions/standardisationsetup/standardisationcentrescriptfilteraction');
import stdShareResponsePopupDisplayAction = require('./shareresponsepopupdisplayaction');
import standardisationSetupScriptMetadataFetchAction = require('./standardisationsetupscriptmetadatafetchaction');
import concurrentSaveFailInStmPopupAction = require('./concurrentsavefailinstmpopupaction');
import standardisationSetupSelectTabAction = require('./standardisationselecttabaction');

import discardStandardisationResponseReturn = require('../../stores/standardisationsetup/typings/discardstandardisationresponsereturn');
import classifyResponseAction = require('./classifyresponseaction');
import updateESMarkingModeReturn = require('../../stores/standardisationsetup/typings/updateesmarkingmodereturn');
import qigStore = require('../../stores/qigselector/qigstore');
import configurableCharacteristicHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import ReuseRigPopupDisplayAction = require('./ReuseRigPopupDisplayAction');
import reuseRIGActionArgument = require('../../stores/standardisationsetup/typings/reuserigactionarguments');
import reuseRIGActionReturn = require('../../stores/standardisationsetup/typings/reuserigactionreturn');
import reuseRIGAction = require('./reuserigaction');
import historyItem = require('../../utility/breadcrumb/historyitem');
import standardisationSetupHistoryInfoAction = require('./standardisationsetuphistoryinfoaction');

/**
 * Standardisation setup action creator
 */
class StandardisationActionCreator extends base {
    /**
     * Saves the state of the Standardisation setup left panel for the session
     * @param isLeftPanelCollapsed indicates whether the panel is collapsed or not
     */
    public leftPanelToggleSave(isLeftPanelCollapsed: boolean): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(
                    new standardisationsetupleftPanelToggleAction(isLeftPanelCollapsed)
                );
            })
            .catch();
    }

    /**
     * Set the standardisation setup selectedWorkList in standardisation setup store
     * @param selectedWorkList
     */
    public standardisationSetupWorkListSelection(
        selectedWorkList: enums.StandardisationSetup,
        markSchemeGroupId: number,
        examinerRoleId: number,
        useCache: boolean = false): void {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(
                    new standardisationSetupWorkListSelectAction(
                        selectedWorkList,
                        markSchemeGroupId,
                        examinerRoleId,
                        useCache)
                );
            })
            .catch();
    }

    /**
     * action creator for StandardisationTargetDetails
     */
    public getStandardisationTargetDetails(markSchemeGroupId: number, examinerRoleId: number) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            standardisationSetupDataServices.getStandardisationTargetDetails(
                markSchemeGroupId,
                examinerRoleId,
                function (
                    success: boolean,
                    standardisationTargetDetailsListData: standardisationTargetDetails
                ) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(standardisationTargetDetailsListData)) {
                        dispatcher.dispatch(
                            new standardisationSetupTargetDetailsAction(
                                success,
                                markSchemeGroupId,
                                examinerRoleId,
                                standardisationTargetDetailsListData
                            )
                        );
                        resolve(standardisationTargetDetailsListData);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
            );
        });
    }

    /**
     * Action creator to retrive centre details, for the selected response.
     */
    public getStandardisationCentresDetails(
        questionPaperId: number,
        specialNeed: boolean,
        isMarkFromPaper: boolean,
        examinerRoleId: number,
        stdWorklistViewType: enums.STDWorklistViewType,
        useCache: boolean
    ) {
        let that = this;

        return new Promise.Promise(function (resolve: any, reject: any) {
            standardisationSetupDataServices.getStandardisationCentresDetails(
                questionPaperId,
                specialNeed,
                isMarkFromPaper,
                examinerRoleId,
                useCache,
                function (
                    success: boolean,
                    stadardisationCentreDetailsListData: StandardisationCentreDetailsList
                ) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(stadardisationCentreDetailsListData)) {
                        dispatcher.dispatch(
                            new standardisationSetupCentresDetailsAction(
                                success,
                                stdWorklistViewType,
                                stadardisationCentreDetailsListData
                            )
                        );
                        resolve(stadardisationCentreDetailsListData);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
            );
        });
    }

    /**
     * getReuseRigDetails action creator
     * @param examinerRoleID
     * @param markSchemeGroupID
     * @param isReUsableResponsesSelected
     * @param isHideResponsesSelected
     */
    public getReuseRigDetails(
        examinerRoleID: number,
        markSchemeGroupID: number,
        isReUsableResponsesSelected: boolean,
        isHideResponsesSelected: boolean,
        isShowHiddenResponseSelected: boolean,
        useCache?: boolean
    ) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            standardisationSetupDataServices.getReuseRigDetails(
                examinerRoleID,
                markSchemeGroupID,
                isReUsableResponsesSelected,
                isHideResponsesSelected,
                useCache,
                function (
                    success: boolean,
                    standardisationSetupReusableDetailsList: Immutable.List<
                        StandardisationResponseDetails
                        >
                ) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(standardisationSetupReusableDetailsList)) {
                        dispatcher.dispatch(
                            new getReUseRigDetailsAction(
                                success,
                                isShowHiddenResponseSelected,
                                standardisationSetupReusableDetailsList
                            )
                        );
                        resolve(standardisationSetupReusableDetailsList);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
            );
        });
    }

    /**
     * updateHideResponseStatus action creator
     * @param isActiveStatus
     * @param displayId
     */
    public updateHideResponseStatus(
        isActiveStatus: boolean,
        displayId: string
    ) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            standardisationSetupDataServices.updateHideResponseStatus(
                displayId,
                isActiveStatus,
                function (
                    success: boolean,
                    isHideStatusCompleted: boolean
                ) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (isHideStatusCompleted && that.validateCall(isHideStatusCompleted)) {
                        dispatcher.dispatch(
                            new updateHideResponseStatusAction(
                                success,
                                isHideStatusCompleted,
                                displayId,
                                isActiveStatus
                            )
                        );
                        resolve(isHideStatusCompleted);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
            );
        });
    }

    /**
     * Handle the Hide Reuse Toggle Change
     */
    public onHideReuseToggleChange(isShowHiddenResponseSelected: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(new hideReuseToggleAction(isShowHiddenResponseSelected));
            })
            .catch();
    }

    /**
     * Open standardisation centre script
     * @param candidateScriptId
     */
    public openStandardisationCentreScript(candidateScriptId: number, scriptAvailable: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(
                    new standardisationCentreScriptOpenAction(candidateScriptId, scriptAvailable)
                );
            })
            .catch();
    }

    /**
     * action creator to retrive script details, for the selected Centre.
     */
    public getScriptsOfSelectedCentre(
        markSchemeGroupId: number,
        questionPaperID: number,
        centrePartID: number,
        considerAtypical: boolean,
        examinerRoleId: number,
        centreId: number,
        isTriggeredFromResponseHeader: boolean = false,
        direction: enums.ResponseNavigation = enums.ResponseNavigation.none
    ) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            standardisationSetupDataServices.GetScriptDetailsOfSelectedCentre(
                markSchemeGroupId,
                questionPaperID,
                centrePartID,
                considerAtypical,
                examinerRoleId,
                function (
                    success: boolean,
                    standardisationScriptDetailsList: StandardisationScriptDetailsList
                ) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(standardisationScriptDetailsList)) {
                        dispatcher.dispatch(
                            new getScriptsOfSelectedCentreAction(
                                success,
                                centrePartID,
                                centreId,
                                isTriggeredFromResponseHeader,
                                direction,
                                standardisationScriptDetailsList
                            )
                        );
                        resolve(standardisationScriptDetailsList);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
            );
        });
    }

    /**
     * Handle the sort order
     */
    public onSortedClick(sortDetails: standardisationSortDetails) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(new sortAction(sortDetails));
            })
            .catch();
    }

    /**
     * action creator for ClassifiedResponseDetails
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     */
    public getClassifiedResponseDetails(
        examinerRoleID: number,
        examinerId: number,
        markSchemeGroupId: number,
        isViewMCQRIGMarks: boolean,
        worklistViewType: enums.STDWorklistViewType
    ) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.GetClassifiedResponseDetails
                (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, that.isOnline,
                function (success: boolean, classifiedResponseDetailsData: StandardisationSetupResponsedetailsList) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(classifiedResponseDetailsData)) {
                        dispatcher.dispatch(new standardisationResponseDetailsAction
                            (success, worklistViewType, classifiedResponseDetailsData, false,
                            enums.StandardisationSetup.ClassifiedResponse, markSchemeGroupId));
                        resolve(classifiedResponseDetailsData);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
                );
        });
    }

    /**
     * action creator for UnClassifiedResponseDetails
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     */
    public getUnClassifiedResponseDetails(
        examinerRoleID: number,
        examinerId: number,
        markSchemeGroupId: number,
        isViewMCQRIGMarks: boolean,
        worklistViewType: enums.STDWorklistViewType
    ) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.GetUnClassifiedResponseDetails(
                examinerRoleID,
                examinerId,
                markSchemeGroupId,
                isViewMCQRIGMarks,
                worklistViewType,
                function (success: boolean, unclassifiedResponseDetailsData: StandardisationSetupResponsedetailsList) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(unclassifiedResponseDetailsData)) {
                        dispatcher.dispatch(new standardisationResponseDetailsAction(success,
                            worklistViewType, unclassifiedResponseDetailsData, false,
                            enums.StandardisationSetup.UnClassifiedResponse, markSchemeGroupId));
                        resolve(unclassifiedResponseDetailsData);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
            );
        });
    }

    /**
     * action creator to get Provisional Response details
     * 
     * @param {number} examinerRoleID 
     * @param {number} examinerId 
     * @param {number} markSchemeGroupId 
     * @param {boolean} isViewMCQRIGMarks 
     * @param {boolean} [doUseCache=true] 
     * @param {enums.STDWorklistViewType} worklistViewType 
     * @returns 
     * @memberof StandardisationActionCreator
     */
    public getProvisionalResponseDetails(
        examinerRoleID: number,
        examinerId: number,
        markSchemeGroupId: number,
        isViewMCQRIGMarks: boolean,
        doUseCache: boolean = true,
        worklistViewType: enums.STDWorklistViewType
    ) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.GetProvisionalResponseDetails
                (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType,
                doUseCache, that.isOnline,
                function (success: boolean, provisionalResponseDetailsData: StandardisationSetupResponsedetailsList) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(provisionalResponseDetailsData)) {
                        dispatcher.dispatch(new standardisationResponseDetailsAction
                            (success, worklistViewType, provisionalResponseDetailsData, false,
                            enums.StandardisationSetup.ProvisionalResponse, markSchemeGroupId));
                        resolve(provisionalResponseDetailsData);
                    } else {
                        // This will stop promise.all from exec
                        reject(null);
                    }
                }
                );
        });
    }

    /**
     * Action creator to retrive standardisation setup permission cc details.
     * @param examinerRole 
     * @param markSchemeGroupId 
     */
    public getStandardisationSetupPermissionCCData(
        examinerRole: enums.ExaminerRole,
        markSchemeGroupId: number
    ) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(
                    new stdSetupPermissionCCDataGetAction(examinerRole, markSchemeGroupId)
                );
            })
            .catch();
    }

    /**
     * when select to mark button is clicked for a centre script response
     * @param examinerRole 
     * @param markSchemeGroupId 
     */
    public selectStandardisationResponsePopupOpen(popupType: enums.PopUpType, candidateScriptID: number) {
        let that = this;
        let wholeResponseProvisionalMarking: boolean = configurableCharacteristicHelper.getExamSessionCCValue(
            configurableCharacteristicNames.WholeResponseProvisionalMarking,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId).toLowerCase() === 'true' ? true : false;
        new Promise.Promise(function (resolve: any, reject: any) {
            // Fetch multiqig provisional details only if 
            // 1.WholeResponseProvisionalMarking CC is ON
            // 2.Examiner have permission in any related QIG.
            // 3.Current QIG have the multiQIGProvisionals permission in the StandardisationSetupPermissions
            if (wholeResponseProvisionalMarking && qigStore.instance.selectedQIGForMarkerOperation.isstmInAnyRelatedQIGs &&
                standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.multiQIGProvisionals) {
                // Data service call fetch data from DB
                standardisationSetupDataServices.getProvisionalQIGDetails
                    (candidateScriptID,
                    function (success: boolean, provisionalQigDetailsData: Immutable.List<ProvisionalQIGDetailsReturn>) {
                        // This will validate the call to find any network failure
                        // and is mandatory to add this.
                        if (that.validateCall(provisionalQigDetailsData)) {
                            resolve(provisionalQigDetailsData);
                        } else {
                            // This will stop promise.all from exec
                            reject(null);
                        }
                    }
                    );
            } else {
                resolve(null);
            }
        })
            .then((provisionalQigDetailsData: Immutable.List<ProvisionalQIGDetailsReturn>) => {
                dispatcher.dispatch(new selectToMarkPopupAction(popupType, provisionalQigDetailsData));
            })
            .catch();
    }

    /**
     * Updates whether to display the blue helper message of select to mark button.
     * @param isVisible
     */
    public updateSelectToMarkHelperMessageVisibility(isVisible: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        })
            .then(() => {
                dispatcher.dispatch(new updateBlueHelperMessageVisibilityAction(isVisible));
            })
            .catch();
    }

    /**
     * create Standardisation RIG. Assessor 3 doesn't have
     * multiple select and create provisional hence the list input is so far not required.
     * @param examinerRoleID 
     * @param candidateScriptID 
     * @param markSchemeGroupID 
     * @param markingMode
     * @param provisionalMarkingType
     */
    public createStandardisationRig(
        examinerRoleID: number,
        candidateScriptID: number,
        markSchemeGroupIDs: Array<Number>,
        markingMode: enums.MarkingMode,
        doMarkNow: boolean,
        provisionalMarkingType: enums.ProvisionalMarkingType
    ) {
        let that = this;
        let arg: createStandardisationRIGArgument = {
            candidateScriptID: candidateScriptID,
            markSchemeGroupIDs: markSchemeGroupIDs,
            provisionalMarkingType: provisionalMarkingType
        };

        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.createStandardisationRig(arg, function (
                success: boolean,
                returnData: createStandardisationRIGReturn
            ) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(returnData)) {
                    dispatcher.dispatch(new createStandardisationRigAction(success, returnData, doMarkNow));
                    resolve(returnData);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    }


    /**
     * Complete Standardisation setup action
     * @param markSchemeGroupID    
     */
    public completeStandardisationSetup(
        markSchemeGroupID: number
    ) {
        let that = this;
        let arg: CompleteStandardisationSetupDetail = {
            markSchemeGroupId: markSchemeGroupID
        };
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.completeStandardisation(arg, function (
                success: boolean,
                returnData: CompleteStandardisationSetupReturn
            ) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(returnData)) {
                    dispatcher.dispatch(new completeStandardisationSetupAction(success, returnData));
                    resolve(returnData);
                } else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    }

	/**
	 * Declassify Popup Open Action
	 * @param displayId
	 * @param totalmark
	 * @param candidateScriptId
	 * @param esCandidateScriptMarkSchemeGroupId
	 * @param markingModeId
	 * @param rigOrder
	 */
    public declassifyPopupOpen(displayId: string, totalmark: number,
        candidateScriptId: number, esCandidateScriptMarkSchemeGroupId: number, markingModeId: number,
        rigOrder: number, rowVersion: string, markSchemeGroupId: number) {

        let declassifiedResponseDetails = {
            candidateScriptId: candidateScriptId,
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkSchemeGroupId,
            markSchemeGroupId: markSchemeGroupId,
            markingModeId: enums.MarkingMode.PreStandardisation,
            previousMarkingModeId: markingModeId,
            rigOrder: null,
            isRigOrderUpdateRequired: true,
            isSTMSeed: false,
            displayId: displayId,
            totalMarkValue: totalmark,
            assignNextRigOrder: false,
            esMarkGroupRowVersion: rowVersion
        };
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stdDeclassifyPopupDisplayAction(declassifiedResponseDetails));
        }).catch();
    }

    /**
     * Share Response Popup Open Action
     * @param stdResponseDetails
     * @param fromMarkScheme
     */
    public displayShareResponsePopup(stdResponseDetails: StandardisationResponseDetails, fromMarkScheme: boolean) {
		new Promise.Promise(function (resolve: any, reject: any) {
			resolve();
        }).then(() => {
            dispatcher.dispatch(new stdShareResponsePopupDisplayAction(stdResponseDetails, fromMarkScheme));
		}).catch();
    }

    /**
     * Method to update the mouse pointer position during mouse move and drag events.
     * @param {number} xPosition
     * @param {number} yPosition
     */
    public setMousePosition(yPosition: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateMousePositionAction(0, yPosition));
        });
    }

	/**
	 * Reclassify popup open action
	 * @param displayId
	 * @param totalmark
	 */
    public reclassifyPopupOpen(displayId: string, totalmark: number,
        previousMarkingMode: number, currentMarkingMode: number,
        candidateScriptId: number, esCandidateScriptMarkingGroupId: number,
        rigOrder: number, markSchemeGroupId: number, oldRigOrder: number,
        rowVersion: string) {
        let reclassifiedResponseDetails = {
            candidateScriptId: candidateScriptId,
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkingGroupId,
            markSchemeGroupId: markSchemeGroupId,
            markingModeId: currentMarkingMode,
            previousMarkingModeId: previousMarkingMode,
            rigOrder: rigOrder,
            isRigOrderUpdateRequired: true,
            isSTMSeed: false,
            displayId: displayId,
            totalMarkValue: totalmark,
            oldRigOrder: oldRigOrder,
            assignNextRigOrder: false,
            esMarkGroupRowVersion: rowVersion
        };
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stdReclassifyPopupDisplayAction(reclassifiedResponseDetails));
        }).catch();
    }

	/**
	 * Reclassify popup open action
	 * @param reclassifiedResponseDetails
	 * @param area
	 */
    public reclassifyResponse(reclassifiedResponseDetails: updateESMarkGroupMarkingModeData,
        area: enums.PageContainers = enums.PageContainers.None) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call to update the esMarkinkMode (reclassify).
            standardisationSetupDataServices.updateESMarkGroupMarkingMode(reclassifiedResponseDetails,
                function (success: boolean, updateESMarkingModeReturn: updateESMarkingModeReturn) {
                    let errorCode: enums.UpdateESMarkingModeErrorCode =
                        updateESMarkingModeReturn ? updateESMarkingModeReturn.updateESMarkingModeErrorCode :
                            enums.UpdateESMarkingModeErrorCode.None;
                    if (success) {
                        dispatcher.dispatch(new reclassifyResponseAction(success, reclassifiedResponseDetails));
                    } else {

                        // Handle the concurrency scenarios.
						if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssue) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(false, area));
						} else if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssueDueToStandardisationComplete) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(true, area));
						} else {
                            dispatcher.dispatch(new stdReclassifyErrorPopupDisplayAction(false, true));
                        }
                    }
                }
            );
        });
    }

    /**
     * Classify response action
     * @param classifiedResponseDetails
     */
    public classifyResponse(classifiedResponseDetails: updateESMarkGroupMarkingModeData,
          area: enums.PageContainers = enums.PageContainers.None) {
        let that = this;
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call to update the esMarkinkMode (classify)
            standardisationSetupDataServices.classifyProvisionalRIG(classifiedResponseDetails,
                function (success: boolean, updateESMarkingModeReturn: updateESMarkingModeReturn) {
                    let errorCode: enums.UpdateESMarkingModeErrorCode =
                        updateESMarkingModeReturn ? updateESMarkingModeReturn.updateESMarkingModeErrorCode :
                            enums.UpdateESMarkingModeErrorCode.None;
                    if (success) {
                        dispatcher.dispatch(new classifyResponseAction(success, classifiedResponseDetails));
                    } else {
                        // Handle the concurrency scenarios.
						if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssue) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(false, area));
						} else if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssueDueToStandardisationComplete) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(true, area));
						}
                    }
                }
            );
        });
    }

    /**
     * Method to declassify selected response.
     * @param candidateScriptId
     * @param markSchemeGroupId
     * @param esCandidateScriptMarkSchemeGroupId
     */
    public declassifyResponse(declassifyResponseDetails: updateESMarkGroupMarkingModeData) {
        let that = this;

        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.updateESMarkGroupMarkingMode(declassifyResponseDetails,
                function (success: boolean, updateESMarkingModeReturn: updateESMarkingModeReturn) {

                    if (success) {
                        dispatcher.dispatch(new declassifyResponseAction(success, declassifyResponseDetails));
                    } else {
                        let errorCode: enums.UpdateESMarkingModeErrorCode =
                            updateESMarkingModeReturn ? updateESMarkingModeReturn.updateESMarkingModeErrorCode :
                            enums.UpdateESMarkingModeErrorCode.None;
                        // Handle the concurrency scenarios.
                        if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssue) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(false));
                        } else if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssueDueToStandardisationComplete) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(true));
                        }
                    }
                });
        });
    }

    /**
     * Method to notify reclassify action cancelled.
     */
    public rejectedReclassifyAction() {
        dispatcher.dispatch(new stdReclassifyErrorPopupDisplayAction(true, true));
    }

	/**
	 * Re Orerder response
	 * @param displayId
	 * @param previousMarkingMode
	 * @param currentMarkingMode
	 * @param candidateScriptId
	 * @param esCandidateScriptMarkSchemeGroupId
	 * @param rigOrder
	 * @param markSchemeGroupId
	 */
    public reorderResponse(displayId: string,
        previousMarkingMode: number, currentMarkingMode: number,
        candidateScriptId: number, esCandidateScriptMarkSchemeGroupId: number,
        rigOrder: number, markSchemeGroupId: number, rowVersion: string) {
        let that = this;
        let reorderResponseDetails: updateESMarkGroupMarkingModeData = {
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkSchemeGroupId,
            candidateScriptId: candidateScriptId,
            markingModeId: currentMarkingMode,
            markSchemeGroupId: markSchemeGroupId,
            rigOrder: rigOrder,
            isRigOrderUpdateRequired: true,
            previousMarkingModeId: previousMarkingMode,
            assignNextRigOrder: false,
            esMarkGroupRowVersion: rowVersion
        };
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call to update the esMarkinkMode (reorder).
            standardisationSetupDataServices.updateESMarkGroupMarkingMode(reorderResponseDetails,
                function (success: boolean, updateESMarkingModeReturn: updateESMarkingModeReturn) {
                    let errorCode: enums.UpdateESMarkingModeErrorCode =
                        updateESMarkingModeReturn ? updateESMarkingModeReturn.updateESMarkingModeErrorCode :
                            enums.UpdateESMarkingModeErrorCode.None;
                    if (success) {
                        dispatcher.dispatch(new reorderResponseAction(success, reorderResponseDetails));
                    } else {

                        // Handle the concurrency scenarios.
                        if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssue) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(false));
                        } else if (errorCode === enums.UpdateESMarkingModeErrorCode.ConcurrencyIssueDueToStandardisationComplete) {
                            dispatcher.dispatch(new concurrentSaveFailInStmPopupAction(true));
                        } else {
                            dispatcher.dispatch(new stdReclassifyErrorPopupDisplayAction(false, false, displayId));
                        }
                    }
                }
            );
        });
    }

    /**
     * Reclassify popup open action with multiple classification type option
     * @param esMarkGroupId
     */
    public reclassifyMultiOptionPopupOpen(esMarkGroupId: number, isFromResponse: boolean = false) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stdReclassifyMultiOptionPopupDisplayAction(esMarkGroupId, isFromResponse));
        }).catch();
    }

    /**
     * Method to copy marks and Annotations as definitive
     */
    public copyMarksAndAnnotationsAsDefinitive(isCopyMarkAsDef: boolean, doCopyPreviousMark: boolean, hasAdditionalObject: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new copymarksandannotationasdefinitiveaction(true, isCopyMarkAsDef,
                                doCopyPreviousMark, hasAdditionalObject));
        }).catch();
    }

    /**
     * Method to save standardistation response notes 
     * @param esMarkGroupId
     */
    public saveNote(esMarkGroupId: number, note: string, rowVersion: string, markingModeId: number) {
        let that = this;
        let arg: StandardisationNotesData = {
            esMarkGroupId: esMarkGroupId,
            note: note,
            rowVersion: rowVersion,
            markingModeId: markingModeId
        };
        return new Promise.Promise(function (resolve: any, reject: any) {
            // Data service call to save data to DB
            standardisationSetupDataServices.saveNotes(arg, function (success, newStandardisationNotesData: StandardisationNotesData) {
                if (success) {
                    dispatcher.dispatch(
                        new saveNoteAction(
                            esMarkGroupId,
                            newStandardisationNotesData.note,
                            newStandardisationNotesData.rowVersion,
                            newStandardisationNotesData.saveNoteErrorCode
                        ));
                }
            });
        });

    }

    /**
     * Discard standardisation response action creator
     */
    public discardStandardisationResponse(
        esMarkGroupIds: Array<Number>,
        isSendMandatoryMessage: boolean,
        examinerRoleId: number,
        markSchemeGroupId: number,
        responseIds: Array<Number>,
        isDiscardMFPImages: boolean,
        displayId: Number
    ) {
        let that = this;
        let argument: discardStandardisationResponseArgument = {
            rigIds: esMarkGroupIds,
            isSendMandatoryMessage: isSendMandatoryMessage,
            examinerRoleId: examinerRoleId,
            markSchemeGroupId: markSchemeGroupId,
            responseIds: responseIds,
            isDiscardMFPImages: isDiscardMFPImages
        };

        return (
            // Data service call to update DB
            standardisationSetupDataServices.discardStandardisationResponse(argument,
                function (
                    success: boolean,
                    returnData: discardStandardisationResponseReturn) {
                    // This will validate the call to find any network failure
                    // and is mandatory to add this.
                    if (that.validateCall(returnData)) {
                        dispatcher.dispatch(new discardStandardisationResponseAction(esMarkGroupIds, displayId, success, returnData));
                    }
                }
            ));
    }

    /**
     * ReuseRIG action creator
     */
    public reuseRigAction(markGroupId: number, documentId: number, markSchemeGroupId: number, markingModeId: number) {
        let that = this;
        let argument: reuseRIGActionArgument = {
            markGroupId: markGroupId,
            documentId: documentId,
            markSchemeGroupId: markSchemeGroupId,
            markingModeId: markingModeId
        };

        return (
            // Data service call to process DB
            standardisationSetupDataServices.reuseRIGAction(argument,
                function (success: boolean,
                    returnData: reuseRIGActionReturn) {
                    if (that.validateCall(returnData)) {
                        dispatcher.dispatch(new reuseRIGAction(markingModeId, markGroupId));
                    }
                }
            ));
    }

    /**
     * On Std Centre Script List Filter
     * @param filterString
     */
    public onStdCentreScriptListFilter(filterString: string) {
        let standardisationCentreScriptFilterDetails: standardisationCentreScriptFilterDetails = {
            filterString: filterString
        };
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new standardisationCentreScriptFilterAction(standardisationCentreScriptFilterDetails));
        }).catch();
    }

    /**
     * dispatch action for standardisation response collection updation.
     * @param esMarkGroupId
     * @param stdWorklistType
     */
    public updateStandardisationResponseCollection(esMarkGroupId: number, stdWorklistType: enums.StandardisationSetup) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateStdResponseCollectionAction(esMarkGroupId, stdWorklistType));
        }).catch();
    }

    /**
     * Dispatch action for candidate script meta data fetch action in standardisation setup.
     * @param markSchemeGroupId 
     * @param questionPaperPartId 
     */
    public stdSetupcandidateScriptMetadataFetchAction(markSchemeGroupId: number, questionPaperPartId: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new standardisationSetupScriptMetadataFetchAction(markSchemeGroupId, questionPaperPartId));
        }).catch();
    }

    /**
     * Gets standardisation worklist response details from Messaging.
     * @param examinerRoleID 
     * @param examinerId 
     * @param markSchemeGroupId 
     * @param stdWorklistType 
     */
    public getStandardisationWorklistDetails(examinerRoleID: number,
        examinerId: number,
        markSchemeGroupId: number,
        stdWorklistType: enums.StandardisationSetup) {
        switch (stdWorklistType) {
            case enums.StandardisationSetup.ProvisionalResponse:
                return this.getProvisionalResponseDetails(examinerRoleID,
                    examinerId,
                    markSchemeGroupId,
                    false,
                    false,
                    enums.STDWorklistViewType.ViewTotalMarks);
            case enums.StandardisationSetup.UnClassifiedResponse:
                return this.getUnClassifiedResponseDetails(examinerRoleID,
                    examinerId,
                    markSchemeGroupId,
                    false,
                    enums.STDWorklistViewType.ViewTotalMarks);
            case enums.StandardisationSetup.ClassifiedResponse:
                return this.getClassifiedResponseDetails(examinerRoleID,
                    examinerId,
                    markSchemeGroupId,
                    false,
                    enums.STDWorklistViewType.ViewTotalMarks);
        }
    }

    /**
     * Selected tab action for update selected tab value in store
     * @param selectedTab 
     */
    public sessionTabSelectionInSelectResponse(selectedTab: enums.StandardisationSessionTab) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new standardisationSetupSelectTabAction(selectedTab));
        }).catch();
    }

    /**
     * Reuse Rig action popup open with multiple option
     */
    public reuseRigActionPopupOpen(displayId: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new ReuseRigPopupDisplayAction(displayId));
        }).catch();
    }

    /**
     * Set Standardisation Setup History Info
     * @param historyItem
     */
    public setStandardisationSetupHistoryInfo(historyItem: historyItem) {
        new Promise.Promise(function(resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new standardisationSetupHistoryInfoAction(historyItem));
        }).catch();
    }
}

let standardisationActionCreator = new StandardisationActionCreator();
export = standardisationActionCreator;