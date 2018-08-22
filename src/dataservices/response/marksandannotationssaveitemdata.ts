/**
 * Class for holding Marks and Annotations list item data.
 */
class MarksAndAnnotationsSaveItemData implements MarksAndAnnotationsSaveItem {
    public markGroupId: number;
    public isProcessing: boolean;
    public retryCount: number;
    public markingStartTime: Date;
    public markingEndTime: Date;
}

export = MarksAndAnnotationsSaveItemData;