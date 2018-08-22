"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var UpdateFavoriteStampCollectionAction = (function (_super) {
    __extends(UpdateFavoriteStampCollectionAction, _super);
    /**
     * Constructor
     * @param favoriteStampActionType
     * @param favoriteStampId
     * @param addFavoriteStampList
     */
    function UpdateFavoriteStampCollectionAction(favoriteStampActionType, addFavoriteStampId, addFavoriteStampList, insertedOverStampId) {
        _super.call(this, action.Source.View, actionType.FAVORITE_STAMP_UPDATED);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{stampId}/g, addFavoriteStampId !== undefined
            ? addFavoriteStampId.toString() : addFavoriteStampList.toArray().toString());
        this._favoriteStampId = addFavoriteStampId;
        this._favoriteStampActionType = favoriteStampActionType;
        this._favoriteStampList = addFavoriteStampList;
        this._insertedOverStampId = insertedOverStampId;
    }
    Object.defineProperty(UpdateFavoriteStampCollectionAction.prototype, "getFavoriteStampId", {
        /**
         * Get the favorite stamp id for adding or removing to/from favorite tool bar
         */
        get: function () {
            return this._favoriteStampId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateFavoriteStampCollectionAction.prototype, "getFavoriteStampActionType", {
        /**
         * Get the favorite stamp action type
         */
        get: function () {
            return this._favoriteStampActionType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateFavoriteStampCollectionAction.prototype, "getFavoriteStampListFromUserOption", {
        /**
         * Get the favorite stamp list from user option
         */
        get: function () {
            return this._favoriteStampList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UpdateFavoriteStampCollectionAction.prototype, "getInsertedOverStampId", {
        get: function () {
            return this._insertedOverStampId;
        },
        enumerable: true,
        configurable: true
    });
    return UpdateFavoriteStampCollectionAction;
}(action));
module.exports = UpdateFavoriteStampCollectionAction;
//# sourceMappingURL=updatefavoritestampcollectionaction.js.map