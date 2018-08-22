import dispatcher = require('../../app/dispatcher');
import enums = require('../../components/utility/enums');
import busyIndicatorAction = require('./busyindicatoraction');
import promise = require('es6-promise');

class BusyIndicatorActionCreator {
    /**
     * Show busy indicator upon submitting
     * @param busyIndicatorInvoker The busy indicator invoker
     */
    public setBusyIndicatorInvoker(busyIndicatorInvoker: enums.BusyIndicatorInvoker): void {
        new promise.Promise(function (resolve: any, reject: any) {
            resolve();
        }).then(() => {
            dispatcher.dispatch(new busyIndicatorAction(busyIndicatorInvoker));
        }).catch();
    }
}
let busyIndicatorActionCreator = new BusyIndicatorActionCreator();
/* exporting an instance of BusyIndicatorActionCreator */
export = busyIndicatorActionCreator;