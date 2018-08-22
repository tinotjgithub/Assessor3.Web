/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import treeViewItem = require('../../../../stores/markschemestructure/typings/treeviewitem');
import Node = require('./node');
import enums = require('../../../utility/enums');

/**
 * Properties of the component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    node: treeViewItem;
    children: any;
    renderedOn: number;
    currentPageNumber: number;
    addLinkAnnotation: Function;
    removeLinkAnnotation: Function;
}

/**
 * React component class for Link to question tree node.
 */
class LinkToPageTreeNode extends pureRenderComponent<Props, any> {

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * renders the component
     */
    public render() {
        let counter: number = 0;
        let nodes: Immutable.List<JSX.Element>;
        let nodeElement: JSX.Element;
        let nodeUlElement: JSX.Element;
        let classname: string = 'question-list marked-question';
        var areAllChildNodesSkipped: boolean = true;
        let id = this.props.node.bIndex.toString();
        nodeElement = this.props.node.isVisible ? this.getNodeElement(
            this.props.node,
            this.props.id + '-' + id,
            'key_' + this.props.id + counter.toString(), this.props.currentPageNumber) : null;
        if (this.props.children) {
            let that = this;
            // remove childer with same imageclusterid of that of parent
            let imageClusterId = this.props.node.imageClusterId;
            let childNodesToRemove: Immutable.List<treeViewItem> =
                this.props.children.filter(item => item.imageClusterId === imageClusterId
                    && item.itemType === enums.TreeViewItemType.marksScheme);

            nodes = this.props.children.map(function (node: treeViewItem) {
                counter++;
                if ((childNodesToRemove.count() > 1 && childNodesToRemove.contains(node)) ||
                    ((that.props.node.itemType === enums.TreeViewItemType.cluster ||
                        that.props.node.itemType === enums.TreeViewItemType.QIG) &&
                        node.itemType === enums.TreeViewItemType.marksScheme)) {
                    return null;
                }
                areAllChildNodesSkipped = false;
                return (<LinkToPageTreeNode node={node} children={node.treeViewItemList}
                    id= {'item' + counter.toString() } key = {'item' + counter.toString() }
                    selectedLanguage={that.props.selectedLanguage} renderedOn={Date.now() }
                    currentPageNumber={that.props.currentPageNumber} addLinkAnnotation={that.props.addLinkAnnotation}
                    removeLinkAnnotation={that.props.removeLinkAnnotation}/>);
            });

            if (areAllChildNodesSkipped) {
                // render the node to show the link icon which are not markscheme item
                nodeElement = this.props.node.isVisible ? this.getNodeElement(
                    this.props.node,
                    this.props.id + '-' + id,
                    'key_' + this.props.id + counter.toString(),
                    this.props.currentPageNumber, this.props.children, true) : null;
            }

            /** if the current nodes has visible childrens setting the class name and the inner ul element */
            let _hasChild = (this.props.node.treeViewItemList.count() > 0) ? true : false;
            if (_hasChild) {
                classname = (this.props.node.itemType === enums.TreeViewItemType.QIG) ? 'question-list expandable has-sub' :
                    areAllChildNodesSkipped ? 'question-list' : 'question-list has-sub open';
                nodeUlElement = <ul id={'question-group-' + id} className='question-group'>{nodes}</ul>;
                /**
                 * if nodeelement is null no need to display an ul and li.
                 * instead directly display the first child elements
                 */
                if (nodeElement == null) {
                    nodeElement = nodes.first();
                } else {
                    nodeElement = (<li id={'question-list-' + id } className={classname}>
                        {nodeElement}
                        {nodeUlElement}
                    </li>);
                }
            } else {
                nodeElement = null;
            }
        } else {
            if (this.props.node.isVisible) {
                nodeElement = <li id={'question-list-' + id } className='question-list'>
                    {nodeElement}
                </li>;
            } else {
                nodeElement = null;
            }
        }
        return nodeElement;
    }

    /**
     * return the node element
     * @param item
     * @param elementId
     * @param elementKey
     */
    public getNodeElement(item: treeViewItem,
        elementId: string,
        elementKey: string,
        currentPageNumber: number,
        childNodes: Immutable.List<treeViewItem> = null,
        isChildrenSkipped: boolean = false): JSX.Element {

        let nodeElement: JSX.Element = null;
        let addLinkAnnotation = this.props.addLinkAnnotation;
        let removeLinkAnnotation = this.props.removeLinkAnnotation;
        let componentProps: any;

        componentProps = {
            key: elementKey,
            id: elementId,
            node: item,
            isChildrenSkipped,
            renderedOn: Date.now(),
            childNodes,
            currentPageNumber,
            addLinkAnnotation,
            removeLinkAnnotation
        };

        return React.createElement(Node, componentProps);
    }
}

export = LinkToPageTreeNode;