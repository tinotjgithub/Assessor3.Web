import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * The Action class to update the acetate moving element properties
 */
class AcetateInGreyAreaAction extends action {

    private _isInGreyArea: boolean;

    /**
     * Initializing a new instance.
     */
    constructor(isInGreyArea: boolean, clientToken: string) {
        super(action.Source.View, actionType.ACETATE_IN_GREY_AREA_ACTION);
        this._isInGreyArea = isInGreyArea;
        this.auditLog.logContent = this.auditLog.logContent.replace('{0}', clientToken)
            .replace('{1}', isInGreyArea.toString());
    }

    /**
     * get acetate property
     */
    public get isInGreyArea(): boolean {
        return this._isInGreyArea;
    }
}

export = AcetateInGreyAreaAction;