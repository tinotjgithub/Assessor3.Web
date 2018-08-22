"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var enums = require('../../components/utility/enums');
var mousePosition = require('./mouseposition');
var marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
var pageNoIndicatorData = require('./pagenoindicatordata');
var worklistStore = require('../worklist/workliststore');
var markingStore = require('../marking/markingstore');
var Immutable = require('immutable');
var constants = require('../../components/utility/constants');
/**
 *  Class for Response store
 */
var ResponseStore = (function (_super) {
    __extends(ResponseStore, _super);
    /**
     * Constructor for Responsestore
     */
    function ResponseStore() {
        var _this = this;
        _super.call(this);
        this._scrollPosition = 0;
        this._currentlyVisibleImageOffsetTop = 0;
        this._selectedResponseViewMode = enums.ResponseViewMode.zoneView;
        this._openAtypicalResponse = false;
        // offsetTop of the selected image for mark this page functionality.
        this._selectedImageOffsetTop = 0;
        // This will hold the element ref name of currently visible image
        this._currentlyVisibleImageContainerRefId = 'img_1';
        // This will hold the fracs data
        this._fracsData = [];
        this._isZoomOptionOpen = false;
        this._isMarkByOptionOpen = false;
        this._isPinchZooming = false;
        this._markThisPageNumber = 0;
        this._supervisorRemarkResponseCreated = false;
        this._promoteToSeedFailureCode = enums.FailureCode.None;
        this._sampleReviewCommentId = enums.SampleReviewComment.None;
        this._sampleReviewCommentCreatedBy = 0;
        this._isCursorInsideScript = false;
        this._userZoomValue = 0;
        this._currentCustomZoomDifference = 0;
        //Holds book mark previous scroll data
        this._bookmarkPreviousScrollData = undefined;
        this._isFracsSetByAcetate = false;
        this._isBookletView = false;
        this._isEBookMarking = false;
        this.isWholeResponseAllocation = false;
        /**
         * set current annotation element
         */
        this.resetOpenAtypicalFlag = function () {
            _this._openAtypicalResponse = false;
        };
        /**
         * Get the actual angle while rotation.
         * @param rotatedAngle
         */
        this.getAngleforRotation = function (rotatedAngle) {
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
        this._displayAnglesOfCurrentResponse = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.OPEN_RESPONSE:
                    var openAction = action;
                    _this._previousMarkGroupId = _this._selectedMarkGroupId;
                    /** Emitting after clicking on response item */
                    _this._selectedDisplayId = openAction.selectedDisplayId;
                    _this._sampleReviewCommentId = openAction.sampleReviewCommentId;
                    _this._sampleReviewCommentCreatedBy = openAction.sampleReviewCommentCreatedBy;
                    _this._selectedResponseMode = openAction.selectedResponseMode;
                    _this._selectedMarkGroupId = openAction.selectedMarkGroupId;
                    _this._selectedResponseViewMode = openAction.responseViewMode;
                    _this._isWholeResponse = openAction.isWholeResponse;
                    if (openAction.responseNavigation === enums.ResponseNavigation.specific) {
                        _this.emit(ResponseStore.RESPONSE_OPENED);
                    }
                    else {
                        _this.emit(ResponseStore.RESPONSE_CHANGED);
                        if (_this.previousMarkGroupId && _this.previousMarkGroupId > 0) {
                            marksAndAnnotationsSaveHelper.updateMarksAndAnnotationsQueue();
                        }
                    }
                    _this._nextResponseIdAfterSubmit = undefined;
                    //reset display angles when new response is opened
                    _this._displayAnglesOfCurrentResponse = Immutable.Map();
                    _this._imageZonesAgainstPageNumber = undefined;
                    _this._linkedAnnotationAgainstPageNumber = undefined;
                    break;
                case actionType.RESPONSE_ALLOCATED:
                    var allocationAction = action;
                    _this.isWholeResponseAllocation = allocationAction.isWholeResponseAllocation;
                    /** Emitting after clicking on allocate response button */
                    _this.emit(ResponseStore.RESPONSE_ALLOCATED_EVENT, allocationAction.allocatedResponseData.responseAllocationErrorCode, allocationAction.allocatedResponseData.allocatedResponseItems.length, allocationAction.allocatedResponseData.success, allocationAction.allocatedResponseData.examinerApprovalStatus);
                    break;
                case actionType.RESPONSE_VIEW_MODE_CHANGED:
                    var responseViewModeChangedAction_1 = action;
                    _this._selectedResponseViewMode = responseViewModeChangedAction_1.responseViewMode;
                    if (responseViewModeChangedAction_1.responseViewMode === enums.ResponseViewMode.fullResponseView) {
                        _this._imageZonesAgainstPageNumber = undefined;
                        _this._linkedAnnotationAgainstPageNumber = undefined;
                        if (responseViewModeChangedAction_1.doResetFracs) {
                            _this._fracsData = new Array();
                            if (!responseViewModeChangedAction_1.isImageFile) {
                                _this.setFracsDataForNonConvertibleFile(responseViewModeChangedAction_1.pageNo);
                            }
                            _this.emit(ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT, responseViewModeChangedAction_1.isImageFile);
                        }
                    }
                    break;
                case actionType.SCROLL_POSITION_CHANGED:
                    // set the current scroll position.
                    var scrollChangedAction = action;
                    if (scrollChangedAction.updateScrollPosition) {
                        _this._scrollPosition = scrollChangedAction.currentScrollPosition;
                    }
                    if (scrollChangedAction.doEmit) {
                        _this.emit(ResponseStore.SCROLL_POSITION_CHANGED_EVENT);
                    }
                    break;
                case actionType.SCROLL_DATA_RESET:
                    // this will reset the response scroll data.
                    _this.resetResponseScrollData();
                    break;
                case actionType.FRACS_DATA_SET:
                    // This will set the current fracs data.
                    _this.setFracsData(action.fracsData);
                    var fracsAction = action;
                    if (fracsAction.triggerScrollEvent) {
                        _this.emit(ResponseStore.FRACS_DATA_LOADED);
                    }
                    if (fracsAction.structuredFracsDataLoaded) {
                        _this.emit(ResponseStore.STRUCTURED_FRACS_DATA_LOADED, fracsAction.fracsDataSource);
                    }
                    break;
                case actionType.FIND_VISIBLE_IMAGE_ID:
                    _this.findVisibleImage();
                    // emiting event for setting scroll position for non-convertible file
                    // while switching to FRV
                    if (action.doEmit) {
                        if (action.fracsDataSource === enums.FracsDataSetActionSource.Acetate) {
                            _this.emit(ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT);
                        }
                        else {
                            _this.emit(ResponseStore.FOUND_VISIBLE_IMAGE);
                        }
                    }
                    break;
                case actionType.MOUSE_POSITION_UPDATE:
                    var updateMousePositionAction_1 = action;
                    _this._mousePosition = updateMousePositionAction_1.mousePosition;
                    _this.emit(ResponseStore.MOUSE_POSITION_UPDATED_EVENT);
                    break;
                case actionType.RESPONSE_CLOSE:
                    var isResponseClose = action.getIsResponseClose;
                    // resetting the selected markgroupId.
                    if (isResponseClose) {
                        _this.resetSelectedResponseDetails();
                        _this._selectedDisplayId = 0;
                        //reset display angles
                        _this._displayAnglesOfCurrentResponse = Immutable.Map();
                    }
                    _this._nextResponseIdAfterSubmit = undefined;
                    break;
                case actionType.FULL_RESPONSE_VIEW_OPTION_CHANGED:
                    var fullResponseViewOption = action.fullResponseViewOption;
                    _this.emit(ResponseStore.FULL_RESPONSE_VIEW_OPTION_CHANGED_EVENT, fullResponseViewOption);
                    break;
                case actionType.SET_FRACS_DATA_FOR_ZOOM:
                    _this._fracsData = new Array();
                    _this.emit(ResponseStore.SETFRACS_ZOOM, action.zoomType);
                    break;
                case actionType.SET_FRACS_DATA_IMAGE_LOADED_ACTION:
                    _this._fracsData = new Array();
                    _this.emit(ResponseStore.SET_FRACS_DATA_IMAGE_LOADED_EVENT);
                    break;
                case actionType.STRUCTURED_FRACS_DATA_SET:
                    _this._fracsData = new Array();
                    _this.emit(ResponseStore.STRUCTURED_FRACS_DATA_SET_EVENT, action.fracsDataSource);
                    break;
                case actionType.UPDATE_PAGE_NO_INDICATOR:
                    var updatePageNumberIndicator = action;
                    _this._pageNoIndicatorData = updatePageNumberIndicator.pageNoIndicatorData;
                    _this._isBookletView = updatePageNumberIndicator.isBookletView;
                    _this.emit(ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT);
                    break;
                case actionType.REFRESH_PAGE_NO_INDICATOR:
                    var pageNumberIndicator = action;
                    _this.emit(ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT);
                    break;
                case actionType.CUSTOM_ZOOM_ACTION:
                    var customZoomAction_1 = action;
                    _this._userZoomValue = customZoomAction_1.userZoomValue;
                    _this._currentCustomZoomDifference = _this._userZoomValue - _this._currentZoom;
                    _this.emit(ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT, customZoomAction_1.zoomType, customZoomAction_1.responseViewSettings);
                    break;
                case actionType.ZOOM_UPDATED_ACTION:
                    _this._currentZoom = action.zoomPercentage;
                    _this.emit(ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT, _this._currentZoom);
                    break;
                case actionType.RESPONSE_IMAGE_ROTATED_ACTION:
                    var hasRotatedImages = action.hasResponseImageRotated;
                    var rotatedImages = action.getRotatedImages;
                    _this.emit(ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT, hasRotatedImages, rotatedImages);
                    break;
                case actionType.ACCEPT_QUALITY_ACTION:
                    // Resetting the selected response mode to Open on Accepting the Quality Feedback
                    _this._selectedResponseMode = enums.ResponseMode.open;
                    break;
                case actionType.SUBMIT_RESPONSE_COMPLETED:
                    var submitResponseCompletedAction_1 = action;
                    if (submitResponseCompletedAction_1.getSubmitResponseReturnDetails.responseSubmitErrorCode
                        === constants.QIG_SESSION_CLOSED) {
                        return;
                    }
                    if (submitResponseCompletedAction_1.getSubmitResponseReturnDetails.hasQualityFeedbackOutstanding) {
                        _this._selectedResponseMode = enums.ResponseMode.closed;
                    }
                    else if (submitResponseCompletedAction_1.isFromMarkScheme) {
                        _this._nextResponseIdAfterSubmit =
                            parseInt(worklistStore.instance.nextResponseId(_this.selectedDisplayId.toString()));
                    }
                    _this.resetSelectedResponseDetails();
                    break;
                case actionType.UPDATE_DISPLAY_ANGLE_OF_RESPONSE:
                    var responseDisplaySet = action;
                    if (!responseDisplaySet.canReset) {
                        _this._displayAnglesOfCurrentResponse = _this._displayAnglesOfCurrentResponse.
                            set(responseDisplaySet.responseId, responseDisplaySet.displayAngle);
                    }
                    else if (_this._markingMethod !== enums.MarkingMethod.Unstructured || _this._isEBookMarking === true) {
                        _this._displayAnglesOfCurrentResponse = Immutable.Map();
                    }
                    break;
                case actionType.GET_EBOOKMARK_IMAGE_ZONE:
                    var eBookMarkImageZone = action.getCandidateScriptEBookMarkImageZoneCollection;
                    _this._isEBookMarking = true;
                    break;
                case actionType.IMAGEZONE_LOAD:
                    var actionResult = action;
                    _this._markingMethod = actionResult.imageZoneList === null ?
                        (actionResult.originalMarkingMethod === enums.MarkingMethod.MarkFromObject ?
                            enums.MarkingMethod.MarkFromObject : enums.MarkingMethod.Unstructured)
                        : enums.MarkingMethod.Structured;
                    _this._isEBookMarking = false;
                    break;
                case actionType.MARK:
                    _this.resetSelectedResponseDetails();
                    break;
                case actionType.RESPONSE_DATA_GET_SEARCH:
                    var responseDataGetAction_1 = action;
                    _this._searchedResponseData = responseDataGetAction_1.searchedResponseData;
                    _this._selectedDisplayId = parseInt(_this._searchedResponseData.displayId);
                    _this._selectedResponseMode = _this._searchedResponseData.responseMode;
                    break;
                case actionType.ZOOM_OPTION_CLICKED_ACTION:
                    _this._isZoomOptionOpen = action.isZoomOptionOpen;
                    break;
                case actionType.PINCH_ZOOM:
                    _this._isPinchZooming = action.isPinchZooming;
                    break;
                case actionType.SET_IMAGE_ZONES_FOR_PAGE_NO:
                    _this._imageZonesAgainstPageNumber = action.imageZones;
                    _this._linkedAnnotationAgainstPageNumber = action.linkedAnnotaion;
                    _this.emit(ResponseStore.IMAGE_ZONES_AGAINST_PAGE_NO_SAVED);
                    break;
                case actionType.REFRESH_IMAGE_ROTATION_SETTINGS:
                    // Refresh the rotated class on each image.
                    _this.emit(ResponseStore.REFRESH_IMAGE_ROTATE_SETTINGS_EVENT);
                    break;
                case actionType.MARK_THIS_PAGE_NUMBER:
                    _this._markThisPageNumber = action.markThisPageNumber;
                    break;
                case actionType.MARK_BY_OPTION_CLICKED_ACTION:
                    _this._isMarkByOptionOpen = action.isMarkByOptionOpen;
                    break;
                case actionType.RESPONSE_ID_RENDERED_ACTION:
                    _this.emit(ResponseStore.RESPONSE_ID_RENDERED_EVENT);
                    break;
                case actionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    var markGroupIds = action.getMarkGroupIds();
                    var isMarkNowButtonClicked = action.isMarkNowButtonClicked();
                    _this.emit(ResponseStore.SUPERVISOR_REMARK_SUCCESS, markGroupIds, isMarkNowButtonClicked);
                    break;
                case actionType.ATYPICAL_RESPONSE_SEARCH:
                    _this._atypicalSearchResult = action.atypicalSearchResultData;
                    _this.emit(ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT, _this._atypicalSearchResult);
                    break;
                case actionType.ATYPICAL_SEARCH_MARK_NOW_ACTION:
                    var atypicalSearchMarkNow = action;
                    _this._openAtypicalResponse = true;
                    _this.responseData = atypicalSearchMarkNow.allocatedResponseData;
                    _this.emit(ResponseStore.RESPONSE_ALLOCATED_EVENT, atypicalSearchMarkNow.allocatedResponseData.responseAllocationErrorCode, atypicalSearchMarkNow.allocatedResponseData.allocatedResponseItems.length, atypicalSearchMarkNow.allocatedResponseData.success, atypicalSearchMarkNow.allocatedResponseData.examinerApprovalStatus, true, atypicalSearchMarkNow.allocatedResponseData);
                    _this.emit(ResponseStore.RESET_ATYPICAL_SEARCH_FIELD);
                    break;
                case actionType.ATYPICAL_SEARCH_MOVETOWORKLIST_ACTION:
                    var atypicalSearchMoveToWorklist = action;
                    _this.emit(ResponseStore.RESPONSE_ALLOCATED_EVENT, atypicalSearchMoveToWorklist.allocatedResponseData.responseAllocationErrorCode, atypicalSearchMoveToWorklist.allocatedResponseData.allocatedResponseItems.length, atypicalSearchMoveToWorklist.allocatedResponseData.success, atypicalSearchMoveToWorklist.allocatedResponseData.examinerApprovalStatus);
                    _this.emit(ResponseStore.RESET_ATYPICAL_SEARCH_FIELD);
                    break;
                case actionType.SET_RESPONSE_AS_REVIEWED_ACTION:
                    var reviewedResponseDetails = action;
                    if (reviewedResponseDetails.ReviewedResponseDetails.reviewResponseResult === enums.SetAsReviewResult.Success) {
                        _this.resetSelectedResponseDetails();
                    }
                    break;
                case actionType.SUPERVISOR_REMARK_CHECK_ACTION:
                    var supervisorRemarkCheckAction_1 = action;
                    _this._supervisorremarkrequestreturn = supervisorRemarkCheckAction_1.SupervisorRemarkValidationReturn;
                    _this.emit(ResponseStore.VALIDATION_SUCCESS);
                    break;
                case actionType.UNMANAGED_SLAO_FLAG_AS_SEEN_ACTION:
                    var unManagedSLAOFlagAsSeenAction = action;
                    _this.emit(ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT, unManagedSLAOFlagAsSeenAction.selectedPage);
                    break;
                case actionType.PROMOTE_TO_SEED:
                    var promoteToSeedAction_1 = action;
                    _this.emit(ResponseStore.PROMOTE_TO_SEED_EVENT, promoteToSeedAction_1.promoteToSeedReturn.promoteToSeedError);
                    break;
                case actionType.REJECT_RIG_CONFIRMATION_ACTION:
                    var rejectRigConfirmationAction = action;
                    _this.emit(ResponseStore.REJECT_RIG_CONFIRMED_EVENT, rejectRigConfirmationAction.DisplayId);
                    break;
                case actionType.REJECT_RIG_POPUP_DISPLAY_ACTION:
                    var displayAction = action;
                    _this.emit(ResponseStore.REJECT_RIG_POPUP_DISPLAY_EVENT);
                    break;
                case actionType.REJECT_RIG_COMPLETED_ACTION:
                    var rejectRigCompletedAction_1 = action;
                    _this.emit(ResponseStore.REJECT_RIG_COMPLETED_EVENT, rejectRigCompletedAction_1.isNextResponseAvailable);
                    break;
                case actionType.PROMOTE_TO_SEED_VALIDATION:
                    var promoteToSeedCheckRemarkAction_1 = action;
                    _this._promoteseedremarkrequestreturn = promoteToSeedCheckRemarkAction_1.promoteToSeedReturn;
                    var success = promoteToSeedCheckRemarkAction_1.promoteToSeedReturn.success;
                    _this._promoteToSeedFailureCode = promoteToSeedCheckRemarkAction_1.promoteToSeedReturn.failureCode;
                    if (success) {
                        _this.emit(ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT);
                    }
                    break;
                case actionType.SUPERVISOR_REMARK_VISIBILITY_ACTION:
                    var remarkButtonVisibilityAction = action;
                    _this.emit(ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT, remarkButtonVisibilityAction.isVisible);
                    break;
                case actionType.SAMPLING_STATUS_CHANGE_ACTION:
                    var supervisorSamplingCommentReturn = action.supervisorSamplingCommentReturn;
                    _this._sampleReviewCommentId = supervisorSamplingCommentReturn.updatedSamplingCommentId;
                    break;
                case actionType.VIEW_WHOLE_PAGE_LINK:
                    _this._isCursorInsideScript = action.isCursorInsideScript;
                    var activeImageZone = action.activeImageZone;
                    _this.emit(ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS, _this._isCursorInsideScript, activeImageZone);
                    break;
                case actionType.PROMOTE_TO_REUSE_BUCKET_ACTION:
                    var promoteToReuseBucketAction = action;
                    _this._isResponsePromotedToReuseBucket = promoteToReuseBucketAction.isResponsePromotedToReuseBucket;
                    _this.emit(ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT);
                    break;
                case actionType.UPDATE_OFF_PAGE_COMMENT_HEIGHT:
                    var offpagePanelHeightAction = action;
                    var panelHeight = offpagePanelHeightAction.panelHeight;
                    var panActionType = offpagePanelHeightAction.panActionType;
                    _this.emit(ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, panelHeight, panActionType);
                    break;
                case actionType.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_ACTION:
                    var bookmarkPreviousScrollDataAction = action;
                    _this._bookmarkPreviousScrollData = bookmarkPreviousScrollDataAction.getBookmarkPreviousScrollData;
                    _this.emit(ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT);
                    break;
                case actionType.FRV_SCROLL_ACTION:
                    _this.emit(ResponseStore.FRV_SCROLL_EVENT);
                    break;
                case actionType.FRV_TOGGLE_BUTTON_ACTION:
                    // notify that an FRV toggle change occured.
                    _this.emit(ResponseStore.FRV_TOGGLE_BUTTON_EVENT);
                    break;
                case actionType.STANDARDISATION_CENTRE_SCRIPT_OPEN:
                    _this._selectedResponseMode = enums.ResponseMode.closed;
                    break;
            }
        });
    }
    Object.defineProperty(ResponseStore.prototype, "isCursorInsideScript", {
        get: function () {
            return this._isCursorInsideScript;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "isPinchZooming", {
        /* returns true if pinch zoom is started and false when pinch zoom ends*/
        get: function () {
            return this._isPinchZooming;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "markThisPageNumber", {
        /**
         * returns the mark this page number
         */
        get: function () {
            return this._markThisPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "isZoomOptionOpen", {
        /**
         * Gets is zoom option is open or closed
         */
        get: function () {
            return this._isZoomOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "isMarkByOptionOpen", {
        /**
         * Gets is mark by option is open or closed
         */
        get: function () {
            return this._isMarkByOptionOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "searchedResponseData", {
        /**
         * Get the Searched Response Data.
         */
        get: function () {
            return this._searchedResponseData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "displayAnglesOfCurrentResponse", {
        /**
         * This method will return collection of display angles for the current response
         */
        get: function () {
            return this._displayAnglesOfCurrentResponse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "selectedDisplayId", {
        /**
         * This method will returns the selected display ID
         */
        get: function () {
            return this._selectedDisplayId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "sampleReviewCommentId", {
        /**
         * This method will returns sample Review CommentId
         */
        get: function () {
            return this._sampleReviewCommentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "sampleReviewCommentCreatedBy", {
        /**
         * This method will returns sample Review Comment CreatedBy
         */
        get: function () {
            return this._sampleReviewCommentCreatedBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "previousMarkGroupId", {
        /**
         * returns the previous markGroupId
         */
        get: function () {
            return this._previousMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "selectedMarkGroupId", {
        /**
         * This will returns the selected markGroupId
         */
        get: function () {
            return this._selectedMarkGroupId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "selectedResponseMode", {
        /**
         * This method will returns the selected response mode.
         */
        get: function () {
            return this._selectedResponseMode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This will reset the selected response details
     */
    ResponseStore.prototype.resetSelectedResponseDetails = function () {
        this._selectedMarkGroupId = undefined;
        this._previousMarkGroupId = undefined;
        this._mousePosition = undefined;
        this._pageNoIndicatorData = undefined;
        this._selectedResponseViewMode = enums.ResponseViewMode.zoneView;
        this.resetResponseScrollData();
        this._selectedResponseMode = undefined;
    };
    Object.defineProperty(ResponseStore.prototype, "selectedResponseViewMode", {
        /**
         * This will returns the selected response view mode.
         */
        get: function () {
            return this._selectedResponseViewMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "currentScrollPosition", {
        /**
         *   get the scroll position for setting in zone view.
         */
        get: function () {
            return this._scrollPosition;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will push the fracs data for finding active image container.
     * @param data - fracs data of each single and stiched image viewer container.
     */
    ResponseStore.prototype.setFracsData = function (data) {
        if (data != null) {
            this._fracsData.push(data);
        }
        else {
            this._fracsData = [];
        }
    };
    Object.defineProperty(ResponseStore.prototype, "currentlyVisibleImageContainerRefId", {
        /**
         * This will return the ref name of  active image container.
         */
        get: function () {
            return this._currentlyVisibleImageContainerRefId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "getCurrentVisibleFracsData", {
        /**
         * This method will return the fracsData
         */
        get: function () {
            if (this._fracsData.length >= 1) {
                this._fracsData.sort(function (a, b) { return b.visible - a.visible; });
                this._fracsData = this._fracsData.filter(function (data) {
                    return (data.elementId !== null);
                });
            }
            return this._fracsData[0];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This will return the offset of selected image container.
     */
    ResponseStore.prototype.selectedImageOffsetTop = function (elementId) {
        var fracsItem;
        if (this._fracsData.length >= 1) {
            fracsItem = this._fracsData.filter(function (x) { return x.elementId === elementId; });
            if (fracsItem && fracsItem.length > 0) {
                this._selectedImageOffsetTop = fracsItem[0].offsettop;
            }
        }
        return this._selectedImageOffsetTop;
    };
    Object.defineProperty(ResponseStore.prototype, "currentlyVisibleImageOffsetTop", {
        /**
         * This will return the offset of active image container.
         */
        get: function () {
            return this._currentlyVisibleImageOffsetTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "mousePosition", {
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
    /**
     * This method will reset the scroll related data.
     */
    ResponseStore.prototype.resetResponseScrollData = function () {
        this._scrollPosition = 0;
        this._currentlyVisibleImageContainerRefId = 'img_1';
        this._selectedImageOffsetTop = 0;
    };
    /**
     * This method will find the active image container for setting scroll position in
     * full response view.
     */
    ResponseStore.prototype.findVisibleImage = function () {
        if (this._fracsData.length >= 1) {
            this._fracsData.sort(function (a, b) { return b.visible - a.visible; });
            this._fracsData = this._fracsData.filter(function (data) {
                return (data.elementId !== null);
            });
            // The corresponding ref contains the outputpage number as well.
            this._currentlyVisibleImageContainerRefId = this._fracsData[0].elementId + '_' +
                ((this._fracsData[0].outputPage) ? this._fracsData[0].outputPage : 0);
        }
    };
    /**
     * This method will find the active image container for setting scroll position in
     * full response view.
     */
    ResponseStore.prototype.setFracsDataForNonConvertibleFile = function (pageNo) {
        var data = {
            'elementId': 'img_' + pageNo,
            'possible': 0,
            'viewport': 0,
            'visible': 0,
            'offsettop': 0,
            outputPage: 0
        };
        this.setFracsData(data);
    };
    Object.defineProperty(ResponseStore.prototype, "pageNoIndicatorData", {
        /**
         * Method to return the page indicator data.
         */
        get: function () {
            if (this._pageNoIndicatorData) {
                return this._pageNoIndicatorData;
            }
            else {
                return new pageNoIndicatorData([0], [0]);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "currentZoomPercentage", {
        /**
         * This method will returns the current zomm precentage of the response
         */
        get: function () {
            return this._currentZoom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "nextResponseIdAfterSubmit", {
        /**
         * This method will returns the next ResponseId AfterSubmit
         */
        get: function () {
            return this._nextResponseIdAfterSubmit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "markingMethod", {
        /**
         * This method will return the marking method of the response
         */
        get: function () {
            return this._markingMethod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "imageZonesAgainstPageNumber", {
        /**
         * This method returns the imageZones available against a page number
         * For mark this page functionality
         */
        get: function () {
            return this._imageZonesAgainstPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "linkedAnnotationAgainstPageNumber", {
        /**
         * This method returns the linked annotation against the page Number
         * For mark this page functionality_linkedAnnotationAgainstPageNumber
         */
        get: function () {
            return this._linkedAnnotationAgainstPageNumber;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculate the rotation angle
     * @param {number} degree
     * @returns
     */
    ResponseStore.prototype.getRotationAngle = function (degree) {
        var result = 0;
        if (degree < 0) {
            degree = enums.RotateAngle.Rotate_360 + degree;
            result = Math.abs(degree);
        }
        result = degree % enums.RotateAngle.Rotate_360;
        return result;
    };
    Object.defineProperty(ResponseStore.prototype, "hasRotatedImages", {
        /**
         * Gets a value indicating response has rotated images
         * @returns
         */
        get: function () {
            var _this = this;
            var result = false;
            this._displayAnglesOfCurrentResponse.map(function (value, key) {
                if (_this.getRotationAngle(value) !== 0) {
                    result = true;
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "hasRotatedImagesWithOddAngle", {
        get: function () {
            var _this = this;
            var result = false;
            this._displayAnglesOfCurrentResponse.map(function (value, key) {
                if (_this.IsOddangle(_this.getRotationAngle(value))) {
                    result = true;
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * To check whether the angle is odd or not.
     * @param {number} rotatedAngle
     * @returns
     */
    ResponseStore.prototype.IsOddangle = function (rotatedAngle) {
        return !!((this.getAngleforRotation(rotatedAngle) / enums.RotateAngle.Rotate_90) % 2);
    };
    Object.defineProperty(ResponseStore.prototype, "promoteseedremarkrequestreturn", {
        /**
         * This method will return collection of remark request and display id
         */
        get: function () {
            return this._promoteseedremarkrequestreturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "supervisorremarkrequestreturn", {
        /**
         * This method will return collection of remark request and display id
         */
        get: function () {
            return this._supervisorremarkrequestreturn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "userZoomValue", {
        /**
         * return the user input for response zoom
         */
        get: function () {
            return this._userZoomValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "isResponsePromotedToReuseBucket", {
        /**
         * This method will whether the response promoted to reuse bucket or not.
         */
        get: function () {
            return this._isResponsePromotedToReuseBucket;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "getBookmarkPreviousScrollData", {
        /*
         * returns bookmark previous scroll data
         */
        get: function () {
            return this._bookmarkPreviousScrollData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "currentCustomZoomDifference", {
        /*
         * returns current custom zoom difference
         */
        get: function () {
            return this._currentCustomZoomDifference;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "isWholeResponse", {
        /*
         * returns if the selected response is Whole Response
         */
        get: function () {
            // TODO : Remove RelatedWholeResponseQIGId count check for atypical worklist
            return this._isWholeResponse && markingStore.instance.getRelatedWholeResponseQIGIds().length > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResponseStore.prototype, "isBookletView", {
        /*
         * returns if the current view is booklet or not.
         */
        get: function () {
            return this._isBookletView;
        },
        enumerable: true,
        configurable: true
    });
    // Response Opened event name.
    ResponseStore.RESPONSE_OPENED = 'ResponseOpened';
    // Response changed.
    ResponseStore.RESPONSE_CHANGED = 'ResponseChanged';
    // Response Allocated event name.
    ResponseStore.RESPONSE_ALLOCATED_EVENT = 'ResponseAllocated';
    // Atypical response search event name.
    ResponseStore.ATYPICAL_SEARCH_RESULT_EVENT = 'AtypicalSearchResultEvent';
    // Reset atypical search fields.
    ResponseStore.RESET_ATYPICAL_SEARCH_FIELD = 'ResetAtypicalSearchField';
    // Response view mode changed event.
    ResponseStore.RESPONSE_VIEW_MODE_CHANGED_EVENT = 'ResponseViewModeChanged';
    ResponseStore.MOUSE_POSITION_UPDATED_EVENT = 'MousePositionUpdated';
    // Full response view option changed event
    ResponseStore.FULL_RESPONSE_VIEW_OPTION_CHANGED_EVENT = 'FullResponseViewOptionChanged';
    ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT = 'MostVisiblePageUpdated';
    // Update page Number Indicator while zoom settings are changed
    ResponseStore.REFRESH_PAGE_NO_INDICATOR_EVENT = 'RefreshPageNumberIndicatorEvent';
    //Response fracs for rotation
    ResponseStore.SETFRACS_ZOOM = 'SetFracsZoom';
    //Response fracs for Response Image Loaded
    ResponseStore.SET_FRACS_DATA_IMAGE_LOADED_EVENT = 'SetFracsImageLoadedEvent';
    //fracs for Structured Image Loaded
    ResponseStore.STRUCTURED_FRACS_DATA_SET_EVENT = 'StructuredFracsDataSetEvent';
    // Update the response zoom
    ResponseStore.RESPONSE_ZOOM_UPDATE_EVENT = 'ResponseZoomUpdateEvent';
    /* Response zoom has been updated */
    ResponseStore.RESPONSE_ZOOM_UPDATED_EVENT = 'ResponseZoomUpdatedEvent';
    ResponseStore.QUALITY_FEEDBACK_ACCEPTED_EVENT = 'QualityFeedbackAcceptedEvent';
    ResponseStore.RESPONSE_IMAGE_HAS_ROTATED_EVENT = 'ResponseImageHasRotatedEvent';
    ResponseStore.PINCH_ZOOM = 'PinchZoom';
    ResponseStore.IMAGE_ZONES_AGAINST_PAGE_NO_SAVED = 'ImageZonesAgainstPageNoSaved';
    ResponseStore.REFRESH_IMAGE_ROTATE_SETTINGS_EVENT = 'RefreshImageRotateSettings';
    ResponseStore.FRACS_DATA_LOADED = 'FracsDataLoaded';
    ResponseStore.STRUCTURED_FRACS_DATA_LOADED = 'StructuredFracsDataLoaded';
    ResponseStore.FOUND_VISIBLE_IMAGE = 'foundvisibleimage';
    ResponseStore.RESPONSE_ID_RENDERED_EVENT = 'ResponseIdRenderedEvent';
    ResponseStore.SUPERVISOR_REMARK_SUCCESS = 'SupervisorRemarkCreatesSuccessfully';
    ResponseStore.UNMANAGED_SLAO_FLAG_AS_SEEN_STAMP_EVENT = 'unmanaged SLAO flag as seen stamp event';
    // Promote response to seed event
    ResponseStore.PROMOTE_TO_SEED_EVENT = 'PromoteToSeedEvent';
    ResponseStore.REJECT_RIG_CONFIRMED_EVENT = 'rejectrigconfirmed';
    ResponseStore.REJECT_RIG_POPUP_DISPLAY_EVENT = 'rejectrigpopupdisplay';
    ResponseStore.REJECT_RIG_COMPLETED_EVENT = 'rejectrigcompletedevent';
    // Promote response to seed event
    ResponseStore.PROMOTE_TO_SEED_VALIDATION_EVENT = 'PromoteToSeedCheckRemarkEvent';
    // Promote response to seed event
    ResponseStore.PROMOTE_TO_SEED_FAILURE_EVENT = 'PromoteToSeedCheckFailureEvent';
    // Validation Failed event
    ResponseStore.VALIDATION_FAILED = 'ValidationFailed';
    // Validation Failed event
    ResponseStore.VALIDATION_SUCCESS = 'ValidationSuccess';
    // Supervisor remark  button visibility action event
    ResponseStore.SUPERVISOR_REMARK_BUTTON_VISIBILITY_EVENT = 'supervisorremarkbuttonvisibilityevent';
    // promote to reuse bucket completed action event
    ResponseStore.PROMOTE_TO_REUSE_BUCKET_COMPLETED_EVENT = 'promotetoreusebuckecompletedtevent';
    ResponseStore.UPDATE_VIEW_WHOLE_PAGE_LINK_VISIBILITY_STATUS = 'updateviewwholepagelinkvisibilitystatus';
    // offpage comment panel height update event
    ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT = 'updateoffpagecommentheightevent';
    ResponseStore.SET_BOOKMARK_PREVIOUS_SCROLL_DATA_EVENT = 'setbookmarkpreviousscrolldataevent';
    ResponseStore.FRACS_DATA_SET_FOR_ACETATES_EVENT = 'fracsdatasetforacetatesevent';
    ResponseStore.FRV_SCROLL_EVENT = 'frvscrollevent';
    ResponseStore.FRV_TOGGLE_BUTTON_EVENT = 'frvtogglebuttonevent';
    ResponseStore.SCROLL_POSITION_CHANGED_EVENT = 'scrollpositionchangedevent';
    return ResponseStore;
}(storeBase));
var instance = new ResponseStore();
module.exports = { ResponseStore: ResponseStore, instance: instance };
//# sourceMappingURL=responsestore.js.map