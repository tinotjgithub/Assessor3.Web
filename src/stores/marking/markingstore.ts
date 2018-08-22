import storeBase = require('../base/storebase');
import constants = require('../../components/utility/constants');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import retrieveMarksAction = require('../../actions/marking/retrievemarksaction');
import updateCurrentQuestionItemAction = require('../../actions/marking/updatecurrentquestionitemaction');
import currentQuestionItemInfo = require('../../actions/marking/currentquestioniteminfo');
import responseOpenAction = require('../../actions/response/responseopenaction');
import saveMarkAction = require('../../actions/marking/savemarkaction');
import examinerMark = require('../response/typings/examinermark');
import enums = require('../../components/utility/enums');
import workListStore = require('../worklist/workliststore');
import responseStore = require('../response/responsestore');
import qigStore = require('../qigselector/qigstore');
import saveAndNavigateAction = require('../../actions/marking/saveandnavigateaction');
import showGracePeriodMessageAction = require('../../actions/marking/showgraceperiodmessageaction');
const NR_MARK_STATUS = 'Not Attempted';
const NOT_ATTEMPTED = 'NR';
import updateMarkAction = require('../../actions/marking/updatemarkaction');
import updateMarkingProgressAction = require('../../actions/marking/updatemarkingprogressaction');
import examinerMarkData = require('../response/typings/examinermarkdata');
import examinerMarkGroupDetails = require('../response/typings/examinermarkgroupdetails');
import examinerMarksAndAnnotations = require('../response/typings/examinermarksandannotation');
import examinerAnnotations = require('../response/typings/annotation');
import saveMarksAndAnnotationsAction = require('../../actions/response/savemarksandannotationsaction');
import saveMarksAndAnnotationsReturn = require('./typings/savemarksandannotationsreturn');
import removeAnnotationAction = require('../../actions/marking/removeannotationaction');
import drawAnnotationAction = require('../../actions/marking/drawannotationaction');
import panelWidthAction = require('../../actions/marking/updatepanelwidthaction');
import onPageCommentHelper = require('../../components/utility/annotation/onpagecommenthelper');
import annotation = require('../response/typings/annotation');
import markingProgressDetails = require('../../dataservices/response/markingprogressdetails');
import markChangeDetails = require('../../actions/marking/markchangedetails');
import Immutable = require('immutable');
import addAnnotationAction = require('../../actions/marking/addannotationaction');
import triggerSavingMarksAndAnnotationsAction = require('../../actions/response/triggersavingmarksandannotationsaction');
import updateAnnotationPoisitionAction = require('../../actions/marking/updateannotationpositionaction');
import updateAnnotationColorAction = require('../../actions/marking/updateannotationcoloraction');
import setNonRecoverableErrorAction = require('../../actions/response/setnonrecoverableerroraction');
import markEditedAction = require('../../actions/marking/markeditedaction');
import resetMarksAnnotationAction = require('../../actions/marking/resetmarksandannotationaction');
import clearMarksAndAnnotationsAction = require('../../actions/response/clearmarksandannotationsaction');
import rotateResponseAction = require('../../actions/zoompanel/rotateresponseaction');
import fitResponseAction = require('../../actions/zoompanel/fitresponseaction');
import setMarkEntrySelected = require('../../actions/marking/setmarkentryselectionaction');
import contextMenuAction = require('../../actions/marking/contextmenuaction');
import annotationToolTipSetAction = require('../../actions/markschemestructure/annotationtooltipsetaction');
import notifyMarkChangedAction = require('../../actions/marking/notifymarkchangedaction');
import responseViewModeChangedAction = require('../../actions/response/responseviewmodechangedaction');
import configurableCharacteristicsStore = require('../configurablecharacteristics/configurablecharacteristicsstore');
import xmlHelper = require('../../utility/generic/xmlhelper');
import responseAllocateAction = require('../../actions/response/responseallocateaction');
import submitresponsecompletedaction = require('../../actions/submit/submitresponsecompletedaction');
import marksandannotationvibilitychangedaction = require('../../actions/marking/marksandannotationvibilitychangedaction');
import acceptQualityFeedbackAction = require('../../actions/response/acceptqualityfeedbackaction');
import worklistTypeAction = require('../../actions/worklist/worklisttypeaction');
import updateMarksAndAnnotationVisibilityAction = require('../../actions/marking/updatemarksandannotationvisibilityaction');
import marksAndAnnotationsVisibilityInfo = require('../../components/utility/annotation/marksandannotationsvisibilityinfo');
import stampPanAction = require('../../actions/toolbar/stamppanaction');
import stampStoreHelper = require('../stamp/stampstorehelper');
import updateSeenAnnotationAction = require('../../actions/marking/updateseenannotationaction');
import examinerMarksAndAnnotation = require('../response/typings/examinermarksandannotation');
import markChangeReasonUpdateAction = require('../../actions/marking/markchangereasonupdateaction');
import showMarkChangeReasonNeededMessageAction = require('../../actions/marking/showmarkchangereasonneededmessageaction');
import setMarkChangeReasonVisibilityAction = require('../../actions/marking/setmarkchangereasonvisibilityaction');
import markChangeReasonInfo = require('./typings/markchangereasoninfo');
import marksAndAnnotationsVisibilityHelper = require('../../components/utility/marking/marksandannotationsvisibilityhelper');
import dynamicAnnotationMoveAction = require('../../actions/marking/dynamicAnnotationMoveAction');
import markSchemeHeaderDropDownAction = require('../../actions/markschemestructure/markschemeheaderdropdownaction');
import responsePinchZoomAction = require('../../actions/zoompanel/responsepinchzoomaction');
import nonNumerIcinfoAction = require('../../actions/marking/nonnumericinfoaction');
import navigateAfterMarkConfirmationAction = require('../../actions/marking/navigateaftermarkconfirmationaction');
import updateNavigationAction = require('../../actions/marking/updatenavigationaction');
import setCurrentNavigationAction = require('../../actions/marking/setcurrentnavigationaction');
import markbyannotationvalidmarkaction = require('../../actions/marking/markbyannotationvalidmarkaction');
import addMarkByAnnotationAction = require('../../actions/marking/addmarkbyannotationaction');
import pinchZoomCompletedAction = require('../../actions/zoompanel/responsepinchzoomcompletedaction');
import removeMarksByAnnotationAction = require('../../actions/marking/removemarksbyannotationaction');
import setMarkinginProgressAction = require('../../actions/marking/setmarkinginprogressaction');
import markerOperationModeChangedAction = require('../../actions/userinfo/markeroperationmodechangedaction');
import examinerStore = require('../markerinformation/examinerstore');
import ccHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import ccNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import combinedWarningMessage = require('../../components/response/typings/combinedwarningmessage');
import showResponseNavigationFailureReasonAction = require('../../actions/marking/showresponsenavigationfailurereasonsaction');
import supervisorRemarkDecision = require('../../dataservices/response/supervisorremarkdecision');
import supervisorRemarkDecisionChangeAction = require('../../actions/marking/supervisorremarkdecisionchangeaction');
import warningNR = require('../../components/response/typings/warningnr');
import zoomAnimationEndAction = require('../../actions/zoom/zoomanimationendaction');
import htmlUtilities = require('../../utility/generic/htmlutilities');
import saveEnhancedOffPageCommentAction = require('../../actions/enhancedoffpagecomments/saveenhancedoffpagecommentaction');
import EnhancedOffPageComment = require('../response/typings/enhancedoffpagecomment');
import fileReadStatusChangeAction = require('../../actions/ecoursework/filereadstatuschangeaction');
import bookmarkAddedAction = require('../../actions/bookmarks/bookmarkaddedaction');
import bookmark = require('../response/typings/bookmark');
import bookmarkSelectedAction = require('../../actions/bookmarks/bookmarkselectedaction');
import goBackButtonClickAction = require('../../actions/bookmarks/bookmarkgobackbuttonclickaction');
import updateAnnotationSelectionAction = require('../../actions/marking/updateannotationselectionaction');
import showOrHideBookmarkNameBoxAction = require('../../actions/bookmarks/showorhidebookmarknameboxaction');
import updateBookmarkNameAction = require('../../actions/bookmarks/updateBookmarkNameAction');
import examinerRoleMarkGroupDetails = require('../response/typings/examinerrolemarkgroupdetails');
import acetatePositionUpdateAction = require('../../actions/acetates/acetatepositionupdateaction');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import validateResponseAction = require('../../actions/response/validateresponseaction');
import updateMarkingDetailsAction = require('../../actions/marking/updatemarkingdetailsaction');
import storageAdapterHelper = require('../../dataservices/storageadapters/storageadapterhelper');
import copymarksandannotationasdefinitiveaction = require('../../actions/standardisationsetup/copymarksandannotationasdefinitiveaction');
import awardingStore = require('../awarding/awardingstore');
import copyMarksForDefinitiveAction = require('../../actions/marking/copymarksfordefinitiveaction');
import qigSelectorDataFetchAction = require('../../actions/qigselector/qigselectordatafetchaction');
import qigSummary = require('../qigselector/typings/qigsummary');
import StandardisationSetupCCData = require('../standardisationsetup/typings/standardisationsetupccdata');
import stdSetupPermissionHelper = require('../../utility/standardisationsetup/standardisationsetuppermissionhelper');
import standardisationSetupSelectWorkListAction = require('../../actions/standardisationsetup/standardisationsetupworklistselectaction');
import showMarkConfirmationPopupOnEnterAction = require('../../actions/marking/showmarkconfirmationpopuponenteraction');
import updateDefinitiveMarksForDifferentMarkerAction = require('../../actions/marking/updatedefinitivemarksfordifferentmarkeraction');

/**
 * Class for Marking store, stores all information regarding marking.
 */
class MarkingStore extends storeBase {

    // examiner marks collection
    private _examinerMarksAgainstResponse: Array<examinerMarkData>;

    /**
     * holds current question info
     */
    private _currentQuestionItemInfo: currentQuestionItemInfo;

    /* holds the previous question items image cluster id */
    private _previousQuestionItemImageClusterId: number;

    private _previousMarkSchemeGroupId: number;

    /* holds the selected display id */
    private _selectedDisplayId: number;

    /* holds the previous question item */
    private _previousQuestionItem: number;

    /* The current mark group id */
    private _currentMarkGroupId: number;

    private _newMark: AllocatedMark;

    private _initialMarkingProgress: number;

    /* non-recoverable error status */
    private _currentMarkGroupItemHasNonRecoverableErrors: boolean;

    private _defaultMarkSchemePanelWidthInPixel: string;

    private _newDefaultMarkSchemePanelWidthInPixel: string;

    private _minimumPanelWidthInPixel: string;

    private _previousMarkListWidthInPixel: number;

    private _resizePanelClassName: string;

    private _forceUpdate: boolean;

    private _selectedBookmarkClientToken: string;

    private _selectedQIGMarkSchemeGroupId: number;

    private _selectedQIGMarkGroupId: number;

    private _selectedQIGExaminerRoleId: number;

    // holds the value whether opened standardisation setup response has definitive marks
    private _hasDefinitiveMarks: boolean;

    private _examinerRoleId: number;

    private _selectedstandardisationSetupWorklist: enums.StandardisationSetup;

    // Holds standardisation setup permission cc data for selected qig.
    private _standardisationSetupPermissionData: StandardisationSetupCCData;

    //Holds the Selected QIG Examinor Role Id of Logged in user(For teammanagement)
    private _selectedQIGExaminerRoleIdOfLoggedInUser: number;

    // Response marks retrieved.
    public static RETRIEVE_MARKS_EVENT = 'ResponseMarksRetrieved';

    // current question item changed.
    public static CURRENT_QUESTION_ITEM_CHANGE_EVENT = 'CurrentQuestionItemChanged';

    // current question item changed.
    public static QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT = 'QIgChangedInWholeResponse';

    // When moving away from response.
    public static SAVE_AND_NAVIGATE_EVENT = 'SaveAndNavigate';

    // When response mode is changed.
    public static UPDATE_WAVY_ANNOTATION_EVENT = 'UpdateWavyAnnotation';

    /* Marks corresponding to the currently selected mark scheme */
    private _currentExaminerMark: examinerMark;

    /* Marks details of the currently selected response */
    private _currentExaminerMarks: Array<examinerMark>;

    /* The previous response mark group id */
    private _previousMarkGroupId: number;

    /* Navigating from response to different view */
    private _navigatingTo: enums.SaveAndNavigate;

    private _showNavigationOnMbqPopup: boolean = false;

    /* Identifying the current navigation to different view */
    private _currentNavigation: enums.SaveAndNavigate;

    private _navigationFrom: enums.ResponseNavigation;

    /* The current navigated mode */
    private _currentNavigatedMode: enums.SaveAndNavigate;

    /* The candidate script id */
    private candidateScriptId: number;

    /* marking progress collection */
    private _markingProgressDetails: Immutable.Map<number, markingProgressDetails>;

    /* Whether the marking is happening and mark scheme panel is visible */
    private _isMarkingInProgress: boolean = false;

    /* Whether to emit readytonavigae event or not */
    private isNavigationStarted: boolean = false;

    /* Whether marks are saved to db */
    private _isMarksSavedToDb: boolean = false;

    /* flag to indicate next response should be opened after save */
    private _isNextResponse: boolean;

    /* flag is to indicate whether the current mark is updated or not */
    private _isEdited: boolean = false;

    // current drawing annotations client token.
    private _currentClientToken: string;

    private _annotationDrawStart: boolean;

    /* This dictionary will hold annotation tooltip information with markSchemeId as key */
    private _toolTipInfo: Immutable.Map<number, MarkSchemeInfo>;

    // private field to store the response mode of the opened response.
    private _currentResponseMode: enums.ResponseMode;

    private _currentWorklistType: enums.WorklistType;

    private _updatedRowVersionOnSaveAndClassify: string;

    private _currentResponseMarkingProgress: number = 0;

    private _warningNR: warningNR;

    private _commentLeft: number = 0;

    private _commentTop: number = 0;

    private stampHelper: stampStoreHelper;

    private updatedStampId: number = 0;

    private linkWholePageNumber: number = 0;

    // Update the zoom container width when pinch to zoom is triggred to prepare container
    // for tranform
    private _zoomToWidth: number = 0;

    private markSchemeHeaderDropDownOpen: boolean;

    private isContextMenuVisible: boolean;

    private _isNonNumeric: boolean = false;
    private _isNavigationThroughMarkScheme: enums.ResponseNavigation;

    private _operationMode: enums.MarkerOperationMode = enums.MarkerOperationMode.Marking;

    private _combinedWarningMessage: combinedWarningMessage;

    private _annotationUniqueIds: Array<string> = new Array<string>();

    private _removeAnnotationList: Array<string> = new Array<string>();

    private _isRotating: boolean = false;

    private _keyCode: enums.KeyCode;

    public static MARK_UPDATED_EVENT = 'MarkUpdated';

    // marks and annotations are saved.
    public static SAVE_MARKS_AND_ANNOTATIONS_EVENT = 'MarksAndAnnotationsSaved';

    public static REMOVE_ANNOTATION = 'RemoveAnnotation';

    /* For emiting the event while changing the color*/
    public static UPDATE_ANNOTATION_COLOR = 'UpdateAnnotation';

    /* For emiting the event */
    public static ANNOTATION_ADDED = 'AnnotationAdded';

    /* For valid annotation mark*/
    public static VALID_ANNOTATION_MARK = 'annotation mark is valid';

    /* For mark by annotation added*/
    public static ADD_MARK_BY_ANNOTATION = 'mark by annotation added';

    /* For removing mark by annotation */
    public static REMOVE_MARKS_BY_ANNOTATION = 'remove mark by annotation';

    /* this event is to indicate that the mark updated and the selected item is not changed.
     * so we need to rerender the mark buttons to reflect the change */
    public static MARK_UPDATED_WITHOUT_NAVIGATION_EVENT = 'MarkUpdatedWithOutNavigation';

    /* Emitting after triggering the save of marks and annotations */
    public static TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT = 'TriggerSavingMarksAndAnnotations';

    /* Emitting after the mark has been saved */
    public static MARK_SAVED = 'MarkSaved';

    /* Emitting after the mark has been saved and ready to navigate away from the current response*/
    public static READY_TO_NAVIGATE = 'ReadyToNavigate';

    public static ANNOTATION_UPDATED = 'AnnotationUpdated';

    /* Emitting after setting non-recoverable error */
    public static SET_NON_RECOVERABLE_ERROR_EVENT = 'SetNonRecoverableError';


    /* event for triggering navigation after save and mark confirmation */
    public static MARK_SCHEME_NAVIGATION = 'MarkSchemeNavigation';


    /* Emitting an event to reset the mark and annotation associated to current markscheme. */
    public static RESET_MARK_AND_ANNOTATION = 'ResetMarkAndAnnotation';

    /* Emitting an event to reset the mark and annotation associated to current markscheme. */
    public static SET_MARK_ENTRY_SELECTED = 'SetMarkEntrySelected';

    /* Notify the mark updated.
     * NB: This will trigger in each keystroke
     */
    public static NOTIFY_MARK_UPDATED = 'NotifyMarkChanged';

    public static CONTEXT_MENU_ACTION_TRIGGERED = 'ContextMenuActionTriggered';

    /*Emit after clicking the zoom settings*/
    public static ZOOM_SETTINGS = 'ZoomSettings';

    public static ANNOTATION_DRAW = 'Annotation Drawing';

    public static PANEL_WIDTH = 'Panel Width';

    public static UPDATE_PANEL_WIDTH = 'Update Panel Width';

    public static DEFAULT_PANEL_WIDTH = 'Default Panel Width';

    public static MARKSCHEME_PANEL_RESIZE_CLASSNAME = 'Markscheme panel resize classname';

    // Emit when the response is in grace and not fully marked.
    public static SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE = 'ResponseInGracePeriodNotFullyMarked';

    public static SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE = 'ResponseWithNotFullyAnnotated';

    public static UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS = 'UpdateMarkAsNRForUmarkedMarkScheme';

    public static DELETE_COMMENT_POPUP = 'DeleteCommentPopUp';

    // Emit when the popup is closed
    public static POPUP_CLOSED_EVENT = 'PopupClosed';

    // marking start time.
    private _markingStartTime: Date;

    // Emit when response view is changed between FullResponse/Marking
    public static RESPONSE_VIEW_MODE_CHANGED = 'ResponseViewModeChange';

    // Emit when marks and annotations visibility changed
    public static MARKS_AND_ANNOTATION_VISIBILITY_CHANGED = 'MarksAndAnnotationVisibilityChanged';

    // Emit when quality feeedback accepted
    public static ACCEPT_QUALITY_ACTION_COMPLETED = 'AcceptQualityFeedbackActionCompleted';

    public static SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE = 'ShowMarkChangeReasonNeededMessage';

    public static MARK_CHANGE_REASON_UPDATED = 'MarkChangeReasonUpdated';

    //Emit when Supervisor Remark Decision Updated
    public static SUPERVISOR_REMARK_DECISION_UPDATED = 'SupervisorRemarkDecisionUpdated';

    public static OPEN_MARK_CHANGE_REASON = 'OpenMarkChangeReason';

    public static OPEN_SUPERVISOR_REMARK_DECISION = 'OpenSuperVisorRemarkDecision';

    public static PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED = 'PreviousMarksAnnotationCopied';

    public static ACETATE_POSITION_UPDATED = 'AcetatePositionUpdated';

    // The Save Marks and annotation trigger point tracker
    private _saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint =
    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None;

    // The Save Marks and annotation trigger point tracker for previous trigger point
    private _saveMarksAndAnnotationPreviousTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint =
    enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None;

    private marksAndAnnotationVisibilityDetails: Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>;

    // variable to check if all pages are annotated and update in marking progress.
    private isAllPagesAnnotated: boolean = false;

    private markChangeReasonData: Immutable.Map<number, markChangeReasonInfo>;

    private supervisorRemarkDecisionData: Immutable.Map<number, supervisorRemarkDecision>;

    private _isMarksAndMarkSchemesLoadedFailed: boolean;

    // When moving away from response.
    public static SAVE_AND_NAVIGATE_INITIATED_EVENT = 'SaveAndNavigateInitiatedEvent';

    // When moving dynamic annotations.
    public static DYNAMIC_ANNOTATION_MOVE = 'DynamicAnnotationMove';

    public static RESPONSE_FULLY_MARKED_EVENT = 'Responsemarkedto100Percent';

    // Emit when response opened.
    public static OPEN_RESPONSE_EVENT = 'OpenResponse';

    // Emit to update the zoom width when response pinch has been started
    public static RESPONSE_PINCH_ZOOM_TRIGGERED = 'ResponsePinchToZoomTriggered';

    // Emit to update the zoom width when response pinch has been completed
    public static RESPONSE_PINCH_ZOOM_COMPLETED = 'ResponsePinchToZoomCompleted';

    public static MARK_CHANGE_REASON_VISIBILITY_UPDATED = 'MarkChangeReasonVisibilityUpdated';

    public static MARK_SCHEME_SCROLL_ACTION = 'MarkSchemeScrollReset';

    public static NAVIGATION_UPDATED_EVENT = 'NavigationUpdatedEvent';

    private _isPreviousMarkListColumnVisible: boolean = false;

    public static SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT = 'ShowResponseNavigationFailureReasonsPopupEvent';

    // Notify component that response animation has been completed
    public static RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT = 'ResponseImageAnimationCompletedEvent';

    public static REMOVE_MARK_ENTRY_SELECTION = 'RemoveMarkEntrySelection';

    public static ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT = 'EnhancedOffPageCommentUpdatedCompletedEvent';

    public static BOOKMARK_ADDED_EVENT = 'BookmarkAddedOnScriptEvent';

    public static BOOKMARK_SELECTED_EVENT = 'BookmarkSelectedEvent';

    public static GO_BACK_BUTTON_CLICK_EVENT = 'GoBackButtonClickEvent';

    public static SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT = 'showOrHideBookmarkNameBoxEvent';

    private _isAllFilesViewedStatusUpdated: boolean = false;

    public static ALL_FILES_VIEWED_CHECK = 'AllfilesViewedCheck';
    public static WITHDRAWN_RESPONSE_EVENT = 'withdrwanResponseEvent';
    public static SESSION_CLOSED_FOR_EXAMINER_EVENT = 'sessionClosedforExaminer';
    public static MARKINGMODE_CHANGED_IN_PROVISIONAL_RESPONSE_EVENT = 'markingModeChangedInProvisionalResponse';

    public static ROTATION_COMPLETED_EVENT = 'RotationCompletedEvent';
    public static COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE = 'copyMarksAndAnnotationAsDefinitive';

    private _isWholeResponse: boolean = false;
    private storageAdapterHelper = new storageAdapterHelper();

    // Holds the previous question item's question tag id
    private _previousQuestionItemQuestionTagId: number;

    private _previousAnswerItemId: number;
    private _canRenderPreviousMarksInStandardisationSetup: boolean = false;
    private _isClearMarkAsDefinitive: boolean = false;

    // Hold the value to indicate whether the definitive mark collection updated for different markers.
    // Collection should be updated only once when the new marker is adds a marks or annoation for the first time.
    private _definitiveMarkCollectionUpdated: boolean = false;

    /**
     * This will emit to update (remove/ add) the dynamic annotation selection
     *
     * @static
     * @memberof MarkingStore
     */
    public static ANNOTATION_SELECTION_UPDATED_EVENT = 'AnnotationSelectionUpdatedEvent';

    public static COPY_MARKS_FOR_DEFINITIVE_EVENT = 'CopyMarksForDefinitiveEvent';
    public static SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_EVENT = 'ShowMarkConfirmationPopupOnEnterEvent';

    /**
     * @constructor
     */
    constructor() {
        super();
        this._examinerMarksAgainstResponse = [];
        this.marksAndAnnotationVisibilityDetails = Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>();
        this.markChangeReasonData = Immutable.Map<number, markChangeReasonInfo>();
        this.supervisorRemarkDecisionData = Immutable.Map<number, supervisorRemarkDecision>();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.RETRIEVE_MARKS:
                    let retrieveMarksAction: retrieveMarksAction = action as retrieveMarksAction;
                    if (retrieveMarksAction.isSuccess && retrieveMarksAction.examinerMarkDetails.examinerMarkGroupDetails) {
                        let markGroupId = retrieveMarksAction.markGroupId;
                        if (this._examinerMarksAgainstResponse[markGroupId] === undefined
                            || this._examinerMarksAgainstResponse[markGroupId] == null) {
                            let emptyMarkData: examinerMarkData = {
                                errorMessage: '',
                                examinerMarkGroupDetails: undefined,
                                wholeResponseQIGToRIGMapping: undefined,
                                success: false,
                                errorType: enums.SaveMarksAndAnnotationErrorCode.None,
                                IsAwaitingToBeQueued: false,
                                IsBackGroundSave: false
                            };
                            this._examinerMarksAgainstResponse[markGroupId] = emptyMarkData;
                        }

                        this._examinerMarksAgainstResponse[markGroupId] = retrieveMarksAction.examinerMarkDetails;

                        // set remarkrequesttype for each annotation
                        this.setRemarkRequestType(markGroupId);

                        let allMarksAndAnnotations = this._examinerMarksAgainstResponse[markGroupId].
                            examinerMarkGroupDetails[markGroupId].
                            allMarksAndAnnotations;
                        // set the display status of marks and annotations to be shown when response is loaded
                        this.marksAndAnnotationVisibilityDetails = this.marksAndAnnotationVisibilityDetails.set(
                            markGroupId,
                            marksAndAnnotationsVisibilityHelper.setMarksAndAnnotationsVisibility(allMarksAndAnnotations,
                                markGroupId,
                                this._currentResponseMode,
                                this._currentWorklistType,
                                this._canRenderPreviousMarksInStandardisationSetup));

                        if (retrieveMarksAction.hasComplexOptionality && allMarksAndAnnotations[0].markingProgress < 100) {
                            this.clearUsedInTotal(retrieveMarksAction.markGroupId);
                        }

                        // Reset definitive mark collection update flag
                        this._definitiveMarkCollectionUpdated = false;

                        this._isMarksAndMarkSchemesLoadedFailed = false;
                        /** Emitting after clicking on response item */
                        this.emit(MarkingStore.RETRIEVE_MARKS_EVENT, markGroupId);
                    } else {
                        this._isMarksAndMarkSchemesLoadedFailed = true;
                    }
                    break;

                case actionType.UPDATE_SELECTED_QUESTION_ITEM:
                    this._previousQuestionItemImageClusterId = this._currentQuestionItemInfo ? this._currentQuestionItemInfo.imageClusterId
                        : undefined;
                    this._previousQuestionItem = this._currentQuestionItemInfo ? this._currentQuestionItemInfo.uniqueId
                        : undefined;
                    this._previousQuestionItemQuestionTagId = this._currentQuestionItemInfo ? this._currentQuestionItemInfo.questionTagId
                        : undefined;
                    this._previousAnswerItemId = this.currentQuestionItemInfo ? this._currentQuestionItemInfo.answerItemId
                        : undefined;
                    this._currentQuestionItemInfo = (action as updateCurrentQuestionItemAction).currentQuestionInfo;
                    this._forceUpdate = (action as updateCurrentQuestionItemAction).isForceUpdate;

                    // For whole response scenarios, get the corresponding MarkSchemeGroupId and ExaminerRoleId to save
                    this._selectedQIGMarkSchemeGroupId = this._currentQuestionItemInfo ?
                        this._currentQuestionItemInfo.markSchemeGroupId : null;
                    this._selectedQIGMarkGroupId = this.getMarkGroupIdQIGtoRIGMap(this._selectedQIGMarkSchemeGroupId);

                    if (this.currentOperationMode !== enums.MarkerOperationMode.Awarding) {
                        // Selected QIG Examinor Role ID of Examiner for whom response is allocated(Subordinate in teammanagement)
                        this._selectedQIGExaminerRoleId = this.getExaminerRoleQIGtoRIGMap(this._currentMarkGroupId,
                            this._selectedQIGMarkGroupId);
                    }

                    let isAwardingMode = (action as updateCurrentQuestionItemAction).isAwardingMode;
                    // TODO: this need to be moved into the calling method
                    // Selected QIG Examinor Role Id of Logged in user(For teammanagement)
                    this._selectedQIGExaminerRoleIdOfLoggedInUser =
                        this.getSelectedQIGExaminerRoleIdOfLoggedInUser(
                            this.selectedQIGMarkSchemeGroupId, isAwardingMode);
                    if (this._previousMarkSchemeGroupId !== this._selectedQIGMarkSchemeGroupId &&
                        this._selectedQIGMarkSchemeGroupId > 0) {
                        this.emit(MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
                            this._selectedQIGMarkSchemeGroupId, this._previousMarkSchemeGroupId);
                        this._previousMarkSchemeGroupId = this._selectedQIGMarkSchemeGroupId;
                    }

                    // Publish changed event only if the markscheme has changed.
                    // For resetting marks we dont need to reset the page.
                    if ((action as updateCurrentQuestionItemAction).isCurrentQuestionItemChanged) {

                        /** Emitting after updating current question item */
                        this.emit(MarkingStore.CURRENT_QUESTION_ITEM_CHANGE_EVENT,
                            this._currentQuestionItemInfo.bIndex,
                            this._forceUpdate, this._isClearMarkAsDefinitive);
                        if (this._isClearMarkAsDefinitive) {
                            this._isClearMarkAsDefinitive = false;
                        }
                    }
                    break;

                case actionType.OPEN_RESPONSE:
                    this._previousMarkGroupId = this._currentMarkGroupId;
                    let openAction: responseOpenAction = action as responseOpenAction;
                    this._currentMarkGroupId = openAction.selectedMarkGroupId;
                    this._currentQuestionItemInfo = undefined;
                    this._previousQuestionItemImageClusterId = undefined;
                    this._previousMarkSchemeGroupId = undefined;
                    this._selectedDisplayId = openAction.selectedDisplayId;
                    this._selectedQIGMarkGroupId = undefined;
                    this._isWholeResponse = openAction.isWholeResponse;
                    this._previousQuestionItemQuestionTagId = undefined;
                    this._previousAnswerItemId = undefined;
                    this._canRenderPreviousMarksInStandardisationSetup = openAction.canRenderPreviousMarksInStandardisationSetup;
                    this._examinerRoleId = openAction.examinerRoleId;
                    this._hasDefinitiveMarks = openAction.hasDefinitiveMarks;
                    // set the value as Undefined when we open a response.
                    this._warningNR = undefined;

                    // getting marking start time.
                    let startDate = new Date();
                    this._markingStartTime = new Date(
                        startDate.getUTCFullYear(),
                        startDate.getUTCMonth(),
                        startDate.getUTCDate(),
                        startDate.getUTCHours(),
                        startDate.getUTCMinutes(),
                        startDate.getUTCSeconds(),
                        startDate.getUTCMilliseconds()
                    );

                    //  this variable is using for displaying non-recoverable error popup.
                    this._currentMarkGroupItemHasNonRecoverableErrors =
                        this.checkMarkGroupItemHasNonRecoverableErrors(this.currentMarkGroupId);

                    /* if the response is opened from open live work list, marking is possible */
                    if (this.isResponseEditable(openAction.selectedResponseMode)
                        && openAction.responseViewMode === enums.ResponseViewMode.zoneView
                        && (this.currentOperationMode === enums.MarkerOperationMode.Marking
                            || this.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup)) {
                        this._isMarkingInProgress = true;
                    } else {
                        this._isMarkingInProgress = false;
                    }

                    this._currentResponseMode = openAction.selectedResponseMode;
                    this._currentWorklistType = workListStore.instance.currentWorklistType;
                    /* setting the currentNavigation value before this._navigatingTo value going to set as None
                       - this is for setting the questionItem as selected when we open the response which is 100%marked.*/
                    this._currentNavigation = this._navigatingTo;
                    /* on opening a new response the navigatingTo and isNavigationStarted needs to be reseted. */
                    this._navigatingTo = enums.SaveAndNavigate.none;
                    this.isNavigationStarted = false;
                    // rest the marks and annotation visibility data collection while opening the response.
                    let examinerMarksAgainstResponse = this._examinerMarksAgainstResponse[this._currentMarkGroupId.toString()];
                    if (examinerMarksAgainstResponse) {
                        let allMarksAndAnnotations = examinerMarksAgainstResponse.
                            examinerMarkGroupDetails[this._currentMarkGroupId.toString()].
                            allMarksAndAnnotations;
                        if (allMarksAndAnnotations) {
                            // set the display status of marks and annotations to be shown when response is loaded
                            this.marksAndAnnotationVisibilityDetails = this.marksAndAnnotationVisibilityDetails.set(
                                this.currentMarkGroupId,
                                marksAndAnnotationsVisibilityHelper.setMarksAndAnnotationsVisibility(allMarksAndAnnotations,
                                    this._currentMarkGroupId,
                                    this._currentResponseMode,
                                    this._currentWorklistType,
                                    this._canRenderPreviousMarksInStandardisationSetup));
                            this._currentResponseMarkingProgress = allMarksAndAnnotations[0].markingProgress;
                        }
                    }
                    this.setMarkChangeReasonInfo();
                    this.setSupervisorRemarkDecision();
                    this._keyCode = undefined;
                    this.emit(MarkingStore.OPEN_RESPONSE_EVENT);
                    break;

                case actionType.SAVE_MARK:
                    let saveMark = action as saveMarkAction;
                    this.candidateScriptId = saveMark.saveMarkDetails.candidateScriptId;
                    this._isNextResponse = saveMark.isNextResponse;
                    /* Save mark to the marks collection */
                    this.saveMark(saveMark.saveMarkDetails,
                        saveMark.isUpdateUsedInTotalOnly,
                        saveMark.isUpdateMarkingProgress);
                    this._currentResponseMarkingProgress = saveMark.saveMarkDetails.overallMarkingProgress;
                    if (saveMark.isMarkUpdatedWithoutNavigation) {
                        this.emit(MarkingStore.MARK_UPDATED_WITHOUT_NAVIGATION_EVENT);
                    }
                    if (saveMark.saveMarkDetails.markingProgress === 100) {
                        this.emit(MarkingStore.RESPONSE_FULLY_MARKED_EVENT);
                    }
                    break;
                case actionType.SHOW_RETURN_TO_WORKLIST_CONFIRMATION_ACTION:
                    // Resetting the value once it shows the return to worklist poup.
                    this._showNavigationOnMbqPopup = false;
                    // Set the value as false for the markscheme navigation after popup display
                    this.isNavigationStarted = false;
                    // Restting the value as false ,once it shows the markconfirmation poup after save.
                    this._isEdited = false;
                    break;
                case actionType.SAVE_AND_NAVIGATE:
                    this._navigatingTo = (action as saveAndNavigateAction).navigatingTo;
                    this._showNavigationOnMbqPopup = (action as saveAndNavigateAction).showNavigationOnMbqPopup;
                    this._navigationFrom = (action as saveAndNavigateAction).navigationFrom;
                    this._selectedBookmarkClientToken = undefined;
                    /* if marking is happening and we are not navigating from full response view to normal view
                     * start save and navigate.
                     */
                    if (this._isMarkingInProgress && this._navigatingTo !== enums.SaveAndNavigate.toCurrentResponse) {

                        // If there are edited marks that are going to add to the collection,
                        // then show the save message indicator.
                        if (this._navigatingTo === enums.SaveAndNavigate.toResponse
                            && this._examinerMarksAgainstResponse[this._currentMarkGroupId].IsAwaitingToBeQueued === true) {
                            this.emit(MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT);
                        } else {

                            /* set to emit ready to navigate event aftyer the mark save */
                            this.isNavigationStarted = true;
                            this.emit(MarkingStore.SAVE_AND_NAVIGATE_EVENT);
                        }
                    } else {
                        /* If we are not in the marking screen or we are switching from full response view to normal view
                         * Then no need to save the mark, we just have to navigate away from response
                         */
                        this.isNavigationStarted = false;
                        if (this._navigationFrom === enums.ResponseNavigation.markScheme) {
                            this.emit(MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT);
                        }
                        this.emit(MarkingStore.READY_TO_NAVIGATE, this._navigationFrom);
                        this._navigationFrom = undefined;
                    }
                    if (this._navigatingTo !== enums.SaveAndNavigate.toMenu
                        && this._navigationFrom !== enums.ResponseNavigation.markScheme) {
                        this._isMarkingInProgress = false;
                    }

                    /* if we are going from full response view back to normal view. set the flag again
                     *  because we will be in the marking screen again
                     */
                    if (this._navigatingTo === enums.SaveAndNavigate.toCurrentResponse) {
                        this._isMarkingInProgress = true;
                    }
                    break;

                case actionType.MARK_UPDATED:
                    let newMarkAction: updateMarkAction = action as updateMarkAction;
                    this._newMark = newMarkAction.currentMark;
                    /** Emitting mark updated event */
                    this.emit(MarkingStore.MARK_UPDATED_EVENT);
                    break;
                case actionType.UPDATE_MARKING_PROGRESS:
                    let updateInitialMarkAction: updateMarkingProgressAction = action as updateMarkingProgressAction;
                    this._initialMarkingProgress = updateInitialMarkAction.initialMarkingProgress;
                    this._currentResponseMarkingProgress = updateInitialMarkAction.initialMarkingProgress;
                    break;
                case actionType.SAVE_MARKS_AND_ANNOTATIONS:
                    let saveAction: saveMarksAndAnnotationsAction = action as saveMarksAndAnnotationsAction;
                    let previousTriggerPoint = this._saveMarksAndAnnotationTriggeringPoint;
                    // Save action may started earlier, keep latest trigger point for continue the user action.
                    this.setSaveMarksAndAnnotationTriggeringPoint(saveAction.saveMarksAndAnnotationTriggeringPoint);
                    //update the existing marks and annotations is dirty field and row version by checking marks/annotations
                    //and isdirty field.

                    if (saveAction.saveMarksAndAnnotationsData !== undefined && saveAction.saveMarksAndAnnotationsData != null) {
                        // Update row version after save for classify action
                        if (saveAction.saveMarksAndAnnotationTriggeringPoint ===
                            enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Classify) {
                            this.updateRowVersion(saveAction.saveMarksAndAnnotationsData.rowVersion);
                        }

                        //Clear worklist data if any marks saved to database (def # 66786)
                        this.storageAdapterHelper.clearStorageArea('worklist');
                        // based on the saveReturn, update the markingOperation and version
                        this.updateExaminerMarksAndAnnotationsData(saveAction.markGroupId, saveAction.saveMarksAndAnnotationsData);

                        if (saveAction.hasComplexOptionality) {
                            this.updateUsedInTotalAndTotalMark(
                                saveAction.markGroupId,
                                saveAction.saveMarksAndAnnotationsData.unUsedMarkschemeIds,
                                saveAction.saveMarksAndAnnotationsData.totalMarks,
                                saveAction.saveMarksAndAnnotationsData.markingProgress);
                        }

                        /* update mark change reason update status*/
                        this.resetMarkChangeReasonUpdateStatus(saveAction.markGroupId);
                        this._isAllFilesViewedStatusUpdated = false;
                        this._saveMarksAndAnnotationPreviousTriggeringPoint = enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None;
                        /* If marks are saved */
                        this._isMarksSavedToDb = true;
                        this.emit(MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT,
                            saveAction.markGroupId,
                            this._saveMarksAndAnnotationTriggeringPoint,
                            enums.MarksAndAnnotationsQueueOperation.Remove);
                    } else {
                        let isnetworkerror: boolean = false;
                        let operation: enums.MarksAndAnnotationsQueueOperation = enums.MarksAndAnnotationsQueueOperation.None;
                        switch (saveAction.dataServiceRequestErrorType) {
                            case enums.DataServiceRequestErrorType.Skipped:
                                operation = enums.MarksAndAnnotationsQueueOperation.Requeue;
                                break;
                            case enums.DataServiceRequestErrorType.NetworkError:
                                this._saveMarksAndAnnotationPreviousTriggeringPoint = previousTriggerPoint;
                                operation = enums.MarksAndAnnotationsQueueOperation.Requeue;
                                isnetworkerror = true;
                                break;
                            case enums.DataServiceRequestErrorType.GenericError:
                                operation = enums.MarksAndAnnotationsQueueOperation.Retry;
                                break;
                            default:
                                operation = enums.MarksAndAnnotationsQueueOperation.None;
                        }
                        this.emit(MarkingStore.SAVE_MARKS_AND_ANNOTATIONS_EVENT,
                            saveAction.markGroupId,
                            this._saveMarksAndAnnotationTriggeringPoint,
                            operation, isnetworkerror);
                    }
                    break;
                case actionType.REMOVE_ANNOTATION:
                    let removeAnnotationAction = action as removeAnnotationAction;
                    let removingAnnotation: annotation;
                    this.allAnnotationsAganistResponse(removeAnnotationAction.isLinkAnnotation).forEach((x: annotation[]) => {
                        x.filter((x) => {
                            if (x.clientToken === removeAnnotationAction.removeAnnotationList[0]) {
                                removingAnnotation = x;
                            }
                        });
                    });

                    this.removeAnnotation(removeAnnotationAction.removeAnnotationList, removeAnnotationAction.contextMenuType,
                        removeAnnotationAction.isMarkByAnnotation);
                    this._removeAnnotationList = this._removeAnnotationList.concat(removeAnnotationAction.removeAnnotationList);
                    this.emit(MarkingStore.REMOVE_ANNOTATION, removingAnnotation,
                        removeAnnotationAction.isPanAvoidImageContainerRender, removeAnnotationAction.contextMenuType);
                    break;
                case actionType.REMOVE_ANNOTATION_MARK:
                    let removeMarksByAnnotation = action as removeMarksByAnnotationAction;
                    this.emit(MarkingStore.REMOVE_MARKS_BY_ANNOTATION, removeMarksByAnnotation.removedAnnotation);
                    break;
                case actionType.ADD_ANNOTATION:
                    // oif any of the on page comment is already open close the commentbox,
                    // instead of adding new response
                    /* if (this.stampHelper.isOnpageCommentOpen()) {
                        return;
                    } */
                    let addAnnotationAction = action as addAnnotationAction;
                    this.addAnnotation(addAnnotationAction.annotation, addAnnotationAction.previousMarkIndex);
                    if (!addAnnotationAction.avoidEventEmition) {
                        this.emit(MarkingStore.ANNOTATION_ADDED,
                            addAnnotationAction.annotation.stamp,
                            addAnnotationAction.annotationAction,
                            addAnnotationAction.annotationOverlayId,
                            addAnnotationAction.annotation,
                            addAnnotationAction.isStitched,
                            addAnnotationAction.isPageLinkedByPreviousMarker);
                    }
                    if (addAnnotationAction.annotation.stamp === constants.LINK_ANNOTATION) {
                        this.linkWholePageNumber = addAnnotationAction.annotation.pageNo;
                    }
                    break;
                case actionType.VALID_MARK:
                    let markbyannotationvalidmarkaction = action as markbyannotationvalidmarkaction;
                    this._annotationUniqueIds.push(markbyannotationvalidmarkaction.annotation.uniqueId);
                    this.emit(MarkingStore.VALID_ANNOTATION_MARK,
                        markbyannotationvalidmarkaction.annotation,
                        markbyannotationvalidmarkaction.annotationAction,
                        markbyannotationvalidmarkaction.annotationOverlayID);
                    break;
                case actionType.ADD_MARK_BY_ANNOTATION_ACTION:
                    let addMarkByAnnotationAction = action as addMarkByAnnotationAction;
                    this.emit(MarkingStore.ADD_MARK_BY_ANNOTATION,
                        addMarkByAnnotationAction.annotation,
                        addMarkByAnnotationAction.action,
                        addMarkByAnnotationAction.annotationOverlayId);
                    break;
                case actionType.ROTATE_RESPONSE:
                    this._isRotating = true;
                    this.emit(MarkingStore.ZOOM_SETTINGS, (action as rotateResponseAction).rotationType, false);
                    break;
                case actionType.FIT_RESPONSE:
                    let fitAction = (action as fitResponseAction);
                    this.emit(MarkingStore.ZOOM_SETTINGS, fitAction.fitType, true, false, fitAction.zoomType);
                    break;
                case actionType.UPDATE_ANNOTATION:
                    let _updateAnnotationAction = (action as updateAnnotationPoisitionAction);
                    let draggedAnnotationClientToken = _updateAnnotationAction.draggedAnnotationClientToken;
                    this.updateAnnotation(_updateAnnotationAction.leftEdge,
                        _updateAnnotationAction.topEdge,
                        _updateAnnotationAction.imageClusterId,
                        _updateAnnotationAction.outputPageNo,
                        _updateAnnotationAction.pageNo,
                        _updateAnnotationAction.draggedAnnotationClientToken,
                        _updateAnnotationAction.width,
                        _updateAnnotationAction.height,
                        _updateAnnotationAction.comment);
                    this.updatedStampId = _updateAnnotationAction.stampId;
                    if (!_updateAnnotationAction.avoidEventEmition) {
                        this.emit(MarkingStore.ANNOTATION_UPDATED, draggedAnnotationClientToken,
                            _updateAnnotationAction.isPositionUpdated,
                            _updateAnnotationAction.isDrawEndOfStampFromStampPanel, _updateAnnotationAction.stampId);
                    }
                    break;
                case actionType.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS:
                    // Setting the trigger point
                    let saveMarksAndAnnotationTriggeringPoint = (action as triggerSavingMarksAndAnnotationsAction).
                        saveMarksAndAnnotationTriggeringPoint;
                    this.setSaveMarksAndAnnotationTriggeringPoint(saveMarksAndAnnotationTriggeringPoint);
                    this.emit(MarkingStore.TRIGGER_SAVING_MARKS_AND_ANNOTATIONS_EVENT,
                        this._saveMarksAndAnnotationTriggeringPoint);
                    break;
                case actionType.RESET_MARKS_AND_ANNOTATION:
                    this.resetMarksAndAnnotation(
                        (action as resetMarksAnnotationAction).resetMarks,
                        (action as resetMarksAnnotationAction).resetAnnotation,
                        (action as resetMarksAnnotationAction).previousMark);
                    break;
                case actionType.WORKLIST_MARKING_MODE_CHANGE:
                    if ((action as worklistTypeAction).success) {
                        this._currentResponseMode = (action as worklistTypeAction).getResponseMode;
                    }
                    /* when there is a worklist call happens, reset save mark flag */
                    this._isMarksSavedToDb = false;
                    break;
                case actionType.SET_NON_RECOVERABLE_ERROR:
                    this.setAsNonRecoverableItem((action as setNonRecoverableErrorAction).markGroupId);
                    this.emit(MarkingStore.SET_NON_RECOVERABLE_ERROR_EVENT, (action as setNonRecoverableErrorAction).markGroupId);
                    break;
                case actionType.NAVIGATE_AFTER_MARKING:
                    this._isEdited = false;
                    this._navigationFrom = (action as navigateAfterMarkConfirmationAction).navigateFrom;
                    if ((action as navigateAfterMarkConfirmationAction).navigateTo) {
                        this._navigatingTo = (action as navigateAfterMarkConfirmationAction).navigateTo;
                        // set the value as true for handling yes click of return to worklist poup.
                        this.isNavigationStarted = true;
                    }
                    /* if a navigation is started away from the response, emit ready to navigate event after the mark save */
                    if (this.isNavigationStarted) {
                        this.isNavigationStarted = false;
                        if (this._navigationFrom === enums.ResponseNavigation.markScheme) {
                            this.emit(MarkingStore.SAVE_AND_NAVIGATE_INITIATED_EVENT, false);
                        }
                        this.emit(MarkingStore.READY_TO_NAVIGATE, this._navigationFrom);
                        this._navigationFrom = undefined;
                    } else {
                        this.emit(MarkingStore.MARK_SCHEME_NAVIGATION);
                    }
                    break;
                case actionType.MARK_EDITED:
                    let markEditedAction: markEditedAction = action as markEditedAction;
                    this._isEdited = markEditedAction.isEdited;
                    break;
                case actionType.CLEAR_MARKS_AND_ANNOTATIONS:
                    this._examinerMarksAgainstResponse[(action as setNonRecoverableErrorAction).markGroupId] = null;
                    break;
                case actionType.UPDATE_ANNOTATION_COLOR:
                    let _updateAnnotationColorAction = (action as updateAnnotationColorAction);
                    this.updateAnnotationColor(_updateAnnotationColorAction.currentAnnotation);
                    this.emit(MarkingStore.UPDATE_ANNOTATION_COLOR);
                    break;
                case actionType.SET_MARK_ENTRY_SELECTED:
                    let setMarkEntrySelected = (action as setMarkEntrySelected);
                    this.emit(MarkingStore.SET_MARK_ENTRY_SELECTED, setMarkEntrySelected.isCommentSelected);
                    break;
                case actionType.NOTIFY_MARK_CHANGE:
                    let markChangedAction: notifyMarkChangedAction = action as notifyMarkChangedAction;
                    this._currentResponseMarkingProgress = markChangedAction.markingProgress;
                    // save the NR warnings when any marks are updated.
                    this._warningNR = markChangedAction.warningNR;

                    // NB: This will trigger in each keystroke.
                    // This is to make the mark button sync with the mark entry
                    this.emit(MarkingStore.NOTIFY_MARK_UPDATED);
                    break;
                case actionType.CONTEXT_MENU_ACTION:
                    let contextMenuActionResult: contextMenuAction = action as contextMenuAction;
                    this.isContextMenuVisible = contextMenuActionResult.isVisible;
                    this.emit(MarkingStore.CONTEXT_MENU_ACTION_TRIGGERED, contextMenuActionResult.isVisible,
                        contextMenuActionResult.xPos,
                        contextMenuActionResult.yPos,
                        contextMenuActionResult.contextMenuData);
                    break;
                case actionType.SET_ANNOTATION_TOOLTIPS:
                    let toolTipSetAction: annotationToolTipSetAction = action as annotationToolTipSetAction;
                    this._toolTipInfo = toolTipSetAction.toolTipInfo;
                    break;
                case actionType.ANNOTATION_DRAW:
                    this.emit(MarkingStore.ANNOTATION_DRAW, (action as drawAnnotationAction).isAnnotationDrawStart);
                    break;
                case actionType.PANEL_WIDTH:
                    this._resizePanelClassName = (action as panelWidthAction).resizeClassName;
                    this.emit(MarkingStore.PANEL_WIDTH, (action as panelWidthAction).panelWidth,
                        (action as panelWidthAction).resizeClassName, (action as panelWidthAction).panelType,
                        (action as panelWidthAction).panActionType);
                    break;
                case actionType.DEFAULT_PANEL_WIDTH:
                    this._defaultMarkSchemePanelWidthInPixel = (action as panelWidthAction).defaultPanelWidth;
                    this._previousMarkListWidthInPixel = (action as panelWidthAction).previousMarkListWidth;
                    break;
                case actionType.DEFAULT_PANEL_WIDTH_AFTER_COLUMN_UPDATION:
                    this._newDefaultMarkSchemePanelWidthInPixel = (action as panelWidthAction).defaultPanelWidthAfterColumnUpdate;
                    this._isPreviousMarkListColumnVisible = (action as panelWidthAction).previousMarkListColumnVisible;
                    this.emit(MarkingStore.UPDATE_PANEL_WIDTH, this._newDefaultMarkSchemePanelWidthInPixel);
                    break;
                case actionType.MINIMUM_PANEL_WIDTH:
                    this._minimumPanelWidthInPixel = (action as panelWidthAction).minimumPanelWidth;
                    break;
                case actionType.PANEL_RESIZE_CLASSNAME:
                    this._resizePanelClassName = (action as panelWidthAction).resizeClassName;
                    this._resizePanelClassName = this._resizePanelClassName ? this._resizePanelClassName : '';
                    this.emit(MarkingStore.MARKSCHEME_PANEL_RESIZE_CLASSNAME, this._resizePanelClassName);
                    break;
                case actionType.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE:
                    // emit an event to show grace period message box here.
                    let failureReason = (action as showGracePeriodMessageAction).failureReason;
                    this.emit(MarkingStore.SHOW_GRACE_PERIOD_NOT_FULLY_MARKED_MESSAGE, failureReason);
                    break;
                case actionType.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE:
                    let navigatingTo = (action as saveAndNavigateAction).navigatingTo;
                    this.emit(MarkingStore.SHOW_ALL_PAGE_NOT_ANNOTATED_MESSAGE, navigatingTo);
                    break;
                case actionType.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS:
                    this.emit(MarkingStore.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS);
                    break;
                case actionType.DELETE_COMMENT_POPUP:
                    this.emit(MarkingStore.DELETE_COMMENT_POPUP);
                    break;
                case actionType.RESPONSE_VIEW_MODE_CHANGED:
                    if ((action as responseViewModeChangedAction).responseViewMode === enums.ResponseViewMode.fullResponseView
                        || this._currentResponseMode === enums.ResponseMode.closed
                        || this.currentOperationMode === enums.MarkerOperationMode.TeamManagement
                        || (this.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup
                            && ((this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.UnClassifiedResponse
                            && (this._hasDefinitiveMarks === false
                                    || !this._standardisationSetupPermissionData.role.permissions.editDefinitives)) ||
                        (this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.ClassifiedResponse
                            && (!this._standardisationSetupPermissionData.role.permissions.editDefinitives
                                        || qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)))
                        )) {
                        this._isMarkingInProgress = false;
                    } else {
                        if (this._isWholeResponse === true && this.getRelatedWholeResponseQIGIds().length > 1) {
                            this.emit(MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
                                this._selectedQIGMarkSchemeGroupId, undefined, true);
                        }
                        this._isMarkingInProgress = true;
                    }
                    this.emit(MarkingStore.RESPONSE_VIEW_MODE_CHANGED);
                    break;
                case actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION:
                    let isMarksColumnVisibilitySwitched: boolean = false;
                    let _updateMarksAndAnnotationVisibilityAction: updateMarksAndAnnotationVisibilityAction =
                        action as updateMarksAndAnnotationVisibilityAction;
                    if (!this.marksAndAnnotationVisibilityDetails) {
                        this.marksAndAnnotationVisibilityDetails =
                            Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>>();
                    }
                    if (_updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails) {
                        let selectedMarkingIndex: number = _updateMarksAndAnnotationVisibilityAction.getIndex;
                        let selectedCommentindex: number = _updateMarksAndAnnotationVisibilityAction.getCurrentCommentIndex;
                        // Setting whether the marks column visibility has been switched
                        isMarksColumnVisibilitySwitched =
                            marksAndAnnotationsVisibilityHelper.isMarksColumnVisibilitySwitched(
                                selectedMarkingIndex,
                                _updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails,
                                this.getMarksAndAnnotationVisibilityDetails,
                                this.currentMarkGroupId);
                        // update marks and annotation and enhancedoffpagecomments visiblity status.
                        this.marksAndAnnotationVisibilityDetails = marksAndAnnotationsVisibilityHelper.
                            updateMarksAndAnnotationVisibilityStatus(
                            selectedMarkingIndex,
                            _updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails,
                            this.getMarksAndAnnotationVisibilityDetails,
                            this.currentMarkGroupId);

                        if (_updateMarksAndAnnotationVisibilityAction.isEnchancedOffpageCommentVisible) {
                            let visiblityDetails = this.marksAndAnnotationVisibilityDetails.get(this.currentMarkGroupId);
                            this.marksAndAnnotationVisibilityDetails = marksAndAnnotationsVisibilityHelper.
                                updateEnhancedOffpageComemntRadioButtonStatus(visiblityDetails,
                                this.marksAndAnnotationVisibilityDetails,
                                this.getMarksAndAnnotationVisibilityDetails,
                                this.currentMarkGroupId,
                                selectedMarkingIndex,
                                selectedCommentindex,
                                isMarksColumnVisibilitySwitched
                                );
                        }
                    }
                    this.emit(MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, isMarksColumnVisibilitySwitched);
                    break;
                case actionType.STAMP_SELECTED:
                    marksAndAnnotationsVisibilityHelper.
                        setMarksAndAnnotationVisibilityOnStampSelectionOrDrag(
                        this.getMarksAndAnnotationVisibilityDetails,
                        this.currentMarkGroupId);
                    this.emit(MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, false);
                    break;
                case actionType.STAMP_PAN:
                    let stampPanAction: stampPanAction = action as stampPanAction;
                    if (stampPanAction.draggedAnnotationClientToken === undefined
                        || stampPanAction.draggedAnnotationClientToken == null) {
                        marksAndAnnotationsVisibilityHelper.
                            setMarksAndAnnotationVisibilityOnStampSelectionOrDrag(
                            this.getMarksAndAnnotationVisibilityDetails,
                            this.currentMarkGroupId);
                        this.emit(MarkingStore.MARKS_AND_ANNOTATION_VISIBILITY_CHANGED, false);
                    }
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    this._navigatingTo = enums.SaveAndNavigate.toWorklist;
                    this.emit(MarkingStore.ACCEPT_QUALITY_ACTION_COMPLETED);
                    break;
                case actionType.UPDATE_SEEN_ANNOTATION:
                    let seenAnnotationAction: updateSeenAnnotationAction = action as updateSeenAnnotationAction;
                    this.isAllPagesAnnotated = seenAnnotationAction.isAllPagesAnnotated;
                    let treeViewItem = seenAnnotationAction.getTreeViewItem;
                    this.updateAllPagesAnnotatedIndicator(treeViewItem);
                    break;
                case actionType.MARK_CHANGE_REASON_UPDATE_ACTION:
                    let _markChangeReasonUpdateAction:
                        markChangeReasonUpdateAction = action as markChangeReasonUpdateAction;

                    this.updateMarkChangeReasons(_markChangeReasonUpdateAction.markChangeReason);
                    this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
                    this.emit(MarkingStore.MARK_CHANGE_REASON_UPDATED);
                    break;

                case actionType.SUPERVISOR_REMARK_DECISION_CHANGE:
                    let _supervisorRemarkDecisionChangeAction:
                        supervisorRemarkDecisionChangeAction = action as supervisorRemarkDecisionChangeAction;

                    this.updateSupervisorRemarkDecision(
                        this.getSupervisorRemarkDecisionType(_supervisorRemarkDecisionChangeAction.remarkDecision));
                    this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
                    this.emit(MarkingStore.SUPERVISOR_REMARK_DECISION_UPDATED);
                    break;
                case actionType.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE_ACTION:
                    let _markChangeReasonNeededMessageAction:
                        showMarkChangeReasonNeededMessageAction = action as showMarkChangeReasonNeededMessageAction;
                    this.emit(
                        MarkingStore.SHOW_MARK_CHANGE_REASON_NEEDED_MESSAGE,
                        _markChangeReasonNeededMessageAction.failureReason,
                        _markChangeReasonNeededMessageAction.navigateTo);
                    break;
                case actionType.SET_MARK_CHANGE_REASON_VISIBILITY_ACTION:
                    let _setMarkChangeReasonVisibilityAction:
                        setMarkChangeReasonVisibilityAction = action as setMarkChangeReasonVisibilityAction;
                    this.updateMarkChangeReasonVisibility(_setMarkChangeReasonVisibilityAction.isMarkChangeReasonVisible);
                    this.emit(MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED);
                    break;
                case actionType.OPEN_MARK_CHANGE_REASON_ACTION:
                    this.emit(MarkingStore.OPEN_MARK_CHANGE_REASON);
                    break;
                case actionType.DYNAMIC_ANNOTATION_MOVE:
                    let _dynamicAnnotationMoveAction = (action as dynamicAnnotationMoveAction);
                    this.emit(MarkingStore.DYNAMIC_ANNOTATION_MOVE, _dynamicAnnotationMoveAction.movingElementProperties);
                    break;
                case actionType.PROCESS_SAVE_AND_NAVIGATION_ACTION:
                    /* set to emit ready to navigate event aftyer the mark save */
                    this.isNavigationStarted = true;
                    this.emit(MarkingStore.SAVE_AND_NAVIGATE_EVENT);
                    break;
                case actionType.UPDATE_WAVY_ANNOTATION_ACTION:
                    this.emit(MarkingStore.UPDATE_WAVY_ANNOTATION_EVENT);
                    break;
                case actionType.RESPONSEPINCHZOOMACTION:
                    this._zoomToWidth = (action as responsePinchZoomAction).markSheetHolderWidth;
                    this.emit(MarkingStore.RESPONSE_PINCH_ZOOM_TRIGGERED);
                    break;
                case actionType.RESPONSEPINCHZOOMCOMPLETED:
                    this._zoomToWidth = 0;

                    let zoomedValue = (action as pinchZoomCompletedAction).zoomedWidth;
                    this.emit(MarkingStore.RESPONSE_PINCH_ZOOM_COMPLETED, zoomedValue);
                    break;
                case actionType.MARK_SCHEME_HEADER_DROP_DOWN_ACTION:
                    this.markSchemeHeaderDropDownOpen = (action as markSchemeHeaderDropDownAction).isheaderDropDownOpen;
                    break;
                case actionType.MARK_SCHEME_SCROLL_ACTION:
                    this.emit(MarkingStore.MARK_SCHEME_SCROLL_ACTION);
                    break;
                case actionType.NON_NUMERIC_INFO_ACTION:
                    this._isNonNumeric = true;
                    break;
                case actionType.NAVIGATION_UPDATE_ACTION:
                    this._navigatingTo = (action as updateNavigationAction).navigateTo;
                    if ((action as updateNavigationAction).doEmit) {
                        this.emit(MarkingStore.NAVIGATION_UPDATED_EVENT, this._navigatingTo);
                    }
                    break;
                case actionType.SET_CURRENT_NAVIGATION_ACTION:
                    this._isNavigationThroughMarkScheme = (action as setCurrentNavigationAction).isNavigationThroughMarkScheme;
                    break;
                case actionType.SET_MARKING_IN_PROGRESS_ACTION:
                    this._isMarkingInProgress = (action as setMarkinginProgressAction).isMarkingInProgress;
                    break;
                case actionType.MARKER_OPERATION_MODE_CHANGED_ACTION:
                    let markerOperationMode: markerOperationModeChangedAction = (action as markerOperationModeChangedAction);
                    this._operationMode = markerOperationMode.operationMode;
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    if (responseDataGetAction.searchedResponseData) {
                        // While opening a response from message, MARKER_OPERATION_MODE_CHANGED_ACTION is not fired,
                        // So set the operation mode . Set marking in case of Supervisor Remark navigation
                        if (responseDataGetAction.searchedResponseData.triggerPoint === enums.TriggerPoint.SupervisorRemark) {
                            this._operationMode = enums.MarkerOperationMode.Marking;
                        } else if (responseDataGetAction.searchedResponseData.isTeamManagement) {
                            this._operationMode = enums.MarkerOperationMode.TeamManagement;
                        } else if (responseDataGetAction.searchedResponseData.isStandardisationSetup) {
                            this._operationMode = enums.MarkerOperationMode.StandardisationSetup;
                        }
                    }
                    break;
                case actionType.SHOW_RESPONSE_NAVIGATION_FAILURE_REASON_ACTION:
                    this._combinedWarningMessage = (action as showResponseNavigationFailureReasonAction).combinedWarningMessage;
                    this.emit(MarkingStore.SHOW_RESPONSE_NAVIGATION_FAILURE_REASONS_POPUP_EVENT,
                        (action as showResponseNavigationFailureReasonAction).navigatingTo);
                    break;
                case actionType.REJECT_RIG_CONFIRMATION_ACTION:
                    this._isMarkingInProgress = false;
                    break;
                case actionType.OPEN_SUPERVISOR_REMARK_DECISION:
                    this.emit(MarkingStore.OPEN_SUPERVISOR_REMARK_DECISION);
                    break;
                case actionType.COPIED_PREVIOUS_MARKS_AND_ANNOTATIONS:
                    this.emit(MarkingStore.PREVIOUS_MARKS_AND_ANNOTATIONS_COPIED);
                    break;
                case actionType.ZOOM_ANIMATION_END:
                    let animationEndAction = action as zoomAnimationEndAction;
                    this.emit(MarkingStore.RESPONSE_IMAGE_ANIMATION_COMPLETED_EVENT, animationEndAction.doReRender);
                    break;
                case actionType.SAVE_ENHANCED_OFFPAGE_COMMENTS_ACTION:
                    let saveEnhancedOffPageComment = action as saveEnhancedOffPageCommentAction;
                    switch (saveEnhancedOffPageComment.markingOperation) {
                        case enums.MarkingOperation.deleted:
                            this.removeEnhancedOffPageComment(saveEnhancedOffPageComment.enhancedOffPageClientTokensToBeDeleted);
                            break;
                        case enums.MarkingOperation.updated:
                            this.updateEnhancedOffPageComment(saveEnhancedOffPageComment.enhancedOffPageClientTokensToBeDeleted[0],
                                saveEnhancedOffPageComment.commentText,
                                saveEnhancedOffPageComment.selectedMarkSchemeId,
                                saveEnhancedOffPageComment.selectedFileId);
                            break;
                        case enums.MarkingOperation.added:
                            this.addEnhancedOffPageComment(saveEnhancedOffPageComment.commentText,
                                saveEnhancedOffPageComment.selectedMarkSchemeId,
                                saveEnhancedOffPageComment.selectedFileId);
                            break;
                    }
                    this.emit(MarkingStore.ENHANCED_OFF_PAGE_COMMENT_UPDATE_COMPLETED_EVENT);
                    break;
                case actionType.REMOVE_MARK_ENTRY_SELECTION:
                    this.emit(MarkingStore.REMOVE_MARK_ENTRY_SELECTION);
                    break;
                case actionType.SIMULATION_TARGET_COMPLETED:
                    if (this._isMarkingInProgress) {
                        this._isMarkingInProgress = false;
                    }
                    break;
                case actionType.UPDATE_ALL_FILES_VIEWED_STATUS:
                    this._isAllFilesViewedStatusUpdated = true;
                    this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
                    this.emit(MarkingStore.ALL_FILES_VIEWED_CHECK);
                    break;
                case actionType.BOOKMARK_ADDED_ACTION:
                    let bookmarkAddedAction = action as bookmarkAddedAction;
                    let bookmark: bookmark = bookmarkAddedAction.bookmarkToAdd;
                    this._selectedBookmarkClientToken = bookmarkAddedAction.bookmarkToAdd ?
                        bookmarkAddedAction.bookmarkToAdd.clientToken : undefined;
                    this.addBookmark(bookmark);
                    this.emit(MarkingStore.BOOKMARK_ADDED_EVENT);
                    break;
                case actionType.BOOKMARK_SELECTED_ACTION:
                    let bookmarkSelectedAction = action as bookmarkSelectedAction;
                    let clientToken: string = bookmarkSelectedAction.clientToken;
                    this.emit(MarkingStore.BOOKMARK_SELECTED_EVENT, clientToken);
                    break;
                case actionType.BOOKMARK_GO_BACK_BUTTON_CLICK_ACTION:
                    this.emit(MarkingStore.GO_BACK_BUTTON_CLICK_EVENT);
                    break;
                case actionType.UPDATE_ANNOTATION_SELECTION:
                    this.emit(MarkingStore.ANNOTATION_SELECTION_UPDATED_EVENT, (action as updateAnnotationSelectionAction).isSelected);
                    break;
                case actionType.UPDATE_BOOKMARK_NAME_ACTION:
                    let updateBookmarkNameAction = action as updateBookmarkNameAction;
                    let bookmarkNameToSave: string = updateBookmarkNameAction.bookmarkNameToSave;
                    let bookmarkClientTokenToSave: string = updateBookmarkNameAction.bookmarkClientToken;
                    this.updateBookmarkName(bookmarkNameToSave, bookmarkClientTokenToSave);
                    break;
                case actionType.SHOW_OR_HIDE_BOOKMARK_NAME_BOX:
                    let showOrHideBookmarkNameBoxAction = action as showOrHideBookmarkNameBoxAction;
                    let bookmarkText: string = showOrHideBookmarkNameBoxAction.bookmarkText;
                    let clientTokenBookmark: string = showOrHideBookmarkNameBoxAction.clientToken;
                    let bookmarkIsVisible: boolean = showOrHideBookmarkNameBoxAction.isVisible;
                    let rotatedAngle: enums.RotateAngle = showOrHideBookmarkNameBoxAction.rotatedAngle;
                    if (!bookmarkIsVisible) {
                        // if the bookmark box is closed along with this action, reset token
                        this._selectedBookmarkClientToken = undefined;
                    }
                    this.emit(MarkingStore.SHOW_OR_HIDE_BOOKMARK_NAME_BOX_EVENT, bookmarkText,
                        clientTokenBookmark, bookmarkIsVisible, rotatedAngle);
                    break;
                case actionType.ACETATE_POSITION_UPDATE_ACTION:
                    let acetatePositionUpdateAction = action as acetatePositionUpdateAction;
                    let acetate = acetatePositionUpdateAction.acetate;
                    let acetateAction = acetatePositionUpdateAction.acetateAction;
                    this.emit(MarkingStore.ACETATE_POSITION_UPDATED, acetate, acetateAction);
                    break;
                case actionType.VALIDATE_RESPONSE:
                    let validateResponseAction = action as validateResponseAction;

                    if (validateResponseAction.validateResponseReturnData.success &&
                        validateResponseAction.validateResponseReturnData.responseReturnErrorCode ===
                        enums.ReturnErrorCode.QigSessionClosed) {
                        this.emit(MarkingStore.SESSION_CLOSED_FOR_EXAMINER_EVENT);
                    } else if (validateResponseAction.validateResponseReturnData.success &&
                        validateResponseAction.validateResponseReturnData.responseReturnErrorCode ===
                        enums.ReturnErrorCode.WithdrawnResponse &&
                        validateResponseAction.validateResponseReturnData.markGroupId === this._currentMarkGroupId) {
                        this.emit(MarkingStore.WITHDRAWN_RESPONSE_EVENT, validateResponseAction.isStandardisationSetupValidation);
                    } else if (validateResponseAction.validateResponseReturnData.success &&
                        validateResponseAction.validateResponseReturnData.responseReturnErrorCode ===
                        enums.ReturnErrorCode.MarkingModeChanged &&
                        validateResponseAction.validateResponseReturnData.markGroupId === this._currentMarkGroupId &&
                        validateResponseAction.isStandardisationSetupValidation) {
                        this.emit(MarkingStore.MARKINGMODE_CHANGED_IN_PROVISIONAL_RESPONSE_EVENT);
                    }
                    break;
                case actionType.UPDATE_MARKING_DETAILS:
                    let updateMarkingDetailsAction = action as updateMarkingDetailsAction;
                    this.updateMarkingProgress(updateMarkingDetailsAction.markDetails,
                        updateMarkingDetailsAction.isAllPagesAnnotated,
                        updateMarkingDetailsAction.markGroupId);
                    break;
                case actionType.ROTATION_COMPLETED_ACTION:
                    this._isRotating = false;
                    this.emit(MarkingStore.ROTATION_COMPLETED_EVENT);
                    break;
                case actionType.STAY_IN_RESPONSE_ACTION:
                    this._showNavigationOnMbqPopup = false;
                    this.isNavigationStarted = false;
                    break;
                case actionType.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE:
                    let copymarksandannotationasdefinitiveaction = action as copymarksandannotationasdefinitiveaction;
                    let copymarksandannotationasdefinitive = copymarksandannotationasdefinitiveaction.isCopyMarkAsDefinitive;
                    let doCopyPreviousMark = copymarksandannotationasdefinitiveaction.doCopyPreviousMark;
                    this._isClearMarkAsDefinitive = !copymarksandannotationasdefinitiveaction.isCopyMarkAsDefinitive;
                    this._hasDefinitiveMarks = true;
                    // only copy if provision is marked by different marker
                    if (doCopyPreviousMark) {
                        // copy marks and annotation as provisional and set visibility for the same
                        this.copyProvisionalMarksAndAnnotation();
                        this.setProvisionalMarksAndAnnotationVisibility();
                        this.emit(MarkingStore.COPY_MARKS_AND_ANNOTATION_AS_DEFINITIVE);
                    }
                    this._isMarkingInProgress = copymarksandannotationasdefinitiveaction.hasAdditionalObject ? false : true;
                    if (!copymarksandannotationasdefinitive) {
                        // updating the progress to 0%, on clearMarksAndAnnotation option on Mark as Definitive popup.
                        this._currentResponseMarkingProgress = 0;
                    }
                    break;
                case actionType.DISCARD_STANDARDISATION_RESPONSE:
                    this._isMarkingInProgress = false;
                    break;
                case actionType.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_ACTION:
                    let showMarkConfirmationOnEnterAction = (action as showMarkConfirmationPopupOnEnterAction);
                    this._keyCode = showMarkConfirmationOnEnterAction.keyBoardEvent.keyCode;
                    this.emit(MarkingStore.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_EVENT, showMarkConfirmationOnEnterAction.keyBoardEvent);
                    break;
                case actionType.QIGSELECTOR:
                    let _qigSelectorDataFetchAction: qigSelectorDataFetchAction = action as qigSelectorDataFetchAction;
                    if (this.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup
                        && _qigSelectorDataFetchAction.getQigToBeFetched > 0) {
                        let selectedQig: any = _qigSelectorDataFetchAction.getOverviewData.qigSummary.filter(
                            (x: qigSummary) => x.markSchemeGroupId === _qigSelectorDataFetchAction.getQigToBeFetched).first();
                        this._standardisationSetupPermissionData = stdSetupPermissionHelper.generateSTDSetupPermissionData(
                            selectedQig.standardisationSetupPermissionCCValue, selectedQig.role);
                    }
                    break;
                case actionType.STANDARDISATION_SETUP_WORKLIST_SELECT_ACTION:
                    let standardisationLeftPanelWorkListSelectAction = (action as standardisationSetupSelectWorkListAction);
                    this._selectedstandardisationSetupWorklist = standardisationLeftPanelWorkListSelectAction.selectedWorkList;
                    break;
                case actionType.UPDATE_DEFINITIVE_MARKS_FOR_DIFFERENT_MARKER:
                    let updateDefinitiveMarksForDifferentMarkerAction = action as updateDefinitiveMarksForDifferentMarkerAction;

                    this.updateDefinitiveMarksForDifferentMarker(updateDefinitiveMarksForDifferentMarkerAction.examinerRoleId,
                        updateDefinitiveMarksForDifferentMarkerAction.deleteProvisionalMarks);
                    break;
                case actionType.DELETE_PROVISIONAL_MARKS:
                    this.deleteProvisionalMarksIfSameExaminer();
                    break;
                case actionType.COPY_MARKS_FOR_DEFINITIVE:
                    let copyMarksForDefinitiveAction = action as copyMarksForDefinitiveAction;

                    this.copyOrUpdateMarksForDefinitive(copyMarksForDefinitiveAction.isDefinitive, copyMarksForDefinitiveAction.copyMarks);

                    if (!copyMarksForDefinitiveAction.avoidEventEmit) {
                        this.emit(MarkingStore.COPY_MARKS_FOR_DEFINITIVE_EVENT, false);
                    }
                    break;
            }
        });

        // this.stampHelper = new stampStoreHelper();
    }

    /**
     * Update row version for save and classify action
     * @param data
     */
    private updateRowVersion(rowVersion: string) {
        this._updatedRowVersionOnSaveAndClassify = rowVersion;
    }

    /**
     * Get the updated row version on save and classify
     */
    public get getUpdatedRowVersionOnSaveAndClassify(): string {
        return this._updatedRowVersionOnSaveAndClassify;
    }

    /**
     * Updating usedInTotal and total mark after save.
     * @param unUsedMarkschemeIds
     * @param TotalMarks
     * @param markingProgress
     */
    private updateUsedInTotalAndTotalMark(
        markGroupId: number,
        unUsedMarkschemeIds: Immutable.List<number>,
        totalMarks: number,
        markingProgress: number) {
        let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[markGroupId];
        var allMarksAndAnnotations: examinerMarksAndAnnotation =
            examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0];

        allMarksAndAnnotations.totalMarks = totalMarks;
        this.clearUsedInTotal(markGroupId);
        if (markingProgress === 100) {
            allMarksAndAnnotations.examinerMarksCollection.map((_examinerMark: examinerMark) => {

                unUsedMarkschemeIds.forEach((_markSchemeId: number) => {
                    if (_markSchemeId === _examinerMark.markSchemeId) {
                        _examinerMark.usedInTotal = false;
                    }
                });
            });
        }
    }

    /**
     * Save Action Triggers from several area like, worklist, home, inbox, menu and BackgroundWorker
     * If It happens from Back ground, User may have already triggered other actions and this needs to be captured for navigation
     * @param saveMarksAndAnnotationTriggeringPoint
     */
    private setSaveMarksAndAnnotationTriggeringPoint
        (saveMarksAndAnnotationTriggeringPoint: enums.SaveMarksAndAnnotationsProcessingTriggerPoint) {
        if (this._saveMarksAndAnnotationTriggeringPoint === enums.SaveMarksAndAnnotationsProcessingTriggerPoint.None
            || saveMarksAndAnnotationTriggeringPoint !== enums.SaveMarksAndAnnotationsProcessingTriggerPoint.BackgroundWorker) {
            this._saveMarksAndAnnotationTriggeringPoint = saveMarksAndAnnotationTriggeringPoint;
        }
    }

    /**
     * get the navigation mbq poup.
     */
    public get showNavigationOnMbqPopup(): boolean {
        return this._showNavigationOnMbqPopup;
    }

    /**
     * get the combinedWarningMessage
     */
    public get combinedWarningMessage() {
        return this._combinedWarningMessage;
    }

    public get getUpdatedStampId(): number {
        return this.updatedStampId;
    }

    /**
     * get the client token of the selected bookmark.
     */
    public get selectedBookmarkClientToken(): string {
        return this._selectedBookmarkClientToken;
    }

    /**
     * return the default mark scheme panel width
     */
    public getDefaultPanelWidth(): string {
        return this._defaultMarkSchemePanelWidthInPixel;
    }

    /**
     * set in mark scheme header dropdown open and close.
     */
    public get isMarkSchemeHeaderDropDownOpen(): boolean {
        return this.markSchemeHeaderDropDownOpen;
    }

    /**
     * return the new default mark scheme panel width after column updated
     */
    public getDefaultPanelWidthAfterColumnIsUpdated(): string {
        return this._newDefaultMarkSchemePanelWidthInPixel;
    }

    /**
     * return minimum width of mark scheme panel
     */
    public getMinimumPanelWidth(): string {
        return this._minimumPanelWidthInPixel;
    }

    /**
     * return the previous mark list column width
     */
    public getPreviousMarkListWidth(): number {
        return this._previousMarkListWidthInPixel;
    }

    /**
     * return panel resizing classname
     */
    public getResizedPanelClassName(): string {
        return this._resizePanelClassName;
    }


    /**
     * Emit event to reset mark and annotation
     * @param {boolean} resetMark
     * @param {boolean} resetAnnotation
     * @param {string} previousMark
     */
    private resetMarksAndAnnotation(resetMark: boolean, resetAnnotation: boolean, previousMark: AllocatedMark): void {
        this.emit(MarkingStore.RESET_MARK_AND_ANNOTATION, resetMark, resetAnnotation, previousMark);
    }

    /**
     * Save mark to the marks collection
     * @param markDetails
     * @param isUpdateUsedInTotalOnly - whether to update only the used in total field.
     * @param isUpdateMarkingProgress - whether to update the current marking progress or not.
     * @param markGroupId - markGroupId for the rig in a Whole response/ current markGroupId for single QIG
     */
    private saveMark(markDetails: markChangeDetails, isUpdateUsedInTotalOnly: boolean,
        isUpdateMarkingProgress: boolean): void {

        let markGroupId: number = markDetails.markGroupId;
        this.setCurrentMarkDetails(markDetails.markSchemeId, markGroupId);

        /**
         * TODO : Refactor this with three seperate events/action for below three cases.
         * There are thre ways to trigger this save mark
         * 1. On entering mark which requires both emiting event and update mark progress
         *       - (isUpdateUsedInTotalOnly - FALSE, isUpdateMarkingProgress - TRUE)
         * 2. While calculating used in total which does not requires emiting event and update mark progress
         *       - (isUpdateUsedInTotalOnly - TRUE, isUpdateMarkingProgress - FALSE)
         * 3. Entering NR on complete button which does not requires emiting event but need update mark progress
         *       - (isUpdateUsedInTotalOnly - TRUE, isUpdateMarkingProgress - TRUE)
         */

        if (isUpdateMarkingProgress === true) {
            this.updateCurrentQuestionItemInfo(markDetails.mark, markDetails.usedInTotal);

            this.updateMarkingDetails(markGroupId,
                markDetails.markingProgress,
                markDetails.totalMark,
                markDetails.totalMarkedMarkSchemes,
                markDetails.isAllNR,
                markDetails.isAllPagesAnnotated,
                markDetails.markSchemeCount);
        } else {
            let currntMarkProgress = this.getMarkingProgressDetails(markGroupId);

            if (!currntMarkProgress) {
                currntMarkProgress = new markingProgressDetails();
            }

            /* update the marking progress with current details to persist the same */
            this.updateMarkingDetails(markGroupId,
                currntMarkProgress.markingProgress,
                currntMarkProgress.totalMarks,
                currntMarkProgress.markCount,
                currntMarkProgress.isAllNR,
                currntMarkProgress.isAllPagesAnnotated,
                currntMarkProgress.markSchemeCount);
        }

        /* For updating usedintotal based dirty flag no need to set the progress details and emit event*/
        if (isUpdateUsedInTotalOnly === false) {

            switch (markDetails.markingOperation) {
                case enums.MarkingOperation.added:
                    this.addOrUpdateMark(markDetails.mark, markDetails.markSchemeId, markGroupId, markDetails.usedInTotal);
                    break;
                case enums.MarkingOperation.updated:
                    this.updateMark
                        (markDetails.mark, markDetails.isDirty, markDetails.usedInTotal, false, markDetails.markSchemeId, markGroupId);
                    break;
                case enums.MarkingOperation.deleted:
                    this.deleteMark(markDetails.markSchemeId, markGroupId);
                    break;
            }

            this.emit(MarkingStore.MARK_SAVED);

        } else {
            /*used in total change would be always update, add will cover as part of mark entry itself*/
            /* If the mark is a new entry and not yet saved in db and updating as part of isUpdateUsedInTotalOnly
               then set the marking operation as added */
            if (this._currentExaminerMark) {
                this._currentExaminerMark.markingOperation = this._currentExaminerMark.markId === 0 ?
                    enums.MarkingOperation.added : enums.MarkingOperation.updated;
            }
            this.addOrUpdateMark(markDetails.mark, markDetails.markSchemeId, markGroupId, markDetails.usedInTotal);
        }

        // In the case of MarkByAnnotation, the isDirty flag for the associated annotation is set to TRUE only when the mark object's
        // dirty flag is set to TRUE. Otherwise there's chance that the annotation alone can get saved during a background save call.
        if ((this._annotationUniqueIds != null && this._annotationUniqueIds.length > 0) ||
            (this._removeAnnotationList != null && this._removeAnnotationList.length > 0)) {
            this.updateDirtyFlagForAssociatedAnnotations();
            this._annotationUniqueIds = new Array<string>();
        }
    }

    /**
     * Method updates the dirty flag for the associated annotation
     */
    private updateDirtyFlagForAssociatedAnnotations() {
        for (let index = 0; index < this._annotationUniqueIds.length; index++) {
            let annotation: Array<examinerAnnotations> = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations.filter((x: examinerAnnotations) => x.uniqueId === this._annotationUniqueIds[index]);
            if (annotation && annotation.length > 0) {
                annotation[0].isDirty = true;
            }
        }

        // logic for updating dirty flag for removed annotation 
        for (let index = 0; index < this._removeAnnotationList.length; index++) {
            let removeAnnotation: Array<examinerAnnotations> = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations
                .filter((x: examinerAnnotations) => x.clientToken === this._removeAnnotationList[index]);
            if (removeAnnotation && removeAnnotation.length > 0) {
                removeAnnotation[0].isDirty = true;
            }
        }
    }

    /**
     * Updating the marking details which will be used for saving
     * @param markGroupId
     * @param markingProgress
     * @param totalMark
     * @param totalMarkedMarkSchemes
     * @param isAllNR
     */
    private updateMarkingDetails(markGroupId: number,
        markingProgress: number,
        totalMark: number,
        totalMarkedMarkSchemes: number,
        isAllNR: boolean,
        isAllPagesAnnotated: boolean,
        markSchemeCount: number): void {
        let progressDetails: markingProgressDetails;

        if (!this._markingProgressDetails) {
            this._markingProgressDetails = Immutable.Map<number, markingProgressDetails>();
        }

        progressDetails = new markingProgressDetails();
        progressDetails.isAllNR = isAllNR;
        progressDetails.markingProgress = markingProgress;
        progressDetails.isAllPagesAnnotated = isAllPagesAnnotated;
        progressDetails.markSchemeCount = markSchemeCount;

        if (this.isDefinitiveMarking) {
            progressDetails.markCount = markSchemeCount;
            progressDetails.totalDefinitiveMarks = totalMark;

            if (this._examinerRoleId === qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId) {
                progressDetails.totalMarks = totalMark;
            } else {
                progressDetails.totalMarks = this.getProvisionalTotalMarks;
            }
        } else {
            progressDetails.markCount = totalMarkedMarkSchemes;
            progressDetails.totalMarks = totalMark;
        }

        this._markingProgressDetails = this._markingProgressDetails.set(markGroupId, progressDetails);
    }

    /**
     * Update all page annotation indicator
     */
    private updateAllPagesAnnotatedIndicator(treeViewItem: treeViewItem) {
        let currntMarkProgress = this.getMarkingProgressDetails(this.currentMarkGroupId);

        if (!currntMarkProgress) {
            this.updateMarkingDetails(this.currentMarkGroupId,
                treeViewItem.markingProgress,
                parseFloat(treeViewItem.totalMarks),
                treeViewItem.markCount,
                treeViewItem.isAllNR,
                true,
                treeViewItem.markSchemeCount);
        } else {
            /* update the marking progress with current details to persist the same */
            this.updateMarkingDetails(this.currentMarkGroupId,
                currntMarkProgress.markingProgress,
                currntMarkProgress.totalMarks,
                currntMarkProgress.markCount,
                currntMarkProgress.isAllNR,
                true,
                currntMarkProgress.markSchemeCount);
        }

        if (this._isWholeResponse && this.getRelatedWholeResponseQIGIds().length > 1) {
            let markDetails: MarkDetails;
            //this.treeViewHelper = new treeviewDataHelper();
            let relatedQIGMarkSchemeGroupIds: number[] = this.getRelatedWholeResponseQIGIds();
            relatedQIGMarkSchemeGroupIds.forEach((markSchemeGroupdId: number) => {
                markDetails = this.getSelectedQigMarkingProgressDetails
                    (treeViewItem, markSchemeGroupdId);
                this.updateMarkingProgress(markDetails,
                    true,
                    this.getMarkGroupIdQIGtoRIGMap(markSchemeGroupdId));
            });
        }
    }

    /**
     * Update the currentquestioniteminfo when navigating to full response view
     * @param mark The mark
     * @param usedIntotal whether used for total or not
     */
    private updateCurrentQuestionItemInfo(allocatedMark: AllocatedMark, usedIntotal: boolean): void {
        if (this.currentQuestionItemInfo) {
            this.currentQuestionItemInfo.allocatedMarks = allocatedMark;
            this.currentQuestionItemInfo.usedInTotal = usedIntotal;
        }
    }

    /**
     * Set the current mark details
     * @param markSchemeId
     */
    private setCurrentMarkDetails(markSchemeId: number, markGroupId: number): void {
        this._currentExaminerMarks = undefined;
        this._currentExaminerMark = undefined;
        this._currentExaminerMarks = this._examinerMarksAgainstResponse[this.currentMarkGroupId].
            examinerMarkGroupDetails[markGroupId].
            allMarksAndAnnotations[0].examinerMarksCollection;

        let _curExaminerMarks: Array<examinerMark> = this._examinerMarksAgainstResponse[this.currentMarkGroupId].
            examinerMarkGroupDetails[markGroupId].
            allMarksAndAnnotations[0].examinerMarksCollection;
        let examinerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;

        if (this.isUnclassifiedOrClassified) {
            _curExaminerMarks = _curExaminerMarks.filter((x: examinerMark) =>
                x.definitiveMark === this.isDefinitiveMarking && x.examinerRoleId === examinerRoleId);
        }

        let _examinerMarks: Array<examinerMark> = _curExaminerMarks.
            filter((x: examinerMark) => x.markSchemeId === markSchemeId);

        this._currentExaminerMark = _examinerMarks && _examinerMarks.length > 0 ?
            _examinerMarks[0] : undefined;
    }

    /**
     * Add mark or update the already added mark
     * @param mark
     * @param markSchemeId
     * @param markGroupId
     * @param usedInTotal
     */
    private addOrUpdateMark(mark: AllocatedMark, markSchemeId: number, markGroupId: number, usedInTotal: boolean): void {
        if (this._currentExaminerMark) {
            this.updateMark(mark, true, usedInTotal, true, markSchemeId, markGroupId);

        } else {
            this.addMark(mark, markSchemeId, markGroupId, usedInTotal);
        }
    }

    /**
     * Add a mark to the collection
     * @param mark
     * @param markSchemeId
     * @param markGroupId
     * @param usedInTotal
     */
    private addMark(mark: AllocatedMark, markSchemeId: number, markGroupId: number, usedInTotal: boolean): void {

        let _markValue = (mark.valueMark) ? mark.valueMark : mark.displayMark;
        let _mark: examinerMark = {
            numericMark: ((mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? 0 : parseFloat(_markValue)),
            nonnumericMark: ((mark.valueMark) ? ((mark.displayMark === NOT_ATTEMPTED) ? null : mark.displayMark) : null),
            markStatus: (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? NR_MARK_STATUS : null,
            markId: 0,
            markSchemeId: markSchemeId,
            candidateScriptId: this.candidateScriptId,
            examinerRoleId: this.getExaminerRoleQIGtoRIGMap(this.currentMarkGroupId, markGroupId),
            markGroupId: markGroupId,
            rowVersion: '',
            usedInTotal: usedInTotal,
            notAttempted: (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? true : false,
            version: 0,
            isDirty: true,
            uniqueId: htmlUtilities.guid,
            markingOperation: enums.MarkingOperation.added,
            definitiveMark: this.isUnclassifiedOrClassified && this.isDefinitiveMarking
        };
        this._currentExaminerMarks.push(_mark);

        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
    }

    /**
     * Update the mark in the mark collection
     * @param mark
     * @param isDirty
     * @param isAlreadyAdded
     * @param markSchemeId
     */
    private updateMark(mark: AllocatedMark,
        isDirty: boolean,
        usedInTotal: boolean,
        isAlreadyAdded: boolean = false,
        markSchemeId: number,
        markGroupId: number
    ): void {
        if (this._currentExaminerMark) {

            let _markValue = (mark.valueMark) ? mark.valueMark : mark.displayMark;

            this._currentExaminerMark.nonnumericMark = (mark.valueMark) ? ((mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? null
                : mark.displayMark) : null;
            this._currentExaminerMark.numericMark = (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? 0 : parseFloat(_markValue);

            this._currentExaminerMark.markStatus = (mark.displayMark.toUpperCase() === NOT_ATTEMPTED) ? NR_MARK_STATUS : null;
            this._currentExaminerMark.usedInTotal = usedInTotal;
            this._currentExaminerMark.notAttempted = (mark.displayMark.toUpperCase() === NOT_ATTEMPTED);

            /* if the mark is already added then need to update the marking operation */
            if (!isAlreadyAdded) {
                // If the mark is dirty, then set the marking operation as updated
                this._currentExaminerMark.markingOperation = isDirty ? enums.MarkingOperation.updated : enums.MarkingOperation.none;
                // If the mark is a new entry, then set the marking operation as added
                this._currentExaminerMark.markingOperation = isDirty && this._currentExaminerMark.markId === 0 ?
                    enums.MarkingOperation.added : this._currentExaminerMark.markingOperation;
            }
            this._currentExaminerMark.isDirty = isDirty;
            this._currentExaminerMark.uniqueId = htmlUtilities.guid;

            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
        } else {
            this.addMark(mark, markSchemeId, markGroupId, usedInTotal);
        }
    }

    /**
     * Delete the mark from the mark collection
     * @param markSchemeId
     */
    private deleteMark(markSchemeId: number, markGroupId: number): void {
        if (this._currentExaminerMark) {
            if (this._currentExaminerMark.markId > 0 || this._currentExaminerMark.isPickedForSaveOperation === true) {
                this._currentExaminerMark.markingOperation = enums.MarkingOperation.deleted;
                this._currentExaminerMark.isDirty = true;
                this._currentExaminerMark.uniqueId = htmlUtilities.guid;

                // Update the marks and annotations save queue status to Await Queueing
                this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
            } else {
                this._currentExaminerMarks.splice(
                    this._currentExaminerMarks.indexOf(this._currentExaminerMark), 1);
            }
        }
    }

    /**
     * update the examinerMarks dirty status.
     * @param saveMarksAndAnnotationsData
     */
    private updateExaminerMarksAndAnnotationsData(parentMarkGroupId: number,
        saveMarksAndAnnotationsData: saveMarksAndAnnotationsReturn) {

        // update the existing data if there is no error
        if (saveMarksAndAnnotationsData.saveMarksErrorCode === enums.SaveMarksAndAnnotationErrorCode.None) {
            // update the examiner mark data against the response.
            let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[parentMarkGroupId];
            let that = this;
            var marksAndAnnotations: Immutable.List<MarksAndAnnotationsToReturn>;
            var updatedMarkAnnotationDetails: Immutable.Map<number, MarksAndAnnotationsToReturn> =
                saveMarksAndAnnotationsData.updatedMarkAnnotationDetails;
            if (updatedMarkAnnotationDetails) {
                updatedMarkAnnotationDetails.forEach((marksAndAnnotations: MarksAndAnnotationsToReturn,
                    markSchemeGroupId: number) => {
                    if (marksAndAnnotations) {
                        let markGroupId: number = marksAndAnnotations.markGroupId;
                        var allMarksAndAnnotations: examinerMarksAndAnnotations =
                            examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                        // Updating mark group version
                        allMarksAndAnnotations[0].version = saveMarksAndAnnotationsData.updatedMarkGroupVersions.get(markSchemeGroupId);
                        marksAndAnnotations.examinerMarkToReturn.map((x: ExaminerMarkToReturn) => {
                            /**
                             * update the examiner marks if marks is edited again before the callback
                             * then we won't update the isDirty fields.
                             */
                            allMarksAndAnnotations[0].examinerMarksCollection.map
                                (function (y: examinerMark, index: number, arr: examinerMark[]) {
                                    that.setOrResetDirtyFlagOnTheMarkItem(x, y, arr, index);
                                });
                        });
                        /**
                         * update the annotations if annotation is edited again before the callback
                         * then we won't update the isDirty fields.
                         */
                        marksAndAnnotations.annotationToReturn.map((x: AnnotationToReturn) => {
                            allMarksAndAnnotations[0].annotations.map
                                (function (y: examinerAnnotations, index: number, arr: annotation[]) {
                                    that.setOrResetDirtyFlagOnTheAnnotationItem(x, y, arr, index);
                                });
                        });
                        /**
                         * update the annotations if examiner enhanced off page comments is edited again before the callback
                         * then we won't update the isDirty fields.
                         */
                        marksAndAnnotations.enhancedOffPageCommentToReturn.map((x: EnhancedOffPageCommentToReturn) => {
                            allMarksAndAnnotations[0].enhancedOffPageComments.map
                                (function (y: EnhancedOffPageComment, index: number, arr: EnhancedOffPageComment[]) {
                                    that.setOrResetDirtyFlagOnTheEnhancedOffPageCommentItem(x, y, arr, index);
                                });
                        });

                        marksAndAnnotations.bookmarksToReturn.map((x: BookmarkToReturn) => {
                            allMarksAndAnnotations[0].bookmarks.map
                                (function (y: bookmark, index: number, arr: bookmark[]) {
                                    that.setOrResetDirtyFlagOnTheBookmarkItem(x, y, arr, index);
                                });
                        });

                        // resetting the IsBackGroundSave property
                        examinerMarksAndAnnotations.IsBackGroundSave = false;
                    }
                });
            }
        } else {
            // set hasNonRecoverableError and clear the existing data.
            this.setAsNonRecoverableItem(parentMarkGroupId, saveMarksAndAnnotationsData.saveMarksErrorCode);
        }
    }

    /**
     * This particular method sets or resets the dirty flag on the mark item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the examinerMark object
     * Ideally, whenever a change is made to the examinerMark object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the mark objects to be saved
     * The same uniqueId will form the part of the return mark object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param markFromGateway
     * @param markInClient
     * @param arr
     * @param index
     */
    private setOrResetDirtyFlagOnTheMarkItem(markFromGateway: ExaminerMarkToReturn,
        markInClient: examinerMark,
        arr: examinerMark[],
        index: number) {
        if (markFromGateway.uniqueId === markInClient.uniqueId) {
            if (markInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent mark item, if marking operation is deleted.
                arr.splice(index, 1);
            } else {
                markInClient.isDirty = false;
                markInClient.rowVersion = markFromGateway.rowVersion;
                markInClient.version = markFromGateway.version;
                markInClient.markId = markFromGateway.markId;
                markInClient.markingOperation = enums.MarkingOperation.none;
            }
            markInClient.isPickedForSaveOperation = false;
        } else if (this.isDirtyFlagMissingForTheMark(markFromGateway, markInClient)) {
            markInClient.isDirty = true;
            markInClient.isPickedForSaveOperation = false;
            this.setMarkPropertiesBasedOnThePreviousSaveReturn(markFromGateway, markInClient);
        }
    }

    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when a mark object got changed and the 5 minutes background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the mark object. Since the uniqueId is different we are sure that
     *                      there's some change made to the mark object at the client side before the save call came back. Hence we just
     *                      compare the clientTokens and if the isDirty flag is false to identify the mark object in this method and
     *                      subsequently sets the isDirty flag to TRUE.
     * @param markFromGateway
     * @param markInClient
     */
    private isDirtyFlagMissingForTheMark(markFromGateway: ExaminerMarkToReturn,
        markInClient: examinerMark): boolean {
        return markFromGateway.markSchemeId === markInClient.markSchemeId;
    }

    /**
     * This particular method sets or resets the dirty flag on the annotation item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the annotation object
     * Ideally, whenever a change is made to the annotation object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the annotation objects to be saved
     * The same uniqueId will form the part of the return annotation object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param annotationFromGateway
     * @param annotationInClient
     * @param arr
     * @param index
     */
    private setOrResetDirtyFlagOnTheAnnotationItem(annotationFromGateway: AnnotationToReturn,
        annotationInClient: annotation,
        arr: annotation[],
        index: number) {
        if (annotationFromGateway.uniqueId === annotationInClient.uniqueId) {
            if (annotationInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent annotation item, if marking operation is deleted.
                arr.splice(index, 1);
            } else {
                annotationInClient.isDirty = false;
                annotationInClient.rowVersion = annotationFromGateway.rowVersion;
                annotationInClient.version = annotationFromGateway.version;
                annotationInClient.annotationId = annotationFromGateway.annotationId;
                annotationInClient.markingOperation = enums.MarkingOperation.none;
            }
            annotationInClient.isPickedForSaveOperation = false;
        } else if (this.isDirtyFlagMissingForTheAnnotation(annotationFromGateway, annotationInClient)) {
            annotationInClient.isDirty = true;
            annotationInClient.isPickedForSaveOperation = false;
            this.setAnnotationPropertiesBasedOnThePreviousSaveReturn(annotationFromGateway, annotationInClient);
        }
    }

    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when an annotation object got changed and the 5 minutes background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the annotation object. Since the uniqueId is different we are sure that
     *                      there's some change made to the annotation object at the client side before the save call came back. Hence
     *                      we just compare the clientTokens and if the isDirty flag is false to identify the annotation object in this
     *                      method and subsequently sets the isDirty flag to TRUE.
     * @param annotationFromGateway
     * @param annotationInClient
     */
    private isDirtyFlagMissingForTheAnnotation(annotationFromGateway: AnnotationToReturn, annotationInClient: annotation): boolean {
        return annotationFromGateway.clientToken === annotationInClient.clientToken;
    }

    /**
     * This particular method sets or resets the dirty flag on the enhancedOffPageComment item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the enhancedOffPageComment object
     * Ideally, whenever a change is made to the enhancedOffPageComment object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the enhancedOffPageComment objects to be saved
     * The same uniqueId will form the part of the return annotation object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param enhancedOffPageCommentFromGateway
     * @param enhancedOffPageCommentInClient
     * @param arr
     * @param index
     */
    private setOrResetDirtyFlagOnTheEnhancedOffPageCommentItem(enhancedOffPageCommentFromGateway: EnhancedOffPageCommentToReturn,
        enhancedOffPageCommentInClient: EnhancedOffPageComment,
        arr: EnhancedOffPageComment[],
        index: number) {
        if (enhancedOffPageCommentFromGateway.uniqueId === enhancedOffPageCommentInClient.uniqueId) {
            if (enhancedOffPageCommentInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent enhancedOffPage comment, if marking operation is deleted.
                arr.splice(index, 1);
            } else {
                enhancedOffPageCommentInClient.isDirty = false;
                enhancedOffPageCommentInClient.rowVersion = enhancedOffPageCommentFromGateway.rowVersion;
                enhancedOffPageCommentInClient.enhancedOffPageCommentId = enhancedOffPageCommentFromGateway.enhancedOffPageCommentId;
                enhancedOffPageCommentInClient.markingOperation = enums.MarkingOperation.none;
            }
            enhancedOffPageCommentInClient.isPickedForSaveOperation = false;
        } else if (this.isDirtyFlagMissingForEnhancedOffPageComment(enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient)) {
            enhancedOffPageCommentInClient.isDirty = true;
            enhancedOffPageCommentInClient.isPickedForSaveOperation = false;
            this.setEnhancedOffPageCommentPropertiesBasedOnThePreviousSaveReturn
                (enhancedOffPageCommentFromGateway, enhancedOffPageCommentInClient);
        }

    }

    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when an enhancedOffPageCommentInClient object got changed and the 5 minutes
     *                      background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the annotation object. Since the uniqueId is different we are sure that
     *                      there's some change made to the annotation object at the client side before the save call came back. Hence
     *                      we just compare the clientTokens and if the isDirty flag is false to identify the annotation object in this
     *                      method and subsequently sets the isDirty flag to TRUE.
     * @param annotationFromGateway
     * @param annotationInClient
     */
    private isDirtyFlagMissingForEnhancedOffPageComment
        (enhancedOffPageCommentFromGateway: EnhancedOffPageCommentToReturn,
        enhancedOffPageCommentInClient: EnhancedOffPageComment): boolean {
        return enhancedOffPageCommentFromGateway.clientToken === enhancedOffPageCommentInClient.clientToken;
    }

    /**
     * This particular method sets or resets the dirty flag on the bookmark item based on the scenarios
     *
     * We are using a uniqueId property to identify a change made to the bookmark object
     * Ideally, whenever a change is made to the bookmark object, the uniqueId property will get a new GUID assigned.
     * This uniqueId will be send as an identifier to the gateway along with the bookmark objects to be saved
     * The same uniqueId will form the part of the return bookmark object from the gateway once the save call completes.
     * The uniqueId from the gateway and the one at the client will be compared to reset the isDirty flag and to update the related
     * properties at the client.
     *
     * @param bookmarkFromGateway
     * @param bookmarkInClient
     * @param arr
     * @param index
     */
    private setOrResetDirtyFlagOnTheBookmarkItem(bookmarkFromGateway: BookmarkToReturn,
        bookmarkInClient: bookmark,
        arr: bookmark[],
        index: number) {
        if (bookmarkFromGateway.clientToken === bookmarkInClient.clientToken) {
            if (bookmarkInClient.markingOperation === enums.MarkingOperation.deleted) {
                // remove courrent bookmark item, if marking operation is deleted.
                arr.splice(index, 1);
            } else {
                bookmarkInClient.isDirty = false;
                bookmarkInClient.rowVersion = bookmarkFromGateway.rowVersion;
                bookmarkInClient.bookmarkId = bookmarkFromGateway.bookmarkId;
                bookmarkInClient.markingOperation = enums.MarkingOperation.none;
            }
            bookmarkInClient.isPickedForSaveOperation = false;
        } else if (this.isDirtyFlagMissingForTheBookmark(bookmarkFromGateway, bookmarkInClient)) {
            bookmarkInClient.isDirty = true;
            bookmarkInClient.isPickedForSaveOperation = false;
            this.setBookmarkPropertiesBasedOnThePreviousSaveReturn(bookmarkFromGateway, bookmarkInClient);
        }
    }

    /**
     * Check whether the dirty flag should be set or not
     *
     * Example scenario -   Consider a case when an bookmarkInClient object got changed and the 5 minutes
     *                      background save picked it up
     *                      to be saved to the database. Say, the change made was then reverted before the save call's callback
     *                      reached the client. In this case, the isDirty flag at the client side will be reset to FALSE since according
     *                      to the client the change was reverted.
     *                      So, when the save call reaches back to the client side, the uniqueId in the return object and the one
     *                      in the client will be different for the bookmark object. Since the uniqueId is different we are sure that
     *                      there's some change made to the bookmark object at the client side before the save call came back. Hence
     *                      we just compare the clientTokens and if the isDirty flag is false to identify the bookmark object in this
     *                      method and subsequently sets the isDirty flag to TRUE.
     * @param bookmarkFromGateway
     * @param bookmarkInClient
     */
    private isDirtyFlagMissingForTheBookmark
        (bookmarkFromGateway: BookmarkToReturn,
        bookmarkInClient: bookmark): boolean {
        return bookmarkFromGateway.clientToken === bookmarkInClient.clientToken;
    }

    /**
     * This method sets the properties of the client side Mark object based on the Mark object returned from the previous Save call
     * @param markFromGateway
     * @param markInClient
     */
    private setMarkPropertiesBasedOnThePreviousSaveReturn(markFromGateway: ExaminerMarkToReturn, markInClient: examinerMark) {
        markInClient.rowVersion = markFromGateway.rowVersion;
        markInClient.version = markFromGateway.version;
        switch (markFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                markInClient.markingOperation = this.setMarkingOperationForClientItem(markInClient, markFromGateway.markingOperation);
                markInClient.markId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                markInClient.markingOperation = this.setMarkingOperationForClientItem(markInClient, markFromGateway.markingOperation);
                markInClient.markId = markFromGateway.markId;
                break;
        }
    }

    /**
     * This method will set the corresponding marking operation.
     *
     * @private
     * @param {examinerMark} markInClient
     * @returns
     * @memberof MarkingStore
     */
    private setMarkingOperationForClientItem(clientItem: examinerMark | annotation | EnhancedOffPageComment | bookmark,
        markingOperationFromGateWay: enums.MarkingOperation) {
        if (markingOperationFromGateWay === enums.MarkingOperation.added ||
            markingOperationFromGateWay === enums.MarkingOperation.updated) {
            /* Consider the case if a user delted a mark during a background save, saved marking operation is 1 (added) and
               during the callback it's changed to 3 (deleted), we will compare the unique ids and update the marking operation
               in this sceario we need to set the marking operation as deleted (3) instead of updated(2). */
            return clientItem.markingOperation === enums.MarkingOperation.deleted ?
                enums.MarkingOperation.deleted : enums.MarkingOperation.updated;
        } else if (markingOperationFromGateWay === enums.MarkingOperation.deleted) {
            /* Consider the case if a user delted a mark during a background save, saved marking operation is 3 (deleted) and
               during the callback it's changed again to 3 (deleted) in this scenario unique id will be updated,we will compare the
               unique ids and update the marking operation in this sceario we need to set the marking operation as deleted (3)
               instead of added(1). */
            return clientItem.markingOperation === enums.MarkingOperation.deleted ?
                enums.MarkingOperation.deleted : enums.MarkingOperation.added;
        }
    }

    /**
     * This method sets the properties of the client side Annotation object based on the Annotation object returned from the
     * previous Save call
     * @param annotationFromGateway
     * @param annotationInClient
     */
    private setAnnotationPropertiesBasedOnThePreviousSaveReturn(annotationFromGateway: AnnotationToReturn,
        annotationInClient: annotation) {
        annotationInClient.rowVersion = annotationFromGateway.rowVersion;
        annotationInClient.version = annotationFromGateway.version;
        switch (annotationFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                annotationInClient.markingOperation = this.setMarkingOperationForClientItem(annotationInClient,
                    annotationFromGateway.markingOperation);
                annotationInClient.annotationId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                annotationInClient.markingOperation = this.setMarkingOperationForClientItem(annotationInClient,
                    annotationFromGateway.markingOperation);
                annotationInClient.annotationId = annotationFromGateway.annotationId;
                break;
        }
    }

    /**
     * This method sets the properties of the client side Enhancedoffpagecomment object based on the Annotation object returned from the
     * previous Save call
     * @param enhancedOffPageCommentFromGateway
     * @param enhancedOffPageCommentInClient
     */
    private setEnhancedOffPageCommentPropertiesBasedOnThePreviousSaveReturn(
        enhancedOffPageCommentFromGateway: EnhancedOffPageCommentToReturn,
        enhancedOffPageCommentInClient: EnhancedOffPageComment) {
        enhancedOffPageCommentInClient.rowVersion = enhancedOffPageCommentFromGateway.rowVersion;
        switch (enhancedOffPageCommentFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                enhancedOffPageCommentInClient.markingOperation = this.setMarkingOperationForClientItem(enhancedOffPageCommentInClient,
                    enhancedOffPageCommentFromGateway.markingOperation);
                enhancedOffPageCommentInClient.enhancedOffPageCommentId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                enhancedOffPageCommentInClient.markingOperation = this.setMarkingOperationForClientItem(enhancedOffPageCommentInClient,
                    enhancedOffPageCommentFromGateway.markingOperation);
                enhancedOffPageCommentInClient.enhancedOffPageCommentId = enhancedOffPageCommentFromGateway.enhancedOffPageCommentId;
        }
    }

    /**
     * This method sets the properties of the client side bookmark object based on the Bookmark object returned from the
     * previous Save call
     * @param bookmarkFromGateway
     * @param bookmarkInClient
     */
    private setBookmarkPropertiesBasedOnThePreviousSaveReturn(bookmarkFromGateway: BookmarkToReturn,
        bookmarkInClient: bookmark) {
        bookmarkInClient.rowVersion = bookmarkFromGateway.rowVersion;
        switch (bookmarkFromGateway.markingOperation) {
            case enums.MarkingOperation.deleted:
                bookmarkInClient.markingOperation = this.setMarkingOperationForClientItem(bookmarkInClient,
                    bookmarkFromGateway.markingOperation);
                bookmarkInClient.bookmarkId = 0;
                break;
            case enums.MarkingOperation.added:
            case enums.MarkingOperation.updated:
                bookmarkInClient.markingOperation = this.setMarkingOperationForClientItem(bookmarkInClient,
                    bookmarkFromGateway.markingOperation);
                bookmarkInClient.bookmarkId = bookmarkFromGateway.bookmarkId;
                break;
        }
    }

    /**
     * Check whether mark is loaded or not
     * @param markGroupId
     * @param considerNonRecoverableError if true we will reload the marks if there is a non-recoverable error against current markGroupId.
     */
    public isMarksLoaded(markGroupId: number, considerNonRecoverableError: boolean = true): boolean {
        if (this._examinerMarksAgainstResponse == null ||
            (this.checkMarkGroupItemHasNonRecoverableErrors(markGroupId) && considerNonRecoverableError)) {
            return false;
        }

        return this._examinerMarksAgainstResponse[markGroupId] != null;
    }

    /**
     * Get the previous marks collection count.
     */
    public getPreviousMarksCollectionCount(): number {
        return this._examinerMarksAgainstResponse[this._currentMarkGroupId]
            .examinerMarkGroupDetails[this._currentMarkGroupId]
            .allMarksAndAnnotations.length;
    }

    /**
     * Get all marks and annotations.
     */
    public getAllMarksAndAnnotations() {
        // Check the marks loaded in the collection.
        if (this._examinerMarksAgainstResponse[this._currentMarkGroupId] != null) {
            return this._examinerMarksAgainstResponse[this._currentMarkGroupId]
                .examinerMarkGroupDetails[this._currentMarkGroupId]
                .allMarksAndAnnotations;
        }
        return null;
    }

    /**
     * Get previous marks of single/whole response.
     */
    public getDefaultPreviousMarks() {
        let examinerMarksCollection: Array<examinerMark> = Array<examinerMark>();
        let allMarkSchemGroupIds = this.getRelatedWholeResponseQIGIds();
        let markSchemeGroupIndex = 0;
        do {
            let markGroupId = this.currentMarkGroupId;
            // for whole response, loop through annotations of each qig
            if (allMarkSchemGroupIds && allMarkSchemGroupIds.length > 0) {
                markGroupId = this.getMarkGroupIdQIGtoRIGMap(allMarkSchemGroupIds[markSchemeGroupIndex++]);
            }

            let allMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;

            let allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter((x: any) => x.isDefault === true);
            if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                examinerMarksCollection = examinerMarksCollection.concat(allMarksAndAnnotationsWithIsDefault[0].examinerMarksCollection);
            } else {
                examinerMarksCollection = examinerMarksCollection.concat(allMarksAndAnnotations[1].examinerMarksCollection);
            }

        } while (markSchemeGroupIndex < allMarkSchemGroupIds.length);

        return examinerMarksCollection;
    }

    /**
     * Set as non recoverable item.
     * @param markGroupId
     * @param errorType
     */
    public setAsNonRecoverableItem(markGroupId: number,
        errorType: enums.SaveMarksAndAnnotationErrorCode = enums.SaveMarksAndAnnotationErrorCode.NonRecoverableError) {
        // update the examiner mark data against the response.
        let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[markGroupId];
        let allMarksAndAnnotations: examinerMarksAndAnnotations =
            examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId]
                .allMarksAndAnnotations;
        let isBackGroundSave: boolean =
            examinerMarksAndAnnotations.IsBackGroundSave;
        examinerMarksAndAnnotations.errorType = errorType;

        let markGroupIds: number[] = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        if (!isBackGroundSave) {
            markGroupIds.forEach((mgId: number) => {
                allMarksAndAnnotations[0].enhancedOffPageComments = [];
                allMarksAndAnnotations[0].examinerMarksCollection = [];
                allMarksAndAnnotations[0].annotations = [];
                allMarksAndAnnotations[0].bookmarks = [];
                allMarksAndAnnotations[0].absoluteMarksDifference = undefined;
                allMarksAndAnnotations[0].accuracyIndicator = undefined;
                allMarksAndAnnotations[0].accuracyTolerance = undefined;
                allMarksAndAnnotations[0].examinerMarks = undefined;
                allMarksAndAnnotations[0].maximumMarks = undefined;
                allMarksAndAnnotations[0].totalMarks = undefined;
                allMarksAndAnnotations[0].totalMarksDifference = undefined;
                allMarksAndAnnotations[0].totalTolerance = undefined;
                allMarksAndAnnotations[0].totalToleranceRemark = undefined;
                allMarksAndAnnotations[0].markingProgress = undefined;
                allMarksAndAnnotations[0].hasMarkSchemeLevelTolerance = undefined;
                allMarksAndAnnotations[0].version = undefined;
                allMarksAndAnnotations[0].questionItemGroup = undefined;
                allMarksAndAnnotations[0].totalLowerTolerance = undefined;
                allMarksAndAnnotations[0].totalUpperTolerance = undefined;
                allMarksAndAnnotations[0].seedingAMDTolerance = undefined;
                allMarksAndAnnotations[0].submittedDate = undefined;
                allMarksAndAnnotations[0].remarkRequestTypeId = undefined;
            });
        } else {
            // resetting the IsBackGroundSave property
            examinerMarksAndAnnotations.IsBackGroundSave = false;
        }
    }

    /**
     * This method will returns the non-recoverable error status of the corresponding markGroupId.
     * @param markGroupId markGroupId for the examinermarks collection
     */
    public checkMarkGroupItemHasNonRecoverableErrors(markGroupId: number) {
        let markGroupItemHasNonRecoverableErrors: boolean = false;
        /**
         *  in case of a whole response, there might be a non recoverable error set when opened
         *  from some other qig before coming to this Qig. handle this scenario.
         */
        let markGroupIds: number[] = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        markGroupIds.forEach((mgId: number) => {
            let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[mgId];
            if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.examinerMarkGroupDetails) {
                markGroupItemHasNonRecoverableErrors =
                    (this.isNonRecoverableError(examinerMarksAndAnnotations.errorType)) || markGroupItemHasNonRecoverableErrors;
            }
        });
        return markGroupItemHasNonRecoverableErrors;
    }

    /**
     * This method will returns the non-recoverable error status of the corresponding markGroupId.
     * @param markGroupId
     */
    public checkMarkGroupItemHasSaveMarkErrors(markGroupId: number) {
        let hasSaveMarkErrors: boolean = false;
        /**
         *  in case of a whole response, there might be a non recoverable error set when opened
         *  from some other qig before coming to this Qig. get related Mark Groups for that.
         */
        let markGroupIds: number[] = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        markGroupIds.forEach((mgId: number) => {
            let errorType: enums.SaveMarksAndAnnotationErrorCode = enums.SaveMarksAndAnnotationErrorCode.None;
            let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[mgId];
            if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.examinerMarkGroupDetails) {
                errorType = examinerMarksAndAnnotations.errorType;
            }
            hasSaveMarkErrors = (errorType === enums.SaveMarksAndAnnotationErrorCode.ClosedResponse ||
                errorType === enums.SaveMarksAndAnnotationErrorCode.ResponseRemoved) || hasSaveMarkErrors;
        });
        return hasSaveMarkErrors;
    }

    /**
     * Get Save MarksAndAnnotation ErrorCode
     * @param markGroupId
     */
    public getSaveMarksAndAnnotationErrorCode(markGroupId: number) {
        /**
         *  in case of a whole response, there might be a non recoverable error set when opened
         *  from some other qig before coming to this Qig. get related Mark Groups for that.
         */
        let markGroupIds: number[] = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        markGroupIds.push(markGroupId);
        let saveErrorCode: enums.SaveMarksAndAnnotationErrorCode = enums.SaveMarksAndAnnotationErrorCode.None;
        let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[markGroupId];
        if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.examinerMarkGroupDetails) {
            saveErrorCode = examinerMarksAndAnnotations.errorType;
        }

        return saveErrorCode;
    }

    /**
     * returns the non-recoverable error status of current markGroup.
     */
    public get currentMarkGroupItemHasNonRecoverableErrors() {
        return this._currentMarkGroupItemHasNonRecoverableErrors;
    }

    /**
     * examiner marks and data version.
     * @param markGroupId
     */
    public getExaminerMarkAndAnnotationsDataVersion(parentMarkGroupId: number, markGroupId: number): number {
        // update the examiner mark data against the response.
        let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[parentMarkGroupId];
        let allMarksAndAnnotations: examinerMarksAndAnnotations =
            examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId]
                .allMarksAndAnnotations;

        return allMarksAndAnnotations[0].version;
    }

    /**
     * Returns back whether the response is in the awaiting queueing status
     * @param markGroupId
     */
    public getMarksAndAnnotationsSaveQueueStatus(markGroupId: number): boolean {
        if (this._examinerMarksAgainstResponse[markGroupId] !== undefined &&
            this._examinerMarksAgainstResponse[markGroupId] != null) {
            return this._examinerMarksAgainstResponse[markGroupId].IsAwaitingToBeQueued;
        } else {
            return false;
        }
    }

    /**
     * This method will return the marks collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the marks irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations
     */
    public getDirtyExaminerMarks(parentMarkGroupId: number, markGroupId: number,
        doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations: boolean = false): examinerMark[] {
        let markItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        let dirtyMarks: Array<examinerMark>;
        if (markItems) {
            if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
                // Returning all the marks irrespective of the dirty flag
                dirtyMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].examinerMarksCollection;
            } else {
                // Returning only the dirty marks
                dirtyMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].examinerMarksCollection.filter((x: examinerMark) => x.isDirty);
            }
        }

        return dirtyMarks;
    }

    /**
     * This method will return the annotations collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the marks irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations
     */
    public getDirtyExaminerAnnotations(parentMarkGroupId: number, markGroupId: number,
        doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations: boolean = false): examinerAnnotations[] {
        this.removeInvalidAnnotations(parentMarkGroupId, markGroupId);
        let annotationItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        let dirtyAnnotations: Array<examinerAnnotations>;
        if (annotationItems) {
            if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
                // Returning all the annotations irrespective of the dirty flag
                dirtyAnnotations = annotationItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].annotations;
            } else {
                // Returning only the dirty annotations
                dirtyAnnotations = annotationItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].annotations.filter((x: examinerAnnotations) => x.isDirty);
            }
        }

        return dirtyAnnotations;
    }

    /**
     * This method will return the enhanced off page comment collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the comments irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations
     */
    public getDirtyEnhancedOffPageComments(parentMarkGroupId: number, markGroupId: number,
        doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations: boolean = false): EnhancedOffPageComment[] {
        let markItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        let dirtyEnhancedOffPageComments: Array<EnhancedOffPageComment>;
        if (markItems) {
            if (doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations) {
                // Returning all the marks irrespective of the dirty flag
                dirtyEnhancedOffPageComments = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].enhancedOffPageComments;
            } else {
                // Returning only the dirty marks
                dirtyEnhancedOffPageComments = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].enhancedOffPageComments.filter((x: EnhancedOffPageComment) => x.isDirty);
            }
        }

        return dirtyEnhancedOffPageComments;
    }

    /**
     * This method will return the bookmark collection.
     * It will return only the dirty ones
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is FALSE
     * It will return all the comments irrespective of the dirty flag
     *                  if the parameter doIgnoreDirtyFlagAndSaveAllMarksAndAnnotations is TRUE
     * @param markGroupId
     * @param doIgnoreDirtyFlagAndSaveAllBookMarks
     */
    public getDirtyBookMarks(parentMarkGroupId: number, markGroupId: number,
        doIgnoreDirtyFlagAndSaveAllBookMarks: boolean = false): bookmark[] {
        let markItems = this._examinerMarksAgainstResponse[parentMarkGroupId];
        let dirtyBookMarks: Array<bookmark>;
        if (markItems) {
            if (doIgnoreDirtyFlagAndSaveAllBookMarks) {
                // Returning all the bookmarks irrespective of the dirty flag
                dirtyBookMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].bookmarks;
            } else {
                // Returning only the dirty bookmarks
                dirtyBookMarks = markItems.
                    examinerMarkGroupDetails[markGroupId].
                    allMarksAndAnnotations[0].bookmarks.filter((x: bookmark) => x.isDirty);
            }
        }

        return dirtyBookMarks;
    }

    /**
     * remove invalid annotations with width/height = 0
     * @param markGroupId
     */
    private removeInvalidAnnotations(parentMarkGroupId: number, markGroupId: number) {
        let annotations = this._examinerMarksAgainstResponse[parentMarkGroupId].
            examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].annotations;
        let invalidAnnotations = annotations.filter((x: examinerAnnotations) => ((x.height === 0 || x.width === 0)
            && x.stamp !== constants.OFF_PAGE_COMMENT_STAMP_ID));
        for (let i = 0; i < invalidAnnotations.length; i++) {
            let annotation = invalidAnnotations[i];
            let index: number = this.findIndex(annotation.clientToken);
            if (index >= 0) {
                annotations.splice(index, 1);
            }
        }
    }

    /**
     * get current question info
     */
    public get currentQuestionItemInfo(): currentQuestionItemInfo {
        return this._currentQuestionItemInfo;
    }

    /**
     * get previous question item's image cluster id
     */
    public get previousQuestionItemImageClusterId(): number {
        return this._previousQuestionItemImageClusterId;
    }

    /**
     * returns the imageclusterid of current question item
     */
    public get currentQuestionItemImageClusterId(): number {
        return this.currentQuestionItemInfo ? this.currentQuestionItemInfo.imageClusterId : undefined;
    }

    /**
     * get current question item's unique id
     */
    public get currentMarkSchemeId(): number {
        return this.currentQuestionItemInfo ? this.currentQuestionItemInfo.uniqueId : undefined;
    }

    /**
     * get previous question item's unique id
     */
    public get previousMarkSchemeId(): number {
        return this._previousQuestionItem;
    }

    /**
     * Get the examiner marks against current response
     */
    public get examinerMarksAgainstCurrentResponse(): examinerMarkData {
        if (this._examinerMarksAgainstResponse) {
            return this._examinerMarksAgainstResponse[this._currentMarkGroupId];
        } else {
            return null;
        }
    }

    /**
     * Get the examiner marks against current response
     */
    public examinerMarksAgainstResponse(markGroupId: number): examinerMarkData {
        if (this._examinerMarksAgainstResponse) {
            return this._examinerMarksAgainstResponse[markGroupId];
        } else {
            return null;
        }
    }

    /**
     * Get the examiner marks against a response.
     * @param parentMarkGroupId markgroup key against which collection is stored
     * @param markGroupId in case of a whole response, provide second level of markGroupid
     */
    public currentExaminerMarksAgainstResponse(parentMarkGroupId: number, markGroupId?: number): examinerMarksAndAnnotations {
        if (this._examinerMarksAgainstResponse) {
            let markItem = this._examinerMarksAgainstResponse[parentMarkGroupId];
            if (markItem !== null && markItem) {
                return markItem.examinerMarkGroupDetails[markGroupId ? markGroupId : parentMarkGroupId].allMarksAndAnnotations[0];
            }
        }

        return null;
    }

    /**
     * Get the marks and annotation against a single response/ whole response.
     * @param markGroupId
     */
    public allMarksAndAnnotationAgainstResponse(markGroupId: number): examinerMarksAndAnnotations[] {
        let allMarksAndAnnotation: examinerMarksAndAnnotations[] = [];
        if (this._examinerMarksAgainstResponse) {
            let markItem = this._examinerMarksAgainstResponse[markGroupId];
            if (markItem) {
                for (let examinerMarkGroupDetails in markItem.examinerMarkGroupDetails) {
                    if (examinerMarkGroupDetails) {
                        allMarksAndAnnotation.push(markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                            .allMarksAndAnnotations[0]);
                    }
                }
            }
        }

        return allMarksAndAnnotation;
    }

    /**
     * Get all annotations against a single response/ whole response.
     * @param parentMarkGroupId
     */
    public allAnnotationsAgainstResponse(parentMarkGroupId: number): annotation[] {
        let allMarksAndAnnotation: examinerMarksAndAnnotations[] = [];
        let allAnnotations: Array<annotation> = Array<annotation>();
        if (this._examinerMarksAgainstResponse) {
            let markItem = this._examinerMarksAgainstResponse[parentMarkGroupId];
            if (markItem) {
                for (let item in markItem.examinerMarkGroupDetails) {
                    if (item) {
                        if (!this.isUnclassifiedOrClassified) {
                            // Loop through annotations of all QIGs and create a single array which contains annotaions of all QIGs
                            allAnnotations = allAnnotations.concat(markItem.examinerMarkGroupDetails[item]
                                .allMarksAndAnnotations[0].annotations);
                        } else {
                            allAnnotations = allAnnotations.concat(markItem.examinerMarkGroupDetails[item]
                                .allMarksAndAnnotations[0].annotations.filter((annotaion: any) =>
                                    annotaion.definitiveMark === this.isDefinitiveMarking));
                        }
                    }
                }
            }
        }
        return allAnnotations;
    }

    /**
     * get the current mark group id
     */
    public get currentMarkGroupId(): number {
        return this._currentMarkGroupId;
    }

    /**
     * get the newly entered mark
     */
    public get newMark(): AllocatedMark {
        return this._newMark;
    }

    /**
     * getting the initial marking progress
     */
    public get initialMarkingProgress(): number {
        return this._initialMarkingProgress;
    }

    /**
     * Getting where to the navigation happening
     */
    public get navigateTo(): number {
        return this._navigatingTo;
    }

    /**
     * Getting navigation is happening to  where - for setting the question item as selected.
     */
    public get currentNavigation(): number {
        return this._currentNavigation;
    }

    /**
     * Getting the enhanced off page comments against selected response
     */
    public enhancedOffPageCommentsAgainstCurrentResponse(index: number = 0): Immutable.List<EnhancedOffPageComment> {
        let enhancedOffPageComments: Immutable.List<EnhancedOffPageComment> = Immutable.List<EnhancedOffPageComment>();
        if (this.examinerMarksAgainstCurrentResponse) {
            let marksAndAnnotations: examinerMarksAndAnnotation = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].allMarksAndAnnotations[index];
            if (marksAndAnnotations.enhancedOffPageComments && marksAndAnnotations.enhancedOffPageComments.length > 0) {
                if (this.isUnclassifiedOrClassified) {
                    enhancedOffPageComments = Immutable.List<EnhancedOffPageComment>(marksAndAnnotations.enhancedOffPageComments.
                        filter((x: EnhancedOffPageComment) => (x.markingOperation !== enums.MarkingOperation.deleted
                            && x.isDefinitive === this.isDefinitiveMarking) || x.isPrevious === true));
                } else {
                    enhancedOffPageComments = Immutable.List<EnhancedOffPageComment>(marksAndAnnotations.enhancedOffPageComments.
                        filter((x: EnhancedOffPageComment) => x.markingOperation !== enums.MarkingOperation.deleted));
                }
            }
        }
        return enhancedOffPageComments;
    }

    /**
     * Getting the bookmarks against selected response
     */
    public bookmarksAgainstCurrentResponse(index: number = 0): Immutable.List<bookmark> {
        let bookmarks: Immutable.List<bookmark> = Immutable.List<bookmark>();
        if (this.examinerMarksAgainstCurrentResponse) {
            let marksAndAnnotations: examinerMarksAndAnnotation = this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].allMarksAndAnnotations[index];
            if (marksAndAnnotations.bookmarks && marksAndAnnotations.bookmarks.length > 0) {
                if (this.isUnclassifiedOrClassified) {
                    bookmarks = Immutable.List<bookmark>(marksAndAnnotations.bookmarks.
                        filter((x: bookmark) => x.markingOperation !== enums.MarkingOperation.deleted &&
                            x.definitiveBookmark === this.isDefinitiveMarking));
                } else {
                    bookmarks = Immutable.List<bookmark>(marksAndAnnotations.bookmarks.
                        filter((x: bookmark) => x.markingOperation !== enums.MarkingOperation.deleted));
                }
            }
        }
        return bookmarks;
    }

    /**
     * Remove annotation from the marking screen
     * @param removeAnnotationList
     */
    public removeAnnotation(removeAnnotationList: Array<string>, contextMenuType: enums.ContextMenuType,
        isMarkByAnnotation: boolean): void {

        // Denotes if the response is to be queued for save after removing the annotation
        // If the removed annotation is a newly put annotation that doesn't already exist
        // in the database, then no need to queue the response for saving process
        let isResponseToBeQueuedForSave: boolean = false;
        let markGroupId: number = this.selectedQIGMarkGroupId;

        // Denotes the list of newly added annotations that are removed
        // and doesn't already exist in the database
        let newlyAddedAnnotations: Array<string> = [];

        if (contextMenuType === enums.ContextMenuType.annotation) {
            // Looping through the annotation list to be deleted
            removeAnnotationList.map((annotationClientToken: string) => {
                let markItem = this._examinerMarksAgainstResponse[this.currentMarkGroupId];
                for (let examinerMarkGroupDetails in markItem.examinerMarkGroupDetails) {
                    if (examinerMarkGroupDetails) {
                        markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                            .allMarksAndAnnotations[0].annotations.map((a: annotation) => {

                                // If the client token matches, then delete the annotation
                                if (a.clientToken === annotationClientToken) {

                                    // If annotation id exists, then that means that the annotation
                                    // already exists in the database, hence just set the isDirty flag to true
                                    // and set the 'isResponseToBeQueuedForSave' flag to true for
                                    // adding the response to the save marks and annotations queue
                                    if (a.annotationId !== 0) {
                                        isResponseToBeQueuedForSave = true;
                                        a.isDirty = isMarkByAnnotation ? false : true;
                                        a.uniqueId = htmlUtilities.guid;
                                        a.markingOperation = enums.MarkingOperation.deleted;
                                    } else {
                                        // If annotation id doesn't exist, then push the annotation to the
                                        // newly added annotations list after setting the same to dirty
                                        a.isDirty = isMarkByAnnotation ? false : true;
                                        a.uniqueId = htmlUtilities.guid;
                                        a.markingOperation = enums.MarkingOperation.deleted;
                                        newlyAddedAnnotations.push(a.clientToken);
                                    }
                                    markGroupId = parseInt(examinerMarkGroupDetails);
                                }
                            });
                    }
                }
            });
        } else {

            removeAnnotationList.map((annotationClientToken: string) => {
                this.examinerMarksAgainstCurrentResponse.
                    examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                    allMarksAndAnnotations[0].bookmarks.map((a: bookmark) => {

                        // If the client token matches, then delete the bookmark
                        if (a.clientToken === annotationClientToken) {

                            // If bookmark id exists, then that means that the bookmark
                            // already exists in the database, hence just set the isDirty flag to true
                            // and set the 'isResponseToBeQueuedForSave' flag to true for
                            // adding the response to the save marks and annotations queue
                            if (a.clientToken) {
                                isResponseToBeQueuedForSave = true;
                                a.isDirty = true;
                                a.clientToken = htmlUtilities.guid;
                                a.markingOperation = enums.MarkingOperation.deleted;
                            }
                        }
                    });
            });
        }

        // If there are annotations in the newly added annotations list,
        // then simply remove it from the actual annotations list in the
        // marks and annotations collection in the store
        if (newlyAddedAnnotations.length > 0) {
            for (let i = 0; i < newlyAddedAnnotations.length; i++) {
                let index: number = this.findIndex(newlyAddedAnnotations[i]);
                if (index >= 0) {
                    this.examinerMarksAgainstCurrentResponse.
                        examinerMarkGroupDetails[markGroupId].
                        allMarksAndAnnotations[0].annotations.splice(index, 1);
                }
            }
        }


        // Push the response to the queue only if a save is definitely required
        // because of removing an annotation which was already in the database
        if (isResponseToBeQueuedForSave) {
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
        }
    }

	/**
	 * find the index of the enhanced offpage comment from the collection
	 * @param clientToken
	 */
    private findEnhancedOffPageIndex(clientToken: string): number {
        let index: number;
        let enhancedOffPageComments: Array<EnhancedOffPageComment> = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].allMarksAndAnnotations[0].enhancedOffPageComments;

        for (let i = 0; i < enhancedOffPageComments.length; i++) {
            if (enhancedOffPageComments[i].clientToken === clientToken) {
                index = i;
                break;
            }
        }
        return index;
    }

	/**
	 * Find index of the mark from the mark collection
	 * @param markId
	 */
    private findMarkIndex(markId: number): number {
        let index: number;
        let marks: Array<examinerMark> = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].allMarksAndAnnotations[0].examinerMarksCollection;

        for (let i = 0; i < marks.length; i++) {
            if (marks[i].markId === markId) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**
     * Returns the index of the annotation from the annotation collection
     * @param clientToken
     */
    private findIndex(clientToken: string): number {
        let index: number;
        let annotations: Array<annotation> = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].annotations;

        for (let i = 0; i < annotations.length; i++) {
            if (annotations[i].clientToken === clientToken) {
                index = i;
                break;
            }
        }

        return index;
    }

    /**
     * finds the annotation data based on the client token.
     * @param clientToken
     */
    public findAnnotationData(clientToken: string): annotation {
        let annotationData: annotation = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].annotations.filter((a: annotation) => a.clientToken === clientToken);
        return annotationData[0];
    }

    /**
     * Update annotation action method
     * @param leftEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param topEdge
     * @param currentAnnotationClientToken
     * @param width
     * @param height
     */
    public updateAnnotation(leftEdge: number,
        topEdge: number,
        imageClusterId: number,
        outputPageNo: number,
        pageNo: number,
        currentAnnotationClientToken: string,
        width?: number,
        height?: number,
        comment?: string): void {
        if (this.examinerMarksAgainstCurrentResponse) {
            let isOnPageComment: boolean = false;
            let that = this;
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations.map((a: annotation) => {
                    if (a.clientToken === currentAnnotationClientToken) {
                        a.isDirty = true;
                        a.uniqueId = htmlUtilities.guid;
                        a.leftEdge = Math.round(leftEdge);
                        a.topEdge = Math.round(topEdge);
                        a.width = Math.round(width);
                        a.height = Math.round(height);
                        a.pageNo = pageNo;
                        a.imageClusterId = imageClusterId > 0 ? imageClusterId : a.imageClusterId;
                        a.outputPageNo = outputPageNo;
                        a.comment = (a.stamp !== enums.DynamicAnnotation.OnPageComment &&
                            a.stamp !== enums.DynamicAnnotation.OffPageComment) ? a.comment : comment;
                        a.markingOperation = a.annotationId === 0 ? a.markingOperation : enums.MarkingOperation.updated;

                        isOnPageComment = that.isOnPageComment(a.stamp);
                    }
                });

            // to avoid saving empty comment in db
            if (comment === '' && isOnPageComment) {
                return;
            }
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
        }
    }

    /**
     * Checks whether the passed in stamp is an on page comment or not
     * @param stampId
     */
    private isOnPageComment(stampId: number): boolean {
        return enums.DynamicAnnotation.OnPageComment === stampId;
    }

    public get isAnnotationDrawing(): boolean {
        return this._annotationDrawStart;
    }

    /**
     * Update the colour of the selected annotation.
     * @param currentlySelectedAnnotation
     * @param changedProps
     */
    public updateAnnotationColourByMarkGroup(annotation: annotation, markGroupId: number): void {

        let annotations: examinerAnnotations[] = this.currentExaminerMarksAgainstResponse(markGroupId).annotations;
        for (let i = 0; i < annotations.length; i++) {

            if (annotations[i].clientToken === annotation.clientToken) {
                annotations[i].red = annotation.red;
                annotations[i].blue = annotation.blue;
                annotations[i].green = annotation.green;
                annotations[i].isDirty = true;
                annotations[i].uniqueId = htmlUtilities.guid;
                annotations[i].markingOperation = annotation.markingOperation;
                break;
            }
        }
    }

    /**
     * Update the color of the selected annotation.
     * @param currentlySelectedAnnotation
     * @param changedProps
     */
    public updateAnnotationColor(currentlySelectAnnotation: annotation): void {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.currentMarkGroupId].
            allMarksAndAnnotations[0].annotations.map((a: annotation) => {

                if (a.clientToken === currentlySelectAnnotation.clientToken) {
                    a.red = currentlySelectAnnotation.red;
                    a.blue = currentlySelectAnnotation.blue;
                    a.green = currentlySelectAnnotation.green;
                    a.isDirty = true;
                    a.uniqueId = htmlUtilities.guid;
                    a.markingOperation = (a.markingOperation === enums.MarkingOperation.updated) ||
                        (a.markingOperation === enums.MarkingOperation.none) ? enums.MarkingOperation.updated :
                        enums.MarkingOperation.added;
                }
            });
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    }

    /**
     * This method will returns the marking progress details.
     * @param markGroupId
     */
    public getMarkingProgressDetails(markGroupId: number): markingProgressDetails {
        if (this._markingProgressDetails) {
            return this._markingProgressDetails.get(markGroupId);
        }

        return null;
    }

    /**
     * Add annotation to the collection
     * @param addedAnnotation
     */
    public addAnnotation(addedAnnotation: annotation, previousMarkIndex: number): void {
        if (!addedAnnotation.isCopyingInRemark && addedAnnotation.stamp === enums.DynamicAnnotation.OnPageComment &&
            (addedAnnotation.comment !== undefined || addedAnnotation.comment !== null || addedAnnotation.comment !== '')) {
            addedAnnotation.isDirty = false;
        }
        // Add current annotation
        if (addedAnnotation.markGroupId === this.selectedQIGMarkGroupId) {
            addedAnnotation.definitiveMark = this.isUnclassifiedOrClassified && this.isDefinitiveMarking;
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].annotations.push(addedAnnotation);
        } else if (this._isWholeResponse && this.isRelatedMarkGroupId(addedAnnotation.markGroupId)) {
            // for whole response on copying previous marks, this.selectedQIGMarkGroupId is the current markgroupid.
            // we should add the new annotation to the respective markgroupid's collection.
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[addedAnnotation.markGroupId].
                allMarksAndAnnotations[0].annotations.push(addedAnnotation);
        } else {
            // Add previous annotation
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[previousMarkIndex].annotations.push(addedAnnotation);
        }

        // to avoid saving empty comment in db
        // Don't update queue if the annoation is added via copy marks and annotations. 
        // Any other update or marking progress upadation on navigation will correctly update the queue
        if (addedAnnotation.stamp !== enums.DynamicAnnotation.OnPageComment && !addedAnnotation.isCopyingInRemark) {
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
        }
    }

    /**
     * Updates the queueing status of the mark group record to the collection
     * @param markGroupId
     */
    public updateMarksAndAnnotationsSaveQueueingStatus(markGroupId: number,
        queuingStatus: boolean,
        isBackGroundSave: boolean = false): void {
        // update the examiner mark data against the response.
        this._examinerMarksAgainstResponse[markGroupId].IsAwaitingToBeQueued = queuingStatus;
        this._examinerMarksAgainstResponse[markGroupId].IsBackGroundSave = isBackGroundSave;
    }

    /**
     * returns true if marking started, else false
     * @returns
     */
    public get isMarkingInProgress(): boolean {
        return this._isMarkingInProgress;
    }

    /**
     * returns true if marks have been saved to Db
     * @returns
     */
    public get isMarksSavedToDb(): boolean {
        return this._isMarksSavedToDb;
    }

    /**
     * returns true if next response need to open
     * @returns
     */
    public get isNextResponse(): boolean {
        return this._isNextResponse;
    }

    /**
     * returns true if mark updated
     * @returns
     */
    public get isEdited(): boolean {
        return this._isEdited;
    }

    public get currentResponseMode(): enums.ResponseMode {
        return this._currentResponseMode;
    }

    public get currentResponseMarkingProgress(): number {
        return this._currentResponseMarkingProgress;
    }
    /**
     * return collection of NR warning messageS based on NR cc  flag values and optionality .
     */
    public get warningNR(): warningNR {
        return this._warningNR;
    }

    public get isNavigationThroughMarkScheme(): enums.ResponseNavigation {
        return this._isNavigationThroughMarkScheme;
    }

    /**
     * This method will return the tooltip of annotations against a markSchemeId
     * @param markSchemeId
     */
    public toolTip(markSchemeId: number): string {
        let toolTip: string = '';
        let toolTipInfo = this._toolTipInfo.get(markSchemeId);
        if (toolTipInfo) {
            toolTip = toolTipInfo.markSchemeText;
        }
        return toolTip;
    }

    /**
     * This method will return the mark scheme name against a markSchemeId
     * @param markSchemeId
     */
    public getMarkSchemeInfo(markSchemeId: number): MarkSchemeInfo {
        let markSchemeInfo: MarkSchemeInfo;
        if (this._toolTipInfo && this._toolTipInfo.size > 0) {
            markSchemeInfo = this._toolTipInfo.get(markSchemeId);
        }
        return markSchemeInfo;
    }

    /**
     * returns the marking start time.
     * @returns
     */
    public get markingStartTime(): Date {
        return this._markingStartTime;
    }

    /**
     * Returns the markscheme details
     */
    public get getMarkSchemes(): Immutable.Map<number, MarkSchemeInfo> {
        return this._toolTipInfo;
    }

    /**
     * Get the annotation details against the client token
     * @param {string} clientToken
     * @returns
     */
    public getAnnotation(clientToken: string): annotation {

        let annotations: annotation[] = this.allAnnotationsAgainstResponse(this.currentMarkGroupId);
        let result: annotation;
        if (annotations) {
            annotations.forEach((a: annotation) => {

                if (a.clientToken === clientToken) {
                    result = a;
                }
            });
        }

        return result;
    }

    /**
     * get base color of annotation
     */
    public getBaseAnnotationColor(_markGroupId: number): string {
        let result: string = '';
        this._examinerMarksAgainstResponse[this.currentMarkGroupId]
            .examinerMarkGroupDetails[this.currentMarkGroupId]
            .allMarksAndAnnotations
            .map((exMarksAndAnnotations: examinerMarksAndAnnotations) => {
                if (exMarksAndAnnotations.markGroupId === _markGroupId) {
                    result = exMarksAndAnnotations.baseColor;
                }
            });

        return result;
    }

    /**
     * returns the current Save Marks And Annotation Triggering Point.
     * @returns
     */
    public get getCurrentSaveMarksAndAnnotationTriggeringPoint(): enums.SaveMarksAndAnnotationsProcessingTriggerPoint {
        return this._saveMarksAndAnnotationTriggeringPoint;
    }

    /**
     * returns the previous Save Marks And Annotation Triggering Point.
     * @returns
     */
    public get getPreviousSaveMarksAndAnnotationTriggeringPointOnError(): enums.SaveMarksAndAnnotationsProcessingTriggerPoint {
        return this._saveMarksAndAnnotationPreviousTriggeringPoint;
    }

	/**
	 * When MarkAsDefinitive button cliked and If the provisional marker marks the response as definitive,
	 * then delete the provisional marks.
	 * If the same marker marks the response as definitive then we keep only the definitive collection
	 */
    private deleteProvisionalMarksIfSameExaminer(): void {
        let currentMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[0];

        currentMarksAndAnnotations.examinerMarksCollection.forEach((e: examinerMark) => {
            if (e.definitiveMark === false) {
                let _examinerMark: examinerMark = e;
                _examinerMark.isDirty = true;
                _examinerMark.markingOperation = enums.MarkingOperation.deleted;
                _examinerMark.definitiveMark = true;
            }
        });

        if (currentMarksAndAnnotations.annotations) {
            currentMarksAndAnnotations.annotations.map((e: annotation) => {
                if (e.definitiveMark === false) {
                    let _annotation: annotation = e;
                    _annotation.isDirty = true;
                    _annotation.markingOperation = enums.MarkingOperation.deleted;
                    _annotation.definitiveMark = true;
                }
            });
        }

        if (currentMarksAndAnnotations.enhancedOffPageComments && currentMarksAndAnnotations.enhancedOffPageComments.length > 0) {
            currentMarksAndAnnotations.enhancedOffPageComments.map((e: EnhancedOffPageComment) => {
                if (e.isDefinitive === false) {
                    let _enhancedOffPageComment: EnhancedOffPageComment = e;
                    _enhancedOffPageComment.isDirty = true;
                    _enhancedOffPageComment.markingOperation = enums.MarkingOperation.deleted;
                    _enhancedOffPageComment.isDefinitive = true;
                }
            });
        }
    }

	/**
	 * Update the Marks and annotation Collection when different markers edit the definitive marks
	 * @param examinerRoleID -- Current Marker
	 * @param deleteProvisionalMarks -- Remove the provisional marks (Definitive = 0) from the collection
	 */
    private updateDefinitiveMarksForDifferentMarker(examinerRoleID: number, deleteProvisionalMarks: boolean): void {
        this._definitiveMarkCollectionUpdated = true;

        let currentMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[0];

        if (deleteProvisionalMarks) {
            // Remove the provisional marks (Definitive = 0) from the collection when
            // the current marker is same as provisional marker and the collection contains Provisional Marks.
            let marksToDelete = currentMarksAndAnnotations.examinerMarksCollection.filter((x: examinerMark) => x.definitiveMark === false);
            for (let i = 0; i < marksToDelete.length; i++) {
                let mark = marksToDelete[i];
                let index: number = this.findMarkIndex(mark.markId);
                if (index >= 0) {
                    currentMarksAndAnnotations.examinerMarksCollection.splice(index, 1);
                }
            }

            let annotationsToDelete = currentMarksAndAnnotations.annotations.filter((x: annotation) => x.definitiveMark === false);
            for (let i = 0; i < annotationsToDelete.length; i++) {
                let annotation = annotationsToDelete[i];
                let index: number = this.findIndex(annotation.clientToken);
                if (index >= 0) {
                    currentMarksAndAnnotations.annotations.splice(index, 1);
                }
            }

            let enhancedOffpageCommentsToDelete = currentMarksAndAnnotations.enhancedOffPageComments.filter
                ((x: EnhancedOffPageComment) => x.isDefinitive === false);
            for (let i = 0; i < enhancedOffpageCommentsToDelete.length; i++) {
                let comment = enhancedOffpageCommentsToDelete[i];
                let index: number = this.findEnhancedOffPageIndex(comment.clientToken);
                if (index >= 0) {
                    currentMarksAndAnnotations.enhancedOffPageComments.splice(index, 1);
                }
            }
        }

        // Update the definitive marks and annotations if the previous marker is not same as current marker.
        currentMarksAndAnnotations.examinerMarksCollection.forEach((e: examinerMark) => {
            if (e.definitiveMark === true && e.examinerRoleId !== examinerRoleID) {
                let _examinerMark: examinerMark = e;
                _examinerMark.markId = 0;
                _examinerMark.examinerRoleId = examinerRoleID;
                _examinerMark.markGroupId = this.currentMarkGroupId;
                _examinerMark.rowVersion = '';
                _examinerMark.version = 0;
                _examinerMark.isDirty = true;
                _examinerMark.uniqueId = htmlUtilities.guid;
                _examinerMark.markingOperation = enums.MarkingOperation.added;
                _examinerMark.definitiveMark = true;
            }
        });

        if (currentMarksAndAnnotations.annotations) {
            currentMarksAndAnnotations.annotations.map((e: annotation) => {
                if (e.definitiveMark === true && e.examinerRoleId !== examinerRoleID) {
                    let _annotation: annotation = e;
                    _annotation.annotationId = 0;
                    _annotation.examinerRoleId = examinerRoleID;
                    _annotation.markGroupId = this.currentMarkGroupId;
                    _annotation.rowVersion = '';
                    _annotation.version = 0;
                    _annotation.isDirty = true;
                    _annotation.uniqueId = htmlUtilities.guid;
                    _annotation.markingOperation = enums.MarkingOperation.added;
                    _annotation.definitiveMark = true;
                }
            });
        }

        if (currentMarksAndAnnotations.enhancedOffPageComments && currentMarksAndAnnotations.enhancedOffPageComments.length > 0) {
            currentMarksAndAnnotations.enhancedOffPageComments.map((e: EnhancedOffPageComment) => {
                if (e.isDefinitive === true && e.examinerRoleId !== examinerRoleID) {
                    let _enhancedOffPageComment: EnhancedOffPageComment = e;
                    _enhancedOffPageComment.enhancedOffPageCommentId = 0;
                    _enhancedOffPageComment.examinerRoleId = examinerRoleID;
                    _enhancedOffPageComment.rowVersion = '';
                    _enhancedOffPageComment.clientToken = htmlUtilities.guid;
                    _enhancedOffPageComment.isDirty = true;
                    _enhancedOffPageComment.uniqueId = htmlUtilities.guid;
                    _enhancedOffPageComment.markingOperation = enums.MarkingOperation.added;
                    _enhancedOffPageComment.isDefinitive = true;
                }
            });
        }
    }

	/**
	 * Copy or update marks for mark as definitive
	 * @param isDefinitive
	 * @param copyMarks
	 */
    private copyOrUpdateMarksForDefinitive(isDefinitive: boolean, copyMarks: boolean): void {
        let allMarksAndAnnotationsToCopy = JSON.parse(JSON.stringify(this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[0]));

        let currentMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[0];

        let examinerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;

        if (copyMarks) {
            //Copy marks and annotations while marker choose to copy marks as definitive.
            allMarksAndAnnotationsToCopy.examinerMarksCollection.forEach((e: examinerMark) => {
                if (e.definitiveMark === !isDefinitive) {
                    let _examinerMark: examinerMark = e;
                    _examinerMark.markId = 0;
                    _examinerMark.examinerRoleId = examinerRoleId;
                    _examinerMark.markGroupId = this.currentMarkGroupId;
                    _examinerMark.rowVersion = '';
                    _examinerMark.version = 0;
                    _examinerMark.isDirty = true;
                    _examinerMark.uniqueId = htmlUtilities.guid;
                    _examinerMark.markingOperation = enums.MarkingOperation.added;
                    _examinerMark.definitiveMark = true;

                    currentMarksAndAnnotations.examinerMarksCollection.push(_examinerMark);
                }
            });

            /* Copying EnhancedOffPage annotations for Copy Marks as definitive */
            if (allMarksAndAnnotationsToCopy.enhancedOffPageComments && allMarksAndAnnotationsToCopy.enhancedOffPageComments.length > 0) {
                allMarksAndAnnotationsToCopy.enhancedOffPageComments.forEach((e: EnhancedOffPageComment) => {
                    if (e.isDefinitive === !isDefinitive) {
                        let _enhancedOffPageComment: EnhancedOffPageComment = e;
                        _enhancedOffPageComment.enhancedOffPageCommentId = 0;
                        _enhancedOffPageComment.examinerRoleId = examinerRoleId;
                        _enhancedOffPageComment.rowVersion = '';
                        _enhancedOffPageComment.clientToken = htmlUtilities.guid;
                        _enhancedOffPageComment.isDirty = true;
                        _enhancedOffPageComment.uniqueId = htmlUtilities.guid;
                        _enhancedOffPageComment.markingOperation = enums.MarkingOperation.added;
                        _enhancedOffPageComment.isDefinitive = true;

                        currentMarksAndAnnotations.enhancedOffPageComments.push(_enhancedOffPageComment);
                    }
                });
            }
        } else {
            // Update the provisional marks collection as definitive since same marker is marking the definitive.
            currentMarksAndAnnotations.examinerMarksCollection.forEach((e: examinerMark) => {
                if (e.definitiveMark === !isDefinitive) {
                    let _examinerMark: examinerMark = e;
                    _examinerMark.isDirty = true;
                    _examinerMark.definitiveMark = isDefinitive;
                    _examinerMark.markingOperation = enums.MarkingOperation.updated;
                }
            });

            if (currentMarksAndAnnotations.annotations) {
                currentMarksAndAnnotations.annotations.map((e: annotation) => {
                    if (e.definitiveMark === !isDefinitive) {
                        let _annotation: annotation = e;
                        _annotation.isDirty = true;
                        _annotation.definitiveMark = isDefinitive;
                        _annotation.markingOperation = enums.MarkingOperation.updated;
                    }
                });
            }

            if (currentMarksAndAnnotations.enhancedOffPageComments && currentMarksAndAnnotations.enhancedOffPageComments.length > 0) {
                currentMarksAndAnnotations.enhancedOffPageComments.map((e: EnhancedOffPageComment) => {
                    if (e.isDefinitive === !isDefinitive) {
                        let _enhancedOffPageComment: EnhancedOffPageComment = e;
                        _enhancedOffPageComment.isDirty = true;
                        _enhancedOffPageComment.isDefinitive = isDefinitive;
                        _enhancedOffPageComment.markingOperation = enums.MarkingOperation.updated;
                    }
                });
            }
        }
        this.updateMarksAndAnnotationsSaveQueueingStatus(this._currentMarkGroupId, true);
    }

    /**
     * copying previous marks
     * @param markGroupId
     */
    public copyPreviousMarks(markGroupId: number): void {
        let _examinerMarksAndAnnotation: examinerMarksAndAnnotation;
        // Holds the marks and annotations for the corresponding markgroup in the case of whole response.
        let allMarksAndAnnotationsForTheMarkGroup = this.examinerMarksAgainstCurrentResponse != null ?
            this.examinerMarksAgainstCurrentResponse.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations : null;
        let allMarksAndAnnotations = JSON.parse(JSON.stringify(allMarksAndAnnotationsForTheMarkGroup));
        if (allMarksAndAnnotations) {
            let allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter((x: any) => x.isDefault === true);
            if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                _examinerMarksAndAnnotation = allMarksAndAnnotationsWithIsDefault[0];
            } else {
                _examinerMarksAndAnnotation = allMarksAndAnnotations[1];
            }
        }

        let currentMarksAndAnnotations = this.examinerMarksAgainstCurrentResponse.examinerMarkGroupDetails[markGroupId].
            allMarksAndAnnotations[0];

        // if we reset the marks, then markingOperation is set as deleted 
        // and the next copying adds extra entries as newly added marks
        // reset the examinerMarksCollection to remove the deleted marks
        currentMarksAndAnnotations.examinerMarksCollection = [];
        if (_examinerMarksAndAnnotation) {
            if (currentMarksAndAnnotations.examinerMarksCollection) {
                /* Copying marks */
                _examinerMarksAndAnnotation.examinerMarksCollection.map((e: examinerMark) => {
                    let _examinerMark: examinerMark = e;
                    _examinerMark.markId = 0;
                    _examinerMark.examinerRoleId = currentMarksAndAnnotations.examinerRoleId;
                    _examinerMark.markGroupId = markGroupId;
                    _examinerMark.rowVersion = '';
                    _examinerMark.version = 0;
                    _examinerMark.isDirty = true;
                    _examinerMark.uniqueId = htmlUtilities.guid;
                    _examinerMark.markingOperation = enums.MarkingOperation.added;

                    currentMarksAndAnnotations.examinerMarksCollection.push(_examinerMark);
                });
            }
        }
    }

    /**
     * copying previous marks - TODO - updating store direct is antipattern. change this in future.
     * @param _markDetails - mark details for updating marking progress
     * @param isAllPagesAnnotated
     * @param markGroupId
     */
    public updateMarkingProgress(_markDetails: MarkDetails, isAllPagesAnnotated: boolean, markGroupId?: number) {
        this.updateMarkingDetails(
            markGroupId ? markGroupId : this.selectedQIGMarkGroupId,
            _markDetails.markingProgress,
            parseFloat(_markDetails.totalMark),
            _markDetails.totalMarkedMarkSchemes,
            _markDetails.isAllNR,
            isAllPagesAnnotated,
            _markDetails.markSchemeCount);
        // queueing status is always saved against current mark group id
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    }

    /**
     * Check if any annotation exist.
     */
    public checkAnyAnnotationExist(): boolean {
        let _examinerMarksAndAnnotation: examinerMarksAndAnnotation;
        _examinerMarksAndAnnotation = this.getAllMarksAndAnnotations()[0];
        if (_examinerMarksAndAnnotation.annotations.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This method will return true if passed type is a non-recoverable one else return false
     * @param errorType
     */
    public isNonRecoverableError(errorType: enums.SaveMarksAndAnnotationErrorCode): boolean {
        switch (errorType) {
            case enums.SaveMarksAndAnnotationErrorCode.MarksAndAnnotationsOutOfDate:
            case enums.SaveMarksAndAnnotationErrorCode.WithdrawnResponse:
            case enums.SaveMarksAndAnnotationErrorCode.ClosedResponse:
            case enums.SaveMarksAndAnnotationErrorCode.AllPagesNotAnnotated:
            case enums.SaveMarksAndAnnotationErrorCode.MarksAndAnnotationsMismatch:
            case enums.SaveMarksAndAnnotationErrorCode.StampsModified:
            case enums.SaveMarksAndAnnotationErrorCode.MandateMarkschemeNotCommented:
            case enums.SaveMarksAndAnnotationErrorCode.NonRecoverableError:
            case enums.SaveMarksAndAnnotationErrorCode.TotalMarkMismatch:
                return true;
            default:
                return false;
        }
    }

    /**
     * Get Default MarksAndAnnotation For Current Remark
     */
    public getDefaultMarksAndAnnotationForCurrentRemark(): examinerMarksAndAnnotation {
        let allMarksAndAnnotations = this.getAllMarksAndAnnotations();
        if (allMarksAndAnnotations) {
            let allMarksAndAnnotationsWithIsDefault = allMarksAndAnnotations.filter((x: any) => x.isDefault === true);
            if (allMarksAndAnnotationsWithIsDefault.length === 1) {
                return allMarksAndAnnotationsWithIsDefault[0];
            } else {
                return allMarksAndAnnotations[1];
            }
        }

        return null;
    }

    /**
     * Get Selected MarkSchemeID
     */
    public getSelectedMarkSchemeID(): number {
        return this._currentExaminerMark.markSchemeId;
    }

    /**
     * Get MarkChangeReason
     * @param markGroupId
     */
    public getMarkChangeReason(markGroupId: number): string {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo) {
            return _markChangeReasonInfo.markChangeReason;
        } else {
            return null;
        }
    }

    /**
     * Get IsMarkChangeReasonUpdated
     * @param markGroupId
     */
    public getIsMarkChangeReasonUpdated(markGroupId: number): boolean {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo) {
            return _markChangeReasonInfo.isMarkChangeReasonUpdated;
        } else {
            return null;
        }
    }

    /**
     * Set MarkChangeReasonInfo
     */
    private setMarkChangeReasonInfo() {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(this._currentMarkGroupId);

        if (_markChangeReasonInfo) {
            _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
        } else {
            _markChangeReasonInfo = new markChangeReasonInfo();
            _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
            _markChangeReasonInfo.markChangeReason = workListStore.instance.getMarkChangeReason(
                this._currentMarkGroupId,
                this._currentResponseMode);
        }
        this.markChangeReasonData = this.markChangeReasonData.set(this.currentMarkGroupId, _markChangeReasonInfo);
    }

    /**
     * Reset MarkChangeReason UpdateStatus
     */
    private resetMarkChangeReasonUpdateStatus(markGroupId: number) {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);

        if (_markChangeReasonInfo && _markChangeReasonInfo.isMarkChangeReasonUpdated) {
            _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
            this.markChangeReasonData = this.markChangeReasonData.set(markGroupId, _markChangeReasonInfo);
        }
    }

    /**
     * Update MarkChangeReasons
     * @param _markChangeReason
     */
    private updateMarkChangeReasons(_markChangeReason: string) {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(this.currentMarkGroupId);
        if (!_markChangeReasonInfo) {
            _markChangeReasonInfo = new markChangeReasonInfo();
        }
        if (_markChangeReasonInfo.markChangeReason !== _markChangeReason) {
            _markChangeReasonInfo.isMarkChangeReasonUpdated = true;
            _markChangeReasonInfo.markChangeReason = _markChangeReason;
            this.markChangeReasonData = this.markChangeReasonData.set(this.currentMarkGroupId, _markChangeReasonInfo);
        }
    }

    /**
     * Update MarkChangeReason Visibility
     * @param _isMarkChangeReasonVisible
     */
    private updateMarkChangeReasonVisibility(_isMarkChangeReasonVisible: boolean) {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(this.currentMarkGroupId);

        if (_markChangeReasonInfo.isMarkChangeReasonVisible !== _isMarkChangeReasonVisible) {
            _markChangeReasonInfo.isMarkChangeReasonVisible = _isMarkChangeReasonVisible;
            if (!_markChangeReasonInfo.isMarkChangeReasonVisible) {
                _markChangeReasonInfo.isMarkChangeReasonUpdated = false;
                _markChangeReasonInfo.markChangeReason = undefined;
            }
            this.markChangeReasonData = this.markChangeReasonData.set(this.currentMarkGroupId, _markChangeReasonInfo);
        }
    }

    /**
     * Check isMarkChangeReasonVisible
     * @param markGroupId
     */
    public isMarkChangeReasonVisible(markGroupId: number): boolean {
        let _markChangeReasonInfo: markChangeReasonInfo = new markChangeReasonInfo();
        _markChangeReasonInfo = this.markChangeReasonData.get(markGroupId);
        if (_markChangeReasonInfo) {
            return _markChangeReasonInfo.isMarkChangeReasonVisible;
        } else {
            return null;
        }
    }

    public get getMarksAndAnnotationVisibilityDetails():
        Immutable.Map<number, Immutable.Map<number, marksAndAnnotationsVisibilityInfo>> {
        return this.marksAndAnnotationVisibilityDetails;
    }

    public get getExaminerMarksAgainstResponse(): Array<examinerMarkData> {
        return this._examinerMarksAgainstResponse;
    }

    /**
     * Gets a value indicating zoom width
     * @returns
     */
    public get zoomWidth(): number {
        return this._zoomToWidth;
    }

    /*returns the status of context menu*/
    public get contextMenuDisplayStatus(): boolean {
        return this.isContextMenuVisible;
    }

    /**
     * returns whether current markscheme is non numeric or not
     */
    public get isNonNumeric(): boolean {
        return this._isNonNumeric;
    }

    /**
     * returns all annotations aganist current response.
     */
    public allAnnotationsAganistResponse(isLinkedAnnotation: boolean): any {
        let markItem = this._examinerMarksAgainstResponse[this.currentMarkGroupId];
        let annotation: annotation[] = [];
        if (markItem && isLinkedAnnotation && this._isWholeResponse) {
            for (let examinerMarkGroupDetails in markItem.examinerMarkGroupDetails) {
                if (examinerMarkGroupDetails && markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                    .allMarksAndAnnotations[0].annotations.length > 0) {
                    annotation.push(markItem.examinerMarkGroupDetails[examinerMarkGroupDetails]
                        .allMarksAndAnnotations[0].annotations);
                }
            }
        } else {
            if (this.isUnclassifiedOrClassified) {
                annotation.push(this._examinerMarksAgainstResponse[this.currentMarkGroupId]
                    .examinerMarkGroupDetails[this.selectedQIGMarkGroupId]
                    .allMarksAndAnnotations[0].annotations.filter((annotation: any) =>
                        annotation.definitiveMark === this.isDefinitiveMarking));
            } else {
                annotation.push(this._examinerMarksAgainstResponse[this.currentMarkGroupId]
                    .examinerMarkGroupDetails[this.selectedQIGMarkGroupId]
                    .allMarksAndAnnotations[0].annotations);
            }
        }

        return annotation;
    }

    /**
     * Returns the current operation mode.
     */
    private get currentOperationMode(): enums.MarkerOperationMode {
        return this._operationMode;
    }

    /**
     * Checks whether the response is dirty
     * @param markGroupId
     */
    public isResponseDirty(parentMarkGroupId: number, markGroupId: number): boolean {
        // TODO: Changes needed for Whole response to check all markGroupIDs for dirty marks
        let dirtyMarks: examinerMark[] = this.getDirtyExaminerMarks(parentMarkGroupId, markGroupId);
        let dirtyAnnotations: examinerAnnotations[] = this.getDirtyExaminerAnnotations(parentMarkGroupId, markGroupId);
        return ((dirtyMarks && dirtyMarks.length > 0) ||
            (dirtyAnnotations && dirtyAnnotations.length > 0));
    }

    /**
     * Returns the whether the previous mark list column visible or not
     */
    public get previousMarkListColumnVisible(): boolean {
        return this._isPreviousMarkListColumnVisible;
    }

    /**
     * This method will returns the selected display ID
     */
    public get selectedDisplayId(): number {
        return this._selectedDisplayId;
    }

    /**
     * Returns the currently linked page number
     */
    public get currentlyLinkedZonePageNumber(): number {
        return this.linkWholePageNumber;
    }

    /**
     * resets the linked zone page number.
     */
    public resetLinkedZonePageNumber() {
        this.linkWholePageNumber = 0;
    }

	/**
	 * Returns whether the response is editable or not.
	 */
    public isResponseEditable(responseMode: enums.ResponseMode): boolean {

        let isEditable: boolean = true;
        let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation ?
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        let updatePendingResponsesWhenSuspendedCCOn: boolean = ccHelper.getCharacteristicValue
            (ccNames.UpdatePendingResponsesWhenSuspended, markSchemeGroupId).toLowerCase() === 'true';
        if (examinerStore.instance.getMarkerInformation &&
            examinerStore.instance.getMarkerInformation.approvalStatus === enums.ExaminerApproval.Suspended
            && responseMode === enums.ResponseMode.pending
            && !updatePendingResponsesWhenSuspendedCCOn) {
            isEditable = false;
        }

        if (responseMode === enums.ResponseMode.closed ||
            (this.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup &&
                (this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.SelectResponse ||
                    (this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.UnClassifiedResponse
                        && (!this._hasDefinitiveMarks || !this._standardisationSetupPermissionData.role.permissions.editDefinitives)) ||
                (this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.ClassifiedResponse
                    && (!this._standardisationSetupPermissionData.role.permissions.editDefinitives
                        || qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete)))
            )) {
            isEditable = false;
        }
        return isEditable;
    }

    /**
     * Set Supervisor Remark Decision Info
     */
    private setSupervisorRemarkDecision() {
        let _supervisorRemarkDecision: supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecision = this.supervisorRemarkDecisionData.get(this._currentMarkGroupId);

        if (_supervisorRemarkDecision) {
            _supervisorRemarkDecision.isSRDReasonUpdated = false;
        } else {
            _supervisorRemarkDecision = new supervisorRemarkDecision();
            _supervisorRemarkDecision = workListStore.instance.getSupervisorRemarkDecision(
                this._currentMarkGroupId,
                this.currentResponseMode);
        }
        this.supervisorRemarkDecisionData = this.supervisorRemarkDecisionData.set(this.currentMarkGroupId, _supervisorRemarkDecision);
    }

    /**
     * Update Supervisor Remark Decision Info
     * @param supervisorRemarkDecision
     */
    private updateSupervisorRemarkDecision(_supervisorRemarkDecision: supervisorRemarkDecision) {

        let _supervisorRemarkDecisionInfo: supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecisionInfo = this.supervisorRemarkDecisionData.get(this.currentMarkGroupId);
        if (!_supervisorRemarkDecisionInfo) {
            _supervisorRemarkDecisionInfo = new supervisorRemarkDecision();
        }
        if (_supervisorRemarkDecisionInfo.supervisorRemarkFinalMarkSetID !== _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID ||
            _supervisorRemarkDecisionInfo.supervisorRemarkMarkChangeReasonID !==
            _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID) {

            _supervisorRemarkDecisionInfo.supervisorRemarkFinalMarkSetID = _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID;
            _supervisorRemarkDecisionInfo.supervisorRemarkMarkChangeReasonID =
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID;
            _supervisorRemarkDecisionInfo.isSRDReasonUpdated = true;

            this.supervisorRemarkDecisionData = this.supervisorRemarkDecisionData.set(this.currentMarkGroupId,
                _supervisorRemarkDecisionInfo);
        }
    }

    /**
     * Reset supervisor remark decision UpdateStatus
     */
    private resetSupervisorRemakDecisionUpdateStatus() {
        let _supervisorRemarkDecisionInfo: supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecisionInfo = this.supervisorRemarkDecisionData.get(this.currentMarkGroupId);

        if (_supervisorRemarkDecisionInfo.isSRDReasonUpdated) {
            _supervisorRemarkDecisionInfo.isSRDReasonUpdated = false;
            this.supervisorRemarkDecisionData = this.supervisorRemarkDecisionData.set(this.currentMarkGroupId,
                _supervisorRemarkDecisionInfo);
        }
    }

    /**
     * Get SupervisorRemarkDecision
     * @param markGroupId
     */
    public getSupervisorRemarkDecision(markGroupId: number): supervisorRemarkDecision {
        let _supervisorRemarkDecisionInfo: supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecisionInfo = this.supervisorRemarkDecisionData.get(markGroupId);
        if (_supervisorRemarkDecisionInfo) {
            return _supervisorRemarkDecisionInfo;
        } else {
            return null;
        }
    }

    /**
     * Get isSRDReasonUpdated
     * @param markGroupId
     */
    public getIsSRDReasonUpdated(markGroupId: number): boolean {
        let _supervisorRemarkDecision: supervisorRemarkDecision = new supervisorRemarkDecision();
        _supervisorRemarkDecision = this.supervisorRemarkDecisionData.get(markGroupId);
        if (_supervisorRemarkDecision) {
            return _supervisorRemarkDecision.isSRDReasonUpdated;
        } else {
            return null;
        }
    }

    /**
     * Get SupervisorRemarkDecisionType
     * @param SupervisorRemarkDecisionType
     */
    private getSupervisorRemarkDecisionType(remarkDecision: enums.SupervisorRemarkDecisionType): supervisorRemarkDecision {
        let _supervisorRemarkDecision: supervisorRemarkDecision = new supervisorRemarkDecision();
        switch (remarkDecision) {
            case enums.SupervisorRemarkDecisionType.none:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 0;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 0;
                break;
            case enums.SupervisorRemarkDecisionType.originalmarks:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 2;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 3;
                break;
            case enums.SupervisorRemarkDecisionType.judgementaloutsidetolerance:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 1;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 2;
                break;
            case enums.SupervisorRemarkDecisionType.nonjudgementalerror:
                _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID = 1;
                _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID = 1;
                break;
        }
        return _supervisorRemarkDecision;
    }

    /**
     * Get SupervisorRemarkDecisionType
     * @param SupervisorRemarkDecision
     */
    public convertSupervisorRemarkDecisionType(): enums.SupervisorRemarkDecisionType {
        let _supervisorRemarkDecision: supervisorRemarkDecision = this.getSupervisorRemarkDecision(this.currentMarkGroupId);

        let supervisorRemarkFinalMarkSetID: number = _supervisorRemarkDecision.supervisorRemarkFinalMarkSetID;
        let supervisorRemarkMarkChangeReasonID: number = _supervisorRemarkDecision.supervisorRemarkMarkChangeReasonID;

        if (supervisorRemarkFinalMarkSetID === 2 && supervisorRemarkMarkChangeReasonID === 3) {
            return enums.SupervisorRemarkDecisionType.originalmarks;
        } else if (supervisorRemarkFinalMarkSetID === 1 && supervisorRemarkMarkChangeReasonID === 2) {
            return enums.SupervisorRemarkDecisionType.judgementaloutsidetolerance;
        } else if (supervisorRemarkFinalMarkSetID === 1 && supervisorRemarkMarkChangeReasonID === 1) {
            return enums.SupervisorRemarkDecisionType.nonjudgementalerror;
        } else {
            return enums.SupervisorRemarkDecisionType.none;
        }
    }

    /**
     * Remove enhanced off page comment
     * @param removeEnhancedOffPageCommentsList list of
     */
    private removeEnhancedOffPageComment(removeEnhancedOffPageCommentsList: Array<string>) {

        // Denotes if the response is to be queued for save after removing the annotation
        // If the removed annotation is a newly put annotation that doesn't already exist
        // in the database, then no need to queue the response for saving process
        let isResponseToBeQueuedForSave: boolean = false;

        // Denotes the list of newly added annotations that are removed
        // and doesn't already exist in the database
        let newlyAddedEnhancedOffPageComments: Array<string> = [];

        removeEnhancedOffPageCommentsList.map((clientToken: string) => {
            this.examinerMarksAgainstCurrentResponse.
                examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
                allMarksAndAnnotations[0].enhancedOffPageComments.map((e: EnhancedOffPageComment) => {
                    if (e.clientToken === clientToken) {
                        // If enhancedOffPageComment id exists, then that means that the enhancedOffPageComment
                        // already exists in the database, hence just set the isDirty flag to true
                        // and set the 'isResponseToBeQueuedForSave' flag to true for
                        // adding the response to the save marks and annotations queue
                        if (e.enhancedOffPageCommentId !== 0) {
                            isResponseToBeQueuedForSave = true;
                            e.isDirty = true;
                            e.uniqueId = htmlUtilities.guid;
                            e.markingOperation = enums.MarkingOperation.deleted;
                        } else {
                            // If annotation id doesn't exist, then push the annotation to the
                            // newly added annotations list after setting the same to dirty
                            e.isDirty = true;
                            e.uniqueId = htmlUtilities.guid;
                            e.markingOperation = enums.MarkingOperation.deleted;
                            newlyAddedEnhancedOffPageComments.push(e.clientToken);
                        }
                    }
                });
        });

        // If there are enhancedOffPageComments in the newly added enhancedOffPageComments list,
        // then simply remove it from the actual enhancedOffPageComments list in the
        // marks and annotations collection in the store
        if (newlyAddedEnhancedOffPageComments.length > 0) {
            for (let i = 0; i < newlyAddedEnhancedOffPageComments.length; i++) {
                let index: number = this.findIndex(newlyAddedEnhancedOffPageComments[i]);
                if (index >= 0) {
                    this.examinerMarksAgainstCurrentResponse.
                        examinerMarkGroupDetails[this.currentMarkGroupId].
                        allMarksAndAnnotations[0].enhancedOffPageComments.splice(index, 1);
                }
            }
        }


        // Push the response to the queue only if a save is definitely required
        // because of removing an annotation which was already in the database
        if (isResponseToBeQueuedForSave) {
            // Update the marks and annotations save queue status to Await Queueing
            this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
        }
    }

    /**
     * Update enhanced off page comment when there are changes
     * @param removeEnhancedOffPageCommentsList list of
     */
    private updateEnhancedOffPageComment(clientToken: string, commentText: string, selectedMarkSchemeId: number, selectedFileId: number) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].enhancedOffPageComments.map((e: EnhancedOffPageComment) => {
                if (e.clientToken === clientToken) {
                    e.isDirty = true;
                    e.uniqueId = htmlUtilities.guid;
                    e.markingOperation = e.enhancedOffPageCommentId === 0 ? e.markingOperation : enums.MarkingOperation.updated;
                    e.comment = commentText;
                    e.markSchemeId = selectedMarkSchemeId;
                    e.fileId = selectedFileId;
                }
            });
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    }

    /**
     * Add enhanced off page comment
     * @param commentText
     * @param selectedMarkSchemeId
     * @param selectedFileId
     */
    private addEnhancedOffPageComment(commentText: string, selectedMarkSchemeId: number, selectedFileId: number) {
        let enhancedOffPageComment: EnhancedOffPageComment = {
            enhancedOffPageCommentId: 0,
            markGroupId: this.selectedQIGMarkGroupId,
            clientToken: htmlUtilities.guid,
            comment: commentText,
            examinerRoleId: qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            markSchemeId: selectedMarkSchemeId === 0 ? null : selectedMarkSchemeId,
            fileId: selectedFileId === 0 ? null : selectedFileId,
            uniqueId: htmlUtilities.guid,
            isDirty: true,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
            markingOperation: enums.MarkingOperation.added,
            isDefinitive: this.isUnclassifiedOrClassified && this.isDefinitiveMarking
        };

        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].enhancedOffPageComments.push(enhancedOffPageComment);

        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    }

    /**
     * Adds bookmark to the current marks collection
     * @param bookmark bookmark to add
     */
    private addBookmark(bookmark: bookmark) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].bookmarks.push(bookmark);

        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    }

    /**
     * Update bookmark name
     * @param bookmarkName - Updated bookmark name
     * @param bookmarkClientToken - Client token of the bookmark, which need to be updated
     */
    private updateBookmarkName(bookmarkName: string, bookmarkClientToken: string) {
        this.examinerMarksAgainstCurrentResponse.
            examinerMarkGroupDetails[this.selectedQIGMarkGroupId].
            allMarksAndAnnotations[0].bookmarks.map((e: bookmark) => {
                if (e.clientToken === bookmarkClientToken) {
                    e.isDirty = true;
                    e.comment = bookmarkName;
                }
            });
        // Update the marks and annotations save queue status to Await Queueing
        this.updateMarksAndAnnotationsSaveQueueingStatus(this.currentMarkGroupId, true);
    }

    /**
     * get is all files viewed status
     * @readonly
     * @type {boolean}
     * @memberof MarkingStore
     */
    public get isAllFilesViewedStatusUpdated(): boolean {
        return this._isAllFilesViewedStatusUpdated;
    }

    /**
     * returns boolean whether response is remark or not.
     */
    public get hasPreviousMarks() {
        return this._examinerMarksAgainstResponse[this._currentMarkGroupId]
            && this._examinerMarksAgainstResponse[this._currentMarkGroupId].
                examinerMarkGroupDetails[this._currentMarkGroupId].
                allMarksAndAnnotations.length > 1;
    }

    /**
     * retuns if the marks and mark schemes loaded are or not
     */
    public get isMarksAndMarkSchemesLoadedFailed() {
        return !this._isMarksAndMarkSchemesLoadedFailed;
    }

    /**
     * Get the examiner role id based on QIG to RIG mappings for whole response
     */
    public getExaminerRoleQIGtoRIGMap(parentMarkGroupId: number, markGroupId: number): number {
        let examinerRoleId: number = qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
        let qigToRigMappings = this.qigToRigMappings(parentMarkGroupId);

        if (qigToRigMappings) {
            qigToRigMappings.map((value, key) => {
                if (value.markGroupId === markGroupId) {
                    examinerRoleId = value.examinerRoleId;
                }
            });
        }

        return examinerRoleId;
    }

	/**
	 * Selected QIG Examinor Role Id of Logged in user(For teammanagement)
	 * @param markSchemeGroupId
	 */
    public getSelectedQIGExaminerRoleIdOfLoggedInUser(markSchemeGroupId: number,
        isAwardingMode: boolean): number {

        let loggedInSelectedExaminerRoleId: number = isAwardingMode
            ? awardingStore.instance.selectedCandidateData.responseItemGroups[0].examinerRoleId
            : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;

        if (isAwardingMode && awardingStore.instance.selectedCandidateData.responseItemGroups) {
            awardingStore.instance.selectedCandidateData.responseItemGroups.map((x: ResponseItemGroup) => {
                if (x.markSchemeGroupId === markSchemeGroupId) {
                    loggedInSelectedExaminerRoleId = x.examinerRoleId;
                }
            });
        } else {
            let relatedQigList = qigStore.instance.relatedQigList;
            if (relatedQigList) {
                relatedQigList.map((value, key) => {
                    if (value.markSchemeGroupId === markSchemeGroupId) {
                        loggedInSelectedExaminerRoleId = value.examinerRoleId;
                    }
                });
            }
        }
        return loggedInSelectedExaminerRoleId;
    }

    /**
     * Get the mark Scheme Group id based on QIG to RIG mappings for whole response
     */
    public getMarkSchemeGroupIdQIGtoRIGMap(parentMarkGroupId: number, markGroupId: number): number {
        let markSchemeGroupId: number = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        let qigToRigMappings = this.qigToRigMappings(parentMarkGroupId);

        if (qigToRigMappings) {
            qigToRigMappings.map((value, key) => {
                if (value.markGroupId === markGroupId) {
                    markSchemeGroupId = value.markSchemeGroupId;
                }
            });
        }

        return markSchemeGroupId;
    }

    /**
     * Get the QIG to RIG mappings
     */
    public getMarkGroupIdQIGtoRIGMap(markSchemeGroupId: number): number {
        let markGroupId: number = this.currentMarkGroupId;

        let qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);

        if (qigToRigMappings) {
            qigToRigMappings.map((value, key) => {
                if (value.markSchemeGroupId === markSchemeGroupId) {
                    markGroupId = value.markGroupId;
                }
            });
        }

        return markGroupId;
    }

    /**
     * Get the related markSchemeGroupIds for a whole response
     */
    public getRelatedWholeResponseQIGIds(): number[] {
        let markSchemeGroupIds: number[] = [];

        let qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);

        // Add related markSchemeGroupIds
        if (qigToRigMappings !== undefined && qigToRigMappings.count() > 0) {
            qigToRigMappings.map((value, key) => {
                markSchemeGroupIds.push(value.markSchemeGroupId);
            });
        }

        return markSchemeGroupIds;
    }

    /**
     * Get the related examinerRoleIds for a whole response
     */
    public getRelatedWholeResponseExaminerRoleIds(): number[] {
        let examinerRoleIds: number[] = [];

        let qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);

        // Add related examinerRoleIds
        if (qigToRigMappings !== undefined && qigToRigMappings.count() > 0) {
            qigToRigMappings.map((value, key) => {
                examinerRoleIds.push(value.examinerRoleId);
            });
        }

        return examinerRoleIds;
    }

    /**
     * Get the related details of all QIGs in a whole response
     */
    private qigToRigMappings(markGroupId: number): Immutable.Map<number, examinerRoleMarkGroupDetails> {
        let qigToRigMappings: Immutable.Map<number, examinerRoleMarkGroupDetails> =
            this._examinerMarksAgainstResponse[markGroupId] ?
                this._examinerMarksAgainstResponse[markGroupId].wholeResponseQIGToRIGMapping : undefined;
        return qigToRigMappings;
    }

    /**
     * Get the selected QIGs mark scheme group Id
     */
    public get selectedQIGMarkSchemeGroupId() {
        return (this._selectedQIGMarkSchemeGroupId && this._isWholeResponse) ?
            this._selectedQIGMarkSchemeGroupId :
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
    }

    /**
     * Get the selected QIGs mark group Id
     */
    public get selectedQIGMarkGroupId() {
        return (this._selectedQIGMarkGroupId && this._isWholeResponse) ?
            this._selectedQIGMarkGroupId : this._currentMarkGroupId;
    }

    /**
     * Get the selected QIGs examiner role Id
     */
    public get selectedQIGExaminerRoleId() {
        return (this._selectedQIGExaminerRoleId && this._isWholeResponse) ?
            this._selectedQIGExaminerRoleId : qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId;
    }

    public get selectedQIGExaminerRoleIdOfLoggedInUser() {
        return (this._selectedQIGExaminerRoleIdOfLoggedInUser && this._isWholeResponse) ?
            this._selectedQIGExaminerRoleIdOfLoggedInUser : qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId;
    }

    /**
     * Clear the marks and annotation in store, for the related RIGs of whole response.
     * @param markGroupId
     */
    public clearMarksAndAnnotationsForRelatedRigs(markGroupId: number) {
        let relatedMarkGroupIds: number[] = workListStore.instance.getRelatedMarkGroupIdsForWholeResponse(markGroupId);
        if (relatedMarkGroupIds.length > 0) {
            relatedMarkGroupIds.forEach((mgid: number) => {
                if (this.isMarksLoaded(mgid)) {
                    this._examinerMarksAgainstResponse[mgid] = null;
                }
            });

            // Clear worklist cache
            this.storageAdapterHelper.clearStorageArea('worklist');
        }
    }

    /**
     * set remarkrequesttype for each qigs annotations
     */
    private setRemarkRequestType(markGroupId: number) {
        if (this._examinerMarksAgainstResponse) {
            let markItem = this._examinerMarksAgainstResponse[markGroupId];
            if (markItem) {
                for (let item in markItem.examinerMarkGroupDetails) {
                    if (item) {
                        // Loop through annotations of all QIGs
                        let allMarksAndAnnotations = markItem.examinerMarkGroupDetails[item]
                            .allMarksAndAnnotations[0];
                        let annotations = allMarksAndAnnotations.annotations;
                        if (annotations) {
                            annotations.filter((annotation: any) => {
                                // set the remark request type for the annotations
                                annotation.remarkRequestTypeId = allMarksAndAnnotations.remarkRequestTypeId;
                            });
                        }
                    }
                }
            }
        }
    }

    /**
     * Get the related MarkGroupIds for a whole response
     */
    public getRelatedWholeResponseMarkGroupIds(): number[] {
        let markGroupIds: number[] = [];

        let qigToRigMappings = this.qigToRigMappings(this._currentMarkGroupId);

        // Add related markSchemeGroupIds
        if (qigToRigMappings !== undefined && qigToRigMappings.count() > 0) {
            qigToRigMappings.map((value, key) => {
                markGroupIds.push(value.markGroupId);
            });
        }

        return markGroupIds;
    }

    /**
     * is the given mark group id is a related mark group id of the current response
     * @param markGroupId
     */
    public isRelatedMarkGroupId(markGroupId: number): boolean {
        let relatedMarkGroupIds = this.getRelatedWholeResponseMarkGroupIds();
        if (relatedMarkGroupIds) {
            return relatedMarkGroupIds.filter((mgId: number) => mgId === markGroupId).length > 0;
        }
        return false;
    }

    /**
     * get mark details for the selected QIG node in tree. (Whole response scenario)
     * @param tree markscheme Treeview
     * @param markSchemeGroupId qig id
     */
    private getSelectedQigMarkingProgressDetails(tree: treeViewItem, markSchemeGroupId: number) {
        let item: treeViewItem = tree.treeViewItemList.filter((treeItem: treeViewItem, key: number) => (
            treeItem.itemType === enums.TreeViewItemType.QIG && treeItem.markSchemeGroupId === markSchemeGroupId
        )).first() as treeViewItem;
        let markDetails = {
            markingProgress: item.markingProgress,
            maximumMark: item.maximumNumericMark,
            totalMark: item.totalMarks,
            totalMarkedMarkSchemes: item.markCount,
            isAllNR: item.isAllNR,
            markSchemeCount: item.markSchemeCount
        };
        return markDetails;
    }

    /**
     * Is the response is rotating or not
     */
    public get isRotating(): boolean {
        return this._isRotating;
    }

    /**
     * get the current question item's of question tag id
     */
    public get currentQuestionItemQuestionTagId(): number {
        return this.currentQuestionItemInfo ? this.currentQuestionItemInfo.questionTagId : undefined;
    }

    /**
     * get previous question item's question tag id
     */
    public get previousQuestionItemQuestionTagId(): number {
        return this._previousQuestionItemQuestionTagId;
    }

    /**
     * Returns true if definitive marking started for the current response
     */
    public get isDefinitiveMarking(): boolean {
        return (this._hasDefinitiveMarks
            && (this._standardisationSetupPermissionData.role.permissions.editDefinitives
                || this._standardisationSetupPermissionData.role.permissions.viewDefinitives));
    }

    /**
     * get true if the selected standardisation tab is Unclassified.
     */
    private get isUnclassifiedOrClassified(): boolean {
        return this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.ClassifiedResponse
            || this._selectedstandardisationSetupWorklist === enums.StandardisationSetup.UnClassifiedResponse;
    }

    /**
     * get previous answer item ID
     */
    public get previousAnswerItemId(): number {
        return this._previousAnswerItemId;
    }

    /**
     * clear usedInTotal on initial load only if the marking progress is not 100%.
     */
    private clearUsedInTotal(markGroupId: number) {
        let examinerMarksAndAnnotations: examinerMarkData = this._examinerMarksAgainstResponse[markGroupId];
        var allMarksAndAnnotations: examinerMarksAndAnnotation =
            examinerMarksAndAnnotations.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0];

        allMarksAndAnnotations.examinerMarksCollection.map((_examinerMark: examinerMark) => {
            _examinerMark.usedInTotal = true;
        });
    }

    /**
     * set visibility for provisional marks and annotation
     */
    private setProvisionalMarksAndAnnotationVisibility(): void {
        let examinerMarksAgainstResponse = this._examinerMarksAgainstResponse[this._currentMarkGroupId.toString()];
        if (examinerMarksAgainstResponse) {
            let allMarksAndAnnotations = examinerMarksAgainstResponse.
                examinerMarkGroupDetails[this._currentMarkGroupId.toString()].
                allMarksAndAnnotations;
            if (allMarksAndAnnotations) {
                this.marksAndAnnotationVisibilityDetails = this.marksAndAnnotationVisibilityDetails.set(
                    this.currentMarkGroupId,
                    marksAndAnnotationsVisibilityHelper.setMarksAndAnnotationsVisibility(allMarksAndAnnotations,
                        this._currentMarkGroupId,
                        this._currentResponseMode,
                        this._currentWorklistType, true));
            }
        }
    }

    /**
     * copy marks and annotation as provisional marks
     */
    private copyProvisionalMarksAndAnnotation(): void {
        let allMarksAndAnnotations = this.getAllMarksAndAnnotations();
        if (allMarksAndAnnotations && allMarksAndAnnotations.length > 0) {
            // set marks and annotation as provisional 
            allMarksAndAnnotations[1] = JSON.parse(JSON.stringify(allMarksAndAnnotations[0]));

            let annotations = allMarksAndAnnotations[1].annotations;
            let enhancedOffPageComments = allMarksAndAnnotations[1].enhancedOffPageComments;
            let marks = allMarksAndAnnotations[1].examinerMarksCollection;

            // set color of provisional annotations to grey and isdirty to false
            if (annotations) {
                annotations.map((item: annotation) => {
                    item.isDirty = false;
                    item.red = 128;
                    item.green = 128;
                    item.blue = 128;
                    item.isPrevious = true;
                    item.clientToken = htmlUtilities.guid;
                });
            }

            // set enhancedoffpage comment isdirty false
            if (enhancedOffPageComments) {
                enhancedOffPageComments.map((item: EnhancedOffPageComment) => {
                    item.isDirty = false;
                    item.isPrevious = true;
                });
            }

            // set mark isdirty false
            if (marks) {
                marks.map((item: examinerMark) => {
                    item.isDirty = false;
                    item.isPrevious = true;
                });
            }
        }
    }

    /**
     * return true if we can render previous marks in standardisation setup
     */
    public get canRenderPreviousMarksInStandardisationSetup(): boolean {
        return this._canRenderPreviousMarksInStandardisationSetup;
    }
	/**
	 * Returns true if the marks collection is updated.
	 */
    public get isDefinitiveMarkCollectionUpdated(): boolean {
        return this._definitiveMarkCollectionUpdated;
    }

	/**
	 * Returns the total Provisional mark
	 */
	private get getProvisionalTotalMarks(): number {
		let provisionalMark: number = 0;
		let _marks = (this._examinerMarksAgainstResponse[this.currentMarkGroupId].
			examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[1] ?
			this._examinerMarksAgainstResponse[this.currentMarkGroupId].
				examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[1].examinerMarksCollection :
			this._examinerMarksAgainstResponse[this.currentMarkGroupId].
				examinerMarkGroupDetails[this.currentMarkGroupId].allMarksAndAnnotations[0].examinerMarksCollection);

        _marks.filter((x: examinerMark) => {
            if (x.definitiveMark === false && x.usedInTotal === true) {
                provisionalMark = provisionalMark + x.numericMark;
            }
        });
        return provisionalMark;
    }

    /**
     * return the keycode that user used while navigating through mark scheme.
     */
    public get KeyCode(): enums.KeyCode {
        return this._keyCode;
    }
}
let instance = new MarkingStore();
export = { MarkingStore, instance };