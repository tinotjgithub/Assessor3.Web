import markingTargetSummary = require('./markingtargetsummary');
interface  MarkerProgressData {
    markingTargets: Immutable.List<markingTargetSummary>;
    success: boolean;
    errorMessage: any;
}

export = MarkerProgressData;