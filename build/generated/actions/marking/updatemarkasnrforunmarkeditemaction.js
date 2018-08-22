"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to upadate mark as NR for unmarked mark scheme.
 */
var UpdateMarkAsNRForUnmarkedItemAction = (function (_super) {
    __extends(UpdateMarkAsNRForUnmarkedItemAction, _super);
    /**
     * Initializing a new instance.
     */
    function UpdateMarkAsNRForUnmarkedItemAction() {
        _super.call(this, action.Source.View, actionType.UPDATE_MARK_AS_NR_FOR_UNMARKED_ITEMS);
    }
    return UpdateMarkAsNRForUnmarkedItemAction;
}(action));
module.exports = UpdateMarkAsNRForUnmarkedItemAction;
//# sourceMappingURL=updatemarkasnrforunmarkeditemaction.js.map