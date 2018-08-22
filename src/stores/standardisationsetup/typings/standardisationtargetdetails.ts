import standardisationTargetDetail = require('./standardisationtargetdetail');

/*
 * Interface to hold the left panel target details of standardisation setup
 */
interface StandardisationTargetDetails {
    standardisationTargetDetails: Immutable.List<standardisationTargetDetail>;
    provisionalCount: number;
    unclassifiedCount: number;
    classifiedCount: number;
}

export = StandardisationTargetDetails;