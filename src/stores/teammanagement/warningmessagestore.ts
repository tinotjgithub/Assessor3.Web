import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import storeBase = require('../base/storebase');
import actionType = require('../../actions/base/actiontypes');
import enums = require('../../components/utility/enums');
import validationAction = require('../../actions/teammanagement/validationaction');
import warningMessageNavigationAction = require('../../actions/teammanagement/warningmessagenavigationaction');

/**
 * Warning Message store
 */
class WarningMessageStore extends storeBase {

    // Warning message event
    public static WARNING_MESSAGE_EVENT = 'warningessageevent';

    // Warning message event
    public static WARNING_MESSAGE_NAVIGATION_EVENT = 'warningessagenavigationevent';

    /**
     * @constructor
     */
    constructor() {
        super();
        this._dispatchToken = dispatcher.register((action: action) => {
            switch (action.actionType) {
                case actionType.WARNING_MESSAGE_ACTION:
                    let validateAction = (action as validationAction);
                    this.emit(WarningMessageStore.WARNING_MESSAGE_EVENT,
                        validateAction.failureCode, validateAction.warningMessageAction);
                    break;
                case actionType.WARNING_MESSAGE_NAVIGATION_ACTION:
                    let navigationAction = (action as warningMessageNavigationAction);
                    this.emit(WarningMessageStore.WARNING_MESSAGE_NAVIGATION_EVENT,
                        navigationAction.failureCode, navigationAction.warningMessageAction);
                    break;
            }
        });
    }
}

let instance = new WarningMessageStore();
export = { WarningMessageStore, instance };
