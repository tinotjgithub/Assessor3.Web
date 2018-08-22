import enums = require('../../../components/utility/enums');

/**
 * Create Argument for update the es_markgroup marking mode 
 */
interface UpdateESMarkGroupMarkingModeData {
	esCandidateScriptMarkSchemeGroupId: number;
	candidateScriptId: number;
	markSchemeGroupId: number;
	markingModeId: enums.MarkingMode;
    rigOrder?: number;
    oldRigOrder?: number;
    isRigOrderUpdateRequired: boolean;
    previousMarkingModeId: enums.MarkingMode;
    displayId?: string;
	totalMarkValue?: number;
    assignNextRigOrder: boolean;
    esMarkGroupRowVersion: string;
}
export = UpdateESMarkGroupMarkingModeData;