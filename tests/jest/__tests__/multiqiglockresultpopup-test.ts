import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require('../../../src/components/utility/enums');
var localJson = require('../../../content/resources/rm-en.json');
import dispatcher = require('../../../src/app/dispatcher');
import localAction = require('../../../src/actions/locale/localeaction');
import MultiQigLockResultPopup = require('../../../src/components/teammanagement/multiqiglockresultpopup')
import Immutable = require('immutable');
import getTeamOverviewDataAction = require('../../../src/actions/teammanagement/getteamoverviewdataaction');
import helpExaminersDataFetchAction = require('../../../src/actions/teammanagement/helpexaminersdatafetchaction');
import multiQigLockDataResultAction = require('../../../src/actions/teammanagement/multiqiglockresultaction');

describe("Multi Qig Lock Result Popup test", function () {

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

        let dataCollection: Array<MultiLockResult> = new Array<MultiLockResult>();
        dataCollection.push({ "examinerRoleId": 373, "failureCode": 1, "markSchemeGroupId": 131 });
        dataCollection.push({ "examinerRoleId": 371, "failureCode": 1, "markSchemeGroupId": 130 });
        dataCollection.push({"examinerRoleId": 373, "failureCode": 0, "markSchemeGroupId": 129});
        let multiLockResult = Immutable.List<MultiLockResult>(dataCollection);

        dispatcher.dispatch(new getTeamOverviewDataAction(true, 130, 448, teamOverviewCountData,
            false, true));

        dispatcher.dispatch(new helpExaminersDataFetchAction(true, helpExaminerData,
            false));

        dispatcher.dispatch(new multiQigLockDataResultAction(multiLockResult));

        var multiQigLockResultPopupProps = {
            selectedLanguage: 'en-GB', id: 'multiQigLockResultPopup', key: 'multiQigLockResultPopup_key'
        };

        let multiQigLockResultPopup = React.createElement(MultiQigLockResultPopup, multiQigLockResultPopupProps, null);
        let multiQigLockResultPopupDOM = TestUtils.renderIntoDocument(multiQigLockResultPopup);

        /** To check if the MultiQigLockResultPopup component has been rendered or not **/
        it("checks if the MultiQigLockResultPopup component has been rendered", () => {
            expect(multiQigLockResultPopupDOM).not.toBeNull();
        });

        /** To check if the MultiQigLockResultPopup component rendered with correct no of qigs **/
        it("checks if the MultiQigLockResultPopup component rendered with correct no of qigs", () => {
            let noOfRows = TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockResultPopupDOM, 'text-middle').length;        
            expect(noOfRows).toBe(3);
        });

        /** To check if the MultiQigLockResultPopup component rendered with proper header data **/
        it("checks if the MultiQigLockResultPopup component rendered with proper header data", () => {
            let textContentForHeader = TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockResultPopupDOM, 'popup-header')[0];
            expect(textContentForHeader.textContent).toBe('Lock Status Changed');
        });

        /** To check if the MultiQigLockResultPopup component rendered with proper data **/
        it("checks if the MultiQigLockResultPopup component rendered with proper data", () => {
            let textContentForDataSection = TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockResultPopupDOM, 'popup-content')[0];
            expect(textContentForDataSection.children[0].children[0].textContent).toBe('You have successfully locked the examiner in the following QIGs:');
            expect(textContentForDataSection.children[0].children[1].textContent).toBe('physiHP2ENGTZ2XXXXQ17');
            expect(textContentForDataSection.children[0].children[2].textContent).toBe('physiHP2ENGTZ2XXXXQ16');
            expect(textContentForDataSection.children[1].children[0].textContent).toBe('It was not possible to lock the examiner in the following QIGs:');
            expect(textContentForDataSection.children[1].children[1].textContent).toBe('physiHP2ENGTZ2XXXXQ18');    
        });

        /** To check if the MultiQigLockResultPopup component rendered with proper buttons **/
        it("checks if the MultiQigLockResultPopup component rendered with proper buttons", () => {
            expect(TestUtils.scryRenderedDOMComponentsWithClass(multiQigLockResultPopupDOM, 'button primary rounded')[0].textContent).toBe('OK');
        });

});
