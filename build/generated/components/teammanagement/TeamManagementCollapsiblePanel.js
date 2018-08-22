"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var enums = require('../utility/enums');
/**
 * Team Management Collapsible panel which contains the details of the links.
 * When Help Examiners link come the visibility can be checked though the available team links array
 * @param props
 */
var teamManagementCollapsiblePanel = function (props) {
    /* tslint:disable:variable-name */
    /**
     * The stateless compoenent for the sublink to show the count
     * @param props
     */
    var SubLink = function (props) {
        var items = props.sublinks.map(function (x) {
            return (React.createElement("li", {key: 'subitem-key' + x.linkName}, React.createElement("span", {className: 'sub-panel-link'}, React.createElement("span", {className: 'menu-text small-text', id: 'sub_link_' + enums.TeamSubLink[x.linkName]}, getSubLinkText(x.Count, x.linkName)))));
        });
        if (items.length > 0) {
            return (React.createElement("ul", {className: 'sub-panel  panel-content'}, items, " "));
        }
        else {
            return null;
        }
    };
    /**
     * Get the Side Panel Element
     * @param props
     */
    var Panel = function (props) {
        return (React.createElement("li", {id: getPanelClassName(props.teamManagementTab) + '_id', key: 'collapsiblepanel-key' + props.teamManagementTab, className: 'panel ' + getPanelClassName(props.teamManagementTab) +
            ' hand ' + getOpenCloseState(props.teamManagementTab), onClick: function () { props.onLinkClick(props.teamManagementTab); }}, React.createElement("a", {href: 'javascript:void(0);', className: 'left-menu-link panel-link', id: getPanelId(props.teamManagementTab)}, React.createElement("span", {className: 'menu-text large-text'}, getTextToDisplay(props.teamManagementTab))), React.createElement(SubLink, {key: 'sublink-key' + props.teamManagementTab, renderedOn: props.renderedOn, teamManamentTabItem: props.teamManagementTab, sublinks: props.sublinks})));
    };
    /**
     * Get the Panel Holder with panels
     * @param props
     */
    var PanelItems = function (props) {
        var items;
        if (props.availableTeamLinks !== undefined && props.availableTeamLinks !== null) {
            items = props.availableTeamLinks.map(function (x) {
                if (x.isVisible) {
                    return React.createElement(Panel, {key: 'panel-key' + x.linkName, renderedOn: props.renderedOn, teamManagementTab: x.linkName, onLinkClick: props.onLinkClick, sublinks: x.subLinks});
                }
            });
        }
        else {
            items = null;
        }
        return React.createElement("ul", {className: 'left-menu panel-group'}, " ", items, " ");
    };
    /**
     * Get the panel.
     */
    return (React.createElement("div", {className: 'column-left'}, React.createElement("div", {className: 'column-left-inner'}, React.createElement("div", {className: 'left-menu-holder'}, React.createElement(PanelItems, {id: 'panel-items', key: 'panel-items-key', renderedOn: props.renderedOn, onLinkClick: props.onLinkClick, availableTeamLinks: props.availableTeamLinks})))));
    /**
     * Get the open close state for individual links
     * @param teamLinkType
     */
    function getOpenCloseState(teamLinkType) {
        return props.availableTeamLinks.filter(function (x) { return x.linkName === teamLinkType; })[0].isSelected ? 'open' : 'close';
    }
    /**
     * Get the class for individual links
     * @param teamLinkType
     */
    function getPanelClassName(teamLinkType) {
        var className = '';
        switch (teamLinkType) {
            case enums.TeamManagement.MyTeam:
                className = 'my-team-panel';
                break;
            case enums.TeamManagement.HelpExaminers:
                className = 'help-examiners-panel';
                break;
            case enums.TeamManagement.Exceptions:
                className = 'team-exception-panel';
                break;
        }
        return className;
    }
    /**
     * Get the text to be displayed for the sublinks
     * @param {number} sublinkcount
     * @param {enums.TeamSubLink} sublinkType
     * @returns
     */
    function getSubLinkText(sublinkcount, sublinkType) {
        var text = '';
        switch (sublinkType) {
            // If only 1 exception then sub-heading shall be displayed as
            //‘1 open exception’ and if 0 exceptions then ‘0 open exceptions
            case enums.TeamSubLink.Exceptions:
                text = sublinkcount + ' ' + localeStore.instance.TranslateText(sublinkcount === 1 ?
                    'team-management.left-panel.sublink-' + enums.TeamSubLink[sublinkType] :
                    'team-management.left-panel.sublink-multi-' + enums.TeamSubLink[sublinkType]);
                break;
            case enums.TeamSubLink.HelpExaminersLocked:
                text = sublinkcount + ' ' + localeStore.instance.TranslateText('team-management.left-panel.sublink-' + enums.TeamSubLink[sublinkType]);
                break;
            case enums.TeamSubLink.Stuck:
                text = sublinkcount + ' ' + localeStore.instance.TranslateText('team-management.left-panel.sublink-' + enums.TeamSubLink[sublinkType]);
                break;
            default:
                text = sublinkcount + ' ' + enums.TeamSubLink[sublinkType];
                break;
        }
        return text;
    }
    /**
     * Get the class for individual links
     * @param teamLinkType
     */
    function getPanelId(teamLinkType) {
        var idString = '';
        switch (teamLinkType) {
            case enums.TeamManagement.MyTeam:
                idString = 'my-team-tab';
                break;
            case enums.TeamManagement.HelpExaminers:
                idString = 'help-examiners-tab';
                break;
            case enums.TeamManagement.Exceptions:
                idString = 'exception-tab';
                break;
        }
        return idString;
    }
    /**
     * get the Display Text
     * @param teamLinkType
     */
    function getTextToDisplay(teamLinkType) {
        var text = '';
        switch (teamLinkType) {
            case enums.TeamManagement.MyTeam:
                text = 'my-team';
                break;
            case enums.TeamManagement.HelpExaminers:
                text = 'help-examiners';
                break;
            case enums.TeamManagement.Exceptions:
                text = 'exceptions';
                break;
        }
        return localeStore.instance.TranslateText('team-management.left-panel.' + text);
    }
};
module.exports = teamManagementCollapsiblePanel;
//# sourceMappingURL=TeamManagementCollapsiblePanel.js.map