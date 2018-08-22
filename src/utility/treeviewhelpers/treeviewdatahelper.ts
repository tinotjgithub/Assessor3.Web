import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import markschemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
import Immutable = require('immutable');
import enums = require('../../components/utility/enums');
import qigStore = require('../../stores/qigselector/qigstore');
import awardingStore = require('../../stores/awarding/awardingstore');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import cluster = require('../../stores/markschemestructure/typings/cluster');
import answerItem = require('../../stores/markschemestructure/typings/answeritem');
import markScheme = require('../../stores/markschemestructure/typings/markscheme');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import markingStore = require('../../stores/marking/markingstore');
import examinerMark = require('../../stores/response/typings/examinermark');
import markCalculationRuleFactory = require('../markcalculationrules/markcalculationrulefactory');
import markCalculationRuleSchema = require('../markcalculationrules/markcalculationruleschema');
import mark = require('../../components/utility/marking/mark');
import worklistStore = require('../../stores/worklist/workliststore');
import marksManagementHelper = require('../../components/utility/marking/marksmanagementhelper');
const NR_MARK_STATUS = 'not attempted';
const NOT_ATTEMPTED = 'NR';
import constants = require('../../components/utility/constants');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import responseStore = require('../../stores/response/responsestore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import markCalculationRuleBase = require('../markcalculationrules/markcalculationrulebase');
import imageZoneStore = require('../../stores/imagezones/imagezonestore');
import CandidateEbookMarkImageZoneCollection = require('../../stores/script/typings/candidateebookmarkimagezonecollection');
import annotation = require('../../stores/response/typings/annotation');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');

/**
 * Data helper for the tree view component.
 */
class TreeViewDataHelper {
    private currentIndex: number;

    private currentBIndex: number;

    private _lastBIndex: number;

    /* Total number of mark schemes */
    private totalMarkSchemes: number = 0;

    private visibleElementCount: number = 0;

    /** index of the final node of the tree view */
    private lastNodeIndex: number;

    private marksData: examinerMarkData = undefined;

    /** dictionary to hold annotation tooltips */
    private _toolTipInfo: Immutable.Map<number, MarkSchemeInfo> = Immutable.Map<number, MarkSchemeInfo>();

    // To hold the the last mark scheme id
    private _lastMarkSchemeId: number = 0;

    private _hasAllOptionalMarkSchemesMarked: boolean = true;

    private _isNonNumeric: boolean = false;

    private markschemeZoneCounter: number;

    private responseImagezoneCollection: Immutable.List<ImageZone>;

    private imageClusterIds: Array<number>;

    private markSchemeIds: Array<number>;

    private hasComplexOptionality: boolean;

    private _isMultiQP: boolean;

    private _isWholeResponseAwarding: boolean = false;

    /**
     * Constructor for treeviewdatahelper
     */
    constructor() {
        this.currentIndex = 0;
        this.currentBIndex = 0;
        this._isMultiQP = false;
    }

    private markDetails: MarkDetails = undefined;

    // Holds collection of marks belongs to the current open response.
    private responseMarkList: Array<mark>;

    // variable which holds optionality applicanble items and is all optional items marked info.
    private optionalItems: Array<OptionalityDictionary> = [];

    private isDefinitive: boolean = false;
    private isOriginalMark: boolean = false;
    private _markScheme: treeViewItem = undefined;

    /**
     * returns tree view item array of markscheme structure data.
     */
    public getMarkSchemeStructureNodeCollection(): treeViewItem {
        return this.treeViewItem();
    }

    /**
     * Total marking progress details for the entire response
     */
    public get totalMarkAndProgress(): MarkDetails {
        return this.markDetails;
    }

    /**
     * get the flag for Non numeric indicator
     */
    public get isNonNumeric(): boolean {
        return this._isNonNumeric;
    }

    /**
     * gets whether all the optional questions has been marked for this marks scheme.
     */
    public get hasAllOptionalMarkSchemesMarked(): boolean {
        return this._hasAllOptionalMarkSchemesMarked;
    }

    /**
     * Returns the original mark list.
     * @returns
     */
    public get originalMarks(): Array<mark> {
        return this.responseMarkList;
    }

    /**
     * Returns the image cluster Ids, for the current MarkSchemeStructure.
     * @returns
     */
    public get imageClusterIdCollection(): Array<number> {
        return this.imageClusterIds;
    }

    /**
     * Returns the markScheme Ids, for the current MarkSchemeStructure.
     * @returns
     */
    public get markSchemeIdsCollection(): Array<number> {
        return this.markSchemeIds;
    }

    /**
     * returns the Bindex of the last markscheme
     */
    public get lastBIndex(): number {
        return this._lastBIndex;
    }

    /**
     * return is the multi QP
     */
    public get isMultiQP(): boolean {
        return this._isMultiQP;
    }

    /**
     * returns the whole response flag, if the response mode is awarding it will return the same based on the markschemestructure data.
     * Otherwise it will returns the data from response store.
     */
    public get isWholeResponse(): boolean {
        return (markerOperationModeFactory.operationMode.isAwardingMode ? this._isWholeResponseAwarding :
            responseStore.instance.isWholeResponse);
    }

    /**
     * Get the MarkSchemeStructure against the current qig
     * @returns
     */
    public treeViewItem(): treeViewItem {
        // clear the current marks and initialise new,
        // when the response changes/open.
        this.responseMarkList = [];
        this.optionalItems = [];
        this.imageClusterIds = [];
        this.markSchemeIds = [];

        this.responseImagezoneCollection = imageZoneStore.instance.currentCandidateScriptImageZone;
        this.marksData = markingStore.instance.examinerMarksAgainstCurrentResponse;
        let item: treeViewItem;

        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            if (markschemeStructureStore.instance.markSchemeStructure.questionPapers &&
                markschemeStructureStore.instance.markSchemeStructure.questionPapers.length > 1) {
                this._isMultiQP = true;
                item = {
                    itemType: enums.TreeViewItemType.questionPaper,
                    name: 'Question Paper',
                    treeViewItemList: Immutable.List<treeViewItem>(),
                    parentClusterId: 0,
                    sequenceNo: 0,
                    uniqueId: 0,
                    isVisible: false,
                    usedInTotal: false,
                    previousIndex: 0,
                    nextIndex: 0
                };

                this._isWholeResponseAwarding = true;

                let qpItem: treeViewItem;

                markschemeStructureStore.instance.markSchemeStructure.questionPapers.forEach((qp: QuestionPaper) => {

                    qpItem = {
                        itemType: enums.TreeViewItemType.questionPaper,
                        name: qp.questionPaperName,
                        treeViewItemList: Immutable.List<treeViewItem>(),
                        parentClusterId: 0,
                        sequenceNo: 0,
                        uniqueId: 0,
                        isVisible: true,
                        usedInTotal: true,
                        previousIndex: 0,
                        nextIndex: 0
                    };

                    for (let clusterId in markschemeStructureStore.instance.markSchemeStructure.clusters) {

                        if (markschemeStructureStore.instance.markSchemeStructure.clusters[clusterId].
                            questionPaperPartId === qp.questionPaperID) {
                            qpItem.treeViewItemList = qpItem.treeViewItemList.push(
                                this.mapMarkSchemeStructureToTreeViewObject(
                                    markschemeStructureStore.instance.markSchemeStructure.clusters[clusterId], parseInt(clusterId)));
                            qpItem.markSchemeGroupId = parseInt(clusterId);
                        }
                    }

                    item.treeViewItemList = item.treeViewItemList.push(qpItem);
                });
            } else {

                let markSchemeClusters: Immutable.List<treeViewItem> = Immutable.List<treeViewItem>();

                for (let clusterId in markschemeStructureStore.instance.markSchemeStructure.clusters) {
                    if (clusterId) {
                        markSchemeClusters = markSchemeClusters.push(
                            this.mapMarkSchemeStructureToTreeViewObject(
                                markschemeStructureStore.instance.markSchemeStructure.clusters[clusterId],
                                parseInt(clusterId)));
                    }
                }

                if (markSchemeClusters && markSchemeClusters.count() > 1) {

                    item = {
                        itemType: enums.TreeViewItemType.wholeResponse,
                        name: 'Whole Response',
                        treeViewItemList: Immutable.List<treeViewItem>(),
                        parentClusterId: 0,
                        sequenceNo: 0,
                        uniqueId: 0,
                        isVisible: false,
                        usedInTotal: false,
                        previousIndex: 0,
                        nextIndex: 0
                    };

                    item.treeViewItemList = markSchemeClusters;
                    // Setting the whole response falg in awarding mode if multiple QIGs there
                    this._isWholeResponseAwarding = true;

                } else {
                    this._isWholeResponseAwarding = false;
                    item = markSchemeClusters.first();
                }
            }
        } else if (markschemeStructureStore.instance.markSchemeStructure.clusters) {

            if (responseStore.instance.isWholeResponse) {
                    item = {
                        itemType: enums.TreeViewItemType.wholeResponse,
                        name: 'Whole Response',
                        treeViewItemList: Immutable.List<treeViewItem>(),
                        parentClusterId: 0,
                        sequenceNo: 0,
                        uniqueId: 0,
                        isVisible: true,
                        usedInTotal: true,
                        previousIndex: 0,
                        nextIndex: 0
                    };
                for (let clusterId in markschemeStructureStore.instance.markSchemeStructure.clusters) {
                    if (clusterId) {
                        item.treeViewItemList = item.treeViewItemList.push(
                            this.mapMarkSchemeStructureToTreeViewObject(
                                markschemeStructureStore.instance.markSchemeStructure.clusters[clusterId],
                                parseInt(clusterId)
                            )
                        );
                    }
                }
            } else {
                item = this.mapMarkSchemeStructureToTreeViewObject(
                    markschemeStructureStore.instance.markSchemeStructure.clusters[
                    qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
                    ]
                );
            }
        } else {
            return null;
        }

        this.addIndex(item, true);
        this._lastMarkSchemeId = this._markScheme.uniqueId;
        this._markScheme = undefined;
        this.lastNodeIndex = this.currentIndex;
        item.markSchemeCount = this.totalMarkSchemes;

        /* Get the mark calculation rule */
        let marksSchema: markCalculationRuleBase = markCalculationRuleFactory.getMarkCalculationRule(
            enums.MarkRuleType.default
        );

        /* Map current marks to the tree view */
        marksSchema.calculateMaximumAndTotalMark(item, undefined, undefined, this.optionalItems);

        this.setOptionalMarkSchemesMarkedStatus();

            /* set the current progress and total to a mark details object */
            this.markDetails = {
                markingProgress: item.markingProgress,
                maximumMark: item.maximumNumericMark,
                totalMark: item.totalMarks,
                totalMarkedMarkSchemes: item.markCount,
				isAllNR: item.isAllNR,
				markSchemeCount: item.markSchemeCount
            };

            // get the related mark Group Id for a whole response
            let markGroupId: number = standardisationSetupStore.instance.isSelectResponsesWorklist
                ? 0
                : markingStore.instance.getMarkGroupIdQIGtoRIGMap(item.markSchemeGroupId);

            this.hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.ComplexOptionality, item.markSchemeGroupId).toLowerCase() === 'true' ? true : false;

            // need to check marksData as it return empty when we open response from select response
            // without clicking mark now.
            if (this.hasComplexOptionality && this.marksData) {
				this.markDetails.totalMark = this.marksData.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].totalMarks.toString();
				this.markDetails.maximumMark = this.marksData.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].maximumMarks;
            }

            return item;
        }

    /**
     * get mark details for the selected QIG node in tree. (Whole response scenario)
     * @param tree markscheme Treeview
     * @param markSchemeGroupId qig id
     */
    public getSelectedQigMarkingProgressDetails(tree: treeViewItem, markSchemeGroupId: number) {
        let item: treeViewItem = tree.treeViewItemList
            .filter(
            (treeItem: treeViewItem, key: number) =>
                treeItem.itemType === enums.TreeViewItemType.QIG && treeItem.markSchemeGroupId === markSchemeGroupId
            )
            .first() as treeViewItem;
        let markDetails = {
            markingProgress: item.markingProgress,
            maximumMark: item.maximumNumericMark,
            totalMark: item.totalMarks,
            totalMarkedMarkSchemes: item.markCount,
			isAllNR: item.isAllNR,
			markSchemeCount: item.markSchemeCount
        };
        return markDetails;
    }

    /**
     * calculating total mark, cluster total and marking progress
     * @param {treeViewItem} item
     */
    public updateMarkDetails(
        item: treeViewItem,
        currentBIndex?: number,
        marksManagementHelper?: MarksAndAnnotationsManagementBase
    ): treeViewItem {
        let marksSchema: markCalculationRuleBase = markCalculationRuleFactory.getMarkCalculationRule(
            enums.MarkRuleType.default
        );

        /* Map current marks to the tree view */
        marksSchema.calculateMaximumAndTotalMark(item, currentBIndex, marksManagementHelper, this.optionalItems);

        this.setOptionalMarkSchemesMarkedStatus();

        /* set the current progress and total to a mark details object */
        this.markDetails = {
            markingProgress: item.markingProgress,
            maximumMark: item.maximumNumericMark,
            totalMark: item.totalMarks,
            totalMarkedMarkSchemes: item.markCount,
			isAllNR: item.isAllNR,
			markSchemeCount: item.markSchemeCount
        };

        if (this.hasComplexOptionality) {
            this.markDetails.totalMark = null;
        }

        return item;
    }

    /**
     * Mapping mark scheme structure to tree view object
     * @param {Object} childItem
     * @returns
     */
    private mapMarkSchemeStructureToTreeViewObject(childItem: cluster, markSchemeGroupId: number = 0): treeViewItem {
        let index = this.currentIndex;
        let _treeItem = {
            name: childItem.name,
            itemType: enums.TreeViewItemType.QIG,
            parentClusterId: childItem.parentClusterId,
            sequenceNo: childItem.sequenceNo,
            uniqueId: childItem.uniqueId,
            isVisible: true,
            treeViewItemList: this.mapChildClusters(childItem.childClusters, '', markSchemeGroupId)
                .concat(this.mapAnswerItems(childItem.answerItems, '', markSchemeGroupId))
                .concat(
                this.mapMarkSchemes(
                    markSchemeGroupId,
                    childItem.markSchemes,
                    enums.TreeViewItemType.QIG,
                    childItem,
                    ''
                )
                )
                .toList(),
            index: index,
            usedInTotal: true,
            nextIndex: 0,
            previousIndex: 0,
            maximumExpectedResponses: childItem.maximumExpectedResponses,
            markSchemeGroupId: markSchemeGroupId
        };

        /* treeViewItemList is already sorted by markSchemes and AnswerItems.
           Now we are applying the next level sorting to the treeView based on the 'SequenceNo' to create the final list */
        _treeItem.treeViewItemList = Immutable.List<treeViewItem>(
            _treeItem.treeViewItemList.toArray().sort((a: treeViewItem, b: treeViewItem) => {
                return a.sequenceNo - b.sequenceNo;
            })
        );
        return _treeItem;
    }

    /**
     * Adding index to the sorted list.
     * @param {Immutable.List<treeViewItem>} items
     */
    private addIndex(item: treeViewItem, setBindex: boolean) {
        let that = this;
        if (item.treeViewItemList) {
            item.treeViewItemList.map((_item: treeViewItem) => {
                if (_item.isVisible === true) {
                    _item.index = ++that.currentIndex;
                    if (_item.itemType !== enums.TreeViewItemType.QIG) {
                        that.visibleElementCount++;
                    }
                }
                that.addIndex(_item, setBindex);
            });
        }

        if (setBindex) {
            item.bIndex = ++this.currentBIndex;

            if (item.itemType === enums.TreeViewItemType.marksScheme) {
                if (this._markScheme) {
                    this._markScheme.nextIndex = item.bIndex;
                    item.previousIndex = this._markScheme.bIndex;
                }
                this._markScheme = item;
                this._lastBIndex = item.bIndex;
            }
        }
    }

    /**
     * Mapping the answer items
     * @param {Array<Object>} childItems
     * @returns
     */
    private mapAnswerItems(
        childItems: Immutable.List<answerItem>,
        ancestors: string,
        markSchemeGroupId: number
    ): Immutable.List<treeViewItem> {
        let treeItem: treeViewItem = undefined;
        let items = Immutable.List<treeViewItem>();
        this.markschemeZoneCounter = 0;
        if (childItems) {
            let childItemCount = childItems.count();
            let that = this;

            items = childItems.map((item: answerItem) => {
                let index = 0;
                // Prevent dot appearing for mark scheme structure with no parent clusters
                let ancestorText: string = ancestors.length > 0 ? ancestors + '.' + item.displayLabel : item.displayLabel;
                this.imageClusterIds.push(item.imageClusterId);
                return treeItem = {
                    name: item.displayLabel,
                    itemType: enums.TreeViewItemType.answerItem,
                    parentClusterId: item.parentClusterId,
                    sequenceNo: item.sequence,
                    uniqueId: item.uniqueId,
                    isVisible: item.markSchemes.count() > 1,
                    treeViewItemList: this.mapMarkSchemes(markSchemeGroupId, item.markSchemes, enums.TreeViewItemType.answerItem, item,
                        ancestorText, item.imageClusterId, item.markSchemes.count()),
                    index: index,
                    imageClusterId: item.imageClusterId,
                    usedInTotal: true,
                    nextIndex: 0,
                    previousIndex: 0,
                    isUnZonedItem: that.isEBookMarkingCCOn ?
                        (that.markschemeZoneCounter === childItemCount) : false,
                    markSchemeGroupId: markSchemeGroupId,
                    markSchemeCount: item.markSchemes.count(),
                    questionTagId: Number(item.questionTag)
                };
            }).toList();

            items = Immutable.List<treeViewItem>(
                sortHelper.sort(items.toArray(), comparerList.markSchemeViewSequenceComparer)
            );
        }

        return items;
    }

    /**
     * mapping the mark schemes
     * @param {Array<Object>} childItems
     * @returns
     */
    private mapMarkSchemes(
        markSchemeGroupId: number,
        childItems: Immutable.List<markScheme>,
        parentItemType: enums.TreeViewItemType,
        parent: any,
        ancestors: string,
        imageClusterId?: number,
        answerItemChildCount?: number
    ): Immutable.List<treeViewItem> {
        let treeItem: treeViewItem = undefined;
        let items = Immutable.List<treeViewItem>();
        let _isVisible: boolean = true;
        let displayId: string = undefined;
        let isMarkschemeLinked: boolean = false;

        // If the mark scheme is a child of answer item and answer item has only one child object,
        // display name should be anser item display id.
        if (parentItemType === enums.TreeViewItemType.answerItem && childItems.count() <= 1) {
            displayId = parent.displayLabel;
        }

        /* if there is only one mark scheme no need to show the same instead answer item name should be shown */
        if (childItems) {
            if (parentItemType === enums.TreeViewItemType.answerItem && childItems.size === 1) {
                _isVisible = false;
            }
            items = childItems
                .map((item: markScheme) => {
                    let allocatedMark: any;
                    this.totalMarkSchemes++;

                    let counter = 0;
                    let remarks = Array<PreviousMark>();
                    let allocatedRemark: any;
                    // get the related mark Group Id for a whole response
                    let markGroupId: number = standardisationSetupStore.instance.isSelectResponsesWorklist
                        ? 0
                        : markingStore.instance.getMarkGroupIdQIGtoRIGMap(item.markSchemeGroupId);

                    if (this.marksData) {
                        /* Get the marks for a specific mark scheme from the examiner marks collection */
                        let mark: Array<examinerMark> = this.marksData.examinerMarkGroupDetails[
                            markGroupId
                        ].allMarksAndAnnotations[0].examinerMarksCollection.filter(
                            (x: examinerMark) => x.markSchemeId === item.uniqueId
                            );

                        allocatedMark = this.getMarkSchemeMark(mark, item);

                        /* Populate mark details of each mark scheme
                     If there is no mark associated need not to enter in to the collection.
                    */
                        this.populateOriginalMarkDetails(
                            { displayMark: allocatedMark.mark, valueMark: allocatedMark.valueMark },
                            mark && mark[0] ? mark[0] : undefined
                        );

                        let marks = this.marksData.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;

                        let originalMarkGroupId = marks[0].originalMarkGroupId;

                        marks.map((remarkItem: any) => {
                            // to set whether the markscheme is linked with a page or not
                            if (isMarkschemeLinked === false) {
                                isMarkschemeLinked = this.isMarkSchemeLinkedToPage(marks, item.uniqueId, counter);
                            }

                            // avoid the current marks
                            if (counter > 0) {
                                let remark: Array<examinerMark> = marks[counter].examinerMarksCollection.filter(
                                    (x: examinerMark) => x.markSchemeId === item.uniqueId
                                );

                                allocatedRemark = this.getMarkSchemeMark(remark, item);
                                remarks.push({
                                    mark: { displayMark: allocatedRemark.mark, valueMark: allocatedRemark.valueMark },
                                    usedInTotal: allocatedRemark.usedInTotal,
                                    lowerTolerance: remark[0].lowerTolerance,
                                    upperTolerance: remark[0].upperTolerance,
                                    isDefinitive: remark[0].definitiveMark,
                                    isOriginalMark: remark[0].markGroupId === originalMarkGroupId
                                });
                            }
                            counter++;
                        });
                    }

                    let ancestorText: string = displayId === undefined ?
                        (ancestors !== '' ? ancestors + '.' + item.name : item.name) : ancestors;
                    // Update tooltip dictionary
                    this._toolTipInfo = this._toolTipInfo.set(item.uniqueId, {
                        sequenceNo: item.sequence, markSchemeText: ancestorText,
                        markGroupId: markGroupId
                    });
                    this.markSchemeIds.push(item.uniqueId);
                    let index = 0;
                    return treeItem = {
                        name: displayId === undefined ? item.name : displayId,
                        itemType: enums.TreeViewItemType.marksScheme,
                        parentClusterId: item.parentClusterId,
                        sequenceNo: item.sequence,
                        markTypeVariety: item.markType.variety,
                        uniqueId: item.uniqueId,
                        isVisible: true,
                        maximumNumericMark: item.markType.maxNumericMark,
                        index: index,
                        allocatedMarks:
                        { displayMark: allocatedMark ? allocatedMark.mark : '', valueMark: allocatedMark ? allocatedMark.valueMark : '' },
                        stepValue: item.markType.markStepValue,
                        minimumNumericMark: item.markType.minNumericMark,
                        imageClusterId: imageClusterId,
                        /* Get the available marks for the mark scheme */
                        availableMarks: this.calculateAvailableMarks(item),
                        isSingleDigitMark: this.checkIfSingleDigitMarkScheme(item),
                        usedInTotal: allocatedMark ? allocatedMark.usedInTotal : false,
                        nextIndex: 0,
                        previousIndex: 0,
                        previousMarks: remarks,
                        markSchemeCount: 1,
                        allowableDifference: item.allowableDifference,
                        positiveTolerance: item.positiveTolerance,
                        negativeTolerance: item.negativeTolerance,
                        allowNR: item.markType.allowNR,
                        answerItemId: item.answerItemId,
                        isUnZonedItem: this.isEBookMarkingCCOn() && answerItemChildCount === 1 ?
                            this.isCurrentQuestionUnZoned(item.uniqueId, isMarkschemeLinked) : false,
                        markSchemeGroupId: markSchemeGroupId,
                        questionTagId: Number(parent.questionTag)
                    };
                }).toList();

            items = Immutable.List<treeViewItem>(
                sortHelper.sort(items.toArray(), comparerList.markSchemeViewSequenceComparer)
            );
        }
        return items;
    }

    /**
     * returns whether the mark scheme is linked with a page or not
     * @param marks
     * @param uniqueId
     * @param counter
     */
    private isMarkSchemeLinkedToPage(marks: any, uniqueId: number, counter: number): boolean {
        let isMarkschemeLinked: boolean = false;
        let isSelectedTabEligibleForDefMarks: boolean = standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? this.showDefMarksOnly() : false;
        let annotationsAgainstMarkScheme: annotation[];

        annotationsAgainstMarkScheme = marks[counter].annotations.filter(
            (x: annotation) => x.markSchemeId === uniqueId && x.markingOperation !== enums.MarkingOperation.deleted &&
                (isSelectedTabEligibleForDefMarks ? x.definitiveMark === showDefAnnotationsOnly : true));

        if (annotationsAgainstMarkScheme && annotationsAgainstMarkScheme.length > 0) {
            isMarkschemeLinked = annotationsAgainstMarkScheme.some((x) => x.stamp === constants.LINK_ANNOTATION);
        }

        return isMarkschemeLinked;
    }

    /**
     * Get the formatted amrk value
     * @param markToFormat
     * @param item
     */
    public formatNumericValue(markToFormat: number, item: markScheme): string {
        /* if the mark scheme will only have whole number, fix the position as zero. Eg:1,2 */
        if (item.wholeNumber) {
            return markToFormat.toFixed(0).toString();
        }

        /* We want to show digits up to the significant digits of the step size. */
        /* eg if step size is 1 then just show whole number part; if step size is 0.1 or 0.5 */
        /* then show first decimal point; if step size is 0.01 or 0.25 then show second decimal point. */
        switch (item.markType.markStepValue.toString().length) {
            case 1:
            case 2:
                /* 1 or 10 */
                return markToFormat.toFixed(0).toString();
            case 3:
                /* 0.1 or 0.5 */
                return markToFormat.toFixed(1).toString();
            default:
                /* especially 0.25 or 0.01, but anything else too: show max precision */
                return markToFormat.toFixed(2).toString();
        }
    }

    /**
     * Get the actual mark from marks collection to display on mark scheme
     * @param mark The mark
     * @param item The current mark scheme
     */
    private getMarkSchemeMark(mark: Array<examinerMark>, item: markScheme): any {
        let allocatedMark: string = '';
        let allocatedMarkValue: string = '';
        let usedInTotal: boolean = false;
        let marks: examinerMark;
        let isSelectedTabEligibleForDefMarks: boolean =
            standardisationSetupStore.instance.isUnClassifiedWorklist ||
            standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.ClassifiedResponse;
        let showDefAnnotationsOnly: boolean = isSelectedTabEligibleForDefMarks ? this.showDefMarksOnly() : false;

        if (mark && mark.length > 0) {

            if (isSelectedTabEligibleForDefMarks && mark.length > 1) {
                mark.forEach((x: examinerMark) => {
                    if (x.definitiveMark === showDefAnnotationsOnly) {
                        marks = x;
                    }
                });
            } else {
                marks = mark[0];
            }

            // always set from the mark collection if there are any marks
            usedInTotal = marks.usedInTotal;

            /* filter out the mark if it has been deleted */
            if (marks.markingOperation && marks.markingOperation === enums.MarkingOperation.deleted ||
                (isSelectedTabEligibleForDefMarks && showDefAnnotationsOnly &&
                    marks.definitiveMark !== true && marks.isPrevious !== true)) {
                return {
                    mark: '-',
                    usedInTotal: usedInTotal,
                    valueMark: '-'
                };
            }
            /* If the mark status is not attempted set the mark as NR */
            if (marks.markStatus && marks.markStatus.toLowerCase() === NR_MARK_STATUS) {
                allocatedMark = NOT_ATTEMPTED;
            } else if (marks.nonnumericMark && marks.nonnumericMark !== '') {
                /* set the non numeric value */
                allocatedMark = marks.nonnumericMark;
                allocatedMarkValue = marks.numericMark.toString();
            } else {
                /* Get the formatted mark */
                allocatedMark = this.formatNumericValue(marks.numericMark, item);
                allocatedMarkValue = null;
            }
        } else {
            allocatedMark = '-';
            usedInTotal = true;
        }

        return {
            mark: allocatedMark,
            usedInTotal: usedInTotal,
            valueMark: allocatedMarkValue
        };
    }

    /**
     * Mapping the child clusters
     * @param {Array<Object>} childItems
     * @returns
     */
    private mapChildClusters(
        childItems: Immutable.List<cluster>,
        ancestors: string,
        markSchemeGroupId: number
    ): Immutable.List<treeViewItem> {
        let treeItem: treeViewItem = undefined;
        let items = Immutable.List<treeViewItem>();

        if (childItems) {
            items = childItems
                .map((item: cluster) => {
                    let index = 0;
                    let ancestorsText: string = ancestors !== '' ? ancestors + '.' + item.name : item.name;
                    return (treeItem = {
                        name: item.name,
                        itemType: enums.TreeViewItemType.cluster,
                        parentClusterId: item.parentClusterId,
                        sequenceNo: item.sequenceNo,
                        uniqueId: item.uniqueId,
                        isVisible: true,
                        /* sort each child clusters */
                        treeViewItemList: Immutable.List<treeViewItem>(
                            sortHelper.sort(
                                this.mapChildClusters(item.childClusters, ancestorsText, markSchemeGroupId)
                                    .concat(this.mapAnswerItems(item.answerItems, ancestorsText, markSchemeGroupId))
                                    .concat(
                                    this.mapMarkSchemes(
                                        markSchemeGroupId,
                                        item.markSchemes,
                                        enums.TreeViewItemType.cluster,
                                        item,
                                        ancestorsText
                                    )
                                    )
                                    .toArray(),
                                comparerList.markSchemeViewSequenceComparer
                            )
                        ),
                        index: index,
                        usedInTotal: true,
                        nextIndex: 0,
                        previousIndex: 0,
                        maximumExpectedResponses: item.maximumExpectedResponses,
                        markSchemeGroupId: markSchemeGroupId
                    });
                })
                .toList();

            /* Sort the whole child clusters */
            items = Immutable.List<treeViewItem>(
                sortHelper.sort(items.toArray(), comparerList.markSchemeViewSequenceComparer)
            );
        }

        return items;
    }

    /**
     * determine weather we need to render remarks or not
     */
    public canRenderPreviousMarks() {
        return markerOperationModeFactory.operationMode.canRenderPreviousMarks;
    }

    /**
     * gets whether the current worklist is practice.
     */
    public get isPractice(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.practice;
    }

    /**
     * gets whether the current worklist is directed remark.
     */
    public get isDirectedRemark(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark;
    }

    /**
     * gets whether the current worklist is pooled remark.
     * @returns
     */
    public get isPooledRemark(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark;
    }

    /**
     * gets whether the current worklist is Standardisation.
     */
    public get isStandardisation(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation;
    }

    /**
     * gets whether the current worklist is Second Standardisation.
     */
    public get isSecondStandardisation(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation;
    }

    /**
     * gets whether the current worklist is Live.
     */
    public get isLive(): boolean {
        return worklistStore.instance.currentWorklistType === enums.WorklistType.live;
    }

    /**
     * gets whether the current response mode is closed.
     */
    public get isClosed(): boolean {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.closed;
    }

    /**
     * gets whether the current response mode is closed.
     */
    public get isOpen(): boolean {
        return worklistStore.instance.getResponseMode === enums.ResponseMode.open;
    }

    /**
     * gets whether the response is seed.
     */
    public get isSeedResponse(): number {
        let currentResponse = worklistStore.instance
            .getCurrentWorklistResponseBaseDetails()
            .filter((responses: any) => responses.markGroupId === responseStore.instance.selectedMarkGroupId)
            .first() as LiveClosedResponse;
        return currentResponse ? currentResponse.seedTypeId : undefined;
    }

    /**
     * returns the type of previous marks column
     */
    public getPreviousMarksColumnType(): enums.PreviousMarksColumnType {
        switch (worklistStore.instance.currentWorklistType) {
            case enums.WorklistType.directedRemark:
                return enums.PreviousMarksColumnType.DirectedRemark;
            case enums.WorklistType.practice:
                return enums.PreviousMarksColumnType.Practice;
            case enums.WorklistType.standardisation:
                return enums.PreviousMarksColumnType.Standardisation;
            case enums.WorklistType.secondstandardisation:
                return enums.PreviousMarksColumnType.Secondstandardisation;
            case enums.WorklistType.live:
                return enums.PreviousMarksColumnType.Seed;
            case enums.WorklistType.pooledRemark:
                return enums.PreviousMarksColumnType.PooledRemark;
            default:
                return enums.PreviousMarksColumnType.None;
        }
    }

    /**
     * loop through the mark scheme tree nodes and populate the previous marks
     * @param tree
     */
    public traverseMarkSchemeTree(tree: treeViewItem) {
        tree.previousMarks = [];
        for (let i = 0; i < markingStore.instance.getPreviousMarksCollectionCount() - 1; i++) {
            if (!tree.previousMarks) {
                tree.previousMarks = [];
            }
            this.getPreviousMarksSum(tree, [], i);
        }
    }

    /**
     * calculate the marks sum of tree nodes
     * @param tree
     * @param marksToTotal
     * @param index
     * @param recurseLevel
     */
    private getPreviousMarksSum(
        tree: treeViewItem, marksToTotal: Array<PreviousMark> = [], index: number): PreviousMark {
        let clusterSumValue: string = constants.NOT_ATTEMPTED;
        let usedInTotal: boolean;
        let clusterSum: number = 0;
        let clusterSumValueConsideringOptionality: string = constants.NOT_ATTEMPTED;
        let clusterSumConsideringOptionality: number = 0;
        let nrCount: number = 0;

        if (tree.treeViewItemList) {
            nrCount = 0;
            usedInTotal = false;
            clusterSumValue = constants.NOT_ATTEMPTED;
            clusterSumValueConsideringOptionality = constants.NOT_ATTEMPTED;
            if (!tree.previousMarks) {
                tree.previousMarks = [];
            }
            /*
             * The entire logic is splitted below for markshemes and non-markschemes. Markstotal array holds the marks of markschemes
             * and calculatig its parent total based on optionality. PreviosumarkSumCollection holds all the calculated sum of parent nodes
             * (cluster, child cluster. answer items) and using that collection to caclulate the sum of its immediate parent.
             */
            let previousMarksSumCollection: Array<PreviousMark> = [];
            tree.treeViewItemList.map((item: treeViewItem) => {
                if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                    previousMarksSumCollection.push(this.getPreviousMarksSum(item, [], index));
                } else if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    if (item.previousMarks !== null && item.previousMarks !== undefined && item.previousMarks.length > 0) {
                        usedInTotal = usedInTotal || item.previousMarks[index].usedInTotal;
                        marksToTotal.push(item.previousMarks[index]);
                    }
                }
            });

            if (previousMarksSumCollection.length > 0) {
                let counter: number = 0;
                /* Appenidng the marksToTotal to previousMarksSumCollection to consider direct child markschemes*/
                previousMarksSumCollection = previousMarksSumCollection.concat(marksToTotal);
                /* Sorting the list with descending order of mark. */
                let sortedList = sortHelper.sort(previousMarksSumCollection, comparerList.PreviousMarkComparerDesc);
                let optionalItemsCount = (tree.maximumExpectedResponses && tree.maximumExpectedResponses > 0) ?
                    tree.maximumExpectedResponses : tree.treeViewItemList.count();
                sortedList.forEach((previousMarksSum: PreviousMark) => {
                    /* iterating the list till it met the optionality criteria */
                    if (counter < optionalItemsCount) {
                        if (clusterSumValue === constants.NOT_ATTEMPTED) {
                            clusterSumValue = ((previousMarksSum.mark.valueMark) ? (previousMarksSum.mark.valueMark) :
                                (previousMarksSum.mark.displayMark));
                            clusterSum = previousMarksSum.mark.displayMark === constants.NOT_ATTEMPTED ? 0 : parseFloat(clusterSumValue);
                        } else if (previousMarksSum.mark.displayMark !== constants.NOT_ATTEMPTED) {
                            clusterSumValue = (parseFloat(clusterSumValue) +
                                parseFloat(
                                    previousMarksSum.mark.valueMark
                                        ? previousMarksSum.mark.valueMark
                                        : previousMarksSum.mark.displayMark
                                )).toString();
                            clusterSum = parseFloat(clusterSumValue);
                        }
                        usedInTotal = usedInTotal || previousMarksSum.usedInTotal;
                    }

                    counter++;
                });
            } else {

                marksToTotal.map((mark: PreviousMark) => {
                    // If used in total is set for atleast one question,
                    // then consider only the questions with UsedInTotal set as true
                    // for calculating the sum of the cluster
                    if (usedInTotal) {
                        if (isNaN(parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark) : (mark.mark.displayMark)))) {
                            nrCount++;
                        } else if (mark.usedInTotal) {
                            clusterSumConsideringOptionality += parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark)
                                : (mark.mark.displayMark));
                        }
                    } else {
                        // If used in total is not set for any questions,
                        // then consider all the questions with UsedInTotal set as false
                        // for calculating the sum of the cluster
                        // But the cluster itself will be striked off
                        if (isNaN(parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark) : (mark.mark.displayMark)))) {
                            nrCount++;
                        } else if (!mark.usedInTotal) {
                            clusterSum += parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark) : (mark.mark.displayMark));
                        }
                    }
                    this.isDefinitive = mark.isDefinitive;
                    this.isOriginalMark = mark.isOriginalMark;

                });
            }
            if (previousMarksSumCollection.length > 0) {
                clusterSumValue = clusterSum.toString();
            } else if (nrCount !== marksToTotal.length) {
                clusterSumValue = usedInTotal ? clusterSumConsideringOptionality.toString() : clusterSum.toString();
            }

            marksToTotal = [];

            tree.previousMarks.push({
                mark: { displayMark: clusterSumValue, valueMark: clusterSumValue },
                usedInTotal: usedInTotal,
                isDefinitive: this.isDefinitive,
                isOriginalMark: this.isOriginalMark
            });
        }
        return {
            mark: { displayMark: clusterSumValue, valueMark: clusterSumValue },
            usedInTotal: usedInTotal,
            isDefinitive: this.isDefinitive,
            isOriginalMark: this.isOriginalMark
        };
    }

    /**
     * Calcualte availabe marks for each marks schemes
     * @param minimumMark The minimum mark for the mark scheme
     * @param maximumMark The maximum mark for the mark scheme
     * @param stepValue The step value for the mark scheme
     */
    private calculateAvailableMarks(item: markScheme): Immutable.List<AllocatedMark> {
        let availableMarks: Immutable.List<AllocatedMark> = Immutable.List<AllocatedMark>();
        let mark: number = item.markType.minNumericMark;
        /** Adding the NR Option for all mark schemes */

        /** Currently NR button has been moved out of mark button scroll and has been
         * implemented as a separate button
         * User Story Id (16190)
         */

        if (item.markType.nonNumericIndicator === false) {
            while (mark <= item.markType.maxNumericMark) {
                availableMarks = availableMarks.push({ displayMark: mark.toString(), valueMark: null });
                mark += item.markType.markStepValue;
            }
        } else {
            if (this._isNonNumeric === false) {
                this._isNonNumeric = true;
                markingActionCreator.setNonNumericInfo();
            }
            let availableMarkList: Immutable.List<any> = Immutable.List<any>(item.markType.markOptions);
            availableMarkList.forEach((item: any) => {
                availableMarks = availableMarks.push({
                    displayMark: item.displayLabel.toString(),
                    valueMark: item.numericEquivalent.toString()
                });
            });
            // To sort the available marks based on ascending order of display mark.
            availableMarks = Immutable.List<AllocatedMark>(
                availableMarks.sort((a: AllocatedMark, b: AllocatedMark) => {
                    return parseFloat(a.displayMark) - parseFloat(b.displayMark);
                })
            );
        }
        return availableMarks;
    }

    /**
     * return the index of the final node of tree
     */
    public getLastNodeIndex(): number {
        return this.lastNodeIndex;
    }

    /**
     * Populate amrk details of each mark schemes
     * @param allocatedMark
     * @param details
     */
    private populateOriginalMarkDetails(allocatedMark: AllocatedMark, details: examinerMark): void {
        if (details) {
            let markDetails: mark = {
                mark: allocatedMark,
                isDirty: details.isDirty,
                markId: details.markId,
                markSchemeId: details.markSchemeId,
                usedInTotal: details.usedInTotal
            };

            this.responseMarkList.push(markDetails);
        }
    }

    /**
     * Check if the mark scheme accept single digit mark or not
     * @param item
     */
    private checkIfSingleDigitMarkScheme(item: markScheme): boolean {
        if (item.markType.nonNumericIndicator === false) {
            if (
                item.markType.minNumericMark < 0 ||
                item.markType.maxNumericMark > 9 ||
                item.markType.markStepValue.toString().length > 1
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            let availableMarkList: Immutable.List<AllocatedMark> = Immutable.List<AllocatedMark>(
                item.markType.markOptions
            );
            let isSingleDigit: boolean = true;

            availableMarkList.forEach((item: any) => {
                if (item.displayLabel.length > 1) {
                    isSingleDigit = false;
                    return isSingleDigit;
                }
            });
            return isSingleDigit;
        }
    }

    /**
     * Returns the annotation tooltip dictionary
     */
    public get toolTipInfo(): Immutable.Map<number, MarkSchemeInfo> {
        return this._toolTipInfo;
    }

    /**
     * Returns the last mark scheme id
     */
    public get lastMarkSchemeId() {
        return this._lastMarkSchemeId;
    }

    /**
     * Returns the number of items visible in treeview, based on visiblity for whole response.
     */
    public get currentlyVisibleElementCount() {
        return this.visibleElementCount;
    }

    /**
     * to set the flag for the mark schemes marked to reach optionality rule.
     */
    private setOptionalMarkSchemesMarkedStatus(): void {
        let _hasAllOptionalMarked: boolean = true;

        this.optionalItems.forEach((item: OptionalityDictionary) => {
            if (item.optionalMarked === false && item.usedInTotal === true) {
                _hasAllOptionalMarked = false;
            }
        });

        this._hasAllOptionalMarkSchemesMarked = _hasAllOptionalMarked;
    }

    /**
     * sets the visibility and recalculates the index value, on navigating to different QIGs in Whole response.
     * @param treeView
     * @param selectedMarkSchemeGroupId
     */
    public navigateToQigInWholeResponse(
        treeView: treeViewItem,
        selectedMarkSchemeGroupId: number,
        prevMarkSchemeGroupId: number
    ) {
        if (prevMarkSchemeGroupId !== undefined) {
            treeView = this.updateQigVisibilityInNavigation(treeView, selectedMarkSchemeGroupId, prevMarkSchemeGroupId);
        } else {
            treeView = this.updateMultiQigVisibility(treeView, selectedMarkSchemeGroupId);
        }
        this.addIndex(treeView, false);
        return treeView;
    }

    /**
     * sets the visibilty flag, for the treeview nodes.
     * @param treeView
     * @param selectedMarkSchemeGroupId
     */
    private updateMultiQigVisibility(treeView: treeViewItem, selectedMarkSchemeGroupId: number) {
        this.currentIndex = 0;
        this.visibleElementCount = 0;
        treeView.treeViewItemList.forEach((item: treeViewItem) => {
            if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                // Incase of whole response, the QIG item will be visible always even for the unselected markSchemeGroupId.
                if (item.parentClusterId === 0) {
                        item.isVisible = true;
                } else if (item.markSchemeGroupId === selectedMarkSchemeGroupId) {
                    if (item.itemType !== enums.TreeViewItemType.answerItem) {
                        item.isVisible = true;
                    } else if (item.markSchemeCount > 1) {
                        // AnswerItem will be visible only when there are more than one markScheme under it.
                        item.isVisible = true;
                    } else {
                        item.isVisible = false;
                    }
                } else {
                    item.isVisible = false;
                }

                this.updateMultiQigVisibility(item, selectedMarkSchemeGroupId);
            } else if (item.markSchemeGroupId === selectedMarkSchemeGroupId) {
                item.isVisible = true;
            } else {
                item.isVisible = false;
            }
        });

        return treeView;
    }

    /**
     * updates the visiblity of the selected and the previously selected QIGS.
     * Optimised the treeview navigation in case of Whole response navigation to avoid unwanted tree nodes.
     * @param treeView
     * @param selectedMarkSchemeGroupId
     * @param previousMarkSchemeGroupId
     */
    private updateQigVisibilityInNavigation(
        treeView: treeViewItem,
        selectedMarkSchemeGroupId: number,
        previousMarkSchemeGroupId: number
    ) {
        this.currentIndex = 0;
        this.visibleElementCount = 0;
        let isMultiQP = treeView.treeViewItemList.count(x => x.itemType === enums.TreeViewItemType.questionPaper) > 1;
        treeView.treeViewItemList.forEach((item: treeViewItem) => {
            if ((item.itemType === enums.TreeViewItemType.QIG || item.itemType === enums.TreeViewItemType.questionPaper) &&
                (item.markSchemeGroupId === selectedMarkSchemeGroupId ||
                    item.markSchemeGroupId === previousMarkSchemeGroupId)) {
                let isVisible: boolean = (item.markSchemeGroupId === selectedMarkSchemeGroupId);
                let markSchemeGroupId: number = isVisible ? selectedMarkSchemeGroupId : previousMarkSchemeGroupId;
                item = this.updateQigVisiblity(item, markSchemeGroupId, isVisible, isMultiQP);
            }
        });

        return treeView;
    }

    /**
     * sets the visiblity flag, for the specified QIG.
     * @param treeView
     * @param markSchemeGroupId
     * @param isVisible
     */
    private updateQigVisiblity(treeView: treeViewItem, markSchemeGroupId: number, isVisible: boolean, isMultiQP: boolean) {
        treeView.treeViewItemList.forEach((item: treeViewItem) => {
            if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                // Incase of whole response, the QIG item will be visible always even for the unselected markSchemeGroupId.
                if (item.parentClusterId === 0) {
                    if (isMultiQP && item.itemType === enums.TreeViewItemType.QIG) {
                        item.isVisible = isVisible;
                    } else {
                        item.isVisible = true;
                    }
                } else if (item.markSchemeGroupId === markSchemeGroupId) {
                    if (item.itemType !== enums.TreeViewItemType.answerItem) {
                        item.isVisible = isVisible;
                    } else if (item.markSchemeCount > 1) {
                        // AnswerItem will be visible only when there are more than one markScheme under it.
                        item.isVisible = isVisible;
                    } else {
                        item.isVisible = false;
                    }
                } else {
                    item.isVisible = false;
                }

                this.updateQigVisiblity(item, markSchemeGroupId, isVisible, isMultiQP);
            } else if (item.markSchemeGroupId === markSchemeGroupId) {
                item.isVisible = isVisible;
            } else {
                item.isVisible = false;
            }
        });

        return treeView;
    }

    /**
     * to check whether the current question is unzoned.
     */
    private isCurrentQuestionUnZoned(markSchemeId: number, isMarkschemeLinked: boolean): boolean {
        let isUnZoned: boolean;
        isUnZoned = this.responseImagezoneCollection
            ? this.responseImagezoneCollection.some(
                (x: ImageZone) => x.markSchemeId === markSchemeId && x.height === 0
            ) && isMarkschemeLinked === false
            : false;
        if (isUnZoned === true) {
            this.markschemeZoneCounter++;
        }
        return isUnZoned;
    }

    /**
     * to check whether the Ebookmarking CC is ON
     */
    private isEBookMarkingCCOn(): boolean {
        return (
            configurableCharacteristicsHelper
                .getCharacteristicValue(configurableCharacteristicsNames.eBookmarking)
                .toLowerCase() === 'true'
        );
    }

    /**
     * returns true, if its suppose to display only defitive marks.
     */
    private showDefMarksOnly(): boolean {
        return ((standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.editDefinitives ||
            standardisationSetupStore.instance.stdSetupPermissionCCData.role.permissions.viewDefinitives) &&
            standardisationSetupStore.instance.fetchStandardisationResponseData() &&
            standardisationSetupStore.instance.fetchStandardisationResponseData().hasDefinitiveMark === true);
    }

    /**
     * return true if previous mark can be shown in standardisation setup
     */
    public canRenderPreviousMarksInStandardisationSetup() {
        return markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup;
    }
}

export = TreeViewDataHelper;
