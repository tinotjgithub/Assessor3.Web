"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action = require('../base/action');
var actionType = require('../base/actiontypes');
var MultilineStyleUpdateAction = (function (_super) {
    __extends(MultilineStyleUpdateAction, _super);
    function MultilineStyleUpdateAction(clientToken, clientX, clientY, acetateContextMenuData, multiLineItems) {
        _super.call(this, action.Source.View, actionType.MULTILINE_STYLE_UPDATE);
        this._clientToken = clientToken;
        this._clientX = clientX;
        this._clientY = clientY;
        this._acetateContextMenuData = acetateContextMenuData;
        this._multiLineItems = multiLineItems;
    }
    Object.defineProperty(MultilineStyleUpdateAction.prototype, "clientToken", {
        /* returns clientToken */
        get: function () {
            return this._clientToken;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultilineStyleUpdateAction.prototype, "clientX", {
        /* returns clientX */
        get: function () {
            return this._clientX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultilineStyleUpdateAction.prototype, "clientY", {
        /* returns clientY */
        get: function () {
            return this._clientY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultilineStyleUpdateAction.prototype, "acetateContextMenuData", {
        /* returns acetate Context Menu Data */
        get: function () {
            return this._acetateContextMenuData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MultilineStyleUpdateAction.prototype, "multiLineItems", {
        /* returns multiLine Items */
        get: function () {
            return this._multiLineItems;
        },
        enumerable: true,
        configurable: true
    });
    return MultilineStyleUpdateAction;
}(action));
module.exports = MultilineStyleUpdateAction;
//# sourceMappingURL=multilinestyleupdateaction.js.map