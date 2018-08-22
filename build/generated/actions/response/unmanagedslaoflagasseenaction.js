"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for un managed SLAO flag as seen action.
 */
var UnManagedSlaoFlagAsSeenAction = (function (_super) {
    __extends(UnManagedSlaoFlagAsSeenAction, _super);
    /**
     * Constructor UnManagedSlaoFlagAsSeenAction
     * @param pageNumber
     */
    function UnManagedSlaoFlagAsSeenAction(pageNumber) {
        _super.call(this, action.Source.View, actionType.UNMANAGED_SLAO_FLAG_AS_SEEN_ACTION);
        this._selectedPage = pageNumber;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{pageNumber}/g, pageNumber.toString());
    }
    Object.defineProperty(UnManagedSlaoFlagAsSeenAction.prototype, "selectedPage", {
        /**
         * returns page number for flag as seen click in unmanaged slao.
         */
        get: function () {
            return this._selectedPage;
        },
        enumerable: true,
        configurable: true
    });
    return UnManagedSlaoFlagAsSeenAction;
}(action));
module.exports = UnManagedSlaoFlagAsSeenAction;
//# sourceMappingURL=unmanagedslaoflagasseenaction.js.map