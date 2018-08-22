import enums = require('../../../components/utility/enums');

interface Annotation {
    annotationId: number;
    examinerRoleId: number;
    markSchemeGroupId: number;
    imageClusterId: number;
    outputPageNo: number;
    pageNo: number;
    dataShareLevel: any;
    leftEdge: number;
    topEdge: number;
    zOrder: number;
    width: number;
    height: number;
    dimension: string;
    red: number;
    green: number;
    blue: number;
    transparency: number;
    stamp: number;
    comment?: any;
    freehand?: any;
    rowVersion?: string;
    clientToken: string;
    markSchemeId: number;
    markGroupId: number;
    candidateScriptId: number;
    version: number;
    definitiveMark: boolean;
    isDirty: boolean;
    questionTagId: number;
    markingOperation: enums.MarkingOperation;
    isPrevious: boolean;
    remarkRequestTypeId: number;
    addedBySystem?: boolean;
    numericValue: number;
    isInSkippedZone?: boolean;
    topAboveZone?: number;
    skippedZoneTop?: number;
    skippedZoneLeft?: number;
    uniqueId: string;
    isPickedForSaveOperation?: boolean;
    displayOrder?: number;
    markGroupIdofWholeResponse?: number;
    isCopyingInRemark?: boolean;
}

export = Annotation;