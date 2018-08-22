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
 * Action class for promote a response to seed
 */
var PromoteToSeedCheckRemarkAction = (function (_super) {
    __extends(PromoteToSeedCheckRemarkAction, _super);
    /**
     * Constructor
     * @param success
     * @param promoteToSeedReturn
     */
    function PromoteToSeedCheckRemarkAction(success, promoteToSeedReturn) {
        _super.call(this, action.Source.View, actionType.PROMOTE_TO_SEED_VALIDATION, success);
        this._promoteToSeedReturn = promoteToSeedReturn;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{ success}/g, success.toString());
    }
    Object.defineProperty(PromoteToSeedCheckRemarkAction.prototype, "promoteToSeedReturn", {
        /**
         * Promote to seed return object
         */
        get: function () {
            return this._promoteToSeedReturn;
        },
        enumerable: true,
        configurable: true
    });
    return PromoteToSeedCheckRemarkAction;
}(dataRetrievalAction));
module.exports = PromoteToSeedCheckRemarkAction;
//# sourceMappingURL=promotetoseedcheckremarkaction.js.map