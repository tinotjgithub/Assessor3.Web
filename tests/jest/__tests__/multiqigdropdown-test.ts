import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require('../../../src/components/utility/enums');
var localJson = require('../../../content/resources/rm-en.json');
import dispatcher = require('../../../src/app/dispatcher');
import localAction = require('../../../src/actions/locale/localeaction');
import MultiQigDropDown = require('../../../src/components/teammanagement/multiqigdropdown');
import Immutable = require('immutable');
import qigDetails = require('../../../src/dataservices/teammanagement/typings/qigdetails');

describe("Multi qig dropdown test", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let _multiQigData =
        [
            {
                'qigId': 1,
                'qigName': 'XYZ',
                'exceptionCount': 3,
                'examinerLockCount': 5,
                'examinerStuckCount': 7
            },
            {
                'qigId': 2,
                'qigName': 'ABC',
                'exceptionCount': 2,
                'examinerLockCount': 4,
                'examinerStuckCount': 6
            }
        ];

    let multiQigData: Immutable.List<qigDetails> = Immutable.List(
        JSON.parse(
            JSON.stringify(_multiQigData)) as Immutable.List<qigDetails>);

    var multiQigDropDownProps = {
        multiQigItemList: multiQigData, selectedLanguage: 'en-GB', id: 'multiQigDropDown', key: 'multiQigDropDown_key'
    };
    var multiQigDropDown = React.createElement(MultiQigDropDown, multiQigDropDownProps, null);
    let multiQigDropDownDOM = TestUtils.renderIntoDocument(multiQigDropDown);

    /** To check if the MultiQigDropDown component has been rendered or not **/
    it("checks if the MultiQigDropDown component has been rendered", () => {
        expect(multiQigDropDownDOM).not.toBeNull();
    });

    /** To check if the MultiQigDropDown component rendered with correct no of rows **/
    it("checks if the MultiQigDropDown component rendered with correct no of rows including header", () => {
        let noOfRows = TestUtils.scryRenderedDOMComponentsWithClass(multiQigDropDownDOM, 'row').length;        
        expect(noOfRows).toBe(3); // no of rows including header
    });

    /** To check if the MultiQigDropDown component rendered with proper header data **/
    it("checks if the MultiQigDropDown component rendered with proper header data", () => {
        let textContentForHeader = TestUtils.scryRenderedDOMComponentsWithClass(multiQigDropDownDOM, 'row')[0];
        expect(textContentForHeader.children[0].textContent).toBe('QIGs');
        expect(textContentForHeader.children[1].textContent).toBe('Examiners locked');
        expect(textContentForHeader.children[2].textContent).toBe('Examiners stuck');
    });

    /** To check if the MultiQigDropDown component rendered with proper data **/
    it("checks if the MultiQigDropDown component rendered with proper data", () => {
        let textContentForTableData = TestUtils.scryRenderedDOMComponentsWithClass(multiQigDropDownDOM, 'row')[1];
        expect(textContentForTableData.children[0].textContent).toBe('XYZ');
        expect(textContentForTableData.children[1].textContent).toBe('5');
        expect(textContentForTableData.children[2].textContent).toBe('7');
        textContentForTableData = TestUtils.scryRenderedDOMComponentsWithClass(multiQigDropDownDOM, 'row')[2];
        expect(textContentForTableData.children[0].textContent).toBe('ABC');
        expect(textContentForTableData.children[1].textContent).toBe('4');
        expect(textContentForTableData.children[2].textContent).toBe('6');
    });
});
