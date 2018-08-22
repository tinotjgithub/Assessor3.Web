"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var HideZoomPanelAction = (function (_super) {
    __extends(HideZoomPanelAction, _super);
    /**
     * Constructor HideZoomPanelAction
     */
    function HideZoomPanelAction() {
        _super.call(this, action.Source.View, actionType.HIDE_ZOOM_PANEL);
    }
    return HideZoomPanelAction;
}(action));
module.exports = HideZoomPanelAction;
//# sourceMappingURL=hidezoompanelaction.js.map