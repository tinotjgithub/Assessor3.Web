"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for changing source type for media player
 */
var MediaPlayerSourceChangeAction = (function (_super) {
    __extends(MediaPlayerSourceChangeAction, _super);
    /**
     * constructor
     */
    function MediaPlayerSourceChangeAction(docPageID, candidateScriptId, playerMode) {
        _super.call(this, action.Source.View, actionType.MEDIA_PLAYER_SOURCE_CHANGE_ACTION);
        this._sourceType = playerMode;
        this._docPageID = docPageID;
        this._candidateScriptId = candidateScriptId;
    }
    Object.defineProperty(MediaPlayerSourceChangeAction.prototype, "sourceType", {
        /**
         * Returns current source type
         * @returns
         */
        get: function () {
            return this._sourceType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayerSourceChangeAction.prototype, "docPageID", {
        /**
         * Returns page id of selected file.
         * @returns
         */
        get: function () {
            return this._docPageID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayerSourceChangeAction.prototype, "candidateScriptId", {
        /**
         * Returns candidate script id.
         * @returns
         */
        get: function () {
            return this._candidateScriptId;
        },
        enumerable: true,
        configurable: true
    });
    return MediaPlayerSourceChangeAction;
}(action));
module.exports = MediaPlayerSourceChangeAction;
//# sourceMappingURL=mediaplayersourcechangeaction.js.map