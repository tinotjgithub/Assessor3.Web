import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import enums = require('../../components/utility/enums');
import busyIndicatorAction = require('../../actions/busyindicator/busyindicatoraction');

/* The busy indicator store */
class BusyIndicatorStore extends storeBase {
    private busyIndicatorInvoker: enums.BusyIndicatorInvoker;
    public static BUSY_INDICATOR = 'setBusyIndicatorInvoker';

    /**
     * @constructor
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: action) => {
            if (action.actionType === actionType.BUSY_INDICATOR) {
                this.busyIndicatorInvoker = (action as busyIndicatorAction).getBusyIndicatorInvoker;
                this.emit(BusyIndicatorStore.BUSY_INDICATOR);
            }
        });
    }

/**
 * Returns the busy indicator invoker
 * @returns
 */
    public get getBusyIndicatorInvoker(): enums.BusyIndicatorInvoker {
        return this.busyIndicatorInvoker;
    }
}

let instance = new BusyIndicatorStore();
export = { BusyIndicatorStore, instance };