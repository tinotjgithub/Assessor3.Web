"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
var PopUpDisplayAction = (function (_super) {
    __extends(PopUpDisplayAction, _super);
    /**
     * Constructor
     * @param popUpType
     * @param popUpActionType
     * @param navigateFrom
     * @param popUpData
     */
    function PopUpDisplayAction(popUpType, popUpActionType, navigateFrom, popUpData, actionFromCombinedPopup, navigateTo) {
        if (navigateFrom === void 0) { navigateFrom = enums.SaveAndNavigate.none; }
        if (actionFromCombinedPopup === void 0) { actionFromCombinedPopup = false; }
        if (navigateTo === void 0) { navigateTo = enums.SaveAndNavigate.none; }
        _super.call(this, action.Source.View, actionType.POPUPDISPLAY_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{popUp}/g, popUpType.toString());
        this._popUpType = popUpType;
        this._popUpActionType = popUpActionType;
        this._navigateFrom = navigateFrom;
        this._popUpData = popUpData;
        this._actionFromCombinedPopup = actionFromCombinedPopup;
        this._navigateTo = navigateTo;
    }
    Object.defineProperty(PopUpDisplayAction.prototype, "getPopUpType", {
        /**
         * get the popup type
         */
        get: function () {
            return this._popUpType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopUpDisplayAction.prototype, "getPopUpActionType", {
        /**
         * get the popup action type
         */
        get: function () {
            return this._popUpActionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopUpDisplayAction.prototype, "navigateFrom", {
        /**
         * get the navigate from
         */
        get: function () {
            return this._navigateFrom;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopUpDisplayAction.prototype, "getPopUpData", {
        /*
         * Get the details of popup.
         */
        get: function () {
            return this._popUpData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopUpDisplayAction.prototype, "actionFromCombinedPopup", {
        /**
         * get if the action is from combined warning message popup
         */
        get: function () {
            return this._actionFromCombinedPopup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PopUpDisplayAction.prototype, "navigateTo", {
        /**
         * get the navigate to
         */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    return PopUpDisplayAction;
}(action));
module.exports = PopUpDisplayAction;
//# sourceMappingURL=popupdisplayaction.js.map