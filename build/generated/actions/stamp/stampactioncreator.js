"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var enums = require('../../components/utility/enums');
var stampAction = require('./stampaction');
var updateFavoriteStampCollectionAction = require('./updatefavoritestampcollectionaction');
var stampDataService = require('../../dataservices/stamp/stampdataservice');
var stampBannerAction = require('./stampbanneraction');
var promise = require('es6-promise');
var stampNameMap = require('../../utility/stamppanel/stampnamemap');
var editOnPageComment = require('./editpagecommentaction');
var showOrHideComment = require('./showorhidecommentaction');
var deleteCommentAction = require('./deletecommentaction');
var commentsSideViewToggleAction = require('./commentssideviewtoggleaction');
var commentSideViewRenderAction = require('./commentsideviewrenderaction');
var setSelectedSideViewCommentAction = require('./setselectedsideviewcommentaction');
var base = require('../base/actioncreatorbase');
var commentHolderRenderedAction = require('./commentholderrenderedaction');
var toggleCommentLinesVisibilityAction = require('./togglecommentlinesvisibilityaction');
var switchZoomPreferenceAction = require('./switchzoompreferenceaction');
var setCommentVisibilityAction = require('./setcommentvisibilityaction');
var dynamicAnnotationDragAction = require('./dynamicannotationmoveaction');
var showOrHideBookmarkNameBox = require('../bookmarks/showorhidebookmarknameboxaction');
var updateOffPageVisibilityAction = require('./updateoffpagevisibilityaction');
var setMarkEntryTextboxFocusAction = require('./setmarkentrytextboxfocusaction');
var deSelectAnnotation = require('./deselectannotationaction');
var resetStampTypeAction = require('./resetstampbannertypeaction');
var StampActionCreator = (function (_super) {
    __extends(StampActionCreator, _super);
    function StampActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Method which retrieves the stamp data.
     * @param markSchemeGroupId
     * @param stampIds - The stamp details already in store need not be fetched again from DB.
     * @param useCache
     */
    StampActionCreator.prototype.getStampData = function (markSchemeGroupId, stampIds, markingMethod, isEbookmarking, includeRelatedQigs, useCache) {
        if (includeRelatedQigs === void 0) { includeRelatedQigs = false; }
        if (useCache === void 0) { useCache = true; }
        var that = this;
        return new promise.Promise(function (resolve, reject) {
            stampDataService.getStampList(function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {
                    // resetting the stamp name to the desired name in Assessor-3 css or svg def.
                    if (json) {
                        json.stampDataAgainstQig.forEach(function (item) {
                            if (item.stamps) {
                                item.stamps.map(function (stamp) {
                                    stamp.name = stampNameMap.map(stamp.name);
                                });
                            }
                        });
                    }
                    // Dispatch the stamp action once the stamp list loading completed.
                    dispatcher.dispatch(new stampAction(success, json));
                    resolve(json);
                }
                else {
                    reject(null);
                }
            }, markSchemeGroupId, stampIds, markingMethod, includeRelatedQigs, useCache, isEbookmarking);
        });
    };
    /**
     * Add/Remove stamp to/from favorites when dragged from/to expanded toolbar to/from favorite toolbar
     * @param favoriteStampActionType
     * @param addFavoriteStampId
     * @param addFavoriteStampList
     */
    StampActionCreator.prototype.updateFavoriteStampCollection = function (favoriteStampActionType, addFavoriteStampId, addFavoriteStampList, insertedOverStampId) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateFavoriteStampCollectionAction(favoriteStampActionType, addFavoriteStampId, addFavoriteStampList, insertedOverStampId));
        });
    };
    /**
     * This method will update the stampbanner.
     * @param stampBannerType - stamp banner type
     * @param isStampBannerVisible -
     */
    StampActionCreator.prototype.updateStampBannerVisibility = function (stampBannerType, isStampBannerVisible) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stampBannerAction(true, stampBannerType, isStampBannerVisible));
        }).catch();
    };
    /**
     * Opening onpage stamp comment box
     * @param {annotation} commentAttribute
     * @param {number} left
     * @param {number} top
     * @param {string} hierarchy
     */
    StampActionCreator.prototype.editOnPageComment = function (commentAttribute, left, top, hierarchy, windowsWidth, overlayWidth, overlayHeight, wrapper, isCommentBoxReadOnly, isCommentBoxInActive) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new editOnPageComment(commentAttribute, left, top, hierarchy, windowsWidth, overlayWidth, overlayHeight, wrapper, isCommentBoxReadOnly, isCommentBoxInActive));
        }).catch();
    };
    /**
     * Method to show Or Hide Comment
     * @param isOpen
     * @param isPanAvoidImageContainerRender
     */
    StampActionCreator.prototype.showOrHideComment = function (isOpen, isPanAvoidImageContainerRender) {
        if (isPanAvoidImageContainerRender === void 0) { isPanAvoidImageContainerRender = false; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showOrHideComment(isOpen, isPanAvoidImageContainerRender));
        }).catch();
    };
    /**
     * Method to call delete comment action
     * @param isDelete
     */
    StampActionCreator.prototype.deleteComment = function (isDelete) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new deleteCommentAction(isDelete));
        }).catch();
    };
    /**
     * Method to call toggle comment to side view action
     * @param enableSideView
     * @param selectedClientToken
     */
    StampActionCreator.prototype.toggleCommentSideView = function (enableSideView, selectedClientToken, disableSideViewOnDevices) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new commentsSideViewToggleAction(enableSideView, selectedClientToken, disableSideViewOnDevices));
        }).catch();
    };
    /**
     * re render the side view for comments
     */
    StampActionCreator.prototype.renderSideViewComments = function (actualX, actualY, clientToken, isAnnotationMove, inGreyArea) {
        if (isAnnotationMove === void 0) { isAnnotationMove = false; }
        if (inGreyArea === void 0) { inGreyArea = false; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new commentSideViewRenderAction(isAnnotationMove, actualX, actualY, clientToken, inGreyArea));
        }).catch();
    };
    /**
     * Method to set the selected comment in side view while opening from comment box
     * @param selectedClientToken
     */
    StampActionCreator.prototype.setSelectedSideViewComment = function (selectedClientToken) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setSelectedSideViewCommentAction(selectedClientToken));
        }).catch();
    };
    /**
     * method to set the comment holder is renedered
     * @param outputpageNo
     * @param minHeight
     */
    StampActionCreator.prototype.setCommentHolderRendered = function (outputpageNo, minHeight) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new commentHolderRenderedAction(outputpageNo, minHeight));
        }).catch();
    };
    /**
     * Toggle the visibility of the comment lines/boxes during zoom/pinch
     *
     * @param {boolean} hideLines
     * @param {boolean} hideBoxes
     *
     * @memberof StampActionCreator
     */
    StampActionCreator.prototype.toggleCommentLinesVisibility = function (hideLines, hideBoxes) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new toggleCommentLinesVisibilityAction(hideLines, hideBoxes));
        }).catch();
    };
    /**
     * switches the zoom preference
     *
     * @param {enums.ZoomPreference} zoomPreference
     *
     * @memberof StampActionCreator
     */
    StampActionCreator.prototype.switchZoomPreference = function (zoomPreference) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new switchZoomPreferenceAction(zoomPreference));
        }).catch();
    };
    /**
     * Set response container visibility.
     * @param isCommentContainerVisible
     */
    StampActionCreator.prototype.setCommentVisibilityAction = function (isCommentContainerVisible) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setCommentVisibilityAction(isCommentContainerVisible));
        }).catch();
    };
    /**
     * Sets the dynamic annotation move status.
     * @param isActive
     */
    StampActionCreator.prototype.setDynamicAnnotationMoveInScript = function (isActive) {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new dynamicAnnotationDragAction(isActive));
        }).catch();
    };
    /**
     * Show or Hide Bookmark Name Box
     */
    StampActionCreator.prototype.showOrHideBookmarkNameBox = function (isVisible, bookmarkName, clientToken, rotatedAngle) {
        if (isVisible === void 0) { isVisible = false; }
        if (bookmarkName === void 0) { bookmarkName = ''; }
        if (clientToken === void 0) { clientToken = ''; }
        if (rotatedAngle === void 0) { rotatedAngle = enums.RotateAngle.Rotate_0; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new showOrHideBookmarkNameBox(bookmarkName, clientToken, isVisible, rotatedAngle));
        }).catch();
    };
    /**
     * Show or Hide Enhanced off page comment
     */
    StampActionCreator.prototype.showOrHideoffPageVisibility = function () {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateOffPageVisibilityAction());
        }).catch();
    };
    /**
     * Show or Hide Enhanced off page comment
     */
    StampActionCreator.prototype.setFocusOnMarkEntrytextbox = function () {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new setMarkEntryTextboxFocusAction());
        }).catch();
    };
    /**
     * De-Select annotation if not configured for selected QIG
     */
    StampActionCreator.prototype.deSelectAnnotation = function () {
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new deSelectAnnotation());
        }).catch();
    };
    /**
     * Reset stamp banner type.
     */
    StampActionCreator.prototype.resetStampBannerType = function () {
        return new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new resetStampTypeAction());
        }).catch();
    };
    return StampActionCreator;
}(base));
var stampActionCreator = new StampActionCreator();
module.exports = stampActionCreator;
//# sourceMappingURL=stampactioncreator.js.map