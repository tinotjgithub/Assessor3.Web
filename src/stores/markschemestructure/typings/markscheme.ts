/// <reference path='responseitem.ts' />
import responseItem = require('./responseitem');
interface MarkScheme {
        uniqueId: number;
        answerItemId: number;
        extAnswerItemId: number;
        clusterId: number;
        extClusterId: number;
        parentClusterId?: number;
        extMarkSchemeID: number;
        allowableDifference?: number;
        adjudicationRequired: boolean;
        markType: MarkType;
        markTypeId: number;
        responseItem?: responseItem;
        extMarkType: number;
        name: string;
        wholeNumber: boolean;
        sequence: number;
        markEntityType?: string;
        markSchemeGroupId: number;
        qppMarkSchemeGroupId: number;
        positiveTolerance?: number;
        negativeTolerance?: number;
        isCommentMandatory: boolean;
}
export = MarkScheme;