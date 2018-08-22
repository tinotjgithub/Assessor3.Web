/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import MarkScheme = require('../../markschemestructure/markscheme');
import Cluster = require('../../markschemestructure/cluster');
import AnswerItem = require('../../markschemestructure/answeritem');
import enums = require('../../utility/enums');
import treeViewHelper = require('../../../utility/treeviewhelpers/treeviewhelper');
import Immutable = require('immutable');
import markingStore = require('../../../stores/marking/markingstore');
import constants = require('../constants');

/**
 * Properties of TreeNode component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    children: any;
    node: treeViewItem;
    navigateToMarkScheme: Function;
    onMarkSchemeSelected: Function;
    reload: number;
    previousMarks?: Array<PreviousMark>;
    isNonNumeric: boolean;
    isWholeResponse: boolean;
    isOpen: boolean;
    visibleTreeNodeCount?: number;
    isResponseEditable: boolean;
    linkedItems: Immutable.List<number>;
}
/* tslint:disable:variable-name  */
const TreeNode : React.StatelessComponent<Props> = (props: Props) => {

    // Selected markscheme style
    const SELECTED_NODE: string = 'question-list current';

    // normal markscheme style
    const NORMAL_MARK: string = 'question-list';
    /**
     * Setting markascheme style
     * @returns
     */
    const isNodeSelected = (): string => {
        if (props.node.isSelected) {
            return SELECTED_NODE;
        }
        // Normal mark
        return NORMAL_MARK;
    };

    let counter: number = 0;
    let nodes: Immutable.List<JSX.Element>;
    let nodeElement: JSX.Element;
    let nodeUlElement: JSX.Element;
    let classname: string = 'question-list marked-question';

    /** 
     * generating the nodelement using helper
     */
    nodeElement = props.node.isVisible ? treeViewHelper.getNodeElement(
        props.node,
        props.id + counter.toString(),
        'key_' + props.id + counter.toString(),
        props.navigateToMarkScheme,
        props.onMarkSchemeSelected,
        props.reload,
        props.previousMarks,
        props.isNonNumeric,
        props.isWholeResponse,
        props.isOpen,
        props.linkedItems) : null;

    if (props.children) {
        nodes = props.children.map(function (nodeItem: any) {
            counter++;
            return <TreeNode node={nodeItem} children={nodeItem.treeViewItemList}
                id={'item' + counter.toString()} key={'item' + counter.toString()} navigateToMarkScheme={props.navigateToMarkScheme}
                onMarkSchemeSelected={props.onMarkSchemeSelected} reload={props.reload}
                selectedLanguage={props.selectedLanguage} previousMarks={nodeItem.previousMarks}
                isNonNumeric={props.isNonNumeric} isWholeResponse={props.isWholeResponse}
                isOpen={props.isOpen}
                isResponseEditable={props.isResponseEditable}
                linkedItems={props.linkedItems} />;
        });

        /** if the current nodes has visible childrens setting the class name and the inner ul element */
        let _hasChild = props.node.treeViewItemList.count() > 0;

        if (_hasChild) {

            classname = 'question-list has-sub';

            if (props.node.itemType === enums.TreeViewItemType.questionPaper) {
                classname += (props.isOpen ? ' open freeze' : ' close');
            } else {
                classname += (props.isWholeResponse && props.node.itemType === enums.TreeViewItemType.QIG) ?
                    (props.isOpen ? ' open freeze qig-list' : ' close qig-list') : ' open';
            }

            classname += (props.node.itemType === enums.TreeViewItemType.QIG
                || props.node.itemType === enums.TreeViewItemType.questionPaper ? ' expandable' : '');

            let cssStyle: React.CSSProperties = null;

            if (((props.isWholeResponse
                && props.node.itemType === enums.TreeViewItemType.QIG)
                || props.node.itemType === enums.TreeViewItemType.questionPaper)
                && props.isOpen && props.visibleTreeNodeCount) {

                let activeQuestionPanel: number = (props.isResponseEditable) ?
                    constants.ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_OPEN_RESPONSE :
                    constants.ACTIVE_QUESTION_ITEM_PANEL_HEIGHT_FOR_CLOSED_RESPONSE;
                cssStyle = {
                    maxHeight: ((props.visibleTreeNodeCount - 1) * constants.MARK_SCHEME_HEIGHT +
                        activeQuestionPanel).toString() + 'px'
                };
            }

            nodeUlElement = <ul className='question-group' style={cssStyle}>{nodes}</ul>;

            /**
             * if nodeelement is null no need to display an ul and li.
             * instead directly display the first child elements
             */
            if (nodeElement == null) {
                nodeElement = nodes.first();
            } else {
                nodeElement = (<li className={classname}>
                    {nodeElement}
                    {nodeUlElement}
                </li>);
            }
        } else {
            nodeElement = null;
        }
    } else {
        if (props.node.isVisible) {
            nodeElement = <li className={isNodeSelected() }>
                {nodeElement}
            </li>;
        } else {
            nodeElement = null;
        }
    }
    return nodeElement;
};
/* tslint:enable:variable-name  */
export = TreeNode;
