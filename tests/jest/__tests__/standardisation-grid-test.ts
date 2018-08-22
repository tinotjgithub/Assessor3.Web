/// <reference path="../../../src/stores/worklist/typings/response.ts" />
/// <reference path="../../../src/stores/worklist/typings/responselist.ts" />
/// <reference path="../../../src/components/utility/grid/typings/row.ts" />

jest.dontMock("../../../src/components/utility/grid/gridcontrol");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import GridControl = require("../../../src/components/utility/grid/gridcontrol");
import standardisationWorkListHelper = require("../../../src/components/utility/grid/worklisthelpers/standardisationworklisthelper");
import workListHelperBase = require("../../../src/components/utility/grid/worklisthelpers/worklisthelperBase");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import localStore = require("../../../src/stores/localestore");
var localJson = require("../../../content/resources/rm-en.json");
const List = require("../../../src/components/utility/grid/gridcontrol").default;
import enums = require("../../../src/components/utility/enums");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");

describe("Test suite for Grid", function () {

    var gridRowsStandardisationOpenDetail: Immutable.List<Row>;
    var gridRowsStandardisationOpenTile: Immutable.List<Row>;
    var gridRowsStandardisationClosedDetail: Immutable.List<Row>;
    var gridRowsStandardisationClosedTile: Immutable.List<Row>;

    var mockFn = {
        toLocaleDateString: jest.genMockFunction().mockImplementation(function (val: Date) {
            // do something stateful
            return val.toLocaleDateString();
        });
    };

    beforeEach(() => {
        dispatcher.dispatch(new localAction(true, "en-GB", localJson));
        var responseStandardisationOpenData: WorklistBase;
        var responseStandardisationClosedData: WorklistBase;

        /*Standardisation open response list object */
        var standardisationOpenResponses = {
            "responses":
            [
                {
                    "displayId": "6370108",
                    "markingProgress": 2,
                    "allocatedDate": "2016-01-18T11:44:59.61",
                    "updatedDate": "2016-01-18T11:44:59.617",
                    "hasAllPagesAnnotated": false,
                    "totalMarkValue": 2,
                }

            ],
            "concurrentLimit": 5,
            "maximumMark": 50,
            "unallocatedResponsesCount": 18,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        /*Standardisation closed response list object */
        var standardisationClosedResponses = {
            "responses":
            [
                {
                    "displayId": "6370109",
                    "submittedDate": "2016-02-25T08:07:18.247",
                    "hasAllPagesAnnotated": false,
                    "totalMarkValue": 2,
                    "hasMessages": false,
                    "unreadMessagesCount": 0,
                    "hasAdditionalObjects": true
                }

            ],
            "maximumMark": 50,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        let overviewData: overviewData;

        let qigList = {
            "qigSummary": [
                {
                    "examinerRole": 1471,
                    "markSchemeGroupId": 186,
                    "markSchemeGroupName": "PHIL2 Whole Paper",
                    "questionPaperName": "AQAMATH",
                    "examinerApprovalStatus": 1,
                    "questionPaperPartId": 196,
                    "assessmentCode": "AQAM1",
                    "componentId": "AQAM1               ",
                    "sessionId": 7,
                    "sessionName": "2013 July (Non-live Pilot)",
                    "isESTDEnabled": true,
                    "standardisationSetupComplete": false,
                    "isESTeamMember": false,
                    "hasQualityFeedbackOutstanding": false,
                    "isOpenForMarking": true,
                    "hasSimulationMode": true,
                    "hasSTMSimulationMode": false,
                    "isMarkFromPaper": false,
                    "inSimulationMode": true,
                    "status": 10,
                    "currentMarkingTarget": {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    "markingTargets": [
                        {
                            "markingMode": 2,
                            "markingCompletionDate": "2013-09-13T23:59:00.59",
                            "maximumMarkingLimit": 1,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 3,
                            "markingCompletionDate": "2013-09-15T23:59:00.59",
                            "maximumMarkingLimit": 1,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 30,
                            "markingCompletionDate": "2013-09-20T18:14:03.52",
                            "maximumMarkingLimit": 100,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 90,
                            "markingCompletionDate": "1753-01-01T00:00:00",
                            "maximumMarkingLimit": 9999,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        }
                    ]
                },
                {
                    "examinerRole": 1481,
                    "markschemeGroupId": 189,
                    "markschemeGroupName": "PHIL2 Whole Paper",
                    "questionPaperName": "X An Introduction to Philosophy 2",
                    "examinerApprovalStatus": 1,
                    "questionPaperPartId": 200,
                    "assessmentCode": "PHIL2016E",
                    "componentId": "16E                 ",
                    "sessionId": 12,
                    "sessionName": "2013 July (Non-live Pilot)",
                    "isEStDEnabled": true,
                    "standardisationSetupComplete": false,
                    "isESteamMember": false,
                    "hasQualityFeedbackOutstanding": false,
                    "isOpenForMarking": true,
                    "hasSimulationMode": true,
                    "hasStMSimulationMode": false,
                    "isMarkFromPaper": false,
                    "inSimulationMode": true,
                    "status": 10,
                    "currentMarkingTarget": {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    "markingTargets": [
                        {
                            "markingMode": 2,
                            "markingCompletionDate": "2013-09-13T23:59:00.59",
                            "maximumMarkingLimit": 1,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 3,
                            "markingCompletionDate": "2013-09-15T23:59:00.59",
                            "maximumMarkingLimit": 1,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 30,
                            "markingCompletionDate": "2013-09-20T18:14:03.52",
                            "maximumMarkingLimit": 20,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 90,
                            "markingCompletionDate": "1753-01-01T00:00:00",
                            "maximumMarkingLimit": 9999,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        }
                    ]
                },
                {
                    "examinerRole": 1491,
                    "markschemeGroupId": 190,
                    "markschemeGroupName": "PHIL2 Whole Paper",
                    "questionPaperName": "X An Introduction to Philosophy 2",
                    "examinerApprovalStatus": 1,
                    "questionPaperPartId": 202,
                    "assessmentCode": "RE",
                    "componentId": "PH                  ",
                    "sessionId": 19,
                    "sessionName": "2013 July (Non-live Pilot)",
                    "isEStDEnabled": true,
                    "standardisationSetupComplete": false,
                    "isESteamMember": false,
                    "hasQualityFeedbackOutstanding": false,
                    "isOpenForMarking": true,
                    "hasSimulationMode": true,
                    "hasStMSimulationMode": false,
                    "isMarkFromPaper": false,
                    "inSimulationMode": true,
                    "status": 10,
                    "currentMarkingTarget": {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    },
                    "markingTargets": [
                        {
                            "markingMode": 2,
                            "markingCompletionDate": "2013-09-13T23:59:00.59",
                            "maximumMarkingLimit": 2,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 3,
                            "markingCompletionDate": "2013-09-15T23:59:00.59",
                            "maximumMarkingLimit": 3,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 30,
                            "markingCompletionDate": "2013-09-20T18:14:03.52",
                            "maximumMarkingLimit": 100,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 90,
                            "markingCompletionDate": "1753-01-01T00:00:00",
                            "maximumMarkingLimit": 9999,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 0
                        }
                    ]
                },
                {
                    "examinerRole": 1501,
                    "markSchemeGroupId": 191,
                    "markSchemeGroupName": "AQA UNSTRUCT Paper",
                    "questionPaperName": "X An Introduction to PhilosophySJ",
                    "examinerApprovalStatus": 1,
                    "questionPaperPartId": 203,
                    "assessmentCode": "AQA UNSTRUCT",
                    "componentId": "19                  ",
                    "sessionId": 13,
                    "sessionName": "MARCH2015",
                    "isESTDEnabled": true,
                    "standardisationSetupComplete": false,
                    "isESTeamMember": false,
                    "hasQualityFeedbackOutstanding": false,
                    "isOpenForMarking": true,
                    "hasSimulationMode": true,
                    "hasSTMSimulationMode": false,
                    "isMarkFromPaper": false,
                    "inSimulationMode": true,
                    "status": 10,
                    "currentMarkingTarget": {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    "markingTargets": [
                        {
                            "markingMode": 2,
                            "markingCompletionDate": "2013-09-13T23:59:00.59",
                            "maximumMarkingLimit": 2,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 3,
                            "markingCompletionDate": "2013-09-15T23:59:00.59",
                            "maximumMarkingLimit": 3,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 30,
                            "markingCompletionDate": "2013-09-20T18:14:03.52",
                            "maximumMarkingLimit": 100,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 90,
                            "markingCompletionDate": "1753-01-01T00:00:00",
                            "maximumMarkingLimit": 9999,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": true,
                            "markingProgress": 0
                        }
                    ]
                },
                {
                    "examinerRole": 1418,
                    "markSchemeGroupId": 176,
                    "markSchemeGroupName": "PHIL8 Whole Paper",
                    "questionPaperName": "X An Introduction to Philosophy 2",
                    "examinerApprovalStatus": 4,
                    "questionPaperPartId": 180,
                    "assessmentCode": "PHIL8",
                    "componentId": "02                  ",
                    "sessionId": 2,
                    "sessionName": "2013 July (Non-live Pilot)",
                    "isESTDEnabled": true,
                    "standardisationSetupComplete": true,
                    "isESTeamMember": true,
                    "hasQualityFeedbackOutstanding": false,
                    "isOpenForMarking": true,
                    "hasSimulationMode": true,
                    "hasSTMSimulationMode": false,
                    "isMarkFromPaper": false,
                    "inSimulationMode": false,
                    "status": 7,
                    "currentMarkingTarget": {
                        "markingMode": 30,
                        "markingCompletionDate": "2016-01-10T00:00:00",
                        "maximumMarkingLimit": 100,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 1,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": false,
                        "markingProgress": 0
                    },
                    "markingTargets": [
                        {
                            "markingMode": 4,
                            "markingCompletionDate": "2013-09-15T17:35:54.243",
                            "maximumMarkingLimit": 1,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 1,
                            "openResponsesCount": 0,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 100
                        },
                        {
                            "markingMode": 30,
                            "markingCompletionDate": "2016-01-10T00:00:00",
                            "maximumMarkingLimit": 100,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 1,
                            "targetComplete": false,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 0
                        },
                        {
                            "markingMode": 90,
                            "markingCompletionDate": "1753-01-01T00:00:00",
                            "maximumMarkingLimit": 9999,
                            "remarkRequestType": 0,
                            "submittedResponsesCount": 0,
                            "openResponsesCount": 0,
                            "targetComplete": true,
                            "areResponsesAvailableToBeDownloaded": false,
                            "markingProgress": 0
                        }
                    ]
                }
            ],
            "success": true,
            "errorMessage": null
        };

        overviewData = JSON.parse(JSON.stringify(qigList));
        overviewData.qigSummary = Immutable.List(overviewData.qigSummary);

        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, overviewData));

        /* Creating immutable collection for standardisation open */
        var standardisationOpenResponsesString = JSON.stringify(standardisationOpenResponses);
        responseStandardisationOpenData = JSON.parse(standardisationOpenResponsesString);
        var immutableList = Immutable.List(responseStandardisationOpenData.responses);
        responseStandardisationOpenData.responses = immutableList;

        /* Creating immutable collection for standardisation closed */
        var practiceClosedResponsesString = JSON.stringify(standardisationClosedResponses);
        responseStandardisationClosedData = JSON.parse(practiceClosedResponsesString);
        var immutableList = Immutable.List(responseStandardisationClosedData.responses);
        responseStandardisationClosedData.responses = immutableList;

        let workListHelper: workListHelperBase = new standardisationWorkListHelper();

        /* Generating row definition for standardisation open */
        gridRowsStandardisationOpenDetail = workListHelper.generateRowDefinion(responseStandardisationOpenData,
                                                                        enums.ResponseMode.open,
                                                                        enums.GridType.detailed);

        gridRowsStandardisationOpenTile = workListHelper.generateRowDefinion(responseStandardisationOpenData,
            enums.ResponseMode.open,
            enums.GridType.tiled);

        /* Generating row definition for standardisation closed */
        gridRowsStandardisationClosedDetail = workListHelper.generateRowDefinion(responseStandardisationClosedData,
            enums.ResponseMode.closed,
            enums.GridType.detailed);
        gridRowsStandardisationClosedTile = workListHelper.generateRowDefinion(responseStandardisationClosedData,
            enums.ResponseMode.closed,
            enums.GridType.tiled);

    });

    /* will check the count of standardisation open grid rows in detail view */
    it('will check the count of standardisation open grid rows in detail view', () => {
        var props = { gridRows: gridRowsStandardisationOpenDetail, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        //expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        //expect(totalRows.length).toBe(1);
    });

    /* will check the count of standardisation open grid columns in detail view  */
    it('will check the count of standardisation open grid columns in detail view', () => {

        var propsCols = { gridRows: gridRowsStandardisationOpenDetail, selectedLanguage: "en-GB" };
        var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(GridControl, propsCols));
        //expect(renderedOutputColumns).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col left-col");
        //expect(firstColumn.length).toBe(1);
        var secondColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col centre-col");
        //expect(secondColumn.length).toBe(1);
    });

    /* will check the count of standardisation open grid tiles in tile view */
    it('will check the count of practice open grid tiles in tile view', () => {
        var props = { gridRows: gridRowsStandardisationOpenTile, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        //expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        //expect(totalRows.length).toBe(1);
    });

    /* will check whether standardisation open grid contain ResponseId Column */
    it('will check whether Standardisation open grid contain ResponseId Column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationOpenDetail }));
        var responseID = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "resp-id")[0];
        //expect(responseID).not.toBe(null);
        //expect(responseID).not.toBe(undefined);
    });

    /* will check whether standardisation open grid contain MarkingProgress Column */
    it('will check whether standardisation open grid contain MarkingProgress Column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationOpenDetail }));
        var markingProgress = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-status text-center")[0];
        //expect(markingProgress).not.toBe(null);
        //expect(markingProgress).not.toBe(undefined);
    });

    /* will check whether standardisation open grid contain TotalMark Column */
    it('will check whether standardisation open grid contain TotalMark Column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationOpenDetail }));
        var totalMark = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-mark text-center")[0];
        //expect(totalMark).not.toBe(null);
        //expect(totalMark).not.toBe(undefined);
    });

    /* will check whether standardisation open grid contain allocated date Column */
    it('will check whether standardisation open grid contain allocated date Column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationOpenDetail }));
        var allocatedDate = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-allocated-date")[0];
        //expect(allocatedDate).not.toBe(null);
        //expect(allocatedDate).not.toBe(undefined);
    });

    ///** The closed worklist */

    /* will check the count of standardisation closed grid rows in detail view */
    it('will check the count of grid tiles in tile view', () => {
        var props = { gridRows: gridRowsStandardisationClosedDetail, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        //expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        //expect(totalRows.length).toBe(1);
    });

    ///* will check the count of practice closed grid columns in detail view  */
    it('will check the count of practice closed grid columns in detail view', () => {

        var propsCols = { gridRows: gridRowsStandardisationClosedDetail, selectedLanguage: "en-GB" };
        var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(GridControl, propsCols));
        //expect(renderedOutputColumns).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col left-col");
        //expect(firstColumn.length).toBe(1);
        var secondColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "col centre-col");
        //expect(secondColumn.length).toBe(1);
    });


    ///* will check the count of standardisation closed grid tiles in tile view */
    it('will check the count of grid tiles in tile view', () => {
        var props = { gridRows: gridRowsStandardisationClosedTile, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        //expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        //expect(totalRows.length).toBe(1);
    });

    /* will check whether standardisation closed grid contain ResponseId Column */
    it('will check whether standardisation closed grid contain ResponseId Column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationClosedDetail }));
        var responseID = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "resp-id")[0];
        //expect(responseID).not.toBe(null);
        //expect(responseID).not.toBe(undefined);
    });

    /* will check whether standardisation closed grid contain TotalMark Column */
    it('will check whether standardisation closed grid contain TotalMark Column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationClosedDetail }));
        var totalMark = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "col wl-mark text-center")[0];
        //expect(totalMark).not.toBe(null);
        //expect(totalMark).not.toBe(undefined);
    });

    /* will check whether standardisation closed grid contain submitted date Column */
    it('will check whether standardisation closed grid contain submitted date', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationClosedDetail }));
        //expect(ReactDOM.findDOMNode(renderedOutput).textContent).toContain(mockFn.toLocaleDateString(new Date("2016-02-25T08:07:18.247")));
    });

    /* will check whether standardisation closed grid contain slao Column */
    it('will check whether standardisation closed grid contain slao column', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(GridControl, { gridRows: gridRowsStandardisationClosedDetail }));
        var slao = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "slao")[0];
        //expect(slao).not.toBe(null);
        //expect(slao).not.toBe(undefined);
    });
});