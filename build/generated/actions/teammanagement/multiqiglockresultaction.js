"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for retrieving Multi Qig Lock Result.
 */
var MultiQigLockResultAction = (function (_super) {
    __extends(MultiQigLockResultAction, _super);
    function MultiQigLockResultAction(multiLockResults) {
        _super.call(this, action.Source.View, actionType.MULTI_QIG_LOCK_RESULT);
        this._multiLockResults = multiLockResults;
    }
    Object.defineProperty(MultiQigLockResultAction.prototype, "multiQigLockResult", {
        /**
         * Returns Multi qig lock result
         */
        get: function () {
            return this._multiLockResults;
        },
        enumerable: true,
        configurable: true
    });
    return MultiQigLockResultAction;
}(action));
module.exports = MultiQigLockResultAction;
//# sourceMappingURL=multiqiglockresultaction.js.map