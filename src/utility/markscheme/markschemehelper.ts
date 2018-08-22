import React = require('react');
import ReactDom = require('react-dom');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import Immutable = require('immutable');
import markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
import markingStore = require('../../stores/marking/markingstore');
import responseStore = require('../../stores/response/responsestore');
import worklistStore = require('../../stores/worklist/workliststore');
import enums = require('../../components/utility/enums');
import responseHelper = require('../../components/utility/responsehelper/responsehelper');
import userOptionsHelper = require('../useroption/useroptionshelper');
import annotationHelper = require('../../components/utility/annotation/annotationhelper');
import userOptionKeys = require('../useroption/useroptionkeys');
import qigStore = require('../../stores/qigselector/qigstore');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
import loginSession = require('../../app/loginsession');
import annotation = require('../../stores/response/typings/annotation');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import bookmarkHelper = require('../../stores/marking/bookmarkhelper');
import constants = require('../../components/utility/constants');
import LinkIcon = require('../../components/response/responsescreen/linktopage/linkicon');
import pageLinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
import markingHelper = require('./markinghelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import awardingStore = require('../../stores/awarding/awardingstore');
import awardingHelper = require('../../components/utility/awarding/awardinghelper');

class MarkSchemeHelper {

    // Holds value indicating the markscheme found.
    private isFound: boolean;

    // Hold the selected node type.
    private selectedNode: treeViewItem;

    // search result
    private searchNode: treeViewItem;

    // search result for first unmarked 
    private searchFirstUnMarkedNode: treeViewItem;

    private searchedTreeViewItem: treeViewItem;

    // Get the selected node
    public get selectedNodeGet(): treeViewItem {
        return this.selectedNode;
    }

    /**
     * Set the selected node
     * @param {treeViewItem} selectedItem
     * @param {boolean = true} isQuestionItemChanged
     */
    private selectedNodeSet(selectedItem: treeViewItem,
        isQuestionItemChanged: boolean = true,
        forceRender: boolean = false) {
        this.selectedNode = selectedItem;
        markingActionCreator.changeSelectedQuestionItem(//this.selectedNode
            {
                itemType: this.selectedNode.itemType,
                name: this.selectedNode.name,
                parentClusterId: this.selectedNode.parentClusterId,
                sequenceNo: this.selectedNode.sequenceNo,
                uniqueId: this.selectedNode.uniqueId,
                isVisible: this.selectedNode.isVisible,
                maximumNumericMark: this.selectedNode.maximumNumericMark,
                imageClusterId: this.selectedNode.imageClusterId,
                isSelected: this.selectedNode.isSelected,
                index: this.selectedNode.index,
                bIndex: this.selectedNode.bIndex,
                allocatedMarks: this.selectedNode.allocatedMarks,
                totalMarks: this.selectedNode.totalMarks,
                availableMarks: this.selectedNode.availableMarks,
                minimumNumericMark: this.selectedNode.minimumNumericMark,
                stepValue: this.selectedNode.stepValue,
                isSingleDigitMark: this.selectedNode.isSingleDigitMark,
                usedInTotal: this.selectedNode.usedInTotal,
                nextIndex: this.searchNode.nextIndex,
                previousIndex: this.searchNode.previousIndex,
                allowNR: this.selectedNode.allowNR,
                answerItemId: this.selectedNode.answerItemId,
                markSchemeGroupId: this.selectedNode.markSchemeGroupId,
                questionTagId: this.selectedNode.questionTagId
            },
            markerOperationModeFactory.operationMode.isAwardingMode,
            isQuestionItemChanged,
            forceRender);
    }

    /**
     * Set the selected node
     * @param {treeViewItem} selectedItem
     */
    public updateSelectedNode(selectedItem: treeViewItem) {
        this.selectedNodeSet(selectedItem);
    }

    // Holds default  translate string
    public get defaultCSSTranslate(): string {
        return '100';
    }

    // Indicate the offset panel
    // TODO need to move this to store once the component has been created.
    public get selectedPanelOffSet(): number {
        /** for open and closed responses pannel offset will be different */
        return markerOperationModeFactory.operationMode.isResponseEditable ? 53 : 34.5;
    }

    /**
     * Get the selected marking element Top offset
     * @param {any} component
     * @returns Dom element offsetTop
     */
    public static getDomOffSet(component: any): number {
        let element = ReactDom.findDOMNode(component);

        if (element === undefined) {
            return 0;
        }
        return element.offsetHeight;
    }

    /**
     * Process the navigation to the next markable / selected item
     * @param selectedNode
     * @param treeNode - {Immutable.List<treeViewItem>}
     * @returns.
     */
    public navigateToMarkScheme(selectedNode: treeViewItem,
        treeNode: treeViewItem,
        forceRender: boolean = false): Immutable.List<treeViewItem> {

        // Before navigating to the selected node, remove the selection from the previous item.
        if (markingStore.instance.currentQuestionItemInfo) {
            this.getMarkableItem(treeNode, markingStore.instance.currentQuestionItemInfo.bIndex, false);
        }

        // Find selected markscheme and set as selected
        this.getMarkableItem(treeNode, selectedNode.bIndex, true);

        // set the selected question item index
        markingActionCreator.setSelectedQuestionItemIndex(selectedNode.bIndex, this.searchNode.uniqueId);

        // set as selected only after find the element.
        this.selectedNodeSet(this.searchNode, true, forceRender);
        this.isFound = false;

        // Return the result.
        return treeNode.treeViewItemList;
    }
    /**
     * Navigating to the user selected markscheme.
     * @param {number} uniqueId
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    private findNode(treeNodes: Immutable.List<treeViewItem>): Immutable.List<treeViewItem> {
        let that = this;
        treeNodes.map((node: treeViewItem) => {

            // If the match found check whether it is markable (markscheme),
            // then mark as selected, otherwise jump to the next markable item.
            // Checking selected type is a must as item and markscheme may share the same id
            if (node.uniqueId === that.selectedNode.uniqueId && node.itemType === that.selectedNode.itemType) {

                if (that.isMarkableItem(node.itemType) === true) {

                    node.isSelected = true;
                } else if (node.treeViewItemList) {
                    // If the user selected cluster/answer item, navigate to the next markable item.
                    that.getFirstMarkScheme(node.treeViewItemList);
                }
            } else {
                node.isSelected = false;
            }

            // If has child elements loop through and make it unselected
            if (node.treeViewItemList) {
                that.findNode(node.treeViewItemList);
            }
        });
        return treeNodes;
    }

    /**
     * Indicate wether thew item type is markable or not
     * @param {enums.TreeViewItemType} itemType
     * @returns
     */
    private isMarkableItem(itemType: enums.TreeViewItemType): boolean {

        if (itemType === enums.TreeViewItemType.marksScheme) {
            return true;
        }

        return false;
    }

    /**
     * Select the fist markable item from the list
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    private getFirstMarkScheme(treeNodes: Immutable.List<treeViewItem>): void {
        let that = this;
        treeNodes.map((node: treeViewItem) => {

            if (that.isFound === true) {
                return;
            }

            if (that.isMarkableItem(node.itemType) === true) {

                // Mark the node has been selected
                node.isSelected = true;
                that.selectedNodeSet(node);
                that.isFound = true;
            } else {
                that.getFirstMarkScheme(node.treeViewItemList);
            }
        });
    }

    /**
     * Returns true if Marks and MarkSchemes are loaded in the respective store
     * @returns
     */
    public static isMarksAndMarkSchemesAreLoaded(): boolean {

        if (markerOperationModeFactory.operationMode.isAwardingMode) {

            return awardingStore.instance.selectedCandidateData ? markSchemeStructureStore.instance.isMarkSchemeStructureLoaded() : false;

        } else {

            let openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails
                (responseStore.instance.selectedDisplayId.toString());
            let isStandardisationSetupMode: boolean = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
            // If response is cached, it is available in marking store.
            if (standardisationSetupStore.instance.isSelectResponsesWorklist ||
                (openedResponseDetails && markingStore &&
                    markingStore.instance.isMarksLoaded(isStandardisationSetupMode ?
                        openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId))) {
                return (markSchemeStructureStore.instance.isMarkSchemeStructureLoaded());
            } else {
                return false;
            }
        }
    }

    /**
     * Load marks and annotations explicitly
     */
    public static loadMarksAndAnnotation() {
        let displayId = markerOperationModeFactory.operationMode.isAwardingMode ? responseStore.instance.selectedDisplayId
            : parseInt(markerOperationModeFactory.operationMode.getResponseDetailsByMarkGroupId(
            markingStore.instance.currentMarkGroupId).displayId);

        let selectedMarkingMode = markerOperationModeFactory.operationMode.isAwardingMode ? enums.MarkingMode.Sample
            : worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);

        MarkSchemeHelper.getMarks(displayId, selectedMarkingMode, markerOperationModeFactory.operationMode.isAwardingMode);
    }

    /**
     * Get the marks corresponsding to a response
     * @param responseId The response id
     */
    public static getMarks(responseId: number,
        markingMode: enums.MarkingMode,
        isFromAwarding: boolean = false,
        isFromStmWorklist: boolean = false) {
        let examinerRoleId;
        let markGroupId: number;
        let openedResponseDetails: any;
        let markGroupIds = [];
        let isStandardisationSetupMode: boolean;
        let candidateScriptId: number;
        let isPEOrAPE;
        let isWholeResponse: boolean;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            let selectedCandidateDetails: AwardingCandidateDetails = awardingHelper.awardingSelectedCandidateData();
            examinerRoleId = selectedCandidateDetails.responseItemGroups[0].examinerRoleId;
            markGroupId = selectedCandidateDetails.responseItemGroups[0].markGroupId;

            selectedCandidateDetails.responseItemGroups.map((x: ResponseItemGroup) => {
                markGroupIds.push(x.markGroupId);
            });

            candidateScriptId = selectedCandidateDetails.responseItemGroups[0].candidateScriptId;

            isPEOrAPE = false;
            isWholeResponse = true;

        } else {
            isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
            openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseId.toString());
            markGroupId = isStandardisationSetupMode ? openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId;

			markGroupIds = [markGroupId];
            // If a whole response, retrieve all the related markGroupIds
            if (openedResponseDetails.isWholeResponse && openedResponseDetails.relatedRIGDetails != null) {
                openedResponseDetails.relatedRIGDetails.map((y: RelatedRIGDetails) => {
                    markGroupIds.push(y.markGroupId);
                });
            }
            candidateScriptId = openedResponseDetails.candidateScriptId;
            isPEOrAPE = qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer ||
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer;

            isWholeResponse = openedResponseDetails.isWholeResponse;
        }

        let hasNonRecoverableErrors: boolean =
            markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(markGroupId);
        if (markerOperationModeFactory.operationMode.isRetrieveMarksAndAnnotationsRequired
            (markGroupId,
            hasNonRecoverableErrors) || isFromStmWorklist) {
            let isBlindPracticeMarkingOn: boolean = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true' ? true : false;
            let bookmarkFetchType: enums.BookMarkFetchType = bookmarkHelper.getBookMarkTypeForQIG(markingMode);

            let hasComplexOptionality = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.ComplexOptionality,
                markingStore.instance.selectedQIGMarkSchemeGroupId).toLowerCase() === 'true' ? true : false;

            let isReusableResponseView: boolean = false;

            if (standardisationSetupStore.instance.selectedStandardisationSetupWorkList === enums.StandardisationSetup.SelectResponse
                && standardisationSetupStore.instance.selectedTabInSelectResponse === enums.StandardisationSessionTab.PreviousSession) {
                isReusableResponseView = true;
            }

            responseActionCreator.retrieveMarksAndAnnotations(markGroupIds,
                markGroupId,
                isStandardisationSetupMode ? enums.MarkingMode.PreStandardisation : markingMode,
                candidateScriptId,
                isPEOrAPE,
                worklistStore.instance.getRemarkRequestType,
                isBlindPracticeMarkingOn,
                operationModeHelper.subExaminerId,
                loginSession.EXAMINER_ID,
                enums.Priority.First,
                bookmarkFetchType,
                isWholeResponse,
                hasComplexOptionality,
                isReusableResponseView,
                isFromAwarding);
        }
    }

    /**
     * Update the current mark and return the collection
     */
    public updateSelectedQuestionMark(currentNode: treeViewItem)
        : void {

        // This condition is to double ensure we are not updating a
        // wrong markscheme.
        if (currentNode.uniqueId === this.selectedNode.uniqueId) {
            this.selectedNode.allocatedMarks = currentNode.allocatedMarks;
            this.selectedNode.usedInTotal = currentNode.usedInTotal;
            this.selectedNodeSet(this.selectedNode, false);
        }
    }

    /**
     * Select the index of fist markable item from the list
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    public getMarkableItem(tree: treeViewItem, index: number, markAsSelected: boolean = undefined, uniqueId: number = 0): treeViewItem {
        if (uniqueId > 0) {
            this.searchNode = undefined;
            this.searchTreeViewWholeResponse(tree, uniqueId);
            //If searchNode not found by uniqueID, take the first unmarked question
            if (this.searchNode === undefined) {
                //Get the First unmarked item node when the selected node is not found in the tree(navigation from whole Response to single)
                this.getFirstUnmarkedItem(tree, true);
                //If found first unmarked set it as searchNode else tree 
                if (this.searchFirstUnMarkedNode) {
                    this.searchNode = this.searchFirstUnMarkedNode;
                } else {
                    this.searchNode = tree;
                }
            }
        } else {
            this.searchTreeView(tree, index);
        }

        // If the selected item is not a markable item (cluster/answeritem)
        // find the immediate markable item.
        if (this.searchNode.itemType !== enums.TreeViewItemType.marksScheme) {
            this.searchTreeView(this.searchNode, 0);
        }

        // If item is forced to set the selection do it accordingly.
        if (markAsSelected !== undefined) {
            this.searchNode.isSelected = markAsSelected;
        }
        return this.searchNode;
    }

    /**
     * Select the tree node item from given image zones
     * @param tree
     * @param imageZones
     * @param markAsSelected
     */
    public getFirstMarkableItemFromImageZones(tree: treeViewItem, imageZones: Immutable.List<ImageZone>, linkedPages: annotation[],
        markAsSelected: boolean = undefined): treeViewItem {
        let index: number = 1;
        let treeNodeFound: boolean = false;
        do {
            // find the first markable item
            this.searchTreeView(tree, index);

            // If the selected item is not a markable item (cluster/answeritem)
            // find the immediate markable item.
            if (this.searchNode.itemType !== enums.TreeViewItemType.marksScheme) {
                this.searchTreeView(this.searchNode, 0);
            }

            index = this.searchNode.nextIndex;

            // For ebookmarking, mark scheme id is mapped for finding the markable item
            imageZones.map((x: ImageZone) => {
                if (x.imageClusterId === this.searchNode.imageClusterId ||
                    (x.markSchemeId && x.markSchemeId === this.searchNode.uniqueId)) {
                    treeNodeFound = true;
                }
            });

            linkedPages.map((x: annotation) => {
                if (x.imageClusterId === this.searchNode.imageClusterId &&
                    x.markSchemeId === this.searchNode.uniqueId) {
                    treeNodeFound = true;
                }
            });

        } while (!treeNodeFound);


        // If item is forced to set the selection do it accordingly.
        if (markAsSelected !== undefined) {
            this.searchNode.isSelected = markAsSelected;
        }
        return this.searchNode;
    }

    /**
     * Get the next/previous markscheme item on traversal through panel
     * @param {treeViewItem} tree
     * @param {number} index
     * @param {enums.MarkSchemeNavigationDirection} direction
     * @returns the selected markscheme
     */
    public getMarkableItemByDirection(tree: treeViewItem,
        index: number,
        direction: enums.MarkSchemeNavigationDirection): treeViewItem {

        switch (direction) {

            // If navigating forward find the next markscheme from the ref.
            case enums.MarkSchemeNavigationDirection.Forward:
                this.getMarkableItem(tree, index);
                break;

            // If navigating forward find the previous markscheme from the ref.
            case enums.MarkSchemeNavigationDirection.Backward:
                this.getMarkableItem(tree, index);
                break;
        }

        return this.searchNode;
    }

	/**
	 * set the search tree view for whole response. (While navigating to whole response fron single response)
	 * @param tree
	 * @param uniqueId
	 */
    private searchTreeViewWholeResponse(tree: treeViewItem, uniqueId: number): void {
        if (uniqueId === tree.uniqueId && tree.itemType === enums.TreeViewItemType.marksScheme) {
            this.searchNode = tree;
            return;
        }

        if (tree.treeViewItemList) {
            let that = this;
            tree.treeViewItemList.forEach((x: treeViewItem) => {
                that.searchTreeViewWholeResponse(x, uniqueId);
            });
        }
    }

	/**
	 * This method will return first unmarked question item of the response.
	 * @param nodes
	 * @param clear
	 */
    public getFirstUnmarkedItem(nodes: treeViewItem, clear: boolean = false) {
        if (clear) {
            this.searchFirstUnMarkedNode = undefined;
        }
        let firstUnmarkedItem: number;
        let nodeDetails = nodes.treeViewItemList;
        nodeDetails.forEach((node: treeViewItem) => {
            // Iterate the treeViewItem ,exit the loop once it found the first unmarked item.
            if (node.itemType === enums.TreeViewItemType.marksScheme &&
                (node.allocatedMarks.displayMark === constants.NOT_MARKED || node.allocatedMarks.displayMark === constants.NO_MARK)
                && (this.searchFirstUnMarkedNode === undefined)) {
                this.searchFirstUnMarkedNode = node;
                return true;
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0
                && (this.searchFirstUnMarkedNode === undefined)) {
                this.getFirstUnmarkedItem(node, false);
            }
        });
        return this.searchFirstUnMarkedNode;
    }

    /**
     * set the search tree view
     * @param {treeViewItem} tree
     * @param {number} index
     * @returns
     */
    private searchTreeView(tree: treeViewItem, index: number): void {

        // If the search node has found and if the selected item is
        // markscheme mark the selection and set the node.
        // If index is 0 then find the immediate markable item
        if (index === 0) {
            if (tree.itemType === enums.TreeViewItemType.marksScheme) {
                this.searchNode = tree;
                return;
            }

        } else if (tree.bIndex === index) {
            this.searchNode = tree;
            return;
        } else if (tree.bIndex < index) {
            //Get the First unmarked item node when the selected node is not found in the tree(navigation from whole Response to single)
            this.getFirstUnmarkedItem(tree, true);
            //If found first unmarked set it as searchNode else tree 
            if (this.searchFirstUnMarkedNode) {
                this.searchNode = this.searchFirstUnMarkedNode;
            } else {
                this.searchNode = tree;
            }
            return;
        }

        // If has child nodes, loop through each node and check the bIndex of each item is less than
        // or equal to the selected bindex. If less the selected item go deeper to the current node.
        if (tree.treeViewItemList) {

            let that = this;
            tree.treeViewItemList.forEach((x: treeViewItem) => {
                if (index <= x.bIndex) {
                    that.searchTreeView(x, index);

                    // Skip all other exexutions to the wrong node.
                    return false;
                }
            });
        }
    }

    /**
     * Search tree view by sequence no
     * @param {treeViewItem} tree
     * @param {number} sequenceNo
     * @returns
     */
    public searchTreeViewBySequenceNo(tree: treeViewItem, sequenceNo: number): treeViewItem {
        let treeViewItems = tree.treeViewItemList;
        treeViewItems.some((tree: treeViewItem) => {
            // Iterate the treeViewItem ,exit the loop once it found the search item.
            if (tree.sequenceNo === sequenceNo &&
                (this.searchedTreeViewItem === undefined || this.searchedTreeViewItem == null)) {
                this.searchedTreeViewItem = tree;
                return true;
            }
            if (tree.treeViewItemList && tree.treeViewItemList.count() > 0
                && (this.searchedTreeViewItem === undefined || this.searchedTreeViewItem == null)) {
                this.searchTreeViewBySequenceNo(tree, sequenceNo);
            }
        });

        return this.searchedTreeViewItem;
    }

    /**
     *  This method will update the annotation tooltips against a markSchemeId
     */
    public updateAnnotationToolTips(toolTipInfo: Immutable.Map<number, MarkSchemeInfo>) {
        markSchemeStructureActionCreator.updateAnnotationToolTip(toolTipInfo);
    }

    /**
     * Get the longest question item width
     */
    public static getLongestQuestionItemWidth(hasPreviousColumn: boolean): Array<number> {
        let totalMarkSchemePanelWidth: number = 0;
        let markSchemePanel = document.getElementById('markSchemePanel');
        let markingSchemePanelContainer = markSchemePanel.querySelectorAll('.question-text');
        let markingItems = markSchemePanel.getElementsByClassName('question-item');
        let previousMarksPanel = markSchemePanel.getElementsByClassName('mark-bg-holder');
        let previousMarkListContainer = markSchemePanel.getElementsByClassName('pre-mark-col-bg');
        let questionMarkContainer = markSchemePanel.getElementsByClassName('question-mark');
        let previousMarksPanelWidth: number = previousMarksPanel && previousMarksPanel[0] ? previousMarksPanel[0].clientWidth : 0;
        let markSchemePanelWidthArray: Array<number> = [];
        let minMarkSchemePanelWidth: number = parseFloat($(markSchemePanel).css('min-width'));

        for (let i = 0; i < markingSchemePanelContainer.length; i++) {
            //the longest width of the question item is calculated by taking the span 'question-item' width and its padding
            // as well as its parent container margin left
            totalMarkSchemePanelWidth = parseInt($((markingItems)[i]).css('width'), 10) +
                (parseInt($((markingItems)[i]).css('padding-left'), 10)) / 3 +
                parseInt($((markingSchemePanelContainer)[i]).css('margin-left'), 10) * 3;

            // add question mark container width to markscheme panel width - only for live marking
            if (!hasPreviousColumn) {
                totalMarkSchemePanelWidth += questionMarkContainer[i].clientWidth;
            }
            //check if array 'markSchemePanelWidthArray' already contain value. if same value exist, then don't push it to array
            if (markSchemePanelWidthArray.indexOf(totalMarkSchemePanelWidth) === -1) {
                markSchemePanelWidthArray.push(totalMarkSchemePanelWidth);
            }
        }

        let longestQuestionItemWidth: number = 0;
        //get the largest width from array
        longestQuestionItemWidth = Math.max.apply(Math, markSchemePanelWidthArray);

        //if there are previous marklist column, then add 'N' no of columns to the longestQuestionItemWidth
        let prevMarkListWidth: number = 0;
        if (previousMarksPanelWidth > 0) {
            longestQuestionItemWidth += (previousMarkListContainer.length + 1) *
                previousMarkListContainer[0].clientWidth;
            prevMarkListWidth = previousMarkListContainer[0].clientWidth;
        }

        return [longestQuestionItemWidth, prevMarkListWidth, minMarkSchemePanelWidth];
    }

    /**
     * Returns the previous marks column width
     */
    public static getPreviousMarksColumnnWidth(): number {

        let previousMarksPanel = document.getElementsByClassName('mark-bg-holder');
        let previousMarkListContainer = document.getElementsByClassName('pre-mark-col-bg');
        let previousMarksPanelWidth: number = previousMarksPanel && previousMarksPanel[0] ? previousMarksPanel[0].clientWidth : 0;

        //if there are previous marklist column, then add 'N' no of columns to the longestQuestionItemWidth
        let prevMarkListWidth: number = 0;
        if (previousMarksPanelWidth > 0) {
            prevMarkListWidth = (previousMarkListContainer.length + 1) *
                previousMarkListContainer[0].clientWidth;
        }

        return prevMarkListWidth;
    }

    /**
     * Update default markscheme panel width
     * @param isVisible
     */
    public static updateDefaultMarkSchemePanelWidth(isVisible: boolean): number {
        let markingQuestionPanel = document.getElementById('markSchemePanel');
        if (markingQuestionPanel) {
            let defaultPanelWidth: number = parseFloat(markingStore.instance.getDefaultPanelWidth());
            let widthOfPrevMarkListColumn: number = markingStore.instance.getPreviousMarkListWidth();
            let newDefaultPanelWidth: number = 0;

            /* Below code is used to get the min-width of the parent markscheme panel 'marking-question-panel'
            ** When a new column is selected/ deselected from the dropdownlist, the min-width value of the parent container
            ** 'marking-question-panel' is different. When we stop dragging the panel resizer, we need to check whether the width
            ** has gone beyond the min-width. If so, update the value with min-width
            */
            let markschemeStyle = window.getComputedStyle(markingQuestionPanel);
            let minMarkSchemePanelWidth: number = parseFloat(markschemeStyle.minWidth);
            let defaultPanelWidthAfterColumnIsUpdated: string = markingStore.instance.getDefaultPanelWidthAfterColumnIsUpdated();

            /* when a new column is selected / deselected from the marklist column, the default panel width will change. so we
            ** need to store the new default panel width. So replacing existing defaultpanel width value with the new value.
            */
            if (defaultPanelWidthAfterColumnIsUpdated && parseFloat(defaultPanelWidthAfterColumnIsUpdated) > 0) {
                defaultPanelWidth = parseFloat(defaultPanelWidthAfterColumnIsUpdated);
            }

            //update the new min-width, after the marklist column is updated, as min-width of different marklist column is different
            if (minMarkSchemePanelWidth > 0) {
                markingActionCreator.setMinimumPanelWidth(minMarkSchemePanelWidth + 'px');
            }

            let markingSchemePanelWidth: number = parseFloat(userOptionsHelper.getUserOptionByName(
                userOptionKeys.MARKSCHEME_PANEL_WIDTH,
                qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId));

            if (markingSchemePanelWidth > 0) {
                //convert percentage to pixel
                markingSchemePanelWidth = annotationHelper.percentToPixelConversion(markingSchemePanelWidth, window.innerWidth);

                markingSchemePanelWidth = (isVisible) ? markingSchemePanelWidth + widthOfPrevMarkListColumn :
                    markingSchemePanelWidth - widthOfPrevMarkListColumn;

                //converting pixel to percent
                markingSchemePanelWidth = annotationHelper.pixelsToPercentConversion(markingSchemePanelWidth, window.innerWidth);

                // Change and Save the User options.
                userOptionsHelper.save(userOptionKeys.MARKSCHEME_PANEL_WIDTH, markingSchemePanelWidth.toString(), true, true);
            }

            /* add width of previous marklist column to default panelwidth when a new marklist column is checked from dropdown list
            ** else subtract it from default panelwidth
            */
            newDefaultPanelWidth = isVisible ? defaultPanelWidth + widthOfPrevMarkListColumn :
                defaultPanelWidth - widthOfPrevMarkListColumn;

            if (newDefaultPanelWidth > 0) {
                //update new default panelwidth
                markingActionCreator.updateDefaultPanelWidth(newDefaultPanelWidth + 'px', isVisible);
            }

            return newDefaultPanelWidth;
        }
    }

    /**
     * Remove classname from element
     * @param className
     */
    public static removeClassFromElement(containerClassName: string, elem?: Element): void {
        if (elem) {
            elem.className = elem.className.replace(containerClassName, '');
        }
    }

    /* return true if next response is available */
    public static get isNextResponseAvailable(): boolean {
        return markerOperationModeFactory.operationMode.isNextResponseAvailable(responseStore.instance.selectedDisplayId.toString());
    }

    /* return true if its the last response last question item */
    public get isLastResponseLastQuestion(): boolean {
        return !MarkSchemeHelper.isNextResponseAvailable &&
            worklistStore.instance.isLastNodeSelected;
    }

    /* Returns true if NR mark is allowed against the question item */
    public get isAllowNRDefinedForTheMarkScheme(): boolean {
        return (markingStore.instance.currentQuestionItemInfo === undefined ? false :
            markingStore.instance.currentQuestionItemInfo.allowNR);
    }

    /* return true if previous response is available */
    private get isPreviousResponseAvailable(): boolean {
        return markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseStore.instance.selectedDisplayId.toString());
    }

    /* return true if the worklist contains onle one response */
    public get isSingleResponse(): boolean {
        return !MarkSchemeHelper.isNextResponseAvailable && !this.isPreviousResponseAvailable;
    }

    /**
     * return jsx element for link indicator
     * @param id
     * @param toolTip
     */
    public static renderLinkIndicator(id: string, toolTip: string): JSX.Element {
        let componentProps: any;
        componentProps = {
            id: id,
            toolTip: toolTip
        };
        return React.createElement(LinkIcon, componentProps);
    }

    /**
     * return true if we need to render link indicator for a markscheme
     * @param markschemeId
     */
    public static doRenderLinkIndicator(markschemeId: number) {
        let linkedAnnotationsAgainstMarkscheme = pageLinkHelper.getAllLinkedItemsAgainstMarkSchemeID(markschemeId);
        return linkedAnnotationsAgainstMarkscheme && linkedAnnotationsAgainstMarkscheme.length > 0 &&
            (responseHelper.isEbookMarking ||
                responseStore.instance.markingMethod === enums.MarkingMethod.Structured);
    }

    /**
     * return markscheme id
     */
    public static getLinkableMarkschemeId(node: treeViewItem, tree: treeViewItem) {
        if (tree) {
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                let markSchemesWithSameImageClusterId = markingHelper.getMarkSchemesWithSameImageClusterId(tree, node.imageClusterId, true);
                if (markSchemesWithSameImageClusterId && markSchemesWithSameImageClusterId.count() > 1) {
                    // if we are having items with same image cluster then we need to show the link indicator
                    // at item level. as we are saving link annotation for the first item returning first item unique id.
                    let currentItem = markSchemesWithSameImageClusterId.first();
                    let parentNodeDetails = markingHelper.getMarkschemeParentNodeDetails(tree, currentItem.uniqueId, true);
                    if (parentNodeDetails.markSchemeCount > 1) {
                        return parentNodeDetails.uniqueId;
                    } else {
                        return node.uniqueId;
                    }
                } else {
                    return node.uniqueId;
                }
            } else if (responseHelper.isEbookMarking) {
                return node.uniqueId;
            }
        }
    }

    /**
     * Clear complex optionality
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    public static clearComplexOptionality(treeView: treeViewItem): treeViewItem {
        treeView.treeViewItemList.forEach((item: treeViewItem) => {
            if (item.treeViewItemList && item.treeViewItemList.count() > 0) {
                item.usedInTotal = true;
                this.clearComplexOptionality(item);
            } else {
                item.usedInTotal = true;
            }
        });

        return treeView;
    }
}

export = MarkSchemeHelper;