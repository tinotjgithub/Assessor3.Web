import enums = require('../../../components/utility/enums');

interface EnhancedOffPageComment {
    enhancedOffPageCommentId: number;
    fileId: number;
    examinerRoleId: number;
    markSchemeGroupId: number;
    markSchemeId: number;
    comment?: any;
    markGroupId: number;
    isDefinitive: boolean;
    rowVersion?: any;
    clientToken: string;
    markingOperation: enums.MarkingOperation;
    uniqueId: string;
    isDirty: boolean;
    isPickedForSaveOperation?: boolean;
    isPrevious?: boolean;
}

export = EnhancedOffPageComment;