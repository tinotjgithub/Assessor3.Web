/*
 * StandardisationTargetDetails type
 */
interface StandardisationCentreDetails extends ResponseBase {
    uniqueId: number;
    centrePartId: number;
    totalScripts: number;
    availableScripts: number;
    firstScanned: Date;
}