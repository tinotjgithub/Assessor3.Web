"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var TeamSortAction = (function (_super) {
    __extends(TeamSortAction, _super);
    /**
     * Consturctor
     * @param sortDetails
     */
    function TeamSortAction(sortDetails) {
        _super.call(this, action.Source.View, actionType.TEAM_SORT_ACTION);
        this._sortDetails = sortDetails;
    }
    Object.defineProperty(TeamSortAction.prototype, "sortDetails", {
        /**
         * returns the sort details
         */
        get: function () {
            return this._sortDetails;
        },
        enumerable: true,
        configurable: true
    });
    return TeamSortAction;
}(action));
module.exports = TeamSortAction;
//# sourceMappingURL=teamsortaction.js.map