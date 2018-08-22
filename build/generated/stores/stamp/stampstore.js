"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var actionType = require('../../actions/base/actiontypes');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var groupHelper = require('../../utility/grouping/grouphelper');
var grouperList = require('../../utility/grouping/groupingbase/grouperlist');
var userOptionsHelper = require('../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../utility/useroption/useroptionkeys');
var qigStore = require('../qigselector/qigstore');
var constants = require('../../components/utility/constants');
var markingStore = require('../marking/markingstore');
/**
 * Class for Stamp store
 */
var StampStore = (function (_super) {
    __extends(StampStore, _super);
    /**
     * @Constructor
     */
    function StampStore() {
        var _this = this;
        _super.call(this);
        this._stampBannerType = undefined;
        this._isDynamicAnnotationMovingInScript = false;
        this._commentIsOnMove = false;
        this._favoriteStamps = Immutable.List();
        this._availableStampIdsAgainstMarkSchemeGroupId = Immutable.Map();
        this._availableStampDetailsAgainstAllQIGs = Immutable.Map();
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.STAMPS_FETCH:
                    var actionResult = action;
                    if (actionResult.success) {
                        _this._stampItemAgainstEachQig = actionResult.stampList;
                        _this.addStampItems(actionResult.stampList);
                    }
                    _this.emit(StampStore.STAMPS_LOADED_EVENT);
                    break;
                case actionType.FAVORITE_STAMP_UPDATED:
                    var updateFavoriteStampCollectionAction_1 = action;
                    var favoriteStampId = updateFavoriteStampCollectionAction_1.getFavoriteStampId;
                    var favoriteStampActionType = updateFavoriteStampCollectionAction_1.getFavoriteStampActionType;
                    var favoriteStampIdList = updateFavoriteStampCollectionAction_1.getFavoriteStampListFromUserOption;
                    switch (favoriteStampActionType) {
                        case enums.FavoriteStampActionType.LoadFromUserOption:
                            _this.addStampToFavoriteFromUserOption(favoriteStampIdList);
                            break;
                        case enums.FavoriteStampActionType.Add:
                            _this.addStampToFavorite(favoriteStampId);
                            break;
                        case enums.FavoriteStampActionType.Remove:
                            _this.removeStampFromFavorite(favoriteStampId);
                            break;
                        case enums.FavoriteStampActionType.Insert:
                            _this.insertStampToFavorite(favoriteStampId, updateFavoriteStampCollectionAction_1.getInsertedOverStampId);
                            break;
                    }
                    _this.emit(StampStore.FAVORITE_STAMP_UPDATED, favoriteStampActionType);
                    break;
                case actionType.UPDATE_STAMP_BANNER_VISIBILITY:
                    var stampBannerActionResult = action;
                    _this._stampBannerType = stampBannerActionResult.stampBannerType;
                    _this.emit(StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED, _this.currentStampBannerType, stampBannerActionResult.isStampBannerVisible);
                    break;
                case actionType.RESPONSE_CLOSE:
                case actionType.OPEN_RESPONSE:
                    // resetting the current stamp banner type.
                    _this._stampBannerType = undefined;
                    break;
                case actionType.UPDATE_ANNOTATION_COLOR:
                    var _updateAnnotationColorAction = action;
                    _this.updateColor(_updateAnnotationColorAction.currentAnnotation);
                    _this.emit(StampStore.UPDATE_ANNOTATION_COLOR_STAMP);
                    break;
                case actionType.COMMENT_HOLDER_RENDERED_ACTION:
                    var _commentHolderData = action;
                    _this.emit(StampStore.COMMENT_HOLDER_RENDERED_EVENT, _commentHolderData.outputPageNo, _commentHolderData.minHeight);
                    break;
                case actionType.EDIT_ONPAGE_COMMENT:
                    var data = action;
                    // Holds a value indicating the current selected onpage comment client token
                    _this._selectedOnpageCommentClientToken =
                        _this._selectedSideViewCommentToken =
                            data.comment.clientToken;
                    // Open the on page comment box
                    _this.emit(StampStore.INVOKE_ONPAGE_COMMENT, data.comment, data.leftOffSet, data.topOffSet, data.qustionHierarhy, data.windowsWidth, data.overlayHeight, data.overlayWidth, data.wrapper, data.isCommentBoxReadOnly, data.isCommentBoxInActive);
                    break;
                case actionType.SHOW_OR_HIDE_ONPAGE_COMMENT:
                    var commentdata = action;
                    // If comment is closing then clear the selected onpage comment client token
                    // to allow open comment on stamping annotation.
                    if (!commentdata.isOpen) {
                        _this._selectedOnpageCommentClientToken = _this._selectedSideViewCommentToken = undefined;
                    }
                    _this.emit(StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, commentdata.isOpen, commentdata.isPanAvoidImageContainerRender);
                    break;
                case actionType.DELETE_COMMENT:
                    _this.emit(StampStore.DELETE_COMMENT);
                    break;
                case actionType.COMMENT_SIDE_VIEW_RENDER_ACTION:
                    var commentData = action;
                    if (commentData.isAnnotationMove === true) {
                        _this._movingCommentToken = commentData.clientToken;
                        _this.emit(StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT, commentData.stampX, commentData.stampY, commentData.clientToken, commentData.isInGreyARea);
                    }
                    else {
                        _this.emit(StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT);
                    }
                    break;
                case actionType.UPDATE_ANNOTATION:
                    _this._commentIsOnMove = false;
                    if (_this._selectedSideViewCommentToken !==
                        action.draggedAnnotationClientToken) {
                        _this._selectedSideViewCommentToken = undefined;
                    }
                    break;
                case actionType.SET_SELECTED_SIDE_VIEW_COMMENT_ACTION:
                    _this._selectedSideViewCommentToken = action.clientToken;
                    _this._selectedOnpageCommentClientToken = undefined;
                    // Rerender the comment container after setting the selected comment in side view
                    _this.emit(StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT);
                    break;
                case actionType.COMMENTS_SIDEVIEW_TOGGLE_ACTION:
                    var commentAction = action;
                    if (commentAction.enableSideView) {
                        _this._selectedOnpageCommentClientToken = undefined;
                        _this._selectedSideViewCommentToken = commentAction.currentCommentToken;
                    }
                    else {
                        _this._selectedSideViewCommentToken = undefined;
                    }
                    if (commentAction.disableSideViewOnDevices) {
                        _this.emit(StampStore.INVOKE_SHOW_OR_HIDE_COMMENT, false);
                    }
                    _this._isSideViewCommentEnabled = commentAction.enableSideView;
                    _this._disableSideViewOnDevices = commentAction.disableSideViewOnDevices;
                    _this.emit(StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT, commentAction.enableSideView, commentAction.disableSideViewOnDevices);
                    break;
                case actionType.UPDATE_COMMENT_LIST_IN_SIDE_VIEW:
                    _this.emit(StampStore.UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT);
                    break;
                case actionType.TOGGLE_COMMENT_LINES_VISIBILITY:
                    var toggleAction = action;
                    _this.emit(StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT, toggleAction.hideLines, toggleAction.hideBoxes);
                    break;
                case actionType.SWITCH_ZOOM_PREFERENCE:
                    var zoomAction = action;
                    _this.emit(StampStore.SWITCH_ZOOM_PREFERENCE_EVENT, zoomAction.zoomPreference);
                    break;
                case actionType.SET_COMMENT_VISIBILITY_ACTION:
                    // Hide/Show comment sideview.
                    var visibilityAction = action;
                    _this.emit(StampStore.COMMENT_VISIBILITY_CHANGED_EVENT, visibilityAction.isvisible);
                    break;
                case actionType.DYNAMIC_ANNOTATION_DRAGGING:
                    var dynamicAnnotationMoveAction_1 = action;
                    _this._isDynamicAnnotationMovingInScript = dynamicAnnotationMoveAction_1.isAnnotationActive;
                    break;
                // Removing comment tokens while deleting comments as part of defectfix #53424
                case actionType.REMOVE_ANNOTATION:
                    _this._selectedSideViewCommentToken = _this._selectedOnpageCommentClientToken = undefined;
                    break;
                case actionType.CREATE_SUPERVISOR_REMARK_ACTION:
                    var isMarkNowButtonClicked = action.isMarkNowButtonClicked();
                    if (isMarkNowButtonClicked) {
                        // resetting the current stamp banner type.
                        _this._stampBannerType = undefined;
                    }
                    break;
                case actionType.UPDATE_OFFPAGE_VISIBILITY_STATUS_ACTION:
                    _this.updateOffpageVisibility(markingStore.instance.selectedQIGMarkSchemeGroupId);
                    _this.emit(StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT);
                    break;
                case actionType.SET_MARKENTRY_TEXTBOX_FOCUS_ACTION:
                    _this.emit(StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT);
                    break;
                case actionType.RESET_STAMP_BANNER_TYPE_ACTION:
                    // resetting the current stamp banner type.
                    _this._stampBannerType = undefined;
                    break;
            }
        });
    }
    /**
     * This method will return whether the stamp panel is expanded/collapsed
     */
    StampStore.prototype.updateColor = function (annotation) {
        switch (annotation.stamp) {
            case enums.DynamicAnnotation.Highlighter:
                if (this._stampsAgainstAllQIGs) {
                    this._stampsAgainstAllQIGs.map(function (stamp) {
                        if (stamp.stampId === enums.DynamicAnnotation.Highlighter) {
                            // Change the highlighter color in toolbar.
                            stamp.color = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                        }
                    });
                }
                break;
            case enums.DynamicAnnotation.HorizontalLine:
                break;
        }
    };
    /**
     * This will returns the stampIds for selected QIG.
     */
    StampStore.prototype.stampIdsForQIG = function (markSchemeGroupId) {
        var stampIdList = this._availableStampIdsAgainstMarkSchemeGroupId.get(markSchemeGroupId);
        return stampIdList ? stampIdList : Immutable.List();
    };
    Object.defineProperty(StampStore.prototype, "stampsAgainstAllQIGs", {
        /**
         * This will return the stamps against all QIGs in case of whole response
         */
        get: function () {
            var markSchemeGroupIds = [];
            var availableStampsForQIG = Immutable.List();
            var relatedQigList = qigStore.instance.relatedQigList;
            // Get markSchemeGroupId(s) of the currently opened component
            if (relatedQigList) {
                relatedQigList.map(function (value, key) {
                    markSchemeGroupIds.push(value.markSchemeGroupId);
                });
            }
            // Filter stamps for the currently opened component
            if (markSchemeGroupIds !== undefined && markSchemeGroupIds.length > 0) {
                var that_1 = this;
                markSchemeGroupIds.map(function (markSchemeGroupId) {
                    var qigStamps = that_1._availableStampDetailsAgainstAllQIGs.get(+markSchemeGroupId);
                    if (qigStamps) {
                        qigStamps.map(function (y) {
                            var stamps = availableStampsForQIG.filter(function (x) { return (x.stampId === y.stampId); });
                            if (stamps.count() === 0) {
                                availableStampsForQIG = availableStampsForQIG.push(y);
                            }
                        });
                    }
                });
            }
            else {
                if (this._availableStampDetailsAgainstAllQIGs.count() > 0) {
                    availableStampsForQIG = this._availableStampDetailsAgainstAllQIGs.get(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
                }
            }
            return availableStampsForQIG;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the stamps available for current QIG
     */
    StampStore.prototype.stampsAgainstCurrentQig = function (isWholeResponse) {
        return this.stampsAgainstQig(markingStore.instance.selectedQIGMarkSchemeGroupId, isWholeResponse);
    };
    Object.defineProperty(StampStore.prototype, "stampIdsForSelectedQIG", {
        /**
         * This will returns the stampIds for selected QIG.
         */
        get: function () {
            var stampIdList = this._availableStampIdsAgainstMarkSchemeGroupId.
                get(qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId);
            return stampIdList ? stampIdList : Immutable.List();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "isDynamicAnnotationActive", {
        /**
         * This will return true, if dynamic annotaion is active(moving).
         */
        get: function () {
            return this._isDynamicAnnotationMovingInScript;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This will update the visibility flag for enhanced and offpage comment.
     */
    StampStore.prototype.updateOffpageVisibility = function (markSchemeGroupId) {
        var _this = this;
        // get available stamps for selected QIG , in case of whole response.
        var availableStampsForQIG = this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId);
        this._isEnhancedOffPageCommentConfiguredForQIG = false;
        this._isOffPageCommentVisible = false;
        // Handle visibility of 'off page comment' and 'enhanced off page comment'
        if (availableStampsForQIG) {
            availableStampsForQIG.map(function (item) {
                if (item.stampId === constants.OFF_PAGE_COMMENT_STAMP_ID) {
                    _this._isOffPageCommentVisible = true;
                    _this._isOffPageCommentConfiguredForQIG = true;
                    return;
                }
                if (item.stampId === constants.ENHANCED_OFFPAGE_COMMENT_ID) {
                    _this._isEnhancedOffPageCommentConfiguredForQIG = true;
                }
            });
        }
    };
    /**
     * Returns the list of stamps configured against the Qig, removes the favorite stamps from the list if any.
     */
    StampStore.prototype.stampsAgainstQig = function (markSchemeGroupId, isWholeResponse) {
        var _this = this;
        markSchemeGroupId = markSchemeGroupId ? markSchemeGroupId : qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        // get available stamps for selected QIG , in case of whole response.
        var availableStampsForQIG = this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId);
        // WE HAVE NOT WRITTEN ANY DATA SERVICE CALL TO FETCH STAMP DATA IN STANDARDISATION SETUP
        // SO ADDED A CONDTION NOT TO CHECK THE AVAILABLE STAMPS IF THERE ARE NONE
        // TO BE REMOVED ONCE THE CALL HAS BEEN ADDED
        if (availableStampsForQIG) {
            // avoid stamps which are not needed to display in stamp panel.
            availableStampsForQIG = availableStampsForQIG.filter(function (stamp) {
                return stamp.stampId !== constants.ENHANCED_OFFPAGE_COMMENT_ID
                    && stamp.stampId !== constants.OFF_PAGE_COMMENT_STAMP_ID
                    && _this.stampIdsForQIG(markSchemeGroupId).contains(stamp.stampId);
            });
            availableStampsForQIG.map(function (item) {
                if (item.stampId === enums.DynamicAnnotation.Highlighter) {
                    item.color = _this.getStampColor(item.stampId);
                }
            });
            // Exclude stamps from the favourite panel which are not configured against the selected QIG, while auto populating
            if (this._favoriteStamps.count() > 0) {
                this._favoriteStamps = this._favoriteStamps.filter(function (stampId) {
                    return _this.stampIdsForQIG(markSchemeGroupId).contains(stampId);
                });
            }
            // Excluding the stamps in favorite panel
            if (this._favoriteStamps.count() > 0) {
                var favoriteStampIds_1 = [];
                this._favoriteStamps.forEach(function (stampId) {
                    favoriteStampIds_1.push(stampId);
                });
                var favoriteStampIdsList_1 = Immutable.List(favoriteStampIds_1);
                availableStampsForQIG = availableStampsForQIG.filter(function (stamp) {
                    return !favoriteStampIdsList_1.contains(stamp.stampId);
                });
            }
        }
        return availableStampsForQIG;
    };
    /**
     * This will return the stamps grouped by stamp type
     */
    StampStore.prototype.getStampsGroupedByStampType = function () {
        return groupHelper.group(this._stampsAgainstAllQIGs, grouperList.StampsGrouper, enums.GroupByField.stampType);
    };
    /**
     * This will return a particular stamp taking in Stamp Id as the parameter
     * @param stampId
     */
    StampStore.prototype.getStamp = function (stampId, markSchemeGroupID) {
        if (stampId === 0) {
            return undefined;
        }
        if (stampId === constants.LINK_ANNOTATION) {
            return this.getLinkStampData();
        }
        if (this._stampsAgainstAllQIGs) {
            var stamp = null;
            var stampAgainstMarkSchemeGroupId_1 = null;
            if (markSchemeGroupID) {
                this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupID).map(function (newStamp) {
                    if (newStamp.stampId === stampId) {
                        stampAgainstMarkSchemeGroupId_1 = newStamp;
                    }
                });
            }
            else {
                stamp = this._stampsAgainstAllQIGs.filter(function (stamp) { return stamp.stampId === stampId; }).first();
            }
            if ((stamp != null && stamp !== undefined) || stampAgainstMarkSchemeGroupId_1 != null) {
                return markSchemeGroupID ? stampAgainstMarkSchemeGroupId_1 : stamp;
            }
        }
        return undefined;
    };
    /**
     * return stamp data for link
     */
    StampStore.prototype.getLinkStampData = function () {
        var stamp = {
            stampId: constants.LINK_ANNOTATION,
            stampType: enums.StampType.dynamic,
            numericValue: null,
            name: 'Link',
            displayName: 'Link',
            svgImage: '',
            addedBySystem: false
        };
        return stamp;
    };
    /**
     * Get favorite stamps
     */
    StampStore.prototype.getFavoriteStamps = function () {
        var _this = this;
        var favoriteStampsList = [];
        var markSchemeGroupId = markingStore.instance.selectedQIGMarkSchemeGroupId;
        // Previously "stampsAgainstAllQIGs" collection is used which contain stamps
        // configured against all qigs under one question paper.
        this._favoriteStamps.map(function (stampId) {
            if (_this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId)) {
                _this._availableStampDetailsAgainstAllQIGs.get(markSchemeGroupId).map(function (stamp) {
                    if (stamp.stampId === stampId) {
                        stamp.color = _this.getStampColor(stamp.stampId);
                        favoriteStampsList.push(stamp);
                    }
                });
            }
        });
        return Immutable.List(favoriteStampsList);
    };
    Object.defineProperty(StampStore.prototype, "favouriteStampsToSave", {
        /**
         * This will return a comma seperated favorite stampId collection to save in user options.
         * @returns
         */
        get: function () {
            if (this._favoriteStamps.count() > 0) {
                return this._favoriteStamps.toArray().toString();
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "currentStampBannerType", {
        /**
         * This will returns the current stamp banner type
         */
        get: function () {
            return this._stampBannerType;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will update the stamp list and stampId list against each qig which is stored in two collections.
     * If new stamps are added or removed then we just update these collections. During the db call, we will
     * load and update the modified stamps only rest of the stamps will be stored in this collection.if all it's relevant
     * stamps are already stored in the memory, then no need to retrieve those stamps back again as part of the stamps retrieval
     * DB call from the newly selected QIG
     */
    StampStore.prototype.addStampItems = function (stampList) {
        var _this = this;
        if (stampList) {
            stampList.stampDataAgainstQig.forEach(function (item) {
                if (item.stamps != null) {
                    var availableStamps = _this._availableStampDetailsAgainstAllQIGs.
                        get(item.markSchemeGroupId);
                    var availableStampList_1 = availableStamps ? availableStamps.toArray() : new Array();
                    item.stamps.map(function (stampItem) {
                        stampItem.color = _this.getStampColor(stampItem.stampId);
                        availableStampList_1.push(stampItem);
                    });
                    // filtered stamps based on  the available stampIds against markscheme group id
                    // remove the deleted stamp (AI) from collection.
                    var filteredStamps = availableStampList_1.filter(function (stamp) {
                        return _this.stampIdsForSelectedQIG.contains(stamp.stampId);
                    });
                    _this._availableStampDetailsAgainstAllQIGs = _this._availableStampDetailsAgainstAllQIGs.
                        set(item.markSchemeGroupId, Immutable.List(availableStampList_1));
                }
            });
            stampList.stampDataAgainstQig.forEach(function (item) {
                _this._availableStampIdsAgainstMarkSchemeGroupId = _this._availableStampIdsAgainstMarkSchemeGroupId.
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
        this._favoriteStamps = Immutable.List();
        this._stampsAgainstAllQIGs = this.stampsAgainstAllQIGs;
    };
    /**
     * This will return the highlighter stamp color already stored in useroption.
     * @param stampid
     */
    StampStore.prototype.getStampColor = function (stampid) {
        var stampColor = '';
        switch (stampid) {
            case enums.DynamicAnnotation.Highlighter:
                stampColor = userOptionsHelper.getUserOptionByName(userOptionKeys.HIGHTLIGHTER_COLOR, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId);
                break;
            case enums.DynamicAnnotation.HorizontalLine:
                break;
        }
        return stampColor;
    };
    /**
     * Add stamp to favorite collection when user drags annotation from expanded toolbar to favorite toolbar
     * @param favoriteStampId
     */
    StampStore.prototype.addStampToFavorite = function (favoriteStampId) {
        if (favoriteStampId !== undefined) {
            var stamps = this._favoriteStamps !== undefined ? this._favoriteStamps.toArray() : [];
            // If we have already added the stamp to the favorite collection, no need to add again.
            if (stamps.indexOf(favoriteStampId) === -1) {
                stamps.push(favoriteStampId);
            }
            this._favoriteStamps = Immutable.List(stamps);
        }
    };
    /**
     * Remove stamp from favorite collection when user drags annotation from favorite toolbar to expanded toolbar
     * @param favoriteStampId
     */
    StampStore.prototype.removeStampFromFavorite = function (favoriteStampId) {
        if (favoriteStampId !== undefined) {
            var indexOfStampToRemove = this._favoriteStamps.indexOf(favoriteStampId);
            if (indexOfStampToRemove !== -1) {
                this._favoriteStamps = this._favoriteStamps.remove(indexOfStampToRemove);
            }
        }
    };
    /**
     * Add stamp to favorite from user option
     * @param favoriteStampIdList
     */
    StampStore.prototype.addStampToFavoriteFromUserOption = function (favoriteStampIdList) {
        this._favoriteStamps = favoriteStampIdList;
    };
    /**
     * Insert stamp to favorites
     * @param favoriteStampId
     * @param insertedOverStampId
     */
    StampStore.prototype.insertStampToFavorite = function (favoriteStampId, insertedOverStampId) {
        // Take the index of both stamp to add and the inserted index.
        var indexOfFavoriteStamp = this._favoriteStamps.indexOf(favoriteStampId);
        var indexOfInsertedlocation = this._favoriteStamps.indexOf(insertedOverStampId);
        // If the stamp to add already exist delete it before inserting it to the location.
        if (indexOfFavoriteStamp > -1) {
            this._favoriteStamps = this._favoriteStamps.remove(indexOfFavoriteStamp);
        }
        // Finally insert the favorite stamp into the correct location.
        this._favoriteStamps = this._favoriteStamps.splice(indexOfInsertedlocation, 0, favoriteStampId).toList();
    };
    Object.defineProperty(StampStore.prototype, "isFavouriteToolbarEmpty", {
        /**
         * check whether the favourite toolbar is empty or not
         */
        get: function () {
            // To DO: check for invalid stamps
            var favouriteStampCount = this.getFavoriteStamps().count();
            return favouriteStampCount > 0 ? false : true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "IsSeenStampConfiguredForQIG", {
        /**
         * Get the value indicating whether the Seen stamp is configured or not
         */
        get: function () {
            return this._isSeenStampConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "SelectedOnPageCommentClientToken", {
        /**
         * Selected client token for ON PAGE COMMENT Mode
         * @returns currently selected ON PAGE COMMENT clientToken
         */
        get: function () {
            return this._selectedOnpageCommentClientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "SelectedSideViewCommentToken", {
        /**
         * Selected annotation in Comments SIDE VIEW
         * @returns selected annotation client token
         */
        get: function () {
            return this._selectedSideViewCommentToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "commentIsOnMove", {
        /**
         * whether the comment annotation is draging/pan
         */
        get: function () {
            return this._commentIsOnMove;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "isSideViewCommentEnabled", {
        /**
         * returns whether the side view comment is enabled or not
         */
        get: function () {
            return this._isSideViewCommentEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "movingCommentToken", {
        /**
         * The clinet token of comment which is moving
         */
        get: function () {
            return this._movingCommentToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "isEnhancedOffPageCommentConfiguredForQIG", {
        /**
         * Check whether the enhanced off-page comment configured for qig.
         * @readonly
         * @type {boolean}
         * @memberof StampStore
         */
        get: function () {
            return this._isEnhancedOffPageCommentConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "isOffPageCommentConfiguredForQIG", {
        /**
         * Check whether the off-page comment configured for qig.
         * @readonly
         * @type {boolean}
         * @memberof StampStore
         */
        get: function () {
            return this._isOffPageCommentConfiguredForQIG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StampStore.prototype, "isOffPageCommentVisible", {
        /**
         * Check whether the off-page comment should be visible while qig selection(whole response).
         */
        get: function () {
            return this._isOffPageCommentVisible;
        },
        enumerable: true,
        configurable: true
    });
    // stamps loaded event name.
    StampStore.STAMPS_LOADED_EVENT = 'StampsLoadedEvent';
    StampStore.FAVORITE_STAMP_UPDATED = 'FavoriteStampUpdatedEvent';
    StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED = 'StampBannerVisibilityModeChanged';
    /* For emiting the event while changing the color*/
    StampStore.UPDATE_ANNOTATION_COLOR_STAMP = 'UpdateAnnotation';
    /* Emit the event to open the onpage comment edit box. */
    StampStore.INVOKE_ONPAGE_COMMENT = 'InvokingOnPageComment';
    /* Emit the event to show or hide comment edit box. */
    StampStore.INVOKE_SHOW_OR_HIDE_COMMENT = 'InvokeShowOrHideComment';
    StampStore.DELETE_COMMENT = 'DeleteComment';
    StampStore.COMMENT_SIDE_VIEW_RENDER_EVENT = 'CommentSideViewRenderEvent';
    StampStore.COMMENTS_SIDEVIEW_TOGGLE_EVENT = 'OnPageCommentsSideViewToggle';
    StampStore.COMMENT_SIDE_VIEW_RENDER_ON_ANNOTATION_MOVE_EVENT = 'CommentSideViewRenderOnAnnotationMoveEvent';
    StampStore.COMMENT_HOLDER_RENDERED_EVENT = 'CommentHolderRenderedEvent';
    StampStore.COMMENT_SELECTED_SIDE_VIEW_EVENT = 'CommentSelectedInSideViewEvent';
    StampStore.UPDATE_COMMENT_LIST_IN_SIDE_VIEW_EVENT = 'UpdateCommentsListInSideViewEvent';
    StampStore.TOGGLE_COMMENT_LINES_VISIBILITY_EVENT = 'ToggleCommentLinesVisibilityEvent';
    StampStore.SWITCH_ZOOM_PREFERENCE_EVENT = 'switchZoomPreferenceEvent';
    StampStore.COMMENT_VISIBILITY_CHANGED_EVENT = 'commentVisibilityChangedEvent';
    StampStore.UPDATE_OFFPAGE_VISIBILITY_STATUS_EVENT = 'updateOffpageVisibilityStatusEvent';
    StampStore.SET_MARKENTRY_TEXTBOX_FOCUS_EVENT = 'setMarkentryTextboxFocusEvent';
    return StampStore;
}(storeBase));
var instance = new StampStore();
module.exports = { StampStore: StampStore, instance: instance };
//# sourceMappingURL=stampstore.js.map