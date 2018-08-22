import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import Immutable = require('immutable');
import enums = require('../../components/utility/enums');
import responseOpenAction = require('../../actions/response/responseopenaction');
import standardisationsetupleftPanelToggleAction = require('../../actions/standardisationsetup/standardisationsetupleftpaneltoggleaction');
import standardisationSetupSelectWorkListAction = require('../../actions/standardisationsetup/standardisationsetupworklistselectaction');
import standardisationTargetDetails = require('./typings/standardisationtargetdetails');
import standardisationTargetDetail = require('./typings/standardisationtargetdetail');
import getStandardisationSetupTargetDetailsAction =
require('../../actions/standardisationsetup/getstandardisationsetuptargetdetailsaction');
import getScriptsOfSelectedCentreAction = require('../../actions/standardisationsetup/getscriptsofselectedcentreaction');
import standardisationCentreScriptOpenAction =
require('../../actions/standardisationsetup/standardisationcentrescriptopenaction');
import getStandardisationSetupCentresDetailsAction =
require('../../actions/standardisationsetup/getstandardisationsetupcentresdetailsaction');
import sortClickAction = require('../../actions/standardisationsetup/sortaction');
import standardisationsortdetails = require('../../components/utility/grid/standardisationsortdetails');
import comparerlist = require('../../utility/sorting/sortbase/comparerlist');
import responseCloseAction = require('../../actions/worklist/responsecloseaction');
import getstandardisationresponsedetailsaction = require('../../actions/standardisationsetup/getstandardisationresponsedetailsaction');
import stdSetupPermissionCCDataAction = require('../../actions/standardisationsetup/standardisationsetuppermissionccdatagetaction');
import stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
import stdSetupPermissionData = require('./typings/standardisationsetupccdata');
import getReuseRigDetailsAction = require('../../actions/standardisationsetup/getreuserigdetailsaction');
import tagUpdateAction = require('../../actions/tag/tagupdateaction');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import createStandardisationRigAction = require('../../actions/standardisationsetup/createstandardisationrigaction');
import updateBlueHelperMessageVisibilityAction =
require('../../actions/standardisationsetup/updateselecttomarkhelpermessagevisibilityaction');
import stdDeclassifyPopupOpenAction = require('../../actions/standardisationsetup/declassifypopupdisplayaction');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import selectToMarkPopupAction = require('../../actions/standardisationsetup/selecttomarkpopupaction');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import markSchemeGroupHelper = require('../../utility/standardisationsetup/markschemegrouphelper');
import loadContainerAction = require('../../actions/navigation/loadcontaineraction');
import sortHelper = require('../../utility/sorting/sorthelper');
import completeStandardisationSetupAction = require('../../actions/standardisationsetup/completestandardisationsetupaction');
import stdDeclassifyResponseAction = require('../../actions/standardisationsetup/declassifyresponseaction');
import updateMousePositionAction = require('../../actions/response/updatemousepositionaction');
import mousePosition = require('../response/mouseposition');
import stdReclassifyPopupOpenAction = require('../../actions/standardisationsetup/reclassifypopupdisplayaction');
import reclassifyResponseAction = require('../../actions/standardisationsetup/reclassifyresponseaction');
import updateESMarkGroupMarkingModeData = require('./typings/updateesmarkgroupmarkingmodedata');
import stdReclassifyErrorPopupOpenAction = require('../../actions/standardisationsetup/reclassifyerrorpopupdisplayaction');
import reorderResponseAction = require('../../actions/standardisationsetup/reorderresponseaction');
import createStandardisationRIGReturnData = require('./typings/createstandardisationrigreturndata');
import updateHideResponseStatusAction = require('../../actions/standardisationsetup/updatehideresponsestatusaction');
import copymarksandannotationasdefinitiveaction = require('../../actions/standardisationsetup/copymarksandannotationasdefinitiveaction');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');
import standardisationCentreScriptFilterAction = require('../../actions/standardisationsetup/standardisationcentrescriptfilteraction');
import standardisationCentreScriptFilterDetails = require('../../components/utility/grid/standardisationcentrescriptfilterdetails');
import discardStandardisationResponseAction = require('../../actions/standardisationsetup/discardstandardisationresponseaction');
import stdReclassifyMultiOptionPopupOpenAction = require('../../actions/standardisationsetup/reclassifymultioptionpopupdisplayaction');
import saveNoteAction = require('../../actions/standardisationsetup/savenoteaction');
import classifyResponseAction = require('../../actions/standardisationsetup/classifyresponseaction');
import updateStdResponseCollectionAction =
require('../../actions/standardisationsetup/updatestandardisationsetupresponsecollectionaction');
import shareResponsePopupDisplayAction = require('../../actions/standardisationsetup/shareresponsepopupdisplayaction');
import setRememberQigAction = require('../../actions/useroption/setrememberqigaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import standardisationSelectedTabAction = require('../../actions/standardisationsetup/standardisationselecttabaction');
import standardisationSetupScriptMetadataFetchAction =
require('../../actions/standardisationsetup/standardisationsetupscriptmetadatafetchaction');
import hideReuseToggleAction = require('../../actions/standardisationsetup/hidereusetoggleaction');
import userOptionSaveAction = require('../../actions/useroption/useroptionsaveaction');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import classifiedResponseHeaderDetail = require('./typings/classifiedresponseheaderdetail');
import concurrentSaveFailInStmPopupAction = require('../../actions/standardisationsetup/concurrentsavefailinstmpopupaction');
import reuseRigActionPopDisplayAction = require('../../actions/standardisationsetup/ReuseRigPopupDisplayAction');
import reuseRigAction = require('../../actions/standardisationsetup/reuserigaction');
import standardisationSetupHistoryInfoAction = require('../../actions/standardisationsetup/standardisationsetuphistoryinfoaction');

/**
 * store class for standardisation setup
 */
class StandardisationSetupStore extends storeBase {

    // standardisationsetup data collection
    public success: boolean;
    public _standardisationSortDetails: Array<standardisationsortdetails>;
    public _standardisationCentreScriptFilterDetails: standardisationCentreScriptFilterDetails;
    private _isLeftPanelCollapsed: boolean;
    private _selectedStandardisationSetupWorkList: enums.StandardisationSetup = enums.StandardisationSetup.None;
    private _standardisationTargetDetailsList: standardisationTargetDetails;
    private _markSchemeGroupId: number;
    private _examinerRoleId: number;
    private _standardisationScriptList: StandardisationScriptDetailsList;
    private _selectedResponseId: number;
    private _selectedCentrePartId: number;
    private _selectedCentreId: number = 0;
    private _selectedCentreIdFromWorklist: number = 0;
    private _standardisationCentreList: StandardisationCentreDetailsList;
    private _standardisationSetUpResponsedetails: StandardisationSetupResponsedetailsList;
    private _isTotalMarksViewSelected: boolean;
    private stdSetupPremissionCCData: stdSetupPermissionData;
    private _selectedScriptAvailable: boolean;
    private _standardisationSetupReusableDetailsList: Immutable.List<StandardisationResponseDetails>;
    private _notHiddenReusableDetailsList: Immutable.List<StandardisationResponseDetails>;
    private _hasAdditionalPage: boolean;
    private _reclassifiedResponseDetails: updateESMarkGroupMarkingModeData;
    private _createStandardisationRIGReturnData: createStandardisationRIGReturnData;
    private _scriptNavigationDirection: enums.ResponseNavigation;

    // Holds qig wise Centreid for persistence
    // containes markSchemeGroupId: number, selectedCentreId: number
    private _stdSetupCentrePersistenceList: Immutable.Map<number, number>;

    // contains examinerRoleId: number, isExpanded: number collections
    private _expandOrCollapseDetails: Immutable.Map<number, boolean>;
    private _candidateScriptDetailsAgainstCentre: any[];
    private _candidateScriptDetailsAgainstCentreInResponseNavigation: any[];
    private _markingMode: enums.MarkingMode;
    private storageAdapterHelper = new storageAdapterHelper();
    private candidateScriptInfoCollection: Immutable.List<candidateScriptInfo>;
    private _isSelectToMarkHelperMessageVisible: boolean = true;
    private _restrictSSUTargetsCCData: Immutable.List<enums.MarkingMode>;
    private _comparerName: string;
    private _sortDirection: enums.SortDirection;
    private _completeStandardisationSetupSuccess: enums.CompleteStandardisationErrorCode;
    private _mousePosition: mousePosition;
    private _doMarkNow: boolean;
    private _containerPage: enums.PageContainers;
    private _previousContainerPage: enums.PageContainers;
    private _selectedTabInSelectResponse: enums.StandardisationSessionTab = enums.StandardisationSessionTab.CurrentSession;
    private _isshowHiddenResponsesSelected: boolean;
    private _failedMarkSchemeGroupNames: string;
    private _markerOperationMode: enums.MarkerOperationMode;
    private _isClassifiedFromUnclassifiedResponse: boolean;
    private _classifyResponseMarkGroupId: number;

    // Events
    public static SET_PANEL_STATE = 'panelState';
    public static STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT = 'LeftPanelWorkListSelctionEvent';
    public static GET_STANDARDISATION_TARGET_DETAILS_EVENT = 'Standardisation target load event';
    public static STM_OPEN_RESPONSE_EVENT = 'StmOpenResponseEvent';
    public static SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT = 'Script Details Loaded Event';
    public static GET_STANDARDISATION_CENTRE_DETAILS_EVENT = 'StmCentreDetailsResponseEvent';
    public static STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT = 'StandardisationResponseDataUpdatedEvent';
    public static SETSCROLL_WORKLIST_COLUMNS_EVENT = 'SetScrollWorklistColumns';
    public static POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT = 'OpenSelectToMarkButtonPopupEvent';
    public static STANDARDISATION_RIG_CREATED_EVENT = 'StandardisationRigCreatedEvent';
    public static POPUP_OPEN_DECLASSIFY_POPUP_EVENT = 'OpenDeclassifyPopupEvent';
    public static GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT = 'GetReUsableRigDetails';
    public static TAG_UPDATED_EVENT = 'TagUpdatedEvent';
    public static COMPLETE_STANDARDISATION_SETUP_EVENT = 'CompleteStandardisationSetupEvent';
    public static UPDATED_MOUSE_POSITION_CLASSIFY_GRID = 'UpdatedMousePositionClassifyGrid';
    public static POPUP_OPEN_RECLASSIFY_POPUP_EVENT = 'OpenReclassifyPopupEvent';
    public static DECLASSIFY_RESPONSE_EVENT = 'DeclassifyResponseEvent';
    public static RECLASSIFIED_RESPONSE_EVENT = 'ReclassifiedResponseEvent';
    public static POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT = 'OpenReclassifyErrorPopupEvent';
    public static REJECTED_RECLASSIFY_ACTION_EVENT = 'RejectedReclassifyActionEvent';
    public static REORDERED_RESPONSE_EVENT = 'ReorderedResponseEvent';
    public static POPUP_OPEN_REORDER_ERROR_POPUP_EVENT = 'OpenReorderErrorPopupEvent';
    public static RENDER_PREVIOUS_SESSION_GRID_EVENT = 'RenderPreviousSessionGridEvent';
    public static SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE = 'SetSsuTableWrapperMarginsAndStyle';
    public static MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT = 'MultiOptionReclassifiedResponseEvent';
    public static COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT = 'CopyMarksAndAnnotationsAsDefinitiveEvent';
    public static SAVE_NOTE_COMPLETED_ACTION_EVENT = 'SaveNoteCompletedActionEvent';
    public static DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT = 'DiscardStandardisationResponseEvent';
    public static STANDARDISATION_SETUP_SCRIPT_METADATA_FETCH_EVENT = 'StandardistionSetupScriptMetadataFetchAction';
    public static STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY = 'StandardisationShareResponsePopupDisplay';
    public static CLASSIFY_RESPONSE_EVENT = 'ClassifyResponseEvent';
    public static CONCURRENT_SAVE_FAIL_EVENT = 'ConcurrentEvent';
    public static REUSE_RIG_POPUP_DISPLAY_ACTION_EVENT = 'ReuseRigActionPopupopenEvent';
    public static REUSE_RIG_ACTION_COMPLETED_EVENT = 'ReuseRigActionCompletedEvent';
    public static RESPONSE_ALREADY_DISCARDED_EVENT = 'ResponseAlreadyDiscardedEvent';
    /**
     * @constructor
     */
    constructor() {
        super();
        this._standardisationSortDetails = new Array<standardisationsortdetails>();
        this._expandOrCollapseDetails = Immutable.Map<number, boolean>();

        this._stdSetupCentrePersistenceList = Immutable.Map<number, number>();

        this._dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_ACTION:
                    let getreuserigdetailsaction = action as getReuseRigDetailsAction;
                    this._standardisationSetupReusableDetailsList = getreuserigdetailsaction.StandardisationSetupReusableDetailsList;
                    this._isshowHiddenResponsesSelected = getreuserigdetailsaction.ShowHiddenResponseSelected;
                    this.emit(StandardisationSetupStore.GET_STANDARDISATION_SETUP_REUSE_RIG_DETAILS_EVENT);
                    break;
                case actionType.STANDARDISATION_SETUP_LEFT_PANEL_TOGGLE:
                    this._isLeftPanelCollapsed = (action as standardisationsetupleftPanelToggleAction).isLeftPanelCollapsed;
                    this.emit(StandardisationSetupStore.SET_PANEL_STATE);
                    break;

                case actionType.STANDARDISATION_SETUP_WORKLIST_SELECT_ACTION:
                    let standardisationLeftPanelWorkListSelectAction = (action as standardisationSetupSelectWorkListAction);
                    this._selectedStandardisationSetupWorkList = standardisationLeftPanelWorkListSelectAction.selectedWorkList;
                    this._markSchemeGroupId = standardisationLeftPanelWorkListSelectAction.markSchemeGroupId;
                    this._examinerRoleId = standardisationLeftPanelWorkListSelectAction.examinerRoleId;
                    // The standardisation response details should be cleared each left panelk click                   
                    this._standardisationSetUpResponsedetails = undefined;
                    this._mousePosition = undefined;
                    this.updateSortCollection();
                    // If the SelectResponse worklist panel is being selected from response breadcrumb , then persist filter details
                    if (!(this._previousContainerPage === enums.PageContainers.Response
                        && this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse)) {
                        this._standardisationCentreScriptFilterDetails = undefined;
                        this._selectedTabInSelectResponse = enums.StandardisationSessionTab.CurrentSession;
                    }

                    this.emit(StandardisationSetupStore.STANDARDISATION_SETUP_LEFT_PANEL_SELECT_EVENT,
                        this.selectedStandardisationSetupWorkList, standardisationLeftPanelWorkListSelectAction.useCache);
                    break;
                case actionType.STANDARDISATION_SELECT_TAB_ACTION:
                    let standardisationSelectedTabAction = (action as standardisationSelectedTabAction);
                    this._selectedTabInSelectResponse = standardisationSelectedTabAction.selectedTabInSelectResponse;
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    this._markerOperationMode = markerOperationMode.operationMode;
                    this._selectedStandardisationSetupWorkList = enums.StandardisationSetup.None;
                    this._markSchemeGroupId = undefined;
                    break;
                case actionType.GET_STANDARDISATION_TARGET_DETAILS_ACTION:
                    let standardisationTargetDetailsAction = action as getStandardisationSetupTargetDetailsAction;
                    this.success = standardisationTargetDetailsAction.success;
                    if (this.success) {
                        this._standardisationTargetDetailsList = standardisationTargetDetailsAction.StandardisationTargetDetailsList;
                        this._markSchemeGroupId = standardisationTargetDetailsAction.markSchemeGroupId;
                        this._examinerRoleId = standardisationTargetDetailsAction.examinerRoleId;
                        this.emit(StandardisationSetupStore.GET_STANDARDISATION_TARGET_DETAILS_EVENT);
                    }
                    break;
                case actionType.GET_SCRIPTS_OF_SELECTED_CENTRE_ACTION:
                    let success = (action as getScriptsOfSelectedCentreAction).success;
                    let isResponseNavigation: boolean = (action as getScriptsOfSelectedCentreAction).isTriggeredFromResponseHeader;
                    this._scriptNavigationDirection = (action as getScriptsOfSelectedCentreAction).direction;
                    if (success) {
                        this._standardisationScriptList = (action as getScriptsOfSelectedCentreAction).scriptListOfSelectedCentre;

                        // clear centre script filter details on changing centre selection
                        if (this._selectedCentreId !== (action as getScriptsOfSelectedCentreAction).selectedCentreId) {
                            this._standardisationCentreScriptFilterDetails = undefined;
                        }

                        this._selectedCentrePartId = (action as getScriptsOfSelectedCentreAction).selectedCentrePartId;
                        this._selectedCentreId = (action as getScriptsOfSelectedCentreAction).selectedCentreId;

                        if (!isResponseNavigation) {
                            this._selectedCentreIdFromWorklist = this._selectedCentreId;
                            // Set candidateScriptId and documentyId of all scripts in a centre
                            this.setCandidateScriptDetailsAgainstCentre();
                        } else {
                            // Set candidateScriptId and documentyId of all scripts in a centre
                            this.setCandidateScriptDetailsAgainstCentre(true);
                        }

                        this._stdSetupCentrePersistenceList = this._stdSetupCentrePersistenceList.set(
                            this.markSchemeGroupId, this._selectedCentreIdFromWorklist);
                    }
                    this.updateResponseSortCollection(this._selectedStandardisationSetupWorkList, 'Script');
                    this.emit(StandardisationSetupStore.SCRIPT_DETAILS_OF_SELECTED_CENTRE_EVENT,
                        isResponseNavigation, this._scriptNavigationDirection);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN:
                    let centreScriptOpenAction: standardisationCentreScriptOpenAction = action as standardisationCentreScriptOpenAction;
                    this._selectedResponseId = centreScriptOpenAction.selectedCandidateScriptId;
                    this._selectedScriptAvailable = centreScriptOpenAction.scriptAvailable;
                    this.emit(StandardisationSetupStore.STM_OPEN_RESPONSE_EVENT, this._selectedResponseId);
                    break;
                case actionType.GET_STANDARDISATION_CENTRE_DETAILS_ACTION:
                    let centreDetailsAction = (action as getStandardisationSetupCentresDetailsAction);
                    this._standardisationCentreList = centreDetailsAction.StandardisationCentreDetailsList;
                    this._isTotalMarksViewSelected = centreDetailsAction.isTotaMarksViewSelected;

                    if (this.markSchemeGroupId) {
                        let _selectedCentreId = this._stdSetupCentrePersistenceList.get(this.markSchemeGroupId);
                        if (_selectedCentreId > 0) {
                            //this._selectedCentreId =
                            this._selectedCentreIdFromWorklist = _selectedCentreId;
                        } else {
                            //this._selectedCentreId = 
                            this._selectedCentreIdFromWorklist = this._standardisationCentreList.centreList.first().uniqueId;
                            this._stdSetupCentrePersistenceList = this._stdSetupCentrePersistenceList.set(
                                this.markSchemeGroupId, this._selectedCentreIdFromWorklist);
                        }
                    }

                    // clear script list on Select Response selection 
                    // (before Centre Selection.Script details will load on Centre click)
                    this._standardisationScriptList = undefined;
                    this.emit(StandardisationSetupStore.GET_STANDARDISATION_CENTRE_DETAILS_EVENT, this._selectedResponseId);
                    break;
                case actionType.STANDARDISATION_SORT_ACTION:
                    let _sortClickAction: sortClickAction = (action as sortClickAction);
                    let _sortDetails: standardisationsortdetails = _sortClickAction.getStandardisationSortDetails;

                    for (var i = 0; i < this._standardisationSortDetails.length; i++) {

                        if (_sortDetails.comparerName &&
                            _sortDetails.selectedWorkList === this._standardisationSortDetails[i].selectedWorkList &&
                            _sortDetails.centreOrScriptOrReuse === this._standardisationSortDetails[i].centreOrScriptOrReuse &&
                            _sortDetails.qig === this._standardisationSortDetails[i].qig) {

                            this._standardisationSortDetails[i].comparerName = _sortDetails.comparerName;
                            this._standardisationSortDetails[i].sortDirection = _sortDetails.sortDirection;
                        }
                    }
                    break;
                case actionType.OPEN_RESPONSE:
                    this._selectedResponseId = (action as responseOpenAction).selectedDisplayId;
                    let selectedScriptDetails: StandardisationScriptDetails = this.fetchSelectedScriptDetails();
                    this._doMarkNow = false;
                    this._selectedScriptAvailable = selectedScriptDetails ? (!selectedScriptDetails.isAllocatedALive &&
                        !selectedScriptDetails.isUsedForProvisionalMarking) : false;
                    this._isSelectToMarkHelperMessageVisible = (action as responseOpenAction).isOnScreenHintVisible;
                    break;
                case actionType.GET_STANDARDISATION_RESPONSE_DETAILS_ACTION:
                    let standardisationresponsedetailsaction = action as getstandardisationresponsedetailsaction;
                    this.success = standardisationresponsedetailsaction.success;
                    this._isTotalMarksViewSelected = standardisationresponsedetailsaction.isTotalMarksViewSelected;
                    if (this.success) {
                        this._selectedStandardisationSetupWorkList = standardisationresponsedetailsaction.standardisationWorklistType;
                        this._markSchemeGroupId = standardisationresponsedetailsaction.markSchemeGroupId;
                        this.updateSortCollection();
                        // Grouping responses based on classification type.
                        this._standardisationSetUpResponsedetails = standardisationresponsedetailsaction.StandardisationResponseDetails;
                        this.emit(StandardisationSetupStore.STANDARDISATION_RESPONSE_DATA_UPDATED_EVENT,
                            this.isTotalMarksViewSelected, this.selectedStandardisationSetupWorkList, this._doMarkNow);
                    }
                    break;
                case actionType.RESPONSE_CLOSE:
                    let isScriptClosed: boolean = (action as responseCloseAction).getIsResponseClose;
                    if (isScriptClosed) {
                        this._selectedResponseId = undefined;
                    }
                    break;
                case actionType.STANDARDISATION_SETUP_PERMISSION_CC_DATA_GET_ACTION:
                    let stdSetupPermissionDataGetAction = (action as stdSetupPermissionCCDataAction);
                    this.stdSetupPremissionCCData = stdSetupPermissionHelper.
                        getSTDSetupPermissionByExaminerRole(stdSetupPermissionDataGetAction.examinerRole,
                            stdSetupPermissionDataGetAction.markSchemeGroupId);
                    this._restrictSSUTargetsCCData = markSchemeGroupHelper.getRestrictedStandardisationSetupTargets(
                        stdSetupPermissionDataGetAction.markSchemeGroupId);
                    break;
                case actionType.SETSCROLL_WORKLISTCOLUMNS_ACTION:
                    // set scroll on window resize and align the grid.
                    this.emit(StandardisationSetupStore.SETSCROLL_WORKLIST_COLUMNS_EVENT);
                    break;
                case actionType.STANDARDISATION_SELECTTOMARK_POPUP:
                    let stdSetupPopupAction = (action as selectToMarkPopupAction);
                    // Open the popup on click select to mark before moving as provisional
                    this.emit(StandardisationSetupStore.POPUP_OPEN_SELECT_TO_MARK_BUTTON_EVENT, stdSetupPopupAction.popupType,
                        stdSetupPopupAction.provisionalQigDetailsData);
                    break;
                case actionType.CREATE_STANDARDISATION_RIG:
                    let createStandardisationRigAction = (action as createStandardisationRigAction);
                    let errorInRigCreation: boolean = createStandardisationRigAction.createdStandardisationRIGDetails.
                        createStandardisationRIGReturnDetails.filter(
                            x => x.createRigError === enums.CreateRigError.RigAllocated).count() > 0;
                    this._doMarkNow = !errorInRigCreation ? createStandardisationRigAction.isDoMarkNow : false;
                    if (!errorInRigCreation) {
                        this._createStandardisationRIGReturnData =
                            createStandardisationRigAction.createdStandardisationRIGDetails.createStandardisationRIGReturnDetails.filter(
                                x => x.markSchemeGroupId === this.markSchemeGroupId).first();
                    }
                    this._failedMarkSchemeGroupNames = undefined;
                    createStandardisationRigAction.createdStandardisationRIGDetails.createStandardisationRIGReturnDetails.filter(
                        x => x.createRigError === enums.CreateRigError.RigAllocated).map((item: createStandardisationRIGReturnData) => {
                            this._failedMarkSchemeGroupNames = (this._failedMarkSchemeGroupNames) ?
                                this._failedMarkSchemeGroupNames + ',' + item.markSchemeGroupName : item.markSchemeGroupName;
                        });
                    // Open the popup on click select to mark before moving as provisional
                    this.emit(StandardisationSetupStore.STANDARDISATION_RIG_CREATED_EVENT, errorInRigCreation, this._doMarkNow);
                    break;
                case actionType.TAG_UPDATE:
                    let tagUpdateAction = (action as tagUpdateAction);
                    if (tagUpdateAction.success) {
                        this._markingMode = tagUpdateAction.markingMode;
                        this.updateTagId(tagUpdateAction.tagId, tagUpdateAction.tagOrder, tagUpdateAction.markGroupId);
                        this.emit(StandardisationSetupStore.TAG_UPDATED_EVENT, tagUpdateAction.tagId, tagUpdateAction.markGroupId);
                    }
                    break;
                case actionType.UPDATE_SELECTTOMARK_HELPER_MESSAGE_VISIBILITY:
                    this._isSelectToMarkHelperMessageVisible = (action as updateBlueHelperMessageVisibilityAction)
                        .isHelperMessageVisible;
                    break;
                case actionType.STANDARDISATION_DECLASSIFY_POPUP:
                    let declassifyPopupOpenAction = (action as stdDeclassifyPopupOpenAction);
                    this.emit(StandardisationSetupStore.POPUP_OPEN_DECLASSIFY_POPUP_EVENT,
                        declassifyPopupOpenAction.declassifiedResponseDetails
                    );
                    break;
                case actionType.QIGSELECTOR:
                    this._selectedCentreId = undefined;
                    this._selectedCentreIdFromWorklist = undefined;
                    this._selectedCentrePartId = undefined;
                    this._standardisationCentreList = undefined;
                    this._standardisationScriptList = undefined;
                    break;
                case actionType.COMPLETE_STANDARDISATION_SETUP:
                    let completeStandardisationSetupAction = (action as completeStandardisationSetupAction);
                    this._completeStandardisationSetupSuccess = completeStandardisationSetupAction.
                        completeStandardisationSetupReturnDetails.completeStandardisationValidation;
                    this.emit(StandardisationSetupStore.COMPLETE_STANDARDISATION_SETUP_EVENT,
                    );
                    break;
                case actionType.STANDARDISATION_DECLASSIFY_RESPONSE:
                    let declassifyResponseAction = (action as stdDeclassifyResponseAction);

                    // if successfully declassifed.
                    if (declassifyResponseAction.isDeclassifiedResponse) {
                        this.emit(StandardisationSetupStore.DECLASSIFY_RESPONSE_EVENT);
                    }
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_ERROR_POPUP:
                    let reclassifyErrorPopupOpenAction = (action as stdReclassifyErrorPopupOpenAction);
                    if (reclassifyErrorPopupOpenAction.isReclassifyActionCanceled) {
                        this.emit(StandardisationSetupStore.REJECTED_RECLASSIFY_ACTION_EVENT);
                    } else if (!reclassifyErrorPopupOpenAction.isReclassify) {
                        this.emit(StandardisationSetupStore.POPUP_OPEN_REORDER_ERROR_POPUP_EVENT, reclassifyErrorPopupOpenAction.displayId);
                    } else {
                        this.emit(StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_ERROR_POPUP_EVENT);
                    }
                    break;
                case actionType.MOUSE_POSITION_UPDATE:
                    let updateMousePositionAction: updateMousePositionAction = action as updateMousePositionAction;
                    this._mousePosition = updateMousePositionAction.mousePosition;
                    this.emit(StandardisationSetupStore.UPDATED_MOUSE_POSITION_CLASSIFY_GRID);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_POPUP:
                    let reclassifyPopupOpenAction = (action as stdReclassifyPopupOpenAction);
                    this._reclassifiedResponseDetails = reclassifyPopupOpenAction.reclassifiedResponseDetails;
                    this.emit(StandardisationSetupStore.POPUP_OPEN_RECLASSIFY_POPUP_EVENT, this._reclassifiedResponseDetails);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_RESPONSE:
                    let reclassifyResponseAction = (action as reclassifyResponseAction).reclassifiedResponseDetails;
                    this.success = (action as reclassifyResponseAction).success;

                    if (this.success) {
                        this.emit(StandardisationSetupStore.RECLASSIFIED_RESPONSE_EVENT);
                    }
                    break;
                case actionType.STANDARDISATION_REORDER_RESPONSE:
                    let reorderResponseAction = (action as reorderResponseAction).reorderResponseDetails;
                    this.success = (action as reorderResponseAction).success;
                    if (this.success) {
                        this.emit(StandardisationSetupStore.REORDERED_RESPONSE_EVENT);
                    }
                    break;
                case actionType.UPDATE_HIDE_RESPONSE_STATUS:
                    let updateHideResponseStatusAction = (action as updateHideResponseStatusAction);
                    this.updateHiddenResponseStatus(updateHideResponseStatusAction.UpdatedResponseDisplayId,
                        updateHideResponseStatusAction.UpdatedResponseHiddenStatus);
                    this.emit(StandardisationSetupStore.RENDER_PREVIOUS_SESSION_GRID_EVENT);
                    break;
                case actionType.HIDE_REUSE_TOGGLE_ACTION:
                    let hideReuseToggleAction = (action as hideReuseToggleAction);
                    this._isshowHiddenResponsesSelected = hideReuseToggleAction.ShowHiddenResponseSelected;
                    this.emit(StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE);
                    break;
                case actionType.STANDARDISATION_RECLASSIFY_MULTI_OPTION_POPUP:
                    let reclassifyMutliOptionPopupOpenAction = (action as stdReclassifyMultiOptionPopupOpenAction);
                    this._isClassifiedFromUnclassifiedResponse = reclassifyMutliOptionPopupOpenAction.isFromResponse;
                    this._classifyResponseMarkGroupId = reclassifyMutliOptionPopupOpenAction.reclassifiedEsMarkGroupId;

                    this.emit(StandardisationSetupStore.MULTI_OPTION_POPUP_OPEN_RECLASSIFY_POPUP_EVENT,
                        reclassifyMutliOptionPopupOpenAction.reclassifiedEsMarkGroupId);
                    break;
                case actionType.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE:
                    let copymarksandannotationasdefinitive = (action as copymarksandannotationasdefinitiveaction).isCopyMarkAsDefinitive;
                    this.updateMarkAsDefinitiveFlag();
                    this.emit(StandardisationSetupStore.COPY_MARKS_AND_ANNOTATIONS_AS_DEFINITIVE_EVENT, copymarksandannotationasdefinitive);
                    break;
                case actionType.SAVE_NOTE_ACTION:
                    let saveNoteAction = (action as saveNoteAction);
                    let esMarkGroupId = saveNoteAction.esMarkGroupID;
                    let currentNote = saveNoteAction.note;
                    let currentRowVersion = saveNoteAction.rowVersion;
                    let saveNoteErrorCode = saveNoteAction.saveNoteErrorCode;
                    this.updateCurrentNote(esMarkGroupId, currentNote, currentRowVersion);
                    this.emit(StandardisationSetupStore.SAVE_NOTE_COMPLETED_ACTION_EVENT, saveNoteErrorCode);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_FILTER:
                    this._standardisationCentreScriptFilterDetails
                        = (action as standardisationCentreScriptFilterAction).getStandardisationCentreScriptFilterDetails;
                    this.emit(StandardisationSetupStore.SET_SSU_TABLE_WRAPPER_MARGIN_AND_STYLE);
                    break;
                case actionType.CONTAINER_CHANGE_ACTION:
                    let _loadContainerAction = (action as loadContainerAction);
                    this._previousContainerPage = this._containerPage;
                    this._containerPage = _loadContainerAction.containerPage;
                    break;
                case actionType.DISCARD_STANDARDISATION_RESPONSE:
                    let updateResponseAction = action as discardStandardisationResponseAction;

                    // If the current response has already been discarded, show popup and navigate to worklist
                    // Else, move to next available response
                    if (updateResponseAction.discardStandardisationResponseReturnDetails.discardProvisionalResponseErrorCode ===
                        enums.DiscardProvisionalResponseErrorCode.AlreadyDiscarded) {
                        this.emit(StandardisationSetupStore.RESPONSE_ALREADY_DISCARDED_EVENT);
                    } else {
                        let isNextResponseAvailable = this.isNextResponseAvailable(updateResponseAction.displayId.toString());
                        this.emit(StandardisationSetupStore.DISCARD_STANDARDISATION_RESPONSE_ACTION_COMPLETED_EVENT,
                            isNextResponseAvailable);
                    }
                    break;
                case actionType.SET_REMEMBER_QIG:
                    let _setRememberQigAction = action as setRememberQigAction;
                    if (_setRememberQigAction.rememberQig.area === enums.QigArea.StandardisationSetup) {
                        this._selectedStandardisationSetupWorkList = _setRememberQigAction.rememberQig.standardisationSetupWorklistType;
                    }
                    break;
                case actionType.STANDARDISATION_SHARE_RESPONSE_POPUP:
                    let shareResponsePopupConfirmAction = action as shareResponsePopupDisplayAction;
                    this.emit(StandardisationSetupStore.STANDARDISATION_SHARE_RESPONSE_POPUP_DISPLAY,
                        shareResponsePopupConfirmAction.sharedResponseDetails, shareResponsePopupConfirmAction.isSharedFromMarkScheme);
                    break;
                case actionType.STANDARDISATION_SETUP_SCRIPT_METADATA_FETCH_ACTION:
                    let fetchStandardisationSetupMetadataAction = action as standardisationSetupScriptMetadataFetchAction;
                    this.emit(StandardisationSetupStore.STANDARDISATION_SETUP_SCRIPT_METADATA_FETCH_EVENT,
                        fetchStandardisationSetupMetadataAction.getMarkschemeGroupId,
                        fetchStandardisationSetupMetadataAction.getQuestionPaperPartId);
                    break;
                case actionType.STANDARDISATION_CLASSIFY_RESPONSE_ACTION:
                    let classifyResponseAction = (action as classifyResponseAction).classifiedResponseDetails;

                    if (classifyResponseAction) {
                        this._standardisationSetUpResponsedetails.standardisationResponses.filter(
                            x => x.markingModeId === classifyResponseAction.markingModeId &&
                                classifyResponseAction.markingModeId !== enums.MarkingMode.Seeding).forEach(
                                    res =>
                                        res.rigOrder =
                                        (res.rigOrder >= classifyResponseAction.rigOrder) ? res.rigOrder + 1 : res.rigOrder);
                        this._standardisationSetUpResponsedetails.standardisationResponses.filter(
                            x => x.markingModeId === classifyResponseAction.previousMarkingModeId &&
                                classifyResponseAction.previousMarkingModeId !== enums.MarkingMode.Seeding).forEach(
                                    res =>
                                        res.rigOrder =
                                        (res.rigOrder > classifyResponseAction.oldRigOrder) ? res.rigOrder - 1 : res.rigOrder);
                        this._standardisationSetUpResponsedetails.standardisationResponses.filter(
                            x => x.displayId === classifyResponseAction.displayId).first().markingModeId =
                            classifyResponseAction.markingModeId;

                        this._standardisationSetUpResponsedetails.standardisationResponses.filter(
                            x => x.displayId === classifyResponseAction.displayId).first().rigOrder =
                            classifyResponseAction.rigOrder;

                        // Update classification list on classify
                        this.updateUnclassifiedWorklistOnClassify(classifyResponseAction.markingModeId);
                        this.emit(StandardisationSetupStore.CLASSIFY_RESPONSE_EVENT, this._isClassifiedFromUnclassifiedResponse,
                            classifyResponseAction.markingModeId,
                            this._classifyResponseMarkGroupId);
                    }
                    break;
                case actionType.CONCURRENT_SAVE_FAILED:
                    let _concurrentsavefailedaction = (action as concurrentSaveFailInStmPopupAction);
                    this.emit(StandardisationSetupStore.CONCURRENT_SAVE_FAIL_EVENT, _concurrentsavefailedaction.area);
					break;
				case actionType.USER_OPTION_SAVE:
					let onScreenHintUseroptionSaveAction = (action as userOptionSaveAction).getSavedUserOption.userOptions.filter(
						x => x.userOptionName === userOptionKeys.ON_SCREEN_HINTS);
					if (onScreenHintUseroptionSaveAction) {
						this._isSelectToMarkHelperMessageVisible = onScreenHintUseroptionSaveAction.first().value === 'true';
					}
                    break;
                case actionType.REUSE_RIG_POPUP_DISPLAY_ACTION:
                    let reuseRigPopupOpenAction = action as reuseRigActionPopDisplayAction;
                    let displayId = reuseRigPopupOpenAction.getDisplayId;
                    this.emit(StandardisationSetupStore.REUSE_RIG_POPUP_DISPLAY_ACTION_EVENT, displayId);
                    break;
                case actionType.REUSE_RIG_ACTION:
                    let reuseRigAction = action as reuseRigAction;
                    let markGroupId = reuseRigAction.getReusedMarkGroupId;
                    let markingModeId = reuseRigAction.getReusedMarkingModeId;
                    this.updateCollectionAndCountOnReuseRigActionComplete(markGroupId, markingModeId);
                    this.emit(StandardisationSetupStore.REUSE_RIG_ACTION_COMPLETED_EVENT);
                    break;
                case actionType.DISCARD_STD_SETUP_RESPONSE_REMOVE_ACTION:
                    let updateStdResponseCollectionAction = action as updateStdResponseCollectionAction;
                    this.clearResponseDetailsByMarkGroupId(updateStdResponseCollectionAction.esMarkGroupID);
                    break;
                case actionType.STANDARDISATION_SETUP_HISTORY_INFO:
                    let historyInfo = action as standardisationSetupHistoryInfoAction;
                    this._selectedStandardisationSetupWorkList =
                        historyInfo.historyItem.standardisationSetup.standardisationSetupWorklistType;
                    break;
            }
        });
    }

    /**
     * Clear Provisional response from Standardisation response list
     */
    public clearResponseDetailsByMarkGroupId(esMarkGroupId: Number) {
        let index = 0;

        //removing response from collection.
        this.standardisationSetUpResponsedetails.standardisationResponses.map((response: ResponseBase) => {
            if (response.esMarkGroupId === esMarkGroupId) {
                this.standardisationSetUpResponsedetails.standardisationResponses
                    = this.standardisationSetUpResponsedetails.standardisationResponses.remove(index);
            }
            index++;
        });
    }

    /**
     * This method will return the current mouse position, (0,0) if undefined.
     */
    public get mousePosition(): mousePosition {
        if (this._mousePosition) {
            return this._mousePosition;
        } else {
            return new mousePosition(0, 0);
        }
    }

    /*
     * returns whether the select to mark helper message is visible or not.
     */
    public get isSelectToMarkHelperVisible(): boolean {
        return this._isSelectToMarkHelperMessageVisible;
    }

    /**
     * get scriptlist for the selected centre
     */
    public get standardisationScriptList(): StandardisationScriptDetailsList {
        return this._standardisationScriptList;
    }

    /**
     * Set candidate script details against a centre
     */
    public setCandidateScriptDetailsAgainstCentre(isNavigationScenario: boolean = false): void {

        if (this._standardisationScriptList &&
            this._standardisationScriptList.centreScriptList &&
            this._standardisationScriptList.centreScriptList !== undefined &&
            this._standardisationScriptList.centreScriptList.count() > 0) {
            this._standardisationScriptList.centreScriptList.forEach((script: StandardisationScriptDetails) => {
                if (isNavigationScenario) {
                    this._candidateScriptDetailsAgainstCentreInResponseNavigation = [];
                    this._candidateScriptDetailsAgainstCentreInResponseNavigation.push(
                        {
                            candidateScriptId: script.candidateScriptId,
                            documentId: script.documentId
                        });
                } else {
                    this._candidateScriptDetailsAgainstCentre = [];
                    this._candidateScriptDetailsAgainstCentre.push(
                        {
                            candidateScriptId: script.candidateScriptId,
                            documentId: script.documentId
                        });
                }
            });
        }
    }

    /**
     * Get candidate script details against a centre
     */
    public get getCandidateScriptDetailsAgainstCentre(): any[] {
        return this._candidateScriptDetailsAgainstCentre;
    }

    /**
     * Returns the selected centre part id.
     */
    public get selectedCentrePartId(): number {
        return this._selectedCentrePartId ? this._selectedCentrePartId : 0;
    }

    /**
     * Returns the selected centre part id.
     */
    public get selectedCentreId(): number {
        return this._selectedCentreIdFromWorklist ? this._selectedCentreIdFromWorklist : 0;
    }

    /**
     * Returns the selected script contains additional page.
     */
    public get hasAdditionalPage(): boolean {
        let script = this.fetchSelectedScriptDetails(this._selectedResponseId);
        this._hasAdditionalPage = false;
        if (script && script.hasAdditionalObjects) {
            this._hasAdditionalPage = true;
        }
        return this._hasAdditionalPage;
    }

    /**
     * Returns the script detail, of the selected candidate script.
     * @param candidateScriptId
     */
    public fetchSelectedScriptDetails(candidateScriptId?: number): StandardisationScriptDetails {
        let id: number;
        id = candidateScriptId ? candidateScriptId : this._selectedResponseId;
        let result: StandardisationScriptDetails;
        if (this._standardisationScriptList) {
            this._standardisationScriptList.centreScriptList.forEach(
                (script: StandardisationScriptDetails) => {
                    if (script.candidateScriptId === id) {
                        result = script;
                    }
                });
        }
        return result;
    }

    /**
     * Returns the selected candidate script identifier.
     */
    public get selectedResponseId(): number {
        return this._selectedResponseId;
    }

    /**
     * select script available status from SSU centre script list
     */
    public get selectedScriptAvailable(): boolean {
        return this._selectedScriptAvailable;
    }

    /**
     * Returns the current state of left collapsible panel
     */
    public get isStandardisationLeftPanelCollapsed(): boolean {
        return this._isLeftPanelCollapsed;
    }

    /**
     * Returns the current selected standardisationsetup Left Link
     */
    public get selectedStandardisationSetupWorkList(): enums.StandardisationSetup {
        return this._selectedStandardisationSetupWorkList;
    }

    /**
     * Returns the current selected tab in select response worklist
     */
    public get selectedTabInSelectResponse(): enums.StandardisationSessionTab {
        return this._selectedTabInSelectResponse;
    }

    /**
     * Returns the current selected standardisationsetup left panel details (counts for targets)
     */
    public get standardisationTargetDetails(): standardisationTargetDetails {
        return this._standardisationTargetDetailsList;
    }

    /**
     * Returns the classification summary target details
     */
    public get classificationSummaryTargetDetails(): Immutable.List<standardisationTargetDetail> {
        return this._standardisationTargetDetailsList.standardisationTargetDetails;
    }

    /**
     * Returns the current markscheme group id
     */
    public get markSchemeGroupId(): number {
        return this._markSchemeGroupId;
    }

    /**
     * Returns the current examiner role id
     */
    public get examinerRoleId(): number {
        return this._examinerRoleId;
    }

    /**
     * returns the position, of the selected/ passed centreId.
     * @param centreId
     */
    public selectedCentrePosition(centreId?: number): number {
        let centreIdentifier: number = centreId ? centreId : this._selectedCentreIdFromWorklist;
        let index: number = 0;
        let result: number;
        this._standardisationCentreList.centreList.forEach((
            centre: StandardisationCentreDetails) => {
            index++;
            if (centre.uniqueId === centreIdentifier) {
                result = index;
            }
        });
        return result;
    }

    /**
     * Returns the position of the selected candidate script.
     */
    public get candidateScriptPosition(): number {
        let index: number = 0;
        let result: number;
        this.getFilteredStdCentreScriptDetailsListInSortOrder().forEach(
            (script: StandardisationScriptDetails) => {
                index++;
                if (script.candidateScriptId === this._selectedResponseId) {
                    result = index;
                }
            });
        return result;
    }

    /**
     * Returns true, if the classify action is from unclassified response.
     */
    public get isClassifiedFromUnclassifiedResponse(): boolean {
        return this._isClassifiedFromUnclassifiedResponse;
    }

    /**
     * Returns true, if next script is available for navigation.
     */
    public get isNextCandidateScriptAvailable(): boolean {
        if (this.isLastCentre) {
            return (this.candidateScriptPosition < this.totalCandidateScriptCount);
        } else {
            return true;
        }
    }

    /**
     * Returns true, if previous response is available for navigation.
     */
    public get isPreviousCandidateScriptAvailable(): boolean {
        if (this.isFirstCentre) {
            return this.candidateScriptPosition > 1;
        } else {
            return true;
        }
    }

    /**
     * Returns the count, of the candidate script available for the selected centre.
     */
    public get totalCandidateScriptCount(): number {
        return this.getFilteredStdCentreScriptDetailsListInSortOrder().count();
    }

    /**
     * Returns the candidate script identifier, for the next candidate script.
     */
    public get nextCandidateScript(): number {
        let position: number = this.candidateScriptPosition;
        let script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[position];
        if (script != null) {
            return script.candidateScriptId;
        }
    }

    /**
     * Returns true, if the next response is available for navigation
     */
    public get isNextScriptAvailableForNavigation(): boolean {
        return this.candidateScriptPosition < this.totalCandidateScriptCount;
    }

    /**
     * Returns true, if the previous response is available for navigation.
     */
    public get isPreviousScriptAvailableForNavigation(): boolean {
        return (this.candidateScriptPosition > 1);
    }

    /**
     * Returns the candidate script identifier, for the previous candidate script.
     */
    public get previousCandidateScript(): number {
        let position: number = this.candidateScriptPosition;
        let script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[position - 2];
        if (script != null) {
            return script.candidateScriptId;
        }
    }

    /**
     * Returns the candidate script identifier, of the first script in the sorted collection.
     */
    public get firstCandidateScript(): number {
        let script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[0];
        if (script != null || script !== undefined) {
            return script.candidateScriptId;
        }
    }

    /**
     * Returns the candidate script identifier, of the last script in the sorted collection.
     */
    public get lastCandidateScript(): number {
        let script = this.getFilteredStdCentreScriptDetailsListInSortOrder().toArray()[this.totalCandidateScriptCount - 1];
        if (script != null || script !== undefined) {
            return script.candidateScriptId;
        }
    }

    /**
     * Returns the standardisation centre list
     */
    public get standardisationCentreList(): StandardisationCentreDetailsList {
        return this._standardisationCentreList;
    }

    /** 
     * Returns the standardisation set up details
     */
    public get standardisationSetupDetails(): StandardisationSetupDetailsList {
        let details: StandardisationSetupDetailsList = {
            standardisationCentreDetailsList: this.standardisationCentreList,
            standardisationScriptDetailsList: this.standardisationScriptList
        };
        return details;
    }

    /**
     * Returns the standardisation response details
     */
    public get standardisationSetUpResponsedetails(): StandardisationSetupResponsedetailsList {
        if (this._standardisationSetUpResponsedetails) {
            return this._standardisationSetUpResponsedetails;
        }
    }

	/**
	 * Returns the response data for the standardisation response like unclassified
	 * @param responseId response Id for the standardisation response
	 */
    public fetchStandardisationResponseData(responseId?: number): StandardisationResponseDetails {
        let id: number = responseId ? responseId : this._selectedResponseId;
        let result: StandardisationResponseDetails;
        if (this._standardisationSetUpResponsedetails) {
            this._standardisationSetUpResponsedetails.standardisationResponses.forEach((x: StandardisationResponseDetails) => {
                if (String(id) === x.displayId) {
                    result = x;
                }
            });
        }
        return result;
    }

    /**
     * set the default sort order for standardisation worklists
     * @param standardisationSetup
     * @param scriptType
     */
    private setDefaultSortOrder(standardisationSetup: enums.StandardisationSetup, centreOrScriptOrReuse: string): comparerlist {
        switch (standardisationSetup) {
            case enums.StandardisationSetup.SelectResponse:
                if (centreOrScriptOrReuse === 'Script') {
                    return comparerlist.stdScriptIdComparer;
                } else if (centreOrScriptOrReuse === 'Reuse') {
                    return comparerlist.marksComparer;
                } else {
                    return comparerlist.centreComparer;
                }
            case enums.StandardisationSetup.UnClassifiedResponse:
                return comparerlist.updatedDateComparer;
            case enums.StandardisationSetup.ClassifiedResponse:
                return comparerlist.classifiedResponseComparer;
            case enums.StandardisationSetup.ProvisionalResponse:
                return comparerlist.updatedDateComparer;
        }
    }

    /**
     * update the response sort collection
     * @param standardisationSetup
     * @param scriptType
     */
    private updateResponseSortCollection(standardisationSetup: enums.StandardisationSetup,
        centreOrScriptOrReuse?: string): void {

        let defaultSortDetail: comparerlist = this.setDefaultSortOrder(standardisationSetup, centreOrScriptOrReuse);

        let sortDetails: standardisationsortdetails = {
            qig: this.markSchemeGroupId,
            comparerName: defaultSortDetail,
            sortDirection: enums.SortDirection.Ascending,
            selectedWorkList: standardisationSetup,
            centreOrScriptOrReuse: centreOrScriptOrReuse
        };

        let entry = this._standardisationSortDetails.filter((x: standardisationsortdetails) =>
            x.selectedWorkList === standardisationSetup &&
            x.centreOrScriptOrReuse === centreOrScriptOrReuse &&
            x.qig === this.markSchemeGroupId);
        if (entry.length === 0) {
            this._standardisationSortDetails.push(sortDetails);
        }
    }

    /**
     * retrieve the sort deatils for standardisation.
     */
    public get standardisationSortDetails() {
        return this._standardisationSortDetails;
    }

    /**
     * selected centre number in standardisation setup
     */
    public get standardisationSetUpSelectedCentreNo() {
        let selectedCentrePartId: number = this.selectedCentrePartId;
        let centreNo: string;
        if (this._standardisationCentreList) {
            this._standardisationCentreList.centreList.forEach((x: StandardisationCentreDetails) => {
                if (x.centrePartId === selectedCentrePartId) {
                    centreNo = x.centreNumber;
                }
            });
        }
        return centreNo;
    }

    /**
     * standardisationSetup SelectedCentre Part Id
     * @param centreId 
     */
    public standardisationSetupSelectedCentrePartId(centreId: number) {
        let centrePartId: number;
        if (this._standardisationCentreList) {
            this._standardisationCentreList.centreList.forEach((x: StandardisationCentreDetails) => {
                if (x.uniqueId === centreId) {
                    centrePartId = x.centrePartId;
                }
            });
        }
        return centrePartId;
    }

    /**
     * returns whether is total marks view selected
     */
    public get isTotalMarksViewSelected(): boolean {
        return this._isTotalMarksViewSelected;
    }

    /**
     * Gets data in standardisation setup permission cc.
     */
    public get stdSetupPermissionCCData(): stdSetupPermissionData {
        return this.stdSetupPremissionCCData;
    }

    /**
     * gets the reuse rig details list
     */
    public get standardisationSetupReusableDetailsList(): Immutable.List<StandardisationResponseDetails> {
        return this._standardisationSetupReusableDetailsList;
    }

    /**
     * Update Reused flag when reuse rig action completed
     * @param displayId
     */
    public updateCollectionAndCountOnReuseRigActionComplete(markGroupId: number, markingModeId: enums.MarkingMode) {
        this._standardisationSetupReusableDetailsList.map((x: StandardisationResponseDetails) => {
            if (x.esMarkGroupId === markGroupId) {
                x.reUsedQIG = true;
            }
        });

        if (markingModeId === enums.MarkingMode.PreStandardisation) {
            this._standardisationTargetDetailsList.unclassifiedCount++;
        } else {
            this._standardisationTargetDetailsList.classifiedCount++;
            this._standardisationTargetDetailsList.standardisationTargetDetails.filter(
                x => x.markingModeId === markingModeId).first().count++;
        }
    }

    /**
     * Check Marking mode target set fore this QIG
     */
    public checkMarkingModeTargetExistForThisQIG(markingModeId: enums.MarkingMode) {
        let count: number = 0;
        let target = this._standardisationTargetDetailsList.standardisationTargetDetails.
            find(x => x.markingModeId === markingModeId);
        if (target != null || target !== undefined) {
            return true;
        }

        return false;
    }

    /**
     * gets the details list of reuse rigs based on Hide Response Status
     */
    public reusableDetailsListBasedOnHiddenStatus(isShowHiddenResponsesOn: boolean): Immutable.List<StandardisationResponseDetails> {
        let notHiddenReusableDetailsList: Immutable.Iterable<number, StandardisationResponseDetails>;
        if (this._standardisationSetupReusableDetailsList !== undefined) {
            if (isShowHiddenResponsesOn) {
                return this._standardisationSetupReusableDetailsList;
            } else {
                notHiddenReusableDetailsList = this._standardisationSetupReusableDetailsList.filter((x: StandardisationResponseDetails) =>
                    x.hidden !== true
                );

                return Immutable.List<StandardisationResponseDetails>(notHiddenReusableDetailsList);
            }
        }
    }

	/**
	 * to update the standardisation response data with tag id once the tag is updated/deleted
	 * @param tagId
	 * @param tagOrder
	 * @param esMarkGroupId
	 */
    private updateTagId(tagId: number, tagOrder: number, esMarkGroupId: number): void {
        this.standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.esMarkGroupId === esMarkGroupId).first().tagId = tagId;
        this.standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.esMarkGroupId === esMarkGroupId).first().tagOrder = tagOrder;
    }


    /**
     * Get Hidden Worklists for current examiner role.
     */
    public getHiddenWorklists(): Immutable.List<enums.MarkingMode> {

        // check whether standardisation set up permission cc data configured.
        // and get the classification type that needs to hide.
        if (this.stdSetupPermissionCCData) {
            let classifications =
                this.stdSetupPermissionCCData.role.viewByClassification.classifications;
            let hiddenStdWorklists: Immutable.List<enums.MarkingMode> =
                Immutable.List([classifications.practice ? enums.MarkingMode.None : enums.MarkingMode.Practice]);
            hiddenStdWorklists = Immutable.List<enums.MarkingMode>(
                hiddenStdWorklists.concat(classifications.standardisation ?
                    enums.MarkingMode.None : enums.MarkingMode.Approval));
            hiddenStdWorklists = Immutable.List<enums.MarkingMode>(
                hiddenStdWorklists.concat(classifications.seeding ? enums.MarkingMode.None : enums.MarkingMode.Seeding));
            hiddenStdWorklists = Immutable.List<enums.MarkingMode>(
                hiddenStdWorklists.concat(classifications.stmStandardisation ?
                    enums.MarkingMode.None : enums.MarkingMode.ES_TeamApproval));
            hiddenStdWorklists = Immutable.List<enums.MarkingMode>(
                hiddenStdWorklists.filter((x) => x !== enums.MarkingMode.None));
            return hiddenStdWorklists;
        }
        return undefined;
    }

    /**
     * Gets data in RestrictStandardisationSetupTargets CC.
     */
    public get restrictSSUTargetsCCData(): Immutable.List<enums.MarkingMode> {
        return this._restrictSSUTargetsCCData;
    }

    /**
     * This will return the current worklist response count
     */
    public get currentWorklistResponseCount(): number {
        return this.selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession
            ? Immutable.List<StandardisationResponseDetails>
                (this.reusableDetailsListBasedOnHiddenStatus(this._isshowHiddenResponsesSelected)).count() :
            Immutable.List<StandardisationResponseDetails>
                (this.standardisationSetUpResponsedetails.standardisationResponses).count();
    }

	/**
	 * get Response Details
	 * @param {string} displayID 
	 * @returns {ResponseBase} 
	 * @memberof StandardisationSetupStore
	 */
    public getResponseDetails(displayID: string): ResponseBase {
        if (this.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
            && this.selectedTabInSelectResponse === enums.StandardisationSessionTab.CurrentSession) {
            let response = Immutable.List<StandardisationScriptDetails>(this.standardisationScriptList.centreScriptList.filter(
                (response: ResponseBase) => response.candidateScriptId.toString() === displayID));
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the base values.
                return (response.first() as ResponseBase);
            }
        }

        if (this.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
            && this.selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession) {
            return this.getReusableResponseDetails(displayID);
        }

        // Check the display Id exists in the list
        if (this.standardisationSetUpResponsedetails && this.standardisationSetUpResponsedetails.standardisationResponses) {
            let response = Immutable.List<StandardisationResponseDetails>
                (this.standardisationSetUpResponsedetails.standardisationResponses.filter(
                    (response: ResponseBase) => response.displayId === displayID));
            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the base values.
                return (response.first() as ResponseBase);
            }
        }
        // no data found for the disply id.
        return null;
    }

    /**
     * Get Reusable response details
     */
    public getReusableResponseDetails(displayID: string) {
        if (this._standardisationSetupReusableDetailsList != null) {
            let response = Immutable.List<StandardisationResponseDetails>(
                this.reusableDetailsListBasedOnHiddenStatus(this._isshowHiddenResponsesSelected)
                    .filter((x: StandardisationResponseDetails) =>
                        x.displayId.toString() === displayID));
            return (response.first());
        }
        return null;
    }

    /**
     * Get Script Id 
     */
    public getReusablaResponseSelectedDisplayId(displayID: string) {
        if (this._standardisationSetupReusableDetailsList != null) {
            let response = Immutable.List<StandardisationResponseDetails>(
                this.reusableDetailsListBasedOnHiddenStatus(this._isshowHiddenResponsesSelected)
                    .filter((x: StandardisationResponseDetails) =>
                        x.displayId.toString() === displayID));
            return (response.first().candidateScriptId);
        }
        return null;
    }

	/**
	 * get Response Position
	 * @param {string} displayId 
	 * @returns {number} 
	 * @memberof StandardisationSetupStore
	 */
    public getResponsePosition(displayId: string): number {
        let responseList = Immutable.List<StandardisationResponseDetails>(
            this.getCurrentWorklistResponseBaseDetailsInSortOrder());
        let response: any = responseList.find((x: ResponseBase) => x.displayId.toString() === displayId);
        if (response != null || response !== undefined) {
            return responseList.indexOf(response) + 1;
        }
    }

	/**
	 * Returns whether next response is available or not
	 * @param {string} displayId 
	 * @returns {boolean} 
	 * @memberof StandardisationSetupStore
	 */
    public isNextResponseAvailable(displayId: string): boolean {
        return this.getResponsePosition(displayId) < this.currentWorklistResponseCount;
    }

    /**
     * This will check whether the previous response is exists or not
     */
    public isPreviousResponseAvailable(displayId: string): boolean {
        return this.getResponsePosition(displayId) > 1;
    }

	/**
	 * set Candidate Script Info Collection
	 * @memberof StandardisationSetupStore
	 */
    public set setCandidateScriptInfoCollection(candidateScriptInfo: Immutable.List<candidateScriptInfo>) {
        this.candidateScriptInfoCollection = candidateScriptInfo;
    }

	/**
	 * get Candidate Script Info Collection
	 * @readonly
	 * @type {Immutable.List<candidateScriptInfo>}
	 * @memberof StandardisationSetupStore
	 */
    public get getCandidateScriptInfoCollection(): Immutable.List<candidateScriptInfo> {
        return this.candidateScriptInfoCollection;
    }

	/**
	 * Get the next response id
	 * @param {string} displayId 
	 * @returns {string}
	 * @memberof StandardisationSetupStore
	 */
    public nextResponseId(displayId: string): string {
        let position = this.getResponsePosition(displayId);
        let response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position];
        if (response != null) {
            return response.displayId;
        }
    }

	/**
	 * Get the previous response id
	 * @param {string} displayId 
	 * @returns {string} 
	 * @memberof StandardisationSetupStore
	 */
    public previousResponseId(displayId: string): string {
        let position = this.getResponsePosition(displayId);
        let response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().toArray()[position - 2];
        if (response != null) {
            return response.displayId;
        }
    }

    /**
     * Returns the first response, in the sorted collection.
     */
    public get getIfOfFirstResponse(): string {
        let response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().first();
        if (response != null || response !== undefined) {
            return response.displayId;
        }
    }

    /**
     * Find the Response details for the mark group Id
     * @param markGroupId
     */
    public getResponseDetailsByMarkGroupId(esMarkGroupId: number) {
        // Check the mark group Id exists in the list
        let response: any;
        if (this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
            && this._selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession) {
            response = Immutable.List<StandardisationResponseDetails>(
                this.reusableDetailsListBasedOnHiddenStatus(this._isshowHiddenResponsesSelected)
                    .filter((x: StandardisationResponseDetails) =>
                        x.esMarkGroupId === esMarkGroupId));
            return (response.first() as ResponseBase);
        } else {
            response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().filter(
                (response: ResponseBase) => response.esMarkGroupId === esMarkGroupId
            );
        }

        if (response != null && response !== undefined && response.count() === 1) {
            // If response is found in collection, return the base values.
            return (response.first() as ResponseBase);
        }

        // no data found for the mark group id.
        return null;
    }

    /**
     * Returns the tagId
     * @param {string} displayId 
     * @returns 
     * @memberof StandardisationSetupStore
     */
    public getTagId(displayId: string) {
        let tagId;
        if (this.getCurrentWorklistResponseBaseDetailsInSortOrder()) {
            let response = this.getCurrentWorklistResponseBaseDetailsInSortOrder().filter(
                (response: ResponseBase) => response.displayId === displayId);

            if (response != null && response !== undefined && response.count() === 1) {
                // If response is found in collection, return the ag id
                tagId = response.first().tagId;
            }
        }
        return tagId;
    }

    /**
     * Get Session tab visibilty in SSU
     */
    private get getPreviousSessionTabVisibiltyinSelectResponse(): boolean {
        return (configurableCharacteristicsHelper.getCharacteristicValue(
            configurableCharacteristicsNames.ReuseRIG).toLowerCase() === 'true'
            && this.stdSetupPremissionCCData.role.permissions.reuseResponses);
    }

    /**
     * Get the current worklists Response details in sorted order.
     * @param worklistDetails
     */
    public getCurrentWorklistResponseBaseDetailsInSortOrder(): Immutable.List<StandardisationResponseDetails> {
        if (this.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse &&
            this.selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession) {
            let workListDetails: Immutable.List<StandardisationResponseDetails> = Immutable.List<StandardisationResponseDetails>(
                this.reusableDetailsListBasedOnHiddenStatus(this._isshowHiddenResponsesSelected));
            if (workListDetails !== undefined) {
                this.setDefaultComparer();
                let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

                if (this.isSortingRequired()) {
                    workListDetails = Immutable.List<any>(sortHelper.sort
                        (Immutable.List<StandardisationResponseDetails>(workListDetails).toArray(),
                        comparerlist[_comparerName]));
                } else {
                    workListDetails = Immutable.List<any>(workListDetails);
                }
                return workListDetails ? workListDetails : undefined;
            }
        } else {
            let workListDetails: StandardisationSetupResponsedetailsList = this.standardisationSetUpResponsedetails;
            if (workListDetails !== undefined) {
                this.setDefaultComparer();
                let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';

                if (this.isSortingRequired()) {
                    workListDetails.standardisationResponses = Immutable.List<any>(sortHelper.sort
                        (Immutable.List<StandardisationResponseDetails>(workListDetails.standardisationResponses).toArray(),
                        comparerlist[_comparerName]));
                } else {
                    workListDetails.standardisationResponses = Immutable.List<any>(workListDetails.standardisationResponses);
                }
                return workListDetails ? workListDetails.standardisationResponses : undefined;
            }
        }
    }

    private get comparerName() {
        return this._comparerName;
    }

    private get sortDirection() {
        return this._sortDirection;
    }

    /**
     * Check whether sorting required for this current comparer.
     */
    private isSortingRequired(): boolean {
        return this.comparerName !== comparerlist[comparerlist.tagComparer];
    }

    /**
     * Set the comparer for the current worklist based on the worklisttype,qigId and responseMode
     */
    public setDefaultComparer(centreOrScriptOrReuse?: string) {
        this._comparerName = undefined;
        this._sortDirection = undefined;
        let defaultComparers = this.standardisationSortDetails;
        let selectedStandardisationSetupWorkList: enums.StandardisationSetup = this.selectedStandardisationSetupWorkList;
        let qigId: number = this.markSchemeGroupId;

        let entry: standardisationsortdetails[] = defaultComparers.filter((x: standardisationsortdetails) =>
            x.selectedWorkList === selectedStandardisationSetupWorkList && x.qig === qigId);

        if (this.selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession) {
            centreOrScriptOrReuse = 'Reuse';
        }

        if (centreOrScriptOrReuse) {
            entry = entry.filter((x: standardisationsortdetails) => x.centreOrScriptOrReuse === centreOrScriptOrReuse);
        }

        if (entry.length > 0 && this.isSortingRequired()) {
            this._comparerName = comparerlist[entry[0].comparerName];
            this._sortDirection = entry[0].sortDirection;
        }

    }

    /**
     *  To update the standardisation response data with current note once the note is updated/deleted against that response
     */
    private updateCurrentNote(esMrkGroupId: number, currentNote: string, rowVersion: string) {
        this._standardisationSetUpResponsedetails.standardisationResponses.map((x: StandardisationResponseDetails) => {
            if (x.esMarkGroupId === esMrkGroupId) {
                x.note = currentNote;
                x.noteRowVersion = rowVersion;
            }
        });
    }


    /**
     * gets if the standardisation complete process
     * is successful or not
     */
    public get iscompleteStandardisationSuccess(): boolean {
        return (this._completeStandardisationSetupSuccess === enums.CompleteStandardisationErrorCode.None);
    }

    /**
     * Get the provisional examiner id
     * @param {number} displayId 
     */
    public getProvisionalExaminerId(displayId: number): number {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.displayId === displayId.toString()).first().provisionalExaminerId;
    }

    /**
     * Get the provisional marker surname
     * @param {number} displayId 
     */
    public getProvisionalMarkerSurName(displayId: number): string {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.displayId === displayId.toString()).first().provisionalMarkerSurname;
    }

    /**
     * Get the provisional marker Initials
     * @param {number} displayId 
     */
    public getProvisionalMarkerInitials(displayId: number): string {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.displayId === displayId.toString()).first().provisionalMarkerInitials;
    }

    /**
     * Get candidate script details against a centre.
     */
    public get getCandidateScriptDetailsAgainstCentreOnNavigation(): any[] {
        return this._candidateScriptDetailsAgainstCentreInResponseNavigation;
    }

    /**
     *  Gets the details of response that user tried to re classify.
     */
    public reclassifiedResponseDetails(): updateESMarkGroupMarkingModeData {
        return this._reclassifiedResponseDetails;
    }

    public get createdStandardisationRIGDetails(): createStandardisationRIGReturnData {
        return this._createStandardisationRIGReturnData;
    }

    /**
     * gets if the standardisation complete process
     * is successful or not
     */
    public get isDoMarkNow(): boolean {
        return this._doMarkNow;
    }

    /**
     * Get the current standardisation setup worklist response details.
     */
    public getCurrentWorklistResponseBaseDetails(): Immutable.List<StandardisationResponseDetails> {
        let standardisationWorkListDetails: StandardisationSetupResponsedetailsList = this.standardisationSetUpResponsedetails;
        return standardisationWorkListDetails ? standardisationWorkListDetails.standardisationResponses : undefined;
    }

    /**
     * to update the hidden value of the Reuse RIG Response where we have updated Hide Response Toggle
     * @param hiddenDisplayId
     * @param isActiveStatus
     */
    private updateHiddenResponseStatus(hiddenDisplayId: string, isActiveStatus: boolean): void {
        let selectedReusableDetailsList = Immutable.List<StandardisationResponseDetails>
            (this._standardisationSetupReusableDetailsList.filter((x: StandardisationResponseDetails) =>
                x.displayId === hiddenDisplayId
            ));

        selectedReusableDetailsList.first().hidden = isActiveStatus;
    }

    /**
     * Find the Response details for the es mark group Id
     * @param esMarkGroupId
     */
    public getResponseDetailsByEsMarkGroupIdBasedOnPermission(esMarkGroupId: number) {
        let response: StandardisationResponseDetails =
            this._standardisationSetUpResponsedetails.standardisationResponses.filter(
                (response: StandardisationResponseDetails) => response.esMarkGroupId === esMarkGroupId).first();

        if (response != null && response !== undefined) {
            // If response is found in collection
            return response;
        }

        // no data found for the es mark group id.
        return null;
    }

    /**
     * updates the markAsDefinitiveFlag, on copy marks and annotation as definitive action.
     * @param displayId 
     */
    public updateMarkAsDefinitiveFlag(displayId?: string) {
        let id: string;
        id = displayId ? displayId : this._selectedResponseId.toString();
        if (this._standardisationSetUpResponsedetails) {
            this._standardisationSetUpResponsedetails.standardisationResponses.forEach((x: StandardisationResponseDetails) => {
                if (x.displayId === id) {
                    x.hasDefinitiveMark = true;
                }
            });
        }
    }

	/**
	 * Get the definitive examiner role id
	 * @param displayId
	 */
    public getDefinitiveExaminerRoleId(displayId: number): number {
        return this._standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.displayId === displayId.toString()).first().examinerRoleId;
    }

	/**
	 * Get the definitive examiner role id
	 * @param displayId
	 */
    public getFormattedExaminerName(displayId: number): string {
        return stringFormatHelper.getFormattedExaminerName(this._standardisationSetUpResponsedetails.standardisationResponses.filter(
            x => x.displayId === displayId.toString()).first().provisionalMarkerInitials,
            this._standardisationSetUpResponsedetails.standardisationResponses.filter(
                x => x.displayId === displayId.toString()).first().provisionalMarkerSurname);
    }

    /**
     * Gets standardisation centre script filter details
     */
    public get standardisationCentreScriptFilterDetails(): standardisationCentreScriptFilterDetails {
        return this._standardisationCentreScriptFilterDetails;
    }

    /**
     * Gets filtered standaridsation script list
     * @param filterText
     */
    public getFilteredStdCentreScriptList(filterText: string): StandardisationScriptDetailsList {
        let filteredData = JSON.parse(JSON.stringify(this._standardisationScriptList));
        let filterSearchArray: string[] = filterText.toLowerCase().split(',');
        filteredData.centreScriptList = Immutable.List<StandardisationScriptDetails>(filteredData.centreScriptList
            .filter((scripts: StandardisationScriptDetails) => (scripts.questionItems.toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1) || (scripts.questionItems.toLowerCase().split(',')
                    .some(v => filterSearchArray.indexOf(v) >= 0))));
        return filteredData;
    }

    /**
     * Get the filtered std centre script details in sort order.
     */
    public getFilteredStdCentreScriptDetailsListInSortOrder(): Immutable.List<StandardisationScriptDetails> {

        let stdScriptListDetails: Immutable.List<StandardisationScriptDetails>;

        // Apply filtering if filter exists
        if (this.standardisationCentreScriptFilterDetails && this.standardisationCentreScriptFilterDetails.filterString !== '') {
            stdScriptListDetails
                = this.getFilteredStdCentreScriptList(this.standardisationCentreScriptFilterDetails.filterString).centreScriptList;
        } else {
            stdScriptListDetails = Immutable.List<StandardisationScriptDetails>(this._standardisationScriptList.centreScriptList);
        }

        // Apply sorting
        if (stdScriptListDetails !== undefined) {
            this.setDefaultComparer('Script');
            let _comparerName = (this.sortDirection === enums.SortDirection.Ascending) ? this.comparerName : this.comparerName + 'Desc';
            stdScriptListDetails = Immutable.List<any>(sortHelper.sort
                (Immutable.List<StandardisationScriptDetails>(stdScriptListDetails).toArray(),
                comparerlist[_comparerName]));
            return stdScriptListDetails ? stdScriptListDetails : undefined;
        }
    }

    /**
     * Update the Unclassified and classified worklists , target and summary after update esmarkgroup marking mode
     * @param markingModeId
     */
    public updateUnclassifiedWorklistOnClassify(markingModeId: enums.MarkingMode) {
        this._standardisationTargetDetailsList.standardisationTargetDetails.filter(
            x => x.markingModeId === markingModeId).first().count++;

        // Update left panel counts
        this._standardisationTargetDetailsList.unclassifiedCount--;
        this._standardisationTargetDetailsList.classifiedCount++;
    }

    /**
     * Update response sort collection.
     */
    private updateSortCollection() {
        if (this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse) {
            this.updateResponseSortCollection(this._selectedStandardisationSetupWorkList, 'Centre');
            if (this.getPreviousSessionTabVisibiltyinSelectResponse) {
                this.updateResponseSortCollection(this._selectedStandardisationSetupWorkList, 'Reuse');
            }
        } else {
            this.updateResponseSortCollection(this._selectedStandardisationSetupWorkList, '');
        }
    }

    /**
     * Returns true, if selected worklist is UnClassified worklsit.
     */
    public get isUnClassifiedWorklist(): boolean {
        return this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            && this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.UnClassifiedResponse;
    }

    /**
     * Returns true, if selected worklsit is classified worklsit.
     */
    public get isClassifiedWorklist(): boolean {
        return this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            && this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
    }

    /**
     * Returns true, if selected worklsit is provisional worklsit.
     */
    public get isProvisionalWorklist(): boolean {
        return this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            && this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.ProvisionalResponse;
    }

    /**
     * Return true, if selected worklist is selectedResponse worklist.
     */
    public get isSelectResponsesWorklist(): boolean {
        return this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            && this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
            && this._selectedTabInSelectResponse === enums.StandardisationSessionTab.CurrentSession;
    }

    /**
     * Return true, if selected worklist is selected response previous session worklist.
     */
    public get isSelectedResponsePreviousSessionWorklist(): boolean {
        return this._markerOperationMode === enums.MarkerOperationMode.StandardisationSetup
            && this._selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
            && this._selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession;
    }

    /**
     * Gets Classified Response Header Detail
     * @param displayId
     */
    public getClassifiedResponseHeaderDetail(displayId: string): classifiedResponseHeaderDetail {
        let responseHeaderDetail: classifiedResponseHeaderDetail = {
            markingModeId: 0,
            currentPosition: 0,
            classifiedWorklistCountByMarkingMode: 0,
            rigOrder: 0
        };

        let response: StandardisationResponseDetails = (this._standardisationSetUpResponsedetails.standardisationResponses
            .filter((x: StandardisationResponseDetails) =>
                x.displayId.toString() === displayId)).first() as StandardisationResponseDetails;

        if (response != null || response !== undefined) {
            let responseList: Immutable.List<StandardisationResponseDetails> =
                Immutable.List<StandardisationResponseDetails>(
                    this.getClassifiedResponsesInSortOrderByMarkingMode(response.markingModeId));
            responseHeaderDetail.markingModeId = response.markingModeId;
            responseHeaderDetail.rigOrder = response.rigOrder;
            responseHeaderDetail.currentPosition = responseList.indexOf(response) + 1;
            responseHeaderDetail.classifiedWorklistCountByMarkingMode = responseList.count();
        }

        return responseHeaderDetail;
    }

    /**
     * Gets Classified Responses By MarkingMode
     * @param markingModeId
     */
    public getClassifiedResponsesInSortOrderByMarkingMode(markingModeId: number): Immutable.List<StandardisationResponseDetails> {
        return Immutable.List<StandardisationResponseDetails>(
            this.getCurrentWorklistResponseBaseDetailsInSortOrder()
                .filter((x: StandardisationResponseDetails) =>
                    x.markingModeId === markingModeId));
    }

	/**
	 * gets the names of failed markscheme group names.
	 */
    public get failedMarkSchemeGroupNames(): string {
        return this._failedMarkSchemeGroupNames;
    }

    public get scriptNavigationBetweenCentresDirection(): enums.ResponseNavigation {
        return this._scriptNavigationDirection;
    }

    /**
     * returns true, if the selected centre is the last centre.
     */
    private get isLastCentre(): boolean {
        return this._standardisationCentreList.centreList.last().uniqueId === this._selectedCentreId;
    }

    /**
     * returns true, if the selected centre is the first centre.
     */
    private get isFirstCentre(): boolean {
        return this._standardisationCentreList.centreList.first().uniqueId === this._selectedCentreId;
    }

    /**
     * returns the centre details of next/previous centre.
     * @param direction
     */
    private centreDetailsByItsPosition(direction: enums.ResponseNavigation): StandardisationCentreDetails {
        let poisition: number = (direction === enums.ResponseNavigation.previous) ?
            (this.selectedCentrePosition(this._selectedCentreId) - 1) :
            (this.selectedCentrePosition(this._selectedCentreId) + 1);
        let index: number = 0;
        let result: StandardisationCentreDetails;
        this._standardisationCentreList.centreList.forEach(
            (centre: StandardisationCentreDetails) => {
                index++;
                if (index === poisition) {
                    result = centre;
                }
            });
        return result;
    }
}

let instance = new StandardisationSetupStore();
export = { StandardisationSetupStore, instance };