import enums = require('../../../components/utility/enums');

interface ExaminerMark {
    markId: number;
    candidateScriptId: number;
    examinerRoleId: number;
    markGroupId: number;
    markSchemeId: number;
    numericMark: number;
    markStatus: string;
    markingComplete?: boolean;
    examinerComment?: any;
    shareLevel?: number;
    accuracyIndicator?: number;
    rowVersion: string;
    usedInTotal: boolean;
    esCandidateScriptMarkSchemeGroup?: number;
    definitiveMark?: boolean;
    lowerTolerance?: number;
    upperTolerance?: number;
    markSchemeForMark?: number;
    nonnumericMark?: string;
    notAttempted: boolean;
    markScheme?: any;
    version: number;
    isDirty: boolean;
    markingOperation: enums.MarkingOperation;
    uniqueId: string;
    isPickedForSaveOperation?: boolean;
    isPrevious?: boolean;
}

export = ExaminerMark;