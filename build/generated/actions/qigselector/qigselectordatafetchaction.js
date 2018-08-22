"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var QigSelectorDataFetchAction = (function (_super) {
    __extends(QigSelectorDataFetchAction, _super);
    /**
     * Constructor of QigSelectorDataFetchAction
     * @param success
     * @param qigToBeFetched
     * @param isDataForTheLoggedInUser
     * @param json
     * @param isFromSearch
     * @param isFromHistory
     * @param doEmit
     */
    function QigSelectorDataFetchAction(success, qigToBeFetched, isDataForTheLoggedInUser, json, isFromSearch, isFromHistory, isFromLocksInPopUp, doEmit, isFromMultiQigDropDown) {
        _super.call(this, action.Source.View, actionType.QIGSELECTOR, success, json);
        // Setting the QIG Selector data
        this.qigOverviewData = json;
        // Setting the QIG ID of the QIG's whose data are to be fetched
        this.qigToBeFetched = qigToBeFetched;
        this._isDataForTheLoggedInUser = isDataForTheLoggedInUser;
        this._isDataFromSearch = isFromSearch;
        this._isDataFromHistory = isFromHistory;
        this._isFromLocksInPopUp = isFromLocksInPopUp;
        this._doEmit = doEmit;
        this._isFromMultiQigDropDown = isFromMultiQigDropDown;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "getOverviewData", {
        // Returns the data for the QIG Selector
        get: function () {
            return this.qigOverviewData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "getQigToBeFetched", {
        // Returns the QIG ID of the QIG whose data are to be fetched
        get: function () {
            return this.qigToBeFetched;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "isDataForTheLoggedInUser", {
        // Returns flag that, the QIG data loaded for the logged in user or not
        get: function () {
            return this._isDataForTheLoggedInUser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "isDataFromSearch", {
        // Returns flag that, the QIG data loaded for from search
        get: function () {
            return this._isDataFromSearch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "isDataFromHistory", {
        // Property represents that, the QIG data loaded from menu history
        get: function () {
            return this._isDataFromHistory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "isFromLocksInPopUp", {
        get: function () {
            return this._isFromLocksInPopUp;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "doEmit", {
        // Returns true if event to be emitted
        get: function () {
            return this._doEmit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QigSelectorDataFetchAction.prototype, "isFromMultiQigDropDown", {
        // Returns true if this event is from multiqig drop down
        get: function () {
            return this._isFromMultiQigDropDown;
        },
        enumerable: true,
        configurable: true
    });
    return QigSelectorDataFetchAction;
}(dataRetrievalAction));
module.exports = QigSelectorDataFetchAction;
//# sourceMappingURL=qigselectordatafetchaction.js.map