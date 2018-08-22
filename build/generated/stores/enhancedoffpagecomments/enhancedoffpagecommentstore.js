"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var storeBase = require('../base/storebase');
var dispatcher = require('../../app/dispatcher');
var enums = require('../../components/utility/enums');
var actionType = require('../../actions/base/actiontypes');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
/**
 * Store class for Enhanced off-page comments
 *
 * @class EnhancedOffPageCommentsStore
 * @extends {storeBase}
 */
var EnhancedOffPageCommentStore = (function (_super) {
    __extends(EnhancedOffPageCommentStore, _super);
    /**
     * Creates an instance of EnhancedOffPageCommentsStore.
     * @memberof EnhancedOffPageCommentsStore
     */
    function EnhancedOffPageCommentStore() {
        var _this = this;
        _super.call(this);
        this._isEnhancedOffPageCommentsPanelVisible = true;
        this._sortDetails = Array();
        this._isEnhancedOffPageCommentEdited = false;
        this.selectedMarkGroupId = 0;
        this.selectedCommentIndex = 0;
        this.enhancedOffpageCommentHeaderStyle = null;
        this.markschemeColumnVisiblityChanged = false;
        this._isEnhancedOffPageCommentsHidden = false;
        this.dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY:
                    var commentsVisibilityAction = action;
                    _this._isEnhancedOffPageCommentEdited = false;
                    _this._isEnhancedOffPageCommentsPanelVisible = commentsVisibilityAction.isVisible;
                    _this.emit(EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, _this.isEnhancedOffPageCommentsPanelVisible, commentsVisibilityAction.markSchemeToNavigate);
                    break;
                case actionType.OPEN_RESPONSE:
                    var openAction = action;
                    // Fix for defect 57190
                    // When the response is opened with an exception or message panel in open state. 
                    // Then enhanced off page comments should be hidden
                    if (openAction.triggerPoint === enums.TriggerPoint.AssociatedDisplayIDFromMessage ||
                        openAction.triggerPoint === enums.TriggerPoint.WorkListResponseExceptionIcon ||
                        openAction.triggerPoint === enums.TriggerPoint.WorkListResponseMessageIcon) {
                        _this._isEnhancedOffPageCommentsHidden = true;
                    }
                    // sort details stored as map collection with markGroupId as key for future uses.
                    // clearing the current sort collection while opening a response.
                    _this._sortDetails = new Array();
                    // resetting _isEnhancedOffPageCommentsPanelVisible while navigating to next response
                    _this._isEnhancedOffPageCommentsPanelVisible = true;
                    _this._isEnhancedOffPageCommentEdited = false;
                    _this.selectedCommentIndex = 0;
                    _this.enhancedOffpageCommentHeaderStyle = null;
                    _this.remarkHeaderText = null;
                    _this.emit(EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT);
                    break;
                case actionType.ENHANCED_OFF_PAGE_COMMENT_SORT_ACTION:
                    var sortAction = action;
                    var sortItem = sortAction.sortDetails;
                    _this.updateEnhancedOffPageCommentSortCollection(sortItem.markGroupId, sortItem.comparerName, sortItem.sortDirection);
                    break;
                case actionType.MESSAGE_ACTION:
                case actionType.EXCEPTION_ACTION:
                    // When message or exception panel is closed or minimised. The enhanced off page comments should be shown again
                    if (_this._isEnhancedOffPageCommentsHidden) {
                        _this._isEnhancedOffPageCommentsHidden = false;
                        _this.emit(EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED, _this.isEnhancedOffPageCommentsPanelVisible);
                    }
                    break;
                case actionType.PANEL_HEIGHT:
                    var panelheightAction = action;
                    var panelHeight = panelheightAction.panelHeight;
                    _this.resizeClassName = panelheightAction.resizeClassName;
                    var elementOverlapped = panelheightAction.elementOverlapped;
                    var panActionType = panelheightAction.panActionType;
                    var resizepanelType = panelheightAction.resizePanelType;
                    _this.emit(EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT, panelHeight, _this.resizeClassName, elementOverlapped, panActionType, resizepanelType);
                    break;
                case actionType.PANEL_VISIBLITY_ACTION:
                    _this.emit(EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE);
                    break;
                case actionType.ENHANCED_OFF_PAGE_COMMENT_UPDATED_ACTION:
                    var commentUpdatedAction = action;
                    _this._isEnhancedOffPageCommentEdited = commentUpdatedAction.isEnhanedOffPageCommentEdited;
                    break;
                case actionType.SAVE_ENHANCED_OFFPAGE_COMMENTS_ACTION:
                    // We have to reset the edited variable when a save action is complete
                    _this._isEnhancedOffPageCommentEdited = false;
                    break;
                case actionType.ENHANCED_OFFPAGE_COMMENT_INDEX_UPDATE_ACTION:
                    var enhancedOffpageDataUpdateAction = action;
                    var index = enhancedOffpageDataUpdateAction.index;
                    _this.selectedCommentIndex = index;
                    _this.selectedMarkGroupId = enhancedOffpageDataUpdateAction.markGroupId;
                    _this.remarkHeaderText = enhancedOffpageDataUpdateAction.remarkHeaderText;
                    _this.enhancedOffpageCommentHeaderStyle = (index === 0) ? null : enhancedOffpageDataUpdateAction.style;
                    _this.emit(EnhancedOffPageCommentStore.UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA);
                    break;
                case actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION:
                    var _updateMarksAndAnnotationVisibilityAction = action;
                    var visiblityInfo = _updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails;
                    // reset selected comments to current marking comments.
                    _this.markschemeColumnVisiblityChanged = false;
                    if (!visiblityInfo.isMarkVisible && _this.selectedCommentIndex === _updateMarksAndAnnotationVisibilityAction.getIndex) {
                        _this.selectedCommentIndex = 0;
                        _this.enhancedOffpageCommentHeaderStyle = null;
                        _this.remarkHeaderText = null;
                        _this.markschemeColumnVisiblityChanged = true;
                        _this.emit(EnhancedOffPageCommentStore.UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE);
                    }
                    break;
                case actionType.SWITCH_ENHANCED_OFF_PAGE_COMMENTS:
                    var switchEnhancedOffPageCommentsAction_1 = action;
                    if (switchEnhancedOffPageCommentsAction_1.showDiscardPopup) {
                        _this.emit(EnhancedOffPageCommentStore.SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH);
                    }
                    else {
                        // We have to reset the edited variable when a save action is complete
                        _this._isEnhancedOffPageCommentEdited = false;
                        _this.emit(EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS);
                    }
                    break;
                case actionType.ENHANCED_OFF_PAGE_COMMENT_BUTTON_ACTION:
                    _this.emit(EnhancedOffPageCommentStore.ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT, action.EnhancedOffPageCommentButtonAction);
                    break;
            }
        });
    }
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "isEnhancedOffPageCommentsPanelVisible", {
        /**
         * Return whether enhanced off-page comments panel is visible or not
         *
         * @readonly
         * @memberof EnhancedOffPageCommentsStore
         */
        get: function () {
            return this._isEnhancedOffPageCommentsPanelVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "isEnhancedOffPageCommentsHidden", {
        /**
         * Returns whether enhanced off page comments panel is hidden or not
         * Enhanced off page comments panel is hidden when the response is opened from exception or message directly
         */
        get: function () {
            return this._isEnhancedOffPageCommentsHidden;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "sortDetails", {
        /**
         * This method will return the sort details
         */
        get: function () {
            return this._sortDetails;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the current sort details against selected response
     * @param {number} markGroupId
     * @returns {EnhancedOffPageCommentSortDetails}
     * @memberof EnhancedOffPageCommentStore
     */
    EnhancedOffPageCommentStore.prototype.markGroupSortDetails = function (markGroupId) {
        if (this.sortDetails && this.sortDetails.length > 0) {
            return this.sortDetails.filter(function (x) { return x.markGroupId === markGroupId; })[0];
        }
        else {
            var defaultSortValues = this.getDefaultSortDetails();
            var sortDetails = {
                markGroupId: markGroupId,
                comparerName: defaultSortValues.compareName,
                sortDirection: defaultSortValues.sortDirection,
            };
            return sortDetails;
        }
    };
    /**
     * This method will update the Enhanced off-page comment details
     *
     * @private
     * @param {number} markGroupId
     * @param {comparerList} [comparerName]
     * @param {enums.SortDirection} [sortDirection]
     * @memberof EnhancedOffPageCommentStore
     */
    EnhancedOffPageCommentStore.prototype.updateEnhancedOffPageCommentSortCollection = function (markGroupId, comparerName, sortDirection) {
        var entry = this.sortDetails.filter(function (x) { return x.markGroupId === markGroupId; });
        // if item is not present in sort collection then update the collection with default details
        if (entry.length === 0) {
            if (comparerName === undefined && sortDirection === undefined) {
                var defaultSortValues = this.getDefaultSortDetails();
                comparerName = defaultSortValues.compareName;
                sortDirection = defaultSortValues.sortDirection;
            }
            var sortDetails = {
                markGroupId: markGroupId,
                comparerName: comparerName,
                sortDirection: sortDirection,
            };
            this._sortDetails.push(sortDetails);
        }
        else if (comparerName !== undefined && sortDirection !== undefined) {
            this.sortDetails.filter(function (x) {
                return x.markGroupId === markGroupId;
            })[0].comparerName = comparerName;
            this.sortDetails.filter(function (x) {
                return x.markGroupId === markGroupId;
            })[0].sortDirection = sortDirection;
        }
    };
    /**
     * Get the default sort details for enhanced off-page comments
     *
     * @returns {defaultSort}
     * @memberof EnhancedOffPageCommentStore
     */
    EnhancedOffPageCommentStore.prototype.getDefaultSortDetails = function () {
        var comparerName = comparerList.ItemComparer;
        var sortDirection = enums.SortDirection.Ascending;
        return { compareName: comparerName, sortDirection: sortDirection };
    };
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "isEnhancedOffPageCommentEdited", {
        /**
         * Returns whether the enhanced off page comment is edited or not
         */
        get: function () {
            return this._isEnhancedOffPageCommentEdited;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "currentEnhancedOffpageCommentIndex", {
        /**
         * Returns current selected Enhanced offpage comment index.
         */
        get: function () {
            return this.selectedCommentIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "enhancedoffpageCommentHeaderColor", {
        /**
         * Returns Background color for enhanced offpage comment header based on Remark base color.
         * @readonly
         * @memberof EnhancedOffPageCommentStore
         */
        get: function () {
            return this.enhancedOffpageCommentHeaderStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "isMarkschemeColumnVisiblityChanged", {
        /**
         * Return true whether the visiblity is changed or not.
         * @readonly
         * @type {boolean}
         * @memberof EnhancedOffPageCommentStore
         */
        get: function () {
            return this.markschemeColumnVisiblityChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "commentHeaderText", {
        /**
         * Returns header text based on remarks.
         * @readonly
         * @type {string}
         * @memberof EnhancedOffPageCommentStore
         */
        get: function () {
            return this.remarkHeaderText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnhancedOffPageCommentStore.prototype, "isEnhancedOffpageCommentResizing", {
        /**
         * Gets whether enhanced offpage comment is resizing.
         */
        get: function () {
            return this.resizeClassName === 'resizing';
        },
        enumerable: true,
        configurable: true
    });
    EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED = 'EnhancedOffPageCommentsVisibilityChanged';
    EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT = 'OnResponseChangedEvent';
    EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT = 'PanelWidthEvent';
    EnhancedOffPageCommentStore.ENHANCED_OFFPAGE_COMMENT_RESIZE_CLASSNAME = 'EnhanceoffpageCommentResizeClassName';
    EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE = 'OnPanelVisiblityChange';
    EnhancedOffPageCommentStore.UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA = 'UpdateEnahncedOffpageCommentData';
    EnhancedOffPageCommentStore.UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE = 'UpdateEnhancedCommentOnVisiblityChange';
    // Event for displaying discard popup while switching between comments.
    EnhancedOffPageCommentStore.SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH = 'ShowDiscardPopupOnEnhancedOffPageCommentsSwitch';
    // Event for switching enhanced offpage comments from markscheme header dropdown
    EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS = 'SwitchEnhancedOffPageComments';
    // Enhanced offpage comment button action event
    EnhancedOffPageCommentStore.ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT = 'EnhancedOffPageCommentButtonActionEvent';
    return EnhancedOffPageCommentStore;
}(storeBase));
var instance = new EnhancedOffPageCommentStore();
module.exports = { EnhancedOffPageCommentStore: EnhancedOffPageCommentStore, instance: instance };
//# sourceMappingURL=enhancedoffpagecommentstore.js.map