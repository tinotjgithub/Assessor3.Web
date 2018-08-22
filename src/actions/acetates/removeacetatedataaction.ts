import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import stringHelper = require('../../utility/generic/stringhelper');
import enums = require('../../components/utility/enums');
import acetateContextMenuData = require('../../components/utility/contextmenu/acetatecontextmenudata');
class RemoveAcetateDataAction extends action {
    private _clientToken: string;
    private _toolType: enums.ToolType;
    private _acetateContextMenuData: acetateContextMenuData;
    private _multilineItem: enums.MultiLineItems;
    /**
     * Constructor
     * @param removeAnnotationList
     * @param isPanAvoidImageContainerRender
     */
    constructor(clientToken: string, contextMenuType: enums.ToolType, multilineItem: enums.MultiLineItems,
        acetateContextMenuData: acetateContextMenuData) {
        super(action.Source.View, actionType.REMOVE_ACETATE_DATA_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, clientToken.toString());
        this._clientToken = clientToken;
        this._toolType = contextMenuType;
        this._acetateContextMenuData = acetateContextMenuData;
        this._multilineItem = multilineItem;
    }

    /**
     * Get clientToken of selected acetate
     */
    public get clienToken(): string {
        return this._clientToken;
    }


    /**
     * Get selected acetate Type
     */
    public get contextMenuType(): enums.ToolType {
        return this._toolType;
    }

    /**
     * Get selected acetate context menu data
     */
    public get acetateContextMenuData(): acetateContextMenuData {
        return this._acetateContextMenuData;
    }

    /**
     * Get selected acetate Type
     */
    public get multilineItem(): enums.MultiLineItems {
        return this._multilineItem;
    }
}

export = RemoveAcetateDataAction;