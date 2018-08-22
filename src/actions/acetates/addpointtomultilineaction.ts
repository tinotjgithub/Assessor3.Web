import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import acetateContextMenuData = require('../../components/utility/contextmenu/acetatecontextmenudata');

class AddPointToMultilineAction extends action {

    private _clientToken: string;
    private _x: number;
    private _y: number;
    private _acetateContextMenuData: acetateContextMenuData;
    private  _multilineItems: enums.MultiLineItems;

    constructor(
        clientToken: string,
        x: number,
        y: number,
        acetateContextMenuDetail: acetateContextMenuData,
        multilineItems: enums.MultiLineItems) {
        super(action.Source.View, actionType.ADD_POINT_TO_MULTILINE);
        this._clientToken = clientToken;
        this._x = x;
        this._y = y;
        this._acetateContextMenuData = acetateContextMenuDetail;
        this._multilineItems = multilineItems;
    }

    public get clientToken(): string {
        return this._clientToken;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get acetateContextMenuData(): acetateContextMenuData {
        return this._acetateContextMenuData;
    }

    public get multilineItems(): enums.MultiLineItems {
        return this._multilineItems;
    }
}

export = AddPointToMultilineAction;
