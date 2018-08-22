import Immutable = require('immutable');
import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import enums = require('../../components/utility/enums');
import actionType = require('../../actions/base/actiontypes');
import enhancedOffPageCommentsVisibilityAction = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentsvisibilityaction');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import defaultSort = require('../../utility/sorting/typings/defaultsort');
import enhancedOffPageCommentSortAction = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentsortaction');
import enhancedOffPageCommentUpdatedAction = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentupdatedaction');
import panelHeightAction = require('../../actions/marking/updatepanelheightaction');
import enahcnedOffpageCommentDataUpdateAction = require('../../actions/marking/enhancedoffpagecommentdataupdateaction');
import updateMarksAndAnnotationVisibilityAction = require('../../actions/marking/updatemarksandannotationvisibilityaction');
import switchEnhancedOffPageCommentsAction = require('../../actions/enhancedoffpagecomments/switchenhancedoffpagecommentsaction');
import enhancedOffPageCommentButtonAction = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentbuttonaction');
import responseOpenAction = require('../../actions/response/responseopenaction');

/**
 * Store class for Enhanced off-page comments
 * 
 * @class EnhancedOffPageCommentsStore
 * @extends {storeBase}
 */
class EnhancedOffPageCommentStore extends storeBase {

    public static ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED = 'EnhancedOffPageCommentsVisibilityChanged';
    public static ON_RESPONSE_CHANGED_EVENT = 'OnResponseChangedEvent';
    private _isEnhancedOffPageCommentsPanelVisible: boolean = true;
    private _sortDetails = Array<EnhancedOffPageCommentSortDetails>();
    private _isEnhancedOffPageCommentEdited: boolean = false;
    public static PANEL_HEIGHT_EVENT = 'PanelWidthEvent';
    public static ENHANCED_OFFPAGE_COMMENT_RESIZE_CLASSNAME = 'EnhanceoffpageCommentResizeClassName';
    public static ON_PANEL_VISIBLITY_CHANGE = 'OnPanelVisiblityChange';
    public static UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA = 'UpdateEnahncedOffpageCommentData';
    public static UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE = 'UpdateEnhancedCommentOnVisiblityChange';
    // Event for displaying discard popup while switching between comments.
    public static SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH = 'ShowDiscardPopupOnEnhancedOffPageCommentsSwitch';
    // Event for switching enhanced offpage comments from markscheme header dropdown
    public static SWITCH_ENHANCED_OFFPAGE_COMMENTS = 'SwitchEnhancedOffPageComments';
    // Enhanced offpage comment button action event
    public static ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT = 'EnhancedOffPageCommentButtonActionEvent';
    private selectedMarkGroupId: number = 0;
    private selectedCommentIndex: number = 0;
    private enhancedOffpageCommentHeaderStyle: React.CSSProperties = null;
    private markschemeColumnVisiblityChanged: boolean = false;
    private remarkHeaderText: string;
    private resizeClassName: string;
    private _isEnhancedOffPageCommentsHidden: boolean = false;

    /**
     * Creates an instance of EnhancedOffPageCommentsStore.
     * @memberof EnhancedOffPageCommentsStore
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY:
                    let commentsVisibilityAction = (action as enhancedOffPageCommentsVisibilityAction);
                    this._isEnhancedOffPageCommentEdited = false;
                    this._isEnhancedOffPageCommentsPanelVisible = commentsVisibilityAction.isVisible;
                    this.emit(EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
                        this.isEnhancedOffPageCommentsPanelVisible, commentsVisibilityAction.markSchemeToNavigate);
                    break;
                case actionType.OPEN_RESPONSE:
                    let openAction: responseOpenAction = action as responseOpenAction;
                    // Fix for defect 57190
                    // When the response is opened with an exception or message panel in open state. 
                    // Then enhanced off page comments should be hidden
                    if (openAction.triggerPoint === enums.TriggerPoint.AssociatedDisplayIDFromMessage ||
                        openAction.triggerPoint === enums.TriggerPoint.WorkListResponseExceptionIcon ||
                        openAction.triggerPoint === enums.TriggerPoint.WorkListResponseMessageIcon) {
                        this._isEnhancedOffPageCommentsHidden = true;
                    }
                    // sort details stored as map collection with markGroupId as key for future uses.
                    // clearing the current sort collection while opening a response.
                    this._sortDetails = new Array<EnhancedOffPageCommentSortDetails>();
                    // resetting _isEnhancedOffPageCommentsPanelVisible while navigating to next response
                    this._isEnhancedOffPageCommentsPanelVisible = true;
                     this._isEnhancedOffPageCommentEdited = false;
                     this.selectedCommentIndex = 0;
                     this.enhancedOffpageCommentHeaderStyle = null;
                     this.remarkHeaderText = null;
                     this.emit(EnhancedOffPageCommentStore.ON_RESPONSE_CHANGED_EVENT);
                    break;
                case actionType.ENHANCED_OFF_PAGE_COMMENT_SORT_ACTION:
                    let sortAction: enhancedOffPageCommentSortAction = (action as enhancedOffPageCommentSortAction);
                    let sortItem: EnhancedOffPageCommentSortDetails = sortAction.sortDetails;
                    this.updateEnhancedOffPageCommentSortCollection(sortItem.markGroupId, sortItem.comparerName, sortItem.sortDirection);
                    break;
                case actionType.MESSAGE_ACTION:
                case actionType.EXCEPTION_ACTION:
                // When message or exception panel is closed or minimised. The enhanced off page comments should be shown again
                if (this._isEnhancedOffPageCommentsHidden) {
                    this._isEnhancedOffPageCommentsHidden = false;
                    this.emit(EnhancedOffPageCommentStore.ENHANCED_OFF_PAGE_COMMENTS_VISIBILITY_CHANGED,
                        this.isEnhancedOffPageCommentsPanelVisible);
                    }
                    break;
                case actionType.PANEL_HEIGHT:
                    let panelheightAction = (action as panelHeightAction);
                    let panelHeight = panelheightAction.panelHeight;
                    this.resizeClassName = panelheightAction.resizeClassName;
                    let elementOverlapped = panelheightAction.elementOverlapped;
                    let panActionType = panelheightAction.panActionType;
                    let resizepanelType = panelheightAction.resizePanelType;
                    this.emit(EnhancedOffPageCommentStore.PANEL_HEIGHT_EVENT,
                        panelHeight, this.resizeClassName, elementOverlapped, panActionType, resizepanelType);
                    break;
                case actionType.PANEL_VISIBLITY_ACTION:
                    this.emit(EnhancedOffPageCommentStore.ON_PANEL_VISIBLITY_CHANGE);
                    break;
                case actionType.ENHANCED_OFF_PAGE_COMMENT_UPDATED_ACTION:
                    let commentUpdatedAction: enhancedOffPageCommentUpdatedAction = (action as enhancedOffPageCommentUpdatedAction);
                    this._isEnhancedOffPageCommentEdited = commentUpdatedAction.isEnhanedOffPageCommentEdited;
                    break;
                case actionType.SAVE_ENHANCED_OFFPAGE_COMMENTS_ACTION:
                    // We have to reset the edited variable when a save action is complete
                    this._isEnhancedOffPageCommentEdited = false;
                    break;
                case actionType.ENHANCED_OFFPAGE_COMMENT_INDEX_UPDATE_ACTION:
                    let enhancedOffpageDataUpdateAction = (action as enahcnedOffpageCommentDataUpdateAction);
                    let index: number = enhancedOffpageDataUpdateAction.index;
                    this.selectedCommentIndex = index;
                    this.selectedMarkGroupId = enhancedOffpageDataUpdateAction.markGroupId;
                    this.remarkHeaderText = enhancedOffpageDataUpdateAction.remarkHeaderText;
                    this.enhancedOffpageCommentHeaderStyle = (index === 0) ? null : enhancedOffpageDataUpdateAction.style;
                    this.emit(EnhancedOffPageCommentStore.UPDATE_ENHANCED_OFFPAGE_COMMENT_DATA);
                    break;
                case actionType.UPDATE_MARKS_AND_ANNOTATIONS_VISIBILITY_ACTION:
                    let _updateMarksAndAnnotationVisibilityAction: updateMarksAndAnnotationVisibilityAction =
                        action as updateMarksAndAnnotationVisibilityAction;
                    let visiblityInfo = _updateMarksAndAnnotationVisibilityAction.getMarksAndAnnotationVisibilityDetails;
                    // reset selected comments to current marking comments.
                    this.markschemeColumnVisiblityChanged = false;
                    if (!visiblityInfo.isMarkVisible && this.selectedCommentIndex === _updateMarksAndAnnotationVisibilityAction.getIndex) {
                        this.selectedCommentIndex = 0;
                        this.enhancedOffpageCommentHeaderStyle = null;
                        this.remarkHeaderText = null;
                        this.markschemeColumnVisiblityChanged = true;
                        this.emit(EnhancedOffPageCommentStore.UPDATE_ENHANCED_COMMENT_ON_VISIBLITY_CHANGE);
                    }
                    break;
                case actionType.SWITCH_ENHANCED_OFF_PAGE_COMMENTS:
                    let switchEnhancedOffPageCommentsAction = (action as switchEnhancedOffPageCommentsAction);
                    if (switchEnhancedOffPageCommentsAction.showDiscardPopup) {
                        this.emit(EnhancedOffPageCommentStore.SHOW_DISCARD_POPUP_ON_ENHANCED_OFFPAGE_COMMENTS_SWITCH);
                    } else {
                        // We have to reset the edited variable when a save action is complete
                        this._isEnhancedOffPageCommentEdited = false;
                        this.emit(EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS);
                    }
                    break;
                case actionType.ENHANCED_OFF_PAGE_COMMENT_BUTTON_ACTION:
                    this.emit(EnhancedOffPageCommentStore.ENHANCED_OFFPAGE_COMMENT_BUTTON_ACTION_EVENT,
                        (action as enhancedOffPageCommentButtonAction).EnhancedOffPageCommentButtonAction);
                    break;

            }
        });
    }

    /**
     * Return whether enhanced off-page comments panel is visible or not
     * 
     * @readonly
     * @memberof EnhancedOffPageCommentsStore
     */
    public get isEnhancedOffPageCommentsPanelVisible() {
        return this._isEnhancedOffPageCommentsPanelVisible;
    }

    /**
     * Returns whether enhanced off page comments panel is hidden or not
     * Enhanced off page comments panel is hidden when the response is opened from exception or message directly
     */
    public get isEnhancedOffPageCommentsHidden() {
        return this._isEnhancedOffPageCommentsHidden;
    }

    /**
     * This method will return the sort details
     */
    public get sortDetails(): Array<EnhancedOffPageCommentSortDetails> {
        return this._sortDetails;
    }

    /**
     * Returns the current sort details against selected response
     * @param {number} markGroupId 
     * @returns {EnhancedOffPageCommentSortDetails} 
     * @memberof EnhancedOffPageCommentStore
     */
    public markGroupSortDetails(markGroupId: number): EnhancedOffPageCommentSortDetails {
        if (this.sortDetails && this.sortDetails.length > 0) {
            return this.sortDetails.filter((x: EnhancedOffPageCommentSortDetails) => x.markGroupId === markGroupId)[0];
        } else {
            let defaultSortValues: defaultSort = this.getDefaultSortDetails();
            let sortDetails: EnhancedOffPageCommentSortDetails = {
                markGroupId: markGroupId,
                comparerName: defaultSortValues.compareName,
                sortDirection: defaultSortValues.sortDirection,
            };
            return sortDetails;
        }
    }

    /**
     * This method will update the Enhanced off-page comment details
     * 
     * @private
     * @param {number} markGroupId 
     * @param {comparerList} [comparerName] 
     * @param {enums.SortDirection} [sortDirection] 
     * @memberof EnhancedOffPageCommentStore
     */
    private updateEnhancedOffPageCommentSortCollection(markGroupId: number,
        comparerName?: comparerList, sortDirection?: enums.SortDirection) {
        let entry = this.sortDetails.filter((x: EnhancedOffPageCommentSortDetails) => x.markGroupId === markGroupId);
        // if item is not present in sort collection then update the collection with default details
        if (entry.length === 0) {
            if (comparerName === undefined && sortDirection === undefined) {
                let defaultSortValues: defaultSort = this.getDefaultSortDetails();
                comparerName = defaultSortValues.compareName;
                sortDirection = defaultSortValues.sortDirection;
            }
            let sortDetails: EnhancedOffPageCommentSortDetails = {
                markGroupId: markGroupId,
                comparerName: comparerName,
                sortDirection: sortDirection,
            };

            this._sortDetails.push(sortDetails);
        } else if (comparerName !== undefined && sortDirection !== undefined) {
            this.sortDetails.filter((x: EnhancedOffPageCommentSortDetails) =>
                x.markGroupId === markGroupId)[0].comparerName = comparerName;
            this.sortDetails.filter((x: EnhancedOffPageCommentSortDetails) =>
                x.markGroupId === markGroupId)[0].sortDirection = sortDirection;
        }
    }

    /**
     * Get the default sort details for enhanced off-page comments
     * 
     * @returns {defaultSort} 
     * @memberof EnhancedOffPageCommentStore
     */
    private getDefaultSortDetails(): defaultSort {
        let comparerName: comparerList = comparerList.ItemComparer;
        let sortDirection: enums.SortDirection = enums.SortDirection.Ascending;
        return { compareName: comparerName, sortDirection: sortDirection };
    }

    /**
     * Returns whether the enhanced off page comment is edited or not
     */
    public get isEnhancedOffPageCommentEdited(): boolean {
        return this._isEnhancedOffPageCommentEdited;
    }

    /**
     * Returns current selected Enhanced offpage comment index.
     */
    public get currentEnhancedOffpageCommentIndex(): number {
        return this.selectedCommentIndex;
    }

    /**
     * Returns Background color for enhanced offpage comment header based on Remark base color.
     * @readonly
     * @memberof EnhancedOffPageCommentStore
     */
    public get enhancedoffpageCommentHeaderColor(): React.CSSProperties {
        return this.enhancedOffpageCommentHeaderStyle;
    }

    /**
     * Return true whether the visiblity is changed or not.
     * @readonly
     * @type {boolean}
     * @memberof EnhancedOffPageCommentStore
     */
    public get isMarkschemeColumnVisiblityChanged(): boolean {
        return this.markschemeColumnVisiblityChanged;
    }

    /**
     * Returns header text based on remarks.
     * @readonly
     * @type {string}
     * @memberof EnhancedOffPageCommentStore
     */
    public get commentHeaderText(): string {
        return this.remarkHeaderText;
    }

    /**
     * Gets whether enhanced offpage comment is resizing.
     */
    public get isEnhancedOffpageCommentResizing(): boolean {
        return this.resizeClassName === 'resizing';
    }
}

let instance = new EnhancedOffPageCommentStore();
export = { EnhancedOffPageCommentStore, instance };