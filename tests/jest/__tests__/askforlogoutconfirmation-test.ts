jest.dontMock("../../../src/components/logout/logoutconfirmationdialog");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import useroptionHelper = require("../../../src/utility/useroption/useroptionshelper");
import LogoutConfirmationDialog = require("../../../src/components/logout/logoutconfirmationdialog");
describe("Ask for logout confirmation", () => {

    /** rendering LanguageDropdown component and check if the properties are equal */
    it("checks if the value assigned to ask on logout option rendered ", () => {
        var askForLogout = <LogoutConfirmationDialog selectedLanguage= {"en-GB"} />
        var languageDom = TestUtils.renderIntoDocument(askForLogout);
        expect(languageDom).not.toBeNull();
    });

});
