import enums = require('../../components/utility/enums');
import worklistHistoryInfo = require('./worklisthistoryinfo');
import teamManagementHistoryInfo = require('./teammanagementhistoryinfo');
import standardisationSetupHistoryInfo = require('./standardisationsetuphistoryinfo');

class HistoryItem {
    public myMarking: worklistHistoryInfo;
    public team: teamManagementHistoryInfo;
    public standardisationSetup: standardisationSetupHistoryInfo;
    public qigId: number;
    public qigName: string;
    public timeStamp: number;
    public isMarkingEnabled: boolean;
    public isTeamManagementEnabled: boolean;
    public isStandardisationSetupEnabled: boolean;
    public questionPaperPartId: number;
    public examinerRoleId: number;
    public markingMethodId: number;
    public isElectronicStandardisationTeamMember: boolean;
}
export = HistoryItem;