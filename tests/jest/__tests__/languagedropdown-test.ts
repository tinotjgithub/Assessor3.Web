/// <reference path="../../../src/components/utility/locale/languagedropdown.tsx" />
/// <reference path="../../../typings/jest/jest.d.ts" />

jest.dontMock("../../../src/components/utility/locale/languagedropdown");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import LanguageDropdown = require("../../../src/components/utility/locale/languagedropdown");

describe('LanguageDropdown', () => {
    /** defining json object with languages */
    var json = {
        "languages": {
            "awardingbody": "RM",
            "defaultculture": "en-GB",
            "fallbackculture": "en-GB",
            "language": [
                {
                    "name": "English",
                    "code": "en-GB"
                },
                {
                    "name": "Deutsch",
                    "code": "de-DE"
                },
                {
                    "name": "Español",
                    "code": "es-ES"
                },
                {
                    "name": "Français",
                    "code": "fr-FR"
                }
            ]
        }
    };
    var onSelectedMock = jest.genMockFunction();
    var languageList: LanguageList = JSON.parse(JSON.stringify(json));
    /** rendering LanguageDropdown component and check if the properties are equal */
    it("checks if the value assigned to availablelanguages works", () => {

        var languageDropdown = <LanguageDropdown availableLanguages={languageList} onSelected = { onSelectedMock } selectedLanguage= { "en-GB"}  />;
        var languageDom = TestUtils.renderIntoDocument(languageDropdown);
        expect(languageDom.props.availableLanguages).toBe(languageList);
    });

    /** rendering AvailableLanguages component and check randomly for the correct rendered language */
    it('checks if the value assigned to available languages renders into individual items', () => {
        var languageDropdown = <LanguageDropdown availableLanguages={languageList} onSelected = { onSelectedMock } selectedLanguage= { "en-GB"} />;
        var languageDom = TestUtils.renderIntoDocument(languageDropdown);
         expect(ReactDOM.findDOMNode(languageDom).textContent).toBe("EnglishDeutschEspañolFrançais");
    });
});