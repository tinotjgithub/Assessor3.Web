"use strict";
var dispatcher = require('../../app/dispatcher');
var popUpDisplayAction = require('./popupdisplayaction');
var promise = require('es6-promise');
var enums = require('../../components/utility/enums');
var PopUpDisplayActionCreator = (function () {
    function PopUpDisplayActionCreator() {
    }
    /**
     * Action Creator to display the popup
     * @param popUpType
     * @param popUpActionType
     * @param popUpData
     */
    PopUpDisplayActionCreator.prototype.popUpDisplay = function (popUpType, popUpActionType, navigateFrom, popUpData, actionFromCombinedPopup, navigateTo) {
        if (navigateFrom === void 0) { navigateFrom = enums.SaveAndNavigate.none; }
        if (actionFromCombinedPopup === void 0) { actionFromCombinedPopup = false; }
        if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
        new promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new popUpDisplayAction(popUpType, popUpActionType, navigateFrom, popUpData, actionFromCombinedPopup, navigateTo));
        }).catch();
    };
    return PopUpDisplayActionCreator;
}());
var popUpDisplayActionCreator = new PopUpDisplayActionCreator();
module.exports = popUpDisplayActionCreator;
//# sourceMappingURL=popupdisplayactioncreator.js.map