/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import TreeNode = require('./treenode');
import treeViewItem = require('../../../stores/markschemestructure/typings/treeviewitem');
import Immutable = require('immutable');

/**
 * Properties of TreeView component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    treeNodes: treeViewItem;
    offset: string;
    navigateToMarkScheme: Function;
    onMarkSchemeSelected: Function;
    reload: number;
    isNonNumeric: boolean;
    isWholeResponse: boolean;
    selectedMarkSchemeGroupId?: number;
    visibleTreeNodeCount?: number;
    isResponseEditable: boolean;
    linkedItems: Immutable.List<number>;
}

/* tslint:disable:variable-name  */
/**
 * Represents the TreeView Compoent
 */
const TreeView: React.StatelessComponent<Props> = (props: Props) => {

    /**
     * Get the transform style.
     * @returns Style
     */
    const getStyle = () : React.CSSProperties => {

        let style = { transform: 'translateY(' + props.offset + 'px)' };
        return style;
    };

    let counter: number = 0;
    let _treeNodes = props.treeNodes;
    let nodes = props.treeNodes.treeViewItemList.map(function (nodeItem: treeViewItem) {
        counter++;
        return <TreeNode node={nodeItem} children={nodeItem.treeViewItemList} id={'tree' + counter.toString()}
            key={'tree' + counter.toString()} navigateToMarkScheme={props.navigateToMarkScheme}
            onMarkSchemeSelected={props.onMarkSchemeSelected} reload={props.reload}
            selectedLanguage={props.selectedLanguage} previousMarks={nodeItem.previousMarks}
            isNonNumeric={props.isNonNumeric} isWholeResponse={props.isWholeResponse}
            isOpen={props.selectedMarkSchemeGroupId === nodeItem.markSchemeGroupId}
            visibleTreeNodeCount={props.visibleTreeNodeCount}
            isResponseEditable={props.isResponseEditable}
            linkedItems={props.linkedItems}  />;
    });

    return (
        <div className ='question-group-align-holder'>
            <ul id='question-group-container' className='question-group-container' style={ getStyle() }>
                { nodes }
            </ul>
        </div>
    );
};
/* tslint:enable:variable-name */

export = TreeView;
