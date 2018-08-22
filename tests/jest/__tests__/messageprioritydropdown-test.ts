
import react = require('react');
import testUtils = require('react-dom/test-utils');
import DropDown = require('../../../src/components/message/messageprioritydropdown');

describe("Message priority test", () => {
    let messagePriorityComponent;
    let messagePriorityDropDownComponentDOM;
    /**Message priority dropdown component rendering test **/
    beforeEach(() => {
         var dropdownProps = {
             isOpen: false,
             onClick: jest.genMockFn().mockReturnThis(),
             onSelect: jest.genMockFn().mockReturnThis(),
             selectedItem: 'Standarad',
             items: [{ id: 1, name: 'Standarad' }, { id: 1, name: 'Important' }]
        }

         messagePriorityComponent = DropDown(dropdownProps);
         messagePriorityDropDownComponentDOM = testUtils.renderIntoDocument(messagePriorityComponent);
    });

    /** To check if the Message priority dropdown has been rendered or not **/
    it("checks if the Message priority dropdown has been rendered", () => {
        expect(messagePriorityDropDownComponentDOM).not.toBeNull();
    });

});