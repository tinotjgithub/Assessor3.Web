import QIGSummary = require('./qigsummary');
import enums = require('../../../components/utility/enums');

interface OverviewData {
    qigSummary: Immutable.List<QIGSummary>;
    success: boolean;
    errorMessage: any;
    failureCode: enums.FailureCode;
    hasAnyQigWithHideInOverviewWhenNoWorkCCOn: boolean;
}

export = OverviewData;