"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MarkingCheckCompleteAction = (function (_super) {
    __extends(MarkingCheckCompleteAction, _super);
    /**
     * Marking check Complete action constructor
     */
    function MarkingCheckCompleteAction() {
        _super.call(this, action.Source.View, actionType.MARKING_CHECK_COMPLETE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return MarkingCheckCompleteAction;
}(action));
module.exports = MarkingCheckCompleteAction;
//# sourceMappingURL=markingcheckcompleteaction.js.map