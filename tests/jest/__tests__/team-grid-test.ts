jest.dontMock("../../../src/components/utility/grid/gridcontrol");
jest.dontMock("../../../src/components/teammanagement/teammanagementtablewrapper");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import GridControl = require("../../../src/components/utility/grid/gridcontrol");
import Immutable = require("immutable");
var localJson = require("../../../content/resources/rm-en.json");
const List = require("../../../src/components/utility/grid/gridcontrol").default;
import enums = require("../../../src/components/utility/enums");
import examinerViewDataHelper = require("../../../src/utility/teammanagement/helpers/examinerviewdatahelper");
import myTeamHelper = require("../../../src/components/utility/grid/teammanagementhelpers/myteamhelper");
import examinerData = require("../../../src/stores/teammanagement/typings/examinerdata");
import ExaminerViewDataItem = require("../../../src/stores/teammanagement/typings/examinerviewdataitem");
import teamManagementHelperBase = require("../../../src/components/utility/grid/teammanagementhelpers/teammanagementhelperbase");
import teamManagementHelper = require("../../../src/utility/teammanagement/teammanagementhelper");
import TeamManagementTableWrapper = require('../../../src/components/teammanagement/teammanagementtablewrapper');
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import dispatcher = require("../../../src/app/dispatcher");

describe("Test suite for Team Management Grid", function () {

    let myTeamData: Immutable.List<ExaminerViewDataItem>;
    let examinerdata: ExaminerData;
    let teamManagementListCollection: Immutable.List<gridRow>;

    let _gridRows = null;
    let _gridColumnHeaderRows = null;
    let _gridFrozenBodyRows = null;
    let _gridFrozenHeaderRows = null;


    var propsCols = {};

    var getId = function () {
        return 'id';
    };

    var loadData = (teamManagementTab: enums.TeamManagement) => {

        switch (teamManagementTab) {
            case enums.TeamManagement.MyTeam:
                myTeamData = myTeamData;
                break;
        }

        let helper: myTeamHelper = new myTeamHelper();
        _gridRows = helper.generateRowDefinion(myTeamData, teamManagementTab);
        _gridColumnHeaderRows = helper.generateTableHeader(teamManagementTab, null, null);
        _gridFrozenBodyRows = helper.generateFrozenRowBody(myTeamData, teamManagementTab);
        _gridFrozenHeaderRows = helper.generateFrozenRowHeader(teamManagementTab, '', enums.SortDirection.Descending);

        propsCols = {
            gridRows: _gridRows,
            selectedLanguage: "en-GB",
            columnHeaderRows: _gridColumnHeaderRows,
            frozenHeaderRows: _gridFrozenHeaderRows,
            frozenBodyRows: _gridFrozenBodyRows,
            getGridControlId: getId,
            id: 'DetailedView1',
            key: 'DetailedViewKey1'
        };
    };

    beforeEach(() => {

    let examinerInfo = [{
        "examinerId": 10,
        "examinerLevel": 1,
        "examinerRoleId": 4345,
        "parentExaminerRoleId": 4344,
        "surname": "Ancy",
        "initials": "A",
        "examinerProgress": 0,
        "examinerTarget": 20,
        "markingTargetName": "LIVE MARKING TARGET",
        "roleName": "Team Leader (Examiner)",
        "examinerState": "Approved",
        "suspendedCount": 0,
        "subordinates": [
           {
                    "examinerId": 8,
                    "examinerLevel": 1,
                    "examinerRoleId": 4343,
                    "parentExaminerRoleId": 4345,
                    "surname": "Seena",
                    "initials": "N",
                    "examinerProgress": 0,
                    "examinerTarget": 20,
                    "markingTargetName": "LIVE MARKING TARGET",
                    "roleName": "Assistant Examiner",
                    "subordinates": [],
                    "examinerState": "Approved",
                    "suspendedCount": 0,
                    "lockedDate": "02/02/2016",
                    "lockedByExaminerID": 9,
                    "lockedByExaminerInitials": "B",
                    "lockedByExaminerSurname": "George"                    
            }
            ]
    },
        {
            "examinerId": 11,
            "examinerLevel": 1,
            "examinerRoleId": 4345,
            "parentExaminerRoleId": 4344,
            "surname": "Ancy",
            "initials": "A",
            "examinerProgress": 0,
            "examinerTarget": 20,
            "markingTargetName": "LIVE MARKING TARGET",
            "roleName": "Team Leader (Examiner)",
            "examinerState": "Approved",
            "suspendedCount": 0,
            "subordinates": [
                {
                    "examinerId": 8,
                    "examinerLevel": 1,
                    "examinerRoleId": 4343,
                    "parentExaminerRoleId": 4345,
                    "surname": "Seena",
                    "initials": "N",
                    "examinerProgress": 0,
                    "examinerTarget": 20,
                    "markingTargetName": "LIVE MARKING TARGET",
                    "roleName": "Assistant Examiner",
                    "subordinates": [],
                    "examinerState": "Approved",
                    "suspendedCount": 0,
                    "lockedDate": "02/02/2016",
                    "lockedByExaminerID": 9,
                    "lockedByExaminerInitials": "B",
                    "lockedByExaminerSurname": "George"
                }
            ]
        }]

    examinerdata = JSON.parse(JSON.stringify(examinerInfo));
    let examinerviewdatahelper = new examinerViewDataHelper();
    let comparerName = 'examinerDataComparer';
    let sortDirection: enums.SortDirection = enums.SortDirection.Ascending;
    myTeamData = examinerviewdatahelper.getExaminerTreeViewData(examinerdata, comparerName, sortDirection);
    let teamManagement: teamManagementHelper;
    let myteamhelper: myTeamHelper = new myTeamHelper();
    teamManagementListCollection  =
        myteamhelper.generateRowDefinion(myTeamData, enums.TeamManagement.MyTeam);
    });

    /* will check the count of examiners in the grid*/
    it(' will check the count of examiners in the grid', () => {
        loadData(enums.TeamManagement.MyTeam);
        var props = { gridRows: teamManagementListCollection, selectedLanguage: "en-GB", gridStyle: "", onClickCallBack: null};
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(2);
    });

    /* will check the count of team grid columns in detail view  */
    it('will check the count of team grid columns in detail view', () => {
        loadData(enums.TeamManagement.MyTeam);
        var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutputColumns).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-wrap");
        expect(firstColumn.length).toBe(1);
        var tr = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-holder")[0].children[0];
        expect(tr.children.length).toBe(2);
    });


    /* 'will check whether team grid contain examiner column */
    it('will check whether team grid contain examiner column', () => {
        loadData(enums.TeamManagement.MyTeam);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-examiner header-col")[0];
        expect(firstColumn.className).toBe('col-examiner header-col');
        var firstColumnValue = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "examiner-name")[0];
        expect(firstColumnValue.textContent).toBe(' A Ancy ');
    });


    /* will check whether live open grid contain MarkingProgress Column */
    it('will check whether team grid contain target progress column', () => {
        loadData(enums.TeamManagement.MyTeam);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[2];
        expect(column.className).toBe('col-target-prog');
    });

    /* will check whether live open grid contain Examiner State Column */
    it('will check whether team grid contain examiner state column', () => {
        loadData(enums.TeamManagement.MyTeam);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[0];
        expect(column.className).toBe('col-state');
    });

    /* will check whether team management grid contain Locked By */
    it('will check whether team grid contain examiner locked By and Locked Duration columns rendered', () => {

        let ccData = {
            "configurableCharacteristics": [{
                "ccName": "SeniorExaminerPool",
                "ccValue": "true",
                "valueType": 1,
                "markSchemeGroupID": 0,
                "questionPaperID": 0,
                "examSessionID": 0
            }],
            "success": true,
            "errorMessage": null
        };

        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, 0, ccData));

        loadData(enums.TeamManagement.MyTeam);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[3];
        expect(column.className).toBe('col-lock-dur');

        var column = firstColumn[0].children[0].children[1].children[0].children[4];
        expect(column.className).toBe('col-locked-by');
    });

    /* will check whether team management grid contain Locked By */
    it('will check whether team grid contain examiner locked By and Locked Duration columns are not rendered', () => {

        let ccData = {
            "configurableCharacteristics": [{
                "ccName": "SeniorExaminerPool",
                "ccValue": "false",
                "valueType": 1,
                "markSchemeGroupID": 0,
                "questionPaperID": 0,
                "examSessionID": 0
            }],
            "success": true,
            "errorMessage": null
        };

        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));

        loadData(enums.TeamManagement.MyTeam);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[1];
        expect(column.className).not.toBe('col-lock-dur');

        var column = firstColumn[0].children[0].children[1].children[0].children[1];
        expect(column.className).not.toBe('col-locked-by');
    });

    /* will check whether team management grid contain Response To Review */
    it('will check whether Response To Review column is rendered in team management grid', () => {

        let ccData = {
            "configurableCharacteristics": [{
                "ccName": "SeniorExaminerPool",
                "ccValue": "false",
                "valueType": 1,
                "markSchemeGroupID": 0,
                "questionPaperID": 0,
                "examSessionID": 0
            }],
            "success": true,
            "errorMessage": null
        };

        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));

        loadData(enums.TeamManagement.MyTeam);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[3];
        expect(column.className).toBe('col-resp-to-review');
    });

});