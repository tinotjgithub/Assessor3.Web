import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for exception panel actions
 */
class ExceptionWindowAction extends action {

    private _exceptionId: number;
    private _exceptionAction: enums.ExceptionViewAction;
    private _navigateTo: enums.SaveAndNavigate;
    private _navigateFrom: enums.SaveAndNavigate;
    private _responseNavigationFrom: enums.ResponseNavigation;

    /**
     * constructor
     * @param exceptionAction
     * @param exceptionId
     * @param navigateTo
     */
    constructor(exceptionAction: enums.ExceptionViewAction, exceptionId: number, navigateTo: enums.SaveAndNavigate,
        navigateFrom: enums.SaveAndNavigate = enums.SaveAndNavigate.none, responseNavigationFrom?: enums.ResponseNavigation) {
        super(action.Source.View, actionType.EXCEPTION_ACTION);
        this._exceptionId = exceptionId;
        this._exceptionAction = exceptionAction;
        this._navigateTo = navigateTo;
        this._navigateFrom = navigateFrom;
        this._responseNavigationFrom = responseNavigationFrom;

        this.auditLog.logContent = this.auditLog.logContent.replace('{windowaction}', enums.ExceptionViewAction[exceptionAction]);
    }


    /**
     * return exception id
     */
    public get exceptionId(): number {
        return this._exceptionId;
    }

    /*
     *Return view type
     */

    public get exceptionAction(): enums.ExceptionViewAction {
        return this._exceptionAction;
    }

    /**
     * returns navigate to value
     */
    public get navigateTo() {
        return this._navigateTo;
    }

    /**
     * Returns navigate from value
     */

    public get navigateFrom() {
        return this._navigateFrom;
    }

    /* returns from where the response navigation happened */
    public get responseNavigationFrom() {
        return this._responseNavigationFrom;
    }
}

export = ExceptionWindowAction;