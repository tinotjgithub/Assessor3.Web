import enums = require('../../../components/utility/enums');
/**
 * Create Standardisation RIG Argument
 */
interface CreateStandardisationRIGData {
	examinerRoleID: number;
    candidateScriptID: number;
    markSchemeGroupID: number;
	markingMode: enums.MarkingMode;
	hasAutoMarkableQIGs?: boolean;
	distributeToExaminerRoleIDs?: Array<Number>;
    isWholeResponse: boolean;
    provisionalMarkingType: enums.ProvisionalMarkingType;
}
export = CreateStandardisationRIGData;