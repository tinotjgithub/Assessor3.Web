import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for update exception status
 */
class UpdateExceptionStatusAction extends dataRetrievalAction {

    private _exceptionId: number;
    private _exceptionActionType: enums.ExceptionActionType;
    private _doNavigate: boolean = false;
    private _displayId: string;
    private _updateStatusExceptionReturnErrorCode: number;
    /**
     * constructor
     * @param success
     * @param exceptionId
     */
    constructor(success: boolean, exceptionId: number, exceptionActionType: enums.ExceptionActionType, doNavigate: boolean,
        displayId: string, updateStatusExceptionReturnErrorCode : number) {
        super(action.Source.View, actionType.UPDATE_EXCEPTION_STATUS, success);
        this.auditLog.logContent = this.auditLog.logContent.replace('{exceptionId}', exceptionId.toString());

        if (success) {
            this._exceptionId = exceptionId;
            this._exceptionActionType = exceptionActionType;
            this._displayId = displayId;
            this._updateStatusExceptionReturnErrorCode = updateStatusExceptionReturnErrorCode;
        } else {
            this._exceptionId = undefined;
        }
        this._doNavigate = doNavigate;
    }


    /**
     * return exception id
     */
    public get exceptionId(): number {
        return this._exceptionId;
    }

    /**
     * return exception action type
     */
    public get exceptionActionType(): number {
        return this._exceptionActionType;
    }

    /**
     * indicates whether the navigation has to be done
     */
    public get doNavigate(): boolean {
        return this._doNavigate;
    }

    /**
     * get displayId
     */
    public get displayId(): string {
        return this._displayId;
    }

    /**
     * get errorcode of exception updateStatus 
     */
    public get updateStatusExceptionReturnErrorCode(): number {
        return this._updateStatusExceptionReturnErrorCode;
    }


}

export = UpdateExceptionStatusAction;