import qigValidationResultBase = require('./qigvalidationresultbase');

class AggregatedQigValidationResult extends qigValidationResultBase {
    public displayAggregatedStatusText: boolean;
    public aggregatedMaxMarkingLimit: number;
    public aggregatedOpenResponsesCount: number;
    public aggregatedPendingResponsesCount: number;
    public aggregatedClosedResponsesCount: number;
    public aggregatedSubmittedResponsesCount: number;
}

export = AggregatedQigValidationResult;