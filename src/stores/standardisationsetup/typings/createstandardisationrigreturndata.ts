import enums = require('../../../components/utility/enums');

/**
 * Create Standardisation RIG Data
 */
interface CreateStandardisationRIGReturnData {
	candidateScriptId: number;
	eSScriptMarkSchemeGroupId: number;
	examinerRoleId: number;
	markSchemeGroupId: number;
	markingMode: enums.MarkingMode;
	esMarkGroupId: number;
	displayId: number;
	createRigError: enums.CreateRigError;
	markSchemeGroupName: string;
}

export = CreateStandardisationRIGReturnData;