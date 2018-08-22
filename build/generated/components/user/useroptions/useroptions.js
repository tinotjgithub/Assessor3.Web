"use strict";
/* tslint:disable:no-unused-variable */
var React = require('react');
var LanguageSelector = require('../../utility/locale/languageselector');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var LogoutConfirmationDialog = require('../../logout/logoutconfirmationdialog');
/**
 * Represents the user option
 */
var useroption = function (props) {
    return (React.createElement("div", {className: 'edit-settings-holder', "aria-hidden": 'true'}, React.createElement("div", {className: 'tab-holder horizontal'}, React.createElement("div", {className: 'tab-content-holder'}, React.createElement("div", {id: 'settingsTab1', role: 'tabpanel', "aria-hidden": 'false', className: classNames('tab-content text-left active')}, React.createElement("div", {className: 'language-settings form-field inline'}, React.createElement("label", {className: 'label', htmlFor: 'langSelected'}, localeStore.instance.TranslateText('generic.user-menu.user-options.language')), React.createElement(LanguageSelector, {availableLanguages: languageList, selectedLanguage: props.selectedLanguage, isBeforeLogin: false})), React.createElement(LogoutConfirmationDialog, {selectedLanguage: props.selectedLanguage, isUserOptionLoaded: props.isUserOptionLoaded}))))));
};
module.exports = useroption;
//# sourceMappingURL=useroptions.js.map