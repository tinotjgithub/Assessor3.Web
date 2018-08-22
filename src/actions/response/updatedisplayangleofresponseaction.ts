import action = require('../base/action');
import actionType = require('../base/actiontypes');
class UpdateDisplayAngleOfResponseAction extends action {

    // Holds display angle of response   
    private _displayAngle: number;
    // Holds id of the rotated response
    private _responseId: string;
    //to reset collection
    private _reset: boolean;
    /**
     * Constructor UpdateDisplayAngleOfResponseAction
     * @param displayAngle
     * @param responseId
     * @param reset
     */
    constructor(displayAngle: number, responseId: string, reset: boolean) {
        super(action.Source.View, actionType.UPDATE_DISPLAY_ANGLE_OF_RESPONSE);
        this.auditLog.logContent = this.auditLog.logContent.replace('{direction}', displayAngle ? displayAngle.toString() : '0')
            .replace('{responseid}', responseId);
        this._displayAngle = displayAngle;
        this._responseId = responseId;
        this._reset = reset;
    }

    public get displayAngle() {
        return this._displayAngle;
    }

    public get responseId() {
        return this._responseId;
    }

    public get canReset() {
        return this._reset;
    }

}
export = UpdateDisplayAngleOfResponseAction;
