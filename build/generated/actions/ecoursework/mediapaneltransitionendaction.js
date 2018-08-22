"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for file list panel transition end event
 */
var MediaPanelTransitionEndAction = (function (_super) {
    __extends(MediaPanelTransitionEndAction, _super);
    /**
     * Constructor for FileList Panel Transition End Action
     */
    function MediaPanelTransitionEndAction() {
        _super.call(this, action.Source.View, actionType.MEDIA_PANEL_TRANSITION_END_ACTION);
    }
    return MediaPanelTransitionEndAction;
}(action));
module.exports = MediaPanelTransitionEndAction;
//# sourceMappingURL=mediapaneltransitionendaction.js.map