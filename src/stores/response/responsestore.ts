import scrollPositionChangedAction = require('../../actions/response/scrollpositionchangedaction');
import vieWholePageLinkAction = require('../../actions/response/viewwholepagelinkaction');
import atypicalSearchMarkNowAction = require('../../actions/response/atypicalsearchmarknowaction');
import atypicalSearchMoveToWorklistAction = require('../../actions/response/atypicalsearchmovetoworklistaction');
import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import atypicalResponseSearchResult = require('../../dataservices/response/atypicalresponsesearchresult');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import responseAllocateAction = require('../../actions/response/responseallocateaction');
import atypicalResponseSearchAction = require('../../actions/response/atypicalresponsesearchaction');
import enums = require('../../components/utility/enums');
import responseOpenAction = require('../../actions/response/responseopenaction');
import responseViewModeChangedAction = require('../../actions/response/responseviewmodechangedaction');
import fracsDataSetAction = require('../../actions/response/fracsdatasetaction');
import updateMousePositionAction = require('../../actions/response/updatemousepositionaction');
import mousePosition = require('./mouseposition');
import marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
import responseCloseAction = require('../../actions/worklist/responsecloseaction');
import fullResponseViewOptionChangedAction = require('../../actions/response/fullresponseviewoptionchangedaction');
import updatePageNumberIndicatorAction = require('../../actions/response/updatepagenumberindicatoraction');
import updatePageNumberIndicatorOnZoomAction = require('../../actions/response/updatepagenumberindicatoronzoomaction');
import pageNoIndicatorData = require('./pagenoindicatordata');
import setFracsDataForZoomAction = require('../../actions/zoompanel/setfracsdataforzoomaction');
import rotateResponseAction = require('../../actions/zoompanel/rotateresponseaction');
import customZoomAction = require('../../actions/zoom/customzoomaction');
import zoomUpdatedAction = require('../../actions/zoom/zoomupdatedaction');
import responseImageRotated = require('../../actions/response/responseimagerotatedaction');
import submitResponseCompletedAction = require('../../actions/submit/submitresponsecompletedaction');
import worklistStore = require('../worklist/workliststore');
import markingStore = require('../marking/markingstore');
import Immutable = require('immutable');
import updateDisplayAngleOfresponse = require('../../actions/response/updatedisplayangleofresponseaction');
import imageZoneAction = require('../../actions/imagezones/imagezonesaction');
import responseDataGetAction = require('../../actions/response/responsedatagetaction');
import zoomOptionClickedAction = require('../../actions/zoom/zoomoptionclickedaction');
import pinchZoomAction = require('../../actions/zoom/pinchzoomaction');
import scriptHelper = require('../../utility/script/scripthelper');
import setImageZonesForPageNoAction = require('../../actions/response/setimagezonesforpagenoaction');
import setFracsDataForImageLoadedAction = require('../../actions/response/setfracsdataforimageloadedaction');
import markThisPageNumberAction = require('../../actions/marking/setmarkthispagenumberaction');
import markByOptionClickedAction = require('../../actions/markbyoption/markbyoptionclickedaction');
import createRemarkAction = require('../../actions/response/createremarkaction');
import supervisorRemarkCheckAction = require('../../actions/teammanagement/supervisorremarkcheckaction');
import unManagedSlaoFlagAsSeenAction = require('../../actions/response/unmanagedslaoflagasseenaction');
import responseHelper = require('../../components/utility/responsehelper/responsehelper');
import promoteToSeedAction = require('../../actions/response/promotetoseedaction');
import rejectRigConfirmedAction = require('../../actions/response/rejectrigconfirmedaction');
import rejectRigPopupDisplayAction = require('../../actions/response/rejectrigpopupdisplayaction');
import rejectRigCompletedAction = require('../../actions/response/rejectrigcompletedaction');
import promoteToSeedCheckRemarkAction = require('../../actions/response/promotetoseedcheckremarkaction');
import promoteToSeedReturn = require('./typings/promotetoseedreturn');
import samplingStatusChangeAction = require('../../actions/sampling/samplingstatuschangeaction');
import supervisorRemarkVisibilityAction = require('../../actions/response/supervisorremarkvisibilityaction');
import annotation = require('./typings/annotation');
import promoteToReusBucketAction = require('../../actions/response/promotetoreusebucketaction');
import updateOffPageCommentHeightAction = require('../../actions/offpagecomments/updateoffpagecommentheightaction');
import setResponseAsReviewedAction = require('../../actions/teammanagement/setasreviewedaction');
import setBookmarkPreviousScrollDataAction = require('../../actions/response/setbookmarkpreviousscrolldataaction');
import findVisibleImageIdAction = require('../../actions/response/findvisibleimageidaction');
import structuredFracsDataSetAction = require('../../actions/response/structuredfracsdatasetaction');
import eBookmarkImageZoneRetrievalAction = require('../../actions/script/candidateebookmarkimagezoneretrievalaction');
import constants = require('../../components/utility/constants');
import standardisationSetupSelectWorkListAction = require('../../actions/standardisationsetup/standardisationsetupworklistselectaction');
import rigNotFoundAction = require('../../actions/searchresponse/rignotfoundaction');

/**
 *  Class for Response store
 */
class ResponseStore extends storeBase {

    private _selectedDisplayId: number;
    private _selectedResponseMode: enums.ResponseMode;
    private _selectedMarkGroupId: number;
    private _scrollPosition: number = 0;
    private _mousePosition: mousePosition;
    private _pageNoIndicatorData: pageNoIndicatorData;
    private _currentlyVisibleImageOffsetTop: number = 0;
    private _selectedResponseViewMode: enums.ResponseViewMode = enums.ResponseViewMode.zoneView;
    private _currentZoom: number;
    public _openAtypicalResponse: boolean = false;
    public responseData: any;

    private _previousMarkGroupId: number;
    // offsetTop of the selected image for mark this page functionality.
    private _selectedImageOffsetTop: number = 0;
    // This will hold the element ref name of currently visible image
    private _currentlyVisibleImageContainerRefId: string = 'img_1';
    // This will hold the fracs data
    private _fracsData: Array<FracsData> = [];

    private _nextResponseIdAfterSubmit: number;

    private _displayAnglesOfCurrentResponse: Immutable.Map<string, number>;

    private _markingMethod: enums.MarkingMethod;

    private _searchedResponseData: SearchedResponseData;

    private _isZoomOptionOpen: boolean = false;

    private _isMarkByOptionOpen: boolean = false;

    private _isPinchZooming: boolean = false;

    private _markThisPageNumber: number = 0;

    public _atypicalSearchResult: atypicalResponseSearchResult;

    private _imageZonesAgainstPageNumber: Immutable.List<ImageZone>;

    private _linkedAnnotationAgainstPageNumber: annotation[];

    private _supervisorRemarkResponseCreated: boolean = false;

    private _promoteseedremarkrequestreturn: promoteToSeedReturn;

    private _promoteToSeedFailureCode: enums.FailureCode = enums.FailureCode.None;

    private _isPromotedToSeed: boolean;

    private _sampleReviewCommentId: enums.SampleReviewComment = enums.SampleReviewComment.None;

    private _sampleReviewCommentCreatedBy: number = 0;

    private _supervisorremarkrequestreturn: SupervisorRemarkValidationReturn;

    private _isCursorInsideScript: boolean = false;

    private _userZoomValue: number = 0;

    private _currentCustomZoomDifference: number = 0;

    private _isResponsePromotedToReuseBucket: boolean;

    //Holds book mark previous scroll data
    private _bookmarkPreviousScrollData: BookmarkPreviousScrollData = undefined;

    //Holds Whole response
    private _isWholeResponse: boolean;

    private _isFracsSetByAcetate: boolean = false;
    private _isBookletView: boolean = false;

    private _isEBookMarking: boolean = false;

    public isWholeResponseAllocation: boolean = false;
    // Response Opened event name.
    public static RESPONSE_OPENED = 'ResponseOpened';
    // Response changed.
    public static RESPONSE_CHANGED = 'ResponseChanged';
    // Response Allocated event name.
    public static RESPONSE_ALLOCATED_EVENT = 'ResponseAllocated';
    // Atypical response search event name.
    public static ATYPICAL_SEARCH_RESULT_EVENT = 'AtypicalSearchResultEvent';
    // Reset atypical search fields.
    public static RESET_ATYPICAL_SEARCH_FIELD = 'ResetAtypicalSearchField';
    // Response view mode changed event.
    public static RESPONSE_VIEW_MODE_CHANGED_EVENT = 'ResponseViewModeChanged';

    public static MOUSE_POSITION_UPDATED_EVENT = 'MousePositionUpdated';
    // Full response view option changed event
    public static FULL_RESPONSE_VIEW_OPTION_CHANGED_EVENT = 'FullResponseViewOptionChanged';

    public static MOST_VISIBLE_PAGE_UPDATED_EVENT = 'MostVisiblePageUpdated';
    // Update page Number Indicator while zoom settings are changed
    public static REFRESH_PAGE_NO_INDICATOR_EVENT = 'RefreshPageNumberIndicatorEvent';
    //Response fracs for rotation
    public static SETFRACS_ZOOM = 'SetFracsZoom';

    //Response fracs for Response Image Loaded
    public static SET_FRACS_DATA_IMAGE_LOADED_EVENT = 'SetFracsImageLoadedEvent';

    //fracs for Structured Image Loaded
    public static STRUCTURED_FRACS_DATA_SET_EVENT = 'StructuredFracsDataSetEvent';

    // Update the response zoom
    public static RESPONSE_ZOOM_UPDATE_EVENT = 'ResponseZoomUpdateEvent';

    /* Response zoom has been updated */
    public static RESPONSE_ZOOM_UPDATED_EVENT = 'ResponseZoomUpdatedEvent';

    public static QUALITY_FEEDBACK_ACCEPTED_EVENT = 'QualityFeedbackAcceptedEvent';

    public static RESPONSE_IMAGE_HAS_ROTATED_EVENT = 'ResponseImageHasRotatedEvent';

    public static PINCH_ZOOM = 'PinchZoom';

    public static IMAGE_ZONES_AGAINST_PAGE_NO_SAVED = 'ImageZonesAgainstPageNoSaved';

    public static REFRESH_IMAGE_ROTATE_SETTINGS_EVENT = 'RefreshImageRotateSettings';

    public static FRACS_DATA_LOADED = 'FracsDataLoaded';

    public static STRUCTURED_FRACS_DATA_LOADED = 'StructuredFracsDataLoaded';

    public static FOUND_VISIBLE_IMAGE = 'foundvisibleimage';

    public static RESPONSE_ID_RENDERED_EVENT = 'ResponseIdRenderedEvent';

    public static SUPERVISOR_REMARK_SUCCESS = 'SupervisorRemarkCreatesSuccessfully';

    public static UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT = 'unmanaged SLAO flag as seen stamp event';

    // Promote response to seed event
    public static PROMOTE_TO_SEED_EVENT = 'PromoteToSeedEvent';

    public static REJECT_RIG_CONFIRMED_EVENT = 'rejectrigconfirmed';

    public static REJECT_RIG_POPUP_DISPLAY_EVENT = 'rejectrigpopupdisplay';

    public static REJECT_RIG_COMPLETED_EVENT = 'rejectrigcompletedevent';

    // Promote response to seed event
    public static PROMOTE_TO_SEED_VALIDATION_EVENT = 'PromoteToSeedCheckRemarkEvent';

    // Promote response to seed event
    public static PROMOTE_TO_SEED_FAILURE_EVENT = 'PromoteToSeedCheckFailureEvent';

    // Validation Failed event
    public static VALIDATION_FAILED = 'ValidationFailed';

    // Validation Failed event
    public static VALIDATION_SUCCESS = 'ValidationSuccess';

    // Supervisor remark  button visibility action event
    public static SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT = 'supervisorremarkbuttonvisibilityevent';

    // promote to reuse bucket completed action event
    public static PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT = 'promotetoreusebuckecompletedtevent';

    public static UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS = 'updateviewwholepagelinkvisibilitystatus';

    // offpage comment panel height update event
    public static UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT = 'updateoffpagecommentheightevent';

    public static SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT = 'setbookmarkpreviousscrolldataevent';

    public static FRACS_DATA_SET_FOR_ACETATES_EVENT = 'fracsdatasetforacetatesevent';

    public static FRV_SCROLL_EVENT = 'frvscrollevent';

    public static FRV_TOGGLE_BUTTON_EVENT = 'frvtogglebuttonevent';

    public static SCROLL_POSITION_CHANGED_EVENT = 'scrollpositionchangedevent';

	public static RIG_NOT_FOUND_EVENT = 'rignotfoundevent';

    /* Response Data Received Event*/
    public static RESPONSE_SEARCH_DATA_RECEIVED_EVENT = 'ResponseSearchDataReceivedEvent';

    private _isSearchResponse: boolean = false;

    /**
     * Constructor for Responsestore
     */
    constructor() {
        super();
        this._displayAnglesOfCurrentResponse = Immutable.Map<string, number>();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.OPEN_RESPONSE:
                    let openAction: responseOpenAction = action as responseOpenAction;
                    this._previousMarkGroupId = this._selectedMarkGroupId;
                    /** Emitting after clicking on response item */
                    this._selectedDisplayId = openAction.selectedDisplayId;
                    this._sampleReviewCommentId = openAction.sampleReviewCommentId;
                    this._sampleReviewCommentCreatedBy = openAction.sampleReviewCommentCreatedBy;
                    this._selectedResponseMode = openAction.selectedResponseMode;
                    this._selectedMarkGroupId = openAction.selectedMarkGroupId;
                    this._selectedResponseViewMode = openAction.responseViewMode;
                    this._isWholeResponse = openAction.isWholeResponse;
                    if (openAction.responseNavigation === enums.ResponseNavigation.specific) {
                        this.emit(ResponseStore.RESPONSE_OPENED);
                    } else {
                        this.emit(ResponseStore.RESPONSE_CHANGED);
                        if (this.previousMarkGroupId && this.previousMarkGroupId > 0) {
                            marksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue();
                        }
                    }
                    this._nextResponseIdAfterSubmit = undefined;
                    //reset display angles when new response is opened
                    this._displayAnglesOfCurrentResponse = Immutable.Map<string, number>();
                    this._imageZonesAgainstPageNumber = undefined;
                    this._linkedAnnotationAgainstPageNumber = undefined;
                    break;
                case actionType.RESPONSE_ALLOCATED:
                    let allocationAction: responseAllocateAction = action as responseAllocateAction;
                    this.isWholeResponseAllocation = allocationAction.isWholeResponseAllocation;
                    /** Emitting after clicking on allocate response button */
                    this.emit(ResponseStore.RESPONSE_ALLOCATED_EVENT,
                        allocationAction.allocatedResponseData.responseAllocationErrorCode,
                        allocationAction.allocatedResponseData.allocatedResponseItems.length,
                        allocationAction.allocatedResponseData.success,
                        allocationAction.allocatedResponseData.examinerApprovalStatus
                    );
                    break;
                case actionType.RESPONSE_VIEW_MODE_CHANGED:
                    let responseViewModeChangedAction: responseViewModeChangedAction = action as responseViewModeChangedAction;
                    this._selectedResponseViewMode = responseViewModeChangedAction.responseViewMode;
                    if (responseViewModeChangedAction.responseViewMode === enums.ResponseViewMode.fullResponseView) {
                        this._imageZonesAgainstPageNumber = undefined;
                        this._linkedAnnotationAgainstPageNumber = undefined;
                        if (responseViewModeChangedAction.doResetFracs) {
                            this._fracsData = new Array<FracsData>();
                            if (!responseViewModeChangedAction.isImageFile) {
                                this.setFracsDataForNonConvertibleFile(responseViewModeChangedAction.pageNo);
                            }
                            this.emit(ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, responseViewModeChangedAction.isImageFile);
                        }
                    }
                    break;
                case actionType.SCROLL_POSITION_CHANGED:
                    // set the current scroll position.
                    let scrollChangedAction = (action as scrollPositionChangedAction);
                    if (scrollChangedAction.updateScrollPosition) {
                        this._scrollPosition = scrollChangedAction.currentScrollPosition;
                    }
                    if (scrollChangedAction.doEmit) {
                        this.emit(ResponseStore.SCROLL_POSITION_CHANGED_EVENT);
                    }
                    break;
                case actionType.SCROLL_DATA_RESET:
                    // this will reset the response scroll data.
                    this.resetResponseScrollData();
                    break;
                case actionType.FRACS_DATA_SET:
                    // This will set the current fracs data.
                    this.setFracsData((action as fracsDataSetAction).fracsData);
                    let fracsAction: fracsDataSetAction = action as fracsDataSetAction;
                    if (fracsAction.triggerScrollEvent) {
                        this.emit(ResponseStore.FRACS_DATA_LOADED);
                    }
                    if (fracsAction.structuredFracsDataLoaded) {
                        this.emit(ResponseStore.STRUCTURED_FRACS_DATA_LOADED, fracsAction.fracsDataSource);
                    }
                    break;
                case actionType.FIND_VISIBLE_IMAGE_ID:
                    this.findVisibleImage();

                    // emiting event for setting scroll position for non-convertible file
                    // while switching to FRV
                    if ((action as findVisibleImageIdAction).doEmit) {
                        if ((action as findVisibleImageIdAction).fracsDataSource === enums.FracsDataSetActionSource.Acetate) {
                            this.emit(ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT);
                        } else {
                            this.emit(ResponseStore.FOUND_VISIBLE_IMAGE);
                        }
                    }
                    break;
                case actionType.MOUSE_POSITION_UPDATE:
                    let updateMousePositionAction: updateMousePositionAction = action as updateMousePositionAction;
                    this._mousePosition = updateMousePositionAction.mousePosition;
                    this.emit(ResponseStore.MOUSE_POSITION_UPDATED_EVENT);
                    break;
                case actionType.RESPONSE_CLOSE:
                    let isResponseClose: boolean = (action as responseCloseAction).getIsResponseClose;
                    // resetting the selected markgroupId.
                    if (isResponseClose) {
                        this.resetSelectedResponseDetails();
                        this._selectedDisplayId = 0;
                        //reset display angles
                        this._displayAnglesOfCurrentResponse = Immutable.Map<string, number>();
                    }
                    this._nextResponseIdAfterSubmit = undefined;

                    break;
                case actionType.FULL_RESPONSE_VIEW_OPTION_CHANGED:
                    let fullResponseViewOption: enums.FullResponeViewOption =
                        (action as fullResponseViewOptionChangedAction).fullResponseViewOption;
                    this.emit(ResponseStore.FULL_RESPONSE_VIEW_OPTION_CHANGED_EVENT, fullResponseViewOption);
                    break;
                case actionType.SET_FRACS_DATA_FOR_ZOOM:
                    this._fracsData = new Array<FracsData>();
                    this.emit(ResponseStore.SETFRACS_ZOOM, (action as setFracsDataForZoomAction).zoomType);
                    break;
                case actionType.SET_FRACS_DATA_IMAGE_LOADED_ACTION:
                    this._fracsData = new Array<FracsData>();
                    this.emit(ResponseStore.SET_FRACS_DATA_IMAGE_LOADED_EVENT);
                    break;
                case actionType.STRUCTURED_FRACS_DATA_SET:
                    this._fracsData = new Array<FracsData>();
                    this.emit(ResponseStore.STRUCTURED_FRACS_DATA_SET_EVENT, (action as structuredFracsDataSetAction).fracsDataSource);
                    break;
                case actionType.UPDATE_PAGE_NO_INDICATOR:
                    let updatePageNumberIndicator: updatePageNumberIndicatorAction = action as updatePageNumberIndicatorAction;
                    this._pageNoIndicatorData = updatePageNumberIndicator.pageNoIndicatorData;
                    this._isBookletView = updatePageNumberIndicator.isBookletView;
                    this.emit(ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT);
                    break;
                case actionType.REFRESH_PAGE_NO_INDICATOR:
                    let pageNumberIndicator: updatePageNumberIndicatorOnZoomAction = action as updatePageNumberIndicatorOnZoomAction;
                    this.emit(ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT);
                    break;
                case actionType.CUSTOM_ZOOM_ACTION:
                    let customZoomAction = action as customZoomAction;
                    this._userZoomValue = customZoomAction.userZoomValue;
                    this._currentCustomZoomDifference = this._userZoomValue - this._currentZoom;
                    this.emit(ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT,
                        customZoomAction.zoomType,
                        customZoomAction.responseViewSettings);
                    break;
                case actionType.ZOOM_UPDATED_ACTION:
                    this._currentZoom = (action as zoomUpdatedAction).zoomPercentage;
                    this.emit(ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, this._currentZoom);
                    break;
                case actionType.RESPONSE_IMAGE_ROTATED_ACTION:
                    let hasRotatedImages = (action as responseImageRotated).hasResponseImageRotated;
                    let rotatedImages = (action as responseImageRotated).getRotatedImages;
                    this.emit(ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT, hasRotatedImages, rotatedImages);
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    // Resetting the selected response mode to Open on Accepting the Quality Feedback
                    this._selectedResponseMode = enums.ResponseMode.open;
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    let submitResponseCompletedAction: submitResponseCompletedAction = action as submitResponseCompletedAction;
                    if (!submitResponseCompletedAction.isStdSetupMode) {
                        if (submitResponseCompletedAction.getSubmitResponseReturnDetails.responseSubmitErrorCode
                            === constants.QIG_SESSION_CLOSED) {
                            return;
                        }
                        if (submitResponseCompletedAction.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding) {
                            this._selectedResponseMode = enums.ResponseMode.closed;
                        } else if (submitResponseCompletedAction.isFromMarkScheme) {
                            this._nextResponseIdAfterSubmit =
                                parseInt(worklistStore.instance.nextResponseId(this.selectedDisplayId.toString()));
                        }
                        this.resetSelectedResponseDetails();
                    }
                    break;
                case actionType.UPDATE_DISPLAY_ANGLE_OF_RESPONSE:
                    let responseDisplaySet = (action as updateDisplayAngleOfresponse);
                    if (!responseDisplaySet.canReset) {
                        this._displayAnglesOfCurrentResponse = this._displayAnglesOfCurrentResponse.
                            set(responseDisplaySet.responseId, responseDisplaySet.displayAngle);

                    } else if (this._markingMethod !== enums.MarkingMethod.Unstructured || this._isEBookMarking === true) {
                        this._displayAnglesOfCurrentResponse = Immutable.Map<string, number>();
                    }
                    break;
                case actionType.GET_EBOOKMARK_IMAGE_ZONE:
                    let eBookMarkImageZone = (action as eBookmarkImageZoneRetrievalAction).getCandidateScriptEBookMarkImageZoneCollection;
                    this._isEBookMarking = true;
                    break;
                case actionType.IMAGEZONE_LOAD:
                    let actionResult = (action as imageZoneAction);
                    this._markingMethod = actionResult.imageZoneList === null ?
                        (actionResult.originalMarkingMethod === enums.MarkingMethod.MarkFromObject ?
                        enums.MarkingMethod.MarkFromObject : enums.MarkingMethod.Unstructured)
                        : enums.MarkingMethod.Structured;
                    this._isEBookMarking = false;
                    break;
                case actionType.MARK:
                    this.resetSelectedResponseDetails();
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    let responseDataGetAction = action as responseDataGetAction;
                    this._searchedResponseData = responseDataGetAction.searchedResponseData;
                    if (this._searchedResponseData) {
                        this._selectedDisplayId = parseInt(this._searchedResponseData.displayId);
                        this._selectedResponseMode = this._searchedResponseData.responseMode;
                    }
                    this._isSearchResponse = false;
                    /*
                       If search response coming from menu then set search response mode and emit response search data received event.
                       search response mode will be reset only after opening the response.
                    */
                    if (responseDataGetAction.isSearchFromMenu) {
                        if (this._searchedResponseData &&
                            this._searchedResponseData.triggerPoint === enums.TriggerPoint.DisplayIdSearch) {
                            this._isSearchResponse = true;
                        }
                        this.emit(ResponseStore.RESPONSE_SEARCH_DATA_RECEIVED_EVENT,
                            responseDataGetAction.searchedResponseData);
                    }
                    break;
                case actionType.ZOOM_OPTION_CLICKED_ACTION:
                    this._isZoomOptionOpen = (action as zoomOptionClickedAction).isZoomOptionOpen;
                    break;
                case actionType.PINCH_ZOOM:
                    this._isPinchZooming = (action as pinchZoomAction).isPinchZooming;
                    break;
                case actionType.SET_IMAGE_ZONES_FOR_PAGE_NO:
                    this._imageZonesAgainstPageNumber = (action as setImageZonesForPageNoAction).imageZones;
                    this._linkedAnnotationAgainstPageNumber = (action as setImageZonesForPageNoAction).linkedAnnotaion;
                    this.emit(ResponseStore.IMAGE_ZONES_AGAINST_PAGE_NO_SAVED);
                    break;
                case actionType.REFRESH_IMAGE_ROTATION_SETTINGS:
                    // Refresh the rotated class on each image.
                    this.emit(ResponseStore.REFRESH_IMAGE_ROTATE_SETTINGS_EVENT);
                    break;
                case actionType.MARK_THIS_PAGE_NUMBER:
                    this._markThisPageNumber = (action as markThisPageNumberAction).markThisPageNumber;
                    break;
                case actionType.MARK_BY_OPTION_CLICKED_ACTION:
                    this._isMarkByOptionOpen = (action as markByOptionClickedAction).isMarkByOptionOpen;
                    break;
                case actionType.RESPONSE_ID_RENDERED_ACTION:
                    this.emit(ResponseStore.RESPONSE_ID_RENDERED_EVENT);
                    break;

                case actionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    let markGroupIds: Immutable.List<number> = (action as createRemarkAction).getMarkGroupIds();
                    let isMarkNowButtonClicked: boolean = (action as createRemarkAction).isMarkNowButtonClicked();
                    this.emit(ResponseStore.SUPERVISOR_REMARK_SUCCESS, markGroupIds, isMarkNowButtonClicked);
                    break;
                case actionType.ATYPICAL_RESPONSE_SEARCH:
                    this._atypicalSearchResult = (action as atypicalResponseSearchAction).atypicalSearchResultData;
                    this.emit(ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, this._atypicalSearchResult);
                    break;
                case actionType.ATYPICAL_SEARCH_MARK_NOW_ACTION:
                    let atypicalSearchMarkNow: atypicalSearchMarkNowAction = action as atypicalSearchMarkNowAction;
                    this._openAtypicalResponse = true;
                    this.responseData = atypicalSearchMarkNow.allocatedResponseData;
                    this.emit(ResponseStore.RESPONSE_ALLOCATED_EVENT,
                        atypicalSearchMarkNow.allocatedResponseData.responseAllocationErrorCode,
                        atypicalSearchMarkNow.allocatedResponseData.allocatedResponseItems.length,
                        atypicalSearchMarkNow.allocatedResponseData.success,
                        atypicalSearchMarkNow.allocatedResponseData.examinerApprovalStatus, true,
                        atypicalSearchMarkNow.allocatedResponseData);
                    this.emit(ResponseStore.RESET_ATYPICAL_SEARCH_FIELD);
                    break;
                case actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION:
                    let atypicalSearchMoveToWorklist: atypicalSearchMoveToWorklistAction = action as atypicalSearchMoveToWorklistAction;
                    this.emit(ResponseStore.RESPONSE_ALLOCATED_EVENT,
                        atypicalSearchMoveToWorklist.allocatedResponseData.responseAllocationErrorCode,
                        atypicalSearchMoveToWorklist.allocatedResponseData.allocatedResponseItems.length,
                        atypicalSearchMoveToWorklist.allocatedResponseData.success,
                        atypicalSearchMoveToWorklist.allocatedResponseData.examinerApprovalStatus);
                    this.emit(ResponseStore.RESET_ATYPICAL_SEARCH_FIELD);
                    break;


                case actionType.SET_RESPONSE_AS_REVIEWED_ACTION:
                    let reviewedResponseDetails = action as setResponseAsReviewedAction;
                    if (reviewedResponseDetails.ReviewedResponseDetails.reviewResponseResult === enums.SetAsReviewResult.Success) {
                        this.resetSelectedResponseDetails();
                    }
                    break;
                case actionType.SUPERVISOR_REMARK_CHECK_ACTION:
                    let supervisorRemarkCheckAction = action as supervisorRemarkCheckAction;
                    this._supervisorremarkrequestreturn = supervisorRemarkCheckAction.SupervisorRemarkValidationReturn;
                    this.emit(ResponseStore.VALIDATION_SUCCESS);
                    break;
                case actionType.UNMANAGED_SLAO_FLAG_AS_SEEN_ACTION:
                    let unManagedSLAOFlagAsSeenAction = action as unManagedSlaoFlagAsSeenAction;

                    this.emit(ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT,
                        unManagedSLAOFlagAsSeenAction.selectedPage);
                    break;
                case actionType.PROMOTE_TO_SEED:
                    let promoteToSeedAction = action as promoteToSeedAction;
                    this.emit(ResponseStore.PROMOTE_TO_SEED_EVENT, promoteToSeedAction.promoteToSeedReturn.promoteToSeedError);
                    break;
                case actionType.REJECT_RIG_CONFIRMATION_ACTION:
                    let rejectRigConfirmationAction = action as rejectRigConfirmedAction;
                    this.emit(ResponseStore.REJECT_RIG_CONFIRMED_EVENT, rejectRigConfirmationAction.DisplayId);
                    break;
                case actionType.REJECT_RIG_POPUP_DISPLAY_ACTION:
                    let displayAction = action as rejectRigPopupDisplayAction;
                    this.emit(ResponseStore.REJECT_RIG_POPUP_DISPLAY_EVENT);
                    break;
                case actionType.REJECT_RIG_COMPLETED_ACTION:
                    let rejectRigCompletedAction = action as rejectRigCompletedAction;
                    this.emit(ResponseStore.REJECT_RIG_COMPLETED_EVENT, rejectRigCompletedAction.isNextResponseAvailable);
                    break;
                case actionType.PROMOTE_TO_SEED_VALIDATION:
                    let promoteToSeedCheckRemarkAction = action as promoteToSeedCheckRemarkAction;
                    this._promoteseedremarkrequestreturn = promoteToSeedCheckRemarkAction.promoteToSeedReturn;
                    let success: boolean = promoteToSeedCheckRemarkAction.promoteToSeedReturn.success;
                    this._promoteToSeedFailureCode = promoteToSeedCheckRemarkAction.promoteToSeedReturn.failureCode;
                    if (success) {
                        this.emit(ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT);
                    }
                    break;
                case actionType.SUPERVISOR_REMARK_VISIBILITY_ACTION:
                    let remarkButtonVisibilityAction = action as supervisorRemarkVisibilityAction;
                    this.emit(ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT,
                        remarkButtonVisibilityAction.isVisible);
                    break;
                case actionType.SAMPLING_STATUS_CHANGE_ACTION:
                    let supervisorSamplingCommentReturn = (action as samplingStatusChangeAction).supervisorSamplingCommentReturn;
                    this._sampleReviewCommentId = supervisorSamplingCommentReturn.updatedSamplingCommentId;
                    break;
                case actionType.VIEW_WHOLE_PAGE_LINK:
                    this._isCursorInsideScript = (action as vieWholePageLinkAction).isCursorInsideScript;
                    let activeImageZone = (action as vieWholePageLinkAction).activeImageZone;
                    this.emit(ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS, this._isCursorInsideScript, activeImageZone);
                    break;
                case actionType.PROMOTE_TO_REUSE_BUCKET_ACTION:
                    let promoteToReuseBucketAction = action as promoteToReusBucketAction;
                    this._isResponsePromotedToReuseBucket = promoteToReuseBucketAction.isResponsePromotedToReuseBucket;
                    this.emit(ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT);
                    break;
                case actionType.UPDATE_OFF_PAGE_COMMENT_HEIGHT:
                    let offpagePanelHeightAction = (action as updateOffPageCommentHeightAction);
                    let panelHeight = offpagePanelHeightAction.panelHeight;
                    let panActionType = offpagePanelHeightAction.panActionType;
                    this.emit(ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, panelHeight, panActionType);
                    break;
                case actionType.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_ACTION:
                    let bookmarkPreviousScrollDataAction = (action as setBookmarkPreviousScrollDataAction);
                    this._bookmarkPreviousScrollData = bookmarkPreviousScrollDataAction.getBookmarkPreviousScrollData;
                    this.emit(ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT);
                    break;

                case actionType.FRV_SCROLL_ACTION:
                    this.emit(ResponseStore.FRV_SCROLL_EVENT);
                    break;

                case actionType.FRV_TOGGLE_BUTTON_ACTION:
                    // notify that an FRV toggle change occured.
                    this.emit(ResponseStore.FRV_TOGGLE_BUTTON_EVENT);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN:
                    this._selectedResponseMode = enums.ResponseMode.closed;
                    break;

				case actionType.RIG_NOT_FOUND_ACTION:
					let showOrHidePopup = (action as rigNotFoundAction);
					this.emit(ResponseStore.RIG_NOT_FOUND_EVENT, showOrHidePopup.showRigNotFoundPopup);
					break;
                case actionType.STANDARDISATION_SETUP_WORKLIST_SELECT_ACTION:
                let standardisationLeftPanelWorkListSelectAction = (action as standardisationSetupSelectWorkListAction);
                // On left side provisional worklist link click we have to reset search response data defect: 73597
                if (standardisationLeftPanelWorkListSelectAction.selectedWorkList === enums.StandardisationSetup.ProvisionalResponse) {
                    this._searchedResponseData = undefined;
                }
                break;
                case actionType.RESET_SEARCH_RESPONSE_ACTION:
                    // Reset the response search mode after opening the response.
                    this._isSearchResponse = false;
                    break;
            }
        });
    }

    public get isCursorInsideScript(): boolean {
        return this._isCursorInsideScript;
    }

    /* returns true if pinch zoom is started and false when pinch zoom ends*/
    public get isPinchZooming(): boolean {
        return this._isPinchZooming;
    }

    /**
     * returns the mark this page number
     */
    public get markThisPageNumber(): number {
        return this._markThisPageNumber;
    }

    /**
     * Gets is zoom option is open or closed
     */
    public get isZoomOptionOpen(): boolean {
        return this._isZoomOptionOpen;
    }

    /**
     * Gets is mark by option is open or closed
     */
    public get isMarkByOptionOpen() {
        return this._isMarkByOptionOpen;
    }

    /**
     * Get the Searched Response Data.
     */
    public get searchedResponseData() {
        return this._searchedResponseData;
    }

    /**
     * This method will return collection of display angles for the current response
     */

    public get displayAnglesOfCurrentResponse(): Immutable.Map<string, number> {
        return this._displayAnglesOfCurrentResponse;
    }

    /**
     * This method will returns the selected display ID
     */
    public get selectedDisplayId(): number {
        return this._selectedDisplayId;
    }

    /**
     * This method will returns sample Review CommentId
     */
    public get sampleReviewCommentId(): enums.SampleReviewComment {
        return this._sampleReviewCommentId;
    }

    /**
     * This method will returns sample Review Comment CreatedBy
     */
    public get sampleReviewCommentCreatedBy(): number {
        return this._sampleReviewCommentCreatedBy;
    }

    /**
     * returns the previous markGroupId
     */
    public get previousMarkGroupId(): number {
        return this._previousMarkGroupId;
    }

    /**
     * set current annotation element
     */
    public resetOpenAtypicalFlag = () => {
        this._openAtypicalResponse = false;
    };

    /**
     * This will returns the selected markGroupId
     */
    public get selectedMarkGroupId(): number {
        return this._selectedMarkGroupId;
    }

    /**
     * This method will returns the selected response mode.
     */
    public get selectedResponseMode(): enums.ResponseMode {
        return this._selectedResponseMode;
    }

    /**
     * This will reset the selected response details
     */
    public resetSelectedResponseDetails(): void {
        this._selectedMarkGroupId = undefined;
        this._previousMarkGroupId = undefined;
        this._mousePosition = undefined;
        this._pageNoIndicatorData = undefined;
        this._selectedResponseViewMode = enums.ResponseViewMode.zoneView;
        this.resetResponseScrollData();
        this._selectedResponseMode = undefined;
    }

    /**
     * This will returns the selected response view mode.
     */
    public get selectedResponseViewMode(): enums.ResponseViewMode {
        return this._selectedResponseViewMode;
    }

    /**
     *   get the scroll position for setting in zone view.
     */
    public get currentScrollPosition(): number {
        return this._scrollPosition;
    }

    /**
     * This method will push the fracs data for finding active image container.
     * @param data - fracs data of each single and stiched image viewer container.
     */
    private setFracsData(data: FracsData) {
        if (data != null) {
            this._fracsData.push(data);
        } else {
            this._fracsData = [];
        }
    }

    /**
     * This will return the ref name of  active image container.
     */
    public get currentlyVisibleImageContainerRefId(): string {
        return this._currentlyVisibleImageContainerRefId;
    }

    /**
     * This method will return the fracsData
     */
    public get getCurrentVisibleFracsData() {

        if (this._fracsData.length >= 1) {
            this._fracsData.sort((a: FracsData, b: FracsData) => { return b.visible - a.visible; });

            this._fracsData = this._fracsData.filter(function (data: any) {
                return (data.elementId !== null);
            });
        }
        return this._fracsData[0];
    }

    /**
     * This will return the offset of selected image container.
     */
    public selectedImageOffsetTop(elementId: string): number {
        let fracsItem: FracsData[];
        if (this._fracsData.length >= 1) {
            fracsItem = this._fracsData.filter((x: FracsData) => x.elementId === elementId);
            if (fracsItem && fracsItem.length > 0) {
                this._selectedImageOffsetTop = fracsItem[0].offsettop;
            }
        }

        return this._selectedImageOffsetTop;
    }

    /**
     * This will return the offset of active image container.
     */
    public get currentlyVisibleImageOffsetTop(): number {
        return this._currentlyVisibleImageOffsetTop;
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

    /**
     * This method will reset the scroll related data.
     */
    private resetResponseScrollData() {
        this._scrollPosition = 0;
        this._currentlyVisibleImageContainerRefId = 'img_1';
        this._selectedImageOffsetTop = 0;
    }

    /**
     * This method will find the active image container for setting scroll position in
     * full response view.
     */
    private findVisibleImage() {
        if (this._fracsData.length >= 1) {
            this._fracsData.sort((a: FracsData, b: FracsData) => { return b.visible - a.visible; });

            this._fracsData = this._fracsData.filter(function (data: any) {
                return (data.elementId !== null);
            });

            // The corresponding ref contains the outputpage number as well.
            this._currentlyVisibleImageContainerRefId = this._fracsData[0].elementId + '_' +
                ((this._fracsData[0].outputPage) ? this._fracsData[0].outputPage : 0);
        }
    }

    /**
     * This method will find the active image container for setting scroll position in
     * full response view.
     */
    private setFracsDataForNonConvertibleFile(pageNo: number) {
        let data: FracsData = {
            'elementId': 'img_' + pageNo,
            'possible': 0,
            'viewport': 0,
            'visible': 0,
            'offsettop': 0,
            outputPage: 0
        };
        this.setFracsData(data);
    }

    /**
     * Method to return the page indicator data.
     */
    public get pageNoIndicatorData(): pageNoIndicatorData {
        if (this._pageNoIndicatorData) {
            return this._pageNoIndicatorData;
        } else {
            return new pageNoIndicatorData([0], [0]);
        }
    }

    /**
     * This method will returns the current zomm precentage of the response
     */
    public get currentZoomPercentage(): number {
        return this._currentZoom;
    }

    /**
     * This method will returns the next ResponseId AfterSubmit
     */
    public get nextResponseIdAfterSubmit(): number {
        return this._nextResponseIdAfterSubmit;
    }

    /**
     * This method will return the marking method of the response
     */
    public get markingMethod(): enums.MarkingMethod {
        return this._markingMethod;
    }

    /**
     * This method returns the imageZones available against a page number
     * For mark this page functionality
     */
    public get imageZonesAgainstPageNumber(): Immutable.List<ImageZone> {
        return this._imageZonesAgainstPageNumber;
    }

    /**
     * This method returns the linked annotation against the page Number
     * For mark this page functionality_linkedAnnotationAgainstPageNumber
     */
    public get linkedAnnotationAgainstPageNumber(): annotation[] {
        return this._linkedAnnotationAgainstPageNumber;
    }

    /**
     * Calculate the rotation angle
     * @param {number} degree
     * @returns
     */
    private getRotationAngle(degree: number): number {

        let result: number = 0;

        if (degree < 0) {
            degree = enums.RotateAngle.Rotate_360 + degree;
            result = Math.abs(degree);
        }

        result = degree % enums.RotateAngle.Rotate_360;
        return result;
    }

    /**
     * Gets a value indicating response has rotated images
     * @returns
     */
    public get hasRotatedImages(): boolean {
        let result: boolean = false;

        this._displayAnglesOfCurrentResponse.map((value: number, key: string) => {

            if (this.getRotationAngle(value) !== 0) {
                result = true;
            }
        });

        return result;
    }

    public get hasRotatedImagesWithOddAngle(): boolean {
        let result: boolean = false;

        this._displayAnglesOfCurrentResponse.map((value: number, key: string) => {
            if (this.IsOddangle(this.getRotationAngle(value))) {
                result = true;
            }
        });

        return result;
    }

    /**
     * Get the actual angle while rotation.
     * @param rotatedAngle
     */
    private getAngleforRotation = (rotatedAngle: number) => {
        if (typeof rotatedAngle === 'undefined') {
            rotatedAngle = 0;
        }
        if (rotatedAngle < 0) {
            rotatedAngle = rotatedAngle % enums.RotateAngle.Rotate_360;
            rotatedAngle = enums.RotateAngle.Rotate_360 + rotatedAngle;
            rotatedAngle = Math.abs(rotatedAngle);
        }
        return rotatedAngle % enums.RotateAngle.Rotate_360;
    };

    /**
     * To check whether the angle is odd or not.
     * @param {number} rotatedAngle
     * @returns
     */
    private IsOddangle(rotatedAngle: number): boolean {
        return !!((this.getAngleforRotation(rotatedAngle) / enums.RotateAngle.Rotate_90) % 2);
    }

    /**
     * This method will return collection of remark request and display id
     */

    public get promoteseedremarkrequestreturn(): promoteToSeedReturn {
        return this._promoteseedremarkrequestreturn;
    }

    /**
     * This method will return collection of remark request and display id
     */

    public get supervisorremarkrequestreturn(): SupervisorRemarkValidationReturn {
        return this._supervisorremarkrequestreturn;
    }

    /**
     * return the user input for response zoom
     */
    public get userZoomValue(): number {
        return this._userZoomValue;
    }


    /**
     * This method will whether the response promoted to reuse bucket or not.
     */

    public get isResponsePromotedToReuseBucket(): boolean {
        return this._isResponsePromotedToReuseBucket;
    }

    /*
     * returns bookmark previous scroll data
     */
    public get getBookmarkPreviousScrollData(): BookmarkPreviousScrollData {
        return this._bookmarkPreviousScrollData;
    }

    /*
     * returns current custom zoom difference
     */
    public get currentCustomZoomDifference(): number {
        return this._currentCustomZoomDifference;
    }

    /*
     * returns if the selected response is Whole Response
     */
    public get isWholeResponse(): boolean {
        // TODO : Remove RelatedWholeResponseQIGId count check for atypical worklist
        return this._isWholeResponse && markingStore.instance.getRelatedWholeResponseQIGIds().length > 1;
    }

    /*
     * returns if the current view is booklet or not.
     */
    public get isBookletView(): boolean {
        return this._isBookletView;
    }

    /*
     * returns if the current view is booklet or not.
     */
    public get isSearchResponse(): boolean {
        return this._isSearchResponse;
    }
}

let instance = new ResponseStore();
export = { ResponseStore, instance };