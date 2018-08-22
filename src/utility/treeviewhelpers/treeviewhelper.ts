import React = require('react');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import MarkScheme = require('../../components/markschemestructure/markscheme');
import Cluster = require('../../components/markschemestructure/cluster');
import AnswerItem = require('../../components/markschemestructure/answeritem');
import enums = require('../../components/utility/enums');
import localeStore = require('../../stores/locale/localestore');
import Immutable = require('immutable');

/**
 * helper class to create anode element of mark scheme structure tree view.
 */
class TreeViewHelper {

    /**
     * returns the corrsponding node element based on the mark scheme ite type.
     * @param {treeViewItem} item
     * @param {string} elementId
     * @param {string} elementKey
     * @param {Function} navigateToMarkScheme
     * @param {Function} onMarkSchemeSelected
     * @param {number} reload
     * @param {array} previousMarks
     * @returns JSX element (MarkScheme/Cluster/AnswerItem).
     */
    public static getNodeElement(item: treeViewItem,
        elementId: string,
        elementKey: string,
        navigateToMarkScheme: Function,
        onMarkSchemeSelected: Function,
        reload: number,
        previousMarks: Array<PreviousMark>,
        isNonNumeric: boolean,
        isWholeResponse: boolean,
        isOpen: boolean,
        linkedItems: Immutable.List<number>): JSX.Element {

        let nodeElement: JSX.Element = null;
        let componentProps: any;

        componentProps = {
            key: elementKey,
            id: elementId,
            node: item,
            selectedLanguage: localeStore.instance.Locale,
            navigateToMarkScheme: navigateToMarkScheme,
            onMarkSchemeSelected: onMarkSchemeSelected,
            reload: reload,
            isNonNumeric: isNonNumeric,
            isOpen: isOpen,
            linkedItems: linkedItems
        };

        switch (item.itemType) {
            case enums.TreeViewItemType.questionPaper:
                nodeElement = React.createElement(Cluster, componentProps);
                break;
            case enums.TreeViewItemType.QIG:
                if (isWholeResponse) {
                    nodeElement = React.createElement(Cluster, componentProps);
                }
                break;
            case enums.TreeViewItemType.marksScheme:
                nodeElement = React.createElement(MarkScheme, componentProps);
                break;
            case enums.TreeViewItemType.cluster:
                nodeElement = React.createElement(Cluster, componentProps);
                break;
            case enums.TreeViewItemType.answerItem:
                nodeElement = React.createElement(AnswerItem, componentProps);
                break;
        }

        return nodeElement;
    }
}

export = TreeViewHelper;