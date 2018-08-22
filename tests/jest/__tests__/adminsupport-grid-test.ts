jest.dontMock("../../../src/components/utility/grid/gridcontrol");
jest.dontMock("../../../src/components/adminsupport/adminsupporttablewrapper");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import GridControl = require("../../../src/components/utility/grid/gridcontrol");
import Immutable = require("immutable");
var localJson = require("../../../content/resources/rm-en.json");
const List = require("../../../src/components/utility/grid/gridcontrol").default;
import enums = require("../../../src/components/utility/enums");
import supportAdminExaminerList = require('../../../src/stores/adminsupport/typings/supportadminexaminerlist');
import adminSupportHelper = require('../../../src/components/utility/grid/adminsupporthelpers/adminsupporthelperbase');
import adminSupportTableWrapper = require('../../../src/components/adminsupport/adminsupporttablewrapper');

describe("Test suite for Admin Support Examiner Grid", function () {

	let supportAdminExaminerList: supportAdminExaminerList;
	let examinersListCollection: Immutable.List<gridRow>;

	let examinersList = {
		"getSupportExaminerList": [
			{
				"examinerId": 9,
				"surname": "Hunt",
				"initials": "Q",
				"employeeNum": "6",
				"liveUserName": "Q Hunt"
			},
			{
				"examinerId": 5,
				"surname": "Hunt",
				"initials": "Q",
				"employeeNum": "6",
				"liveUserName": "Q Hunt"
			}]
	};
	let _gridRows = null;
	let _gridColumnHeaderRows = null;


	var propsCols = {};

	var getId = function () {
		return 'id';
	};

	supportAdminExaminerList = JSON.parse(JSON.stringify(examinersList));
	supportAdminExaminerList.getSupportExaminerList = Immutable.List(supportAdminExaminerList.getSupportExaminerList);


	var loadData = () => {
		let helper: adminSupportHelper = new adminSupportHelper();
		_gridRows = helper.generateExaminersRowDefinition(supportAdminExaminerList);
		_gridColumnHeaderRows = helper.generateTableHeader(null, null);

		propsCols = {
			gridRows: _gridRows,
			selectedLanguage: "en-GB",
			columnHeaderRows: _gridColumnHeaderRows,
			getGridControlId: getId,
			id: 'DetailedView1',
			key: 'DetailedViewKey1'
		};
	};
	let helper: adminSupportHelper = new adminSupportHelper();
		examinersListCollection =
			helper.generateExaminersRowDefinition(supportAdminExaminerList);


	/* will check the count of examiners in the grid*/
	it(' will check the count of examiners in the grid', () => {
		loadData();
		var props = { gridRows: examinersListCollection, selectedLanguage: "en-GB", gridStyle: "", onClickCallBack: null };
		var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
		expect(renderedOutputRows).not.toBe(null);
		var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
		expect(totalRows.length).toBe(2);
	});

	/* will check the count of examiners grid columns in detail view  */
	it('will check the count of examiners grid columns in detail view', () => {
	loadData();
	var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(adminSupportTableWrapper, propsCols));
	expect(renderedOutputColumns).not.toBe(null);
	var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-wrap");
	expect(firstColumn.length).toBe(1);
	var tr = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-holder")[0].children[0];
	expect(tr.children.length).toBe(2);
	});

	/* 'will check whether admin support grid contain examiner column */
	it('will check whether admin support grid contain examiner column', () => {
		loadData();
		var renderedOutput = TestUtils.renderIntoDocument(React.createElement(adminSupportTableWrapper, propsCols));
		expect(renderedOutput).not.toBe(null);
		var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-centre header-col")[0];
		expect(firstColumn.className).toBe('col-centre header-col');
	});

	/* will check whether admin support grid contain username column */
	it('will check whether admin support grid contain username column', () => {
	loadData();
	var renderedOutput = TestUtils.renderIntoDocument(React.createElement(adminSupportTableWrapper, propsCols));
	expect(renderedOutput).not.toBe(null);
	var usernameColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-username")[0];
	expect(usernameColumn.className).toBe('col-username');
	});

	/* will check whether admin support grid contain examiner code column */
	it('will check whether admin support grid contain examiner code column', () => {
	loadData();
	var renderedOutput = TestUtils.renderIntoDocument(React.createElement(adminSupportTableWrapper, propsCols));
	expect(renderedOutput).not.toBe(null);
	var examinerCodeColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col-examiner-code")[0];
	expect(examinerCodeColumn.className).toBe('col-examiner-code');
	});

});