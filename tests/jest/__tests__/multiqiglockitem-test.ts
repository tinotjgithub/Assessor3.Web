import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
var localJson = require('../../../content/resources/rm-en.json');
import dispatcher = require('../../../src/app/dispatcher');
import localAction = require('../../../src/actions/locale/localeaction');
import MultiQigLockitem = require('../../../src/components/teammanagement/multiqiglockitem')
import Immutable = require('immutable');

describe("Multi qig dropdown test", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let multiQigLockExaminer: MultiQigLockExaminer = {
        "examinerRoleId": 371,
        "loggedInExaminerRoleId": 447,
        "markSchemeGroupId": 130,
        "qigName": "physiHP2ENGTZ2XXXXQ17"
    };

    var multiQigLockItemProps = {
        selectedLanguage: 'en-GB', id: 'multiQigLockItem', key: 'multiQigLockItem_key', multiQigLockData: multiQigLockExaminer
    };

    let multiQigLockItem = React.createElement(MultiQigLockitem, multiQigLockItemProps, null);
    let multiQigLockItemDOM = TestUtils.renderIntoDocument(multiQigLockItem);

    /** To check if the MultiQigLockItem component has been rendered or not **/
    it("checks if the MultiQigLockPopup component has been rendered", () => {
        expect(multiQigLockItemDOM).not.toBeNull();
    });

    /** To check if the MultiQigLockItem component rendered with correct no of qigs **/
    it("checks if the MultiQigLockItem component rendered with correct no of qigs", () => {
        let noOfRows = TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockItemDOM, 'text-middle checkbox').length;        
        expect(noOfRows).toBe(1);
    });

    /** To check if the MultiQigLockItem component rendered with proper data **/
    it("checks if the MultiQigLockItem component rendered with proper data", () => {
        expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockItemDOM, 'text-middle')[1].textContent).toBe('physiHP2ENGTZ2XXXXQ17');
    });
});
