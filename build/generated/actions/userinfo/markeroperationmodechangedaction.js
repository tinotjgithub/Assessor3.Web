"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Action class for marker operation change
 */
var MarkerOperationModeChangedAction = (function (_super) {
    __extends(MarkerOperationModeChangedAction, _super);
    /**
     * Consturctor
     * @param operationMode
     */
    function MarkerOperationModeChangedAction(operationMode, doLoadCurrentExaminerWorklist, isFromMenu) {
        _super.call(this, action.Source.View, actionType.MARKER_OPERATION_MODE_CHANGED_ACTION);
        this._operationMode = operationMode;
        this._isFromMenu = isFromMenu;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{operationMode}/g, enums.getEnumString(enums.MarkerOperationMode, this.operationMode));
    }
    Object.defineProperty(MarkerOperationModeChangedAction.prototype, "operationMode", {
        /**
         *  Returns the operation mode
         */
        get: function () {
            return this._operationMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerOperationModeChangedAction.prototype, "doLoadCurrentExaminerWorklist", {
        /**
         *  Returns the status whether to load examiner worklist or dont
         */
        get: function () {
            return this._doLoadCurrentExaminerWorklist;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkerOperationModeChangedAction.prototype, "isFromMenu", {
        /**
         *  Returns whether is from menu or not
         */
        get: function () {
            return this._isFromMenu;
        },
        enumerable: true,
        configurable: true
    });
    return MarkerOperationModeChangedAction;
}(action));
module.exports = MarkerOperationModeChangedAction;
//# sourceMappingURL=markeroperationmodechangedaction.js.map