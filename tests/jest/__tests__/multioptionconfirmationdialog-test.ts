jest.dontMock('../../../src/components/utility/multioptionconfirmationdialog');
jest.dontMock("../../../src/actions/locale/localeaction");

import React = require('react');
import testUtils = require('react-dom/test-utils');
import MultiOptionConfirmationDialog = require('../../../src/components/utility/multioptionconfirmationdialog');
import dispatcher = require("../../../src/app/dispatcher");
import enums = require('../../../src/components/utility/enums');
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");
var findDOMNode = require('react-dom').findDOMNode;
import localeStore = require('../../../src/stores/locale/localestore');

describe("Multi option confirmation dialog test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var onCancelClickOfSelectResponseToMarkasProvisional = jest.genMockFn();
    var selectProvisionalMarkNowClick = jest.genMockFn();
    var selectProvisionalMarkLaterClick = jest.genMockFn();

    var content: JSX.Element[] = <div>Content to test </div>;
    
    var multiOptionDialogProps = {
        content: content,
        header: localeStore.instance.TranslateText(
            'standardisation-setup.select-response.select-to-mark-popup-header'),
        displayPopup: true,
        onCancelClick: null,
        onYesClick: null,
        onNoClick: null,
        isKeyBoardSupportEnabled: true,
        selectedLanguage: 'en-GB',
        popupSize: enums.PopupSize.Medium,
        popupType: enums.PopUpType.SelectToMarkAsProvisional,
        buttonCancelText: localeStore.instance.TranslateText(
            'standardisation-setup.select-response.select-to-mark-popup-button1'),
        buttonNoText: localeStore.instance.TranslateText(
            'standardisation-setup.select-response.select-to-mark-popup-button2'),
        buttonYesText: localeStore.instance.TranslateText(
            'standardisation-setup.select-response.select-to-mark-popup-button3'),
        displayNoButton: true
    };

    var multiOptionComponent = React.createElement(MultiOptionConfirmationDialog, multiOptionDialogProps, null);
    var multiOptionComponentDOM = testUtils.renderIntoDocument(multiOptionComponent);

    it("checks if Multi option confirmation dialog is rendered with correct values", () => {

        expect(multiOptionComponentDOM).not.toBeNull();

        // to check particular class name has been rendered
        var multiOptionComponentDOMClassName = testUtils.findRenderedDOMComponentWithClass(
            multiOptionComponentDOM,
            'popup popup-overlay close-button popup-open open medium').className;
        expect(multiOptionComponentDOMClassName).toBe('popup popup-overlay close-button popup-open open medium');

        // to check particular content has been rendered
        var multiOptionComponentDOMText = testUtils.findRenderedDOMComponentWithClass(multiOptionComponentDOM, 'content-with-radio-btn').textContent;
        expect(multiOptionComponentDOMText).toBe('Content to test ');
    });

    it("checks if Multi option confirmation dialog is rendered with all three buttons", () => {

        // to check particular class name has been rendered
        var multiOptionComponentDOMClassNameCloseButton = testUtils.findRenderedDOMComponentWithClass(
            multiOptionComponentDOM,
            'button rounded close-button').className;
        expect(multiOptionComponentDOMClassNameCloseButton).toBe('button rounded close-button');

        // // to check particular class name has been rendered
        var multiOptionComponentDOMClassNameYesButton = testUtils.findRenderedDOMComponentWithClass(
            multiOptionComponentDOM,
            'button primary rounded').className;
        expect(multiOptionComponentDOMClassNameYesButton).toBe('button primary rounded');

        // to check particular class name has been rendered
        var multiOptionComponentDOMCount = testUtils.scryRenderedDOMComponentsWithClass(
            multiOptionComponentDOM,
            'button rounded');
        expect(multiOptionComponentDOMCount.length).toBe(3);
    });
});