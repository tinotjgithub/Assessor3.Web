"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dispatcher = require('../../app/dispatcher');
var storeBase = require('../base/storebase');
var actionType = require('../../actions/base/actiontypes');
var Immutable = require('immutable');
/**
 * Awarding store
 */
var AwardingStore = (function (_super) {
    __extends(AwardingStore, _super);
    /**
     * @constructor
     */
    function AwardingStore() {
        var _this = this;
        _super.call(this);
        this._expandedOrCollapsedItemList = Immutable.Map();
        this._dispatchToken = dispatcher.register(function (action) {
            switch (action.actionType) {
                case actionType.GET_AWARDING_ACCESS_DETAILS:
                    var awardingAccessDetailsData = action.awardingAccessDetailsData;
                    _this._hasAwardingAccess = awardingAccessDetailsData.hasAwardingAccess;
                    _this._hasPendingJudgement = awardingAccessDetailsData.hasPendingJudgement;
                    _this.emit(AwardingStore.AWARDING_ACCESS_DETAILS);
                    break;
                case actionType.AWARDING_COMPONENT_SELECT:
                    var _action = action;
                    _this._selectedExamProductID = _action.examProductId;
                    _this._selectedComponentId = _action.componentId;
                    _this._selectedComponentName = _action.assessmentCode;
                    _this._selectedSession = _this._componentList.find(function (x) { return x.componentId === _this._selectedComponentId &&
                        x.examProductId.toString() === _this._selectedExamProductID; });
                    _this._sessionList = _this._componentAndSessionCollection.filter(function (x) { return x.componentId === _this._selectedComponentId &&
                        x.examProductId.toString() === _this._selectedExamProductID; }).
                        toList();
                    _this._sessionList = _this._sessionList.groupBy(function (x) { return x.examSessionId; }).map(function (x) { return x.first(); }).toList();
                    _this.emit(AwardingStore.AWARDING_COMPONENT_SELECTED, _action.viaUserOption);
                    break;
                case actionType.COMPONENT_AND_SESSION_GET:
                    var _componentAndSessionGetAction = action;
                    _this._componentAndSessionCollection = Immutable.List(_componentAndSessionGetAction.
                        componentAndSessionList.awardingComponentAndSessionList);
                    /* Setting the first component as selected by default */
                    var firstComponent = (_this._componentAndSessionCollection) ?
                        _this._componentAndSessionCollection.groupBy(function (x) { return x.componentId
                            && x.examProductId; }).map(function (x) { return x.first(); }).first() : undefined;
                    _this._selectedComponentId = (firstComponent) ? firstComponent.componentId : _this._selectedComponentId;
                    _this._selectedExamProductID = (firstComponent) ? firstComponent.examProductId.toString() : _this._selectedExamProductID;
                    _this._selectedComponentName = (firstComponent) ? firstComponent.assessmentCode : _this._selectedComponentName;
                    /* Processing the components and session data collection and keep the distinct component in a collection*/
                    _this._selectedSession = firstComponent;
                    _this.processComponentData(_this._componentAndSessionCollection);
                    if (_this._selectedSession) {
                        _this.emit(AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED);
                    }
                    break;
                case actionType.CANDIDATE_DETAILS_GET:
                    var _candidateDetailsGetAction = action;
                    _this._candidateDetails = Immutable.List(_candidateDetailsGetAction.candidateDetailsList.awardingCandidateList);
                    _this._examSessionID = _candidateDetailsGetAction.selectedExamSessionId;
                    _this._gradeDetails = _this._candidateDetails.groupBy(function (x) { return x.grade; }).map(function (x) { return x.first(); }).toList();
                    _this._grades = _this._gradeDetails.sort(function (x, y) {
                        return x.grade.localeCompare(y.grade);
                    });
                    _this._selectedSession = _this._sessionList.find(function (x) { return (x.examSessionId === _this._examSessionID); });
                    _this._totalMarkDetails = _this._candidateDetails.groupBy(function (x) { return x.totalMark.toFixed(2); }).map(function (x) { return x.first(); }).toList();
                    _this._totalMarks = _this._totalMarkDetails.sort(function (x, y) {
                        return x.totalMark - y.totalMark;
                    });
                    if (_this._selectedSession) {
                        _this.emit(AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED);
                    }
                    break;
                /*TODO: THIS IS NOT NEEDED. HAVE TO REMOVE*/
                case actionType.UPDATE_FILTER_FOR_CANDIDATE_DATA_SELECTECTION:
                    var _filterAwardingCandidateDataGetAction = action;
                    _this._selectedGrade = _filterAwardingCandidateDataGetAction.selectedGrade;
                    _this._selectedTotalMark = _filterAwardingCandidateDataGetAction.selectedTotalMark;
                    _this._orderbyGrade = _filterAwardingCandidateDataGetAction.orderByGrade;
                    _this.emit(AwardingStore.AWARDING_CANDIDATE_DATA_FILTER_UPDATED);
                    break;
            }
        });
    }
    Object.defineProperty(AwardingStore.prototype, "hasAwardingAccess", {
        /**
         * Returns a value indicating whether the examiner has awarding access or not
         */
        get: function () {
            return this._hasAwardingAccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "hasPendingJudgement", {
        /**
         *  Returns a value indicating whether the examiner has pending judgement or not
         */
        get: function () {
            return this._hasPendingJudgement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "componentList", {
        /**
         * returns the distinct component collection for awarding
         */
        get: function () {
            return this._componentList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "selectedComponentId", {
        /**
         *  Returns the component id of the selected component
         */
        get: function () {
            return this._selectedComponentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "selectedExamProductId", {
        /**
         *  Returns the exam product id of the selected component
         */
        get: function () {
            return this._selectedExamProductID.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "sessionList", {
        /**
         * returns the distinct exam session for the selected component
         */
        get: function () {
            return this._sessionList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "selectedSession", {
        /**
         *  Returns the selected session name
         */
        get: function () {
            return this._selectedSession;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "gradeList", {
        /**
         * Returns a list grades for the selected exam session
         */
        get: function () {
            return this._grades;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "markList", {
        /**
         * Returns a list marks for the selected exam session
         */
        get: function () {
            return this._totalMarks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "awardingCandidateData", {
        /**
         * Retrieve awarding candidate grid data
         */
        get: function () {
            return this._candidateDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AwardingStore.prototype, "epandedOrCollapsedItem", {
        /**
         * return the expanded or collapsed items
         */
        get: function () {
            return this._expandedOrCollapsedItemList;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * set the distinct component collection in the local variable
     * @param componentAndSessionCollection
     */
    AwardingStore.prototype.processComponentData = function (componentAndSessionCollection) {
        var _this = this;
        if (this._selectedComponentId && componentAndSessionCollection) {
            this._componentList = componentAndSessionCollection.groupBy(function (x) { return x.componentId && x.examProductId; }).map(function (x) { return x.first(); }).toList();
            this._sessionList = componentAndSessionCollection.filter(function (x) { return x.componentId === _this._selectedComponentId
                && x.examProductId.toString() === _this._selectedExamProductID; }).toList();
            this._sessionList = this._sessionList.groupBy(function (x) { return x.examSessionId; }).map(function (x) { return x.first(); }).toList();
        }
    };
    AwardingStore.SET_PANEL_STATE = 'setAwardingLeftPanelState';
    AwardingStore.AWARDING_ACCESS_DETAILS = 'getAwardingAccessDetails';
    AwardingStore.AWARDING_COMPONENT_SELECTED = 'selectAwardingComponent';
    AwardingStore.AWARDING_COMPONENT_DATA_RETRIEVED = 'retrievedAwardingComponentData';
    AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED = 'retrievedAwardingCandidatetData';
    AwardingStore.AWARDING_CANDIDATE_DATA_FILTER_UPDATED = 'awardingcandidatedatafilterupdated';
    return AwardingStore;
}(storeBase));
var instance = new AwardingStore();
module.exports = { AwardingStore: AwardingStore, instance: instance };
//# sourceMappingURL=awardingstore.js.map