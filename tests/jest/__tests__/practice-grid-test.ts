/// <reference path="../../../src/stores/worklist/typings/response.ts" />
/// <reference path="../../../src/stores/worklist/typings/responselist.ts" />
/// <reference path="../../../src/components/utility/grid/typings/row.ts" />

jest.dontMock("../../../src/components/utility/grid/gridcontrol");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import GridControl = require("../../../src/components/utility/grid/gridcontrol");
import practiceWorkListHelper = require("../../../src/components/utility/grid/worklisthelpers/practiceworklisthelper");
import workListHelperBase = require("../../../src/components/utility/grid/worklisthelpers/worklisthelperBase");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import localStore = require("../../../src/stores/localestore");
var localJson = require("../../../content/resources/rm-en.json");
const List = require("../../../src/components/utility/grid/gridcontrol").default;
import enums = require("../../../src/components/utility/enums");

describe("Test suite for Grid", function () {

    //var gridRowsPracticeOpenDetail: Immutable.List<Row>;
    //var gridRowsPracticeOpenTile: Immutable.List<Row>;
    //var gridRowsPracticeClosedDetail: Immutable.List<Row>;
    //var gridRowsPracticeClosedTile: Immutable.List<Row>;

    //var mockFn = {
    //    toLocaleDateString: jest.genMockFunction().mockImplementation(function (val: Date) {
    //        // do something stateful
    //        return val.toLocaleDateString();
    //    });
    //};

    //beforeEach(() => {
    //    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    //    var responsePracticeOpenData: WorklistBase;
    //    var responsePracticeClosedData: WorklistBase;

    //    /*Practice open response list object */
    //    var practiceOpenResponses = {
    //        "responses":
    //        [
    //            {
    //                "displayId": "6370108",
    //                "markingProgress": 2,
    //                "allocatedDate": "2016-01-18T11:44:59.61",
    //                "updatedDate": "2016-01-18T11:44:59.617",
    //                "hasAllPagesAnnotated": false,
    //                "totalMarkValue": 2,
    //            }

    //        ],
    //        "concurrentLimit": 5,
    //        "maximumMark": 50,
    //        "unallocatedResponsesCount": 18,
    //        "hasNumericMark": true,
    //        "success": true,
    //        "errorMessage": null
    //    };

    //    /*Practice closed response list object */
    //    var practiceClosedResponses = {
    //        "responses":
    //        [
    //            {
    //                "displayId": "6370109",
    //                "submittedDate": "2016-02-25T08:07:18.247",
    //                "hasAllPagesAnnotated": false,
    //                "totalMarkValue": 2,
    //                "hasMessages": false,
    //                "unreadMessagesCount": 0,
    //                "hasAdditionalObjects": true
    //            }

    //        ],
    //        "maximumMark": 50,
    //        "hasNumericMark": true,
    //        "success": true,
    //        "errorMessage": null
    //    };

    //    /* Creating immutable collection for practice open */
    //    var practiceOpenResponsesString = JSON.stringify(practiceOpenResponses);
    //    responsePracticeOpenData = JSON.parse(practiceOpenResponsesString);
    //    var immutableList = Immutable.List(responsePracticeOpenData.responses);
    //    responsePracticeOpenData.responses = immutableList;

    //    /* Creating immutable collection for practice closed */
    //    var practiceClosedResponsesString = JSON.stringify(practiceClosedResponses);
    //    responsePracticeClosedData = JSON.parse(practiceClosedResponsesString);
    //    var immutableList = Immutable.List(responsePracticeClosedData.responses);
    //    responsePracticeClosedData.responses = immutableList;

    //    let workListHelper: workListHelperBase = new practiceWorkListHelper();

    //    /* Generating row definition for practice open */
    //    gridRowsPracticeOpenDetail = workListHelper.generateRowDefinion(responsePracticeOpenData,
    //                                                                    enums.ResponseMode.open,
    //                                                                    enums.GridType.detailed);

    //    gridRowsPracticeOpenTile = workListHelper.generateRowDefinion(responsePracticeOpenData,
    //                                                                  enums.ResponseMode.open,
    //                                                                  enums.GridType.tiled);

    //    /* Generating row definition for Practice closed */
    //    gridRowsPracticeClosedDetail = workListHelper.generateRowDefinion(responsePracticeClosedData,
    //                                                                      enums.ResponseMode.closed,
    //                                                                      enums.GridType.detailed);
    //    gridRowsPracticeClosedTile = workListHelper.generateRowDefinion(responsePracticeClosedData,
    //                                                                    enums.ResponseMode.closed,
    //                                                                    enums.GridType.tiled);

    //});

    /* will check the count of practice open grid rows in detail view */
    it('will check the count of practice open grid rows in detail view', () => {
        //var props = { gridRows: gridRowsPracticeOpenDetail, selectedLanguage: "en-GB" };
        //var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        ////expect(renderedOutputRows).not.toBe(null);
        //var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        //expect(totalRows.length).toBe(1);
    });

    ///* will check the count of practice open grid columns in detail view  */
    //it('will check the count of practice open grid columns in detail view', () => {

    //    var propsCols = { gridRows: gridRowsPracticeOpenDetail, selectedLanguage: "en-GB" };
    //    var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(GridControl, propsCols));
    //    //expect(renderedOutputColumns).not.toBe(null);
    //    var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col left-col");
    //    //expect(firstColumn.length).toBe(1);
    //    var secondColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col centre-col");
    //    //expect(secondColumn.length).toBe(1);
    //});

    ///* will check the count of practice open grid tiles in tile view */
    //it('will check the count of practice open grid tiles in tile view', () => {
    //    var props = { gridRows: gridRowsPracticeOpenTile, selectedLanguage: "en-GB" };
    //    var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
    //    //expect(renderedOutputRows).not.toBe(null);
    //    var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
    //    //expect(totalRows.length).toBe(1);
    //});

    ///* will check whether practice open grid contain ResponseId Column */
    //it('will check whether practice open grid contain ResponseId Column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeOpenDetail }));
    //    var responseID = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "resp-id")[0];
    //    //expect(responseID).not.toBe(null);
    //    //expect(responseID).not.toBe(undefined);
    //});

    ///* will check whether practice open grid contain MarkingProgress Column */
    //it('will check whether practice open grid contain MarkingProgress Column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeOpenDetail }));
    //    ////expect(renderedOutput).not.toBe(null);
    //    var markingProgress = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-status text-center")[0];
    //    //expect(markingProgress).not.toBe(null);
    //    //expect(markingProgress).not.toBe(undefined);
    //});

    ///* will check whether practice open grid contain TotalMark Column */
    //it('will check whether practice open grid contain TotalMark Column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeOpenDetail }));
    //    var totalMark = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-mark text-center")[0];
    //    //expect(totalMark).not.toBe(null);
    //    //expect(totalMark).not.toBe(undefined);
    //});

    ///* will check whether live practice grid contain allocated date Column */
    //it('will check whether live open grid contain allocated date Column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeOpenDetail }));
    //    var allocatedDate = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-allocated-date")[0];
    //    //expect(allocatedDate).not.toBe(null);
    //    //expect(allocatedDate).not.toBe(undefined);
    //});

    /////** The closed worklist */

    ///* will check the count of practice closed grid rows in detail view */
    //it('will check the count of grid tiles in tile view', () => {
    //    var props = { gridRows: gridRowsPracticeClosedDetail, selectedLanguage: "en-GB" };
    //    var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
    //    //expect(renderedOutputRows).not.toBe(null);
    //    var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
    //    //expect(totalRows.length).toBe(1);
    //});

    ///* will check the count of practice closed grid columns in detail view  */
    //it('will check the count of practice closed grid columns in detail view', () => {

    //    var propsCols = { gridRows: gridRowsPracticeClosedDetail, selectedLanguage: "en-GB" };
    //    var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(GridControl, propsCols));
    //    //expect(renderedOutputColumns).not.toBe(null);
    //    var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col left-col");
    //    //expect(firstColumn.length).toBe(1);
    //    var secondColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col centre-col");
    //    //expect(secondColumn.length).toBe(1);
    //});


    ///* will check the count of practice closed grid tiles in tile view */
    //it('will check the count of grid tiles in tile view', () => {
    //    var props = { gridRows: gridRowsPracticeClosedTile, selectedLanguage: "en-GB" };
    //    var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
    //    //expect(renderedOutputRows).not.toBe(null);
    //    var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
    //    //expect(totalRows.length).toBe(1);
    //});

    ///* will check whether live closed grid contain ResponseId Column */
    //it('will check whether Practise closed grid contain ResponseId Column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeClosedDetail }));
    //    var responseID = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "resp-id")[0];
    //    //expect(responseID).not.toBe(null);
    //    //expect(responseID).not.toBe(undefined);
    //});

    ///* will check whether practice closed grid contain TotalMark Column */
    //it('will check whether practice closed grid contain TotalMark Column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeClosedDetail }));
    //    var totalMark = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-mark text-center")[0];
    //    //expect(totalMark).not.toBe(null);
    //    //expect(totalMark).not.toBe(undefined);
    //});

    ///* will check whether practice closed grid contain submitted date Column */
    //it('will check whether practice closed grid contain submitted date', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeClosedDetail }));
    //    //expect(ReactDOM.findDOMNode(renderedOutput).textContent).toContain(mockFn.toLocaleDateString(new Date("2016-02-25T08:07:18.247")));
    //});

    ///* will check whether practice closed grid contain slao Column */
    //it('will check whether practice closed grid contain slao column', () => {
    //    var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsPracticeClosedDetail }));
    //    var slao = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "slao")[0];
    //    //expect(slao).not.toBe(null);
    //    //expect(slao).not.toBe(undefined);
    //});
});