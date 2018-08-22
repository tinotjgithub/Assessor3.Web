/// <reference path='../../../App/references.d.ts' />

/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import LanguageDropdown = require('./languagedropdown');
import localeStore = require('../../../stores/locale/localestore');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
let classNames = require('classnames');
import cookie = require('react-cookie');
const COOKIE_KEY = 'language';

/**
 * Properties of SelectedLanguage component
 */
interface Props extends LocaleSelectionBase {
    availableLanguages: LanguageList;
    isBeforeLogin: boolean;
}

/**
 * State of SelectedLanguage component
 */
interface State {
    isOpen?: boolean;
}

/**
 * Represents the selected language in an available language dropdown
 */
class LanguageSelector extends pureRenderComponent<Props, State> {

    private isSelectedItemClicked: boolean = false;
    private _boundHandleOnClick: EventListenerObject = null;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isOpen: undefined
        };

        this._boundHandleOnClick = this.handleOnClick.bind(this);
        this.openCloseDropdown = this.openCloseDropdown.bind(this);
    }

    /**
     * Open/Close language selection dropdown according to selection.
     */
    private refreshState = (): void => {
        /** Get the locale code from local store and set selected language in dropdown */
        let selected = this.getLocaleNameFromCode(localeStore.instance.Locale);
        selected ? this.setState({ isOpen: false }) : this.setState({ isOpen: true });
    };

    /**
     * Get the locale name when the locale code is provided.
     * @param {string} localeCode - The locale code
     * @return {string } The locale name
     */
    private getLocaleNameFromCode(localeCode: string): string {
        let selectedLocaleName: string = '';
        /** Return locale name(Eg: English) when locale code(Eg: en) is provided */
        this.props.availableLanguages.languages.language.map(function (language: Language) {
            if (localeCode === language.code) {
                selectedLocaleName = language.name;
            }
        });

        return selectedLocaleName;
    }

    /**
     * Open/Close the language selection dropdown
     * @param {any} source - The source element
     */
    private openCloseDropdown(source: any) {
        /** set if the language selection dropdown is clicked */
        this.isSelectedItemClicked = true;
        /** Toggle the open css class upon clicking the selected item. */
        this.state.isOpen ? this.setState({ isOpen: false }) : this.setState({ isOpen: true});
    }

     /**
      * Handle click events on the window and collapse language selection dropdown
      * @param {any} source - The source element
      */
    private handleOnClick = (source: any): any => {
        /**
         * if the language selection dropdown is getting selected then no need to collapse it
         *   since openCloseDropdown fires first isSelectedItemClicked will be set first
         */
        if (!this.isSelectedItemClicked && this.state.isOpen !== undefined) {
            /** 
             * not setting any css class since setting close CSS class will show unwanted animation
             */
            this.setState({ isOpen: undefined });
        } else {
            /** 
             * reseting the selected flag
             */
            this.isSelectedItemClicked = false;
        }
    };

    /**
     * writeCookie will write the current selected language to cookie
     */
    private writeCookie(key: string, value: any) {
        let expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 1);
        let opt = {
            expires: expireDate
        };

        cookie.save(key, value, opt);
    }

    /**
     * languageChanged will notify the language has successfully changed
     */
    private languageChanged = (): void => {
        let langStyle: string;

            let className: string = window.document.body.className;
            this.props.availableLanguages.languages.language.filter((language: Language) => {
                if (className.indexOf(language.style) > -1){
                    htmlUtilities.removeClassFromBody(' ' + language.style);
                }
            });

        this.props.availableLanguages.languages.language.map(function (language: Language) {
            if (localeStore.instance.Locale === language.code) {
                langStyle = language.style;
            }
        });

        htmlUtilities.addClassToBody(langStyle);

        this.writeCookie(COOKIE_KEY, localeStore.instance.Locale);
    };

    /**
     * Subscribe window click event
     */
    public componentDidMount() {
        window.addEventListener('click', this._boundHandleOnClick );
        localeStore.instance.addListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    }

    /**
     * Unsubscribe window click event
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._boundHandleOnClick );
        localeStore.instance.removeListener(localeStore.LocaleStore.LOCALE_CHANGE_EVENT, this.languageChanged);
    }

    /**
     * Render method
     */
    public render() {
        let selectedLanguage = '';
        /** Get selected locale name from code */
        selectedLanguage = this.getLocaleNameFromCode(this.props.selectedLanguage);
        let selectedLanguageStyle = '';
        let spriteIconStyle = '';
        if (this.props.isBeforeLogin) {
            selectedLanguageStyle = 'nav-text';
            spriteIconStyle = 'sprite-icon menu-arrow-icon lite';
        } else {
            selectedLanguageStyle = '';
            spriteIconStyle = 'sprite-icon menu-arrow-icon';
        }
        /* The element that shows the selected language */
        let selectedlocale = (
                                <a href='javascript:void(0)'
                                    title={localeStore.instance.TranslateText('login.login-page.language-selector-tooltip')}
                                    onClick={this.openCloseDropdown}
                                    className='menu-button'>
                                        <span className={selectedLanguageStyle}>{selectedLanguage} </span>
                                        <span className={spriteIconStyle}></span>
                                </a>
                            );

         /* The component that shows the available languages */
        let languageDropdown = (
                                 < LanguageDropdown
                                     availableLanguages= { this.props.availableLanguages }
                                     onSelected= { this.refreshState }
                                     selectedLanguage= { this.props.selectedLanguage }
                                     selectedLocaleName= { selectedLanguage }
                                />
                            );
        /* CSS class for Show/Close the language dropdown */
        let openClose = (
                            {
                                'open': this.state.isOpen,
                                'close': this.state.isOpen === undefined ? this.state.isOpen : !this.state.isOpen
                            }
                        );

        let beforeLoginSelector = < li
            role='menuitem'
            aria-haspopup='true'
            className={classNames(
                'dropdown-wrap', openClose) } >
                                                {selectedlocale}
                                                {languageDropdown}
            </li>;
        let afterLoginSelector = < div
            className={classNames(
                'dropdown-wrap form-component shift-right', openClose) }>
                                                {selectedlocale}
                                                {languageDropdown}
            </div>;
        /* returning the language component */
        if (this.props.isBeforeLogin) {
            return (
                beforeLoginSelector
            );
        } else {
            return (
                afterLoginSelector
            );
        }

    }
}

export = LanguageSelector;