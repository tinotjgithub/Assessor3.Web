interface MarkType {
        uniqueId: number;
        markTypeName: string;
        markTypeDescription: string;
        examBodyMarkTypeNo: number;
        rowVersion?: string;
        markOptions?: any;
        examBodyId: number;
        nonNumericIndicator: boolean;
        maxNumericMark: number;
        minNumericMark: number;
        markStepValue: number;
        defaultNumericMark: number;
        defaultMarkOption: number;
        allowNR: boolean;
        displayLabel?: string;
        variety: number;
        associatedStamps: any[];
    }
