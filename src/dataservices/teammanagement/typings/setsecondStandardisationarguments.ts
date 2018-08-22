import enums = require('../../../components/utility/enums');
import ExaminerDetails = require('../../../stores/response/typings/examinerdetails');

interface SetSecondStandardisationArguments {
    examinerRoleId: number;
    markingModeId: enums.MarkingMode;
    markSchemeGroupId: number;
    isSuspendedDuringStandardisation?: boolean;
    loggedInExaminerRoleId?: number;
    subordinateExaminerId: number;
}

export = SetSecondStandardisationArguments;