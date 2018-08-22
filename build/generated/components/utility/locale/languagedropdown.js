/// <reference path='../../../App/references.d.ts' />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeActionCreator = require('../../../actions/locale/localeactioncreator');
var localeStore = require('../../../stores/locale/localestore');
/**
 * Represents the available languages
 */
var LanguageDropdown = (function (_super) {
    __extends(LanguageDropdown, _super);
    /**
     * @constructor
     */
    function LanguageDropdown(props) {
        _super.call(this, props);
        this.handleClick = this.handleClick.bind(this);
    }
    /**
     * Called upon clicking one of the available languages in the dropdown
     * @param {string} source - The source element
     */
    LanguageDropdown.prototype.handleClick = function (source) {
        var awardingBody = '';
        var selectedLanguage = source.target.textContent;
        if (this.props.availableLanguages !== undefined) {
            awardingBody = this.props.availableLanguages.languages['awarding-body'];
        }
        /**
         * Check if the language is already selected
         */
        if (this.props.selectedLocaleName !== selectedLanguage) {
            localeActionCreator.localeChange(this.getLocaleCodeFromName(selectedLanguage), awardingBody);
        }
        else {
            /* Call back to selected language component to collapse dropdoen if same language is selected */
            this.props.onSelected();
        }
    };
    /**
     * Get the locale code when the locale name is provided.
     * @param {string} localeName - The locale name
     * @return {string } The locale code
     */
    LanguageDropdown.prototype.getLocaleCodeFromName = function (localeName) {
        var selectedLocaleCode = '';
        if (this.props.availableLanguages !== undefined) {
            /* Return locale code(Eg: en) when locale name(English) is provided */
            this.props.availableLanguages.languages.language.map(function (lang) {
                if (localeName === lang.name) {
                    selectedLocaleCode = lang.code;
                }
            });
        }
        return selectedLocaleCode;
    };
    /**
     * Render method
     */
    LanguageDropdown.prototype.render = function () {
        var languages = undefined;
        if (this.props.availableLanguages !== undefined) {
            /* iterating each language to display */
            languages = this.props.availableLanguages.languages.language.map(function (language) {
                return (React.createElement("li", {role: 'menuitem', key: language.code}, React.createElement("a", {href: 'javascript:void(0)'}, language.name)));
            });
        }
        return (React.createElement("ul", {className: 'menu', role: 'menu', title: localeStore.instance.TranslateText('login.login-page.language-selector-dropdown-tooltip'), "aria-hidden": 'true', onClick: this.handleClick}, languages));
    };
    return LanguageDropdown;
}(pureRenderComponent));
module.exports = LanguageDropdown;
//# sourceMappingURL=languagedropdown.js.map