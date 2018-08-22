import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 *  The select acetates action
 */
class SelectAcetateAction extends action {

    private _acetateType: enums.ToolType;

    /**
     * Constructor for SelectAcetate action
     * @param acetateType
     */
    constructor(acetateType: enums.ToolType) {
        super(action.Source.View, actionType.SELECT_ACETATE_ACTION);
        this.auditLog.logContent = this.auditLog.logContent.replace(/{acetate}/g, acetateType.toString());
        this._acetateType = acetateType;
    }

    /**
     * This will return the added acetate type.
     */
    public get acetateType(): enums.ToolType {
        return this._acetateType;
    }
}

export = SelectAcetateAction;
