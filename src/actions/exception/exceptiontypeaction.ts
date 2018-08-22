import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import Immutable = require('immutable');
/**
 * Action class for getting exception types
 */
class GetExceptionTypeAction extends dataRetrievalAction {

    private _exceptionTypes: Immutable.List<ExceptionTypeDetails>;
    /**
     * constructor
     * @param success
     * @param exceptionTypes
     */
    constructor(success: boolean, exceptionTypes: ExceptionTypes) {
        super(action.Source.View, actionType.GET_EXCEPTION_TYPE_ACTION, success);
        if (success) {
            this._exceptionTypes = Immutable.List(exceptionTypes.exceptionTypes);
        } else {
            this._exceptionTypes = undefined;
        }
    }


    /**
     * return List of exception types
     */
    public get exceptionTypes(): Immutable.List<ExceptionTypeDetails> {
        return this._exceptionTypes;
    }


}

export = GetExceptionTypeAction;