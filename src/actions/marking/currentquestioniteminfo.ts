import enums = require('../../components/utility/enums');

interface CurrentQuestionItemInfo {
    itemType: enums.TreeViewItemType;
    name: string;
    parentClusterId: number;
    sequenceNo: number;
    uniqueId: number;
    answerItemId?: number;
    isVisible: boolean;
    maximumNumericMark?: number;
    hasChild?: boolean;
    imageClusterId?: number;
    isSelected?: boolean;
    index?: number;
    allocatedMarks?: AllocatedMark;
    totalMarks?: string;
    markingProgress?: number;
    availableMarks?: Immutable.List<AllocatedMark>;
    stepValue?: number;
    minimumNumericMark?: number;
    isSingleDigitMark?: boolean;
    usedInTotal: boolean;
    /* bIndex is used for optimised tree trvaersal */
    bIndex?: number;
    previousIndex: number;
    nextIndex: number;
    allowNR?: boolean;
    markSchemeGroupId?: number;
    questionTagId?: number;
}

export = CurrentQuestionItemInfo;
