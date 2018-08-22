/*
 * Interface to hold the SSU response details
 */
interface StandardisationSetupResponsedetailsList {
    standardisationResponses: Immutable.List<StandardisationResponseDetails>;
    hasNumericMark: boolean;
}