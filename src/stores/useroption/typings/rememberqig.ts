import enums = require('../../../components/utility/enums');

/** UserOption RememberQig interface */

class RememberQig {
    public qigId: number;
    public area: enums.QigArea;
    public worklistType: enums.WorklistType;
    public remarkRequestType: enums.RemarkRequestType;
    public tab: enums.TeamManagement;
    public examinerRoleId: number;
    public questionPaperPartId: number;
    public subordinateExaminerRoleID: number;
    public subordinateExaminerID: number;
    public standardisationSetupWorklistType: enums.StandardisationSetup;
}

export = RememberQig;