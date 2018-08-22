"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var autoApprovalMessageAction = require('./autoapprovalmessageaction');
var autoApprovalMessageDataService = require('../../dataservices/autoapproval/autoapprovalmessagedataservice');
var base = require('../base/actioncreatorbase');
/**
 * Auto approval message status update action creator class
 */
var AutoApprovalMessageActionCreator = (function (_super) {
    __extends(AutoApprovalMessageActionCreator, _super);
    function AutoApprovalMessageActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Call the Auto approval message status update service and then generate an appropriate action
     */
    AutoApprovalMessageActionCreator.prototype.UpdateAutoApprovalMessageState = function (markSchemeGroupID) {
        var that = this;
        autoApprovalMessageDataService.UpdateAutoApprovalMessageState(markSchemeGroupID, function (success, json) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(json)) {
                dispatcher.dispatch(new autoApprovalMessageAction(success));
            }
        });
    };
    return AutoApprovalMessageActionCreator;
}(base));
var autoApprovalMessageActionCreator = new AutoApprovalMessageActionCreator();
module.exports = autoApprovalMessageActionCreator;
//# sourceMappingURL=autoapprovalmessageactioncreator.js.map