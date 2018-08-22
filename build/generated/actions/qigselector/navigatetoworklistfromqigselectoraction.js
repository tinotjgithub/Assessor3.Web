"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var NavigateToWorklistFromQigSelectorAction = (function (_super) {
    __extends(NavigateToWorklistFromQigSelectorAction, _super);
    /**
     * Constructor of NavigateToWorklistFromQigSelectorAction
     */
    function NavigateToWorklistFromQigSelectorAction() {
        _super.call(this, action.Source.View, actionType.NAVIGATE_TO_WORKLIST_FROM_QIG_SELECTOR_ACTION);
    }
    return NavigateToWorklistFromQigSelectorAction;
}(action));
module.exports = NavigateToWorklistFromQigSelectorAction;
//# sourceMappingURL=navigatetoworklistfromqigselectoraction.js.map