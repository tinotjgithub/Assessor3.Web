import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import annotation = require('../../stores/response/typings/annotation');
import stringHelper = require('../../utility/generic/stringhelper');
import enums = require('../../components/utility/enums');
import contextMenuData = require('../../components/utility/contextmenu/contextmenudata');

class ContextMenuAction extends action {
    private _isVisible: boolean;
    private _xPos: number;
    private _yPos: number;
    private _contextMenuData: contextMenuData;

    /**
     * Constructor
     * @param isVisible
     * @param xPos
     * @param yPos
     * @param contextMenuData
     */
    constructor(isVisible: boolean, xPos?: number,
        yPos?: number, contextMenuData?: contextMenuData) {
        super(action.Source.View, actionType.CONTEXT_MENU_ACTION);
        this._isVisible = isVisible;
        this._xPos = xPos !== undefined ? xPos : 0;
        this._yPos = yPos !== undefined ? yPos : 0;
        this._contextMenuData = contextMenuData;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', this._xPos.toString())
            .replace('{1}', this._yPos.toString());
    }

    /**
     * Is context menu visible
     */
    public get isVisible(): boolean {
        return this._isVisible;
    }

    /**
     * Get x position
     */
    public get xPos(): number {
        return this._xPos;
    }

    /**
     * Get y position
     */
    public get yPos(): number {
        return this._yPos;
    }

    /**
     * Get ContextMenuData
     */
    public get contextMenuData(): contextMenuData {
        return this._contextMenuData;
    }
}

export = ContextMenuAction;