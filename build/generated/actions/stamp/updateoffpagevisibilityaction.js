"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateOffPageVisibilityAction = (function (_super) {
    __extends(UpdateOffPageVisibilityAction, _super);
    /**
     * Constructor UpdateOffPageVisibility
     *
     */
    function UpdateOffPageVisibilityAction() {
        _super.call(this, action.Source.View, actionType.UPDATE_OFFPAGE_VISIBILITY_STATUS_ACTION);
    }
    return UpdateOffPageVisibilityAction;
}(action));
module.exports = UpdateOffPageVisibilityAction;
//# sourceMappingURL=updateoffpagevisibilityaction.js.map