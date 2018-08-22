"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class to save the user preference for media player
 */
var MediaPlayerUserPreferenceSaveAction = (function (_super) {
    __extends(MediaPlayerUserPreferenceSaveAction, _super);
    // Constructor
    function MediaPlayerUserPreferenceSaveAction(docPageId, lastPlayedVolume, lastPlayedMediaTime) {
        _super.call(this, action.Source.View, actionType.MEDIA_PLAYER_USER_PREFERENCE_SAVE_ACTION);
        this._docPageID = docPageId;
        this._lastPlayedVolume = lastPlayedVolume;
        this._lastPlayedMediaTime = lastPlayedMediaTime;
    }
    Object.defineProperty(MediaPlayerUserPreferenceSaveAction.prototype, "lastPlayedVolume", {
        /**
         * Returns file's last played volume
         * @returns
         */
        get: function () {
            return this._lastPlayedVolume;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayerUserPreferenceSaveAction.prototype, "lastPlayedMediaTime", {
        /**
         * Returns file's last played media time
         * @returns
         */
        get: function () {
            return this._lastPlayedMediaTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaPlayerUserPreferenceSaveAction.prototype, "docPageID", {
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
    return MediaPlayerUserPreferenceSaveAction;
}(action));
module.exports = MediaPlayerUserPreferenceSaveAction;
//# sourceMappingURL=mediaplayeruserpreferencesaveaction.js.map