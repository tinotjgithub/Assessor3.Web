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
import unActionedExceptionDetails = require('../../../src/stores/teammanagement/typings/unactionedexceptiondetails');
import teamExceptionHelper = require('../../../src/components/utility/grid/teammanagementhelpers/teamexceptionhelper');
import TeamManagementTableWrapper = require('../../../src/components/teammanagement/teammanagementtablewrapper');

describe("Test suite for Exceptions Grid", function () {

    let exceptionData: Immutable.List<unActionedExceptionDetails>;
    let teamManagementListCollection: Immutable.List<gridRow>;

    let _gridRows = null;
    let _gridColumnHeaderRows = null;
    let _gridFrozenBodyRows = null;
    let _gridFrozenHeaderRows = null;


    var propsCols = {};

    var getId = function () {
        return 'id';
    };

    let exceptionList: Immutable.List<unActionedExceptionDetails> = Immutable.List<unActionedExceptionDetails>([{
        "exceptionId": 9,
        "markSchemeGroupId": 6,
        "originatorExaminerId": 28,
        "exceptionType": 3,
        "timeOpen": 162,
        "markGroupId": 119,
        "surname": "Hunt",
        "initials": "Q"
    },
    {
        "exceptionId": 4,
        "markSchemeGroupId": 6,
        "originatorExaminerId": 28,
        "exceptionType": 8,
        "timeOpen": 1482,
        "markGroupId": 115,
        "surname": "Hunt",
        "initials": "Q"
        }]);

    var loadData = (teamManagementTab: enums.TeamManagement) => {


        switch (teamManagementTab) {
            case enums.TeamManagement.Exceptions:
                exceptionData = exceptionList;
                break;
        }

        let helper: teamExceptionHelper = new teamExceptionHelper();
        _gridRows = helper.generateRowDefinion(exceptionData, teamManagementTab);
        _gridColumnHeaderRows = helper.generateTableHeader(teamManagementTab, null, null);
        _gridFrozenBodyRows = helper.generateFrozenRowBody(exceptionData, teamManagementTab);
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

    let helper: teamExceptionHelper = new teamExceptionHelper();
    teamManagementListCollection =
        helper.generateRowDefinion(exceptionList, enums.TeamManagement.Exceptions);


    /* will check the count of exceptions in the grid*/
    it(' will check the count of exceptions in the grid', () => {
        loadData(enums.TeamManagement.Exceptions);
        var props = { gridRows: teamManagementListCollection, selectedLanguage: "en-GB", gridStyle: "", onClickCallBack: null };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(2);
    });

    /* will check the count of exceptions grid columns in detail view  */
    it('will check the count of exceptions grid columns in detail view', () => {
        loadData(enums.TeamManagement.Exceptions);
        var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutputColumns).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-wrap");
        expect(firstColumn.length).toBe(1);
        var tr = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-holder")[0].children[0];
        expect(tr.children.length).toBe(2);
    });

    /* 'will check whether exceptions grid contain exception id column */
    it('will check whether exceptions grid contain exception id column', () => {
        loadData(enums.TeamManagement.Exceptions);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-exception-id header-col")[0];
        expect(firstColumn.className).toBe('col-exception-id header-col');
    });

    /* will check whether exceptions grid contain examiner column */
    it('will check whether exceptions grid contain examiner column', () => {
        loadData(enums.TeamManagement.Exceptions);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var examinerNameColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-examiner")[0];
        expect(examinerNameColumn.className).toBe('col-examiner');
    });

    /* will check whether exceptions grid contain exception type column */
    it('will check whether exceptions grid contain exception type column', () => {
        loadData(enums.TeamManagement.Exceptions);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var exceptionTypeColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-exception-type")[0];
        expect(exceptionTypeColumn.className).toBe('col-exception-type');
    });

    /* will check whether exceptions grid contain time open column */
    it('will check whether exceptions grid contain time open column', () => {
        loadData(enums.TeamManagement.Exceptions);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(TeamManagementTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var timeOpenColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-time-open")[0];
        expect(timeOpenColumn.className).toBe('col-time-open');
    });

});