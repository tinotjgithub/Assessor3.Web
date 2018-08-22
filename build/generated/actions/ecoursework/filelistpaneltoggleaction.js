"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
/**
 * Action class for file list panel toggle
 */
var FileListPanelToggleAction = (function (_super) {
    __extends(FileListPanelToggleAction, _super);
    /**
     * Constructor for FileList Panel Toggle Action
     * @param {boolean} isFilelistPanelCollapsed
     */
    function FileListPanelToggleAction(isFilelistPanelCollapsed) {
        _super.call(this, action.Source.View, actionType.FILE_LIST_PANEL_TOGGLE_ACTION);
        this._isFilelistPanelCollapsed = isFilelistPanelCollapsed;
    }
    Object.defineProperty(FileListPanelToggleAction.prototype, "isFilelistPanelCollapsed", {
        /**
         * Returns whether the file list panel is collapsed or not
         * @returns
         */
        get: function () {
            return this._isFilelistPanelCollapsed;
        },
        enumerable: true,
        configurable: true
    });
    return FileListPanelToggleAction;
}(action));
module.exports = FileListPanelToggleAction;
//# sourceMappingURL=filelistpaneltoggleaction.js.map