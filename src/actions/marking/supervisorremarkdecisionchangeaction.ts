import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Class for supervisor remark change action
 */
class SupervisorRemarkDecisionChangeAction extends action {

    private _accuracyIndicator: enums.AccuracyIndicatorType;
    private _remarkDecision: enums.SupervisorRemarkDecisionType;

    /**
     * Constructor
     * @param accuracyIndicator
     * @param remarkDecision
     */
    constructor(accuracyIndicator: enums.AccuracyIndicatorType, remarkDecision: enums.SupervisorRemarkDecisionType) {
        super(action.Source.View, actionType.SUPERVISOR_REMARK_DECISION_CHANGE);
        this._accuracyIndicator = accuracyIndicator;
        this._remarkDecision = remarkDecision;
    }

    public get accuracyIndicator(): any {
        return this._accuracyIndicator;
    }

    public get remarkDecision(): any {
        return this._remarkDecision;
    }
}

export = SupervisorRemarkDecisionChangeAction;
