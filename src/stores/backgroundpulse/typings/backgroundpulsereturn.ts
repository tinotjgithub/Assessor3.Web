import enums = require('../../../components/utility/enums');

// Interface for handling Notification api return object
interface BackgroundPulseReturn {
    unreadMessageCount: number;
    isSupervisorLoggedOut: boolean;
    supervisorTimeSinceLastPingInMinutes: number;
    exceptionMessageCount: number;
    examinerApprovalStatus: enums.ExaminerApproval;
    unreadMandatoryMessageCount: number;
    role: enums.ExaminerRole;
    coordinationComplete: boolean;
}

export = BackgroundPulseReturn;