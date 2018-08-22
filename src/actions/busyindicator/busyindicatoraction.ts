import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');

/**
 * Action to show busy indicator during submit
 */
class BusyIndicatorAction extends action {

    private _busyIndicatorInvoker: enums.BusyIndicatorInvoker;

    /**
     * Constructor for SubmitBusyIndicatorAction
     * @param busyIndicatorInvoker The busy indicator invoker
     */
    constructor(busyindicatorInvoker: enums.BusyIndicatorInvoker) {
        super(action.Source.View, actionType.BUSY_INDICATOR);
        this._busyIndicatorInvoker = busyindicatorInvoker;
    }

/**
 * Gets the busy indicator invoker
 */
    get getBusyIndicatorInvoker() {
        return this._busyIndicatorInvoker;
    }
}
export = BusyIndicatorAction;