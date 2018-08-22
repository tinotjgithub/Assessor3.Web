"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var dataRetrievalAction = require('../base/dataretrievalaction');
var actionType = require('../base/actiontypes');
var CreateRemarkAction = (function (_super) {
    __extends(CreateRemarkAction, _super);
    /**
     * Constructor for create remark action
     * @param {number} markgroupId
     * @param {boolean} isMarkNowButtonClicked
     */
    function CreateRemarkAction(requestRemarkReturn, isMarkNowButtonClicked) {
        _super.call(this, action.Source.View, actionType.CREATE_SUPERVISOR_REMARK_ACTION, true);
        this.requestRemarkReturn = requestRemarkReturn;
        this.isMarkNowButonClicked = isMarkNowButtonClicked;
    }
    /**
     * Returns the mark group Id
     * @returns
     */
    CreateRemarkAction.prototype.getMarkGroupIds = function () {
        return this.requestRemarkReturn.markGroupIds;
    };
    /**
     * Returns whether the mark now button is clicked or not
     * @returns
     */
    CreateRemarkAction.prototype.isMarkNowButtonClicked = function () {
        return this.isMarkNowButonClicked;
    };
    return CreateRemarkAction;
}(dataRetrievalAction));
module.exports = CreateRemarkAction;
//# sourceMappingURL=createremarkaction.js.map