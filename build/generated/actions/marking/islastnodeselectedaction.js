"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var IsLastNodeSelectedAction = (function (_super) {
    __extends(IsLastNodeSelectedAction, _super);
    /**
     * Constructor
     * @param isLastNodeSelected
     */
    function IsLastNodeSelectedAction(isLastNodeSelected) {
        _super.call(this, action.Source.View, actionType.IS_LAST_NODE_SELECTED_ACTION);
        this._isLastNodeSelected = isLastNodeSelected;
    }
    Object.defineProperty(IsLastNodeSelectedAction.prototype, "isLastNodeSelected", {
        get: function () {
            return this._isLastNodeSelected;
        },
        enumerable: true,
        configurable: true
    });
    return IsLastNodeSelectedAction;
}(action));
module.exports = IsLastNodeSelectedAction;
//# sourceMappingURL=islastnodeselectedaction.js.map