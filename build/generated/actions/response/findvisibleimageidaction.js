"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var enums = require('../../components/utility/enums');
/**
 * Action class for container ImageId finding action.
 */
var FindVisibleImageIdAction = (function (_super) {
    __extends(FindVisibleImageIdAction, _super);
    /**
     * Constructor FindVisibleImageIdAction
     * @param doEmit
     */
    function FindVisibleImageIdAction(doEmit, fracsDataSource) {
        _super.call(this, action.Source.View, actionType.FIND_VISIBLE_IMAGE_ID);
        this._doEmit = false;
        this._fracsDataSource = enums.FracsDataSetActionSource.None;
        this._doEmit = doEmit;
        this._fracsDataSource = fracsDataSource;
    }
    Object.defineProperty(FindVisibleImageIdAction.prototype, "doEmit", {
        /**
         * This method will return if this action need to emit or not.
         */
        get: function () {
            return this._doEmit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FindVisibleImageIdAction.prototype, "fracsDataSource", {
        /**
         * This method will return the source of fracs data set action.
         */
        get: function () {
            return this._fracsDataSource;
        },
        enumerable: true,
        configurable: true
    });
    return FindVisibleImageIdAction;
}(action));
module.exports = FindVisibleImageIdAction;
//# sourceMappingURL=findvisibleimageidaction.js.map