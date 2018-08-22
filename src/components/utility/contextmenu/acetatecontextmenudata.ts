import contextMenuData = require('./contextmenudata');
import Multilinearguments = require('../../../stores/markschemestructure/typings/multilinearguments');
import enums = require('../enums');
class AcetateContextMenuData extends contextMenuData  {
    private _multilinearguments: Multilinearguments;
    constructor() {
        super();
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
    public acetateToolType: enums.ToolType;
    public menuAction: enums.MenuAction = enums.MenuAction.RemoveAnnotation;
    public get multilinearguments(): Multilinearguments {
        return this._multilinearguments;
    }
}
export = AcetateContextMenuData;