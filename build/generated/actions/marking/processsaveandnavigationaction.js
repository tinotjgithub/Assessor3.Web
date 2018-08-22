"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var ProcessSaveAndNavigationAction = (function (_super) {
    __extends(ProcessSaveAndNavigationAction, _super);
    /**
     * Constructor
     */
    function ProcessSaveAndNavigationAction() {
        _super.call(this, action.Source.View, actionType.PROCESS_SAVE_AND_NAVIGATION_ACTION);
    }
    return ProcessSaveAndNavigationAction;
}(action));
module.exports = ProcessSaveAndNavigationAction;
//# sourceMappingURL=processsaveandnavigationaction.js.map