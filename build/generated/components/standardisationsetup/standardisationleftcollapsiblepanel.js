"use strict";
var React = require('react');
var enums = require('../utility/enums');
var localeStore = require('../../stores/locale/localestore');
var GenericButton = require('../utility/genericbutton');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var qigStore = require('../../stores/qigselector/qigstore');
var standardisationLeftCollapsiblePanel = function (props) {
    /* tslint:disable:variable-name */
    /**
     * Get the Side Panel Element
     * @param props
     */
    var PanelItem = function (props) {
        return (React.createElement("li", {id: getPanelClassName(props.standardisationSetupWorkList) + '_id', key: 'collapsiblepanel-key' + props.standardisationSetupWorkList, title: getTextToDisplay(props.standardisationSetupWorkList), className: 'panel ' + getPanelClassName(props.standardisationSetupWorkList) +
            ' hand ' + props.openOrClose, onClick: function () { props.onLinkClick(props.standardisationSetupWorkList); }}, React.createElement("span", {className: props.panelItemclassName}, props.targetCount), React.createElement("a", {href: 'javascript:void(0);', className: 'left-menu-link panel-link', id: getPanelId(props.standardisationSetupWorkList)}, React.createElement("span", {className: 'menu-text large-text'}, getTextToDisplay(props.standardisationSetupWorkList)))));
    };
    /**
     * Get the Panel Holder with panels
     * @param props
     */
    var PanelItemHolder = function (props) {
        var items;
        if (props.availableStandardisationSetupLinks !== undefined && props.availableStandardisationSetupLinks !== null) {
            items = props.availableStandardisationSetupLinks.map(function (x) {
                if (x.isVisible) {
                    return React.createElement(PanelItem, {key: 'panel-key' + x.linkName, renderedOn: props.renderedON, standardisationSetupWorkList: x.linkName, targetCount: x.targetCount, onLinkClick: props.onLinkClick, openOrClose: x.isSelected ? 'open active' : 'close', panelItemclassName: x.linkName === enums.StandardisationSetup.SelectResponse ?
                        'sprite-icon tick-circle-icon' : 'menu-count'});
                }
            });
        }
        else {
            items = null;
        }
        return React.createElement("ul", {className: 'left-menu panel-group'}, items);
    };
    var classificationSummaryProgressIcon;
    var ClassificationSummaryPanelItem = function (props) {
        var restrictedTargets = standardisationSetupStore.instance.restrictSSUTargetsCCData;
        var isExceeding = false;
        if (restrictedTargets && restrictedTargets.contains(props.markingModeId)
            && props.totalClassifiedCount > props.totalTargetCount) {
            classificationSummaryProgressIcon = (React.createElement("span", {id: 'summaryProgressIcon-' + props.itemId, className: 'sprite-icon tick-circle-waring-icon classification-progress-indicator'}));
        }
        else if (!props.isTargetMet) {
            classificationSummaryProgressIcon = (React.createElement("span", {className: 'menu-count'}, React.createElement("span", {id: 'summaryProgressIcon-' + props.itemId, className: 'sprite-icon classification-progress-indicator dot-dot-dot-icon'})));
        }
        else {
            classificationSummaryProgressIcon = (React.createElement("span", {id: 'summaryProgressIcon-' + props.itemId, className: 'sprite-icon tick-circle-icon classification-progress-indicator'}));
        }
        var count = props.totalClassifiedCount + '/' + props.totalTargetCount;
        return (React.createElement("li", {id: 'summaryItem-' + props.itemId, key: 'summaryItem-' + props.itemId, className: 'std-progress-item'}, classificationSummaryProgressIcon, React.createElement("span", {id: 'summaryText-' + props.itemId, className: 'classification-text'}, props.markingModeName), React.createElement("span", {id: 'summaryCount-' + props.itemId, className: 'classification-progress'}, count)));
    };
    /**
     * Get the Classification Summary Panel for displaying classification progress
     * @param props
     */
    var ClassificationSummaryPanel = function (props) {
        var items;
        if (props.standardisationTargetDetails !== undefined && props.standardisationTargetDetails !== null) {
            items = props.standardisationTargetDetails.map(function (x, key) {
                return (React.createElement(ClassificationSummaryPanelItem, {id: 'summaryPanel-' + getClassificationSummaryPanelId(x.markingModeId), key: 'summaryPanel-' + getClassificationSummaryPanelId(x.markingModeId), renderedOn: props.renderedON, isTargetMet: x.target <= x.count ? true : false, markingModeId: x.markingModeId, markingModeName: getMarkingModeName(x.markingModeId), totalClassifiedCount: x.count, totalTargetCount: x.target, itemId: getClassificationSummaryPanelId(x.markingModeId)}));
            });
        }
        else {
            items = null;
        }
        return React.createElement("ul", {className: 'bottom-menu-group'}, items);
    };
    /**
     * Get the class for individual links
     * @param standardisationSetUpLink
     */
    function getPanelClassName(standardisationSetUpLink) {
        var className = '';
        switch (standardisationSetUpLink) {
            case enums.StandardisationSetup.SelectResponse:
                className = 'panel select-response';
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                className = 'panel provisional';
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                className = 'panel unclassified';
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                className = 'panel classified';
                break;
        }
        return className;
    }
    /**
     * Get the class for individual links
     * @param standardisationSetUpLink
     */
    function getPanelId(standardisationSetUpLink) {
        var idString = '';
        switch (standardisationSetUpLink) {
            case enums.StandardisationSetup.SelectResponse:
                idString = 'select-response-panel';
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                idString = 'provisional-response-panel';
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                idString = 'unclassify-response-panel';
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                idString = 'classified-response-panel';
                break;
        }
        return idString;
    }
    /**
     * get Classification Summary item Id
     * @param markingModeId
     */
    function getClassificationSummaryPanelId(markingModeId) {
        var idString = '';
        switch (markingModeId) {
            case 2:
                idString = 'practice';
                break;
            case 3:
                idString = 'approval';
                break;
            case 4:
                idString = 'esTeamApproval';
                break;
            case 70:
                idString = 'seeding';
                break;
        }
        return idString;
    }
    /**
     * Get the marking mode name from marking mode id
     * @param markingModeId
     */
    function getMarkingModeName(markingModeId) {
        return localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.classification-type.' +
            enums.MarkingMode[markingModeId]);
    }
    /**
     * get the Display Text
     * @param standardisationSetUpLink
     */
    function getTextToDisplay(standardisationSetUpLink) {
        var idString = '';
        switch (standardisationSetUpLink) {
            case enums.StandardisationSetup.SelectResponse:
                idString = 'select-response-worklist';
                break;
            case enums.StandardisationSetup.ProvisionalResponse:
                idString = 'provisional-worklist';
                break;
            case enums.StandardisationSetup.UnClassifiedResponse:
                idString = 'unclassified-worklist';
                break;
            case enums.StandardisationSetup.ClassifiedResponse:
                idString = 'classified-worklist';
                break;
        }
        return localeStore.instance.TranslateText('standardisation-setup.left-panel.' + idString);
    }
    /**
     * The complete setup button component.
     * @param props
     */
    var CompleteSetupButton = function (props, propsparent) {
        return (props.isVisible ?
            React.createElement("div", {className: 'text-center classification-button-holder'}, (!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) ? React.createElement(GenericButton, {id: 'completeSetupButton', key: 'key_completeSetupButton', className: 'rounded classification-complete-button lite', content: localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-setup-button-text'), onClick: props.onClick, disabled: props.isDisabled, title: props.toolTip}) :
                React.createElement("span", {id: 'setupcompletesuccess', className: 'setup-btn-label success'}, localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-standardisation-setup-text'))) : null);
    };
    /**
     * Get the panel.
     */
    return (React.createElement("div", {className: 'column-left'}, React.createElement("div", {className: 'column-left-inner'}, React.createElement("div", {className: 'left-menu-holder'}, React.createElement(PanelItemHolder, {id: 'panel-items', key: 'panel-items-key', renderedON: props.renderedON, availableStandardisationSetupLinks: props.availableStandardisationSetupLinks, onLinkClick: props.onLinkClick})), React.createElement("div", {className: 'left-menu-holder bottom-menu-holder std-progress-holder'}, React.createElement(ClassificationSummaryPanel, {id: 'classification-summary-panel', key: 'classification-summary-panel-key', renderedON: props.renderedON, standardisationTargetDetails: props.standardisationTargetDetails}), React.createElement(CompleteSetupButton, {isDisabled: props.isCompleteButtonDisabled, onClick: props.onCompleteButtonClick, toolTip: props.completeButtonToolTip, isVisible: props.hasCompletePermission})))));
};
module.exports = standardisationLeftCollapsiblePanel;
//# sourceMappingURL=standardisationleftcollapsiblepanel.js.map