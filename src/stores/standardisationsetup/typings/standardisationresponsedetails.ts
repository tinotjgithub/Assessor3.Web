/*
 * Interface to hold the classified response details.
 */
interface StandardisationResponseDetails extends ResponseBase {
	markingModeId: number;
	relatedTotalMark: string;
	mcqMarksList: Immutable.Map<string, object>;
    note: string;
    noteRowVersion: string;
	examinerRoleId: number;
	hasUnknownZoneContent: boolean;
	isAllNR: boolean;
	isAllMarkSchemeCommented: boolean;
	isSTMSeed: boolean;
	isMandateCommentEnabled: boolean;
	specialistResponseType: string;
	standardisationMarks: Immutable.List<ResponseMarkDetails>;
	lastMarkerInitials: string;
	lastMarkerSurname: string;
	lastMarker: string;
	updatedDate: Date;
	originalSession: string;
	originalClassification: string;
	scriptID: number;
	originalMarksUpdated: boolean;
	timesReUsed: number;
	timesReUsedSession: number;
	lastUsed: string;
	reUsedQIG: boolean;
	hidden: boolean;
	updatesPending: boolean;
	reusedComponentTooltipData: Immutable.List<ComponentTooltip>;
	reusedSessionTooltipData: Immutable.List<ComponentTooltip>;
	provisionalExaminerId: number;
	provisionalMarkerInitials: string;
	provisionalMarkerSurname: string;
    esCandidateScriptMarkSchemeGroupId: number;
    esMarkGroupRowVersion: string;
    isSharedProvisional: boolean;
}

