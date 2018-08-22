jest.dontMock("../../../src/components/header");

import React = require("react");
import ReactTestUtils = require('react-dom/test-utils');
import confirmationdialog = require("../../../src/components/utility/confirmationdialog");
import localeStore = require('../../../src/stores/locale/localestore');
import enums = require('../../../src/components/utility/enums');
import shallowRenderer = require('react-test-renderer/shallow');

/**
 * Describe test suite for the confirmation dialog
 */
describe("Test suite for the confirmation dialog screen", function () {

    var shallowRender = new shallowRenderer();

    var confirmationDialogProps = { header: "Logout Confirmation", content: "Are you sure you want to logout?", displayPopup: false, onYesClick: null, onNoClick: null, yesButtonText: "yes", noButtonText: "No", dialogType: enums.PopupDialogType.LogoutConfirmation };
    var confirmationPopUpElement = React.createElement(confirmationdialog, confirmationDialogProps, null);

    shallowRender.render(confirmationPopUpElement);
    var renderConfirmationPopUpWithDisplayPropSet = shallowRender.getRenderOutput();

    it("will check whether Confirmation Dialog rendered=> It should not render", () => {
        expect(renderConfirmationPopUpWithDisplayPropSet).toBeNull();
    });

    confirmationDialogProps = { header: "Logout Confirmation", content: "Are you sure you want to logout?", displayPopup: true, onYesClick: null, onNoClick: null, yesButtonText: "yes", noButtonText: "No" };
    confirmationPopUpElement = React.createElement(confirmationdialog, confirmationDialogProps, null);

    shallowRender.render(confirmationPopUpElement);

    var renderConfirmationPopUpWithOutDisplayPropSet = shallowRender.getRenderOutput();

    it("will check whether Confirmation Dialog rendered", () => {
        expect(renderConfirmationPopUpWithOutDisplayPropSet).not.toBeNull();
    });

    var onYesClickStub = jest.genMockFn();
    var onNoClickStub = jest.genMockFn();

    confirmationDialogProps = { header: "Logout Confirmation", content: "Are you sure you want to logout?", displayPopup: true, onYesClick: onYesClickStub, onNoClick: onNoClickStub, yesButtonText: "yes", noButtonText: "No" };
    var popUpElement = React.createElement(confirmationdialog, confirmationDialogProps);
    var renderedPopUp = ReactTestUtils.renderIntoDocument(popUpElement);

    it("will check Yes click is being called", () => {

        var yesButton = ReactTestUtils.findRenderedDOMComponentWithClass(renderedPopUp, "button primary rounded");

        ReactTestUtils.Simulate.click(yesButton);

        expect(onYesClickStub).toBeCalled();
    });

    it("will check No click is being called", () => {

        var noButton = ReactTestUtils.findRenderedDOMComponentWithClass(renderedPopUp, "button rounded close-button");

        ReactTestUtils.Simulate.click(noButton);

        expect(onNoClickStub).toBeCalled();
    });

    var mbcConfirmationDialogProps = null;
    var renderedMbcPopUp = null;
    var mbcConfirmationPopUpElement = null;

    it("will check whether mbc Confirmation Dialog rendered=> It should not render", () => {
        mbcConfirmationDialogProps = {
            header: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.header'),
            content: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.body'),
            displayPopup: false,
            onYesClick: null,
            onNoClick: null,
            yesButtonText: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.no-button'),
            noButtonText: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.yes-button'),
            dialogType: enums.PopupDialogType.MbCReturnToWorklistConfirmation
        };

        mbcConfirmationPopUpElement = React.createElement(confirmationdialog, mbcConfirmationDialogProps, null);
        shallowRender.render(mbcConfirmationPopUpElement);
        var renderMbcConfirmationPopUpWithDisplayPropSet = shallowRender.getRenderOutput();

        expect(renderMbcConfirmationPopUpWithDisplayPropSet).toBeNull();
    });

    it("will check whether mbc Confirmation Dialog rendered", () => {
        mbcConfirmationDialogProps = {
            header: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.header'),
            content: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.body'),
            displayPopup: true,
            onYesClick: onYesClickStub,
            onNoClick: onNoClickStub,
            noButtonText: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.no-button'),
            yesButtonText: localeStore.instance.TranslateText('marking.response.end-of-list-dialog.yes-button'),
            dialogType: enums.PopupDialogType.MbCReturnToWorklistConfirmation
        };

        mbcConfirmationPopUpElement = React.createElement(confirmationdialog, mbcConfirmationDialogProps, null);
        renderedMbcPopUp = ReactTestUtils.renderIntoDocument(mbcConfirmationPopUpElement);

        expect(renderedMbcPopUp).not.toBeNull();
    });

    it("will check Yes click is being called for mbc Confirmation Dialog ", () => {
        var yesButton = ReactTestUtils.findRenderedDOMComponentWithClass(renderedMbcPopUp, "button primary rounded");
        ReactTestUtils.Simulate.click(yesButton);
        expect(onYesClickStub).toBeCalled();
    });

    it("will check No click is being called for mbc Confirmation Dialog", () => {
        var noButton = ReactTestUtils.findRenderedDOMComponentWithClass(renderedMbcPopUp, "button rounded close-button");
        ReactTestUtils.Simulate.click(noButton);
        expect(onNoClickStub).toBeCalled();
    });

    it("verify the texts rendered properly for mbc Confirmation Dialog", () => {
        var popupHeader = ReactTestUtils.findRenderedDOMComponentWithClass(renderedMbcPopUp, "popup-header");
        expect(popupHeader.textContent).toBe(localeStore.instance.TranslateText('marking.response.end-of-list-dialog.header'));

        var popupContent = ReactTestUtils.findRenderedDOMComponentWithClass(renderedMbcPopUp, "popup-content");
        expect(popupContent.textContent).toBe(localeStore.instance.TranslateText('marking.response.end-of-list-dialog.body'));

        var yesButtonText = ReactTestUtils.findRenderedDOMComponentWithClass(renderedMbcPopUp, "button primary rounded");
        expect(yesButtonText.textContent).toBe(localeStore.instance.TranslateText('marking.response.end-of-list-dialog.yes-button'));

        var noButtonText = ReactTestUtils.findRenderedDOMComponentWithClass(renderedMbcPopUp, "button rounded close-button");
        expect(noButtonText.textContent).toBe(localeStore.instance.TranslateText('marking.response.end-of-list-dialog.no-button'));
    });

});