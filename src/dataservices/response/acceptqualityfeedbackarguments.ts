import enums = require('../../components/utility/enums');

class AcceptQualityFeedbackArguments {
    private markGroupId: number;
    private markSchemeGroupId: number;
    private authorisedExaminerRoleId: number;


    /**
     * Initializing new instance of allocation.
     */
    constructor(markGroupId: number, markSchemeGroupId: number, authorisedExaminerRoleId: number) {
        this.markGroupId = markGroupId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.authorisedExaminerRoleId = authorisedExaminerRoleId;
    }
}
export = AcceptQualityFeedbackArguments;