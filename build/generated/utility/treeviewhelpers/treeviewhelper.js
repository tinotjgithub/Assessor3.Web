"use strict";
var React = require('react');
var MarkScheme = require('../../components/markschemestructure/markscheme');
var Cluster = require('../../components/markschemestructure/cluster');
var AnswerItem = require('../../components/markschemestructure/answeritem');
var enums = require('../../components/utility/enums');
var localeStore = require('../../stores/locale/localestore');
/**
 * helper class to create anode element of mark scheme structure tree view.
 */
var TreeViewHelper = (function () {
    function TreeViewHelper() {
    }
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
    TreeViewHelper.getNodeElement = function (item, elementId, elementKey, navigateToMarkScheme, onMarkSchemeSelected, reload, previousMarks, isNonNumeric, isWholeResponse, isOpen, linkedItems) {
        var nodeElement = null;
        var componentProps;
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
            case enums.TreeViewItemType.marksScheme:
                nodeElement = React.createElement(MarkScheme, componentProps);
                break;
            case enums.TreeViewItemType.cluster:
                nodeElement = React.createElement(Cluster, componentProps);
                break;
            case enums.TreeViewItemType.QIG:
                if (isWholeResponse) {
                    nodeElement = React.createElement(Cluster, componentProps);
                }
                break;
            case enums.TreeViewItemType.answerItem:
                nodeElement = React.createElement(AnswerItem, componentProps);
                break;
        }
        return nodeElement;
    };
    return TreeViewHelper;
}());
module.exports = TreeViewHelper;
//# sourceMappingURL=treeviewhelper.js.map