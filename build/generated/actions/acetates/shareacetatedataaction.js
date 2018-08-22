"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ShareAcetateDataAction = (function (_super) {
    __extends(ShareAcetateDataAction, _super);
    /**
     * Constructor
     * @param clientToken
     */
    function ShareAcetateDataAction(clientToken) {
        _super.call(this, action.Source.View, actionType.SHARE_ACETATE_DATA_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, clientToken.toString());
        this._clientToken = clientToken;
    }
    Object.defineProperty(ShareAcetateDataAction.prototype, "clienToken", {
        /**
         * Get clientToken of selected acetate
         */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    return ShareAcetateDataAction;
}(action));
module.exports = ShareAcetateDataAction;
//# sourceMappingURL=shareacetatedataaction.js.map