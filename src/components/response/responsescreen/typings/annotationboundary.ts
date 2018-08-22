
/**
 * Interface designed to represent annotation place or move boundaries.
 */
interface AnnotationBoundary {
    start: number;
    end: number;
    imageHeight: number;
    imageWidth: number;
    top?: number;
    left?: number;
    right?: number;
}