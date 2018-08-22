"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Class for rerendering wavy annotations for maintaining uniformity in thickness.
 */
var UpdateWavyAction = (function (_super) {
    __extends(UpdateWavyAction, _super);
    /**
     * Constructor UpdateWavyAction
     */
    function UpdateWavyAction() {
        _super.call(this, action.Source.View, actionType.UPDATE_WAVY_ANNOTATION_ACTION);
        this.auditLog.logContent = this.auditLog.logContent;
    }
    return UpdateWavyAction;
}(action));
module.exports = UpdateWavyAction;
//# sourceMappingURL=updatewavyaction.js.map