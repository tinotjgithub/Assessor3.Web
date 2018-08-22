"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AdditionalObjectFlagSaveAction = (function (_super) {
    __extends(AdditionalObjectFlagSaveAction, _super);
    /**
     * Constructor Additional Object Flag Save Action
     * @param additionalObjectFlag
     * @param displayid
     */
    function AdditionalObjectFlagSaveAction(additionalObjectFlag, displayid) {
        _super.call(this, action.Source.View, actionType.ADDITIONAL_OBJECT_FLAG_SAVE_ACTION);
        this._additionalObjectFlag = additionalObjectFlag;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{count}/g, additionalObjectFlag.count().toString()).replace(/{responseid}/g, displayid.toString());
    }
    Object.defineProperty(AdditionalObjectFlagSaveAction.prototype, "additionalObjectFlagCollection", {
        /**
         * returns the additional object flag collection.
         */
        get: function () {
            return this._additionalObjectFlag;
        },
        enumerable: true,
        configurable: true
    });
    return AdditionalObjectFlagSaveAction;
}(action));
module.exports = AdditionalObjectFlagSaveAction;
//# sourceMappingURL=additionalobjectflagsaveaction.js.map