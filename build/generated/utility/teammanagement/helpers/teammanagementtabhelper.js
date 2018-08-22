"use strict";
var teamManagementStore = require('./../../../stores/teammanagement/teammanagementstore');
/**
 * This helper class will return the selected team management tab for various stores.
 * @class TeamManagementTabHelper
 */
var TeamManagementTabHelper = (function () {
    function TeamManagementTabHelper() {
    }
    Object.defineProperty(TeamManagementTabHelper, "selectedTeamManagementTab", {
        /**
         * This property will return the currently selected team mangement tab for various stores.
         * @readonly
         * @static
         * @type {enums.TeamManagement}@memberof TeamManagementTabHelper
         */
        get: function () {
            var selectedTeamManagementTab = undefined;
            if (teamManagementStore && teamManagementStore.instance) {
                selectedTeamManagementTab = teamManagementStore.instance.selectedTeamManagementTab;
            }
            return selectedTeamManagementTab;
        },
        enumerable: true,
        configurable: true
    });
    return TeamManagementTabHelper;
}());
module.exports = TeamManagementTabHelper;
//# sourceMappingURL=teammanagementtabhelper.js.map