import enums = require('../../components/utility/enums');
import historyBase = require('./historybase');

class TeamManagementHistoryInfo extends historyBase {
    public supervisorExaminerRoleID: number;
    public supervisorExaminerID: number;
    public subordinateExaminerRoleID: number;
    public subordinateExaminerID: number;
    public currentContainer: enums.PageContainers;
    public selectedTab: enums.TeamManagement;
}
export = TeamManagementHistoryInfo;