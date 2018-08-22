"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
/**
 * Returns menu link
 * @param props
 */
var menuLink = function (props) {
    if (props.isRecentHistory) {
        var teamManagementLink = props.recentItem.team ? (React.createElement("a", {href: 'javascript:void(0)', className: 'small-text', onClick: function () { props.onTeamManagementClick(props.recentItem, null, null, null); }, id: 'menuLink_TeamManagement_' + props.recentItem.qigId}, localeStore.instance.TranslateText('generic.navigation-menu.team-management'))) : props.recentItem.isTeamManagementEnabled ? (React.createElement("a", {href: 'javascript:void(0)', className: 'small-text', onClick: function () {
            props.onTeamManagementClick(null, props.recentItem.qigId, props.recentItem.questionPaperPartId, props.recentItem.examinerRoleId);
        }, id: 'menuLink_TeamManagement_' + props.recentItem.qigId}, localeStore.instance.TranslateText('generic.navigation-menu.team-management'))) : null;
        var myMarkingLink = props.recentItem.myMarking ? (React.createElement("a", {href: 'javascript:void(0)', className: 'small-text', onClick: function () { props.onMyMarkingClick(props.recentItem, null, null); }, id: 'menuLink_' + props.recentItem.qigId}, localeStore.instance.TranslateText('generic.navigation-menu.my-marking'))) : props.recentItem.isMarkingEnabled ? (React.createElement("a", {href: 'javascript:void(0)', className: 'small-text', onClick: function () {
            props.onMyMarkingClick(null, props.recentItem.qigId, props.recentItem.questionPaperPartId);
        }, id: 'menuLink_' + props.recentItem.qigId}, localeStore.instance.TranslateText('generic.navigation-menu.my-marking'))) : null;
        return (React.createElement("li", {className: 'menu-items', id: 'menuItem_' + props.recentItem.qigId}, React.createElement("div", {className: 'recent-links-quig'}, props.menuString), React.createElement("div", {className: 'recent-links'}, myMarkingLink, teamManagementLink)));
    }
    else if (props.isVisible) {
        return (React.createElement("li", {className: 'menu-items'}, React.createElement("a", {id: props.id, key: props.id, href: 'javascript:void(0)', onClick: function () { props.onMenuLinkClick(); }}, props.menuLinkName)));
    }
    else {
        return null;
    }
};
module.exports = menuLink;
//# sourceMappingURL=menulink.js.map