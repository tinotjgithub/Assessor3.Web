﻿import enums = require('../../../components/utility/enums');
import Immutable = require('immutable');
interface TreeViewItem {
    itemType: enums.TreeViewItemType;
    name: string;
    ancestors?: string;
    treeViewItemList?: Immutable.List<TreeViewItem>;
    parentClusterId: number;
    sequenceNo: number;
    uniqueId: number;
    answerItemId?: number;
    isVisible: boolean;
    markTypeVariety?: enums.MarkTypeVariety;
    maximumNumericMark?: number;
    hasChild?: boolean;
    imageClusterId?: number;
    isSelected?: boolean;
    index?: number;
    bIndex?: number;
    allocatedMarks?: AllocatedMark;
    totalMarks?: string;
    markingProgress?: number;
    availableMarks?: Immutable.List<AllocatedMark>;
    stepValue?: number;
    minimumNumericMark?: number;
    markCount?: number;
    isAllNR?: boolean;
    isSingleDigitMark?: boolean;
    usedInTotal: boolean;
    maximumExpectedResponses?: number;
    markSchemeCount?: number;
    previousIndex: number;
    nextIndex: number;
    hasSimpleOptionality?: boolean;
    previousMarks?: Array<PreviousMark>;
    accuracyIndicator?: number;
    allowableDifference?: number;
    absoluteMarksDifference?: number;
    totalMarksDifference?: number;
    allowNR?: boolean;
    positiveTolerance?: number;
    negativeTolerance?: number;
    isUnZonedItem?: boolean;
    markSchemeGroupId?: number;
    isFullyMarked?: boolean;
    questionTagId?: number;
}
export = TreeViewItem;