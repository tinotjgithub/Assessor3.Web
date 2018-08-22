"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var enums = require('../../components/utility/enums');
var Promise = require('es6-promise');
var base = require('../base/actioncreatorbase');
var standardisationsetupleftPanelToggleAction = require('./standardisationsetupleftpaneltoggleaction');
var standardisationSetupWorkListSelectAction = require('./standardisationsetupworklistselectaction');
var standardisationSetupDataServices = require('../../dataservices/standardisationsetup/standardisationsetupdataservices');
var standardisationSetupTargetDetailsAction = require('./getstandardisationsetuptargetdetailsaction');
var getScriptsOfSelectedCentreAction = require('./getscriptsofselectedcentreaction');
var standardisationCentreScriptOpenAction = require('./standardisationcentrescriptopenaction');
var standardisationSetupCentresDetailsAction = require('./getstandardisationsetupcentresdetailsaction');
var sortAction = require('./sortaction');
var standardisationResponseDetailsAction = require('./getstandardisationresponsedetailsaction');
var stdSetupPermissionCCDataGetAction = require('./standardisationsetuppermissionccdatagetaction');
var selectToMarkPopupAction = require('./selecttomarkpopupaction');
var createStandardisationRigAction = require('./createstandardisationrigaction');
var stdDeclassifyPopupDisplayAction = require('./declassifypopupdisplayaction');
var stdReclassifyPopupDisplayAction = require('./reclassifypopupdisplayaction');
var reclassifyResponseAction = require('./reclassifyresponseaction');
var stdReclassifyErrorPopupDisplayAction = require('./reclassifyerrorpopupdisplayaction');
var reorderResponseAction = require('./reorderresponseaction');
var updateHideResponseStatusAction = require('./updatehideresponsestatusaction');
var hideReuseToggleAction = require('./hidereusetoggleaction');
var getReUseRigDetailsAction = require('./getreuserigdetailsaction');
var updateBlueHelperMessageVisibilityAction = require('./updateselecttomarkhelpermessagevisibilityaction');
var completeStandardisationSetupAction = require('./completestandardisationsetupaction');
var updateStdResponseCollectionAction = require('./updatestandardisationsetupresponsecollectionaction');
var declassifyResponseAction = require('./declassifyresponseaction');
var updateMousePositionAction = require('../response/updatemousepositionaction');
var copymarksandannotationasdefinitiveaction = require('./copymarksandannotationasdefinitiveaction');
var stdReclassifyMultiOptionPopupDisplayAction = require('./reclassifymultioptionpopupdisplayaction');
var saveNoteAction = require('./savenoteaction');
var discardStandardisationResponseAction = require('./discardstandardisationresponseaction');
var standardisationCentreScriptFilterAction = require('../../actions/standardisationsetup/standardisationcentrescriptfilteraction');
var stdShareResponsePopupDisplayAction = require('./shareresponsepopupdisplayaction');
/**
 * Standardisation setup action creator
 */
var StandardisationActionCreator = (function (_super) {
    __extends(StandardisationActionCreator, _super);
    function StandardisationActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Saves the state of the Standardisation setup left panel for the session
     * @param isLeftPanelCollapsed indicates whether the panel is collapsed or not
     */
    StandardisationActionCreator.prototype.leftPanelToggleSave = function (isLeftPanelCollapsed) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new standardisationsetupleftPanelToggleAction(isLeftPanelCollapsed));
        })
            .catch();
    };
    /**
     * Set the standardisation setup selectedWorkList in standardisation setup store
     * @param selectedWorkList
     */
    StandardisationActionCreator.prototype.standardisationSetupWorkListSelection = function (selectedWorkList, markSchemeGroupId, examinerRoleId, useCache) {
        if (useCache === void 0) { useCache = false; }
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new standardisationSetupWorkListSelectAction(selectedWorkList, markSchemeGroupId, examinerRoleId, useCache));
        })
            .catch();
    };
    /**
     * action creator for StandardisationTargetDetails
     */
    StandardisationActionCreator.prototype.getStandardisationTargetDetails = function (markSchemeGroupId, examinerRoleId) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            standardisationSetupDataServices.getStandardisationTargetDetails(markSchemeGroupId, examinerRoleId, function (success, standardisationTargetDetailsListData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(standardisationTargetDetailsListData)) {
                    dispatcher.dispatch(new standardisationSetupTargetDetailsAction(success, markSchemeGroupId, examinerRoleId, standardisationTargetDetailsListData));
                    resolve(standardisationTargetDetailsListData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Action creator to retrive centre details, for the selected response.
     */
    StandardisationActionCreator.prototype.getStandardisationCentresDetails = function (questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, stdWorklistViewType, useCache) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            standardisationSetupDataServices.getStandardisationCentresDetails(questionPaperId, specialNeed, isMarkFromPaper, examinerRoleId, useCache, function (success, stadardisationCentreDetailsListData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(stadardisationCentreDetailsListData)) {
                    dispatcher.dispatch(new standardisationSetupCentresDetailsAction(success, stdWorklistViewType, stadardisationCentreDetailsListData));
                    resolve(stadardisationCentreDetailsListData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * getReuseRigDetails action creator
     * @param examinerRoleID
     * @param markSchemeGroupID
     * @param isReUsableResponsesSelected
     * @param isHideResponsesSelected
     */
    StandardisationActionCreator.prototype.getReuseRigDetails = function (examinerRoleID, markSchemeGroupID, isReUsableResponsesSelected, isHideResponsesSelected, useCache) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            standardisationSetupDataServices.getReuseRigDetails(examinerRoleID, markSchemeGroupID, isReUsableResponsesSelected, isHideResponsesSelected, useCache, function (success, standardisationSetupReusableDetailsList) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(standardisationSetupReusableDetailsList)) {
                    dispatcher.dispatch(new getReUseRigDetailsAction(success, standardisationSetupReusableDetailsList));
                    resolve(standardisationSetupReusableDetailsList);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * updateHideResponseStatus action creator
     * @param isActiveStatus
     * @param displayId
     */
    StandardisationActionCreator.prototype.updateHideResponseStatus = function (isActiveStatus, displayId) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            standardisationSetupDataServices.updateHideResponseStatus(displayId, isActiveStatus, function (success, isHideStatusCompleted) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (isHideStatusCompleted && that.validateCall(isHideStatusCompleted)) {
                    dispatcher.dispatch(new updateHideResponseStatusAction(success, isHideStatusCompleted, displayId, isActiveStatus));
                    resolve(isHideStatusCompleted);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Handle the Hide Reuse Toggle Change
     */
    StandardisationActionCreator.prototype.onHideReuseToggleChange = function () {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new hideReuseToggleAction());
        })
            .catch();
    };
    /**
     * Open standardisation centre script
     * @param candidateScriptId
     */
    StandardisationActionCreator.prototype.openStandardisationCentreScript = function (candidateScriptId, scriptAvailable) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new standardisationCentreScriptOpenAction(candidateScriptId, scriptAvailable));
        })
            .catch();
    };
    /**
     * action creator to retrive script details, for the selected Centre.
     */
    StandardisationActionCreator.prototype.getScriptsOfSelectedCentre = function (markSchemeGroupId, questionPaperID, centrePartID, considerAtypical, examinerRoleId, centreId) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            standardisationSetupDataServices.GetScriptDetailsOfSelectedCentre(markSchemeGroupId, questionPaperID, centrePartID, considerAtypical, examinerRoleId, function (success, standardisationScriptDetailsList) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(standardisationScriptDetailsList)) {
                    dispatcher.dispatch(new getScriptsOfSelectedCentreAction(success, centrePartID, centreId, standardisationScriptDetailsList));
                    resolve(standardisationScriptDetailsList);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Handle the sort order
     */
    StandardisationActionCreator.prototype.onSortedClick = function (sortDetails) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new sortAction(sortDetails));
        })
            .catch();
    };
    /**
     * action creator for ClassifiedResponseDetails
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     */
    StandardisationActionCreator.prototype.getClassifiedResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.GetClassifiedResponseDetails(examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, that.isOnline, function (success, classifiedResponseDetailsData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(classifiedResponseDetailsData)) {
                    dispatcher.dispatch(new standardisationResponseDetailsAction(success, worklistViewType, classifiedResponseDetailsData));
                    resolve(classifiedResponseDetailsData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * action creator for UnClassifiedResponseDetails
     * @param examinerRoleID
     * @param examinerId
     * @param markSchemeGroupId
     * @param isViewMCQRIGMarks
     * @param worklistViewType
     */
    StandardisationActionCreator.prototype.getUnClassifiedResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType) {
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.GetUnClassifiedResponseDetails(examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, function (success, unclassifiedResponseDetailsData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(unclassifiedResponseDetailsData)) {
                    dispatcher.dispatch(new standardisationResponseDetailsAction(success, worklistViewType, unclassifiedResponseDetailsData));
                    resolve(unclassifiedResponseDetailsData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
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
    StandardisationActionCreator.prototype.getProvisionalResponseDetails = function (examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, doUseCache, worklistViewType) {
        if (doUseCache === void 0) { doUseCache = true; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.GetProvisionalResponseDetails(examinerRoleID, examinerId, markSchemeGroupId, isViewMCQRIGMarks, worklistViewType, doUseCache, that.isOnline, function (success, provisionalResponseDetailsData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(provisionalResponseDetailsData)) {
                    dispatcher.dispatch(new standardisationResponseDetailsAction(success, worklistViewType, provisionalResponseDetailsData));
                    resolve(provisionalResponseDetailsData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Action creator to retrive standardisation setup permission cc details.
     * @param examinerRole
     * @param markSchemeGroupId
     */
    StandardisationActionCreator.prototype.getStandardisationSetupPermissionCCData = function (examinerRole, markSchemeGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new stdSetupPermissionCCDataGetAction(examinerRole, markSchemeGroupId));
        })
            .catch();
    };
    /**
     * when select to mark button is clicked for a centre script response
     * @param examinerRole
     * @param markSchemeGroupId
     */
    StandardisationActionCreator.prototype.selectStandardisationResponsePopupOpen = function (popupType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new selectToMarkPopupAction(popupType));
        })
            .catch();
    };
    /**
     * Updates whether to display the blue helper message of select to mark button.
     * @param isVisible
     */
    StandardisationActionCreator.prototype.updateSelectToMarkHelperMessageVisibility = function (isVisible) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        })
            .then(function () {
            dispatcher.dispatch(new updateBlueHelperMessageVisibilityAction(isVisible));
        })
            .catch();
    };
    /**
     * create Standardisation RIG. Assessor 3 doesn't have
     * multiple select and create provisional hence the list input is so far not required.
     * @param examinerRoleID
     * @param candidateScriptID
     * @param markSchemeGroupID
     * @param markingMode
     */
    StandardisationActionCreator.prototype.createStandardisationRig = function (examinerRoleID, candidateScriptID, markSchemeGroupIDs, markingMode, doMarkNow) {
        var that = this;
        var arg = {
            candidateScriptID: candidateScriptID,
            markSchemeGroupIDs: markSchemeGroupIDs
        };
        return new Promise.Promise(function (resolve, reject) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.createStandardisationRig(arg, function (success, returnData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(returnData)) {
                    dispatcher.dispatch(new createStandardisationRigAction(success, returnData, doMarkNow));
                    resolve(returnData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Complete Standardisation setup action
     * @param markSchemeGroupID
     */
    StandardisationActionCreator.prototype.completeStandardisationSetup = function (markSchemeGroupID) {
        var that = this;
        var arg = {
            markSchemeGroupId: markSchemeGroupID
        };
        return new Promise.Promise(function (resolve, reject) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.completeStandardisation(arg, function (success, returnData) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(returnData)) {
                    dispatcher.dispatch(new completeStandardisationSetupAction(success, returnData));
                    resolve(returnData);
                }
                else {
                    // This will stop promise.all from exec
                    reject(null);
                }
            });
        });
    };
    /**
     * Declassify Popup Open Action
     * @param displayId
     * @param totalmark
     * @param candidateScriptId
     * @param esCandidateScriptMarkSchemeGroupId
     * @param markingModeId
     * @param rigOrder
     */
    StandardisationActionCreator.prototype.declassifyPopupOpen = function (displayId, totalmark, candidateScriptId, esCandidateScriptMarkSchemeGroupId, markingModeId, rigOrder) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stdDeclassifyPopupDisplayAction(displayId, totalmark, candidateScriptId, esCandidateScriptMarkSchemeGroupId, markingModeId, rigOrder));
        }).catch();
    };
    /**
     * Share Response Popup Open Action
     * @param displayId
     * @param totalMarkValue
     */
    StandardisationActionCreator.prototype.shareResponsePopupOpen = function (stdResponseDetails) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stdShareResponsePopupDisplayAction(stdResponseDetails));
        }).catch();
    };
    /**
     * Method to update the mouse pointer position during mouse move and drag events.
     * @param {number} xPosition
     * @param {number} yPosition
     */
    StandardisationActionCreator.prototype.setMousePosition = function (yPosition) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateMousePositionAction(0, yPosition));
        });
    };
    /**
     * Reclassify popup open action
     * @param displayId
     * @param totalmark
     */
    StandardisationActionCreator.prototype.reclassifyPopupOpen = function (displayId, totalmark, previousMarkingMode, currentMarkingMode, candidateScriptId, esCandidateScriptMarkingGroupId, rigOrder, markSchemeGroupId, oldRigOrder) {
        var reclassifiedResponseDetails = {
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
            assignNextRigOrder: false
        };
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stdReclassifyPopupDisplayAction(reclassifiedResponseDetails));
        }).catch();
    };
    /**
     * Reclassify popup open action
     * @param displayId
     * @param totalmark
     */
    StandardisationActionCreator.prototype.reclassifyResponse = function (reclassifiedResponseDetails, showErrorPopUp) {
        if (showErrorPopUp === void 0) { showErrorPopUp = true; }
        var that = this;
        return new Promise.Promise(function (resolve, reject) {
            // Data service call to update the esMarkinkMode (reclassify).
            standardisationSetupDataServices.updateESMarkGroupMarkingMode(reclassifiedResponseDetails, function (success) {
                if (success) {
                    dispatcher.dispatch(new reclassifyResponseAction(success, reclassifiedResponseDetails));
                }
                else if (showErrorPopUp) {
                    dispatcher.dispatch(new stdReclassifyErrorPopupDisplayAction(false));
                }
            });
        });
    };
    /**
     * Method to declassify selected response.
     * @param candidateScriptId
     * @param markSchemeGroupId
     * @param esCandidateScriptMarkSchemeGroupId
     */
    StandardisationActionCreator.prototype.declassifyResponse = function (candidateScriptId, markSchemeGroupId, esCandidateScriptMarkSchemeGroupId, markingModeId, rigOrder) {
        var that = this;
        var arg = {
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkSchemeGroupId,
            candidateScriptId: candidateScriptId,
            markingModeId: enums.MarkingMode.PreStandardisation,
            markSchemeGroupId: markSchemeGroupId,
            rigOrder: null,
            isRigOrderUpdateRequired: true,
            previousMarkingModeId: enums.MarkingMode.None,
            assignNextRigOrder: false
        };
        return new Promise.Promise(function (resolve, reject) {
            // Data service call fetch data either from cache/DB
            standardisationSetupDataServices.updateESMarkGroupMarkingMode(arg, function (success) {
                dispatcher.dispatch(new declassifyResponseAction(success, candidateScriptId, markingModeId, rigOrder));
            });
        });
    };
    /**
     * Method to notify reclassify action cancelled.
     */
    StandardisationActionCreator.prototype.rejectedReclassifyAction = function () {
        dispatcher.dispatch(new stdReclassifyErrorPopupDisplayAction(true));
    };
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
    StandardisationActionCreator.prototype.reorderResponse = function (displayId, previousMarkingMode, currentMarkingMode, candidateScriptId, esCandidateScriptMarkSchemeGroupId, rigOrder, markSchemeGroupId) {
        var that = this;
        var reorderResponseDetails = {
            esCandidateScriptMarkSchemeGroupId: esCandidateScriptMarkSchemeGroupId,
            candidateScriptId: candidateScriptId,
            markingModeId: currentMarkingMode,
            markSchemeGroupId: markSchemeGroupId,
            rigOrder: rigOrder,
            isRigOrderUpdateRequired: true,
            previousMarkingModeId: previousMarkingMode,
            assignNextRigOrder: false
        };
        return new Promise.Promise(function (resolve, reject) {
            // Data service call to update the esMarkinkMode (reorder).
            standardisationSetupDataServices.updateESMarkGroupMarkingMode(reorderResponseDetails, function (success) {
                if (success) {
                    dispatcher.dispatch(new reorderResponseAction(success, reorderResponseDetails));
                }
                else {
                    dispatcher.dispatch(new stdReclassifyErrorPopupDisplayAction(false, false, displayId));
                }
            });
        });
    };
    /**
     * Reclassify popup open action with multiple classification type option
     * @param esMarkGroupId
     */
    StandardisationActionCreator.prototype.reclassifyMultiOptionPopupOpen = function (esMarkGroupId) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stdReclassifyMultiOptionPopupDisplayAction(esMarkGroupId));
        }).catch();
    };
    /**
     * Method to copy marks and Annotations as definitive
     */
    StandardisationActionCreator.prototype.copyMarksAndAnnotationsAsDefinitive = function (isCopyMarkAsDef) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new copymarksandannotationasdefinitiveaction(true, isCopyMarkAsDef));
        }).catch();
    };
    /**
     * Method to save standardistation response notes
     * @param esMarkGroupId
     */
    StandardisationActionCreator.prototype.saveNote = function (esMarkGroupId, note) {
        var that = this;
        var arg = {
            esMarkGroupId: esMarkGroupId,
            note: note
        };
        return new Promise.Promise(function (resolve, reject) {
            // Data service call to save data to DB
            standardisationSetupDataServices.saveNotes(arg, function (success) {
                if (success) {
                    dispatcher.dispatch(new saveNoteAction(esMarkGroupId, note));
                }
            });
        });
    };
    /**
     * Discard standardisation response action creator
     */
    StandardisationActionCreator.prototype.discardStandardisationResponse = function (esMarkGroupIds, isSendMandatoryMessage, examinerRoleId, markSchemeGroupId, responseIds, isDiscardMFPImages, displayId) {
        var that = this;
        var argument = {
            rigIds: esMarkGroupIds,
            isSendMandatoryMessage: isSendMandatoryMessage,
            examinerRoleId: examinerRoleId,
            markSchemeGroupId: markSchemeGroupId,
            responseIds: responseIds,
            isDiscardMFPImages: isDiscardMFPImages
        };
        return (
        // Data service call to update DB
        standardisationSetupDataServices.discardStandardisationResponse(argument, function (success, returnData) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(returnData)) {
                dispatcher.dispatch(new discardStandardisationResponseAction(esMarkGroupIds, displayId, success, returnData));
            }
        }));
    };
    /**
     * On Std Centre Script List Filter
     * @param filterString
     */
    StandardisationActionCreator.prototype.onStdCentreScriptListFilter = function (filterString) {
        var standardisationCentreScriptFilterDetails = {
            filterString: filterString
        };
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new standardisationCentreScriptFilterAction(standardisationCentreScriptFilterDetails));
        }).catch();
    };
    /**
     * dispatch action for standardisation response collection updation.
     * @param esMarkGroupId
     * @param stdWorklistType
     */
    StandardisationActionCreator.prototype.updateStandardisationResponseCollection = function (esMarkGroupId, stdWorklistType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateStdResponseCollectionAction(esMarkGroupId, stdWorklistType));
        }).catch();
    };
    return StandardisationActionCreator;
}(base));
var standardisationActionCreator = new StandardisationActionCreator();
module.exports = standardisationActionCreator;
//# sourceMappingURL=standardisationactioncreator.js.map