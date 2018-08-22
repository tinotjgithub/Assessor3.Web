import dispatcher = require('../../app/dispatcher');
import stampPanelAction = require('./stamppanelaction');
import stampSelectAction = require('./stampselectaction');
import Promise = require('es6-promise');
import stampDragAction = require('./stampdragaction');
import stampPanAction = require('./stamppanaction');
import stampPanToDeleteAreaAction = require('./stamppantodeleteareaaction');
import bookmarkPanelClickAction = require('./bookmarkpanelclickaction');
import enums = require('../../components/utility/enums');
import selectAcetateAction = require('../acetates/selectacetateaction');
import markingOverlayVisiblityAction = require('./markingoverlayvisiblityaction');

/**
 * Class for creating Response Action Creator
 */
class ToolbarActionCreator {

    /**
     * This method will be called while stamp panel is expanded/collapsed
     */
    public ChangeStampPanelMode(isStampPanelExpanded: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stampPanelAction(isStampPanelExpanded));
        }).catch();
    }

    /**
     * This method will be called while a stamp is being selected from the Stamp Panel
     * @param stampId
     */
    public SelectStamp(stampId: number, isSelected: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stampSelectAction(stampId, isSelected));
        }).catch();
    }

    /**
     * Method to update the dragged stamp information to the corresponding store.
     * @param {number} stampId
     * @param {boolean} isDrag
     */
    public DragStamp(stampId: number, isDrag: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stampDragAction(stampId, isDrag));
        }).catch();
    }

    /**
     * Method to update the Pan stamp information to the corresponding store.
     * @param {number} stampId
     * @param {string} clientToken?
     */
    public PanStamp(stampId: number, clientToken?: string) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stampPanAction(stampId, clientToken));
        }).catch();
    }

    /**
     * Method to update the store that pan stamp has reached a deletion area
     * @param canDelete
     */
    public PanStampToDeleteArea(canDelete: boolean, xPos: number, yPos: number) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new stampPanToDeleteAreaAction(canDelete, xPos, yPos));
        }).catch();
    }

    /**
     * This method will be called while the bookmark panel is open/closed.
     * @param stampId
     */
    public isBookmarkSidePanelOpen(isOpen: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new bookmarkPanelClickAction(isOpen));
        }).catch();
    }

    /**
     * This method is called when an acetate is selected from the toolbar
     * @param acetateType
     */
    public selectAcetate(acetateType: enums.ToolType) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new selectAcetateAction(acetateType));
        }).catch();
    }

    /**
     * Set marking overlsy visiblity status.
     * @param isVisible 
     */
    public setMarkingOverlayVisiblity(isVisible: boolean) {
        new Promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new markingOverlayVisiblityAction(isVisible));
        }).catch();
    }
}

let toolbarActionCreator = new ToolbarActionCreator();
export = toolbarActionCreator;

