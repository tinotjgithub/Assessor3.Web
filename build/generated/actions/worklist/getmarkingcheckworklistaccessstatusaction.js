"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var GetMarkingCheckWorklistAccessStatusAction = (function (_super) {
    __extends(GetMarkingCheckWorklistAccessStatusAction, _super);
    /**
     * Constructor
     * @param success
     * @param isMarkingCheckWorklistAccessPresent
     */
    function GetMarkingCheckWorklistAccessStatusAction(success, isMarkingCheckWorklistAccessPresent) {
        _super.call(this, action.Source.View, actionType.MARKING_CHECK_WORKLIST_ACCESS_ACTION, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
        this._isMarkingCheckWorklistAccessPresent = isMarkingCheckWorklistAccessPresent;
    }
    Object.defineProperty(GetMarkingCheckWorklistAccessStatusAction.prototype, "isMarkingCheckWorklistAccessPresent", {
        /**
         * Return true if unread mandatory messages present else return false
         */
        get: function () {
            return this._isMarkingCheckWorklistAccessPresent;
        },
        enumerable: true,
        configurable: true
    });
    return GetMarkingCheckWorklistAccessStatusAction;
}(dataRetrievalAction));
module.exports = GetMarkingCheckWorklistAccessStatusAction;
//# sourceMappingURL=getmarkingcheckworklistaccessstatusaction.js.map