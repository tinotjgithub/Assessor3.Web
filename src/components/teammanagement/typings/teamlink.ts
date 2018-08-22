import enums = require('../../utility/enums');

interface TeamLink {
    linkName: enums.TeamManagement;
    isVisible: boolean;
    isSelected: boolean;
    subLinks: Array<TeamSubLink>;
}
export = TeamLink;