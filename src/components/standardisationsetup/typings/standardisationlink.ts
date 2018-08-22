import enums = require('../../utility/enums');

interface StandardisationLink {
    linkName: enums.StandardisationSetup;
    targetCount: number;
    isVisible: boolean;
    isSelected: boolean;
}
export = StandardisationLink;