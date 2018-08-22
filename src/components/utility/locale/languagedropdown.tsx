/// <reference path='../../../App/references.d.ts' />

/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeActionCreator = require('../../../actions/locale/localeactioncreator');
import localeStore = require('../../../stores/locale/localestore');

/**
 * Properties of AvailableLanguages component
 */
interface Props extends LocaleSelectionBase {
    availableLanguages: LanguageList;
    onSelected: Function;
    selectedLocaleName: string;
}

/**
 * Represents the available languages
 */
class LanguageDropdown extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Called upon clicking one of the available languages in the dropdown
     * @param {string} source - The source element
     */
    private handleClick(source: any) {
        let awardingBody: string = '';
        let selectedLanguage = source.target.textContent;
        if (this.props.availableLanguages !== undefined) {
            awardingBody = this.props.availableLanguages.languages['awarding-body'];
        }

        /**
         * Check if the language is already selected
         */
        if (this.props.selectedLocaleName !== selectedLanguage) {
            localeActionCreator.localeChange(this.getLocaleCodeFromName(selectedLanguage), awardingBody);
        } else {
             /* Call back to selected language component to collapse dropdoen if same language is selected */
            this.props.onSelected();
        }
    }

    /**
     * Get the locale code when the locale name is provided.
     * @param {string} localeName - The locale name
     * @return {string } The locale code
     */
    private getLocaleCodeFromName(localeName: string): string {
        let selectedLocaleCode: string = '';
        if (this.props.availableLanguages !== undefined) {
            /* Return locale code(Eg: en) when locale name(English) is provided */
            this.props.availableLanguages.languages.language.map(function (lang: any) {
                if (localeName === lang.name) {
                    selectedLocaleCode = lang.code;
                }
            });
        }

        return selectedLocaleCode;
    }

    /**
     * Render method
     */
    public render() {
        let languages = undefined;
        if (this.props.availableLanguages !== undefined) {
            /* iterating each language to display */
            languages = this.props.availableLanguages.languages.language.map(function (language: Language) {
                return (
                    <li role='menuitem' key={language.code}>
                    <a href='javascript:void(0)'>{language.name}</a>
                        </li>
                );
            });

        }
        return (
            <ul className='menu'
                role='menu'
                title = {localeStore.instance.TranslateText('login.login-page.language-selector-dropdown-tooltip') }
                aria-hidden='true'
                onClick={this.handleClick} >
                  {languages}
                </ul>
        );
    }
}
export = LanguageDropdown;