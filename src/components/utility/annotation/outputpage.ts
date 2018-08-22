/**
 * Interface for an Output page/ Annotation overlay element
 */
interface OutputPage {
    outputPageNo: number;
    pageNo: number;
    imageClusterId: number;
    width: number;
    height: number;
    structeredPageNo?: number;
    overlayElement: Element;
}
