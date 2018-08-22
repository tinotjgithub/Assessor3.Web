"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var TreeNode = require('./treenode');
/* tslint:disable:variable-name  */
/**
 * Represents the TreeView Compoent
 */
var TreeView = function (props) {
    /**
     * Get the transform style.
     * @returns Style
     */
    var getStyle = function () {
        var style = { transform: 'translateY(' + props.offset + 'px)' };
        return style;
    };
    var counter = 0;
    var _treeNodes = props.treeNodes;
    var nodes = props.treeNodes.treeViewItemList.map(function (nodeItem) {
        counter++;
        return React.createElement(TreeNode, {node: nodeItem, children: nodeItem.treeViewItemList, id: 'tree' + counter.toString(), key: 'tree' + counter.toString(), navigateToMarkScheme: props.navigateToMarkScheme, onMarkSchemeSelected: props.onMarkSchemeSelected, reload: props.reload, selectedLanguage: props.selectedLanguage, previousMarks: nodeItem.previousMarks, isNonNumeric: props.isNonNumeric, isWholeResponse: props.isWholeResponse, isOpen: props.selectedMarkSchemeGroupId === nodeItem.markSchemeGroupId, visibleTreeNodeCount: props.visibleTreeNodeCount, isResponseEditable: props.isResponseEditable, linkedItems: props.linkedItems});
    });
    return (React.createElement("div", {className: 'question-group-align-holder'}, React.createElement("ul", {id: 'question-group-container', className: 'question-group-container', style: getStyle()}, nodes)));
};
module.exports = TreeView;
//# sourceMappingURL=treeview.js.map