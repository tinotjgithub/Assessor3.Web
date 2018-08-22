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
/**
 *  Class for Toolbar store
 */
var ToolbarStore = (function (_super) {
    __extends(ToolbarStore, _super);
    /**
     * Constructor for toolbar store
     */
    function ToolbarStore() {
        var _this = this;
        _super.call(this);
        this._isStampPanelExpanded = false;
        this._selectedStampId = 0;
        this._draggedStampId = 0;
        this._panStampId = 0;
        this._draggedAnnotationClientToken = undefined;
        this._isBookMarkSelected = false;
        this._isBookmarkTextboxOpen = false;
        this._isBookmarkPanelOpen = false;
        this._selectedAcetate = undefined;
        this._isMarkingOverlayVisible = false;
        this.dispatchToken = dispatcher.register(function (action) {
            if (action.actionType === actionType.STAMP_PANEL_MODE_CHANGED) {
                var panelAction = action;
                _this._isStampPanelExpanded = panelAction.isStampPanelExpanded;
                _this.emit(ToolbarStore.STAMP_PANEL_MODE_CHANGED);
            }
            else if (action.actionType === actionType.STAMP_SELECTED) {
                var stampSelectedAction = action;
                _this._selectedStampId = stampSelectedAction.isStampSelected ?
                    stampSelectedAction.selectedStampId : _this._selectedStampId === stampSelectedAction.selectedStampId ? 0 :
                    _this._selectedStampId;
                _this._isBookMarkSelected = _this.isBookMarkSelected ? !stampSelectedAction.isStampSelected : false;
                _this.emit(ToolbarStore.STAMP_SELECTED);
            }
            else if (action.actionType === actionType.RESPONSE_CLOSE) {
                var responseCloseAction_1 = action;
                _this._selectedStampId = responseCloseAction_1.getIsResponseClose ? 0 : _this._selectedStampId;
                _this._isStampPanelExpanded = responseCloseAction_1.getIsResponseClose ? false : _this._isStampPanelExpanded;
                _this._isBookMarkSelected = false;
            }
            else if (action.actionType === actionType.STAMP_DRAG) {
                var stampDragAction_1 = action;
                _this._draggedStampId = stampDragAction_1.isStampDragged ? stampDragAction_1.draggedStampId : 0;
                _this._isBookMarkSelected = false;
                _this.emit(ToolbarStore.STAMP_DRAGGED);
            }
            else if (action.actionType === actionType.STAMP_PAN) {
                var stampPanAction_1 = action;
                _this._panStampId = stampPanAction_1.panStampId;
                _this._draggedAnnotationClientToken = stampPanAction_1.draggedAnnotationClientToken;
                _this.emit(ToolbarStore.STAMP_PAN);
            }
            else if (action.actionType === actionType.PAN_END) {
                var panAction = action;
                var draggedAnnotationClientToken = _this._draggedAnnotationClientToken;
                _this._panSource = panAction.panSource;
                _this._panStampId = 0;
                _this._draggedAnnotationClientToken = undefined;
                _this.emit(ToolbarStore.PAN_END, panAction.elementId, panAction.xPos, panAction.yPos, panAction.panSource, panAction.stampId, draggedAnnotationClientToken, panAction.isAnnotationOverlapped, panAction.isAnnotationPlacedInGreyArea);
            }
            else if (action.actionType === actionType.PAN_STAMP_TO_DELETED_AREA) {
                var stampPanToDeleteAreaAction_1 = action;
                _this.emit(ToolbarStore.PAN_STAMP_TO_DELETION_AREA, stampPanToDeleteAreaAction_1.canDelete, stampPanToDeleteAreaAction_1.xPos, stampPanToDeleteAreaAction_1.yPos);
            }
            else if (action.actionType === actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION) {
                var marksAndAnnotationVisibilityAction = action;
                if (marksAndAnnotationVisibilityAction.getIndex === 0 &&
                    !marksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails.isAnnotationVisible) {
                    _this._selectedStampId = 0;
                    _this.emit(ToolbarStore.STAMP_DESELECTED);
                }
            }
            else if (action.actionType === actionType.HIDE_ZOOM_PANEL) {
                _this.emit(ToolbarStore.HIDE_ZOOM_PANEL);
            }
            else if (action.actionType === actionType.ADD_NEW_BOOKMARK_ACTION) {
                // Bookmark has been selected from the toolbar panel
                _this._isBookMarkSelected = true;
                _this.emit(ToolbarStore.ADD_NEW_BOOKMARK_EVENT);
            }
            else if (action.actionType === actionType.BOOKMARK_PANEL_CLICK_ACTION) {
                // Clicked on bookmarks menu panel and panel is open/closed.
                var bookmarkPanelClickAction_1 = action;
                _this._isBookmarkPanelOpen = bookmarkPanelClickAction_1.isBookmarkPanelOpen;
            }
            else if (action.actionType === actionType.BOOKMARK_ADDED_ACTION) {
                var bookmarkAction = action;
                _this._isBookMarkSelected = false;
                _this._isBookmarkTextboxOpen = true;
                _this.emit(ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT);
            }
            else if (action.actionType === actionType.SAVE_AND_NAVIGATE) {
                var navigateTo = action.navigatingTo;
                if (navigateTo === enums.SaveAndNavigate.toWorklist ||
                    navigateTo === enums.SaveAndNavigate.toInboxMessagePage ||
                    navigateTo === enums.SaveAndNavigate.toQigSelector ||
                    navigateTo === enums.SaveAndNavigate.toTeam ||
                    navigateTo === enums.SaveAndNavigate.toMenu) {
                    _this._isBookMarkSelected = false;
                }
                _this._isBookmarkTextboxOpen = false;
            }
            else if (action.actionType === actionType.SET_MARKING_IN_PROGRESS_ACTION) {
                _this._isBookMarkSelected = false;
            }
            else if (action.actionType === actionType.SHOW_OR_HIDE_BOOKMARK_NAME_BOX) {
                var showOrHideBookmarkNameBoxAction_1 = action;
                var bookmarkIsVisible = showOrHideBookmarkNameBoxAction_1.isVisible;
                if (!bookmarkIsVisible) {
                    _this._isBookmarkTextboxOpen = false;
                }
            }
            else if (action.actionType === actionType.PAN_CANCEL_ACTION) {
                _this._panStampId = 0;
                _this.emit(ToolbarStore.PAN_CANCEL);
            }
            else if (action.actionType === actionType.SELECT_ACETATE_ACTION) {
                var selectAcetateAction_1 = action;
                _this._selectedAcetate = selectAcetateAction_1.acetateType;
                _this.emit(ToolbarStore.ACETATE_SELECTED_EVENT, selectAcetateAction_1.acetateType);
            }
            else if (action.actionType === actionType.MARKING_OVERLAY_VISIBLITY_ACTION) {
                var markingOverlayVisiblityAction_1 = action;
                _this._isMarkingOverlayVisible = markingOverlayVisiblityAction_1.isMarkingOverlayVisible;
            }
            else if (action.actionType === actionType.DE_SELECT_ANNOTATION) {
                _this._selectedStampId = 0;
                _this.emit(ToolbarStore.DE_SELECT_ANNOTATION_EVENT);
            }
        });
    }
    Object.defineProperty(ToolbarStore.prototype, "isBookMarkPanelOpen", {
        /**
         * This method will return true if bookmark panel is open, false otherwise.
         */
        get: function () {
            return this._isBookmarkPanelOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "isBookmarkTextboxOpen", {
        /**
         * This method will return true if bookmark textbox is open, false otherwise.
         */
        get: function () {
            return this._isBookmarkTextboxOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "isBookMarkSelected", {
        /**
         * This method will return  whether the bookmark is selected from the add bookmark button and shown in stampcursor.
         */
        get: function () {
            return this._isBookMarkSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "isStampPanelExpanded", {
        /**
         * This method will return whether the stamp panel is expanded/collapsed
         */
        get: function () {
            return this._isStampPanelExpanded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "selectedStampId", {
        /**
         * Returns the selected stamp ID
         */
        get: function () {
            return this._selectedStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "draggedStampId", {
        /**
         * Returns the dragged stamp ID
         */
        get: function () {
            return this._draggedStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "panStampId", {
        /**
         * Returns the pan stamp ID
         */
        get: function () {
            return this._panStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "draggedAnnotationClientToken", {
        /**
         * Currently dragged annotation client token
         */
        get: function () {
            return this._draggedAnnotationClientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "panSource", {
        /**
         * Get current source of pan
         */
        get: function () {
            return this._panSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "selectedAcetate", {
        /**
         * Gets the currently selected acetate.
         */
        get: function () {
            return this._selectedAcetate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarStore.prototype, "isMarkingOverlayVisible", {
        /**
         * Gets marking overlay visiblity status.
         */
        get: function () {
            return this._isMarkingOverlayVisible;
        },
        enumerable: true,
        configurable: true
    });
    // Stamp Panel Mode changed event name.
    ToolbarStore.STAMP_PANEL_MODE_CHANGED = 'StampPanelModeChanged';
    // Stamp Selected event name.
    ToolbarStore.STAMP_SELECTED = 'StampSelect';
    // Stamp Dragged event name.
    ToolbarStore.STAMP_DRAGGED = 'StampDrag';
    // Stamp pan event name.
    ToolbarStore.STAMP_PAN = 'StampPan';
    // Stamp pan end event name
    ToolbarStore.PAN_END = 'PanEnd';
    // Stamp pan to deletion area
    ToolbarStore.PAN_STAMP_TO_DELETION_AREA = 'PanStampToDeletionArea';
    // Stamp Deselected event name.
    ToolbarStore.STAMP_DESELECTED = 'StampDeSelect';
    // Hide the zoom panel
    ToolbarStore.HIDE_ZOOM_PANEL = 'HideZoomPanel';
    // Add new bookmark event
    ToolbarStore.ADD_NEW_BOOKMARK_EVENT = 'AddNewBookmarkEvent';
    ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT = 'BookmarkaddedCursorUpdateEvent';
    ToolbarStore.PAN_CANCEL = 'PanCancelEvent';
    // Acetate selection event
    ToolbarStore.ACETATE_SELECTED_EVENT = 'AcetateSelectedEvent';
    // Deselected annotation event
    ToolbarStore.DE_SELECT_ANNOTATION_EVENT = 'DeSelectAnnotationEvent';
    return ToolbarStore;
}(storeBase));
var instance = new ToolbarStore();
module.exports = { ToolbarStore: ToolbarStore, instance: instance };
//# sourceMappingURL=toolbarstore.js.map