"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var mousePosition = require('../../stores/response/mouseposition');
var UpdateMousePositionAction = (function (_super) {
    __extends(UpdateMousePositionAction, _super);
    /**
     * Constructor UpdateMousePositionAction
     * @param xPosition
     * @param yPosition
     */
    function UpdateMousePositionAction(xPosition, yPosition) {
        _super.call(this, action.Source.View, actionType.MOUSE_POSITION_UPDATE);
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.setTheActionAsNotToBeLogged();
    }
    Object.defineProperty(UpdateMousePositionAction.prototype, "mousePosition", {
        get: function () {
            return new mousePosition(this.xPosition, this.yPosition);
        },
        enumerable: true,
        configurable: true
    });
    return UpdateMousePositionAction;
}(action));
module.exports = UpdateMousePositionAction;
//# sourceMappingURL=updatemousepositionaction.js.map