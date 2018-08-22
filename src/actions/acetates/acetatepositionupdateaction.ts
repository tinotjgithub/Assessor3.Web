import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The Action class to update the acetate moving element properties
 */
class AcetatePositionUpdateAction extends action {

    private _acetate: Acetate;
    private _action: enums.AcetateAction;

    /**
     * Initializing a new instance.
     */
    constructor(acetate: Acetate, acetateAction: enums.AcetateAction) {
        super(action.Source.View, actionType.ACETATE_POSITION_UPDATE_ACTION);
        this._acetate = acetate;
        this._action = acetateAction;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', acetate.clientToken);
    }

    /**
     * get acetate property
     */
    public get acetate(): Acetate {
        return this._acetate;
    }

    /**
     * get acetate action
     */
    public get acetateAction(): enums.AcetateAction {
        return this._action;
    }
}

export = AcetatePositionUpdateAction;