import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require("../../../src/components/utility/enums");
import MarkCheckExaminers = require("../../../src/components/worklist/markcheck/markcheckexaminers");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import markCheckExaminerInfo = require("../../../src/stores/worklist/typings/markcheckexaminerinfo");
import Immutable = require('immutable');

describe("Test suite for mark check examiners left panel", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var _markCheckExaminersList: Immutable.List<markCheckExaminerInfo>;

    _markCheckExaminersList = [{ fromExaminerID: 30, toExaminerID: 1, toExaminer: { surname: 'Tarun', initials: 'S', fullName: 'S Tarun' }, messageTypeID: 10, roleID: 3, examinerRoleID: 26 }, { fromExaminerID: 31, toExaminerID: 2, toExaminer: { surname: 'Tarun1', initials: 'S1', fullName: 'S Tarun1' }, messageTypeID: 10, roleID: 3, examinerRoleID: 27 }];

    var markCheckExaminersComponent = <div><MarkCheckExaminers markCheckExaminers= {_markCheckExaminersList} selectedLanguage= { "en-GB"} /></div>;

    var markCheckExaminersDOM = TestUtils.renderIntoDocument(markCheckExaminersComponent);

    it("checks if markCheckExaminers component is rendered", () => {
        expect(markCheckExaminersDOM).not.toBeNull();
    });

    it("checks if markCheckExaminers component is rendered with proper data", () => {
        expect(ReactDOM.findDOMNode(markCheckExaminersDOM).children[0].children[0].textContent).toBe('S TarunPrincipal Examiner');
        expect(ReactDOM.findDOMNode(markCheckExaminersDOM).children[0].children[1].textContent).toBe('S1 Tarun1Principal Examiner');
    });

    it("checks if markCheckExaminers component with class names", () => {
        let _className: string = 'column-left-inner';
        expect(ReactDOM.findDOMNode(markCheckExaminersDOM).children[0].className).toBe(_className);
    });
});
