/// <reference path="../../../typings/jest/jest.d.ts" />
/// <reference path="../../../src/components/logging/errordialog.tsx" />

jest.dontMock("../../../src/components/utility/genericdialog");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import GenericDialog = require("../../../src/components/utility/genericdialog");
import enums = require("../../../src/components/utility/enums");
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");
import reactDOM = require('react-dom');
import dispatcher = require("../../../src/app/dispatcher");
import localeStore = require('../../../src/stores/locale/localestore');
import shallowRenderer = require('react-test-renderer/shallow');

describe('GenericDialog Test', () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();

     /* ResponseAllocation Dialog Tests */

    var responseAllocationProps = {
        content: "ResponseAllocationError content",
        secondaryContent: "secondaryContent",
        header: "ResponseAllocationError header",
        onOkClick: null,
        displayPopup: false,
        okButtonText: "OK",
        popupDialogType: enums.PopupDialogType.ResponseAllocationError,
        selectedLanguage: "en-GB",
        id: 'responseallocationerrordialog',
        key: 'responseallocationerrordialog'
    };

    it("will check whether response allocation Dialog is not shown when displayPopup is set to false", () => {
        let responseallocationDialogComponent = React.createElement(GenericDialog, responseAllocationProps, null);
        shallowRender.render(responseallocationDialogComponent);
        let responseallocationDialog = shallowRender.getRenderOutput();
        expect(responseallocationDialog).toBeNull();
    });

    var responseAllocationDialogProps = {
        content: "ResponseAllocationError content",
        secondaryContent: "secondaryContent",
        header: "ResponseAllocationError header",
        onOkClick: null,
        displayPopup: true,
        okButtonText: "OK",
        popupDialogType: enums.PopupDialogType.ResponseAllocationError,
        selectedLanguage: "en-GB",
        id: 'responseallocationerrordialog',
        key: 'responseallocationerrordialog'
    };
    var responseAllocationDialogDialogPopUp = React.createElement(GenericDialog, responseAllocationDialogProps, null);
    shallowRender.render(responseAllocationDialogDialogPopUp);
    var renderGenericDialog = shallowRender.getRenderOutput();
    it("will check whether response allocation Dialog rendered=> It should render", () => {
        expect(renderGenericDialog).not.toBeNull();
    });

    var renderResponseAllocationDialogPopUpWithConent = TestUtils.renderIntoDocument(responseAllocationDialogDialogPopUp);

    it("will check whether the content is displaying properly for response allocation Dialog", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderResponseAllocationDialogPopUpWithConent, "popup-content");
        expect(contentDiv.textContent).toBe("ResponseAllocationError content");
    });

    it("will check whether the header is displaying properly for response allocation Dialog", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderResponseAllocationDialogPopUpWithConent, "popup-header");
        expect(contentDiv.textContent).toBe("ResponseAllocationError header");
    });

    it("will check whether the ok button text is displaying properly for response allocation Dialog", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderResponseAllocationDialogPopUpWithConent, "primary button rounded close-button");
        expect(contentDiv.textContent).toBe("OK");
    });

    /* Standardisation Approved Dialog Tests */

    var standardisationApprovedProps = {
        content: "StandardisationApproved content",
        secondaryContent: "StandardisationApproved secondaryContent",
        header: "StandardisationApproved header",
        onOkClick: null,
        displayPopup: false,
        okButtonText: "OK",
        popupDialogType: enums.PopupDialogType.StandardisationApproved,
        selectedLanguage: "en-GB",
        id: 'responseallocationerrordialog',
        key: 'responseallocationerrordialog'
    };

    it("will check whether standardisation approved Dialog is not shown when displayPopup is set to false", () => {
        let standardisationApprovedDialogComponent = React.createElement(GenericDialog, standardisationApprovedProps, null);
        shallowRender.render(standardisationApprovedDialogComponent);
        let standardisationApprovedDialog = shallowRender.getRenderOutput();
        expect(standardisationApprovedDialog).toBeNull();
    });

    var standardisationApprovedDialogProps = {
        content: "StandardisationApproved content",
        secondaryContent: "StandardisationApproved secondaryContent",
        header: "StandardisationApproved header",
        onOkClick: null,
        displayPopup: true,
        okButtonText: "OK",
        popupDialogType: enums.PopupDialogType.StandardisationApproved,
        selectedLanguage: "en-GB",
        id: 'responseallocationerrordialog',
        key: 'responseallocationerrordialog'
    };
    var StandardisationApprovedDialogPopUp = React.createElement(GenericDialog, standardisationApprovedDialogProps, null);
    shallowRender.render(StandardisationApprovedDialogPopUp);
    var renderGenericDialog = shallowRender.getRenderOutput();

    it("will check whether Standardisation Approved Dialog rendered=> It should render", () => {
        expect(renderGenericDialog).not.toBeNull();
    });

    var renderStandardisationApprovedDialogPopUpWithConent = TestUtils.renderIntoDocument(StandardisationApprovedDialogPopUp);

    it("will check whether the content is displaying properly for Standardisation Approved Dialog", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderStandardisationApprovedDialogPopUpWithConent, "popup-content");
        expect(contentDiv.textContent).toBe("StandardisationApproved contentStandardisationApproved secondaryContent");
    });

    it("will check whether the header is displaying properly for Standardisation Approved Dialog", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderStandardisationApprovedDialogPopUpWithConent, "popup-header");
        expect(contentDiv.textContent).toBe("StandardisationApproved header");
    });

    it("will check whether the ok button text is displaying properly for Standardisation Approved Dialog", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderStandardisationApprovedDialogPopUpWithConent, "primary button rounded close-button");
        expect(contentDiv.textContent).toBe("OK");
    });
});

