"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class setting selected question item index
 */
var SetSelectedQuestionItemAction = (function (_super) {
    __extends(SetSelectedQuestionItemAction, _super);
    /**
     * constructor
     * @param set selected question item index
     */
    function SetSelectedQuestionItemAction(index, uniqueId) {
        _super.call(this, action.Source.View, actionType.SET_SELECTED_QUESTION_ITEM_ACTION);
        // selected question item index
        this._selectedQuestionItemIndex = 0;
        this._selectedQuestionItemUniqueId = 0;
        this._selectedQuestionItemIndex = index;
        this._selectedQuestionItemUniqueId = uniqueId;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', index.toString());
    }
    Object.defineProperty(SetSelectedQuestionItemAction.prototype, "getSelectedQuestionItemIndex", {
        /* return the selected question item index */
        get: function () {
            return this._selectedQuestionItemIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SetSelectedQuestionItemAction.prototype, "getSelectedQuestionItemUniqueId", {
        get: function () {
            return this._selectedQuestionItemUniqueId;
        },
        enumerable: true,
        configurable: true
    });
    return SetSelectedQuestionItemAction;
}(action));
module.exports = SetSelectedQuestionItemAction;
//# sourceMappingURL=setselectedquestionitemaction.js.map