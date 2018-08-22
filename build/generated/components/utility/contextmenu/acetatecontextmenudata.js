"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var contextMenuData = require('./contextmenudata');
var enums = require('../enums');
var AcetateContextMenuData = (function (_super) {
    __extends(AcetateContextMenuData, _super);
    function AcetateContextMenuData() {
        _super.call(this);
        this.menuAction = enums.MenuAction.RemoveAnnotation;
        this._multilinearguments = {
            LineIndex: 0,
            Id: 0,
            PointIndex: 0,
            Xcordinate: 0,
            Ycordinate: 0,
            MultilineItem: enums.MultiLineItems.all,
            DefaultAcetatePoints: null,
            overlayHolderId: null,
            noOfPoints: 0,
            noOfLines: 0,
            LineColor: enums.OverlayColor.red,
            LineType: enums.LineType.line,
            isShared: false
        };
    }
    Object.defineProperty(AcetateContextMenuData.prototype, "multilinearguments", {
        get: function () {
            return this._multilinearguments;
        },
        enumerable: true,
        configurable: true
    });
    return AcetateContextMenuData;
}(contextMenuData));
module.exports = AcetateContextMenuData;
//# sourceMappingURL=acetatecontextmenudata.js.map