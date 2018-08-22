import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import stampPanelAction = require('../../actions/toolbar/stamppanelaction');
import stampSelectAction = require('../../actions/toolbar/stampselectaction');
import stampDragAction = require('../../actions/toolbar/stampdragaction');
import responseCloseAction = require('../../actions/worklist/responsecloseaction');
import stampPanAction = require('../../actions/toolbar/stamppanaction');
import panEndAction = require('../../actions/marking/panendaction');
import enums = require('../../components/utility/enums');
import stampPanToDeleteAreaAction = require('../../actions/toolbar/stamppantodeleteareaaction');
import updateMarksAndAnnotationVisibilityAction = require('../../actions/marking/updatemarksandannotationvisibilityaction');
import bookmarkPanelClickAction = require('../../actions/toolbar/bookmarkpanelclickaction');
import saveAndNavigateAction = require('../../actions/marking/saveandnavigateaction');
import bookmarkAddedAction = require('../../actions/bookmarks/bookmarkaddedaction');
import showOrHideBookmarkNameBoxAction = require('../../actions/bookmarks/showorhidebookmarknameboxaction');
import selectAcetateAction = require('../../actions/acetates/selectacetateaction');
import markingOverlayVisiblityAction = require('../../actions/toolbar/markingoverlayvisiblityaction');
/**
 *  Class for Toolbar store
 */
class ToolbarStore extends storeBase {

    private _isStampPanelExpanded: boolean = false;
    private _selectedStampId: number = 0;
    private _draggedStampId: number = 0;
    private _panStampId: number = 0;
    private _draggedAnnotationClientToken: string = undefined;
    private _panSource: enums.PanSource;
    private _isBookMarkSelected: boolean = false;
    private _isBookmarkTextboxOpen: boolean = false;
    private _isBookmarkPanelOpen: boolean = false;
    private _selectedAcetate: enums.ToolType = undefined;
    private _isMarkingOverlayVisible: boolean = false;
    // Stamp Panel Mode changed event name.
    public static STAMP_PANEL_MODE_CHANGED = 'StampPanelModeChanged';

    // Stamp Selected event name.
    public static STAMP_SELECTED = 'StampSelect';

    // Stamp Dragged event name.
    public static STAMP_DRAGGED = 'StampDrag';

    // Stamp pan event name.
    public static STAMP_PAN = 'StampPan';

    // Stamp pan end event name
    public static PAN_END = 'PanEnd';

    // Stamp pan to deletion area
    public static PAN_STAMP_TO_DELETION_AREA = 'PanStampToDeletionArea';

    // Stamp Deselected event name.
    public static STAMP_DESELECTED = 'StampDeSelect';

    // Hide the zoom panel
    public static HIDE_ZOOM_PANEL = 'HideZoomPanel';

    // Add new bookmark event
    public static ADD_NEW_BOOKMARK_EVENT = 'AddNewBookmarkEvent';

    public static BOOKMARK_ADDED_CURSOR_EVENT = 'BookmarkaddedCursorUpdateEvent';

    public static PAN_CANCEL = 'PanCancelEvent';

    // Acetate selection event
	public static ACETATE_SELECTED_EVENT = 'AcetateSelectedEvent';


	// Deselected annotation event
	public static DE_SELECT_ANNOTATION_EVENT = 'DeSelectAnnotationEvent';

    /**
     * Constructor for toolbar store
     */
    constructor() {
        super();

        this.dispatchToken = dispatcher.register((action: action) => {
			if (action.actionType === actionType.STAMP_PANEL_MODE_CHANGED) {
				let panelAction: stampPanelAction = action as stampPanelAction;
				this._isStampPanelExpanded = panelAction.isStampPanelExpanded;
				this.emit(ToolbarStore.STAMP_PANEL_MODE_CHANGED);
			} else if (action.actionType === actionType.STAMP_SELECTED) {
				let stampSelectedAction: stampSelectAction = action as stampSelectAction;
				this._selectedStampId = stampSelectedAction.isStampSelected ?
					stampSelectedAction.selectedStampId : this._selectedStampId === stampSelectedAction.selectedStampId ? 0 :
						this._selectedStampId;
				this._isBookMarkSelected = this.isBookMarkSelected ? !stampSelectedAction.isStampSelected : false;
				this.emit(ToolbarStore.STAMP_SELECTED);
			} else if (action.actionType === actionType.RESPONSE_CLOSE) {
				let responseCloseAction: responseCloseAction = action as responseCloseAction;
				this._selectedStampId = responseCloseAction.getIsResponseClose ? 0 : this._selectedStampId;
				this._isStampPanelExpanded = responseCloseAction.getIsResponseClose ? false : this._isStampPanelExpanded;
				this._isBookMarkSelected = false;
			} else if (action.actionType === actionType.STAMP_DRAG) {
				let stampDragAction: stampDragAction = action as stampDragAction;
				this._draggedStampId = stampDragAction.isStampDragged ? stampDragAction.draggedStampId : 0;
				this._isBookMarkSelected = false;
				this.emit(ToolbarStore.STAMP_DRAGGED);
			} else if (action.actionType === actionType.STAMP_PAN) {
				let stampPanAction: stampPanAction = action as stampPanAction;
				this._panStampId = stampPanAction.panStampId;
				this._draggedAnnotationClientToken = stampPanAction.draggedAnnotationClientToken;
				this.emit(ToolbarStore.STAMP_PAN);
			} else if (action.actionType === actionType.PAN_END) {
				let panAction = (action as panEndAction);
				let draggedAnnotationClientToken = this._draggedAnnotationClientToken;
				this._panSource = panAction.panSource;
				this._panStampId = 0;
				this._draggedAnnotationClientToken = undefined;
				this.emit(
					ToolbarStore.PAN_END,
					panAction.elementId,
					panAction.xPos,
					panAction.yPos,
					panAction.panSource,
					panAction.stampId,
					draggedAnnotationClientToken,
					panAction.isAnnotationOverlapped,
					panAction.isAnnotationPlacedInGreyArea
				);
			} else if (action.actionType === actionType.PAN_STAMP_TO_DELETED_AREA) {
				let stampPanToDeleteAreaAction = (action as stampPanToDeleteAreaAction);
				this.emit(
					ToolbarStore.PAN_STAMP_TO_DELETION_AREA,
					stampPanToDeleteAreaAction.canDelete,
					stampPanToDeleteAreaAction.xPos,
					stampPanToDeleteAreaAction.yPos
				);
			} else if (action.actionType === actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION) {
				let marksAndAnnotationVisibilityAction = (action as updateMarksAndAnnotationVisibilityAction);
				if (marksAndAnnotationVisibilityAction.getIndex === 0 &&
					!marksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails.isAnnotationVisible) {
					this._selectedStampId = 0;
					this.emit(ToolbarStore.STAMP_DESELECTED);
				}
			} else if (action.actionType === actionType.HIDE_ZOOM_PANEL) {
				this.emit(ToolbarStore.HIDE_ZOOM_PANEL);
			} else if (action.actionType === actionType.ADD_NEW_BOOKMARK_ACTION) {
				// Bookmark has been selected from the toolbar panel
				this._isBookMarkSelected = true;
				this.emit(ToolbarStore.ADD_NEW_BOOKMARK_EVENT);
			} else if (action.actionType === actionType.BOOKMARK_PANEL_CLICK_ACTION) {
				// Clicked on bookmarks menu panel and panel is open/closed.
				let bookmarkPanelClickAction = (action as bookmarkPanelClickAction);
				this._isBookmarkPanelOpen = bookmarkPanelClickAction.isBookmarkPanelOpen;
			} else if (action.actionType === actionType.BOOKMARK_ADDED_ACTION) {
				let bookmarkAction = (action as bookmarkAddedAction);
				this._isBookMarkSelected = false;
				this._isBookmarkTextboxOpen = true;
				this.emit(ToolbarStore.BOOKMARK_ADDED_CURSOR_EVENT);
			} else if (action.actionType === actionType.SAVE_AND_NAVIGATE) {
				let navigateTo = (action as saveAndNavigateAction).navigatingTo;
				if (navigateTo === enums.SaveAndNavigate.toWorklist ||
					navigateTo === enums.SaveAndNavigate.toInboxMessagePage ||
					navigateTo === enums.SaveAndNavigate.toQigSelector ||
					navigateTo === enums.SaveAndNavigate.toTeam ||
					navigateTo === enums.SaveAndNavigate.toMenu) {
					this._isBookMarkSelected = false;
				}
				this._isBookmarkTextboxOpen = false;
			} else if (action.actionType === actionType.SET_MARKING_IN_PROGRESS_ACTION) {
				this._isBookMarkSelected = false;
			} else if (action.actionType === actionType.SHOW_OR_HIDE_BOOKMARK_NAME_BOX) {
				let showOrHideBookmarkNameBoxAction = action as showOrHideBookmarkNameBoxAction;
				let bookmarkIsVisible: boolean = showOrHideBookmarkNameBoxAction.isVisible;
				if (!bookmarkIsVisible) {
					this._isBookmarkTextboxOpen = false;
				}
			} else if (action.actionType === actionType.PAN_CANCEL_ACTION) {
				this._panStampId = 0;
				this.emit(ToolbarStore.PAN_CANCEL);
			} else if (action.actionType === actionType.SELECT_ACETATE_ACTION) {
				let selectAcetateAction = (action as selectAcetateAction);
				this._selectedAcetate = selectAcetateAction.acetateType;
				this.emit(ToolbarStore.ACETATE_SELECTED_EVENT, selectAcetateAction.acetateType);
			} else if (action.actionType === actionType.MARKING_OVERLAY_VISIBLITY_ACTION) {
				let markingOverlayVisiblityAction = (action as markingOverlayVisiblityAction);
				this._isMarkingOverlayVisible = markingOverlayVisiblityAction.isMarkingOverlayVisible;
			} else if (action.actionType === actionType.DE_SELECT_ANNOTATION) {
				this._selectedStampId = 0;
				this.emit(ToolbarStore.DE_SELECT_ANNOTATION_EVENT);
			}
        });
    }

    /**
     * This method will return true if bookmark panel is open, false otherwise.
     */
    public get isBookMarkPanelOpen(): boolean {
        return this._isBookmarkPanelOpen;
    }

    /**
     * This method will return true if bookmark textbox is open, false otherwise.
     */
    public get isBookmarkTextboxOpen(): boolean {
        return this._isBookmarkTextboxOpen;
    }

    /**
     * This method will return  whether the bookmark is selected from the add bookmark button and shown in stampcursor.
     */
    public get isBookMarkSelected(): boolean {
        return this._isBookMarkSelected;
    }

    /**
     * This method will return whether the stamp panel is expanded/collapsed
     */
    public get isStampPanelExpanded(): boolean {
        return this._isStampPanelExpanded;
    }

    /**
     * Returns the selected stamp ID
     */
    public get selectedStampId(): number {
        return this._selectedStampId;
    }

    /**
     * Returns the dragged stamp ID
     */
    public get draggedStampId(): number {
        return this._draggedStampId;
    }

    /**
     * Returns the pan stamp ID
     */
    public get panStampId(): number {
        return this._panStampId;
    }

    /**
     * Currently dragged annotation client token
     */
    public get draggedAnnotationClientToken(): string {
        return this._draggedAnnotationClientToken;
    }

    /**
     * Get current source of pan
     */
    public get panSource(): enums.PanSource {
        return this._panSource;
    }

    /**
     * Gets the currently selected acetate.
     */
    public get selectedAcetate(): enums.ToolType {
        return this._selectedAcetate;
    }

    /**
     * Gets marking overlay visiblity status.
     */
    public get isMarkingOverlayVisible(): boolean {
        return this._isMarkingOverlayVisible;
    }
}

let instance = new ToolbarStore();
export = { ToolbarStore, instance };