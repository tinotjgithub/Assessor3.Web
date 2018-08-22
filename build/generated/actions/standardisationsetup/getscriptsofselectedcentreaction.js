"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetScriptsOfSelectedCentreAction = (function (_super) {
    __extends(GetScriptsOfSelectedCentreAction, _super);
    /**
     * Constructor
     * @param success
     * @param centrePartId
     * @param centreId
     * @param json
     */
    function GetScriptsOfSelectedCentreAction(success, centrePartId, centreId, json) {
        _super.call(this, action.Source.View, actionType.GET_SCRIPTS_OF_SELECTED_CENTRE_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
        this._scriptList = json;
        this._selectedCentrePartId = centrePartId;
        this._selectedCentreId = centreId;
    }
    Object.defineProperty(GetScriptsOfSelectedCentreAction.prototype, "scriptListOfSelectedCentre", {
        /**
         * returns the script list, of the selected centre.
         */
        get: function () {
            return this._scriptList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetScriptsOfSelectedCentreAction.prototype, "selectedCentrePartId", {
        /**
         * returns the selected center part id.
         */
        get: function () {
            return this._selectedCentrePartId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GetScriptsOfSelectedCentreAction.prototype, "selectedCentreId", {
        /**
         * returns the selected center id.
         */
        get: function () {
            return this._selectedCentreId;
        },
        enumerable: true,
        configurable: true
    });
    return GetScriptsOfSelectedCentreAction;
}(dataRetrievalAction));
module.exports = GetScriptsOfSelectedCentreAction;
//# sourceMappingURL=getscriptsofselectedcentreaction.js.map