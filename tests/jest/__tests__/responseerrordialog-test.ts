
jest.dontMock("../../../src/components/utility/responseerrordialog");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import ResponseErrorDialog = require("../../../src/components/utility/responseerrordialog");
import enums = require("../../../src/components/utility/enums");
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");
import reactDOM = require('react-dom');
import dispatcher = require("../../../src/app/dispatcher");
import localeStore = require('../../../src/stores/locale/localestore');
import combinedWarningMessage = require('../../../src/components/response/typings/combinedwarningmessage');
import Warning = require('../../../src/components/response/typings/warning');
import shallowRenderer = require('react-test-renderer/shallow');

describe('ResponseErrorDialog Test', () => {

    let responseErrorDialogComponent = React.createElement(ResponseErrorDialog);
    let responseErrorDialogComponentDOM = TestUtils.renderIntoDocument(responseErrorDialogComponent);

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();

    /* ResponseAllocation Dialog Tests */

    let combinedWarning: combinedWarningMessage = new combinedWarningMessage();
    let warningMessages: Array<Warning> = new Array<Warning>();
    let warning: Warning = new Warning();
    warning.id = 'allPageNotAnnotated';
    warning.message = 'Not all pages are annotated. You will be unable to submit the response until you either place at least one annotation on every page, or use the \'Mark as seen\' button in full response view to confirm that you have viewed the content of each page.'
    warning.priority = enums.ResponseWarningPriority.AllPagesNotAnnotated;
    warning.warning = enums.ResponseNavigateFailureReason.AllPagesNotAnnotated;
    warningMessages.push(warning);

    warning.id = 'markChangeReason';
    warning.message = 'You will be unable to submit the response until you explain why you have changed the marks.'
    warning.priority = enums.ResponseWarningPriority.MarkChangeReasonNeeded;
    warning.warning = enums.ResponseNavigateFailureReason.MarkChangeReasonNeeded;
    warningMessages.push(warning);

    warningMessages.sort((warning: Warning) => { return warning.priority; }).reverse();
    

    let responseErrorDialogProps = {
        content: "Please review the following before leaving this response:",
        header: "Leaving response",
        displayPopup: false,
        warningType: enums.WarningType.LeaveResponse,
        primaryButtonText: "Leave response",
        secondaryButtonText: "Stay in response",
        responseNavigateFailureReasons: warningMessages
    };

    it("will check whether response allocation Dialog is not shown when displayPopup is set to false", () => {
        let responseallocationDialogComponent = React.createElement(ResponseErrorDialog, responseErrorDialogProps, null);
        shallowRender.render(responseallocationDialogComponent);
        let responseerrorDialog = shallowRender.getRenderOutput();
        expect(responseerrorDialog).toBeNull();
    });

    let responseErrorDialogPropsDisply = {
        content: "Please review the following before leaving this response:",
        header: "Leaving response",
        displayPopup: true,
        warningType: enums.WarningType.LeaveResponse,
        primaryButtonText: "Leave response",
        secondaryButtonText: "Stay in response",
        responseNavigateFailureReasons: warningMessages
    };

    it("will check whether response allocation Dialog is shown when displayPopup is set to true", () => {
        let responseallocationDialogComponent = React.createElement(ResponseErrorDialog, responseErrorDialogPropsDisply, null);
        shallowRender.render(responseallocationDialogComponent);
        let responseerrorDialog = shallowRender.getRenderOutput();
        expect(responseerrorDialog).not.toBeNull();
    });

});

