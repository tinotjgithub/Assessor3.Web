import enums = require('../../../components/utility/enums');

interface MarkerInformation {
    initials: string;
    surname: string;
    approvalStatus: enums.ExaminerApproval;
    markerRoleID: number;
    supervisorInitials: string;
    supervisorSurname: string;
    supervisorExaminerId: number;
    isSupervisorLoggedOut: boolean;
    supervisorLogoutDiffInMinute: number;
    formattedSupervisorName: string;
    formattedExaminerName: string;
    supervisorLoginStatus: boolean;
    hasQualityFeedbackOutstanding: boolean;
    examinerId: number;
    examinerRoleId: number;
    currentExaminerApprovalStatus: enums.ExaminerApproval;
    supervisorExaminerRoleId: number;
    isSpecialist: boolean;
    esReviewerInitials: string;
    esReviewerSurname: string;
    esReviewerExaminerId: number;
    formattedEsReviewerName: string;
    isCurrentExaminerSpecialist: boolean;
}

export = MarkerInformation;