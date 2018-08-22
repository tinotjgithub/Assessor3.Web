"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var comparerlist = require('../../utility/sorting/sortbase/comparerlist');
var stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
var storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var markSchemeGroupHelper = require('../../utility/standardisationsetup/markschemegrouphelper');
var sortHelper = require('../../utility/sorting/sorthelper');
var mousePosition = require('../response/mouseposition');
var stringFormatHelper = require('../../utility/stringformat/stringformathelper');
/**
 * store class for standardisation setup
 */
var StandardisationSetupStore = (function (_super) {
    __extends(StandardisationSetupStore, _super);
    /**
     * @constructor
     */
    function StandardisationSetupStore() {
        var _this = this;
        _super.call(this);
        this._selectedStandardisationSetupWorkList = enums.StandardisationSetup.None;
        this._selectedCentreId = 0;
        this.storageAdapterHelper = new storageAdapterHelper();
        this._isSelectToMarkHelperMessageVisible = true;
        this._standardisationSortDetails = new Array();
        this._expandOrCollapseDetails = Immutable.Map();
        this._stdSetupCentrePersistenceList = Immutable.Map();
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_ACTION:
                    var getreuserigdetailsaction = action;
                    _this._standardisationSetupReusableDetailsList = getreuserigdetailsaction.StandardisationSetupReusableDetailsList;
                    _this.emit(StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT);
                    break;
                case actionType.STANDARDISATION_SETUP_LEFT_PANEL_TOGGLE:
                    _this._isLeftPanelCollapsed = action.isLeftPanelCollapsed;
                    _this.emit(StandardisationSetupStore.SET_PANEL_STATE);
                    break;
                case actionType.STANDARDISATION_SETUP_LEFT_PANEL_WORKLIST_SELECT_ACTION:
                    var standardisationLeftPanelWorkListSelectAction = action;
                    _this._selectedStandardisationSetupWorkList = standardisationLeftPanelWorkListSelectAction.selectedWorkList;
                    _this._markSchemeGroupId = standardisationLeftPanelWorkListSelectAction.markSchemeGroupId;
                    _this._examinerRoleId = standardisationLeftPanelWorkListSelectAction.examinerRoleId;
                    // The standardisation response details should be cleared each left panelk click
                    _this._standardisationSetUpResponsedetails = undefined;
                    _this._stdResponseListBasedOnPermission = undefined;
                    _this._mousePosition = undefined;
                    if (_this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
                        _this.updateResponseSortCollection(_this._selectedStandardisationSetupWorkList, 'Centre');
                        if (_this.getPreviousSessionTabVisibiltyinSelectResponse) {
                            _this.updateResponseSortCollection(_this._selectedStandardisationSetupWorkList, 'Reuse');
                        }
                    }
                    else {
                        _this.updateResponseSortCollection(_this._selectedStandardisationSetupWorkList, '');
                    }
                    // If the SelectResponse worklist panel is being selected from response breadcrumb , then persist filter details
                    if (!(_this._previousContainerPage === enums.PageContainers.Response
                        && _this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse)) {
                        _this._standardisationCentreScriptFilterDetails = undefined;
                    }
                    _this.emit(StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT, _this.selectedStandardisationSetupWorkList, standardisationLeftPanelWorkListSelectAction.useCache);
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    _this._selectedStandardisationSetupWorkList = enums.StandardisationSetup.None;
                    _this._markSchemeGroupId = undefined;
                    break;
                case actionType.GET_STANDARDISATION_TARGET_DETAILS_ACTION:
                    var standardisationTargetDetailsAction = action;
                    _this.success = standardisationTargetDetailsAction.success;
                    if (_this.success) {
                        _this._standardisationTargetDetailsList = standardisationTargetDetailsAction.StandardisationTargetDetailsList;
                        _this._markSchemeGroupId = standardisationTargetDetailsAction.markSchemeGroupId;
                        _this._examinerRoleId = standardisationTargetDetailsAction.examinerRoleId;
                        _this.emit(StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT);
                    }
                    break;
                case actionType.GET_SCRIPTS_OF_SELECTED_CENTRE_ACTION:
                    var success = action.success;
                    if (success) {
                        _this._standardisationScriptList = action.scriptListOfSelectedCentre;
                        // Set candidateScriptId and documentyId of all scripts in a centre
                        _this.setCandidateScriptDetailsAgainstCentre();
                        // clear centre script filter details on changing centre selection
                        if (_this._selectedCentreId !== action.selectedCentreId) {
                            _this._standardisationCentreScriptFilterDetails = undefined;
                        }
                        _this._selectedCentrePartId = action.selectedCentrePartId;
                        _this._selectedCentreId = action.selectedCentreId;
                        _this._stdSetupCentrePersistenceList = _this._stdSetupCentrePersistenceList.set(_this.markSchemeGroupId, _this._selectedCentreId);
                    }
                    _this.updateResponseSortCollection(_this._selectedStandardisationSetupWorkList, 'Script');
                    _this.emit(StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN:
                    var centreScriptOpenAction = action;
                    _this._selectedResponseId = centreScriptOpenAction.selectedCandidateScriptId;
                    _this._selectedScriptAvailable = centreScriptOpenAction.scriptAvailable;
                    _this.emit(StandardisationSetupStore.STM_OPEN_RESPONSE_EVENT, _this._selectedResponseId);
                    break;
                case actionType.GET_STANDARDISATION_CENTRE_DETAILS_ACTION:
                    var centreDetailsAction = action;
                    _this._standardisationCentreList = centreDetailsAction.StandardisationCentreDetailsList;
                    _this._isTotalMarksViewSelected = centreDetailsAction.isTotaMarksViewSelected;
                    if (_this.markSchemeGroupId) {
                        var _selectedCentreId = _this._stdSetupCentrePersistenceList.get(_this.markSchemeGroupId);
                        if (_selectedCentreId > 0) {
                            _this._selectedCentreId = _selectedCentreId;
                        }
                        else {
                            _this._selectedCentreId = _this._standardisationCentreList.centreList.first().uniqueId;
                            _this._stdSetupCentrePersistenceList = _this._stdSetupCentrePersistenceList.set(_this.markSchemeGroupId, _this._selectedCentreId);
                        }
                    }
                    // clear script list on Select Response selection 
                    // (before Centre Selection.Script details will load on Centre click)
                    _this._standardisationScriptList = undefined;
                    _this.emit(StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT, _this._selectedResponseId);
                    break;
                case actionType.STANDARDISATION_SORT_ACTION:
                    var _sortClickAction = action;
                    var _sortDetails = _sortClickAction.getStandardisationSortDetails;
                    for (var i = 0; i < _this._standardisationSortDetails.length; i++) {
                        if (_sortDetails.comparerName &&
                            _sortDetails.selectedWorkList === _this._standardisationSortDetails[i].selectedWorkList &&
                            _sortDetails.centreOrScriptOrReuse === _this._standardisationSortDetails[i].centreOrScriptOrReuse &&
                            _sortDetails.qig === _this._standardisationSortDetails[i].qig) {
                            _this._standardisationSortDetails[i].comparerName = _sortDetails.comparerName;
                            _this._standardisationSortDetails[i].sortDirection = _sortDetails.sortDirection;
                        }
                    }
                    break;
                case actionType.OPEN_RESPONSE:
                    _this._selectedResponseId = action.selectedDisplayId;
                    var selectedScriptDetails = _this.fetchSelectedScriptDetails();
                    _this._doMarkNow = false;
                    _this._selectedScriptAvailable = selectedScriptDetails ? (!selectedScriptDetails.isAllocatedALive &&
                        !selectedScriptDetails.isUsedForProvisionalMarking) : false;
                    _this._isSelectToMarkHelperMessageVisible = true;
                    break;
                case actionType.GET_STANDARDISATION_RESPONSE_DETAILS_ACTION:
                    var standardisationresponsedetailsaction = action;
                    _this.success = standardisationresponsedetailsaction.success;
                    _this._isTotalMarksViewSelected = standardisationresponsedetailsaction.isTotalMarksViewSelected;
                    if (_this.success) {
                        // Check Permissions for the selected worklist.
                        // Which all need to show for the user
                        _this._hiddenStdWorklists = _this.getHiddenWorklists();
                        // Grouping responses based on classification type.
                        _this._standardisationSetUpResponsedetails = standardisationresponsedetailsaction.StandardisationResponseDetails;
                        if (!_this._hiddenStdWorklists ||
                            (_this._hiddenStdWorklists &&
                                !_this._hiddenStdWorklists.contains(enums.MarkingMode.Practice))) {
                            _this._practiceResponseDetails =
                                _this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.markingModeId === enums.MarkingMode.Practice; });
                            _this._stdResponseListBasedOnPermission = _this._practiceResponseDetails;
                        }
                        if (!_this._hiddenStdWorklists ||
                            (_this._hiddenStdWorklists &&
                                !_this._hiddenStdWorklists.contains(enums.MarkingMode.Approval))) {
                            _this._standardisationResponseDetails =
                                _this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.markingModeId === enums.MarkingMode.Approval; });
                            _this._stdResponseListBasedOnPermission =
                                _this._stdResponseListBasedOnPermission ?
                                    _this._stdResponseListBasedOnPermission.concat(_this._standardisationResponseDetails) :
                                    _this._standardisationResponseDetails;
                        }
                        if (!_this._hiddenStdWorklists ||
                            (_this._hiddenStdWorklists &&
                                !_this._hiddenStdWorklists.contains(enums.MarkingMode.ES_TeamApproval))) {
                            _this._stmStandardisationResponseDetails =
                                _this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.markingModeId === enums.MarkingMode.ES_TeamApproval; });
                            _this._stdResponseListBasedOnPermission =
                                _this._stdResponseListBasedOnPermission ?
                                    _this._stdResponseListBasedOnPermission.concat(_this._stmStandardisationResponseDetails) :
                                    _this._stmStandardisationResponseDetails;
                        }
                        if (!_this._hiddenStdWorklists ||
                            (_this._hiddenStdWorklists &&
                                !_this._hiddenStdWorklists.contains(enums.MarkingMode.Seeding))) {
                            _this._seedResponseDetails =
                                _this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.markingModeId === enums.MarkingMode.Seeding; });
                            _this._stdResponseListBasedOnPermission =
                                _this._stdResponseListBasedOnPermission ?
                                    _this._stdResponseListBasedOnPermission.concat(_this._seedResponseDetails) :
                                    _this._seedResponseDetails;
                        }
                        _this.emit(StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT, _this.isTotalMarksViewSelected, _this.selectedStandardisationSetupWorkList, _this._doMarkNow);
                    }
                    break;
                case actionType.RESPONSE_CLOSE:
                    var isScriptClosed = action.getIsResponseClose;
                    if (isScriptClosed) {
                        _this._selectedResponseId = undefined;
                    }
                    break;
                case actionType.STANDARDISATION_SETUP_PERMISSION_CC_DATA_GET_ACTION:
                    var stdSetupPermissionDataGetAction = action;
                    _this.stdSetupPremissionCCData = stdSetupPermissionHelper.
                        getSTDSetupPermissionByExaminerRole(stdSetupPermissionDataGetAction.examinerRole, stdSetupPermissionDataGetAction.markSchemeGroupId);
                    _this._restrictSSUTargetsCCData = markSchemeGroupHelper.getRestrictedStandardisationSetupTargets(stdSetupPermissionDataGetAction.markSchemeGroupId);
                    break;
                case actionType.SETSCROLL_WORKLISTCOLUMNS_ACTION:
                    // set scroll on window resize and align the grid.
                    _this.emit(StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT);
                    break;
                case actionType.STANDARDISATION_SELECTTOMARK_POPUP:
                    var stdSetupPopupAction = action;
                    // Open the popup on click select to mark before moving as provisional
                    _this.emit(StandardisationSetupStore.POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT, stdSetupPopupAction.popupType);
                    break;
                case actionType.CREATE_STANDARDISATION_RIG:
                    var createStandardisationRigAction_1 = action;
                    var errorInRigCreation = createStandardisationRigAction_1.errorInRigCreation;
                    _this._doMarkNow = !errorInRigCreation ? createStandardisationRigAction_1.isDoMarkNow : false;
                    if (!errorInRigCreation) {
                        _this._createStandardisationRIGReturnData =
                            createStandardisationRigAction_1.createdStandardisationRIGDetails.createStandardisationRIGReturnDetails.first();
                    }
                    // Open the popup on click select to mark before moving as provisional
                    _this.emit(StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT, errorInRigCreation, _this._doMarkNow);
                    break;
                case actionType.TAG_UPDATE:
                    var tagUpdateAction_1 = action;
                    if (tagUpdateAction_1.success) {
                        _this._markingMode = tagUpdateAction_1.markingMode;
                        _this.updateTagId(tagUpdateAction_1.tagId, tagUpdateAction_1.tagOrder, tagUpdateAction_1.markGroupId);
                        _this.emit(StandardisationSetupStore.TAG_UPDATED_EVENT, tagUpdateAction_1.tagId, tagUpdateAction_1.markGroupId);
                    }
                    break;
                case actionType.UPDATE_SELECTTOMARK_HELPER_MESSAGE_VISIBILITY:
                    _this._isSelectToMarkHelperMessageVisible = action
                        .isHelperMessageVisible;
                    break;
                case actionType.STANDARDISATION_DECLASSIFY_POPUP:
                    var declassifyPopupOpenAction = action;
                    _this.emit(StandardisationSetupStore.POPUP_OPEN_DECLASSIFY_POPUP_EVENT, declassifyPopupOpenAction.displayId, declassifyPopupOpenAction.totalMarkValue, declassifyPopupOpenAction.candidateScriptId, declassifyPopupOpenAction.esCandidateScriptMarkSchemeGroupId, declassifyPopupOpenAction.markingModeId, declassifyPopupOpenAction.rigOrder);
                    break;
                case actionType.QIGSELECTOR:
                    _this._selectedCentreId = undefined;
                    _this._selectedCentrePartId = undefined;
                    _this._standardisationCentreList = undefined;
                    _this._standardisationScriptList = undefined;
                    break;
                case actionType.COMPLETE_STANDARDISATION_SETUP:
                    var completeStandardisationSetupAction_1 = action;
                    _this._completeStandardisationSetupSuccess = completeStandardisationSetupAction_1.
                        completeStandardisationSetupReturnDetails.completeStandardisationValidation;
                    _this.emit(StandardisationSetupStore.COMPLETE_STANDARDISATION_SETUP_EVENT);
                    break;
                case actionType.STANDARDISATION_DECLASSIFY_RESPONSE:
                    var declassifyResponseAction_1 = action;
                    if (declassifyResponseAction_1.isDeclassifiedResponse && _this._stdResponseListBasedOnPermission !== undefined) {
                        _this._stdResponseListBasedOnPermission
                            .filter(function (x) { return x.candidateScriptId === declassifyResponseAction_1.candidateScriptId; })[0]
                            .markingModeId = enums.MarkingMode.PreStandardisation;
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === declassifyResponseAction_1.markingModeId; }).forEach(function (res) {
                            return res.rigOrder = (res.rigOrder > declassifyResponseAction_1.rigOrder) ? res.rigOrder - 1 : res.rigOrder;
                        });
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.candidateScriptId === declassifyResponseAction_1.candidateScriptId; })[0].rigOrder = 0;
                    }
                    _this.updateClassificationListOnChangeESMarkGroupMarkingMode(declassifyResponseAction_1.markingModeId, true, true, false);
                    _this.emit(StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_ERROR_POPUP:
                    var reclassifyErrorPopupOpenAction = action;
                    if (reclassifyErrorPopupOpenAction.isReclassifyActionCanceled) {
                        _this.emit(StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT);
                    }
                    else if (!reclassifyErrorPopupOpenAction.isReclassify) {
                        _this.emit(StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT, reclassifyErrorPopupOpenAction.displayId);
                    }
                    else {
                        _this.emit(StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT);
                    }
                    break;
                case actionType.MOUSE_POSITION_UPDATE:
                    var updateMousePositionAction_1 = action;
                    _this._mousePosition = updateMousePositionAction_1.mousePosition;
                    _this.emit(StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_POPUP:
                    var reclassifyPopupOpenAction = action;
                    _this._reclassifiedResponseDetails = reclassifyPopupOpenAction.reclassifiedResponseDetails;
                    _this.emit(StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, _this._reclassifiedResponseDetails);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_RESPONSE:
                    var reclassifyResponseAction_1 = action.reclassifiedResponseDetails;
                    _this.success = action.success;
                    if (_this.success) {
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === reclassifyResponseAction_1.markingModeId &&
                            reclassifyResponseAction_1.markingModeId !== enums.MarkingMode.Seeding; }).forEach(function (res) {
                            return res.rigOrder =
                                (res.rigOrder >= reclassifyResponseAction_1.rigOrder) ? res.rigOrder + 1 : res.rigOrder;
                        });
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === reclassifyResponseAction_1.previousMarkingModeId &&
                            reclassifyResponseAction_1.previousMarkingModeId !== enums.MarkingMode.Seeding; }).forEach(function (res) {
                            return res.rigOrder =
                                (res.rigOrder > reclassifyResponseAction_1.oldRigOrder) ? res.rigOrder - 1 : res.rigOrder;
                        });
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.displayId === reclassifyResponseAction_1.displayId; })[0].markingModeId =
                            reclassifyResponseAction_1.markingModeId;
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.displayId === reclassifyResponseAction_1.displayId; })[0].rigOrder =
                            reclassifyResponseAction_1.rigOrder;
                        // Update classification list on reclassify
                        _this.updateClassificationListOnChangeESMarkGroupMarkingMode(reclassifyResponseAction_1.previousMarkingModeId, true, false, false);
                        _this.updateClassificationListOnChangeESMarkGroupMarkingMode(reclassifyResponseAction_1.markingModeId, false, false, false);
                        _this.emit(StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT);
                    }
                    break;
                case actionType.STANDARDISATION_REORDER_RESPONSE:
                    var reorderResponseAction_1 = action.reorderResponseDetails;
                    _this.success = action.success;
                    var previousRigOrder_1 = _this._stdResponseListBasedOnPermission.filter(function (x) { return x.candidateScriptId === reorderResponseAction_1.candidateScriptId; })[0].rigOrder;
                    if (_this.success) {
                        if (previousRigOrder_1 < reorderResponseAction_1.rigOrder) {
                            _this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === reorderResponseAction_1.markingModeId &&
                                x.rigOrder > previousRigOrder_1 && x.rigOrder <= reorderResponseAction_1.rigOrder &&
                                reorderResponseAction_1.markingModeId !== enums.MarkingMode.Seeding; }).forEach(function (res) {
                                return res.rigOrder = res.rigOrder - 1;
                            });
                        }
                        else {
                            _this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === reorderResponseAction_1.previousMarkingModeId &&
                                x.rigOrder < previousRigOrder_1 && x.rigOrder >= reorderResponseAction_1.rigOrder &&
                                reorderResponseAction_1.previousMarkingModeId !== enums.MarkingMode.Seeding; }).forEach(function (res) {
                                return res.rigOrder = res.rigOrder + 1;
                            });
                        }
                        _this._stdResponseListBasedOnPermission.filter(function (x) { return x.candidateScriptId === reorderResponseAction_1.candidateScriptId; })[0].rigOrder =
                            reorderResponseAction_1.rigOrder;
                        _this.emit(StandardisationSetupStore.REORDERED_RESPONSE_EVENT);
                    }
                    break;
                case actionType.UPDATE_HIDE_RESPONSE_STATUS:
                    var updateHideResponseStatusAction_1 = action;
                    _this.updateHiddenResponseStatus(updateHideResponseStatusAction_1.UpdatedResponseDisplayId, updateHideResponseStatusAction_1.UpdatedResponseHiddenStatus);
                    _this.emit(StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT);
                    break;
                case actionType.HIDE_REUSE_TOGGLE_ACTION:
                    _this.emit(StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_MULTI_OPTION_POPUP:
                    var reclassifyMutliOptionPopupOpenAction = action;
                    _this.emit(StandardisationSetupStore.MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT, reclassifyMutliOptionPopupOpenAction.reclassifiedEsMarkGroupId);
                    break;
                case actionType.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE:
                    var copymarksandannotationasdefinitive = action.isCopyMarkAsDefinitive;
                    _this.updateMarkAsDefinitiveFlag();
                    _this.emit(StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT, copymarksandannotationasdefinitive);
                    break;
                case actionType.SAVE_NOTE_ACTION:
                    var saveNoteAction_1 = action;
                    var esMarkGroupId = saveNoteAction_1.esMarkGroupID;
                    var currentNote = saveNoteAction_1.note;
                    _this.updateCurrentNote(esMarkGroupId, currentNote);
                    _this.emit(StandardisationSetupStore.SAVE_NOTE_COMPLETED_ACTION_EVENT);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_FILTER:
                    _this._standardisationCentreScriptFilterDetails
                        = action.getStandardisationCentreScriptFilterDetails;
                    _this.emit(StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE);
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    var _loadContainerAction = action;
                    _this._previousContainerPage = _this._containerPage;
                    _this._containerPage = _loadContainerAction.containerPage;
                    break;
                case actionType.DISCARD_STANDARDISATION_RESPONSE:
                    var updateResponseAction = action;
                    var isNextResponseAvailable = _this.isNextResponseAvailable(updateResponseAction.displayId.toString());
                    _this.emit(StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT, isNextResponseAvailable);
                    break;
                case actionType.DISCARD_STD_SETUP_RESPONSE_REMOVE_ACTION:
                    var updateStdResponseCollectionAction_1 = action;
                    _this.clearResponseDetailsByMarkGroupId(updateStdResponseCollectionAction_1.esMarkGroupID);
                    break;
                case actionType.SET_REMEMBER_QIG:
                    var _setRememberQigAction = action;
                    if (_setRememberQigAction.rememberQig.area === enums.QigArea.StandardisationSetup) {
                        _this._selectedStandardisationSetupWorkList = _setRememberQigAction.rememberQig.standardisationSetupWorklistType;
                    }
                    break;
                case actionType.STANDARDISATION_SHARE_RESPONSE_POPUP:
                    var shareResponsePopupConfirmAction = action;
                    _this.emit(StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY, shareResponsePopupConfirmAction.sharedResponseDetails);
                    break;
            }
        });
    }
    /**
     * Clear discard Provisional response from Standardisation response list
     */
    StandardisationSetupStore.prototype.clearResponseDetailsByMarkGroupId = function (esMarkGroupId) {
        var _this = this;
        var index = 0;
        //removing response from collection.
        this.standardisationSetUpResponsedetails.standardisationResponses.map(function (response) {
            if (response.esMarkGroupId === esMarkGroupId) {
                _this.standardisationSetUpResponsedetails.standardisationResponses
                    = _this.standardisationSetUpResponsedetails.standardisationResponses.remove(index);
            }
            index++;
        });
        //removing response from classified collection.
        var classifiedResponse = this.getResponseDetailsByEsMarkGroupIdBasedOnPermission(esMarkGroupId);
        if (classifiedResponse) {
            // Get index of classified response from std Response List Based On Permission
            // Reorder the rig order based on the rig order of the discarded response
            this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === classifiedResponse.markingModeId; })
                .forEach(function (res) {
                res.rigOrder = (res.rigOrder > classifiedResponse.rigOrder) ? res.rigOrder - 1 : res.rigOrder;
            });
            // removed discarded response
            var updatedStdResponseListBasedOnPermission = this._stdResponseListBasedOnPermission.filter(function (x) { return x.esMarkGroupId !== esMarkGroupId; });
            this._stdResponseListBasedOnPermission = updatedStdResponseListBasedOnPermission;
            // update classification list 
            this.updateClassificationListOnChangeESMarkGroupMarkingMode(classifiedResponse.markingModeId, true, false, true);
        }
    };
    /**
     * Update the classification worklist , target and summary after update esmarkgroup marking mode
     * @param markingModeId
     * @param isPrevious
     * @param isDeclassifyResponse
     * @param isDiscardResponse
     */
    StandardisationSetupStore.prototype.updateClassificationListOnChangeESMarkGroupMarkingMode = function (markingModeId, isPrevious, isDeclassifyResponse, isDiscardResponse) {
        switch (markingModeId) {
            case enums.MarkingMode.Practice:
                this._practiceResponseDetails = this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === enums.MarkingMode.Practice; });
                break;
            case enums.MarkingMode.Approval:
                this._standardisationResponseDetails = this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === enums.MarkingMode.Approval; });
                break;
            case enums.MarkingMode.ES_TeamApproval:
                this._stmStandardisationResponseDetails = this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === enums.MarkingMode.ES_TeamApproval; });
                break;
            case enums.MarkingMode.Seeding:
                this._seedResponseDetails = this._stdResponseListBasedOnPermission.filter(function (x) { return x.markingModeId === enums.MarkingMode.Seeding; });
                break;
        }
        if (this._standardisationTargetDetailsList !== undefined) {
            if (isPrevious) {
                this._standardisationTargetDetailsList.standardisationTargetDetails.filter(function (x) { return x.markingModeId === markingModeId; }).first().count--;
            }
            else {
                this._standardisationTargetDetailsList.standardisationTargetDetails.filter(function (x) { return x.markingModeId === markingModeId; }).first().count++;
            }
            if (isDeclassifyResponse) {
                this._standardisationTargetDetailsList.classifiedCount--;
                this._standardisationTargetDetailsList.unclassifiedCount++;
            }
            if (isDiscardResponse) {
                this._standardisationTargetDetailsList.classifiedCount--;
            }
        }
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "mousePosition", {
        /**
         * This method will return the current mouse position, (0,0) if undefined.
         */
        get: function () {
            if (this._mousePosition) {
                return this._mousePosition;
            }
            else {
                return new mousePosition(0, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "isSelectToMarkHelperVisible", {
        /*
         * returns whether the select to mark helper message is visible or not.
         */
        get: function () {
            return this._isSelectToMarkHelperMessageVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationScriptList", {
        /**
         * get scriptlist for the selected centre
         */
        get: function () {
            return this._standardisationScriptList;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set candidate script details against a centre
     */
    StandardisationSetupStore.prototype.setCandidateScriptDetailsAgainstCentre = function () {
        var _this = this;
        this._candidateScriptDetailsAgainstCentre = [];
        if (this._standardisationScriptList &&
            this._standardisationScriptList.centreScriptList &&
            this._standardisationScriptList.centreScriptList !== undefined &&
            this._standardisationScriptList.centreScriptList.count() > 0) {
            this._standardisationScriptList.centreScriptList.forEach(function (script) {
                _this._candidateScriptDetailsAgainstCentre.push({
                    candidateScriptId: script.candidateScriptId,
                    documentId: script.documentId
                });
            });
        }
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "getCandidateScriptDetailsAgainstCentre", {
        /**
         * Get candidate script details against a centre
         */
        get: function () {
            return this._candidateScriptDetailsAgainstCentre;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "selectedCentrePartId", {
        /**
         * Returns the selected centre part id.
         */
        get: function () {
            return this._selectedCentrePartId ? this._selectedCentrePartId : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "selectedCentreId", {
        /**
         * Returns the selected centre part id.
         */
        get: function () {
            return this._selectedCentreId ? this._selectedCentreId : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "hasAdditionalPage", {
        /**
         * Returns the selected script contains additional page.
         */
        get: function () {
            var script = this.fetchSelectedScriptDetails(this._selectedResponseId);
            this._hasAdditionalPage = false;
            if (script && script.hasAdditionalObjects) {
                this._hasAdditionalPage = true;
            }
            return this._hasAdditionalPage;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the script detail, of the selected candidate script.
     * @param candidateScriptId
     */
    StandardisationSetupStore.prototype.fetchSelectedScriptDetails = function (candidateScriptId) {
        var id;
        id = candidateScriptId ? candidateScriptId : this._selectedResponseId;
        var result;
        if (this._standardisationScriptList) {
            this._standardisationScriptList.centreScriptList.forEach(function (script) {
                if (script.candidateScriptId === id) {
                    result = script;
                }
            });
        }
        return result;
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "selectedResponseId", {
        /**
         * Returns the selected candidate script identifier.
         */
        get: function () {
            return this._selectedResponseId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "selectedScriptAvailable", {
        /**
         * select script available status from SSU centre script list
         */
        get: function () {
            return this._selectedScriptAvailable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "isStandardisationLeftPanelCollapsed", {
        /**
         * Returns the current state of left collapsible panel
         */
        get: function () {
            return this._isLeftPanelCollapsed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "selectedStandardisationSetupWorkList", {
        /**
         * Returns the current selected standardisationsetup Left Link
         */
        get: function () {
            return this._selectedStandardisationSetupWorkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationTargetDetails", {
        /**
         * Returns the current selected standardisationsetup left panel details (counts for targets)
         */
        get: function () {
            return this._standardisationTargetDetailsList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "classificationSummaryTargetDetails", {
        /**
         * Returns the classification summary target details
         */
        get: function () {
            return this._standardisationTargetDetailsList.standardisationTargetDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "markSchemeGroupId", {
        /**
         * Returns the current markscheme group id
         */
        get: function () {
            return this._markSchemeGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "examinerRoleId", {
        /**
         * Returns the current examiner role id
         */
        get: function () {
            return this._examinerRoleId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "selectedCentrePosition", {
        get: function () {
            var _this = this;
            var index = 0;
            var result;
            this._standardisationCentreList.centreList.forEach(function (centre) {
                index++;
                if (centre.uniqueId === _this._selectedCentreId) {
                    result = index;
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "candidateScriptPosition", {
        /**
         * Returns the position of the selected candidate script.
         */
        get: function () {
            var _this = this;
            var index = 0;
            var result;
            this.getFilteredStdCentreScriptDetailsListInSortOrder().forEach(function (script) {
                index++;
                if (script.candidateScriptId === _this._selectedResponseId) {
                    result = index;
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "isNextCandidateScriptAvailable", {
        /**
         * Returns true, if next script is available for navigation.
         */
        get: function () {
            return this.candidateScriptPosition < this.totalCandidateScriptCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "isPreviousCandidateScriptAvailable", {
        /**
         * Returns true, if previous response is available for navigation.
         */
        get: function () {
            return this.candidateScriptPosition > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "totalCandidateScriptCount", {
        /**
         * Returns the count, of the candidate script available for the selected centre.
         */
        get: function () {
            return this.getFilteredStdCentreScriptDetailsListInSortOrder().count();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "nextCandidateScript", {
        /**
         * Returns the candidate script identifier, for the next candidate script.
         */
        get: function () {
            var position = this.candidateScriptPosition;
            var script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[position];
            if (script != null) {
                return script.candidateScriptId;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "previousCandidateScript", {
        /**
         * Returns the candidate script identifier, for the previous candidate script.
         */
        get: function () {
            var position = this.candidateScriptPosition;
            var script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[position - 2];
            if (script != null) {
                return script.candidateScriptId;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "firstCandidateScript", {
        /**
         * Returns the candidate script identifier, of the first script in the sorted collection.
         */
        get: function () {
            var script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[0];
            if (script != null || script !== undefined) {
                return script.candidateScriptId;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationCentreList", {
        /**
         * Returns the standardisation centre list
         */
        get: function () {
            return this._standardisationCentreList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationSetupDetails", {
        /**
         * Returns the standardisation set up details
         */
        get: function () {
            var details = {
                standardisationCentreDetailsList: this.standardisationCentreList,
                standardisationScriptDetailsList: this.standardisationScriptList
            };
            return details;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationSetUpResponsedetails", {
        /**
         * Returns the standardisation response details
         */
        get: function () {
            if (this._standardisationSetUpResponsedetails) {
                return this._standardisationSetUpResponsedetails;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the response data for the standardisation response like unclassified
     * @param responseId response Id for the standardisation response
     */
    StandardisationSetupStore.prototype.fetchStandardisationResponseData = function (responseId) {
        var id = responseId ? responseId : this._selectedResponseId;
        var result;
        if (this._standardisationSetUpResponsedetails) {
            this._standardisationSetUpResponsedetails.standardisationResponses.forEach(function (x) {
                if (String(id) === x.displayId) {
                    result = x;
                }
            });
        }
        return result;
    };
    /**
     * set the default sort order for standardisation worklists
     * @param standardisationSetup
     * @param scriptType
     */
    StandardisationSetupStore.prototype.setDefaultSortOrder = function (standardisationSetup, centreOrScriptOrReuse) {
        switch (standardisationSetup) {
            case enums.StandardisationSetup.SelectResponse:
                if (centreOrScriptOrReuse === 'Script') {
                    return comparerlist.stdScriptIdComparer;
                }
                else if (centreOrScriptOrReuse === 'Reuse') {
                    return comparerlist.marksComparer;
                }
                else {
                    return comparerlist.centreComparer;
                }
            case enums.StandardisationSetup.UnClassifiedResponse:
                return comparerlist.updatedDateComparer;
            case enums.StandardisationSetup.ClassifiedResponse:
                return comparerlist.updatedDateComparer;
            case enums.StandardisationSetup.ProvisionalResponse:
                return comparerlist.updatedDateComparer;
        }
    };
    /**
     * update the response sort collection
     * @param standardisationSetup
     * @param scriptType
     */
    StandardisationSetupStore.prototype.updateResponseSortCollection = function (standardisationSetup, centreOrScriptOrReuse) {
        var _this = this;
        var defaultSortDetail = this.setDefaultSortOrder(standardisationSetup, centreOrScriptOrReuse);
        var sortDetails = {
            qig: this.markSchemeGroupId,
            comparerName: defaultSortDetail,
            sortDirection: enums.SortDirection.Ascending,
            selectedWorkList: standardisationSetup,
            centreOrScriptOrReuse: centreOrScriptOrReuse
        };
        var entry = this._standardisationSortDetails.filter(function (x) {
            return x.selectedWorkList === standardisationSetup &&
                x.centreOrScriptOrReuse === centreOrScriptOrReuse &&
                x.qig === _this.markSchemeGroupId;
        });
        if (entry.length === 0) {
            this._standardisationSortDetails.push(sortDetails);
        }
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationSortDetails", {
        /**
         * retrieve the sort deatils for standardisation.
         */
        get: function () {
            return this._standardisationSortDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationSetUpSelectedCentreNo", {
        /**
         * selected centre number in standardisation setup
         */
        get: function () {
            var selectedCentrePartId = this.selectedCentrePartId;
            var centreNo;
            if (this._standardisationCentreList) {
                this._standardisationCentreList.centreList.forEach(function (x) {
                    if (x.centrePartId === selectedCentrePartId) {
                        centreNo = x.centreNumber;
                    }
                });
            }
            return centreNo;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * standardisationSetup SelectedCentre Part Id
     * @param centreId
     */
    StandardisationSetupStore.prototype.standardisationSetupSelectedCentrePartId = function (centreId) {
        var centrePartId;
        if (this._standardisationCentreList) {
            this._standardisationCentreList.centreList.forEach(function (x) {
                if (x.uniqueId === centreId) {
                    centrePartId = x.centrePartId;
                }
            });
        }
        return centrePartId;
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "practiceResponseDetails", {
        /**
         * Returns the practice response details
         */
        get: function () {
            return this._practiceResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationResponseDetails", {
        /**
         * Returns the standardisation response details
         */
        get: function () {
            return this._standardisationResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "stmStandardisationResponseDetails", {
        /**
         * Returns the STM standardisation response details
         */
        get: function () {
            return this._stmStandardisationResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "seedResponseDetails", {
        /**
         * Returns the seed response details
         */
        get: function () {
            return this._seedResponseDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "isTotalMarksViewSelected", {
        /**
         * returns whether is total marks view selected
         */
        get: function () {
            return this._isTotalMarksViewSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "stdSetupPermissionCCData", {
        /**
         * Gets data in standardisation setup permission cc.
         */
        get: function () {
            return this.stdSetupPremissionCCData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationSetupReusableDetailsList", {
        /**
         * gets the reuse rig details list
         */
        get: function () {
            return this._standardisationSetupReusableDetailsList;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * gets the details list of reuse rigs based on Hide Response Status
     */
    StandardisationSetupStore.prototype.reusableDetailsListBasedOnHiddenStatus = function (isShowHiddenResponsesOn) {
        var notHiddenReusableDetailsList;
        if (this._standardisationSetupReusableDetailsList !== undefined) {
            if (isShowHiddenResponsesOn) {
                return this._standardisationSetupReusableDetailsList;
            }
            else {
                notHiddenReusableDetailsList = this._standardisationSetupReusableDetailsList.filter(function (x) {
                    return x.hidden !== true;
                });
                return Immutable.List(notHiddenReusableDetailsList);
            }
        }
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "stdResponseListBasedOnPermission", {
        /**
         * gets the response list based on Ssu Permission CC.
         */
        get: function () {
            if (this._stdResponseListBasedOnPermission) {
                return this._stdResponseListBasedOnPermission;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * to update the standardisation response data with tag id once the tag is updated/deleted
     * @param tagId
     * @param tagOrder
     * @param esMarkGroupId
     */
    StandardisationSetupStore.prototype.updateTagId = function (tagId, tagOrder, esMarkGroupId) {
        var memoryStorageArea;
        switch (this.selectedStandardisationSetupWorkList) {
            case enums.StandardisationSetup.ProvisionalResponse:
            case enums.StandardisationSetup.UnClassifiedResponse:
                Immutable.List(this.standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })).first().tagId = tagId;
                Immutable.List(this.standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })).first().tagOrder = tagOrder;
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                memoryStorageArea = enums.PageContainers[enums.PageContainers.StandardisationSetup];
                switch (this._markingMode) {
                    case enums.MarkingMode.Practice:
                        this.practiceResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagId = tagId;
                        this.practiceResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagOrder = tagOrder;
                        break;
                    case enums.MarkingMode.Approval:
                        this.standardisationResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagId = tagId;
                        this.standardisationResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagOrder = tagOrder;
                        break;
                    case enums.MarkingMode.ES_TeamApproval:
                        this.stmStandardisationResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagId = tagId;
                        this.stmStandardisationResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagOrder = tagOrder;
                        break;
                    case enums.MarkingMode.Seeding:
                        this.seedResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagId = tagId;
                        this.seedResponseDetails.filter(function (x) { return x.esMarkGroupId === esMarkGroupId; })[0].tagOrder = tagOrder;
                        break;
                }
                break;
        }
    };
    /**
     * Get Hidden Worklists for current examiner role.
     */
    StandardisationSetupStore.prototype.getHiddenWorklists = function () {
        // check whether standardisation set up permission cc data configured.
        // and get the classification type that needs to hide.
        if (this.stdSetupPermissionCCData) {
            var classifications = this.stdSetupPermissionCCData.role.viewByClassification.classifications;
            var hiddenStdWorklists = Immutable.List([classifications.practice ? enums.MarkingMode.None : enums.MarkingMode.Practice]);
            hiddenStdWorklists = Immutable.List(hiddenStdWorklists.concat(classifications.standardisation ?
                enums.MarkingMode.None : enums.MarkingMode.Approval));
            hiddenStdWorklists = Immutable.List(hiddenStdWorklists.concat(classifications.seeding ? enums.MarkingMode.None : enums.MarkingMode.Seeding));
            hiddenStdWorklists = Immutable.List(hiddenStdWorklists.concat(classifications.stmStandardisation ?
                enums.MarkingMode.None : enums.MarkingMode.ES_TeamApproval));
            hiddenStdWorklists = Immutable.List(hiddenStdWorklists.filter(function (x) { return x !== enums.MarkingMode.None; }));
            return hiddenStdWorklists;
        }
        return undefined;
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "restrictSSUTargetsCCData", {
        /**
         * Gets data in RestrictStandardisationSetupTargets CC.
         */
        get: function () {
            return this._restrictSSUTargetsCCData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "currentWorklistResponseCount", {
        /**
         * This will return the current worklist response count
         */
        get: function () {
            return Immutable.List(this.standardisationSetUpResponsedetails.standardisationResponses).count();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get Response Details
     * @param {string} displayID
     * @returns {ResponseBase}
     * @memberof StandardisationSetupStore
     */
    StandardisationSetupStore.prototype.getResponseDetails = function (displayID) {
        if (this.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            var response = Immutable.List(this.standardisationScriptList.centreScriptList.filter(function (response) { return response.candidateScriptId.toString() === displayID; }));
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the base values.
                return response.first();
            }
        }
        // Check the display Id exists in the list
        if (this.standardisationSetUpResponsedetails && this.standardisationSetUpResponsedetails.standardisationResponses) {
            var response = Immutable.List(this.standardisationSetUpResponsedetails.standardisationResponses.filter(function (response) { return response.displayId === displayID; }));
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the base values.
                return response.first();
            }
        }
        // no data found for the disply id.
        return null;
    };
    /**
     * get Response Position
     * @param {string} displayId
     * @returns {number}
     * @memberof StandardisationSetupStore
     */
    StandardisationSetupStore.prototype.getResponsePosition = function (displayId) {
        var response = Immutable.List(this.
            getCurrentWorklistResponseBaseDetailsInSortOrder()).find(function (x) { return x.displayId === displayId; });
        if (response != null || response !== undefined) {
            return this.standardisationSetUpResponsedetails.
                standardisationResponses.indexOf(response) + 1;
        }
    };
    /**
     * Returns whether next response is available or not
     * @param {string} displayId
     * @returns {boolean}
     * @memberof StandardisationSetupStore
     */
    StandardisationSetupStore.prototype.isNextResponseAvailable = function (displayId) {
        return this.getResponsePosition(displayId) < this.currentWorklistResponseCount;
    };
    /**
     * This will check whether the previous response is exists or not
     */
    StandardisationSetupStore.prototype.isPreviousResponseAvailable = function (displayId) {
        return this.getResponsePosition(displayId) > 1;
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "setCandidateScriptInfoCollection", {
        /**
         * set Candidate Script Info Collection
         * @memberof StandardisationSetupStore
         */
        set: function (candidateScriptInfo) {
            this.candidateScriptInfoCollection = candidateScriptInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "getCandidateScriptInfoCollection", {
        /**
         * get Candidate Script Info Collection
         * @readonly
         * @type {Immutable.List<candidateScriptInfo>}
         * @memberof StandardisationSetupStore
         */
        get: function () {
            return this.candidateScriptInfoCollection;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the next response id
     * @param {string} displayId
     * @returns {string}
     * @memberof StandardisationSetupStore
     */
    StandardisationSetupStore.prototype.nextResponseId = function (displayId) {
        var position = this.getResponsePosition(displayId);
        var response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position];
        if (response != null) {
            return response.displayId;
        }
    };
    /**
     * Get the previous response id
     * @param {string} displayId
     * @returns {string}
     * @memberof StandardisationSetupStore
     */
    StandardisationSetupStore.prototype.previousResponseId = function (displayId) {
        var position = this.getResponsePosition(displayId);
        var response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position - 2];
        if (response != null) {
            return response.displayId;
        }
    };
    /**
     * Find the Response details for the mark group Id
     * @param markGroupId
     */
    StandardisationSetupStore.prototype.getResponseDetailsByMarkGroupId = function (esMarkGroupId) {
        // Check the mark group Id exists in the list
        var response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().filter(function (response) { return response.esMarkGroupId === esMarkGroupId; });
        if (response != null && response !== undefined && response.count() === 1) {
            // If response is found in collection, return the base values.
            return response.first();
        }
        // no data found for the mark group id.
        return null;
    };
    /**
     * Returns the tagId
     * @param {string} displayId
     * @returns
     * @memberof StandardisationSetupStore
     */
    StandardisationSetupStore.prototype.getTagId = function (displayId) {
        var tagId;
        if (this.getCurrentWorklistResponseBaseDetailsInSortOrder()) {
            var response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().filter(function (response) { return response.displayId === displayId; });
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the ag id
                tagId = response.first().tagId;
            }
        }
        return tagId;
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "getPreviousSessionTabVisibiltyinSelectResponse", {
        /**
         * Get Session tab visibilty in SSU
         */
        get: function () {
            return (configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.ReuseRIG).toLowerCase() === 'true'
                && this.stdSetupPremissionCCData.role.permissions.reuseResponses);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the current worklists Response details in sorted order.
     * @param worklistDetails
     */
    StandardisationSetupStore.prototype.getCurrentWorklistResponseBaseDetailsInSortOrder = function () {
        var workListDetails = this.standardisationSetUpResponsedetails;
        if (workListDetails !== undefined) {
            this.setDefaultComparer();
            var _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
            if (this.isSortingRequired()) {
                workListDetails.standardisationResponses = Immutable.List(sortHelper.sort(Immutable.List(workListDetails.standardisationResponses).toArray(), comparerlist[_comparerName]));
            }
            else {
                workListDetails.standardisationResponses = Immutable.List(workListDetails.standardisationResponses);
            }
            return workListDetails ? workListDetails.standardisationResponses : undefined;
        }
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "comparerName", {
        get: function () {
            return this._comparerName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "sortDirection", {
        get: function () {
            return this._sortDirection;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether sorting required for this current comparer.
     */
    StandardisationSetupStore.prototype.isSortingRequired = function () {
        return this.comparerName !== comparerlist[comparerlist.tagComparer];
    };
    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    StandardisationSetupStore.prototype.setDefaultComparer = function (centreOrScriptOrReuse) {
        this._comparerName = undefined;
        this._sortDirection = undefined;
        var defaultComparers = this.standardisationSortDetails;
        var selectedStandardisationSetupWorkList = this.selectedStandardisationSetupWorkList;
        var qigId = this.markSchemeGroupId;
        var entry = defaultComparers.filter(function (x) {
            return x.selectedWorkList === selectedStandardisationSetupWorkList && x.qig === qigId;
        });
        if (centreOrScriptOrReuse) {
            entry = entry.filter(function (x) { return x.centreOrScriptOrReuse === centreOrScriptOrReuse; });
        }
        if (entry.length > 0 && this.isSortingRequired()) {
            this._comparerName = comparerlist[entry[0].comparerName];
            this._sortDirection = entry[0].sortDirection;
        }
    };
    /**
     *  To update the standardisation response data with current note once the note is updated/deleted against that response
     */
    StandardisationSetupStore.prototype.updateCurrentNote = function (esMrkGroupId, currentNote) {
        this._standardisationSetUpResponsedetails.standardisationResponses.map(function (x) {
            if (x.esMarkGroupId === esMrkGroupId) {
                x.note = currentNote;
            }
        });
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "iscompleteStandardisationSuccess", {
        /**
         * gets if the standardisation complete process
         * is successful or not
         */
        get: function () {
            return (this._completeStandardisationSetupSuccess === enums.CompleteStandardisationErrorCode.None);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the provisional examiner id
     * @param {number} displayId
     */
    StandardisationSetupStore.prototype.getProvisionalExaminerId = function (displayId) {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.displayId === displayId.toString(); }).first().provisionalExaminerId;
    };
    /**
     * Get the provisional marker surname
     * @param {number} displayId
     */
    StandardisationSetupStore.prototype.getProvisionalMarkerSurName = function (displayId) {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.displayId === displayId.toString(); }).first().provisionalMarkerSurname;
    };
    /**
     * Get the provisional marker Initials
     * @param {number} displayId
     */
    StandardisationSetupStore.prototype.getProvisionalMarkerInitials = function (displayId) {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.displayId === displayId.toString(); }).first().provisionalMarkerInitials;
    };
    /**
     *  Gets the details of response that user tried to re classify.
     */
    StandardisationSetupStore.prototype.reclassifiedResponseDetails = function () {
        return this._reclassifiedResponseDetails;
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "createdStandardisationRIGDetails", {
        get: function () {
            return this._createStandardisationRIGReturnData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StandardisationSetupStore.prototype, "isDoMarkNow", {
        /**
         * gets if the standardisation complete process
         * is successful or not
         */
        get: function () {
            return this._doMarkNow;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the current standardisation setup worklist response details.
     */
    StandardisationSetupStore.prototype.getCurrentWorklistResponseBaseDetails = function () {
        var standardisationWorkListDetails = this.standardisationSetUpResponsedetails;
        return standardisationWorkListDetails ? standardisationWorkListDetails.standardisationResponses : undefined;
    };
    /**
     * to update the hidden value of the Reuse RIG Response where we have updated Hide Response Toggle
     * @param hiddenDisplayId
     * @param isActiveStatus
     */
    StandardisationSetupStore.prototype.updateHiddenResponseStatus = function (hiddenDisplayId, isActiveStatus) {
        var selectedReusableDetailsList = Immutable.List(this._standardisationSetupReusableDetailsList.filter(function (x) {
            return x.displayId === hiddenDisplayId;
        }));
        selectedReusableDetailsList.first().hidden = isActiveStatus;
    };
    /**
     * Find the Response details for the es mark group Id
     * @param esMarkGroupId
     */
    StandardisationSetupStore.prototype.getResponseDetailsByEsMarkGroupIdBasedOnPermission = function (esMarkGroupId) {
        // Check the mark group Id exists in the list
        var response = this._stdResponseListBasedOnPermission.filter(function (response) { return response.esMarkGroupId === esMarkGroupId; })[0];
        if (response != null && response !== undefined) {
            // If response is found in collection
            return response;
        }
        // no data found for the es mark group id.
        return null;
    };
    /**
     * updates the markAsDefinitiveFlag, on copy marks and annotation as definitive action.
     * @param displayId
     */
    StandardisationSetupStore.prototype.updateMarkAsDefinitiveFlag = function (displayId) {
        var id;
        id = displayId ? displayId : this._selectedResponseId.toString();
        if (this._standardisationSetUpResponsedetails) {
            this._standardisationSetUpResponsedetails.standardisationResponses.forEach(function (x) {
                if (x.displayId === id) {
                    x.hasDefinitiveMark = true;
                }
            });
        }
    };
    /**
     * Get the definitive examiner role id
     * @param displayId
     */
    StandardisationSetupStore.prototype.getDefinitiveExaminerRoleId = function (displayId) {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.displayId === displayId.toString(); }).first().examinerRoleId;
    };
    /**
     * Get the definitive examiner role id
     * @param displayId
     */
    StandardisationSetupStore.prototype.getFormattedExaminerName = function (displayId) {
        return stringFormatHelper.getFormattedExaminerName(this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.displayId === displayId.toString(); }).first().provisionalMarkerInitials, this._standardisationSetUpResponsedetails.standardisationResponses.filter(function (x) { return x.displayId === displayId.toString(); }).first().provisionalMarkerSurname);
    };
    Object.defineProperty(StandardisationSetupStore.prototype, "standardisationCentreScriptFilterDetails", {
        /**
         * Gets standardisation centre script filter details
         */
        get: function () {
            return this._standardisationCentreScriptFilterDetails;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets filtered standaridsation script list
     * @param filterText
     */
    StandardisationSetupStore.prototype.getFilteredStdCentreScriptList = function (filterText) {
        var filteredData = JSON.parse(JSON.stringify(this._standardisationScriptList));
        var filterSearchArray = filterText.toLowerCase().split(',');
        filteredData.centreScriptList = Immutable.List(filteredData.centreScriptList
            .filter(function (scripts) { return (scripts.questionItems.toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1) || (scripts.questionItems.toLowerCase().split(',')
            .some(function (v) { return filterSearchArray.indexOf(v) >= 0; })); }));
        return filteredData;
    };
    /**
     * Get the filtered std centre script details in sort order.
     */
    StandardisationSetupStore.prototype.getFilteredStdCentreScriptDetailsListInSortOrder = function () {
        var stdScriptListDetails;
        // Apply filtering if filter exists
        if (this.standardisationCentreScriptFilterDetails && this.standardisationCentreScriptFilterDetails.filterString !== '') {
            stdScriptListDetails
                = this.getFilteredStdCentreScriptList(this.standardisationCentreScriptFilterDetails.filterString).centreScriptList;
        }
        else {
            stdScriptListDetails = Immutable.List(this._standardisationScriptList.centreScriptList);
        }
        // Apply sorting
        if (stdScriptListDetails !== undefined) {
            this.setDefaultComparer('Script');
            var _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
            stdScriptListDetails = Immutable.List(sortHelper.sort(Immutable.List(stdScriptListDetails).toArray(), comparerlist[_comparerName]));
            return stdScriptListDetails ? stdScriptListDetails : undefined;
        }
    };
    // Events
    StandardisationSetupStore.SET_PANEL_STATE = 'panelState';
    StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT = 'LeftPanelWorkListSelctionEvent';
    StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT = 'Standardisation target load event';
    StandardisationSetupStore.STM_OPEN_RESPONSE_EVENT = 'StmOpenResponseEvent';
    StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT = 'Script Details Loaded Event';
    StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT = 'StmCentreDetailsResponseEvent';
    StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT = 'StandardisationResponseDataUpdatedEvent';
    StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT = 'SetScrollWorklistColumns';
    StandardisationSetupStore.POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT = 'OpenSelectToMarkButtonPopupEvent';
    StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT = 'StandardisationRigCreatedEvent';
    StandardisationSetupStore.POPUP_OPEN_DECLASSIFY_POPUP_EVENT = 'OpenDeclassifyPopupEvent';
    StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT = 'GetReUsableRigDetails';
    StandardisationSetupStore.TAG_UPDATED_EVENT = 'TagUpdatedEvent';
    StandardisationSetupStore.COMPLETE_STANDARDISATION_SETUP_EVENT = 'CompleteStandardisationSetupEvent';
    StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID = 'UpdatedMousePositionClassifyGrid';
    StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT = 'OpenReclassifyPopupEvent';
    StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT = 'DeclassifyResponseEvent';
    StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT = 'ReclassifiedResponseEvent';
    StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT = 'OpenReclassifyErrorPopupEvent';
    StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT = 'RejectedReclassifyActionEvent';
    StandardisationSetupStore.REORDERED_RESPONSE_EVENT = 'ReorderedResponseEvent';
    StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT = 'OpenReorderErrorPopupEvent';
    StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT = 'RenderPreviousSessionGridEvent';
    StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE = 'SetSsuTableWrapperMarginsAndStyle';
    StandardisationSetupStore.MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT = 'MultiOptionReclassifiedResponseEvent';
    StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT = 'CopyMarksAndAnnotationsAsDefinitiveEvent';
    StandardisationSetupStore.SAVE_NOTE_COMPLETED_ACTION_EVENT = 'SaveNoteCompletedActionEvent';
    StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT = 'DiscardStandardisationResponseEvent';
    StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY = 'StandardisationShareResponsePopupDisplay';
    return StandardisationSetupStore;
}(storeBase));
var instance = new StandardisationSetupStore();
module.exports = { StandardisationSetupStore: StandardisationSetupStore, instance: instance };
//# sourceMappingURL=standardisationsetupstore.js.map