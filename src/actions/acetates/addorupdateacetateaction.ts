import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import acetateContextMenuData = require('../../components/utility/contextmenu/acetatecontextmenudata');

/**
 *  The add or update acetate action.
 */
class AddOrUpdateAcetateAction extends action {

    private _acetate: Acetate;
    private _markingOperation: enums.MarkingOperation;
    private _acetateContextMenuData: acetateContextMenuData;
    private _clientToken: string;

    /**
     * Constructor for adding or updating acetate.
     * @param acetateData
     * @param markingOperation
     * @param clientToken
     * @param acetateContextMenuData
     */
    constructor(acetate: Acetate,
        markingOperation: enums.MarkingOperation,
        clientToken: string,
        acetateContextMenuData: acetateContextMenuData) {
        super(action.Source.View, actionType.ADD_OR_UPDATE_ACETATE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{action}/g, markingOperation.toString());
        this._acetate = acetate;
        this._markingOperation = markingOperation;
        this._clientToken = clientToken;
        this._acetateContextMenuData = acetateContextMenuData;
    }

    /**
     * This will return the added or updated acetate data.
     */
    public get acetate(): Acetate {
        return this._acetate;
    }

    /**
     * This will return whether the acetate was added, updated or deleted.
     */
    public get markingOperation(): enums.MarkingOperation {
        return this._markingOperation;
    }

    /**
     * This will return client token of particular accetate.
     */
    public get clientToken(): string {
        return this._clientToken;
    }

    /**
     * This will return acetate Context Menu Data.
     */
    public get acetateContextMenuData(): acetateContextMenuData {
        return this._acetateContextMenuData;
    }
}

export = AddOrUpdateAcetateAction;
