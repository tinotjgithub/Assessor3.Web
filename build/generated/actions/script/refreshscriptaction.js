"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var RefreshScriptAction = (function (_super) {
    __extends(RefreshScriptAction, _super);
    /**
     * Constructor RefreshScriptAction
     * @param userActionType
     * @param imageData
     */
    function RefreshScriptAction(userActionType, imageData) {
        _super.call(this, action.Source.View, userActionType, true);
        this.imageData = imageData;
    }
    return RefreshScriptAction;
}(dataRetrievalAction));
module.exports = RefreshScriptAction;
//# sourceMappingURL=refreshscriptaction.js.map