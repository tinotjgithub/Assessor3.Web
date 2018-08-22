"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var enums = require('../../utility/enums');
var treeViewHelper = require('../../../utility/treeviewhelpers/treeviewhelper');
var constants = require('../constants');
/* tslint:disable:variable-name  */
var TreeNode = function (props) {
    // Selected markscheme style
    var SELECTEDNODE = 'question-list current';
    // normal markscheme style
    var NORMAL_MARK = 'question-list';
    /**
     * Setting markascheme style
     * @returns
     */
    var isNodeSelected = function () {
        if (props.node.isSelected) {
            return SELECTEDNODE;
        }
        // Normal mark
        return NORMAL_MARK;
    };
    var counter = 0;
    var nodes;
    var nodeElement;
    var nodeUlElement;
    var classname = 'question-list marked-question';
    /**
     * generating the nodelement using helper
     */
    nodeElement = props.node.isVisible ? treeViewHelper.getNodeElement(props.node, props.id + counter.toString(), 'key_' + props.id + counter.toString(), props.navigateToMarkScheme, props.onMarkSchemeSelected, props.reload, props.previousMarks, props.isNonNumeric, props.isWholeResponse, props.isOpen, props.linkedItems) : null;
    if (props.children) {
        nodes = props.children.map(function (nodeItem) {
            counter++;
            return React.createElement(TreeNode, {node: nodeItem, children: nodeItem.treeViewItemList, id: 'item' + counter.toString(), key: 'item' + counter.toString(), navigateToMarkScheme: props.navigateToMarkScheme, onMarkSchemeSelected: props.onMarkSchemeSelected, reload: props.reload, selectedLanguage: props.selectedLanguage, previousMarks: nodeItem.previousMarks, isNonNumeric: props.isNonNumeric, isWholeResponse: props.isWholeResponse, isOpen: props.isOpen, isResponseEditable: props.isResponseEditable, linkedItems: props.linkedItems});
        });
        /** if the current nodes has visible childrens setting the class name and the inner ul element */
        var _hasChild = (props.node.treeViewItemList.count() > 0) ? true : false;
        if (_hasChild) {
            classname = 'question-list has-sub';
            classname += (props.isWholeResponse && props.node.itemType === enums.TreeViewItemType.QIG) ?
                (props.isOpen ? ' qig-list open freeze' : ' qig-list close') : ' open';
            classname += (props.node.itemType === enums.TreeViewItemType.QIG ? ' expandable' : '');
            var cssStyle = null;
            if (props.isWholeResponse
                && props.node.itemType === enums.TreeViewItemType.QIG
                && props.isOpen && props.visibleTreeNodeCount) {
                var activeQuestionPanel = (props.isResponseEditable) ?
                    constants.ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_OPEN_RESPONSE :
                    constants.ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_CLOSED_RESPONSE;
                cssStyle = {
                    maxHeight: ((props.visibleTreeNodeCount - 1) * constants.MARK_SCHEME_HEIGHT +
                        activeQuestionPanel).toString() + 'px'
                };
            }
            nodeUlElement = React.createElement("ul", {className: 'question-group', style: cssStyle}, nodes);
            /**
             * if nodeelement is null no need to display an ul and li.
             * instead directly display the first child elements
             */
            if (nodeElement == null) {
                nodeElement = nodes.first();
            }
            else {
                nodeElement = (React.createElement("li", {className: classname}, nodeElement, nodeUlElement));
            }
        }
        else {
            nodeElement = null;
        }
    }
    else {
        if (props.node.isVisible) {
            nodeElement = React.createElement("li", {className: isNodeSelected()}, nodeElement);
        }
        else {
            nodeElement = null;
        }
    }
    return nodeElement;
};
module.exports = TreeNode;
//# sourceMappingURL=treenode.js.map