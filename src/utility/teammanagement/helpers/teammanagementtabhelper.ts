import enums = require('./../../../components/utility/enums');
import teamManagementStore = require('./../../../stores/teammanagement/teammanagementstore');
/** 
 * This helper class will return the selected team management tab for various stores.
 * @class TeamManagementTabHelper
 */
class TeamManagementTabHelper {
    /**
     * This property will return the currently selected team mangement tab for various stores.
     * @readonly
     * @static
     * @type {enums.TeamManagement}@memberof TeamManagementTabHelper
     */
    public static get selectedTeamManagementTab(): enums.TeamManagement {
        let selectedTeamManagementTab = undefined;
        if (teamManagementStore && teamManagementStore.instance) {
            selectedTeamManagementTab = teamManagementStore.instance.selectedTeamManagementTab;
        }
        return selectedTeamManagementTab;
    }
}

export = TeamManagementTabHelper;