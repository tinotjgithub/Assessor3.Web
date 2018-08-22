"use strict";
var SendMessageArgument = (function () {
    /**
     * Initializing new instance of allocation.
     */
    function SendMessageArgument(examinerList, body, subject, questionPaperId, displayId, priorityId, markSchemeGroupId, candidateScriptId, markGroupId, toTeam, esMarkGroupId, isTeamManagement, examBodyMessageType) {
        this.examinerList = examinerList;
        this.body = body;
        this.subject = subject;
        this.questionPaperId = questionPaperId;
        this.displayId = displayId;
        this.examinerMessagePriorityID = priorityId;
        this.markSchemeGroupId = markSchemeGroupId;
        this.candidateScriptId = candidateScriptId;
        this.markGroupId = markGroupId;
        this.toTeam = toTeam;
        this.esMarkGroupId = esMarkGroupId;
        this.isTeamManagement = isTeamManagement;
        this.examBodyMessageTypeID = examBodyMessageType;
    }
    return SendMessageArgument;
}());
module.exports = SendMessageArgument;
//# sourceMappingURL=sendmessageargument.js.map