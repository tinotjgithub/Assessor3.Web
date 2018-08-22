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
 * Action for fetching marking check recipients
 */
var MarkingCheckRecipientsFetchAction = (function (_super) {
    __extends(MarkingCheckRecipientsFetchAction, _super);
    /**
     * Constructor for Get Marking Check Information action
     */
    function MarkingCheckRecipientsFetchAction(markingCheckRecipientList, success) {
        _super.call(this, action.Source.View, actionType.GET_MARKING_CHECK_RECIPIENTS, success);
        this._markingCheckRecipientList = markingCheckRecipientList;
    }
    Object.defineProperty(MarkingCheckRecipientsFetchAction.prototype, "MarkingCheckRecipientList", {
        /**
         * Gets the marking check information
         */
        get: function () {
            return this._markingCheckRecipientList;
        },
        enumerable: true,
        configurable: true
    });
    return MarkingCheckRecipientsFetchAction;
}(dataRetrievalAction));
module.exports = MarkingCheckRecipientsFetchAction;
//# sourceMappingURL=markingcheckrecipientsfetchaction.js.map