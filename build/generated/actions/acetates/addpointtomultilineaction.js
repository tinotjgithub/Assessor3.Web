"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var AddPointToMultilineAction = (function (_super) {
    __extends(AddPointToMultilineAction, _super);
    function AddPointToMultilineAction(clientToken, x, y, acetateContextMenuDetail, multilineItems) {
        _super.call(this, action.Source.View, actionType.ADD_POINT_TO_MULTILINE);
        this._clientToken = clientToken;
        this._x = x;
        this._y = y;
        this._acetateContextMenuData = acetateContextMenuDetail;
        this._multilineItems = multilineItems;
    }
    Object.defineProperty(AddPointToMultilineAction.prototype, "clientToken", {
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddPointToMultilineAction.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddPointToMultilineAction.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddPointToMultilineAction.prototype, "acetateContextMenuData", {
        get: function () {
            return this._acetateContextMenuData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddPointToMultilineAction.prototype, "multilineItems", {
        get: function () {
            return this._multilineItems;
        },
        enumerable: true,
        configurable: true
    });
    return AddPointToMultilineAction;
}(action));
module.exports = AddPointToMultilineAction;
//# sourceMappingURL=addpointtomultilineaction.js.map