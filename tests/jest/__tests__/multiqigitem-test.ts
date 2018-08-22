import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require('../../../src/components/utility/enums');
var localJson = require('../../../content/resources/rm-en.json');
import MultiQigItem = require('../../../src/components/teammanagement/multiqigitem');
import qigDetails = require('../../../src/dataservices/teammanagement/typings/qigdetails');

describe("Multi qig item test", function () {

    let _multiQigData: qigDetails = {
        'qigId': 1,
        'qigName': 'XYZ',
        'exceptionCount': 3,
        'examinerLockCount': 5,
        'examinerStuckCount': 7
    };

    let multiQigData: qigDetails =
        JSON.parse(
            JSON.stringify(_multiQigData)) as qigDetails;

    var multiQigItemProps = {
        multiQigData: _multiQigData, id: 'multi_Qig_Item1', key: 'multi-Qig_Item_key_1'
    };

    let multiQigItem = MultiQigItem(multiQigItemProps);
    let multiQigItemDOM = TestUtils.renderIntoDocument(multiQigItem);

    /** To check if the MultiQigItem component has been rendered or not **/
    it("checks if the MultiQigItem component has been rendered", () => {
        expect(multiQigItemDOM).not.toBeNull();
    });

    /** To check if the MultiQigItem component rendered with proper data **/
    it("checks if the MultiQigItem component rendered with proper data", () => {
        expect(multiQigItemDOM.children[0].textContent).toBe('XYZ');
        expect(multiQigItemDOM.children[1].textContent).toBe('5');
        expect(multiQigItemDOM.children[2].textContent).toBe('7');
    });
});
