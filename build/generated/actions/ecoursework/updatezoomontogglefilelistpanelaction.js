"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for updating zoom on file list panel toggle
 */
var UpdateZoomOnToggleFileListPanelAction = (function (_super) {
    __extends(UpdateZoomOnToggleFileListPanelAction, _super);
    /**
     * Constructor for UpdateZoomOnToggleFileListPanelAction
     */
    function UpdateZoomOnToggleFileListPanelAction() {
        _super.call(this, action.Source.View, actionType.UPDATE_ZOOM_ON_TOGGLE_FILE_LIST_PANEL);
    }
    return UpdateZoomOnToggleFileListPanelAction;
}(action));
module.exports = UpdateZoomOnToggleFileListPanelAction;
//# sourceMappingURL=updatezoomontogglefilelistpanelaction.js.map