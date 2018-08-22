"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Action class for Full Response View Option Changed Action.
 */
var FullResponseViewOptionChangedAction = (function (_super) {
    __extends(FullResponseViewOptionChangedAction, _super);
    /**
     * Constructor FullResponseViewOptionChangedAction
     * @param success
     * @param fullResponseViewOption
     */
    function FullResponseViewOptionChangedAction(success, fullResponseViewOption) {
        _super.call(this, action.Source.View, actionType.FULL_RESPONSE_VIEW_OPTION_CHANGED, success);
        this._fullResponseViewOption = fullResponseViewOption;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }
    Object.defineProperty(FullResponseViewOptionChangedAction.prototype, "fullResponseViewOption", {
        /**
         * returns the full response view option.
         */
        get: function () {
            return this._fullResponseViewOption;
        },
        enumerable: true,
        configurable: true
    });
    return FullResponseViewOptionChangedAction;
}(dataRetrievalAction));
module.exports = FullResponseViewOptionChangedAction;
//# sourceMappingURL=fullresponseviewoptionchangedaction.js.map