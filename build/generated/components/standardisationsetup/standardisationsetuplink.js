"use strict";
var React = require('react');
var localeStore = require('../../stores/locale/localestore');
var classNames = require('classnames');
/**
 * React stateless component for standardisation Setup Link on qig selector
 */
var standardisationSetupLink = function (props) {
    var linkName = localeStore.instance.TranslateText('home.qig-data.browse-standardisation-scripts');
    var idName = 'browse-script-link';
    if (props.stdSetupPermission.editDefinitives) {
        linkName = localeStore.instance.TranslateText('home.qig-data.manage-definitive-mark-link');
        idName = 'manage-mark-link';
    }
    else if (props.stdSetupPermission.viewDefinitives) {
        linkName = localeStore.instance.TranslateText('home.qig-data.view-definitive-mark-link');
        idName = 'view-mark-link';
    }
    return (React.createElement("div", null, React.createElement("a", {className: 'manage-mark-link', id: idName, title: linkName, onClick: function () { return props.onStandardisationLinkClick(); }, href: 'javascript:void(0)'}, linkName)));
};
module.exports = standardisationSetupLink;
//# sourceMappingURL=standardisationsetuplink.js.map