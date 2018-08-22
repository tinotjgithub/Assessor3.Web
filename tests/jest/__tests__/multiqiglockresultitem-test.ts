import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
var localJson = require('../../../content/resources/rm-en.json');
import dispatcher = require('../../../src/app/dispatcher');
import localAction = require('../../../src/actions/locale/localeaction');
import MultiQigLockResultItem = require('../../../src/components/teammanagement/multiqiglockresultitem')

describe("Multi qig lock result item test", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let multiQigLockItem: MultiLockResult = {
        'examinerRoleId': 373,
        'failureCode': 1,
        'markSchemeGroupId': 131,
        'qigName': 'physiHP2ENGTZ2XXXXQ17'
    };

    let multiQigData: MultiLockResult =
        JSON.parse(
            JSON.stringify(multiQigLockItem)) as MultiLockResult;

    var multiQigLockResultItemProps = {
        multiQigLockResult: multiQigData,
        id: 'multi-qig-lock-result-item',
        key: 'multi-qig-lock-result-item-key',
        className: 'padding-top-20'
    };

    let multiQigLockResultItem = MultiQigLockResultItem(multiQigLockResultItemProps);
    let multiQigItemDOM = TestUtils.renderIntoDocument(multiQigLockResultItem);

    /** To check if the MultiQigLockResultItem component has been rendered or not **/
    it("checks if the MultiQigLockResultItem component has been rendered", () => {
        expect(multiQigItemDOM).not.toBeNull();
    });

    /** To check if the MultiQigLockResultItem component rendered with proper data **/
    it("checks if the MultiQigLockResultItem component rendered with proper data", () => {
        expect(multiQigItemDOM.children[0].textContent).toBe('physiHP2ENGTZ2XXXXQ17');
    });

});
