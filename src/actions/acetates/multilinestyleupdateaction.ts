import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import acetateContextMenuData = require('../../components/utility/contextmenu/acetatecontextmenudata');
import enums = require('../../components/utility/enums');

class MultilineStyleUpdateAction extends action {

    private _clientToken: string;
    private _clientX: number;
    private _clientY: number;
    private _acetateContextMenuData: acetateContextMenuData;
    private _multiLineItems: enums.MultiLineItems;

    constructor(clientToken: string, clientX: number, clientY: number,
        acetateContextMenuData: acetateContextMenuData, multiLineItems: enums.MultiLineItems) {
        super(action.Source.View, actionType.MULTILINE_STYLE_UPDATE);
        this._clientToken = clientToken;
        this._clientX = clientX;
        this._clientY = clientY;
        this._acetateContextMenuData = acetateContextMenuData;
        this._multiLineItems = multiLineItems;
    }

    /* returns clientToken */
    public get clientToken(): string {
        return this._clientToken;
    }

    /* returns clientX */
    public get clientX(): number {
        return this._clientX;
    }

    /* returns clientY */
    public get clientY(): number {
        return this._clientY;
    }

    /* returns acetate Context Menu Data */
    public get acetateContextMenuData(): acetateContextMenuData {
        return this._acetateContextMenuData;
    }

    /* returns multiLine Items */
    public get multiLineItems(): enums.MultiLineItems {
        return this._multiLineItems;
    }

}

export = MultilineStyleUpdateAction;
