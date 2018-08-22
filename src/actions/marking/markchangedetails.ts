import enums = require('../../components/utility/enums');
class MarkChangeDetails {
    public mark: AllocatedMark;
    public markSchemeId: number;
    public markingOperation: enums.MarkingOperation;
    public candidateScriptId: number;
    public markingProgress: number;
    public isDirty: boolean;
    public totalMark: number;
    public totalMarkedMarkSchemes: number;
    public isAllNR: boolean;
    public usedInTotal: boolean;
    public isAllPagesAnnotated: boolean;
    public markGroupId: number; // respective RIG for Whole response scenario
	public overallMarkingProgress: number;
	public markSchemeCount: number; // total number of mark schemes
}
export = MarkChangeDetails;