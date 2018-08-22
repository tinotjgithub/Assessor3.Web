"use strict";
var dispatcher = require('../../app/dispatcher');
var markerInformationAction = require('./markerinformationaction');
var markerInformationDataService = require('../../dataservices/markerinformation/markerinformationdataservice');
var Promise = require('es6-promise');
var enums = require('../../components/utility/enums');
/**
 * Class for populating logged in user's profile information.
 */
var MarkerInformationActionCreator = (function () {
    function MarkerInformationActionCreator() {
    }
    /**
     * Populate logged in user's profile information.
     * @param examinerRoleId
     * @param initiateDispatch - to handle wheteher we need to dispatch or not (dispatch  not needed for worklist initiation)
     */
    MarkerInformationActionCreator.prototype.GetMarkerInformation = function (examinerRoleID, markSchemeGroupId, initiateDispatch, useCache, currentApprovalStatus) {
        if (initiateDispatch === void 0) { initiateDispatch = true; }
        if (useCache === void 0) { useCache = false; }
        if (currentApprovalStatus === void 0) { currentApprovalStatus = enums.ExaminerApproval.None; }
        return new Promise.Promise(function (resolve, reject) {
            markerInformationDataService.GetMarkerInformation(examinerRoleID, markSchemeGroupId, function (success, json, isResultFromCache) {
                var markerDetails = JSON.parse(json);
                markerDetails.examinerRoleId = examinerRoleID;
                if (currentApprovalStatus > 0 && isResultFromCache) {
                    markerDetails.approvalStatus = currentApprovalStatus;
                }
                if (initiateDispatch) {
                    dispatcher.dispatch(new markerInformationAction(success, markerDetails));
                }
                resolve(markerDetails);
            }, useCache, currentApprovalStatus);
        });
    };
    return MarkerInformationActionCreator;
}());
var markerinformationactioncreator = new MarkerInformationActionCreator();
module.exports = markerinformationactioncreator;
//# sourceMappingURL=markerinformationactioncreator.js.map