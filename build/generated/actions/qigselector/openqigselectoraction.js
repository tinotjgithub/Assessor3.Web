"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var OpenQigSelectorAction = (function (_super) {
    __extends(OpenQigSelectorAction, _super);
    /**
     * Constructor
     * @param userActionType
     */
    function OpenQigSelectorAction(userActionType) {
        _super.call(this, action.Source.View, userActionType);
    }
    return OpenQigSelectorAction;
}(action));
module.exports = OpenQigSelectorAction;
//# sourceMappingURL=openqigselectoraction.js.map