"use strict";
var dispatcher = require('../../app/dispatcher');
var stampPanelAction = require('./stamppanelaction');
var stampSelectAction = require('./stampselectaction');
var Promise = require('es6-promise');
var stampDragAction = require('./stampdragaction');
var stampPanAction = require('./stamppanaction');
var stampPanToDeleteAreaAction = require('./stamppantodeleteareaaction');
var bookmarkPanelClickAction = require('./bookmarkpanelclickaction');
var selectAcetateAction = require('../acetates/selectacetateaction');
var markingOverlayVisiblityAction = require('./markingoverlayvisiblityaction');
/**
 * Class for creating Response Action Creator
 */
var ToolbarActionCreator = (function () {
    function ToolbarActionCreator() {
    }
    /**
     * This method will be called while stamp panel is expanded/collapsed
     */
    ToolbarActionCreator.prototype.ChangeStampPanelMode = function (isStampPanelExpanded) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stampPanelAction(isStampPanelExpanded));
        }).catch();
    };
    /**
     * This method will be called while a stamp is being selected from the Stamp Panel
     * @param stampId
     */
    ToolbarActionCreator.prototype.SelectStamp = function (stampId, isSelected) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stampSelectAction(stampId, isSelected));
        }).catch();
    };
    /**
     * Method to update the dragged stamp information to the corresponding store.
     * @param {number} stampId
     * @param {boolean} isDrag
     */
    ToolbarActionCreator.prototype.DragStamp = function (stampId, isDrag) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stampDragAction(stampId, isDrag));
        }).catch();
    };
    /**
     * Method to update the Pan stamp information to the corresponding store.
     * @param {number} stampId
     * @param {string} clientToken?
     */
    ToolbarActionCreator.prototype.PanStamp = function (stampId, clientToken) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stampPanAction(stampId, clientToken));
        }).catch();
    };
    /**
     * Method to update the store that pan stamp has reached a deletion area
     * @param canDelete
     */
    ToolbarActionCreator.prototype.PanStampToDeleteArea = function (canDelete, xPos, yPos) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new stampPanToDeleteAreaAction(canDelete, xPos, yPos));
        }).catch();
    };
    /**
     * This method will be called while the bookmark panel is open/closed.
     * @param stampId
     */
    ToolbarActionCreator.prototype.isBookmarkSidePanelOpen = function (isOpen) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new bookmarkPanelClickAction(isOpen));
        }).catch();
    };
    /**
     * This method is called when an acetate is selected from the toolbar
     * @param acetateType
     */
    ToolbarActionCreator.prototype.selectAcetate = function (acetateType) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new selectAcetateAction(acetateType));
        }).catch();
    };
    /**
     * Set marking overlsy visiblity status.
     * @param isVisible
     */
    ToolbarActionCreator.prototype.setMarkingOverlayVisiblity = function (isVisible) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new markingOverlayVisiblityAction(isVisible));
        }).catch();
    };
    return ToolbarActionCreator;
}());
var toolbarActionCreator = new ToolbarActionCreator();
module.exports = toolbarActionCreator;
//# sourceMappingURL=toolbaractioncreator.js.map