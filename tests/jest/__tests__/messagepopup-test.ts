jest.dontMock('../../../src/components/message/message');

import react = require('react');
import testUtils = require('react-dom/test-utils');
import MessagePopUp = require('../../../src/components/message/messagepopup');

interface Item {
    id: number,
    name: string,
    parentExaminerDisplayName: string;
    parentExaminerId: number;
}

describe("Message panel test", () => {
    let messageComponent;
    let messageComponentDOM;
    let qigItemsList: Array<Item>;
    let supervisorClassName: string = 'recipiant-name';
    let selectedQigItem: string = 'AT1bioSP1ENGTZ1XXXX-AT-Biology';
    let supervisorName: string = 'Steve';
    let supervisorId: number = 3;
    let selectedQigItemId: number = 45;
    let isOpen: boolean = true;
    let selectedQigItemClassName: string = 'dropdown-wrap';

    /**Message component rendering test **/
    var messageProps = {
        closeMessagePanel: jest.genMockFn().mockReturnThis(),
        onQigItemSelected: jest.genMockFn().mockReturnThis(),
        qigItemsList: [{ id: 1, Name: 'QIG 1' }, { id: 2, Name: 'QIG 2' } ],
        selectedQigItem: selectedQigItem,
        supervisorName: supervisorName,
        selectedQigItemId: selectedQigItemId,
        supervisorId: supervisorId,
        isOpen: isOpen
    }

    messageComponent = react.createElement(MessagePopUp, messageProps, null);
    messageComponentDOM = testUtils.renderIntoDocument(messageComponent); 

    it("checks if the responseId rendered correctly", () => {
        expect(messageComponentDOM).not.toBeNull();
    });

    /** To check if the Message component has been loaded or not **/
    it("checks if the Message panel component has been loaded", () => {
        expect(messageComponentDOM).not.toBeNull();
    });
});