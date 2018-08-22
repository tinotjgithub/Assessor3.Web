import enums = require('../../../components/utility/enums');
import ExaminerDetails = require('../../../stores/response/typings/examinerdetails');

interface SetExaminerStatusArguments {
    examinerRoleId: number;
    markSchemeGroupId?: number;
    examinerStatus?: enums.ExaminerApproval;
    reason?: string;
    hasReapprovalLimit?: number;
    examBodyId?: number;
    questionPaperPartId?: number;
    previousExaminerStatus?: enums.ExaminerApproval;
    loggedInExaminerRoleId?: number;
    IsReviewRemarks?: boolean;
    subordinateExaminerId: number;
}

export = SetExaminerStatusArguments;