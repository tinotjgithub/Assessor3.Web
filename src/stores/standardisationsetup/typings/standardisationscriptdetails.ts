/*
 * StandardisationTargetDetails type
 */
interface StandardisationScriptDetails extends ResponseBase {
	candidateScriptMarkGroupStatusId: number;
	// This property is true when any one of the markgroup is used for live marking for a candidate_script in multiQIG.
    isAllocatedForLiveMarking: boolean;
    isUsedForProvisionalMarking: boolean;
    documentId: number;
	hasAdditionalObjects: boolean;
	questionItems: string;
	// This property is true when the csmg status is greater than 31
	isAllocatedALive: boolean;
}