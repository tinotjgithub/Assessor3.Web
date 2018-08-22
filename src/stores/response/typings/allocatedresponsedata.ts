import allocatedResponse = require('./allocatedresponse');
import enums = require('../../../components/utility/enums');

/** AllocatedResponseData */
interface AllocatedResponseData {
    allocatedResponseItems: allocatedResponse[];
    responseAllocationErrorCode: enums.ResponseAllocationErrorCode;
    success: boolean;
    errorMessage: string;
    examinerApprovalStatus: enums.ExaminerApproval;
}

export = AllocatedResponseData;