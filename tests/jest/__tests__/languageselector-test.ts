/// <reference path="../../../typings/jest/jest.d.ts" />

jest.dontMock("../../../src/components/utility/locale/languageselector");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import LanguageSelector = require("../../../src/components/utility/locale/languageselector");

describe('SelectedLanguage', () => {
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

    var languageList: LanguageList = JSON.parse(JSON.stringify(json));

     /** rendering SelectedLanguage component and check if the properties are equal */
    it('checks if the value assigned to selectedlanguage works', () => {
        var languageSelector = <LanguageSelector availableLanguages={languageList} selectedLanguage= {"de-DE"} />;
        var languageDom = TestUtils.renderIntoDocument(languageSelector);
        expect(ReactDOM.findDOMNode(languageDom).textContent).toBe("Deutsch EnglishDeutschEspañolFrançais");
    });
});
