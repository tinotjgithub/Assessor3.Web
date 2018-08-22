/// <reference path="../../../typings/jest/jest.d.ts" />
/// <reference path="../../../src/components/logging/errordialog.tsx" />

jest.dontMock("../../../src/components/logging/errordialog");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import ErrorDialog = require("../../../src/components/logging/errordialog");
import enums = require("../../../src/components/utility/enums");
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");
import reactDOM = require('react-dom');
import dispatcher = require("../../../src/app/dispatcher");
import localeStore = require('../../../src/stores/locale/localestore');
import shallowRenderer = require('react-test-renderer/shallow');

describe('ErrorDialog', () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();

    var errorDialogProps = { isOpen: false, content: "ERROR content", viewMoreContent: " #### ERROR ViewMore", onOkClick: null, selectedLanguage: "en-GB", showErrorIcon: true};
    var errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
    shallowRender.render(errorDialogPopUp);
    var renderErrorDialogPopUpWithIsOpenFalse = shallowRender.getRenderOutput();
    it("will check whether Confirmation Dialog rendered=> It should not render", () => {
        expect(renderErrorDialogPopUpWithIsOpenFalse).toBeNull();
    });

    errorDialogProps = { isOpen: true, content: "ERROR content", viewMoreContent: "ERROR ViewMore", onOkClick: null, selectedLanguage: "en-GB", showErrorIcon: true };
    errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
    shallowRender.render(errorDialogPopUp);
    var renderErrorDialogPopUpWithIsOpenTrue = shallowRender.getRenderOutput();
    it("will check whether Confirmation Dialog rendered=> It should render", () => {
        expect(renderErrorDialogPopUpWithIsOpenTrue).not.toBeNull();
    });

    errorDialogProps = { isOpen: true, content: "### Testing Error Content...", viewMoreContent: "### Testing ERROR ViewMore", onOkClick: null, selectedLanguage: "en-GB", showErrorIcon: true };
    errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
    var renderErrorDialogPopUpWithConent= TestUtils.renderIntoDocument(errorDialogPopUp);
    it("will check whether the Error Content and more content is displaying properly", () => {
        let contentDiv = TestUtils.findRenderedDOMComponentWithClass(renderErrorDialogPopUpWithConent, "indented");
        expect(contentDiv.textContent).toBe("### Testing Error Content...");
        let viewMoreDiv = TestUtils.findRenderedDOMComponentWithClass(renderErrorDialogPopUpWithConent, "error-detail panel-content grey-border-all padding-all-10");
        expect(viewMoreDiv.textContent).toBe("### Testing ERROR ViewMore");
    });

    errorDialogProps = { isOpen: true, content: "Error Content...", viewMoreContent: "ERROR ViewMore", onOkClick: null, selectedLanguage: "en-GB", showErrorIcon: true };
    errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
    var renderErrorDialogPopUpWithViewore = TestUtils.renderIntoDocument(errorDialogPopUp);

    it("will check whether the Error Detail panel is Hidden or not", () => {
        renderErrorDialogPopUpWithViewore.setState({ isViewMoreOpen: enums.Tristate.close });
        jest.runAllTicks();
        let viewMoreHidden = TestUtils.findRenderedDOMComponentWithClass(renderErrorDialogPopUpWithViewore, "panel close");
        expect(viewMoreHidden).not.toBeNull();

        renderErrorDialogPopUpWithViewore.setState({ isViewMoreOpen: enums.Tristate.open });
        jest.runAllTicks();
        let viewMoreNotHidden = TestUtils.findRenderedDOMComponentWithClass(renderErrorDialogPopUpWithViewore, "panel open");
        expect(viewMoreNotHidden).not.toBeNull();
    });

    it("will check whether the custom error is rendered for not fully marked single response", () => {
        errorDialogProps = { content: localeStore.instance.TranslateText('marking.worklist.response-submission-error-dialog.body-single-response-not-submitted'), viewMoreContent: '', isOpen: true, onOkClick: undefined, isCustomError: true };
        errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
        var renderErrorDialogPopUpWithConent = TestUtils.renderIntoDocument(errorDialogPopUp);
        expect(reactDOM.findDOMNode(renderErrorDialogPopUpWithConent).textContent).toContain('This response could not be submitted. Please review your worklist and try again.')
    });

    it("will check whether the custom error is rendered for not fully marked multiple responses", () => {
        errorDialogProps = { content: localeStore.instance.TranslateText('marking.worklist.response-submission-error-dialog.body-some-responses-not-submitted'), viewMoreContent: '', isOpen: true, onOkClick: undefined, isCustomError: true };
        errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
        var renderErrorDialogPopUpWithConent = TestUtils.renderIntoDocument(errorDialogPopUp);
        expect(reactDOM.findDOMNode(renderErrorDialogPopUpWithConent).textContent).toContain('Some responses could not be submitted. Please review your worklist and try again.')
    });

    it("will check whether the custom error is rendered for an examiner who is suspended and submitting single response", () => {
        errorDialogProps = { content: localeStore.instance.TranslateText('marking.worklist.approval-status-changed-dialog.body'), viewMoreContent: '', isOpen: true, onOkClick: undefined, isCustomError: true };
        errorDialogPopUp = React.createElement(ErrorDialog, errorDialogProps, null);
        var renderErrorDialogPopUpWithConent = TestUtils.renderIntoDocument(errorDialogPopUp);
        expect(reactDOM.findDOMNode(renderErrorDialogPopUpWithConent).textContent).toContain('Your approval status on this question group has changed and you cannot download or submit responses until your supervisor provides you with feedback. You can still review any responses which have already been downloaded into your worklist. This will not prevent you from marking other question groups where you have a quota.')
    });
});

