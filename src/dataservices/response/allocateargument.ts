import enums = require('../../components/utility/enums');

class AllocateArgument {
    private examinerRoleId: number;
    private markSchemeGroupId: number;
    private workListType: enums.WorklistType;
    private isConcurrentDownload: boolean;
    private examSessionId: number;
    private isPE: boolean;
    private isElectronicStandardisationTeamMember: boolean;
    private examinerId: number;
    private isCandidatePrioritisationCCON: boolean;
    private isQualityRemarkCCEnabled: boolean;
    private remarkRequestType: enums.RemarkRequestType;
    private isAtypicalReponse: boolean;
    private candidateScriptId: number;
    private isWholeResponse: boolean;
    private isAggregatedTargetsCCEnabled: boolean;

    /**
     * Initializing new instance of allocation.
     */
    constructor(examinerRoleId: number,
        markSchemeGroupId: number,
        workListType: enums.WorklistType,
        isConcurrentDownload: boolean,
        examSessionId: number,
        isPE: boolean,
        isElectronicStandardisationTeamMember: boolean,
        examinerId: number,
        isCandidatePrioritisationCCON: boolean,
        isQualityRemarkCCEnabled: boolean,
        remarkRequestType: enums.RemarkRequestType,
        isAtypicalReponse?: boolean,
        candidateScriptId?: number,
        isWholeResponseDownload?: boolean,
        isAggregatedTargetsCCEnabled?: boolean) {
        this.examinerRoleId = examinerRoleId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.workListType = workListType;
        this.isConcurrentDownload = isConcurrentDownload;
        this.examSessionId = examSessionId;
        this.isPE = isPE;
        this.isElectronicStandardisationTeamMember = isElectronicStandardisationTeamMember;
        this.examinerId = examinerId;
        this.isCandidatePrioritisationCCON = isCandidatePrioritisationCCON;
        this.isQualityRemarkCCEnabled = isQualityRemarkCCEnabled;
        this.remarkRequestType = remarkRequestType;
        this.isAtypicalReponse = isAtypicalReponse;
        this.candidateScriptId = candidateScriptId;
        this.isWholeResponse = isWholeResponseDownload;
        this.isAggregatedTargetsCCEnabled = isAggregatedTargetsCCEnabled;
    }
}
export = AllocateArgument;