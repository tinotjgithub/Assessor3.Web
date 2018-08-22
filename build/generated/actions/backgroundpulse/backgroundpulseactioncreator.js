"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var backgroundPulseAction = require('./backgroundpulseaction');
var backgroundPulseDataService = require('../../dataservices/backgroundpulse/backgroundpulsedataservice');
var actionCreatorBase = require('../base/actioncreatorbase');
/**
 * Background pulse action creator helper class
 */
var BackgroundPulseActionCreator = (function (_super) {
    __extends(BackgroundPulseActionCreator, _super);
    function BackgroundPulseActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     * Call the background pulse service and then generate an appropriate notification action
     */
    BackgroundPulseActionCreator.prototype.handleBackgroundPulse = function (args) {
        var that = this;
        backgroundPulseDataService.handleBackgroundPulse(args, function (success, backgroundPulseReturnData) {
            // This will validate the call to find any network failure
            // and is mandatory to add this.
            if (that.validateCall(backgroundPulseReturnData)) {
                // Dispatch the background pulse action
                dispatcher.dispatch(new backgroundPulseAction(success, backgroundPulseReturnData));
            }
        });
    };
    return BackgroundPulseActionCreator;
}(actionCreatorBase));
var backgroundPulseActionCreator = new BackgroundPulseActionCreator();
module.exports = backgroundPulseActionCreator;
//# sourceMappingURL=backgroundpulseactioncreator.js.map