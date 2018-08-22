/// <reference path="../../../src/app/references.d.ts" />
jest.dontMock('../../../src/components/message/subject');

import react = require('react');
import testUtils = require('react-dom/test-utils');
import subject = require('../../../src/components/message/subject');

describe("Message Subject test", () => {
    /**Subject component rendering test **/
    let subjectComponent;
    let subjectComponentDOM;

    let placeholderText: string = 'Write a Subject';
    let maxLengthValue: string = '120';

    var subjectProps = {
        outerClass: 'comp-subject-wrap',
        refName: 'subjectInput',
        hasFocus: true,
        className: 'subject-input',
        placeHolder: placeholderText,
        maxLength: Number(maxLengthValue),
        value: 'Sample Subject',
        onChange: jest.genMockFunction
    }

   subjectComponent = react.createElement(subject, subjectProps, null);
   subjectComponentDOM = testUtils.renderIntoDocument(subjectComponent);

    /** To check if the Subject component has been rendered or not **/
    it("checks if the Message subject component has been rendered", () => {
        expect(subjectComponentDOM).not.toBeNull();
    });

    /** To check if the Message subject placeholder set is correctly or not **/
    it("checks if the Message subject placeholder set is correctly or not", () => {
        var placeholder = testUtils.findRenderedDOMComponentWithClass(subjectComponentDOM, 'subject-input').getAttribute('placeholder');
        expect(placeholder).toBe(placeholderText);
    });

    /** To check if the Message subject text box length is restricted or not **/
    it("checks if the Message subject place holder length is restricted or not", () => {
        var maxLength = testUtils.findRenderedDOMComponentWithClass(subjectComponentDOM, 'subject-input').getAttribute('maxLength');
        expect(maxLength).toBe(maxLengthValue);
    });

});