import enums = require('../../../components/utility/enums');
import ExaminerDetails = require('../../../stores/response/typings/examinerdetails');
import teamManagementItem = require('./teammanagementitem');

interface SetExaminerStatusReturn {
    examinerDetails: teamManagementItem;
    validationMessage: string;
    approvalOutcome: enums.ApprovalOutcome;
    failureCode: number;
    success: boolean;
}

export = SetExaminerStatusReturn;