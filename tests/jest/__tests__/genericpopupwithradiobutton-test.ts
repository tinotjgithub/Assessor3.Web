import React = require('react');
import testUtils = require('react-dom/test-utils');
import GenericPopupWithRadioButton = require('../../../src/components/utility/genericpopupwithradiobuttons');
import dispatcher = require("../../../src/app/dispatcher");
import enums = require('../../../src/components/utility/enums');
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");
var findDOMNode = require('react-dom').findDOMNode;

describe("generic popup with radio button test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var items = null;
    function sampleFunction() {
        return null;
    }
    it("checks if component is rendered", () => {
        var component = <div><GenericPopupWithRadioButton
                        className='supervisor-select-options'
        items = { items }
        selectedLanguage = { 'en-GB' }/></div>;

        var componentDOM = testUtils.renderIntoDocument(component);
        // to check component has been rendered
        expect(componentDOM).not.toBeNull();
    });

    it("checks if component has correct items", () => {
        items = [{
            name: 'firstitem',
            id: 10,
            isChecked: true,
            sequenceNo: 1
        }, {
                name: 'seconditem',
                id: 11,
                isChecked: false,
                sequenceNo: 2
            }];
        var component = <div><GenericPopupWithRadioButton key='key___'
        className = 'supervisor-select-options' onCheckedChange= { sampleFunction } items = { items } /></div>;

        var componentDOM = testUtils.renderIntoDocument(component);

        var firstitemid = findDOMNode(componentDOM).children[0].children[0].children[0].id;
        var firstitemname = findDOMNode(componentDOM).children[0].children[0].textContent;
        var isfirstItemchecked = findDOMNode(componentDOM).children[0].children[0].children[0].checked;

        var seconditemid = findDOMNode(componentDOM).children[0].children[1].children[0].id;
        var seconditemname = findDOMNode(componentDOM).children[0].children[1].textContent;
        var issecondItemchecked = findDOMNode(componentDOM).children[0].children[1].children[0].checked;

        expect(firstitemid).toBe('10');
        expect(firstitemname).toBe('firstitem');
        expect(isfirstItemchecked).toBe(true);
        expect(seconditemid).toBe('11');
        expect(seconditemname).toBe('seconditem');
        expect(issecondItemchecked).toBe(false);

    });

});