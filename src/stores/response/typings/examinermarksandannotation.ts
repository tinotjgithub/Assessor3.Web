import examinerMark = require('./examinermark');
import annotation = require('./annotation');
import bookmark = require('./bookmark');
import enhancedOffPageComment = require('./enhancedoffpagecomment');

interface ExaminerMarksAndAnnotations {
    enhancedOffPageComments: enhancedOffPageComment[];
    examinerMarksCollection: examinerMark[];
    annotations: annotation[];
    bookmarks: bookmark[];
    absoluteMarksDifference?: number;
    accuracyIndicator: number;
    accuracyTolerance: number;
    examinerMarks?: any;
    maximumMarks: number;
    totalMarks: number;
    totalMarksDifference?: number;
    totalTolerance: number;
    examinerRoleId: number;
    markGroupId: number;
    markingProgress: number;
    hasMarkSchemeLevelTolerance: boolean;
    version: number;
    questionItemGroup?: any;
    totalLowerTolerance?: number;
    totalUpperTolerance?: number;
    seedingAMDTolerance?: number;
    submittedDate: Date;
    remarkRequestTypeId: number;
    baseColor: string;
    markedByInitials: string;
    markedBySurname: string;
    isDefault: boolean;
    pooled: boolean;
    directed: boolean;
    originalMarkGroupId: number;
    totalToleranceRemark?: number;
}

export = ExaminerMarksAndAnnotations;