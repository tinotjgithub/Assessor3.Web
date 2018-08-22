import myTeamHelper = require('../../components/utility/grid/teammanagementhelpers/myteamhelper');
import teamExceptionHelper = require('../../components/utility/grid/teammanagementhelpers/teamexceptionhelper');
import enums = require('../../components/utility/enums');
import helpExaminersHelper = require('../../components/utility/grid/teammanagementhelpers/helpexaminershelper');
class TeamManagementListFactory {

    /**
     * returns the team management list helper object based on the type
     * @param teamManagementTab
     */
    public getTeamManagementlistHelper(teamManagementTab: enums.TeamManagement) {

        let teamManagementHelper;

        switch (teamManagementTab) {
            case enums.TeamManagement.MyTeam:
                teamManagementHelper = new myTeamHelper();
                break;
            case enums.TeamManagement.Exceptions:
                teamManagementHelper = new teamExceptionHelper();
                break;
            case enums.TeamManagement.HelpExaminers:
                teamManagementHelper = new helpExaminersHelper();
                break;
        }

        return teamManagementHelper;
    }
}

let teamManagementListFactory = new TeamManagementListFactory();
export = teamManagementListFactory;