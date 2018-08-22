"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkingCheckWorklistGetAction = (function (_super) {
    __extends(MarkingCheckWorklistGetAction, _super);
    /**
     * Constructor
     * @param historyInfo
     */
    function MarkingCheckWorklistGetAction(examinerId) {
        _super.call(this, action.Source.View, actionType.MARKING_CHECK_EXAMINER_WORKLIST_GET);
        this._examinerId = examinerId;
    }
    Object.defineProperty(MarkingCheckWorklistGetAction.prototype, "examinerId", {
        /**
         * Examiner id to fetch the worklist
         */
        get: function () {
            return this._examinerId;
        },
        enumerable: true,
        configurable: true
    });
    return MarkingCheckWorklistGetAction;
}(action));
module.exports = MarkingCheckWorklistGetAction;
//# sourceMappingURL=markingcheckworklistgetaction.js.map