"use strict";
var React = require('react');
var ReactDom = require('react-dom');
var markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
var markingStore = require('../../stores/marking/markingstore');
var responseStore = require('../../stores/response/responsestore');
var worklistStore = require('../../stores/worklist/workliststore');
var enums = require('../../components/utility/enums');
var responseHelper = require('../../components/utility/responsehelper/responsehelper');
var userOptionsHelper = require('../useroption/useroptionshelper');
var annotationHelper = require('../../components/utility/annotation/annotationhelper');
var userOptionKeys = require('../useroption/useroptionkeys');
var qigStore = require('../../stores/qigselector/qigstore');
var responseActionCreator = require('../../actions/response/responseactioncreator');
var markingActionCreator = require('../../actions/marking/markingactioncreator');
var markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var operationModeHelper = require('../../components/utility/userdetails/userinfo/operationmodehelper');
var loginSession = require('../../app/loginsession');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
var bookmarkHelper = require('../../stores/marking/bookmarkhelper');
var constants = require('../../components/utility/constants');
var LinkIcon = require('../../components/response/responsescreen/linktopage/linkicon');
var pageLinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
var markingHelper = require('./markinghelper');
var MarkSchemeHelper = (function () {
    function MarkSchemeHelper() {
    }
    Object.defineProperty(MarkSchemeHelper.prototype, "selectedNodeGet", {
        // Get the selected node
        get: function () {
            return this.selectedNode;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set the selected node
     * @param {treeViewItem} selectedItem
     * @param {boolean = true} isQuestionItemChanged
     */
    MarkSchemeHelper.prototype.selectedNodeSet = function (selectedItem, isQuestionItemChanged, forceRender) {
        if (isQuestionItemChanged === void 0) { isQuestionItemChanged = true; }
        if (forceRender === void 0) { forceRender = false; }
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
        }, isQuestionItemChanged, forceRender);
    };
    /**
     * Set the selected node
     * @param {treeViewItem} selectedItem
     */
    MarkSchemeHelper.prototype.updateSelectedNode = function (selectedItem) {
        this.selectedNodeSet(selectedItem);
    };
    Object.defineProperty(MarkSchemeHelper.prototype, "defaultCSSTranslate", {
        // Holds default  translate string
        get: function () {
            return '100';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemeHelper.prototype, "selectedPanelOffSet", {
        // Indicate the offset panel
        // TODO need to move this to store once the component has been created.
        get: function () {
            /** for open and closed responses pannel offset will be different */
            return markerOperationModeFactory.operationMode.isResponseEditable ? 53 : 34.5;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the selected marking element Top offset
     * @param {any} component
     * @returns Dom element offsetTop
     */
    MarkSchemeHelper.getDomOffSet = function (component) {
        var element = ReactDom.findDOMNode(component);
        if (element === undefined) {
            return 0;
        }
        return element.offsetHeight;
    };
    /**
     * Process the navigation to the next markable / selected item
     * @param selectedNode
     * @param treeNode - {Immutable.List<treeViewItem>}
     * @returns.
     */
    MarkSchemeHelper.prototype.navigateToMarkScheme = function (selectedNode, treeNode, forceRender) {
        if (forceRender === void 0) { forceRender = false; }
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
    };
    /**
     * Navigating to the user selected markscheme.
     * @param {number} uniqueId
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    MarkSchemeHelper.prototype.findNode = function (treeNodes) {
        var that = this;
        treeNodes.map(function (node) {
            // If the match found check whether it is markable (markscheme),
            // then mark as selected, otherwise jump to the next markable item.
            // Checking selected type is a must as item and markscheme may share the same id
            if (node.uniqueId === that.selectedNode.uniqueId && node.itemType === that.selectedNode.itemType) {
                if (that.isMarkableItem(node.itemType) === true) {
                    node.isSelected = true;
                }
                else if (node.treeViewItemList) {
                    // If the user selected cluster/answer item, navigate to the next markable item.
                    that.getFirstMarkScheme(node.treeViewItemList);
                }
            }
            else {
                node.isSelected = false;
            }
            // If has child elements loop through and make it unselected
            if (node.treeViewItemList) {
                that.findNode(node.treeViewItemList);
            }
        });
        return treeNodes;
    };
    /**
     * Indicate wether thew item type is markable or not
     * @param {enums.TreeViewItemType} itemType
     * @returns
     */
    MarkSchemeHelper.prototype.isMarkableItem = function (itemType) {
        if (itemType === enums.TreeViewItemType.marksScheme) {
            return true;
        }
        return false;
    };
    /**
     * Select the fist markable item from the list
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    MarkSchemeHelper.prototype.getFirstMarkScheme = function (treeNodes) {
        var that = this;
        treeNodes.map(function (node) {
            if (that.isFound === true) {
                return;
            }
            if (that.isMarkableItem(node.itemType) === true) {
                // Mark the node has been selected
                node.isSelected = true;
                that.selectedNodeSet(node);
                that.isFound = true;
            }
            else {
                that.getFirstMarkScheme(node.treeViewItemList);
            }
        });
    };
    /**
     * Returns true if Marks and MarkSchemes are loaded in the respective store
     * @returns
     */
    MarkSchemeHelper.isMarksAndMarkSchemesAreLoaded = function () {
        var openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        var isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
        // If response is cached, it is available in marking store.
        if (markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup ||
            (openedResponseDetails && markingStore &&
                markingStore.instance.isMarksLoaded(isStandardisationSetupMode ?
                    openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId))) {
            return (markSchemeStructureStore.instance.isMarkSchemeStructureLoaded());
        }
        else {
            return false;
        }
    };
    /**
     * Load marks and annotations explicitly
     */
    MarkSchemeHelper.loadMarksAndAnnotation = function () {
        var displayId = parseInt(markerOperationModeFactory.operationMode.getResponseDetailsByMarkGroupId(markingStore.instance.currentMarkGroupId).displayId);
        var selectedMarkingMode = worklistStore.instance.getMarkingModeByWorkListType(worklistStore.instance.currentWorklistType);
        MarkSchemeHelper.getMarks(displayId, selectedMarkingMode);
    };
    /**
     * Get the marks corresponsding to a response
     * @param responseId The response id
     */
    MarkSchemeHelper.getMarks = function (responseId, markingMode) {
        var isStandardisationSetupMode = markerOperationModeFactory.operationMode.isStandardisationSetupMode;
        var openedResponseDetails = markerOperationModeFactory.operationMode.openedResponseDetails(responseId.toString());
        var markGroupId = isStandardisationSetupMode ? openedResponseDetails.esMarkGroupId : openedResponseDetails.markGroupId;
        var hasNonRecoverableErrors = markingStore.instance.checkMarkGroupItemHasNonRecoverableErrors(markGroupId);
        if (markerOperationModeFactory.operationMode.isRetrieveMarksAndAnnotationsRequired(markGroupId, hasNonRecoverableErrors)) {
            var isPEOrAPE = qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.principalExaminer ||
                qigStore.instance.selectedQIGForMarkerOperation.role === enums.ExaminerRole.assistantPrincipalExaminer;
            var isBlindPracticeMarkingOn = configurableCharacteristicsHelper.getCharacteristicValue(configurableCharacteristicsNames.BlindPracticeMarking).toLowerCase() === 'true' ? true : false;
            var bookmarkFetchType = bookmarkHelper.getBookMarkTypeForQIG(markingMode);
            var markGroupIds_1 = [markGroupId];
            // If a whole response, retrieve all the related markGroupIds
            if (openedResponseDetails.isWholeResponse && openedResponseDetails.relatedRIGDetails != null) {
                openedResponseDetails.relatedRIGDetails.map(function (y) {
                    markGroupIds_1.push(y.markGroupId);
                });
            }
            responseActionCreator.retrieveMarksAndAnnotations(markGroupIds_1, markGroupId, isStandardisationSetupMode ? enums.MarkingMode.PreStandardisation : markingMode, openedResponseDetails.candidateScriptId, isPEOrAPE, worklistStore.instance.getRemarkRequestType, isBlindPracticeMarkingOn, operationModeHelper.subExaminerId, loginSession.EXAMINER_ID, enums.Priority.First, bookmarkFetchType, openedResponseDetails.isWholeResponse);
        }
    };
    /**
     * Update the current mark and return the collection
     */
    MarkSchemeHelper.prototype.updateSelectedQuestionMark = function (currentNode) {
        // This condition is to double ensure we are not updating a
        // wrong markscheme.
        if (currentNode.uniqueId === this.selectedNode.uniqueId) {
            this.selectedNode.allocatedMarks = currentNode.allocatedMarks;
            this.selectedNode.usedInTotal = currentNode.usedInTotal;
            this.selectedNodeSet(this.selectedNode, false);
        }
    };
    /**
     * Select the index of fist markable item from the list
     * @param {Immutable.List<treeViewItem>} treeNodes
     */
    MarkSchemeHelper.prototype.getMarkableItem = function (tree, index, markAsSelected, uniqueId) {
        if (markAsSelected === void 0) { markAsSelected = undefined; }
        if (uniqueId === void 0) { uniqueId = 0; }
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
                }
                else {
                    this.searchNode = tree;
                }
            }
        }
        else {
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
    };
    /**
     * Select the tree node item from given image zones
     * @param tree
     * @param imageZones
     * @param markAsSelected
     */
    MarkSchemeHelper.prototype.getFirstMarkableItemFromImageZones = function (tree, imageZones, linkedPages, markAsSelected) {
        var _this = this;
        if (markAsSelected === void 0) { markAsSelected = undefined; }
        var index = 1;
        var treeNodeFound = false;
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
            imageZones.map(function (x) {
                if (x.imageClusterId === _this.searchNode.imageClusterId ||
                    (x.markSchemeId && x.markSchemeId === _this.searchNode.uniqueId)) {
                    treeNodeFound = true;
                }
            });
            linkedPages.map(function (x) {
                if (x.imageClusterId === _this.searchNode.imageClusterId &&
                    x.markSchemeId === _this.searchNode.uniqueId) {
                    treeNodeFound = true;
                }
            });
        } while (!treeNodeFound);
        // If item is forced to set the selection do it accordingly.
        if (markAsSelected !== undefined) {
            this.searchNode.isSelected = markAsSelected;
        }
        return this.searchNode;
    };
    /**
     * Get the next/previous markscheme item on traversal through panel
     * @param {treeViewItem} tree
     * @param {number} index
     * @param {enums.MarkSchemeNavigationDirection} direction
     * @returns the selected markscheme
     */
    MarkSchemeHelper.prototype.getMarkableItemByDirection = function (tree, index, direction) {
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
    };
    /**
     * set the search tree view for whole response. (While navigating to whole response fron single response)
     * @param tree
     * @param uniqueId
     */
    MarkSchemeHelper.prototype.searchTreeViewWholeResponse = function (tree, uniqueId) {
        if (uniqueId === tree.uniqueId && tree.itemType === enums.TreeViewItemType.marksScheme) {
            this.searchNode = tree;
            return;
        }
        if (tree.treeViewItemList) {
            var that_1 = this;
            tree.treeViewItemList.forEach(function (x) {
                that_1.searchTreeViewWholeResponse(x, uniqueId);
            });
        }
    };
    /**
     * This method will return first unmarked question item of the response.
     * @param nodes
     * @param clear
     */
    MarkSchemeHelper.prototype.getFirstUnmarkedItem = function (nodes, clear) {
        var _this = this;
        if (clear === void 0) { clear = false; }
        if (clear) {
            this.searchFirstUnMarkedNode = undefined;
        }
        var firstUnmarkedItem;
        var nodeDetails = nodes.treeViewItemList;
        nodeDetails.forEach(function (node) {
            // Iterate the treeViewItem ,exit the loop once it found the first unmarked item.
            if (node.itemType === enums.TreeViewItemType.marksScheme &&
                (node.allocatedMarks.displayMark === constants.NOT_MARKED || node.allocatedMarks.displayMark === constants.NO_MARK)
                && (_this.searchFirstUnMarkedNode === undefined)) {
                _this.searchFirstUnMarkedNode = node;
                return true;
            }
            if (node.treeViewItemList && node.treeViewItemList.count() > 0
                && (_this.searchFirstUnMarkedNode === undefined)) {
                _this.getFirstUnmarkedItem(node, false);
            }
        });
        return this.searchFirstUnMarkedNode;
    };
    /**
     * set the search tree view
     * @param {treeViewItem} tree
     * @param {number} index
     * @returns
     */
    MarkSchemeHelper.prototype.searchTreeView = function (tree, index) {
        // If the search node has found and if the selected item is
        // markscheme mark the selection and set the node.
        // If index is 0 then find the immediate markable item
        if (index === 0) {
            if (tree.itemType === enums.TreeViewItemType.marksScheme) {
                this.searchNode = tree;
                return;
            }
        }
        else if (tree.bIndex === index) {
            this.searchNode = tree;
            return;
        }
        else if (tree.bIndex < index) {
            //Get the First unmarked item node when the selected node is not found in the tree(navigation from whole Response to single)
            this.getFirstUnmarkedItem(tree, true);
            //If found first unmarked set it as searchNode else tree 
            if (this.searchFirstUnMarkedNode) {
                this.searchNode = this.searchFirstUnMarkedNode;
            }
            else {
                this.searchNode = tree;
            }
            return;
        }
        // If has child nodes, loop through each node and check the bIndex of each item is less than
        // or equal to the selected bindex. If less the selected item go deeper to the current node.
        if (tree.treeViewItemList) {
            var that_2 = this;
            tree.treeViewItemList.forEach(function (x) {
                if (index <= x.bIndex) {
                    that_2.searchTreeView(x, index);
                    // Skip all other exexutions to the wrong node.
                    return false;
                }
            });
        }
    };
    /**
     * Search tree view by sequence no
     * @param {treeViewItem} tree
     * @param {number} sequenceNo
     * @returns
     */
    MarkSchemeHelper.prototype.searchTreeViewBySequenceNo = function (tree, sequenceNo) {
        var _this = this;
        var treeViewItems = tree.treeViewItemList;
        treeViewItems.some(function (tree) {
            // Iterate the treeViewItem ,exit the loop once it found the search item.
            if (tree.sequenceNo === sequenceNo &&
                (_this.searchedTreeViewItem === undefined || _this.searchedTreeViewItem == null)) {
                _this.searchedTreeViewItem = tree;
                return true;
            }
            if (tree.treeViewItemList && tree.treeViewItemList.count() > 0
                && (_this.searchedTreeViewItem === undefined || _this.searchedTreeViewItem == null)) {
                _this.searchTreeViewBySequenceNo(tree, sequenceNo);
            }
        });
        return this.searchedTreeViewItem;
    };
    /**
     *  This method will update the annotation tooltips against a markSchemeId
     */
    MarkSchemeHelper.prototype.updateAnnotationToolTips = function (toolTipInfo) {
        markSchemeStructureActionCreator.updateAnnotationToolTip(toolTipInfo);
    };
    /**
     * Get the longest question item width
     */
    MarkSchemeHelper.getLongestQuestionItemWidth = function (hasPreviousColumn) {
        var totalMarkSchemePanelWidth = 0;
        var markSchemePanel = document.getElementById('markSchemePanel');
        var markingSchemePanelContainer = markSchemePanel.querySelectorAll('.question-text');
        var markingItems = markSchemePanel.getElementsByClassName('question-item');
        var previousMarksPanel = markSchemePanel.getElementsByClassName('mark-bg-holder');
        var previousMarkListContainer = markSchemePanel.getElementsByClassName('pre-mark-col-bg');
        var questionMarkContainer = markSchemePanel.getElementsByClassName('question-mark');
        var previousMarksPanelWidth = previousMarksPanel && previousMarksPanel[0] ? previousMarksPanel[0].clientWidth : 0;
        var markSchemePanelWidthArray = [];
        var minMarkSchemePanelWidth = parseFloat($(markSchemePanel).css('min-width'));
        for (var i = 0; i < markingSchemePanelContainer.length; i++) {
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
        var longestQuestionItemWidth = 0;
        //get the largest width from array
        longestQuestionItemWidth = Math.max.apply(Math, markSchemePanelWidthArray);
        //if there are previous marklist column, then add 'N' no of columns to the longestQuestionItemWidth
        var prevMarkListWidth = 0;
        if (previousMarksPanelWidth > 0) {
            longestQuestionItemWidth += (previousMarkListContainer.length + 1) *
                previousMarkListContainer[0].clientWidth;
            prevMarkListWidth = previousMarkListContainer[0].clientWidth;
        }
        return [longestQuestionItemWidth, prevMarkListWidth, minMarkSchemePanelWidth];
    };
    /**
     * Returns the previous marks column width
     */
    MarkSchemeHelper.getPreviousMarksColumnnWidth = function () {
        var previousMarksPanel = document.getElementsByClassName('mark-bg-holder');
        var previousMarkListContainer = document.getElementsByClassName('pre-mark-col-bg');
        var previousMarksPanelWidth = previousMarksPanel && previousMarksPanel[0] ? previousMarksPanel[0].clientWidth : 0;
        //if there are previous marklist column, then add 'N' no of columns to the longestQuestionItemWidth
        var prevMarkListWidth = 0;
        if (previousMarksPanelWidth > 0) {
            prevMarkListWidth = (previousMarkListContainer.length + 1) *
                previousMarkListContainer[0].clientWidth;
        }
        return prevMarkListWidth;
    };
    /**
     * Update default markscheme panel width
     * @param isVisible
     */
    MarkSchemeHelper.updateDefaultMarkSchemePanelWidth = function (isVisible) {
        var markingQuestionPanel = document.getElementById('markSchemePanel');
        if (markingQuestionPanel) {
            var defaultPanelWidth = parseFloat(markingStore.instance.getDefaultPanelWidth());
            var widthOfPrevMarkListColumn = markingStore.instance.getPreviousMarkListWidth();
            var newDefaultPanelWidth = 0;
            /* Below code is used to get the min-width of the parent markscheme panel 'marking-question-panel'
            ** When a new column is selected/ deselected from the dropdownlist, the min-width value of the parent container
            ** 'marking-question-panel' is different. When we stop dragging the panel resizer, we need to check whether the width
            ** has gone beyond the min-width. If so, update the value with min-width
            */
            var markschemeStyle = window.getComputedStyle(markingQuestionPanel);
            var minMarkSchemePanelWidth = parseFloat(markschemeStyle.minWidth);
            var defaultPanelWidthAfterColumnIsUpdated = markingStore.instance.getDefaultPanelWidthAfterColumnIsUpdated();
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
            var markingSchemePanelWidth = parseFloat(userOptionsHelper.getUserOptionByName(userOptionKeys.MARKSCHEME_PANEL_WIDTH, qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId));
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
    };
    /**
     * Remove classname from element
     * @param className
     */
    MarkSchemeHelper.removeClassFromElement = function (containerClassName, elem) {
        if (elem) {
            elem.className = elem.className.replace(containerClassName, '');
        }
    };
    Object.defineProperty(MarkSchemeHelper, "isNextResponseAvailable", {
        /* return true if next response is available */
        get: function () {
            return markerOperationModeFactory.operationMode.isNextResponseAvailable(responseStore.instance.selectedDisplayId.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemeHelper.prototype, "isLastResponseLastQuestion", {
        /* return true if its the last response last question item */
        get: function () {
            return !MarkSchemeHelper.isNextResponseAvailable &&
                worklistStore.instance.isLastNodeSelected;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemeHelper.prototype, "isAllowNRDefinedForTheMarkScheme", {
        /* Returns true if NR mark is allowed against the question item */
        get: function () {
            return (markingStore.instance.currentQuestionItemInfo === undefined ? false :
                markingStore.instance.currentQuestionItemInfo.allowNR);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemeHelper.prototype, "isPreviousResponseAvailable", {
        /* return true if previous response is available */
        get: function () {
            return markerOperationModeFactory.operationMode.isPreviousResponseAvailable(responseStore.instance.selectedDisplayId.toString());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemeHelper.prototype, "isSingleResponse", {
        /* return true if the worklist contains onle one response */
        get: function () {
            return !MarkSchemeHelper.isNextResponseAvailable && !this.isPreviousResponseAvailable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * return jsx element for link indicator
     * @param id
     * @param toolTip
     */
    MarkSchemeHelper.renderLinkIndicator = function (id, toolTip) {
        var componentProps;
        componentProps = {
            id: id,
            toolTip: toolTip
        };
        return React.createElement(LinkIcon, componentProps);
    };
    /**
     * return true if we need to render link indicator for a markscheme
     * @param markschemeId
     */
    MarkSchemeHelper.doRenderLinkIndicator = function (markschemeId) {
        var linkedAnnotationsAgainstMarkscheme = pageLinkHelper.getAllLinkedItemsAgainstMarkSchemeID(markschemeId);
        return linkedAnnotationsAgainstMarkscheme && linkedAnnotationsAgainstMarkscheme.length > 0 &&
            (responseHelper.isEbookMarking ||
                responseStore.instance.markingMethod === enums.MarkingMethod.Structured);
    };
    /**
     * return markscheme id
     */
    MarkSchemeHelper.getLinkableMarkschemeId = function (node, tree) {
        if (tree) {
            if (responseStore.instance.markingMethod === enums.MarkingMethod.Structured) {
                var markSchemesWithSameImageClusterId = markingHelper.getMarkSchemesWithSameImageClusterId(tree, node.imageClusterId, true);
                if (markSchemesWithSameImageClusterId && markSchemesWithSameImageClusterId.count() > 1) {
                    // if we are having items with same image cluster then we need to show the link indicator
                    // at item level. as we are saving link annotation for the first item returning first item unique id.
                    var currentItem = markSchemesWithSameImageClusterId.first();
                    var parentNodeDetails = markingHelper.getMarkschemeParentNodeDetails(tree, currentItem.uniqueId, true);
                    if (parentNodeDetails.markSchemeCount > 1) {
                        return parentNodeDetails.uniqueId;
                    }
                    else {
                        return node.uniqueId;
                    }
                }
                else {
                    return node.uniqueId;
                }
            }
            else if (responseHelper.isEbookMarking) {
                return node.uniqueId;
            }
        }
    };
    return MarkSchemeHelper;
}());
module.exports = MarkSchemeHelper;
//# sourceMappingURL=markschemehelper.js.map