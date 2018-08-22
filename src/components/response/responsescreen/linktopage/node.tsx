/* tslint:disable:no-unused-variable */
import React = require('react');
import Immutable = require('immutable');
import pureRenderComponent = require('../../../base/purerendercomponent');
import treeViewItem = require('../../../../stores/markschemestructure/typings/treeviewitem');
import enums = require('../../../utility/enums');
import pageLinkHelper = require('./pagelinkhelper');
import annotation = require('../../../../stores/response/typings/annotation');
import LinkIcon = require('./linkicon');

/**
 * Properties of the component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    node: treeViewItem;
    isChildrenSkipped?: boolean;
    renderedOn: number;
    childNodes?: Immutable.List<treeViewItem>;
    currentPageNumber: number;
    addLinkAnnotation: Function;
    removeLinkAnnotation: Function;
}

/**
 * States of the component
 */
interface State {
    isSelected: boolean;
}

class Node extends pureRenderComponent<Props, any> {

    private _annotations: Immutable.List<annotation>;

    /**
     * @constructor
     */
    constructor(props: any, state: any) {
        super(props, state);

        this.state = {
            isSelected: pageLinkHelper.isLinked(this.props.node, this.props.currentPageNumber,
                this.props.isChildrenSkipped, this.props.childNodes)
        };

        this.onClick = this.onClick.bind(this);
        this._annotations = Immutable.List<annotation>();
    }

    /**
     * Component will receive props
     */
    public componentWillReceiveProps(nxtProps: Props) {
        this.setState({
            isSelected: pageLinkHelper.isLinked(this.props.node, nxtProps.currentPageNumber,
                this.props.isChildrenSkipped, this.props.childNodes)
        });
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        return (
            <a href='javascript:void(0)' className={this.getClassName} tabIndex={-1} onClick={this.onClick}>
                <span className={'question-text'} id={this.props.id}>
                    {this.props.node.name}
                </span>
                {this.getLinkIcon}
            </a>
        );
    }

    /* return the classname for the node */
    private get getClassName(): string {
        if (this.state.isSelected && (this.props.node.itemType === enums.TreeViewItemType.marksScheme
            || this.props.node.itemType === enums.TreeViewItemType.answerItem)) {
            return 'question-item selected-question';
        }

        return 'question-item';
    }

    /*returns the link item for the node */
    private get getLinkIcon() {
        if (this.isLinkableItem) {
            return <LinkIcon id={'link_icon_' +
                this.props.node.bIndex.toString()} />;
        }

        return null;
    }

    /**
     * click event for node
     */
    private onClick() {
        if (this.isLinkableItem) {
            this.setState({
                isSelected: !this.state.isSelected
            });

            this.addOrRemoveLinkAnnotation();
        }
    }

    /* return true if the item is link and clickable */
    private get isLinkableItem(): boolean {
        return this.props.node.itemType === enums.TreeViewItemType.marksScheme
            || this.props.isChildrenSkipped;
    }

    /**
     * add or remove link annotation based on the component state
     */
    private addOrRemoveLinkAnnotation(): void {
        if (!this.state.isSelected) {
            let annotationData = pageLinkHelper.getLinkAnnotationData(this.props.node, this.props.childNodes,
                this.props.isChildrenSkipped, this.props.currentPageNumber);
            this.props.addLinkAnnotation(this.props.node, this.props.childNodes,
                this.props.isChildrenSkipped, annotationData);
        } else {
            this.props.removeLinkAnnotation(this.props.node, this.props.childNodes,
                this.props.isChildrenSkipped);
        }
    }
}

export = Node;
