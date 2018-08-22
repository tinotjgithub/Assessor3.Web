import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');
import localeStore = require('../../stores/locale/localestore');
/**
 * Action class for getting exceptions
 */
class RaiseExceptionAction extends dataRetrievalAction {

    private _raiseExceptionResponse: RaiseExceptionResponse;
    /**
     * constructor
     * @param success
     * @param raiseExceptionResponse
     */
    constructor(success: boolean, raiseExceptionResponse: RaiseExceptionResponse) {
        super(action.Source.View, actionType.RAISE_EXCEPTION_ACTION, success);
        let exceptionType = localeStore.instance.TranslateText('generic.exception-types.' +
            raiseExceptionResponse.exceptionType + '.name');
        this.auditLog.logContent = this.auditLog.logContent.replace('{exceptionType}', exceptionType);

        if (success) {
            this._raiseExceptionResponse = raiseExceptionResponse;
        } else {
            this._raiseExceptionResponse = undefined;
        }

    }


    /**
     * return List of raiseExceptionResponse
     */
    public get raiseExceptionResponse(): RaiseExceptionResponse {
        return this._raiseExceptionResponse;
    }

}

export = RaiseExceptionAction;