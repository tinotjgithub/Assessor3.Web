/**
 * Interface for an on page comment item in side view
 */
interface OnPageCommentSideViewItem {
    clientToken: string;
    imageClusterId: number;
    outputPageNo: number;
    annotationLeftPx: number;
    annotationTopPx: number;
    annotationHeight: number;
    annotationWidth : number;
    responseWidth: number;
    pageNo: number;
    comment: string;
    markSchemeId: number;
    CurrentCommentBoxHeight?: number;
    PreviousCommentBoxHeight?: number;
    lineX2?: number;
    lineY2?: number;
    lineX1?: number;
    lineY1?: number;
    overlayHeight?: number;
    overlayWidth?: number;
    annotation: any;
    isVisible: boolean;
    isDefinitive: boolean;
}