"use strict";
var enums = require('../../components/utility/enums');
var AcetateContextMenuData = (function () {
    function AcetateContextMenuData() {
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
}());
module.exports = AcetateContextMenuData;
//# sourceMappingURL=acetatecontextmenudata.js.map