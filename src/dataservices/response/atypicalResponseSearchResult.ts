import enums = require('../../components/utility/enums');

class AtypicalResponseSearchResult {
    public examinerRoleId: number;
    public markSchemeGroupId: number;
    public centreNumber: string;
    public candidateNumber: string;
    public searchResultCode: enums.SearchResultCode;
    public candidateScriptId: number;
    public candidateName: string;

    /**
     * Initializing new instance of atypical search result.
     */
    constructor(examinerRoleId: number, markSchemeGroupId: number, centreNumber: string,
        candidateNumber: string, searchResultCode: enums.SearchResultCode
        , candidateScriptId: number, candidateName: string) {
        this.examinerRoleId = examinerRoleId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.centreNumber = centreNumber;
        this.candidateNumber = candidateNumber;
        this.searchResultCode = searchResultCode;
        this.candidateScriptId = candidateScriptId;
        this.candidateName = candidateName;
    }
}
export = AtypicalResponseSearchResult;