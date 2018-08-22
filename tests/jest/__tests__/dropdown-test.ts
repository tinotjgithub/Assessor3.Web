/// <reference path="../../../typings/jest/jest.d.ts" />
jest.dontMock('../../../src/components/utility/dropdown');
import React = require('react');
import testUtils = require('react-dom/test-utils');
import enums = require('../../../src/components/utility/enums');
import DropDown = require('../../../src/components/utility/dropdown');

describe("dropdown test", () => {

    let dropDownProps: any;
    let dropDownComponent: any;
    let dropDownComponentDOM: any;

    /** To check if the EnhancedOffPageCommentFile dropdown has been rendered or not **/
    it("checks if the dropdown EnhancedOffPageCommentFile has been rendered", () => {
        getDropDownType(enums.DropDownType.EnhancedOffPageCommentFile);
        var selectedItem = testUtils.findRenderedDOMComponentWithClass(dropDownComponentDOM, 'menu-button');  
        expect(selectedItem.textContent.trim()).toEqual('file-1');
    });

    /** To check if the EnhancedOffPageCommentQuestionItem dropdown has been rendered or not **/
    it("checks if the dropdown EnhancedOffPageCommentQuestionItem has been rendered", () => {
        getDropDownType(enums.DropDownType.EnhancedOffPageCommentQuestionItem);
        // check drop down is rendered
        expect(dropDownComponentDOM).not.toBeNull();
        // selected item text test
        var selectedItem = testUtils.findRenderedDOMComponentWithClass(dropDownComponentDOM, 'menu-button');
        expect(selectedItem.textContent.trim()).toEqual('Question-A');
    });

    function getDropDownType(dropDownType: enums.DropDownType) {
        let selectedItem: string;
        let items: any;
        let title: string;
        let className: string;
        switch (dropDownType) {
            case enums.DropDownType.EnhancedOffPageCommentFile:
                selectedItem = 'file-1';
                items = [{ id: 0, name: '---' }, { id: 1, name: 'file-1' }, { id: 2, name: 'file-2' }];
                title = 'file dropdown';
                className = 'dropdown-wrap comment-item-dropdown';
                break;
            case enums.DropDownType.EnhancedOffPageCommentQuestionItem:
                selectedItem = 'Question-A';
                items = [{ id: 0, name: '---' }, { id: 1, name: 'Question-A' }, { id: 2, name: 'Question-B' }];
                title = 'question item dropdown';
                className = 'dropdown-wrap comment-item-dropdown';
                break;

        }

        dropDownProps = {
            id: 'drop-down',
            dropDownType: dropDownType,
            className: className,
            style: null,
            isOpen: false,
            onClick: jest.fn(),
            onSelect: jest.fn(),
            selectedItem: selectedItem,
            items: items,
            title: title
        };

        dropDownComponent = React.createElement(DropDown, dropDownProps, null);
        dropDownComponentDOM = testUtils.renderIntoDocument(dropDownComponent);
    }

});