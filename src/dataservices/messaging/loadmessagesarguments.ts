import enums = require('../../components/utility/enums');

interface LoadMessageArguments {
    recentMessageTime: Date;
    messageFolderType: enums.MessageFolderType;
    forceLoadMessages: boolean;
    candidateResponseId?: number;
    isTeamManagementView?: boolean;
    markGroupId?: number;
    isWholeResponse?: boolean;
    currentWorklistType?: enums.WorklistType;
    hiddenQigList: Array<number>;
}

export = LoadMessageArguments;