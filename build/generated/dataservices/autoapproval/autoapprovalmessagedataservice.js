"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var AutoApprovalMessageDataService = (function (_super) {
    __extends(AutoApprovalMessageDataService, _super);
    function AutoApprovalMessageDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Call the Auto approval message status update data service.
     * @param markSchemeGroupID - mark Scheme Group ID.
     * @param callback - call back with success boolean.
     */
    AutoApprovalMessageDataService.prototype.UpdateAutoApprovalMessageState = function (markSchemeGroupID, callback) {
        var url = urls.AUTO_APPROVAL_MESSAGE_STATUS_UPDATE_URL;
        /**  Making AJAX call to update the message status as read */
        var updateAutoApprovalMessagePromise = this.makeAJAXCall('POST', url, JSON.stringify(markSchemeGroupID));
        updateAutoApprovalMessagePromise.then(function (data) {
            if (callback) {
                callback(true);
            }
        }).catch(function (data) {
            if (callback) {
                callback(false, data);
            }
        });
    };
    return AutoApprovalMessageDataService;
}(dataServiceBase));
var autoApprovalMessageDataService = new AutoApprovalMessageDataService();
module.exports = autoApprovalMessageDataService;
//# sourceMappingURL=autoapprovalmessagedataservice.js.map