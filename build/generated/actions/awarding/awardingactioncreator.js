"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var Promise = require('es6-promise');
var ActionCreatorBase = require('../base/actioncreatorbase');
var awardingIndicatorAction = require('./awardingindicatoraction');
var awardingDataService = require('../../dataservices/awarding/awardingdataservice');
var awardingComponentSelectAction = require('./awardingcomponentselectaction');
var componentAndSessionGetAction = require('./componentandsessiongetaction');
var awardingCandidateDetailsGetAction = require('./awardingcandidatedetailsgetaction');
var updateFilterforCandidateDataSelectAction = require('./updateFilterforCandidateDataSelectAction');
/**
 * Awarding action creator
 */
var AwardingActionCreator = (function (_super) {
    __extends(AwardingActionCreator, _super);
    function AwardingActionCreator() {
        _super.apply(this, arguments);
    }
    /**
     *  Gets the Awarding aceess details for showing the notification indicator
     */
    AwardingActionCreator.prototype.getAwardingAccessDetails = function () {
        var that = this;
        awardingDataService.getAwardingAccessDetails(function (succcess, awardingAccessDetails) {
            if (that.validateCall(awardingAccessDetails, false, true)) {
                if (!succcess) {
                    awardingAccessDetails = undefined;
                }
            }
            dispatcher.dispatch(new awardingIndicatorAction(succcess, awardingAccessDetails));
        });
    };
    /**
     * Dispatching the awarding component select option on selecting a component
     * @param componentId the id of selected component
     */
    AwardingActionCreator.prototype.selectAwardingComponent = function (examProductId, componentId, assessmentCode, viaUserOption) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new awardingComponentSelectAction(componentId, examProductId, assessmentCode, viaUserOption));
        }).catch();
    };
    /**
     *  Dispatching the action with component and session details for awarding
     */
    AwardingActionCreator.prototype.getAwardingComponentAndSessionDetails = function () {
        var that = this;
        awardingDataService.getComponentAndSessionDetails(function (succcess, data) {
            if (that.validateCall(data, false, true)) {
                if (!succcess) {
                    data = undefined;
                }
            }
            dispatcher.dispatch(new componentAndSessionGetAction(succcess, data));
        });
    };
    /**
     *  Dispatching the action with candidate details for the exam session
     */
    AwardingActionCreator.prototype.getAwardingCandidateDetails = function (examSessionId) {
        var that = this;
        awardingDataService.getAwardingCandidateDetails(function (succcess, data) {
            if (that.validateCall(data, false, true)) {
                if (!succcess) {
                    data = undefined;
                }
            }
            dispatcher.dispatch(new awardingCandidateDetailsGetAction(succcess, data, examSessionId));
        }, examSessionId);
    };
    /**
     * Dispatching the awarding component select option on selecting a component
     * @param componentId the id of selected component
     */
    AwardingActionCreator.prototype.updateFilterforCandidateData = function (selectedGrade, selectedTotalMark, orderByGrade) {
        new Promise.Promise(function (resolve, reject) {
            resolve();
        }).then(function () {
            dispatcher.dispatch(new updateFilterforCandidateDataSelectAction(selectedGrade, selectedTotalMark, orderByGrade));
        }).catch();
    };
    return AwardingActionCreator;
}(ActionCreatorBase));
var awardingActionCreator = new AwardingActionCreator();
module.exports = awardingActionCreator;
//# sourceMappingURL=awardingactioncreator.js.map