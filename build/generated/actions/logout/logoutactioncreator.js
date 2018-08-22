"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var logoutAction = require('./logoutaction');
var authenticationDataService = require('../../dataservices/authentication/authenticationdataservice');
var enums = require('../../components/utility/enums');
var marksAndAnnotationsSaveHelper = require('../../utility/marking/marksandannotationssavehelper');
var base = require('../base/actioncreatorbase');
var userInfoStore = require('../../stores/userinfo/userinfostore');
/**
 * Logout action creator helper class
 */
var LogoutActionCreator = (function (_super) {
    __extends(LogoutActionCreator, _super);
    function LogoutActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Update user session data
     * @param logoutData
     */
    LogoutActionCreator.prototype.updateUserSession = function (logoutData) {
        var that = this;
        logoutData.isReportsPageAccessed = userInfoStore.instance.isReportsPageSelected;
        marksAndAnnotationsSaveHelper.triggerMarksAndAnnotationsQueueProcessing(enums.SaveMarksAndAnnotationsProcessingTriggerPoint.Logout, function () {
            //needs to be save the pending items in the save marks and annotations queue.
            authenticationDataService.updateUserSession(logoutData, function (success, json) {
                // This will validate the call to find any network failure
                // and is mandatory to add this.
                if (that.validateCall(json, false, true, enums.WarningMessageAction.None, true)) {
                    dispatcher.dispatch(new logoutAction(success, json));
                }
            });
        });
    };
    return LogoutActionCreator;
}(base));
var logoutActionCreator = new LogoutActionCreator();
module.exports = logoutActionCreator;
//# sourceMappingURL=logoutactioncreator.js.map