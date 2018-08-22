import enums = require('../../../components/utility/enums');

interface TeamManagementItem {
    examiner_Role_ID: number;
    examiner_Initials: string;
    examiner_Surname: string;
    approval_Status: enums.ExaminerApproval;
    Approval_Date?: Date;
    Auto_Suspension_Count: number;
}

export = TeamManagementItem;