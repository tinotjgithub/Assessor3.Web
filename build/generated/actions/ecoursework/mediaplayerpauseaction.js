"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for pausing the media player when required
 */
var MediaPlayerPauseAction = (function (_super) {
    __extends(MediaPlayerPauseAction, _super);
    /**
     * constructor
     */
    function MediaPlayerPauseAction() {
        _super.call(this, action.Source.View, actionType.MEDIA_PLAYER_PAUSE_ACTION);
    }
    return MediaPlayerPauseAction;
}(action));
module.exports = MediaPlayerPauseAction;
//# sourceMappingURL=mediaplayerpauseaction.js.map