import React = require('react');
import TestUtils = require('react-dom/test-utils');
import ExceptionAction = require("../../../src/components/exception/actionexception");
import dispatcher = require("../../../src/app/dispatcher");
import actionExceptionPopupVisibilityAction = require('../../../src/actions/exception/actionexceptionpopupvisibilityaction');
import enums = require('../../../src/components/utility/enums');
import ReactDOM = require('react-dom');
var localJson = require("../../../content/resources/rm-en.json");
import localAction = require("../../../src/actions/locale/localeaction");

describe("Action Exception Test", () => {
    /**Exception action popup component rendering test **/

    var exceptionDetail =
        {
            "exceptionId": 0,
            "exceptionType": 3,
            "exceptionStatusId": 0,
            "dateTimeRaised": "2017-05-10T09:19:50.593Z",
            "exceptionComments":
            [
                {
                    "uniqueId": 111,
                    "exceptionID": 55,
                    "comment": "\\nQQ",
                    "updatedDate": "2017-05-10T09:19:50.78Z",
                    "updatedBy": "fake",
                    "examinerID": 91,
                    "escalationPoint": 2,
                    "examinerName": "S kamustaka",
                    "rowVersion": "AAAAAEqkFro=",
                    "authorIsGroup": false,
                    "createdDate": "2017-05-10T09:19:50.78Z",
                    "exceptionStatus": 1
                }],
            "questionItemId": 0,
            "candidateScriptID": 10362,
            "uniqueId": 55,
            "questionPaperPartID": 13,
            "markSchemeGroupID": 12,
            "markSchemeID": 299,
            "ownerExaminerId": 55,
            "originatorExaminerId": 91,
            "originatorExaminerRoleId": 108,
            "assignedToOwnerExaminerDate": "2017-05-10T10:23:16.98",
            "ownerEscalationPoint": 0,
            "ownerIsGroup": true,
            "currentStatus": 1,
            "rowVersion": "AAAAAEqkFr8=",
            "markGroupId": 10543,
            "iseBookMarking": false,
            "status": 1,
            "displayId": 6815095,
            "isPartOfWholeResponse": false,
            "relatedResponseExaminerRoleId": 108,
            "examinerName": "S kamustaka",
            "questionPaperPartName": "IGCSE MATHEMATICS PAPER 1",
            "relatedItemDisplayLabel": "4",
            "modifiedDate": "2017-05-10T10:23:16.98",
            "relatedResponseMarkingMode": 30,
            "relatedResponseMarkingStatus": 0,
            "currentDateTime": "2017-05-10T11:38:39.6",
            "receivedDate": null,
            "actionedDate": null,
            "exceptionStatusAtDistribution": 1,
            "alternativeEscalationPoint": 3
        };

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var exceptionAction = <ExceptionAction exceptionDetails={exceptionDetail} />;

    it("checks if exception action popup is rendered", () => {

        // to check component has been rendered
        var componentDOM = TestUtils.renderIntoDocument(exceptionAction);
        expect(componentDOM).not.toBeNull();
    });

    it("checks if resolve exception action popup is rendered with proper action title", () => {

        // to checks if resolve exception action popup is rendered with proper action message
        var componentDOM = TestUtils.renderIntoDocument(exceptionAction);
        dispatcher.dispatch(new actionExceptionPopupVisibilityAction(true, enums.ExceptionActionType.Resolve));
        expect(ReactDOM.findDOMNode(componentDOM).children[0].children[0].children[0].textContent).toBe('Resolve exception');
    });

    it("checks if resolve exception action popup is rendered with proper action message", () => {

        // to checks if resolve exception action popup is rendered with proper action message
        var componentDOM = TestUtils.renderIntoDocument(exceptionAction);
        dispatcher.dispatch(new actionExceptionPopupVisibilityAction(true, enums.ExceptionActionType.Resolve));
        expect(ReactDOM.findDOMNode(componentDOM).children[0].children[1].children[0].textContent).
            toBe('Please add a comment before resolving this exception.');
    });

    it("checks if escalate exception action popup is rendered with proper action title", () => {

        // checks if escalate exception action popup is rendered with proper action title
        var componentDOM = TestUtils.renderIntoDocument(exceptionAction);
        dispatcher.dispatch(new actionExceptionPopupVisibilityAction(true, enums.ExceptionActionType.Escalate));
        expect(ReactDOM.findDOMNode(componentDOM).children[0].children[0].children[0].textContent).toBe('Escalate exception');
    });

    it("checks if escalate exception action popup is rendered with proper action message", () => {

        // to checks if escalate exception action popup is rendered with proper action message
        var componentDOM = TestUtils.renderIntoDocument(exceptionAction);
        dispatcher.dispatch(new actionExceptionPopupVisibilityAction(true, enums.ExceptionActionType.Escalate));
        expect(ReactDOM.findDOMNode(componentDOM).children[0].children[1].children[0].textContent).
            toBe('Please add a comment before escalating this exception.');
    });
});
