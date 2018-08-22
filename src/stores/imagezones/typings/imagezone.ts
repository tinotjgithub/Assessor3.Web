/**
 * Interface definition for imagezone
 */
interface ImageZone {
    uniqueId: number;
    imageClusterId?: number;
    description: string;
    pageNo?: number;
    sequence?: number;
    leftEdge: number;
    topEdge?: number;
    width: number;
    height?: number;
    outputPageNo?: number;
    inputFileFormatId: any;
    outputFileFormatId: any;
    inputFormat: string;
    outputFormat: string;
    examBodyImageZoneNo: number;
    itemId: number;
    holderWidth?: number;
    zonePaddingTop?: number;
    isViewWholePageLinkVisible: boolean;
    docStorePageQuestionTagId: number;
    questionTagId?: number;
    markSchemeId: number;
    questionTagName: string;
    docStorePageQuestionTagTypeId: number;
    questionPaperId: number;
}