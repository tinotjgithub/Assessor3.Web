import action = require('../base/action');
import actionType = require('../base/actiontypes');

class ShowSimulationResponseSubmitConfirmationPopupAction extends action {

    private _markGroupId: number;
    private _isFromMarkScheme: boolean;

    /**
     * Constructor
     */
    constructor(markGroupId: number = 0, fromMarkScheme: boolean = false) {
        super(action.Source.View, actionType.SHOW_SIMULATION_RESPONSE_SUBMIT_CONFIRMATION_ACTION);
        this._markGroupId = markGroupId;
        this._isFromMarkScheme = fromMarkScheme;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{markGroupId}/, markGroupId.toString())
            .replace(/{markScheme}/, fromMarkScheme.toString());
    }

    /**
     * return mark group id
     */
    public get markGroupId(): number {
        return this._markGroupId;
    }

    /**
     * returns is the response submitting from markschemepanle or not
     */
    public get isFromMarkScheme(): boolean {
        return this._isFromMarkScheme;
    }
}

export = ShowSimulationResponseSubmitConfirmationPopupAction;