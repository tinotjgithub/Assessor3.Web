"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var submitResponseStartedAction = require('./submitresponsestartedaction');
var submitResponseDataService = require('../../dataservices/submit/submitresponsedataservice');
var submitResponseCompletedAction = require('./submitresponsecompletedaction');
var enums = require('../../components/utility/enums');
var base = require('../base/actioncreatorbase');
var SubmitActionCreator = (function (_super) {
    __extends(SubmitActionCreator, _super);
    function SubmitActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * when clicking on submit button
     * @param markGroupId The mark group id
     */
    SubmitActionCreator.prototype.submitResponseStarted = function (markGroupId) {
        dispatcher.dispatch(new submitResponseStartedAction(markGroupId));
    };
    /**
     * Submit response
     * @param submitResponseArgument
     * @param markSchemeGroupId
     * @param worklistType
     * @param remarkRequestType
     * @param selectedDisplayId
     */
    SubmitActionCreator.prototype.submitResponse = function (submitResponseArgument, markSchemeGroupId, worklistType, remarkRequestType, fromMarkschemepanel, selectedDisplayId, examinerRoleIds, markSchemeGroupIds) {
        if (remarkRequestType === void 0) { remarkRequestType = enums.RemarkRequestType.Unknown; }
        if (fromMarkschemepanel === void 0) { fromMarkschemepanel = false; }
        if (selectedDisplayId === void 0) { selectedDisplayId = undefined; }
        if (examinerRoleIds === void 0) { examinerRoleIds = null; }
        if (markSchemeGroupIds === void 0) { markSchemeGroupIds = null; }
        var that = this;
        submitResponseDataService.submitResponses(submitResponseArgument, markSchemeGroupId, worklistType, remarkRequestType, examinerRoleIds, markSchemeGroupIds, function (success, submitResponseReturn) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(submitResponseReturn, true, true)) {
                if (!success) {
                    submitResponseReturn = undefined;
                }
                dispatcher.dispatch(new submitResponseCompletedAction(success, submitResponseReturn, worklistType, fromMarkschemepanel, submitResponseArgument.examinerApproval, submitResponseArgument.markGroupIds, selectedDisplayId));
            }
        });
    };
    return SubmitActionCreator;
}(base));
var submitActionCreator = new SubmitActionCreator();
module.exports = submitActionCreator;
//# sourceMappingURL=submitactioncreator.js.map