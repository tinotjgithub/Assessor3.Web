"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Class for scroll data reset action.
 */
var ScrollDataResetAction = (function (_super) {
    __extends(ScrollDataResetAction, _super);
    /**
     * Constructor ScrollDataResetAction
     * @param success
     */
    function ScrollDataResetAction(success) {
        _super.call(this, action.Source.View, actionType.SCROLL_DATA_RESET, success);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    return ScrollDataResetAction;
}(dataRetrievalAction));
module.exports = ScrollDataResetAction;
//# sourceMappingURL=scrolldataresetaction.js.map