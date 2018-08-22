"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var FilelistPanelSwitchViewAction = (function (_super) {
    __extends(FilelistPanelSwitchViewAction, _super);
    /**
     * constructor
     * @param currentView
     * @param doEmit
     */
    function FilelistPanelSwitchViewAction(currentView, doEmit) {
        _super.call(this, action.Source.View, actionType.FILELIST_PANEL_SWITCH_VIEW_ACTION);
        this._doEmit = false;
        this._currentView = currentView;
        this._doEmit = doEmit;
    }
    Object.defineProperty(FilelistPanelSwitchViewAction.prototype, "currentView", {
        /**
         * return the current file list panel view
         */
        get: function () {
            return this._currentView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilelistPanelSwitchViewAction.prototype, "doEmit", {
        /**
         * returns true if it need to emit event
         */
        get: function () {
            return this._doEmit;
        },
        enumerable: true,
        configurable: true
    });
    return FilelistPanelSwitchViewAction;
}(action));
module.exports = FilelistPanelSwitchViewAction;
//# sourceMappingURL=filelistpanelswitchviewaction.js.map