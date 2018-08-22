/// <reference path='../../../App/references.d.ts' />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var LanguageDropdown = require('./languagedropdown');
var localeStore = require('../../../stores/locale/localestore');
var htmlUtilities = require('../../../utility/generic/htmlutilities');
var classNames = require('classnames');
var cookie = require('react-cookie');
var COOKIE_KEY = 'language';
/**
 * Represents the selected language in an available language dropdown
 */
var LanguageSelector = (function (_super) {
    __extends(LanguageSelector, _super);
    /**
     * @constructor
     */
    function LanguageSelector(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this.isSelectedItemClicked = false;
        this._boundHandleOnClick = null;
        /**
         * Open/Close language selection dropdown according to selection.
         */
        this.refreshState = function () {
            /** Get the locale code from local store and set selected language in dropdown */
            var selected = _this.getLocaleNameFromCode(localeStore.instance.Locale);
            selected ? _this.setState({ isOpen: false }) : _this.setState({ isOpen: true });
        };
        /**
         * Handle click events on the window and collapse language selection dropdown
         * @param {any} source - The source element
         */
        this.handleOnClick = function (source) {
            /**
             * if the language selection dropdown is getting selected then no need to collapse it
             *   since openCloseDropdown fires first isSelectedItemClicked will be set first
             */
            if (!_this.isSelectedItemClicked && _this.state.isOpen !== undefined) {
                /**
                 * not setting any css class since setting close CSS class will show unwanted animation
                 */
                _this.setState({ isOpen: undefined });
            }
            else {
                /**
                 * reseting the selected flag
                 */
                _this.isSelectedItemClicked = false;
            }
        };
        /**
         * languageChanged will notify the language has successfully changed
         */
        this.languageChanged = function () {
            var langStyle;
            var className = window.document.body.className;
            _this.props.availableLanguages.languages.language.filter(function (language) {
                if (className.indexOf(language.style) > -1) {
                    htmlUtilities.removeClassFromBody(' ' + language.style);
                }
            });
            _this.props.availableLanguages.languages.language.map(function (language) {
                if (localeStore.instance.Locale === language.code) {
                    langStyle = language.style;
                }
            });
            htmlUtilities.addClassToBody(langStyle);
            _this.writeCookie(COOKIE_KEY, localeStore.instance.Locale);
        };
        this.state = {
            isOpen: undefined
        };
        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.openCloseDropdown = this.openCloseDropdown.bind(this);
    }
    /**
     * Get the locale name when the locale code is provided.
     * @param {string} localeCode - The locale code
     * @return {string } The locale name
     */
    LanguageSelector.prototype.getLocaleNameFromCode = function (localeCode) {
        var selectedLocaleName = '';
        /** Return locale name(Eg: English) when locale code(Eg: en) is provided */
        this.props.availableLanguages.languages.language.map(function (language) {
            if (localeCode === language.code) {
                selectedLocaleName = language.name;
            }
        });
        return selectedLocaleName;
    };
    /**
     * Open/Close the language selection dropdown
     * @param {any} source - The source element
     */
    LanguageSelector.prototype.openCloseDropdown = function (source) {
        /** set if the language selection dropdown is clicked */
        this.isSelectedItemClicked = true;
        /** Toggle the open css class upon clicking the selected item. */
        this.state.isOpen ? this.setState({ isOpen: false }) : this.setState({ isOpen: true });
    };
    /**
     * writeCookie will write the current selected language to cookie
     */
    LanguageSelector.prototype.writeCookie = function (key, value) {
        var expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 1);
        var opt = {
            expires: expireDate
        };
        cookie.save(key, value, opt);
    };
    /**
     * Subscribe window click event
     */
    LanguageSelector.prototype.componentDidMount = function () {
        window.addEventListener('click', this._boundHandleOnClick);
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    };
    /**
     * Unsubscribe window click event
     */
    LanguageSelector.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._boundHandleOnClick);
        localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    };
    /**
     * Render method
     */
    LanguageSelector.prototype.render = function () {
        var selectedLanguage = '';
        /** Get selected locale name from code */
        selectedLanguage = this.getLocaleNameFromCode(this.props.selectedLanguage);
        var selectedLanguageStyle = '';
        var spriteIconStyle = '';
        if (this.props.isBeforeLogin) {
            selectedLanguageStyle = 'nav-text';
            spriteIconStyle = 'sprite-icon menu-arrow-icon lite';
        }
        else {
            selectedLanguageStyle = '';
            spriteIconStyle = 'sprite-icon menu-arrow-icon';
        }
        /* The element that shows the selected language */
        var selectedlocale = (React.createElement("a", {href: 'javascript:void(0)', title: localeStore.instance.TranslateText('login.login-page.language-selector-tooltip'), onClick: this.openCloseDropdown, className: 'menu-button'}, React.createElement("span", {className: selectedLanguageStyle}, selectedLanguage, " "), React.createElement("span", {className: spriteIconStyle})));
        /* The component that shows the available languages */
        var languageDropdown = (React.createElement(LanguageDropdown, {availableLanguages: this.props.availableLanguages, onSelected: this.refreshState, selectedLanguage: this.props.selectedLanguage, selectedLocaleName: selectedLanguage}));
        /* CSS class for Show/Close the language dropdown */
        var openClose = ({
            'open': this.state.isOpen,
            'close': this.state.isOpen === undefined ? this.state.isOpen : !this.state.isOpen
        });
        var beforeLoginSelector = React.createElement("li", {role: 'menuitem', "aria-haspopup": 'true', className: classNames('dropdown-wrap', openClose)}, selectedlocale, languageDropdown);
        var afterLoginSelector = React.createElement("div", {className: classNames('dropdown-wrap form-component shift-right', openClose)}, selectedlocale, languageDropdown);
        /* returning the language component */
        if (this.props.isBeforeLogin) {
            return (beforeLoginSelector);
        }
        else {
            return (afterLoginSelector);
        }
    };
    return LanguageSelector;
}(pureRenderComponent));
module.exports = LanguageSelector;
//# sourceMappingURL=languageselector.js.map