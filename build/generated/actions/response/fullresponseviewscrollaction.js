"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class for FRV scroll action
 */
var FullResponseViewScrollAction = (function (_super) {
    __extends(FullResponseViewScrollAction, _super);
    /**
     * Initializing a new instance of scroll action.
     */
    function FullResponseViewScrollAction() {
        _super.call(this, action.Source.View, actionType.FRV_SCROLL_ACTION);
    }
    return FullResponseViewScrollAction;
}(action));
module.exports = FullResponseViewScrollAction;
//# sourceMappingURL=fullresponseviewscrollaction.js.map