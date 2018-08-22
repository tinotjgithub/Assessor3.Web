import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import stampAction = require('./stampaction');
import updateFavoriteStampCollectionAction = require('./updatefavoritestampcollectionaction');
import stampDataService = require('../../dataservices/stamp/stampdataservice');
import stampList = require('../../stores/stamp/typings/stamplist');
import stampData = require('../../stores/stamp/typings/stampdata');
import stampBannerAction = require('./stampbanneraction');
import promise = require('es6-promise');
import stampNameMap = require('../../utility/stamppanel/stampnamemap');
import editOnPageComment = require('./editpagecommentaction');
import showOrHideComment = require('./showorhidecommentaction');
import deleteCommentAction = require('./deletecommentaction');
import commentsSideViewToggleAction = require('./commentssideviewtoggleaction');
import commentSideViewRenderAction = require('./commentsideviewrenderaction');
import setSelectedSideViewCommentAction = require('./setselectedsideviewcommentaction');
import annotation = require('../../stores/response/typings/annotation');
import base = require('../base/actioncreatorbase');
import commentHolderRenderedAction = require('./commentholderrenderedaction');
import toggleCommentLinesVisibilityAction = require('./togglecommentlinesvisibilityaction');
import switchZoomPreferenceAction = require('./switchzoompreferenceaction');
import setCommentVisibilityAction = require('./setcommentvisibilityaction');
import dynamicAnnotationDragAction = require('./dynamicannotationmoveaction');
import showOrHideBookmarkNameBox = require('../bookmarks/showorhidebookmarknameboxaction');
import stampDataAgainstQig = require('../../stores/stamp/typings/stampdataagainstqig');
import updateOffPageVisibilityAction = require('./updateoffpagevisibilityaction');
import setMarkEntryTextboxFocusAction = require('./setmarkentrytextboxfocusaction');
import deSelectAnnotation = require('./deselectannotationaction');
import resetStampTypeAction = require('./resetstampbannertypeaction');

class StampActionCreator extends base {

    /**
     * Method which retrieves the stamp data.
     * @param markSchemeGroupId
     * @param stampIds - The stamp details already in store need not be fetched again from DB.
     * @param useCache
     */
    public getStampData(markSchemeGroupId: number,
        stampIds: Immutable.List<number>,
        markingMethod: enums.MarkingMethod,
        isEbookmarking: boolean,
        includeRelatedQigs: boolean = false,
		useCache: boolean = true,
		includeRelatedQPs: boolean = false,
		viaAwarding: boolean = false): Promise<any> {

        let that = this;
        return new promise.Promise(function (resolve: any, reject: any) {
            stampDataService.getStampList(function (success: boolean, json: stampList) {

                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json)) {
                    // resetting the stamp name to the desired name in Assessor-3 css or svg def.
                    if (json) {
                        json.stampDataAgainstQig.forEach((item: stampDataAgainstQig) => {
                            if (item.stamps) {
                                item.stamps.map((stamp: any) => {
                                    stamp.name = stampNameMap.map(stamp.name);
                                });
                            }
                        });
                    }

					// Dispatch the stamp action once the stamp list loading completed.
					dispatcher.dispatch(new stampAction(success, json, viaAwarding));
                    resolve(json);
                } else {
                    reject(null);
                }

            },
                markSchemeGroupId,
                stampIds,
                markingMethod,
                includeRelatedQigs,
                useCache,
				isEbookmarking,
				includeRelatedQPs
            );
        });
    }

    /**
     * Add/Remove stamp to/from favorites when dragged from/to expanded toolbar to/from favorite toolbar
     * @param favoriteStampActionType
     * @param addFavoriteStampId
     * @param addFavoriteStampList
     */
    public updateFavoriteStampCollection(favoriteStampActionType: enums.FavoriteStampActionType,
        addFavoriteStampId: number,
        addFavoriteStampList?: Immutable.List<number>,
        insertedOverStampId?: number) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateFavoriteStampCollectionAction(favoriteStampActionType,
                addFavoriteStampId,
                addFavoriteStampList,
                insertedOverStampId));
        });
    }

    /**
     * This method will update the stampbanner.
     * @param stampBannerType - stamp banner type
     * @param isStampBannerVisible -
     */
    public updateStampBannerVisibility(stampBannerType: enums.BannerType, isStampBannerVisible: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stampBannerAction(true, stampBannerType, isStampBannerVisible));
        }).catch();
    }

    /**
     * Opening onpage stamp comment box
     * @param {annotation} commentAttribute
     * @param {number} left
     * @param {number} top
     * @param {string} hierarchy
     */
    public editOnPageComment(commentAttribute: annotation,
        left: number,
        top: number,
        hierarchy: string,
        windowsWidth: number,
        overlayWidth: number,
        overlayHeight: number,
        wrapper: any,
        isCommentBoxReadOnly: boolean,
        isCommentBoxInActive: boolean): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new editOnPageComment(commentAttribute,
                left,
                top,
                hierarchy,
                windowsWidth,
                overlayWidth,
                overlayHeight,
                wrapper,
                isCommentBoxReadOnly,
                isCommentBoxInActive));
        }).catch();
    }

    /**
     * Method to show Or Hide Comment
     * @param isOpen
     * @param isPanAvoidImageContainerRender
     */
    public showOrHideComment(isOpen: boolean, isPanAvoidImageContainerRender: boolean = false) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showOrHideComment(isOpen, isPanAvoidImageContainerRender));
        }).catch();
    }

    /**
     * Method to call delete comment action
     * @param isDelete
     */
    public deleteComment(isDelete: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new deleteCommentAction(isDelete));
        }).catch();
    }

    /**
     * Method to call toggle comment to side view action
     * @param enableSideView
     * @param selectedClientToken
     */
    public toggleCommentSideView(enableSideView: boolean, selectedClientToken?: string,
        disableSideViewOnDevices?: boolean) {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new commentsSideViewToggleAction(enableSideView, selectedClientToken, disableSideViewOnDevices));
        }).catch();
    }

    /**
     * re render the side view for comments
     */
    public renderSideViewComments(actualX?: number, actualY?: number, clientToken?: string,
        isAnnotationMove: boolean = false, inGreyArea: boolean = false): void {

        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new commentSideViewRenderAction(isAnnotationMove, actualX, actualY, clientToken,
                inGreyArea));
        }).catch();
    }

    /**
     * Method to set the selected comment in side view while opening from comment box
     * @param selectedClientToken
     */
    public setSelectedSideViewComment(selectedClientToken?: string): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setSelectedSideViewCommentAction(selectedClientToken));
        }).catch();
    }

    /**
     * method to set the comment holder is renedered
     * @param outputpageNo
     * @param minHeight
     */
    public setCommentHolderRendered(outputpageNo: number, minHeight: number): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new commentHolderRenderedAction(outputpageNo, minHeight));
        }).catch();
    }

    /**
     * Toggle the visibility of the comment lines/boxes during zoom/pinch
     *
     * @param {boolean} hideLines
     * @param {boolean} hideBoxes
     *
     * @memberof StampActionCreator
     */
    public toggleCommentLinesVisibility(hideLines: boolean, hideBoxes: boolean): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new toggleCommentLinesVisibilityAction(hideLines, hideBoxes));
        }).catch();
    }

    /**
     * switches the zoom preference
     *
     * @param {enums.ZoomPreference} zoomPreference
     *
     * @memberof StampActionCreator
     */
    public switchZoomPreference(zoomPreference: enums.ZoomPreference): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new switchZoomPreferenceAction(zoomPreference));
        }).catch();
    }

	/**
	 * Set response container visibility.
	 * @param isCommentContainerVisible
	 */
    public setCommentVisibilityAction(isCommentContainerVisible: boolean): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setCommentVisibilityAction(isCommentContainerVisible));
        }).catch();
    }

    /**
     * Sets the dynamic annotation move status.
     * @param isActive
     */
    public setDynamicAnnotationMoveInScript(isActive: boolean): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new dynamicAnnotationDragAction(isActive));
        }).catch();
    }

    /**
     * Show or Hide Bookmark Name Box
     */
    public showOrHideBookmarkNameBox(isVisible: boolean = false, bookmarkName: string = '', clientToken: string = '',
        rotatedAngle: enums.RotateAngle = enums.RotateAngle.Rotate_0): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new showOrHideBookmarkNameBox(bookmarkName, clientToken, isVisible, rotatedAngle));
        }).catch();
    }

    /**
     * Show or Hide Enhanced off page comment
     */
    public showOrHideoffPageVisibility() {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new updateOffPageVisibilityAction());
        }).catch();
    }

    /**
     * Show or Hide Enhanced off page comment
     */
    public setFocusOnMarkEntrytextbox() {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new setMarkEntryTextboxFocusAction());
        }).catch();
	}

	/**
	 * De-Select annotation if not configured for selected QIG
	 */
	public deSelectAnnotation() {
		new promise.Promise(function (resolve: any, reject: any) {
			resolve();
		}).then(() => {
			dispatcher.dispatch(new deSelectAnnotation());
		}).catch();
    }

    /**
     * Reset stamp banner type.
     */
    public resetStampBannerType(): Promise<any> {
        return new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new resetStampTypeAction());
        }).catch();
    }
}

let stampActionCreator = new StampActionCreator();
export = stampActionCreator;