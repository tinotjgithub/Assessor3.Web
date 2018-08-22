import enums = require('../../../components/utility/enums');
import ExaminerDetails = require('../../../stores/response/typings/examinerdetails');
import teamManagementItem = require('./teammanagementitem');

interface SetSecondStandardisationReturn {
    examinerRoleId: number;
    markingCompletionDate: Date;
    approvalStatus: enums.ExaminerApproval;
    approvalStatusChangedDatetime: Date;
    maximumMarkingLimit: number;
    failureCode: number;
    success: boolean;
}

export = SetSecondStandardisationReturn;