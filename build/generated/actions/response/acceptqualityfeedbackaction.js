"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AcceptQualityFeedbackAction = (function (_super) {
    __extends(AcceptQualityFeedbackAction, _super);
    /**
     * Initializing a new instance of allocate action.
     * @param {boolean} success
     */
    function AcceptQualityFeedbackAction(data, success, navigateTo, navigateWorkListType) {
        _super.call(this, action.Source.View, actionType.ACCEPT_QUALITY_ACTION);
        this._acceptQualityFeedbackActionData = data;
        this._navigateTo = navigateTo;
        this._navigateWorkListType = navigateWorkListType;
    }
    Object.defineProperty(AcceptQualityFeedbackAction.prototype, "acceptQualityFeedbackActionData", {
        get: function () {
            return this._acceptQualityFeedbackActionData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AcceptQualityFeedbackAction.prototype, "navigateTo", {
        /**
         * returns navigate to value
         */
        get: function () {
            return this._navigateTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AcceptQualityFeedbackAction.prototype, "navigateWorkListType", {
        get: function () {
            return this._navigateWorkListType;
        },
        enumerable: true,
        configurable: true
    });
    return AcceptQualityFeedbackAction;
}(action));
module.exports = AcceptQualityFeedbackAction;
//# sourceMappingURL=acceptqualityfeedbackaction.js.map