"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var Immutable = require('immutable');
var pureRenderComponent = require('../../../base/purerendercomponent');
var enums = require('../../../utility/enums');
var pageLinkHelper = require('./pagelinkhelper');
var LinkIcon = require('./linkicon');
var Node = (function (_super) {
    __extends(Node, _super);
    /**
     * @constructor
     */
    function Node(props, state) {
        _super.call(this, props, state);
        this.state = {
            isSelected: pageLinkHelper.isLinked(this.props.node, this.props.currentPageNumber, this.props.isChildrenSkipped, this.props.childNodes)
        };
        this.onClick = this.onClick.bind(this);
        this._annotations = Immutable.List();
    }
    /**
     * Component will receive props
     */
    Node.prototype.componentWillReceiveProps = function (nxtProps) {
        this.setState({
            isSelected: pageLinkHelper.isLinked(this.props.node, nxtProps.currentPageNumber, this.props.isChildrenSkipped, this.props.childNodes)
        });
    };
    /**
     * Render method
     */
    Node.prototype.render = function () {
        return (React.createElement("a", {href: 'javascript:void(0)', className: this.getClassName, tabIndex: -1, onClick: this.onClick}, React.createElement("span", {className: 'question-text', id: this.props.id}, this.props.node.name), this.getLinkIcon));
    };
    Object.defineProperty(Node.prototype, "getClassName", {
        /* return the classname for the node */
        get: function () {
            if (this.state.isSelected && (this.props.node.itemType === enums.TreeViewItemType.marksScheme
                || this.props.node.itemType === enums.TreeViewItemType.answerItem)) {
                return 'question-item selected-question';
            }
            return 'question-item';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "getLinkIcon", {
        /*returns the link item for the node */
        get: function () {
            if (this.isLinkableItem) {
                return React.createElement(LinkIcon, {id: 'link_icon_' +
                    this.props.node.bIndex.toString()});
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * click event for node
     */
    Node.prototype.onClick = function () {
        if (this.isLinkableItem) {
            this.setState({
                isSelected: !this.state.isSelected
            });
            this.addOrRemoveLinkAnnotation();
        }
    };
    Object.defineProperty(Node.prototype, "isLinkableItem", {
        /* return true if the item is link and clickable */
        get: function () {
            return this.props.node.itemType === enums.TreeViewItemType.marksScheme
                || this.props.isChildrenSkipped;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * add or remove link annotation based on the component state
     */
    Node.prototype.addOrRemoveLinkAnnotation = function () {
        if (!this.state.isSelected) {
            var annotationData = pageLinkHelper.getLinkAnnotationData(this.props.node, this.props.childNodes, this.props.isChildrenSkipped, this.props.currentPageNumber);
            this.props.addLinkAnnotation(this.props.node, this.props.childNodes, this.props.isChildrenSkipped, annotationData);
        }
        else {
            this.props.removeLinkAnnotation(this.props.node, this.props.childNodes, this.props.isChildrenSkipped);
        }
    };
    return Node;
}(pureRenderComponent));
module.exports = Node;
//# sourceMappingURL=node.js.map