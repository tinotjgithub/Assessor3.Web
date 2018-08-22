import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import stampAction = require('../../actions/stamp/stampaction');
import updateFavoriteStampCollectionAction = require('../../actions/stamp/updatefavoritestampcollectionaction');
import Immutable = require('immutable');
import stampData = require('./typings/stampdata');
import stampList = require('./typings/stamplist');
import enums = require('../../components/utility/enums');
import groupHelper = require('../../utility/grouping/grouphelper');
import grouperList = require('../../utility/grouping/groupingbase/grouperlist');
import stampBannerAction = require('../../actions/stamp/stampbanneraction');
import responseCloseAction = require('../../actions/worklist/responsecloseaction');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import qigStore = require('../qigselector/qigstore');
import annotation = require('../response/typings/annotation');
import updateAnnotationColorAction = require('../../actions/marking/updateannotationcoloraction');
import editCommentAction = require('../../actions/stamp/editpagecommentaction');
import showOrHideComment = require('../../actions/stamp/showorhidecommentaction');
import constants = require('../../components/utility/constants');
import commentSideViewRenderAction = require('../../actions/stamp/commentsideviewrenderaction');
import commentsSideViewToggleAction = require('../../actions/stamp/commentssideviewtoggleaction');
import setSelectedSideViewCommentAction = require('../../actions/stamp/setselectedsideviewcommentaction');
import updateAnnotationPositionAction = require('../../actions/marking/updateannotationpositionaction');
import commentHolderRenderedAction = require('../../actions/stamp/commentholderrenderedaction');
import toggleCommentLinesVisibilityAction = require('../../actions/stamp/togglecommentlinesvisibilityaction');
import switchZoomPreferenceAction = require('../../actions/stamp/switchzoompreferenceaction');
import setCommentVisibilityAction = require('../../actions/stamp/setcommentvisibilityaction');
import dynamicAnnotationMoveAction = require('../../actions/stamp/dynamicannotationmoveaction');
import stampDataAgainstQig = require('./typings/stampdataagainstqig');
import currentQuestionItemInfo = require('../../actions/marking/currentquestioniteminfo');
import setMarkEntryTextboxFocusAction = require('../../actions/stamp/setmarkentrytextboxfocusaction');
import worklistStore = require('../worklist/workliststore');
import markingStore = require('../marking/markingstore');
import createRemarkAction = require('../../actions/response/createremarkaction');
import awardingStore = require('../awarding/awardingstore');
/**
 * Class for Stamp store
 */
class StampStore extends storeBase {

    private _favoriteStamps: Immutable.List<number>;
    private _availableStampIdsAgainstMarkSchemeGroupId: Immutable.Map<number, Immutable.List<number>>;
    private _availableStampDetailsAgainstAllQIGs: Immutable.Map<number, Immutable.List<stampData>>;
    private _stampBannerType: enums.BannerType = undefined;
    private _isSeenStampConfiguredForQIG: boolean;
    private _selectedSideViewCommentToken: string;
    private _isSideViewCommentEnabled: boolean;
    private _disableSideViewOnDevices: boolean;
    private _isEnhancedOffPageCommentConfiguredForQIG: boolean;
    private _isOffPageCommentConfiguredForQIG: boolean;
    private _isOffPageCommentVisible: boolean;
    private _isDynamicAnnotationMovingInScript: boolean = false;
    private _stampItemAgainstEachQig: stampList;
    private _selectedQIGMarkSchemeGroupId: number;
    private _selectedQIGMarkGroupId: number;
    private _selectedQIGExaminerRoleId: number;
	private _stampsAgainstAllQIGs: Immutable.List<stampData>;
	private _viaAwarding: boolean;

    // Holds a value indicating the current selected onpage comment client token
    private _selectedOnpageCommentClientToken: string;

    private _commentIsOnMove: boolean = false;
    private _movingCommentToken: string;

    // Holds current question info
    private _currentQuestionItemInfo: currentQuestionItemInfo;

    // stamps loaded event name.
    public static STAMPS_LOADED_EVENT = 'StampsLoadedEvent';
    public static FAVORITE_STAMP_UPDATED = 'FavoriteStampUpdatedEvent';
    public static STAMP_BANNER_VISIBILITY_MODE_CHANGED = 'StampBannerVisibilityModeChanged';

    /* For emiting the event while changing the color*/
    public static UPDATE_ANNOTATION_COLOR_STAMP = 'UpdateAnnotation';

    /* Emit the event to open the onpage comment edit box. */
    public static INVOKE_ONPAGE_COMMENT = 'InvokingOnPageComment';

    /* Emit the event to show or hide comment edit box. */
    public static INVOKE_SHOW_OR_HIDE_COMMENT = 'InvokeShowOrHideComment';

    public static DELETE_COMMENT = 'DeleteComment';

    public static COMMENT_SIDE_VIEW_RENDER_EVENT = 'CommentSideViewRenderEvent';

    public static COMMENTS_SIDEVIEW_TOGGLE_EVENT = 'OnPageCommentsSideViewToggle';

    public static COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT = 'CommentSideViewRenderOnAnnotationMoveEvent';

    public static COMMENT_HOLDER_RENDERED_EVENT = 'CommentHolderRenderedEvent';

    public static COMMENT_SELECTED_SIDE_VIEW_EVENT = 'CommentSelectedInSideViewEvent';

    public static UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT = 'UpdateCommentsListInSideViewEvent';

    public static TOGGLE_COMMENT_LINES_VISIBILITY_EVENT = 'ToggleCommentLinesVisibilityEvent';

    public static SWITCH_ZOOM_PREFERENCE_EVENT = 'switchZoomPreferenceEvent';

    public static COMMENT_VISIBILITY_CHANGED_EVENT = 'commentVisibilityChangedEvent';

    public static UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT = 'updateOffpageVisibilityStatusEvent';

    public static SET_MARKENTRY_TEXTBOX_FOCUS_EVENT = 'setMarkentryTextboxFocusEvent';

    /**
     * @Constructor
     */
    constructor() {
        super();
        this._favoriteStamps = Immutable.List<number>();
        this._availableStampIdsAgainstMarkSchemeGroupId = Immutable.Map<number, Immutable.List<number>>();
        this._availableStampDetailsAgainstAllQIGs = Immutable.Map<number, Immutable.List<stampData>>();

        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.STAMPS_FETCH:
                    let actionResult = (action as stampAction);

					if (actionResult.success) {
						this._viaAwarding = actionResult.viaAwarding;
                        this._stampItemAgainstEachQig = actionResult.stampList;
                        this.addStampItems(actionResult.stampList);
                    }

                    this.emit(StampStore.STAMPS_LOADED_EVENT);
                    break;

                case actionType.FAVORITE_STAMP_UPDATED:
                    let updateFavoriteStampCollectionAction = action as updateFavoriteStampCollectionAction;
                    let favoriteStampId = updateFavoriteStampCollectionAction.getFavoriteStampId;
                    let favoriteStampActionType = updateFavoriteStampCollectionAction.getFavoriteStampActionType;
                    let favoriteStampIdList = updateFavoriteStampCollectionAction.getFavoriteStampListFromUserOption;

                    switch (favoriteStampActionType) {
                        case enums.FavoriteStampActionType.LoadFromUserOption:
                            this.addStampToFavoriteFromUserOption(favoriteStampIdList);
                            break;
                        case enums.FavoriteStampActionType.Add:
                            this.addStampToFavorite(favoriteStampId);
                            break;
                        case enums.FavoriteStampActionType.Remove:
                            this.removeStampFromFavorite(favoriteStampId);
                            break;
                        case enums.FavoriteStampActionType.Insert:
                            this.insertStampToFavorite(favoriteStampId, updateFavoriteStampCollectionAction.getInsertedOverStampId);
                            break;
                    }

                    this.emit(StampStore.FAVORITE_STAMP_UPDATED, favoriteStampActionType);
                    break;

                case actionType.UPDATE_STAMP_BANNER_VISIBILITY:
                    let stampBannerActionResult = action as stampBannerAction;
                    this._stampBannerType = stampBannerActionResult.stampBannerType;
                    this.emit(StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED, this.currentStampBannerType,
                        stampBannerActionResult.isStampBannerVisible);
                    break;

                case actionType.RESPONSE_CLOSE:
                case actionType.OPEN_RESPONSE:
                    // resetting the current stamp banner type.
                    this._stampBannerType = undefined;
                    break;
                case actionType.UPDATE_ANNOTATION_COLOR:
                    let _updateAnnotationColorAction = action as updateAnnotationColorAction;
                    this.updateColor(_updateAnnotationColorAction.currentAnnotation);
                    this.emit(StampStore.UPDATE_ANNOTATION_COLOR_STAMP);
                    break;
                case actionType.COMMENT_HOLDER_RENDERED_ACTION:
                    let _commentHolderData = action as commentHolderRenderedAction;
                    this.emit(StampStore.COMMENT_HOLDER_RENDERED_EVENT, _commentHolderData.outputPageNo, _commentHolderData.minHeight);
                    break;
                case actionType.EDIT_ONPAGE_COMMENT:
                    let data = action as editCommentAction;

                    // Holds a value indicating the current selected onpage comment client token
                    this._selectedOnpageCommentClientToken =
                        this._selectedSideViewCommentToken =
                        data.comment.clientToken;

                    // Open the on page comment box
                    this.emit(StampStore.INVOKE_ONPAGE_COMMENT,
                        data.comment,
                        data.leftOffSet,
                        data.topOffSet,
                        data.qustionHierarhy,
                        data.windowsWidth,
                        data.overlayHeight,
                        data.overlayWidth,
                        data.wrapper,
                        data.isCommentBoxReadOnly,
                        data.isCommentBoxInActive);
                    break;
                case actionType.SHOW_OR_HIDE_ONPAGE_COMMENT:
                    let commentdata = action as showOrHideComment;

                    // If comment is closing then clear the selected onpage comment client token
                    // to allow open comment on stamping annotation.
                    if (!commentdata.isOpen) {
                        this._selectedOnpageCommentClientToken = this._selectedSideViewCommentToken = undefined;
                    }

                    this.emit(StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, commentdata.isOpen, commentdata.isPanAvoidImageContainerRender);
                    break;
                case actionType.DELETE_COMMENT:
                    this.emit(StampStore.DELETE_COMMENT);
                    break;
                case actionType.COMMENT_SIDE_VIEW_RENDER_ACTION:
                    let commentData = action as commentSideViewRenderAction;
                    if (commentData.isAnnotationMove === true) {
                        this._movingCommentToken = commentData.clientToken;
                        this.emit(StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT, commentData.stampX,
                            commentData.stampY, commentData.clientToken, commentData.isInGreyARea);
                    } else {
                        this.emit(StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT);
                    }
                    break;
                case actionType.UPDATE_ANNOTATION:
                    this._commentIsOnMove = false;
                    if (this._selectedSideViewCommentToken !==
                        (action as updateAnnotationPositionAction).draggedAnnotationClientToken) {
                        this._selectedSideViewCommentToken = undefined;
                    }
                    break;
                case actionType.SET_SELECTED_SIDE_VIEW_COMMENT_ACTION:
                    this._selectedSideViewCommentToken = (action as setSelectedSideViewCommentAction).clientToken;
                    this._selectedOnpageCommentClientToken = undefined;
                    // Rerender the comment container after setting the selected comment in side view
                    this.emit(StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT);
                    break;
                case actionType.COMMENTS_SIDEVIEW_TOGGLE_ACTION:
                    let commentAction = action as commentsSideViewToggleAction;
                    if (commentAction.enableSideView) {
                        this._selectedOnpageCommentClientToken = undefined;
                        this._selectedSideViewCommentToken = commentAction.currentCommentToken;
                    } else {
                        this._selectedSideViewCommentToken = undefined;
                    }
                    if (commentAction.disableSideViewOnDevices) {
                        this.emit(StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, false);
                    }
                    this._isSideViewCommentEnabled = commentAction.enableSideView;
                    this._disableSideViewOnDevices = commentAction.disableSideViewOnDevices;
                    this.emit(StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, commentAction.enableSideView,
                        commentAction.disableSideViewOnDevices);
                    break;
                case actionType.UPDATE_COMMENT_LIST_IN_SIDE_VIEW:
                    this.emit(StampStore.UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT);
                    break;
                case actionType.TOGGLE_COMMENT_LINES_VISIBILITY:
                    let toggleAction = action as toggleCommentLinesVisibilityAction;
                    this.emit(StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT,
                        toggleAction.hideLines, toggleAction.hideBoxes);
                    break;
                case actionType.SWITCH_ZOOM_PREFERENCE:
                    let zoomAction = action as switchZoomPreferenceAction;
                    this.emit(StampStore.SWITCH_ZOOM_PREFERENCE_EVENT, zoomAction.zoomPreference);
                    break;
                case actionType.SET_COMMENT_VISIBILITY_ACTION:

                    // Hide/Show comment sideview.
                    let visibilityAction = action as setCommentVisibilityAction;
                    this.emit(StampStore.COMMENT_VISIBILITY_CHANGED_EVENT, visibilityAction.isvisible);
                    break;
                case actionType.DYNAMIC_ANNOTATION_DRAGGING:
                    let dynamicAnnotationMoveAction = action as dynamicAnnotationMoveAction;
                    this._isDynamicAnnotationMovingInScript = dynamicAnnotationMoveAction.isAnnotationActive;
                    break;

                // Removing comment tokens while deleting comments as part of defectfix #53424
                case actionType.REMOVE_ANNOTATION:
                    this._selectedSideViewCommentToken = this._selectedOnpageCommentClientToken = undefined;
                    break;
                case actionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    let isMarkNowButtonClicked: boolean = (action as createRemarkAction).isMarkNowButtonClicked();
                    if (isMarkNowButtonClicked) {
                        // resetting the current stamp banner type.
                        this._stampBannerType = undefined;
                    }
                    break;
                case actionType.UPDATE_OFFPAGE_VISIBILITY_STATUS_ACTION:
                    this.updateOffpageVisibility(markingStore.instance.selectedQIGMarkSchemeGroupId);
                    this.emit(StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT);
                    break;
                case actionType.SET_MARKENTRY_TEXTBOX_FOCUS_ACTION:
                    this.emit(StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT);
                    break;
                case actionType.RESET_STAMP_BANNER_TYPE_ACTION:
                    // resetting the current stamp banner type.
                    this._stampBannerType = undefined;
                    break;
            }
        });
    }

    /**
     * This method will return whether the stamp panel is expanded/collapsed
     */
    public updateColor(annotation: annotation): void {
        switch (annotation.stamp) {
            case enums.DynamicAnnotation.Highlighter:
                if (this._stampsAgainstAllQIGs) {
                    this._stampsAgainstAllQIGs.map(function (stamp: stampData) {
                        if (stamp.stampId === enums.DynamicAnnotation.Highlighter) {
                            // Change the highlighter color in toolbar.
                            stamp.color = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR,
                                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                        }
                    });
                }
                break;
            case enums.DynamicAnnotation.HorizontalLine:
                break;
        }
    }

    /**
     * This will returns the stampIds for selected QIG.
     */
    public stampIdsForQIG(markSchemeGroupId: number) {
        let stampIdList = this._availableStampIdsAgainstMarkSchemeGroupId.get(markSchemeGroupId);
        return stampIdList ? stampIdList : Immutable.List<number>();
    }

    /**
     * This will return the stamps against all QIGs in case of whole response
     */
	public get stampsAgainstAllQIGs() {
		let markSchemeGroupIds = [];
		let availableStampsForQIG: Immutable.List<stampData> = Immutable.List<stampData>();
		let relatedQigList: any = this._viaAwarding ? awardingStore.instance.selectedCandidateData.responseItemGroups
			: qigStore.instance.relatedQigList;

		// Get markSchemeGroupId(s) of the currently opened component
		if (relatedQigList) {
			relatedQigList.map((value, key) => {
				markSchemeGroupIds.push(value.markSchemeGroupId);
			});
		}

		// Filter stamps for the currently opened component
		if (markSchemeGroupIds !== undefined && markSchemeGroupIds.length > 0) {
			let that = this;
			markSchemeGroupIds.map((markSchemeGroupId) => {
				let qigStamps = that._availableStampDetailsAgainstAllQIGs.get(+markSchemeGroupId);
				if (qigStamps) {
					qigStamps.map((y: stampData) => {
						let stamps = availableStampsForQIG.filter((x: stampData) => (x.stampId === y.stampId));
						if (stamps.count() === 0) {
							availableStampsForQIG = availableStampsForQIG.push(y);
						}
					});
				}
			});
		} else {
			if (this._availableStampDetailsAgainstAllQIGs.count() > 0) {
				availableStampsForQIG = this._availableStampDetailsAgainstAllQIGs.get
					(this._viaAwarding ? awardingStore.instance.selectedSession.markSchemeGroupId
						: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
			}
		}
		return availableStampsForQIG;
	}

    /**
     * Get the stamps available for current QIG
     */
    public stampsAgainstCurrentQig(isWholeResponse: boolean) {
        return this.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, isWholeResponse);
    }

    /**
     * This will returns the stampIds for selected QIG.
     */
	public get stampIdsForSelectedQIG() {
		let msgId = this._viaAwarding ? awardingStore.instance.selectedSession.markSchemeGroupId :
			qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
		let stampIdList = this._availableStampIdsAgainstMarkSchemeGroupId.
			get(msgId);

		return stampIdList ? stampIdList : Immutable.List<number>();
	}

    /**
     * This will returns stamp Id For Selected QIG In Awarding.
     */
	public stampIdForSelectedQIGInAwarding(msgId: number) {
		let stampIdList = this._availableStampIdsAgainstMarkSchemeGroupId.
			get(msgId);

        return stampIdList ? stampIdList : Immutable.List<number>();
	}

    /**
     * This will return true, if dynamic annotaion is active(moving).
     */
    public get isDynamicAnnotationActive() {
        return this._isDynamicAnnotationMovingInScript;
    }

    /**
     * This will update the visibility flag for enhanced and offpage comment.
     */
    public updateOffpageVisibility(markSchemeGroupId: number) {
        // get available stamps for selected QIG , in case of whole response.
        let availableStampsForQIG = this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId);
        this._isEnhancedOffPageCommentConfiguredForQIG = false;
        this._isOffPageCommentVisible = false;
        // Handle visibility of 'off page comment' and 'enhanced off page comment'
        if (availableStampsForQIG) {
            availableStampsForQIG.map((item: stampData) => {
                if (item.stampId === constants.OFF_PAGE_COMMENT_STAMP_ID) {
                    this._isOffPageCommentVisible = true;
                    this._isOffPageCommentConfiguredForQIG = true;
                    return;
                }
                if (item.stampId === constants.ENHANCED_OFFPAGE_COMMENT_ID) {
                    this._isEnhancedOffPageCommentConfiguredForQIG = true;
                }
            });
        }
    }

    /**
     * Returns the list of stamps configured against the Qig, removes the favorite stamps from the list if any.
     */
    public stampsAgainstQig(markSchemeGroupId: number, isWholeResponse: boolean) {
        markSchemeGroupId = markSchemeGroupId ? markSchemeGroupId : qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        // get available stamps for selected QIG , in case of whole response.
        let availableStampsForQIG = this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId);

        // WE HAVE NOT WRITTEN ANY DATA SERVICE CALL TO FETCH STAMP DATA IN STANDARDISATION SETUP
        // SO ADDED A CONDTION NOT TO CHECK THE AVAILABLE STAMPS IF THERE ARE NONE
        // TO BE REMOVED ONCE THE CALL HAS BEEN ADDED
        if (availableStampsForQIG) {
        // avoid stamps which are not needed to display in stamp panel.
        availableStampsForQIG = availableStampsForQIG.filter((stamp: stampData) => {
            return stamp.stampId !== constants.ENHANCED_OFFPAGE_COMMENT_ID
                && stamp.stampId !== constants.OFF_PAGE_COMMENT_STAMP_ID
                && this.stampIdsForQIG(markSchemeGroupId).contains(stamp.stampId);
        }) as Immutable.List<stampData>;

        availableStampsForQIG.map((item: stampData) => {
            if (item.stampId === enums.DynamicAnnotation.Highlighter) {
                item.color = !this._viaAwarding ?  this.getStampColor(item.stampId) : '' ;
            }
        });

        // Exclude stamps from the favourite panel which are not configured against the selected QIG, while auto populating
        if (this._favoriteStamps.count() > 0) {
            this._favoriteStamps = this._favoriteStamps.filter((stampId: number) => {
                return this.stampIdsForQIG(markSchemeGroupId).contains(stampId);
            }) as Immutable.List<number>;
        }

        // Excluding the stamps in favorite panel
        if (this._favoriteStamps.count() > 0) {
            let favoriteStampIds = [];

            this._favoriteStamps.forEach((stampId: number) => {
                favoriteStampIds.push(stampId);
            });

            let favoriteStampIdsList = Immutable.List<number>(favoriteStampIds);

            availableStampsForQIG = availableStampsForQIG.filter((stamp: stampData) => {
                return !favoriteStampIdsList.contains(stamp.stampId);
            }) as Immutable.List<stampData>;
        }
    }

        return availableStampsForQIG;
    }

    /**
     * This will return the stamps grouped by stamp type
     */
    public getStampsGroupedByStampType() {
        return groupHelper.group(this._stampsAgainstAllQIGs, grouperList.StampsGrouper, enums.GroupByField.stampType);
    }

    /**
     * This will return a particular stamp taking in Stamp Id as the parameter
     * @param stampId
     */
    public getStamp(stampId: number, markSchemeGroupID?: number): stampData {
        if (stampId === 0) {
            return undefined;
        }

        if (stampId === constants.LINK_ANNOTATION) {
            return this.getLinkStampData();
        }

        if (this._stampsAgainstAllQIGs) {
            let stamp: stampData = null;
            let stampAgainstMarkSchemeGroupId: stampData = null;
            if (markSchemeGroupID) {
                this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupID).map((newStamp: stampData) => {
                    if (newStamp.stampId === stampId) {
                        stampAgainstMarkSchemeGroupId = newStamp;
                    }
                });
            } else {
               stamp = this._stampsAgainstAllQIGs.filter((stamp: stampData) => stamp.stampId === stampId).first();
            }
            if ((stamp != null && stamp !== undefined) || stampAgainstMarkSchemeGroupId != null) {
                return markSchemeGroupID ? stampAgainstMarkSchemeGroupId : stamp;
            }
        }

        return undefined;
    }

    /**
     * return stamp data for link
     */
    private getLinkStampData(): stampData {
        let stamp: stampData = {
            stampId: constants.LINK_ANNOTATION,
            stampType: enums.StampType.dynamic,
            numericValue: null,
            name: 'Link',
            displayName: 'Link',
            svgImage: '',
            addedBySystem: false
        };
        return stamp;
    }

    /**
     * Get favorite stamps
     */
    public getFavoriteStamps(): Immutable.List<stampData> {
        let favoriteStampsList = [];
        let markSchemeGroupId: number = markingStore.instance.selectedQIGMarkSchemeGroupId;

        // Previously "stampsAgainstAllQIGs" collection is used which contain stamps
        // configured against all qigs under one question paper.
        this._favoriteStamps.map((stampId: number) => {
            if (this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId)) {
            this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId).map((stamp: stampData) => {
                if (stamp.stampId === stampId) {
                    stamp.color =  !this._viaAwarding ?  this.getStampColor(stamp.stampId) : '';
                    favoriteStampsList.push(stamp);
                }
            });
        }
        });
        return Immutable.List<stampData>(favoriteStampsList);
    }

    /**
     * This will return a comma seperated favorite stampId collection to save in user options.
     * @returns
     */
    public get favouriteStampsToSave(): string {
        if (this._favoriteStamps.count() > 0) {
            return this._favoriteStamps.toArray().toString();
        }

        return '';
    }

    /**
     * This will returns the current stamp banner type
     */
    public get currentStampBannerType(): enums.BannerType {
        return this._stampBannerType;
    }

    /**
     * This method will update the stamp list and stampId list against each qig which is stored in two collections.
     * If new stamps are added or removed then we just update these collections. During the db call, we will
     * load and update the modified stamps only rest of the stamps will be stored in this collection.if all it's relevant
     * stamps are already stored in the memory, then no need to retrieve those stamps back again as part of the stamps retrieval
     * DB call from the newly selected QIG
     */
    private addStampItems(stampList: stampList) {
        if (stampList) {
            stampList.stampDataAgainstQig.forEach((item: stampDataAgainstQig) => {
                if (item.stamps != null) {
                    let availableStamps = this._availableStampDetailsAgainstAllQIGs.
						get(item.markSchemeGroupId);

                    let availableStampList: Array<stampData> = availableStamps ? availableStamps.toArray() : new Array<stampData>();
                    item.stamps.map((stampItem: stampData) => {
                        // check if stamp is already added to available stamp list, if its added we need to splice from current
                        // list and add as new entry as we may have scenarios where same stamp can have diff numerical value in multi qig
                        let duplicateStamps = availableStampList.filter(x => x.stampId === stampItem.stampId);
                        if (duplicateStamps.length > 0) {
                            // remove duplicate entry from biltering stamp collection with current item stampId
                            availableStampList = availableStampList.filter(x => x.stampId !== stampItem.stampId);
                        }
                        stampItem.color = !this._viaAwarding ? this.getStampColor(stampItem.stampId, item.markSchemeGroupId) : '';
                        availableStampList.push(stampItem);
                    });

                    // filtered stamps based on  the available stampIds against markscheme group id
                    // remove the deleted stamp (AI) from collection.
                    let filteredStamps = availableStampList.filter((stamp: stampData) => {
						return this.stampIdsForSelectedQIG.contains(stamp.stampId);
                    });

                    this._availableStampDetailsAgainstAllQIGs = this._availableStampDetailsAgainstAllQIGs.
                        set(item.markSchemeGroupId, Immutable.List<stampData>(availableStampList));
                }
            });

            stampList.stampDataAgainstQig.forEach((item: stampDataAgainstQig) => {
                this._availableStampIdsAgainstMarkSchemeGroupId = this._availableStampIdsAgainstMarkSchemeGroupId.
                    set(item.markSchemeGroupId, item.markSchemGroupStampIds);
            });

			// Check the seen stamp exists in the collection.
			this._isSeenStampConfiguredForQIG = this.stampIdsForSelectedQIG.indexOf(constants.SEEN_STAMP_ID) > -1;
            // Check enhanced off-page comments stamp is exists in the collection
            this._isEnhancedOffPageCommentConfiguredForQIG =
				this.stampIdsForSelectedQIG.indexOf(constants.ENHANCED_OFFPAGE_COMMENT_ID) > -1;
            //Check off page comments stamp is configured for QIG
            this._isOffPageCommentConfiguredForQIG = this._isOffPageCommentVisible =
				this.stampIdsForSelectedQIG.indexOf(constants.OFF_PAGE_COMMENT_STAMP_ID) > -1;
        }

        // Ideally here we should assign the value retrieved from Api.
        this._favoriteStamps = Immutable.List<number>();
        this._stampsAgainstAllQIGs = this.stampsAgainstAllQIGs;
    }

    /**
     * This will return the highlighter stamp color already stored in useroption.
     * @param stampid
     */
	private getStampColor(stampid: number, markSchemeGroupId: number = 0): string {
		let stampColor: string = '';

		switch (stampid) {
			case enums.DynamicAnnotation.Highlighter:
                stampColor = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR,
                    qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
				break;
			case enums.DynamicAnnotation.HorizontalLine:
				break;
		}
		return stampColor;
	}

    /**
     * Add stamp to favorite collection when user drags annotation from expanded toolbar to favorite toolbar
     * @param favoriteStampId
     */
    private addStampToFavorite(favoriteStampId: number) {
        if (favoriteStampId !== undefined) {
            let stamps = this._favoriteStamps !== undefined ? this._favoriteStamps.toArray() : [];

            // If we have already added the stamp to the favorite collection, no need to add again.
            if (stamps.indexOf(favoriteStampId) === -1) {
                stamps.push(favoriteStampId);
            }

            this._favoriteStamps = Immutable.List(stamps);
        }
    }

    /**
     * Remove stamp from favorite collection when user drags annotation from favorite toolbar to expanded toolbar
     * @param favoriteStampId
     */
    private removeStampFromFavorite(favoriteStampId: number) {
        if (favoriteStampId !== undefined) {
            let indexOfStampToRemove = this._favoriteStamps.indexOf(favoriteStampId);

            if (indexOfStampToRemove !== -1) {
                this._favoriteStamps = this._favoriteStamps.remove(indexOfStampToRemove);
            }
        }
    }

    /**
     * Add stamp to favorite from user option
     * @param favoriteStampIdList
     */
    private addStampToFavoriteFromUserOption(favoriteStampIdList: Immutable.List<number>) {
        this._favoriteStamps = favoriteStampIdList;
    }

    /**
     * Insert stamp to favorites
     * @param favoriteStampId
     * @param insertedOverStampId
     */
    private insertStampToFavorite(favoriteStampId: number, insertedOverStampId: number) {

        // Take the index of both stamp to add and the inserted index.
        let indexOfFavoriteStamp = this._favoriteStamps.indexOf(favoriteStampId);
        let indexOfInsertedlocation = this._favoriteStamps.indexOf(insertedOverStampId);

        // If the stamp to add already exist delete it before inserting it to the location.
        if (indexOfFavoriteStamp > -1) {
            this._favoriteStamps = this._favoriteStamps.remove(indexOfFavoriteStamp);
        }

        // Finally insert the favorite stamp into the correct location.
        this._favoriteStamps = this._favoriteStamps.splice(indexOfInsertedlocation, 0, favoriteStampId).toList();
    }

    /**
     * check whether the favourite toolbar is empty or not
     */
    public get isFavouriteToolbarEmpty() {
        // To DO: check for invalid stamps
        let favouriteStampCount = this.getFavoriteStamps().count();
        return favouriteStampCount > 0 ? false : true;
    }

    /**
     * Get the value indicating whether the Seen stamp is configured or not
     */
    public get IsSeenStampConfiguredForQIG() {
        return this._isSeenStampConfiguredForQIG;
    }

    /**
     * Selected client token for ON PAGE COMMENT Mode
     * @returns currently selected ON PAGE COMMENT clientToken
     */
    public get SelectedOnPageCommentClientToken(): string {
        return this._selectedOnpageCommentClientToken;
    }

    /**
     * Selected annotation in Comments SIDE VIEW
     * @returns selected annotation client token
     */
    public get SelectedSideViewCommentToken(): string {
        return this._selectedSideViewCommentToken;
    }

    /**
     * whether the comment annotation is draging/pan
     */
    public get commentIsOnMove(): boolean {
        return this._commentIsOnMove;
    }

    /**
     * returns whether the side view comment is enabled or not
     */
    public get isSideViewCommentEnabled(): boolean {
        return this._isSideViewCommentEnabled;
    }

    /**
     * The clinet token of comment which is moving
     */
    public get movingCommentToken(): string {
        return this._movingCommentToken;
    }

    /**
     * Check whether the enhanced off-page comment configured for qig.
     * @readonly
     * @type {boolean}
     * @memberof StampStore
     */
    public get isEnhancedOffPageCommentConfiguredForQIG(): boolean {
        return this._isEnhancedOffPageCommentConfiguredForQIG;
    }

    /**
     * Check whether the off-page comment configured for qig.
     * @readonly
     * @type {boolean}
     * @memberof StampStore
     */
    public get isOffPageCommentConfiguredForQIG(): boolean {
        return this._isOffPageCommentConfiguredForQIG;
    }

	/**
	 * Check whether the off-page comment should be visible while qig selection(whole response).
	 */
    public get isOffPageCommentVisible(): boolean {
        return this._isOffPageCommentVisible;
    }
}

let instance = new StampStore();
export = { StampStore, instance };