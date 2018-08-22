"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * The Action class to notify Response id rendered in response screen header
 */
var ResponseIdRenderedAction = (function (_super) {
    __extends(ResponseIdRenderedAction, _super);
    /**
     * Initializing a new instance of response search action.
     */
    function ResponseIdRenderedAction() {
        _super.call(this, action.Source.View, actionType.RESPONSE_ID_RENDERED_ACTION);
    }
    return ResponseIdRenderedAction;
}(action));
module.exports = ResponseIdRenderedAction;
//# sourceMappingURL=responseidrenderedaction.js.map