import enums = require('../../../components/utility/enums');

/**
 * Class for holding examiner online status info
 */
class ActionExaminerOnlineStatusInfo {

   /**
    * Private variables
    */
    private _isExaminerLoggedOut: boolean;
    private _supervisorTimeSinceLastPingInMinutes: number;
    private _examinerApprovalStatus: enums.ExaminerApproval;
    private _role: enums.ExaminerRole;

   /**
    * This will return true if examiner is currently logged out else return false
    */
    public get isExaminerLoggedOut(): boolean {
        return this._isExaminerLoggedOut;
    }

   /**
    * This will return the examiner logout date difference in minutes.
    */
    public get supervisorTimeSinceLastPingInMinutes(): number {
        return this._supervisorTimeSinceLastPingInMinutes;
    }

   /**
    * This will return the examiner approval status.
    */
    public get examinerApprovalStatus(): enums.ExaminerApproval {
        return this._examinerApprovalStatus;
    }

    /**
     * This will return the role of the examiner.
     */
    public get role(): enums.ExaminerRole {
        return this._role;
    }

   /**
    * This will set the examiner loggedout field.
    */
    public set isExaminerLoggedOut(isExaminerLoggedOut: boolean) {
        this._isExaminerLoggedOut = isExaminerLoggedOut;
    }

   /**
    * This will set the examiner logout date difference in minutes.
    */
    public set supervisorTimeSinceLastPingInMinutes(supervisorTimeSinceLastPingInMinutes: number) {
        this._supervisorTimeSinceLastPingInMinutes = supervisorTimeSinceLastPingInMinutes;
    }

   /**
    * This will set the examiner approval status.
    */
    public set examinerApprovalStatus(examinerApprovalStatus: enums.ExaminerApproval) {
        this._examinerApprovalStatus = examinerApprovalStatus;
    }

    /**
     * This will set the role of the examiner.
     */
    public set role(role: enums.ExaminerRole) {
        this._role = role;
    }
}

export =  ActionExaminerOnlineStatusInfo;