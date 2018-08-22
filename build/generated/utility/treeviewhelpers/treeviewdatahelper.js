"use strict";
var markschemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
var Immutable = require('immutable');
var enums = require('../../components/utility/enums');
var qigStore = require('../../stores/qigselector/qigstore');
var sortHelper = require('../../utility/sorting/sorthelper');
var comparerList = require('../../utility/sorting/sortbase/comparerlist');
var markingStore = require('../../stores/marking/markingstore');
var markCalculationRuleFactory = require('../markcalculationrules/markcalculationrulefactory');
var worklistStore = require('../../stores/worklist/workliststore');
var NR_MARK_STATUS = 'not attempted';
var NOT_ATTEMPTED = 'NR';
var constants = require('../../components/utility/constants');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var responseStore = require('../../stores/response/responsestore');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var imageZoneStore = require('../../stores/imagezones/imagezonestore');
/**
 * Data helper for the tree view component.
 */
var TreeViewDataHelper = (function () {
    /**
     * Constructor for treeviewdatahelper
     */
    function TreeViewDataHelper() {
        /* Total number of mark schemes */
        this.totalMarkSchemes = 0;
        this.visibleElementCount = 0;
        this.marksData = undefined;
        /** dictionary to hold annotation tooltips */
        this._toolTipInfo = Immutable.Map();
        // To hold the the last mark scheme id
        this._lastMarkSchemeId = 0;
        this._hasAllOptionalMarkSchemesMarked = true;
        this._isNonNumeric = false;
        this.markDetails = undefined;
        // variable which holds optionality applicanble items and is all optional items marked info.
        this.optionalItems = [];
        this.isDefinitive = false;
        this.isOriginalMark = false;
        this._markScheme = undefined;
        this.currentIndex = 0;
        this.currentBIndex = 0;
    }
    /**
     * returns tree view item array of markscheme structure data.
     */
    TreeViewDataHelper.prototype.getMarkSchemeStructureNodeCollection = function () {
        return this.treeViewItem();
    };
    Object.defineProperty(TreeViewDataHelper.prototype, "totalMarkAndProgress", {
        /**
         * Total marking progress details for the entire response
         */
        get: function () {
            return this.markDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isNonNumeric", {
        /**
         * get the flag for Non numeric indicator
         */
        get: function () {
            return this._isNonNumeric;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "hasAllOptionalMarkSchemesMarked", {
        /**
         * gets whether all the optional questions has been marked for this marks scheme.
         */
        get: function () {
            return this._hasAllOptionalMarkSchemesMarked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "originalMarks", {
        /**
         * Returns the original mark list.
         * @returns
         */
        get: function () {
            return this.responseMarkList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "imageClusterIdCollection", {
        /**
         * Returns the image cluster Ids, for the current MarkSchemeStructure.
         * @returns
         */
        get: function () {
            return this.imageClusterIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "markSchemeIdsCollection", {
        /**
         * Returns the markScheme Ids, for the current MarkSchemeStructure.
         * @returns
         */
        get: function () {
            return this.markSchemeIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "lastBIndex", {
        /**
         * returns the Bindex of the last markscheme
         */
        get: function () {
            return this._lastBIndex;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the MarkSchemeStructure against the current qig
     * @returns
     */
    TreeViewDataHelper.prototype.treeViewItem = function () {
        // clear the current marks and initialise new,
        // when the response changes/open.
        this.responseMarkList = [];
        this.optionalItems = [];
        this.imageClusterIds = [];
        this.markSchemeIds = [];
        this.responseImagezoneCollection = imageZoneStore.instance.currentCandidateScriptImageZone;
        this.marksData = markingStore.instance.examinerMarksAgainstCurrentResponse;
        if (markschemeStructureStore.instance.markSchemeStructure.clusters) {
            var item = void 0;
            if (responseStore.instance.isWholeResponse) {
                item = {
                    itemType: enums.TreeViewItemType.wholeResponse,
                    name: 'Whole Response',
                    treeViewItemList: Immutable.List(),
                    parentClusterId: 0,
                    sequenceNo: 0,
                    uniqueId: 0,
                    isVisible: true,
                    usedInTotal: true,
                    previousIndex: 0,
                    nextIndex: 0
                };
                for (var clusterId in markschemeStructureStore.instance.markSchemeStructure.clusters) {
                    if (clusterId) {
                        item.treeViewItemList = item.treeViewItemList.push(this.mapMarkSchemeStructureToTreeViewObject(markschemeStructureStore.instance.markSchemeStructure.clusters[clusterId], parseInt(clusterId)));
                    }
                }
            }
            else {
                item = this.mapMarkSchemeStructureToTreeViewObject(markschemeStructureStore.instance.markSchemeStructure.clusters[qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId]);
            }
            this.addIndex(item, true);
            this._lastMarkSchemeId = this._markScheme.uniqueId;
            this._markScheme = undefined;
            this.lastNodeIndex = this.currentIndex;
            item.markSchemeCount = this.totalMarkSchemes;
            /* Get the mark calculation rule */
            var marksSchema = markCalculationRuleFactory.getMarkCalculationRule(enums.MarkRuleType.default);
            /* Map current marks to the tree view */
            marksSchema.calculateMaximumAndTotalMark(item, undefined, undefined, this.optionalItems);
            this.setOptionalMarkSchemesMarkedStatus();
            /* set the current progress and total to a mark details object */
            this.markDetails = {
                markingProgress: item.markingProgress,
                maximumMark: item.maximumNumericMark,
                totalMark: item.totalMarks,
                totalMarkedMarkSchemes: item.markCount,
                isAllNR: item.isAllNR
            };
            return item;
        }
        return null;
    };
    /**
     * get mark details for the selected QIG node in tree. (Whole response scenario)
     * @param tree markscheme Treeview
     * @param markSchemeGroupId qig id
     */
    TreeViewDataHelper.prototype.getSelectedQigMarkingProgressDetails = function (tree, markSchemeGroupId) {
        var item = tree.treeViewItemList
            .filter(function (treeItem, key) {
            return treeItem.itemType === enums.TreeViewItemType.QIG && treeItem.markSchemeGroupId === markSchemeGroupId;
        })
            .first();
        var markDetails = {
            markingProgress: item.markingProgress,
            maximumMark: item.maximumNumericMark,
            totalMark: item.totalMarks,
            totalMarkedMarkSchemes: item.markCount,
            isAllNR: item.isAllNR
        };
        return markDetails;
    };
    /**
     * calculating total mark, cluster total and marking progress
     * @param {treeViewItem} item
     */
    TreeViewDataHelper.prototype.updateMarkDetails = function (item, currentBIndex, marksManagementHelper) {
        var marksSchema = markCalculationRuleFactory.getMarkCalculationRule(enums.MarkRuleType.default);
        /* Map current marks to the tree view */
        marksSchema.calculateMaximumAndTotalMark(item, currentBIndex, marksManagementHelper, this.optionalItems);
        this.setOptionalMarkSchemesMarkedStatus();
        /* set the current progress and total to a mark details object */
        this.markDetails = {
            markingProgress: item.markingProgress,
            maximumMark: item.maximumNumericMark,
            totalMark: item.totalMarks,
            totalMarkedMarkSchemes: item.markCount,
            isAllNR: item.isAllNR
        };
        return item;
    };
    /**
     * Mapping mark scheme structure to tree view object
     * @param {Object} childItem
     * @returns
     */
    TreeViewDataHelper.prototype.mapMarkSchemeStructureToTreeViewObject = function (childItem, markSchemeGroupId) {
        if (markSchemeGroupId === void 0) { markSchemeGroupId = 0; }
        var index = this.currentIndex;
        var _treeItem = {
            name: childItem.name,
            itemType: enums.TreeViewItemType.QIG,
            parentClusterId: childItem.parentClusterId,
            sequenceNo: childItem.sequenceNo,
            uniqueId: childItem.uniqueId,
            isVisible: true,
            treeViewItemList: this.mapChildClusters(childItem.childClusters, '', markSchemeGroupId)
                .concat(this.mapAnswerItems(childItem.answerItems, '', markSchemeGroupId))
                .concat(this.mapMarkSchemes(markSchemeGroupId, childItem.markSchemes, enums.TreeViewItemType.QIG, childItem, ''))
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
        _treeItem.treeViewItemList = Immutable.List(_treeItem.treeViewItemList.toArray().sort(function (a, b) {
            return a.sequenceNo - b.sequenceNo;
        }));
        return _treeItem;
    };
    /**
     * Adding index to the sorted list.
     * @param {Immutable.List<treeViewItem>} items
     */
    TreeViewDataHelper.prototype.addIndex = function (item, setBindex) {
        var that = this;
        if (item.treeViewItemList) {
            item.treeViewItemList.map(function (_item) {
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
    };
    /**
     * Mapping the answer items
     * @param {Array<Object>} childItems
     * @returns
     */
    TreeViewDataHelper.prototype.mapAnswerItems = function (childItems, ancestors, markSchemeGroupId) {
        var _this = this;
        var treeItem = undefined;
        var items = Immutable.List();
        this.markschemeZoneCounter = 0;
        if (childItems) {
            var childItemCount_1 = childItems.count();
            var that_1 = this;
            items = childItems.map(function (item) {
                var index = 0;
                // Prevent dot appearing for mark scheme structure with no parent clusters
                var ancestorText = ancestors.length > 0 ? ancestors + '.' + item.displayLabel : item.displayLabel;
                _this.imageClusterIds.push(item.imageClusterId);
                return treeItem = {
                    name: item.displayLabel,
                    itemType: enums.TreeViewItemType.answerItem,
                    parentClusterId: item.parentClusterId,
                    sequenceNo: item.sequence,
                    uniqueId: item.uniqueId,
                    isVisible: item.markSchemes.count() > 1,
                    treeViewItemList: _this.mapMarkSchemes(markSchemeGroupId, item.markSchemes, enums.TreeViewItemType.answerItem, item, ancestorText, item.imageClusterId, item.markSchemes.count()),
                    index: index,
                    imageClusterId: item.imageClusterId,
                    usedInTotal: true,
                    nextIndex: 0,
                    previousIndex: 0,
                    isUnZonedItem: that_1.isEBookMarkingCCOn ?
                        (that_1.markschemeZoneCounter === childItemCount_1) : false,
                    markSchemeGroupId: markSchemeGroupId,
                    markSchemeCount: item.markSchemes.count(),
                    questionTagId: Number(item.questionTag)
                };
            }).toList();
            items = Immutable.List(sortHelper.sort(items.toArray(), comparerList.markSchemeViewSequenceComparer));
        }
        return items;
    };
    /**
     * mapping the mark schemes
     * @param {Array<Object>} childItems
     * @returns
     */
    TreeViewDataHelper.prototype.mapMarkSchemes = function (markSchemeGroupId, childItems, parentItemType, parent, ancestors, imageClusterId, answerItemChildCount) {
        var _this = this;
        var treeItem = undefined;
        var items = Immutable.List();
        var _isVisible = true;
        var displayId = undefined;
        var isMarkschemeLinked = false;
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
                .map(function (item) {
                var allocatedMark;
                _this.totalMarkSchemes++;
                var counter = 0;
                var remarks = Array();
                var allocatedRemark;
                // get the related mark Group Id for a whole response
                var markGroupId = markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup
                    ? 0
                    : markingStore.instance.getMarkGroupIdQIGtoRIGMap(item.markSchemeGroupId);
                if (_this.marksData) {
                    /* Get the marks for a specific mark scheme from the examiner marks collection */
                    var mark_1 = _this.marksData.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations[0].examinerMarksCollection.filter(function (x) { return x.markSchemeId === item.uniqueId; });
                    allocatedMark = _this.getMarkSchemeMark(mark_1, item);
                    /* Populate mark details of each mark scheme
                 If there is no mark associated need not to enter in to the collection.
                */
                    _this.populateOriginalMarkDetails({ displayMark: allocatedMark.mark, valueMark: allocatedMark.valueMark }, mark_1 && mark_1[0] ? mark_1[0] : undefined);
                    var marks_1 = _this.marksData.examinerMarkGroupDetails[markGroupId].allMarksAndAnnotations;
                    var originalMarkGroupId_1 = marks_1[0].originalMarkGroupId;
                    marks_1.map(function (remarkItem) {
                        // to set whether the markscheme is linked with a page or not
                        if (isMarkschemeLinked === false) {
                            isMarkschemeLinked = _this.isMarkSchemeLinkedToPage(marks_1, item.uniqueId, counter);
                        }
                        // avoid the current marks
                        if (counter > 0) {
                            var remark = marks_1[counter].examinerMarksCollection.filter(function (x) { return x.markSchemeId === item.uniqueId; });
                            allocatedRemark = _this.getMarkSchemeMark(remark, item);
                            remarks.push({
                                mark: { displayMark: allocatedRemark.mark, valueMark: allocatedRemark.valueMark },
                                usedInTotal: allocatedRemark.usedInTotal,
                                lowerTolerance: remark[0].lowerTolerance,
                                upperTolerance: remark[0].upperTolerance,
                                isDefinitive: remark[0].definitiveMark,
                                isOriginalMark: remark[0].markGroupId === originalMarkGroupId_1
                            });
                        }
                        counter++;
                    });
                }
                var ancestorText = displayId === undefined ?
                    (ancestors !== '' ? ancestors + '.' + item.name : item.name) : ancestors;
                // Update tooltip dictionary
                _this._toolTipInfo = _this._toolTipInfo.set(item.uniqueId, {
                    sequenceNo: item.sequence, markSchemeText: ancestorText,
                    markGroupId: markGroupId
                });
                _this.markSchemeIds.push(item.uniqueId);
                var index = 0;
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
                    allocatedMarks: { displayMark: allocatedMark ? allocatedMark.mark : '', valueMark: allocatedMark ? allocatedMark.valueMark : '' },
                    stepValue: item.markType.markStepValue,
                    minimumNumericMark: item.markType.minNumericMark,
                    imageClusterId: imageClusterId,
                    /* Get the available marks for the mark scheme */
                    availableMarks: _this.calculateAvailableMarks(item),
                    isSingleDigitMark: _this.checkIfSingleDigitMarkScheme(item),
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
                    isUnZonedItem: _this.isEBookMarkingCCOn() && answerItemChildCount === 1 ?
                        _this.isCurrentQuestionUnZoned(item.uniqueId, isMarkschemeLinked) : false,
                    markSchemeGroupId: markSchemeGroupId,
                    questionTagId: Number(parent.questionTag)
                };
            }).toList();
            items = Immutable.List(sortHelper.sort(items.toArray(), comparerList.markSchemeViewSequenceComparer));
        }
        return items;
    };
    /**
     * returns whether the mark scheme is linked with a page or not
     * @param marks
     * @param uniqueId
     * @param counter
     */
    TreeViewDataHelper.prototype.isMarkSchemeLinkedToPage = function (marks, uniqueId, counter) {
        var isMarkschemeLinked = false;
        var showDefAnnotationsOnly = markerOperationModeFactory.operationMode.isDefinitveMarkingStarted;
        var annotationsAgainstMarkScheme;
        if (showDefAnnotationsOnly) {
            annotationsAgainstMarkScheme = marks[counter].annotations.filter(function (x) { return x.markSchemeId === uniqueId && x.markingOperation !== enums.MarkingOperation.deleted &&
                x.definitiveMark === true; });
        }
        else {
            annotationsAgainstMarkScheme = marks[counter].annotations.filter(function (x) { return x.markSchemeId === uniqueId && x.markingOperation !== enums.MarkingOperation.deleted; });
        }
        if (annotationsAgainstMarkScheme && annotationsAgainstMarkScheme.length > 0) {
            isMarkschemeLinked = annotationsAgainstMarkScheme.some(function (x) { return x.stamp === constants.LINK_ANNOTATION; });
        }
        return isMarkschemeLinked;
    };
    /**
     * Get the formatted amrk value
     * @param markToFormat
     * @param item
     */
    TreeViewDataHelper.prototype.formatNumericValue = function (markToFormat, item) {
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
    };
    /**
     * Get the actual mark from marks collection to display on mark scheme
     * @param mark The mark
     * @param item The current mark scheme
     */
    TreeViewDataHelper.prototype.getMarkSchemeMark = function (mark, item) {
        var allocatedMark = '';
        var allocatedMarkValue = '';
        var usedInTotal = false;
        var marks;
        if (mark && mark.length > 0) {
            // always set from the mark collection if there are any marks
            usedInTotal = mark[0].usedInTotal;
            if (markerOperationModeFactory.operationMode.isDefinitveMarkingStarted && mark.length > 1) {
                mark.forEach(function (x) {
                    if (x.definitiveMark === true) {
                        marks = x;
                    }
                });
            }
            else {
                marks = mark[0];
            }
            /* filter out the mark if it has been deleted */
            if (marks.markingOperation && marks.markingOperation === enums.MarkingOperation.deleted ||
                (markerOperationModeFactory.operationMode.isDefinitveMarkingStarted && marks.definitiveMark !== true)) {
                return {
                    mark: '-',
                    usedInTotal: usedInTotal,
                    valueMark: '-'
                };
            }
            /* If the mark status is not attempted set the mark as NR */
            if (marks.markStatus && marks.markStatus.toLowerCase() === NR_MARK_STATUS) {
                allocatedMark = NOT_ATTEMPTED;
            }
            else if (marks.nonnumericMark && marks.nonnumericMark !== '') {
                /* set the non numeric value */
                allocatedMark = marks.nonnumericMark;
                allocatedMarkValue = marks.numericMark.toString();
            }
            else {
                /* Get the formatted mark */
                allocatedMark = this.formatNumericValue(marks.numericMark, item);
                allocatedMarkValue = null;
            }
        }
        else {
            allocatedMark = '-';
            usedInTotal = true;
        }
        return {
            mark: allocatedMark,
            usedInTotal: usedInTotal,
            valueMark: allocatedMarkValue
        };
    };
    /**
     * Mapping the child clusters
     * @param {Array<Object>} childItems
     * @returns
     */
    TreeViewDataHelper.prototype.mapChildClusters = function (childItems, ancestors, markSchemeGroupId) {
        var _this = this;
        var treeItem = undefined;
        var items = Immutable.List();
        if (childItems) {
            items = childItems
                .map(function (item) {
                var index = 0;
                var ancestorsText = ancestors !== '' ? ancestors + '.' + item.name : item.name;
                return (treeItem = {
                    name: item.name,
                    itemType: enums.TreeViewItemType.cluster,
                    parentClusterId: item.parentClusterId,
                    sequenceNo: item.sequenceNo,
                    uniqueId: item.uniqueId,
                    isVisible: true,
                    /* sort each child clusters */
                    treeViewItemList: Immutable.List(sortHelper.sort(_this.mapChildClusters(item.childClusters, ancestorsText, markSchemeGroupId)
                        .concat(_this.mapAnswerItems(item.answerItems, ancestorsText, markSchemeGroupId))
                        .concat(_this.mapMarkSchemes(markSchemeGroupId, item.markSchemes, enums.TreeViewItemType.cluster, item, ancestorsText))
                        .toArray(), comparerList.markSchemeViewSequenceComparer)),
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
            items = Immutable.List(sortHelper.sort(items.toArray(), comparerList.markSchemeViewSequenceComparer));
        }
        return items;
    };
    /**
     * determine weather we need to render remarks or not
     */
    TreeViewDataHelper.prototype.canRenderPreviousMarks = function () {
        return markerOperationModeFactory.operationMode.canRenderPreviousMarks;
    };
    Object.defineProperty(TreeViewDataHelper.prototype, "isPractice", {
        /**
         * gets whether the current worklist is practice.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.practice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isDirectedRemark", {
        /**
         * gets whether the current worklist is directed remark.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.directedRemark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isPooledRemark", {
        /**
         * gets whether the current worklist is pooled remark.
         * @returns
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.pooledRemark;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isStandardisation", {
        /**
         * gets whether the current worklist is Standardisation.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.standardisation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isSecondStandardisation", {
        /**
         * gets whether the current worklist is Second Standardisation.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.secondstandardisation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isLive", {
        /**
         * gets whether the current worklist is Live.
         */
        get: function () {
            return worklistStore.instance.currentWorklistType === enums.WorklistType.live;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isClosed", {
        /**
         * gets whether the current response mode is closed.
         */
        get: function () {
            return worklistStore.instance.getResponseMode === enums.ResponseMode.closed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isOpen", {
        /**
         * gets whether the current response mode is closed.
         */
        get: function () {
            return worklistStore.instance.getResponseMode === enums.ResponseMode.open;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "isSeedResponse", {
        /**
         * gets whether the response is seed.
         */
        get: function () {
            var currentResponse = worklistStore.instance
                .getCurrentWorklistResponseBaseDetails()
                .filter(function (responses) { return responses.markGroupId === responseStore.instance.selectedMarkGroupId; })
                .first();
            return currentResponse ? currentResponse.seedTypeId : undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns the type of previous marks column
     */
    TreeViewDataHelper.prototype.getPreviousMarksColumnType = function () {
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
    };
    /**
     * loop through the mark scheme tree nodes and populate the previous marks
     * @param tree
     */
    TreeViewDataHelper.prototype.traverseMarkSchemeTree = function (tree) {
        tree.previousMarks = [];
        for (var i = 0; i < markingStore.instance.getPreviousMarksCollectionCount() - 1; i++) {
            if (!tree.previousMarks) {
                tree.previousMarks = [];
            }
            this.getPreviousMarksSum(tree, [], i);
        }
    };
    /**
     * calculate the marks sum of tree nodes
     * @param tree
     * @param marksToTotal
     * @param index
     * @param recurseLevel
     */
    TreeViewDataHelper.prototype.getPreviousMarksSum = function (tree, marksToTotal, index) {
        var _this = this;
        if (marksToTotal === void 0) { marksToTotal = []; }
        var clusterSumValue = constants.NOT_ATTEMPTED;
        var usedInTotal;
        var clusterSum = 0;
        var clusterSumValueConsideringOptionality = constants.NOT_ATTEMPTED;
        var clusterSumConsideringOptionality = 0;
        var nrCount = 0;
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
            var previousMarksSumCollection_1 = [];
            tree.treeViewItemList.map(function (item) {
                if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                    previousMarksSumCollection_1.push(_this.getPreviousMarksSum(item, [], index));
                }
                else if (item.itemType === enums.TreeViewItemType.marksScheme) {
                    if (item.previousMarks !== null && item.previousMarks !== undefined && item.previousMarks.length > 0) {
                        usedInTotal = usedInTotal || item.previousMarks[index].usedInTotal;
                        marksToTotal.push(item.previousMarks[index]);
                    }
                }
            });
            if (previousMarksSumCollection_1.length > 0) {
                var counter_1 = 0;
                /* Appenidng the marksToTotal to previousMarksSumCollection to consider direct child markschemes*/
                previousMarksSumCollection_1 = previousMarksSumCollection_1.concat(marksToTotal);
                /* Sorting the list with descending order of mark. */
                var sortedList = sortHelper.sort(previousMarksSumCollection_1, comparerList.PreviousMarkComparerDesc);
                var optionalItemsCount_1 = (tree.maximumExpectedResponses && tree.maximumExpectedResponses > 0) ?
                    tree.maximumExpectedResponses : tree.treeViewItemList.count();
                sortedList.forEach(function (previousMarksSum) {
                    /* iterating the list till it met the optionality criteria */
                    if (counter_1 < optionalItemsCount_1) {
                        if (clusterSumValue === constants.NOT_ATTEMPTED) {
                            clusterSumValue = ((previousMarksSum.mark.valueMark) ? (previousMarksSum.mark.valueMark) :
                                (previousMarksSum.mark.displayMark));
                            clusterSum = previousMarksSum.mark.displayMark === constants.NOT_ATTEMPTED ? 0 : parseFloat(clusterSumValue);
                        }
                        else if (previousMarksSum.mark.displayMark !== constants.NOT_ATTEMPTED) {
                            clusterSumValue = (parseFloat(clusterSumValue) +
                                parseFloat(previousMarksSum.mark.valueMark
                                    ? previousMarksSum.mark.valueMark
                                    : previousMarksSum.mark.displayMark)).toString();
                            clusterSum = parseFloat(clusterSumValue);
                        }
                        usedInTotal = usedInTotal || previousMarksSum.usedInTotal;
                    }
                    counter_1++;
                });
            }
            else {
                marksToTotal.map(function (mark) {
                    // If used in total is set for atleast one question,
                    // then consider only the questions with UsedInTotal set as true
                    // for calculating the sum of the cluster
                    if (usedInTotal) {
                        if (isNaN(parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark) : (mark.mark.displayMark)))) {
                            nrCount++;
                        }
                        else if (mark.usedInTotal) {
                            clusterSumConsideringOptionality += parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark)
                                : (mark.mark.displayMark));
                        }
                    }
                    else {
                        // If used in total is not set for any questions,
                        // then consider all the questions with UsedInTotal set as false
                        // for calculating the sum of the cluster
                        // But the cluster itself will be striked off
                        if (isNaN(parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark) : (mark.mark.displayMark)))) {
                            nrCount++;
                        }
                        else if (!mark.usedInTotal) {
                            clusterSum += parseFloat((mark.mark.valueMark) ? (mark.mark.valueMark) : (mark.mark.displayMark));
                        }
                    }
                    _this.isDefinitive = mark.isDefinitive;
                    _this.isOriginalMark = mark.isOriginalMark;
                });
            }
            if (previousMarksSumCollection_1.length > 0) {
                clusterSumValue = clusterSum.toString();
            }
            else if (nrCount !== marksToTotal.length) {
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
    };
    /**
     * Calcualte availabe marks for each marks schemes
     * @param minimumMark The minimum mark for the mark scheme
     * @param maximumMark The maximum mark for the mark scheme
     * @param stepValue The step value for the mark scheme
     */
    TreeViewDataHelper.prototype.calculateAvailableMarks = function (item) {
        var availableMarks = Immutable.List();
        var mark = item.markType.minNumericMark;
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
        }
        else {
            if (this._isNonNumeric === false) {
                this._isNonNumeric = true;
                markingActionCreator.setNonNumericInfo();
            }
            var availableMarkList = Immutable.List(item.markType.markOptions);
            availableMarkList.forEach(function (item) {
                availableMarks = availableMarks.push({
                    displayMark: item.displayLabel.toString(),
                    valueMark: item.numericEquivalent.toString()
                });
            });
            // To sort the available marks based on ascending order of display mark.
            availableMarks = Immutable.List(availableMarks.sort(function (a, b) {
                return parseFloat(a.displayMark) - parseFloat(b.displayMark);
            }));
        }
        return availableMarks;
    };
    /**
     * return the index of the final node of tree
     */
    TreeViewDataHelper.prototype.getLastNodeIndex = function () {
        return this.lastNodeIndex;
    };
    /**
     * Populate amrk details of each mark schemes
     * @param allocatedMark
     * @param details
     */
    TreeViewDataHelper.prototype.populateOriginalMarkDetails = function (allocatedMark, details) {
        if (details) {
            var markDetails = {
                mark: allocatedMark,
                isDirty: details.isDirty,
                markId: details.markId,
                markSchemeId: details.markSchemeId,
                usedInTotal: details.usedInTotal
            };
            this.responseMarkList.push(markDetails);
        }
    };
    /**
     * Check if the mark scheme accept single digit mark or not
     * @param item
     */
    TreeViewDataHelper.prototype.checkIfSingleDigitMarkScheme = function (item) {
        if (item.markType.nonNumericIndicator === false) {
            if (item.markType.minNumericMark < 0 ||
                item.markType.maxNumericMark > 9 ||
                item.markType.markStepValue.toString().length > 1) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            var availableMarkList = Immutable.List(item.markType.markOptions);
            var isSingleDigit_1 = true;
            availableMarkList.forEach(function (item) {
                if (item.displayLabel.length > 1) {
                    isSingleDigit_1 = false;
                    return isSingleDigit_1;
                }
            });
            return isSingleDigit_1;
        }
    };
    Object.defineProperty(TreeViewDataHelper.prototype, "toolTipInfo", {
        /**
         * Returns the annotation tooltip dictionary
         */
        get: function () {
            return this._toolTipInfo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "lastMarkSchemeId", {
        /**
         * Returns the last mark scheme id
         */
        get: function () {
            return this._lastMarkSchemeId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeViewDataHelper.prototype, "currentlyVisibleElementCount", {
        /**
         * Returns the number of items visible in treeview, based on visiblity for whole response.
         */
        get: function () {
            return this.visibleElementCount;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * to set the flag for the mark schemes marked to reach optionality rule.
     */
    TreeViewDataHelper.prototype.setOptionalMarkSchemesMarkedStatus = function () {
        var _hasAllOptionalMarked = true;
        this.optionalItems.forEach(function (item) {
            if (item.optionalMarked === false && item.usedInTotal === true) {
                _hasAllOptionalMarked = false;
            }
        });
        this._hasAllOptionalMarkSchemesMarked = _hasAllOptionalMarked;
    };
    /**
     * sets the visibility and recalculates the index value, on navigating to different QIGs in Whole response.
     * @param treeView
     * @param selectedMarkSchemeGroupId
     */
    TreeViewDataHelper.prototype.navigateToQigInWholeResponse = function (treeView, selectedMarkSchemeGroupId, prevMarkSchemeGroupId) {
        if (prevMarkSchemeGroupId !== undefined) {
            treeView = this.updateQigVisibilityInNavigation(treeView, selectedMarkSchemeGroupId, prevMarkSchemeGroupId);
        }
        else {
            treeView = this.updateMultiQigVisibility(treeView, selectedMarkSchemeGroupId);
        }
        this.addIndex(treeView, false);
        return treeView;
    };
    /**
     * sets the visibilty flag, for the treeview nodes.
     * @param treeView
     * @param selectedMarkSchemeGroupId
     */
    TreeViewDataHelper.prototype.updateMultiQigVisibility = function (treeView, selectedMarkSchemeGroupId) {
        var _this = this;
        this.currentIndex = 0;
        this.visibleElementCount = 0;
        treeView.treeViewItemList.forEach(function (item) {
            if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                // Incase of whole response, the QIG item will be visible always even for the unselected markSchemeGroupId.
                if (item.parentClusterId === 0) {
                    item.isVisible = true;
                }
                else if (item.markSchemeGroupId === selectedMarkSchemeGroupId) {
                    if (item.itemType !== enums.TreeViewItemType.answerItem) {
                        item.isVisible = true;
                    }
                    else if (item.markSchemeCount > 1) {
                        // AnswerItem will be visible only when there are more than one markScheme under it.
                        item.isVisible = true;
                    }
                    else {
                        item.isVisible = false;
                    }
                }
                else {
                    item.isVisible = false;
                }
                _this.updateMultiQigVisibility(item, selectedMarkSchemeGroupId);
            }
            else if (item.markSchemeGroupId === selectedMarkSchemeGroupId) {
                item.isVisible = true;
            }
            else {
                item.isVisible = false;
            }
        });
        return treeView;
    };
    /**
     * updates the visiblity of the selected and the previously selected QIGS.
     * Optimised the treeview navigation in case of Whole response navigation to avoid unwanted tree nodes.
     * @param treeView
     * @param selectedMarkSchemeGroupId
     * @param previousMarkSchemeGroupId
     */
    TreeViewDataHelper.prototype.updateQigVisibilityInNavigation = function (treeView, selectedMarkSchemeGroupId, previousMarkSchemeGroupId) {
        var _this = this;
        this.currentIndex = 0;
        this.visibleElementCount = 0;
        treeView.treeViewItemList.forEach(function (item) {
            if (item.itemType === enums.TreeViewItemType.QIG &&
                (item.markSchemeGroupId === selectedMarkSchemeGroupId ||
                    item.markSchemeGroupId === previousMarkSchemeGroupId)) {
                var isVisible = item.markSchemeGroupId === selectedMarkSchemeGroupId ? true : false;
                var markSchemeGroupId = isVisible ? selectedMarkSchemeGroupId : previousMarkSchemeGroupId;
                item = _this.updateQigVisiblity(item, markSchemeGroupId, isVisible);
            }
        });
        return treeView;
    };
    /**
     * sets the visiblity flag, for the specified QIG.
     * @param treeView
     * @param markSchemeGroupId
     * @param isVisible
     */
    TreeViewDataHelper.prototype.updateQigVisiblity = function (treeView, markSchemeGroupId, isVisible) {
        var _this = this;
        treeView.treeViewItemList.forEach(function (item) {
            if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                // Incase of whole response, the QIG item will be visible always even for the unselected markSchemeGroupId.
                if (item.parentClusterId === 0) {
                    item.isVisible = true;
                }
                else if (item.markSchemeGroupId === markSchemeGroupId) {
                    if (item.itemType !== enums.TreeViewItemType.answerItem) {
                        item.isVisible = isVisible;
                    }
                    else if (item.markSchemeCount > 1) {
                        // AnswerItem will be visible only when there are more than one markScheme under it.
                        item.isVisible = isVisible;
                    }
                    else {
                        item.isVisible = false;
                    }
                }
                else {
                    item.isVisible = false;
                }
                _this.updateQigVisiblity(item, markSchemeGroupId, isVisible);
            }
            else if (item.markSchemeGroupId === markSchemeGroupId) {
                item.isVisible = isVisible;
            }
            else {
                item.isVisible = false;
            }
        });
        return treeView;
    };
    /**
     * to check whether the current question is unzoned.
     */
    TreeViewDataHelper.prototype.isCurrentQuestionUnZoned = function (markSchemeId, isMarkschemeLinked) {
        var isUnZoned;
        isUnZoned = this.responseImagezoneCollection
            ? this.responseImagezoneCollection.some(function (x) { return x.markSchemeId === markSchemeId && x.height === 0; }) && isMarkschemeLinked === false
            : false;
        if (isUnZoned === true) {
            this.markschemeZoneCounter++;
        }
        return isUnZoned;
    };
    /**
     * to check whether the Ebookmarking CC is ON
     */
    TreeViewDataHelper.prototype.isEBookMarkingCCOn = function () {
        return (configurableCharacteristicsHelper
            .getCharacteristicValue(configurableCharacteristicsNames.eBookmarking)
            .toLowerCase() === 'true');
    };
    return TreeViewDataHelper;
}());
module.exports = TreeViewDataHelper;
//# sourceMappingURL=treeviewdatahelper.js.map