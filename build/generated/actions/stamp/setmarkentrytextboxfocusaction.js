"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var SetMarkEntryTextboxFocusAction = (function (_super) {
    __extends(SetMarkEntryTextboxFocusAction, _super);
    /**
     * Constructor SetMarkEntryTextboxFocusAction
     */
    function SetMarkEntryTextboxFocusAction() {
        _super.call(this, action.Source.View, actionType.SET_MARKENTRY_TEXTBOX_FOCUS_ACTION);
    }
    return SetMarkEntryTextboxFocusAction;
}(action));
module.exports = SetMarkEntryTextboxFocusAction;
//# sourceMappingURL=setmarkentrytextboxfocusaction.js.map