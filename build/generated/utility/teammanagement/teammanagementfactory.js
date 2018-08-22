"use strict";
var myTeamHelper = require('../../components/utility/grid/teammanagementhelpers/myteamhelper');
var teamExceptionHelper = require('../../components/utility/grid/teammanagementhelpers/teamexceptionhelper');
var enums = require('../../components/utility/enums');
var helpExaminersHelper = require('../../components/utility/grid/teammanagementhelpers/helpexaminershelper');
var TeamManagementListFactory = (function () {
    function TeamManagementListFactory() {
    }
    /**
     * returns the team management list helper object based on the type
     * @param teamManagementTab
     */
    TeamManagementListFactory.prototype.getTeamManagementlistHelper = function (teamManagementTab) {
        var teamManagementHelper;
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
    };
    return TeamManagementListFactory;
}());
var teamManagementListFactory = new TeamManagementListFactory();
module.exports = teamManagementListFactory;
//# sourceMappingURL=teammanagementfactory.js.map