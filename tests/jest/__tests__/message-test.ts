/// <reference path="../../../src/app/references.d.ts" />
jest.dontMock('../../../src/components/message/message');

import react = require('react');
import testUtils = require('react-dom/test-utils');
import Message = require('../../../src/components/message/message');

describe("Message panel test", () => {
    let messageComponent;
    let messageComponentDOM;
    let responseIdclassName: string = 'message-resonse-id';
    let supervisorClassName: string = 'recipiant-name';
    let responseId: string = '63545456';
    let supervisorName: string = 'Steve';

    /**Message component rendering test **/
    var messageProps = {
            closeMessagePanel: jest.genMockFn().mockReturnThis(),
            responseId: Number(responseId),
            supervisorName: supervisorName,
            isVisible : true
        }

    messageComponent = react.createElement(Message, messageProps, null);
    messageComponentDOM = testUtils.renderIntoDocument(messageComponent);


    /** To check if the Message component has been loaded or not **/
    it("checks if the Message panel component has been loaded", () => {
        expect(messageComponentDOM).not.toBeNull();
    });

    /** To check if the associated responseId rendered or not **/

    it("checks if the responseId rendered correctly", () => {
        var responseclassName = testUtils.findRenderedDOMComponentWithClass(messageComponentDOM, responseIdclassName).className;
        expect(responseclassName).toBe(responseIdclassName);
        var responseId = testUtils.findRenderedDOMComponentWithClass(messageComponentDOM, responseIdclassName).textContent;
        expect(responseId).toBe(responseId);
    });

    /** To check if the supervisor name is rendered or not **/
    it("checks if the supervisor name rendered correctly", () => {
        var className = testUtils.findRenderedDOMComponentWithClass(messageComponentDOM, supervisorClassName).className;
        expect(className).toBe(supervisorClassName);
        var supervisor = testUtils.findRenderedDOMComponentWithClass(messageComponentDOM, supervisorClassName).textContent;
        expect(supervisor).toBe(supervisorName);
    });

});