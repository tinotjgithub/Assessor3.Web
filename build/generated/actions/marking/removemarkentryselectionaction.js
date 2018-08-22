"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var RemoveMarkEntrySelectionAction = (function (_super) {
    __extends(RemoveMarkEntrySelectionAction, _super);
    /**
     * Constructor
     */
    function RemoveMarkEntrySelectionAction() {
        _super.call(this, action.Source.View, actionType.REMOVE_MARK_ENTRY_SELECTION);
    }
    return RemoveMarkEntrySelectionAction;
}(action));
module.exports = RemoveMarkEntrySelectionAction;
//# sourceMappingURL=removemarkentryselectionaction.js.map