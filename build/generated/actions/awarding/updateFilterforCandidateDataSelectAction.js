"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdatefilterForCandidateDataSelectAction = (function (_super) {
    __extends(UpdatefilterForCandidateDataSelectAction, _super);
    function UpdatefilterForCandidateDataSelectAction(selectedGrade, selectedTotalMark, orderbyGrade) {
        _super.call(this, action.Source.View, actionType.UPDATE_FILTER_FOR_CANDIDATE_DATA_SELECTECTION);
        this._selectedGrade = selectedGrade;
        this._selectedTotalMark = selectedTotalMark;
        this._orderbyGrade = orderbyGrade;
    }
    Object.defineProperty(UpdatefilterForCandidateDataSelectAction.prototype, "selectedGrade", {
        get: function () {
            return this._selectedGrade;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatefilterForCandidateDataSelectAction.prototype, "selectedTotalMark", {
        get: function () {
            return this._selectedTotalMark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdatefilterForCandidateDataSelectAction.prototype, "orderByGrade", {
        get: function () {
            return this._orderbyGrade;
        },
        enumerable: true,
        configurable: true
    });
    return UpdatefilterForCandidateDataSelectAction;
}(action));
module.exports = UpdatefilterForCandidateDataSelectAction;
//# sourceMappingURL=updateFilterforCandidateDataSelectAction.js.map