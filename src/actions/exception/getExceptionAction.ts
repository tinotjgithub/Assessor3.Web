import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');
/**
 * Action class for getting exceptions
 */
class GetExceptionAction extends dataRetrievalAction {

    private _exceptions: Immutable.List<ExceptionDetails>;

    private _getLinkedExceptions: boolean;

    /**
     * constructor
     * @param success
     * @param getExceptionsReturn
     * @param getLinkedExceptions
     */
    constructor(success: boolean, exceptionList: ExceptionList, getLinkedExceptions: boolean) {
        super(action.Source.View, actionType.GET_EXCEPTION_ACTION, success);

        if (success) {
            this._exceptions = Immutable.List(exceptionList.exceptions);
            this._getLinkedExceptions = getLinkedExceptions;
        } else {
            this._exceptions = undefined;
            this._getLinkedExceptions = false;
        }
    }


    /**
     * return List of exceptions
     */
    public get exceptions(): Immutable.List<ExceptionDetails> {
        return this._exceptions;
    }

    /**
     * return a boolean value if linked exceptions need to be loaded again
     */
    public get getLinkedExceptions(): boolean {
        return this._getLinkedExceptions;
    }


}

export = GetExceptionAction;