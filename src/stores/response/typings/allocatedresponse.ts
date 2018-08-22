import enums = require('../../../components/utility/enums');

/** AllocatedResponse interface */

interface AllocatedResponse {
    markGroupId: number;
    candidateScriptMarkGroupId: number;
    remarkRequestId: number;
    markingMode: enums.MarkingMode;
    isDoubleMarkingRemarkResponse: boolean;
    displayID: number;
    isWholeResponse: boolean;
}

export = AllocatedResponse;