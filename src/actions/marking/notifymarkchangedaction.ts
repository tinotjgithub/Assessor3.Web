import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import warningNR = require('../../components/response/typings/warningnr');

class NotifyMarkChangedAction extends action {

    private _markingProgress: number;
    private _warningNR: warningNR;

    /**
     * Constructor
     * @param markingProgress
     */
    constructor(markingProgress: number, warningNR: warningNR) {
        super(action.Source.View, actionType.NOTIFY_MARK_CHANGE);

        this._markingProgress = markingProgress;
        this._warningNR = warningNR;
    }

    public get markingProgress(): number {
        return this._markingProgress;
    }

    /**
     * return collection of NR warning messageS based on NR cc  flag values and optionality .
     */
    public get warningNR(): warningNR {
        return this._warningNR;
    }
}

export = NotifyMarkChangedAction;