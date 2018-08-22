"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
/**
 * Class for UdateCurrentQuestionItem Action
 */
var UpdateCurrentQuestionItemAction = (function (_super) {
    __extends(UpdateCurrentQuestionItemAction, _super);
    /**
     * @Constructor.
     * @param {boolean} success
     * @param {treeViewItem} node
     */
    function UpdateCurrentQuestionItemAction(success, selectedNodeInfo, isCurrentQuestionItemChanged, forceUpdate) {
        _super.call(this, action.Source.View, actionType.UPDATE_SELECTED_QUESTION_ITEM, success);
        this._currentQuestionItemInfo = selectedNodeInfo;
        this._isCurrentQuestionItemChanged = isCurrentQuestionItemChanged;
        this._forceUpdate = forceUpdate;
    }
    Object.defineProperty(UpdateCurrentQuestionItemAction.prototype, "currentQuestionInfo", {
        /**
         * Returns the current question item.
         * @returns
         */
        get: function () {
            return this._currentQuestionItemInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateCurrentQuestionItemAction.prototype, "isCurrentQuestionItemChanged", {
        /**
         * Gets value indicating whether current markscheme has been changed.
         * @returns
         */
        get: function () {
            return this._isCurrentQuestionItemChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateCurrentQuestionItemAction.prototype, "isForceUpdate", {
        /**
         * Gets markscheme is loading status .
         */
        get: function () {
            return this._forceUpdate;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateCurrentQuestionItemAction;
}(dataRetrievalAction));
module.exports = UpdateCurrentQuestionItemAction;
//# sourceMappingURL=updatecurrentquestionitemaction.js.map