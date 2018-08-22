import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require('../../../src/components/utility/enums');
var localJson = require('../../../content/resources/rm-en.json');
import dispatcher = require('../../../src/app/dispatcher');
import localAction = require('../../../src/actions/locale/localeaction');
import MultiQigLockPopup = require('../../../src/components/teammanagement/multiqiglockpopup')
import Immutable = require('immutable');
import getTeamOverviewDataAction = require('../../../src/actions/teammanagement/getteamoverviewdataaction');
import helpExaminersDataFetchAction = require('../../../src/actions/teammanagement/helpexaminersdatafetchaction');
import multiQigLockDataFetchAction = require('../../../src/actions/teammanagement/multiqiglockdatafetchaction');

describe("Multi Qig Lock Popup test", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let teamOverviewCountData = {
        "qigDetails": [
            {
                "exceptionCount": 0,
                "examinerLockCount": 0,
                "examinerStuckCount": 0,
                "qigId": 130,
                "qigName": "physiHP2ENGTZ2XXXXQ16",
                "approvalStatusId": 4
            },
            {
                "exceptionCount": 0,
                "examinerLockCount": 0,
                "examinerStuckCount": 0,
                "qigId": 131,
                "qigName": "physiHP2ENGTZ2XXXXQ17",
                "approvalStatusId": 4
            },
            {
                "exceptionCount": 0,
                "examinerLockCount": 0,
                "examinerStuckCount": 0,
                "qigId": 129,
                "qigName": "physiHP2ENGTZ2XXXXQ18",
                "approvalStatusId": 4
            }],
        "success": true,
        "errorMessage": null,
        "failureCode": 0
    };

    let helpExaminerData: Immutable.List<ExaminerDataForHelpExaminer> =
        [
            {
                "actions": [2, 13],
                "examinerId": 154,
                "examinerPriority": 8,
                "examinerRoleId": 373,
                "initials": "H",
                "surname": "Susan",
                "locked": true,
                "lockedByExaminerId": 160,
                "lockedByInitials": "N",
                "lockedBySurname": "Sherina",
                "lockTimeStamp": "2017-09-15T11:10:17.4Z",
                "workflowStateId": 8,
                "workflowStateTimeStamp": "2017-09 - 11T09: 16:02.393Z",
                "parentExaminerId": 160,
                "parentInitials": "N",
                "parentSurname": "Sherina",
                "roleId": 1,
                "autoSuspensionCount": 0,
                "activeQigCount": 2,
                "actionRequireQigCount": 1
            },
            {
                "actions": [2, 13],
                "examinerId": 154,
                "examinerPriority": 8,
                "examinerRoleId": 371,
                "initials": "N",
                "surname": "Mary",
                "locked": true,
                "lockedByExaminerId": 160,
                "lockedByInitials": "N",
                "lockedBySurname": "Sherina",
                "lockTimeStamp": "2017-09-15T09:02:20.527Z",
                "workflowStateId": 8,
                "workflowStateTimeStamp": "2017-09-15T09:00:26.05Z",
                "parentExaminerId": 160,
                "parentInitials": "N",
                "parentSurname": "Sherina",
                "roleId": 1, "autoSuspensionCount": 0,
                "activeQigCount": 2,
                "actionRequireQigCount": 2
            },
        ];

    let multiQigLockExaminer: Immutable.List<MultiQigLockExaminer> = [
        { "examinerRoleId": 371, "loggedInExaminerRoleId": 447, "markSchemeGroupId": 130 },
        { "examinerRoleId": 373, "loggedInExaminerRoleId": 449, "markSchemeGroupId": 131 }];

    dispatcher.dispatch(new getTeamOverviewDataAction(true, 130, 448, teamOverviewCountData,
        false, true));

    dispatcher.dispatch(new helpExaminersDataFetchAction(true, helpExaminerData,
        false));

    dispatcher.dispatch(new multiQigLockDataFetchAction(true,
        multiQigLockExaminer, 154, 129, 373));

    var multiQigLockPopupProps = {
        selectedLanguage: 'en-GB', id: 'multiQigLockPopup', key: 'multiQigLockPopup_key'
    };

    let multiQigLockPopup = React.createElement(MultiQigLockPopup, multiQigLockPopupProps, null);
    let multiQigLockPopupDOM = TestUtils.renderIntoDocument(multiQigLockPopup);

    /** To check if the MultiQigLockPopup component has been rendered or not **/
    it("checks if the MultiQigLockPopup component has been rendered", () => {
        expect(multiQigLockPopupDOM).not.toBeNull();
    });

    /** To check if the MultiQigLockPopup component rendered with correct no of qigs **/
    it("checks if the MultiQigLockPopup component rendered with correct no of qigs", () => {
        let noOfRows = TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'text-middle checkbox').length;        
        expect(noOfRows).toBe(4);
    });

    /** To check if the MultiQigLockPopup component rendered with proper header data **/
    it("checks if the MultiQigLockPopup component rendered with proper header data", () => {
        let textContentForHeader = TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'popup-header')[0];
        expect(textContentForHeader.textContent).toBe('Lock other QIGs');
    });

    /** To check if the MultiQigLockPopup component rendered with proper data **/
    it("checks if the MultiQigLockPopup component rendered with proper data", () => {
        expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'text-middle')[3].textContent).toBe('physiHP2ENGTZ2XXXXQ16');
        expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'text-middle')[5].textContent).toBe('physiHP2ENGTZ2XXXXQ17');
    });

    /** To check if the MultiQigLockPopup component rendered with proper buttons **/
    it("checks if the MultiQigLockPopup component rendered with proper buttons", () => {
        expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'button rounded close-button')[0].textContent).toBe('Cancel');
        expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'button primary rounded')[0].textContent).toBe('Lock');
    });

    /** To check if the MultiQigLockPopup component rendered with select all checkbox **/
    it("checks if the MultiQigLockPopup component rendered with select all checkbox", () => {
        expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockPopupDOM, 'text-middle')[7].textContent).toBe('Select all');
    });
});
