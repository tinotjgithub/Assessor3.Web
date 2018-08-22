"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for clearing the courseworkfile data
 */
var ClearEcourseworkDataAction = (function (_super) {
    __extends(ClearEcourseworkDataAction, _super);
    function ClearEcourseworkDataAction() {
        _super.call(this, action.Source.View, actionType.CLEAR_COURSEWORK_DATA_ACTION);
    }
    return ClearEcourseworkDataAction;
}(action));
module.exports = ClearEcourseworkDataAction;
//# sourceMappingURL=clearecourseworkdataaction.js.map