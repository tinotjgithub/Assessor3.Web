"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../../base/purerendercomponent');
var Node = require('./node');
var enums = require('../../../utility/enums');
/**
 * React component class for Link to question tree node.
 */
var LinkToPageTreeNode = (function (_super) {
    __extends(LinkToPageTreeNode, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function LinkToPageTreeNode(props, state) {
        _super.call(this, props, state);
    }
    /**
     * renders the component
     */
    LinkToPageTreeNode.prototype.render = function () {
        var counter = 0;
        var nodes;
        var nodeElement;
        var nodeUlElement;
        var classname = 'question-list marked-question';
        var areAllChildNodesSkipped = true;
        var id = this.props.node.bIndex.toString();
        nodeElement = this.props.node.isVisible ? this.getNodeElement(this.props.node, this.props.id + '-' + id, 'key_' + this.props.id + counter.toString(), this.props.currentPageNumber) : null;
        if (this.props.children) {
            var that_1 = this;
            // remove childer with same imageclusterid of that of parent
            var imageClusterId_1 = this.props.node.imageClusterId;
            var childNodesToRemove_1 = this.props.children.filter(function (item) { return item.imageClusterId === imageClusterId_1
                && item.itemType === enums.TreeViewItemType.marksScheme; });
            nodes = this.props.children.map(function (node) {
                counter++;
                if ((childNodesToRemove_1.count() > 1 && childNodesToRemove_1.contains(node)) ||
                    ((that_1.props.node.itemType === enums.TreeViewItemType.cluster ||
                        that_1.props.node.itemType === enums.TreeViewItemType.QIG) &&
                        node.itemType === enums.TreeViewItemType.marksScheme)) {
                    return null;
                }
                areAllChildNodesSkipped = false;
                return (React.createElement(LinkToPageTreeNode, {node: node, children: node.treeViewItemList, id: 'item' + counter.toString(), key: 'item' + counter.toString(), selectedLanguage: that_1.props.selectedLanguage, renderedOn: Date.now(), currentPageNumber: that_1.props.currentPageNumber, addLinkAnnotation: that_1.props.addLinkAnnotation, removeLinkAnnotation: that_1.props.removeLinkAnnotation}));
            });
            if (areAllChildNodesSkipped) {
                // render the node to show the link icon which are not markscheme item
                nodeElement = this.props.node.isVisible ? this.getNodeElement(this.props.node, this.props.id + '-' + id, 'key_' + this.props.id + counter.toString(), this.props.currentPageNumber, this.props.children, true) : null;
            }
            /** if the current nodes has visible childrens setting the class name and the inner ul element */
            var _hasChild = (this.props.node.treeViewItemList.count() > 0) ? true : false;
            if (_hasChild) {
                classname = (this.props.node.itemType === enums.TreeViewItemType.QIG) ? 'question-list expandable has-sub' :
                    areAllChildNodesSkipped ? 'question-list' : 'question-list has-sub open';
                nodeUlElement = React.createElement("ul", {id: 'question-group-' + id, className: 'question-group'}, nodes);
                /**
                 * if nodeelement is null no need to display an ul and li.
                 * instead directly display the first child elements
                 */
                if (nodeElement == null) {
                    nodeElement = nodes.first();
                }
                else {
                    nodeElement = (React.createElement("li", {id: 'question-list-' + id, className: classname}, nodeElement, nodeUlElement));
                }
            }
            else {
                nodeElement = null;
            }
        }
        else {
            if (this.props.node.isVisible) {
                nodeElement = React.createElement("li", {id: 'question-list-' + id, className: 'question-list'}, nodeElement);
            }
            else {
                nodeElement = null;
            }
        }
        return nodeElement;
    };
    /**
     * return the node element
     * @param item
     * @param elementId
     * @param elementKey
     */
    LinkToPageTreeNode.prototype.getNodeElement = function (item, elementId, elementKey, currentPageNumber, childNodes, isChildrenSkipped) {
        if (childNodes === void 0) { childNodes = null; }
        if (isChildrenSkipped === void 0) { isChildrenSkipped = false; }
        var nodeElement = null;
        var addLinkAnnotation = this.props.addLinkAnnotation;
        var removeLinkAnnotation = this.props.removeLinkAnnotation;
        var componentProps;
        componentProps = {
            key: elementKey,
            id: elementId,
            node: item,
            isChildrenSkipped: isChildrenSkipped,
            renderedOn: Date.now(),
            childNodes: childNodes,
            currentPageNumber: currentPageNumber,
            addLinkAnnotation: addLinkAnnotation,
            removeLinkAnnotation: removeLinkAnnotation
        };
        return React.createElement(Node, componentProps);
    };
    return LinkToPageTreeNode;
}(pureRenderComponent));
module.exports = LinkToPageTreeNode;
//# sourceMappingURL=linktopagetreenode.js.map