"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var dataRetrievalAction = require('../base/dataretrievalaction');
/**
 * Action for fetching marking check information
 */
var MarkingCheckInformationFetchAction = (function (_super) {
    __extends(MarkingCheckInformationFetchAction, _super);
    /**
     * Constructor for Get Marking Check Information action
     */
    function MarkingCheckInformationFetchAction(markingCheckInfo, success) {
        _super.call(this, action.Source.View, actionType.GET_MARKING_CHECK_INFORMATION, success);
        this._markingCheckinfo = markingCheckInfo;
    }
    Object.defineProperty(MarkingCheckInformationFetchAction.prototype, "MarkingCheckInfo", {
        /**
         * Gets the marking check information
         */
        get: function () {
            return this._markingCheckinfo;
        },
        enumerable: true,
        configurable: true
    });
    return MarkingCheckInformationFetchAction;
}(dataRetrievalAction));
module.exports = MarkingCheckInformationFetchAction;
//# sourceMappingURL=markingcheckinformationfetchaction.js.map