"use strict";
var dispatcher = require('../../app/dispatcher');
var responseDataService = require('../../dataservices/response/responsedataservice');
var acceptQualityFeedbackAction = require('./acceptqualityfeedbackaction');
var acceptQualityFeedbackArguments = require('../../dataservices/response/acceptqualityfeedbackarguments');
var AcceptQualityFeedbackActionCreator = (function () {
    function AcceptQualityFeedbackActionCreator() {
    }
    /**
     * Performs the accept quality feedback operation
     * @param markGroupId
     * @param examinerRoleId
     * @param markSchemeGroupId
     * @param navigateTo
     * @param navigateWorkListType
     */
    AcceptQualityFeedbackActionCreator.prototype.acceptQualityFeedback = function (markGroupId, examinerRoleId, markSchemeGroupId, navigateTo, navigateWorkListType) {
        var args = new acceptQualityFeedbackArguments(markGroupId, markSchemeGroupId, examinerRoleId);
        responseDataService.acceptQualityFeedback(args, function (data, success) {
            dispatcher.dispatch(new acceptQualityFeedbackAction(data, success, navigateTo, navigateWorkListType));
        });
    };
    return AcceptQualityFeedbackActionCreator;
}());
var acceptQualityFeedbackActionCreator = new AcceptQualityFeedbackActionCreator();
module.exports = acceptQualityFeedbackActionCreator;
//# sourceMappingURL=acceptqualityfeedbackactioncreator.js.map