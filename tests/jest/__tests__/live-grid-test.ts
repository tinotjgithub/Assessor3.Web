
jest.dontMock("../../../src/components/utility/grid/gridcontrol");
jest.dontMock("../../../src/components/worklist/worklisttablewrapper");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import GridControl = require("../../../src/components/utility/grid/gridcontrol");
import liveworkListHelper = require("../../../src/components/utility/grid/worklisthelpers/liveworklisthelper");
import workListHelperBase = require("../../../src/components/utility/grid/worklisthelpers/worklisthelperBase");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import localStore = require("../../../src/stores/localestore");
var localJson = require("../../../content/resources/rm-en.json");
const List = require("../../../src/components/utility/grid/gridcontrol").default;
import enums = require("../../../src/components/utility/enums");
import markerInformationAction = require("../../../src/actions/markerinformation/markerinformationaction");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import WorklistTableWrapper = require('../../../src/components/worklist/worklisttablewrapper');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import tagGetAction = require('../../../src/actions/tag/taggetaction');

describe("Test suite for Grid", function () {

    var gridRowsLiveOpenDetail: Immutable.List<Row>;
    var gridRowsLiveOpenTile: Immutable.List<Row>;
    var gridRowsLiveClosedDetail: Immutable.List<Row>;
    var gridRowsLiveClosedTile: Immutable.List<Row>;
    var gridRowsPendingDetail: Immutable.List<Row>;
    var gridRowsPendingTile: Immutable.List<Row>;
    var responseLiveOpenData: WorklistBase;
    var responseLiveClosedData: WorklistBase;
    var responseLiveGraceData: WorklistBase;
    let _gridRows = null;
    let _gridColumnHeaderRows = null;
    let _gridFrozenBodyRows = null;
    let _gridFrozenHeaderRows = null;

    var propsCols = {};

    var mockFn = {
        toLocaleDateString: jest.genMockFunction().mockImplementation(function (val: Date) {
            // do something stateful
            return val.toLocaleDateString();
        });
    };

    var getId = function () {
        return 'live_open_grid_1';
    };

    var loadData = (gridType: enums.GridType, workListMode: enums.WorklistType, responseMode: enums.ResponseMode) => {

        let data = enums.ResponseMode.none;

        switch (responseMode) {
            case enums.ResponseMode.open:
                data = responseLiveOpenData;
                break;
            case enums.ResponseMode.pending:
                data = responseLiveGraceData;
                break;
            case enums.ResponseMode.closed:
                data = responseLiveClosedData;
                break;
        }

        let helper: workListHelperBase = new liveworkListHelper();
        _gridRows = helper.generateRowDefinion(data, responseMode, gridType);
        _gridColumnHeaderRows = helper.generateTableHeader(responseMode, workListMode);
        _gridFrozenBodyRows = helper.generateFrozenRowBody(data, responseMode, workListMode);
        _gridFrozenHeaderRows = helper.generateFrozenRowHeader(data, responseMode, workListMode);

        propsCols = {
            gridRows: _gridRows,
            selectedLanguage: "en-GB",
            columnHeaderRows: _gridColumnHeaderRows,
            frozenHeaderRows: _gridFrozenHeaderRows,
            frozenBodyRows: _gridFrozenBodyRows,
            worklistType: enums.WorklistType.live,
            getGridControlId: getId,
            id: 'DetailedView1',
            key: 'DetailedViewKey1'
        };
    };

    beforeEach(() => {
        dispatcher.dispatch(new localAction(true, "en-GB", localJson));
        var liveWorkListHelper: workListHelper;

        let tagLists = {
            "tagList": [{
                "tagId": "1",
                "tagName": "Orange",
                "tagOrder": "5"
            },
            {
                "tagId": "2",
                "tagName": "Blue",
                "tagOrder": "2"
            },
            {
                "tagId": "3",
                "tagName": "Green",
                "tagOrder": "3"
            }]
        };

        let tagLists: TagData = JSON.parse(JSON.stringify(tagLists));
        dispatcher.dispatch(new tagGetAction(true, tagLists));

        /*live open response list object */
        var liveOpenResponses = {
            "responses":
            [
                {
                    "displayId": "6370108",
                    "markingProgress": 2,
                    "allocatedDate": "2016-01-18T11:44:59.61",
                    "updatedDate": "2016-01-18T11:44:59.617",
                    "hasAllPagesAnnotated": false,
                    "totalMarkValue": 2,
                    "hasBlockingExceptions": false,
                    "exceptionsCount": 0,
                    "tagId": 3,
                    "tagOrder": 3
                }

            ],
            "concurrentLimit": 5,
            "maximumMark": 50,
            "unallocatedResponsesCount": 18,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        /*live closed response list object */
        var liveClosedResponses = {
            "responses":
            [
                {
                    "displayId": "6370109",
                    "submittedDate": "2016-02-25T08:07:18.247",
                    "hasAllPagesAnnotated": false,
                    "totalMarkValue": 2,
                    "hasBlockingExceptions": false,
                    "resolvedExceptionsCount": 0,
                    "hasMessages": false,
                    "unreadMessagesCount": 0,
                    "hasExceptions": false,
                    "hasAdditionalObjects": true,
                    "tagId": 2,
                    "tagOrder": 2
                }

            ],
            "maximumMark": 50,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        /*live in grace response list object */
        var liveInGraceResponses = {
            "responses":
            [
                {
                    "displayId": "6370109",
                    "lastUpdatedDate": "2016-02-25T08:07:18.247",
                    "hasAllPagesAnnotated": true,
                    "totalMarkValue": 2,
                    "hasBlockingExceptions": false,
                    "resolvedExceptionsCount": 2,
                    "hasMessages": true,
                    "unreadMessagesCount": 2,
                    "hasExceptions": true,
                    "hasAdditionalObjects": true,
                    "timeToEndOfGracePeriod": 5,
                    "tagId": 1,
                    "tagOrder": 1
                }

            ],
            "maximumMark": 50,
            "hasNumericMark": true,
            "success": true,
            "errorMessage": null
        };

        let markerInfo = {
            "initials": "AA",
            "surname": "BB",
            "approvalStatus": 2,
            "markerRoleID": 90,
            "supervisorInitials": "CC",
            "supervisorSurname": "DD",
            "supervisorExaminerId": 10,
            "isSupervisorLoggedOut": false,
            "supervisorLogoutDiffInMinute": 10,
            "formattedSupervisorName": "EESS",
            "formattedExaminerName": "GGG",
            "supervisorLoginStatus": true
        };

        let ccData = {
            "configurableCharacteristics": [{
                "ccName": "HasGracePeriod",
                "ccValue": "true",
                "valueType": 1,
                "markSchemeGroupID": 28,
                "questionPaperID": 0,
                "examSessionID": 0
            },
                {
                    "ccName": "StringFormat",
                    "ccValue": "<StringFormat><OverviewQIGName>{QIGName}-{AssessmentIdentifier}</OverviewQIGName><Username>{Initials} {Surname}</Username></StringFormat>",
                    "valueType": 5,
                    "markSchemeGroupID": 28,
                    "questionPaperID": 0,
                    "examSessionID": 0
                },
                {
                    "ccName": "ColouredAnnotations",
                    "ccValue": "<ColouredAnnotation Status=\"On\" DefaultColour=\"#FFFF0000\"/>",
                    "valueType": 5,
                    "markSchemeGroupID": 28,
                    "questionPaperID": 0,
                    "examSessionID": 0
                }
            ],
            "success": true,
            "errorMessage": null
        }

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
        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));
        dispatcher.dispatch(new markerInformationAction(true, markerInfo));


        /* Creating immutable collection for live open */
        var liveOpenResponsesString = JSON.stringify(liveOpenResponses);
        responseLiveOpenData = JSON.parse(liveOpenResponsesString);
        var immutableList = Immutable.List(responseLiveOpenData.responses);
        responseLiveOpenData.responses = immutableList;

        /* Creating immutable collection for live closed */
        var liveClosedResponsesString = JSON.stringify(liveClosedResponses);
        responseLiveClosedData = JSON.parse(liveClosedResponsesString);
        var immutableList = Immutable.List(responseLiveClosedData.responses);
        responseLiveClosedData.responses = immutableList;

        var livePendingResponsesString = JSON.stringify(liveInGraceResponses);
        responseLiveGraceData = JSON.parse(livePendingResponsesString);
        var immutableList = Immutable.List(responseLiveGraceData.responses);
        responseLiveGraceData.responses = immutableList;

        let workListHelper: workListHelperBase = new liveworkListHelper();

        /* Generating row definition for live open */
        gridRowsLiveOpenDetail = workListHelper.generateRowDefinion(responseLiveOpenData,
                                                                    enums.ResponseMode.open,
                                                                    enums.GridType.detailed);
        gridRowsLiveOpenTile = workListHelper.generateRowDefinion(responseLiveOpenData,
                                                                  enums.ResponseMode.open,
                                                                  enums.GridType.tiled);

        /* Generating row definition for live closed */
        gridRowsLiveClosedDetail = workListHelper.generateRowDefinion(responseLiveClosedData,
                                                                      enums.ResponseMode.closed,
                                                                      enums.GridType.detailed);
        gridRowsLiveClosedTile = workListHelper.generateRowDefinion(responseLiveClosedData,
                                                                    enums.ResponseMode.closed,
                                                                    enums.GridType.tiled);

        /* Generating row definition for live in grace */
        gridRowsPendingDetail = workListHelper.generateRowDefinion(responseLiveGraceData,
                                                                   enums.ResponseMode.pending,
                                                                   enums.GridType.detailed);
        gridRowsPendingTile = workListHelper.generateRowDefinion(responseLiveGraceData,
                                                                 enums.ResponseMode.pending,
                                                                 enums.GridType.tiled);

    });

    /* will check the count of live open grid rows in detail view */
    it('will check the count of live open grid rows in detail view', () => {
        var props = { gridRows: gridRowsLiveOpenDetail, selectedLanguage: "en-GB", gridStyle: "", onClickCallBack: null, worklistType: enums.WorklistType.live };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(1);
    });

    /* will check the count of live open grid columns in detail view  */
    it('will check the count of live open grid columns in detail view', () => {

        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutputColumns = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutputColumns).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-wrap");
        expect(firstColumn.length).toBe(1);
        var tr = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputColumns, "table-content-holder")[0].children[0].children[1];
        expect(tr.children.length).toBe(1);
    });

    /* will check the count of live open grid tiles in tile view */
    it('will check the count of live open grid tiles in tile view', () => {
        var props = { gridRows: gridRowsLiveOpenTile, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(1);
    });

    /* will check whether live open grid contain ResponseId Column */
    it('will check whether live open grid contain ResponseId Column', () => {

        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "response-display-id resp-id")[0];
        expect(firstColumn.className).toBe('response-display-id resp-id');
        expect(firstColumn.children[0].textContent).toBe("6370108");
    });

        /* will check whether live open grid contain MarkingProgress Column */
    it('will check whether live open grid contain MarkingProgress Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[0];
        expect(column.className).toBe('col-status');
    });

    /* will check whether live open grid contain TotalMark Column */
    it('will check whether live open grid contain TotalMark Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[1];
        expect(column.className).toBe('col-mark-obt');
        expect(column.textContent).toBe('2');
    });

    /* will check whether live open grid contain allocated date Column */
    it('will check whether live open grid contain allocated date Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[8];
        expect(column.className).toBe('col-allocated');
        // expect(column.textContent).toBe('1/18/2016, 11:44:59 AM');
    });

    /* will check whether live open grid contain tag Column */
    it('will check whether live open grid contain tag Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.open);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[7];
        expect(column.className).toBe('col-tag');
    });

    //                                    /** The closed worklist */

    /* will check the count of live closed grid rows in detail view */
    it('will check the count of grid tiles in Detail view', () => {
            //loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.closed);

            //var getId = function () {
            //    return 'live_open_grid_1';
            //};

            //var propsCols = {
            //    gridRows: _gridRows,
            //    selectedLanguage: "en-GB",
            //    columnHeaderRows: _gridColumnHeaderRows,
            //    frozenHeaderRows: _gridFrozenHeaderRows,
            //    frozenBodyRows: _gridFrozenBodyRows,
            //    worklistType: enums.WorklistType.live,
            //    getGridControlId: getId,
            //    id: 'DetailedView1',
            //    key: 'DetailedViewKey1'
            //};

            //var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
            //expect(renderedOutput).not.toBe(null);
            //var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "row");
            //expect(totalRows.length).toBe(1);
    });

    /* will check the count of live closed grid columns in detail view  */
    it('will check the count of live closed grid columns in detail view', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var header = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-wrap-lt");
        expect(header.length).toBe(1);
        var body = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-wrap-l");
        expect(body.length).toBe(1);
    });


    /* will check the count of live closed grid tiles in tile view */
    it('will check the count of grid tiles in tile view', () => {
        var props = { gridRows: gridRowsLiveClosedTile, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(1);
    });

    /* will check whether live closed grid contain ResponseId Column */
    it('will check whether live closed grid contain ResponseId Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.closed);

        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "response-display-id resp-id")[0];
        expect(firstColumn.className).toBe('response-display-id resp-id');
        expect(firstColumn.children[0].textContent).toBe("6370109");
    });

    /* will check whether live closed grid contain TotalMark Column */
    it('will check whether live closed grid contain TotalMark Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.closed);

        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[0];
        expect(column.className).toBe('col-mark-obt');
        expect(column.textContent).toBe('2');
    });

    /* will check whether live closed grid contain submitted date Column */
    it('will check whether live closed grid contain submitted date', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.closed);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[1];
        expect(column.className).toBe('col-modified');
        // expect(column.textContent).toBe('2/25/2016, 8:07:18 AM');
    });

    //                            /** The In grace worklist */


    /* will check the count of grid tiles in tile view in grace */
    it('will check the count of grid tiles in tile view in grace', () => {
        var props = { gridRows: gridRowsPendingDetail, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(1);
    });

    /* will check the count of  grid columns in grace detail view  */
    it('will check the count of  grid columns in grace detail view', () => {
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var header = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-wrap-lt");
        expect(header.length).toBe(1);
        var body = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-wrap-l");
        expect(body.length).toBe(1);
    });

    /* will check the count of live closed grid tiles of in grace worklist in tile view */
    it('will check the count of grid tiles of in grace worklist in tile view', () => {
        var props = { gridRows: gridRowsPendingTile, selectedLanguage: "en-GB" };
        var renderedOutputRows = TestUtils.renderIntoDocument(React.createElement(GridControl, props));
        expect(renderedOutputRows).not.toBe(null);
        var totalRows = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutputRows, "row");
        expect(totalRows.length).toBe(1);
    });

    /* will check whether live in grace grid contain ResponseId Column */
    it('will check whether live in grace grid contain ResponseId Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.pending);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "response-display-id resp-id")[0];
        expect(firstColumn.className).toBe('response-display-id resp-id');
        expect(firstColumn.children[0].textContent).toBe("6370109");
    });

    /* will check whether live in grace grid contain TotalMark Column */
    it('will check whether live in grace grid contain TotalMark Column', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.pending);

        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[1];
        expect(column.className).toBe('col-mark-obt');
        expect(column.textContent).toBe('2');
    });

    /* will check whether live in grace grid contain last updated date */
    it('will check whether live in grace grid contain last updated date', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.pending);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[2];
        expect(column.className).toBe('col-modified');
        // expect(column.textContent).toBe('2/25/2016, 8:07:18 AM');
    });

    /* will check whether live in grace grid contain hours to end grace period */
    it('will check whether live in grace grid contain hours to end grace period', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.pending);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[0];
        expect(column.className).toBe('col-grace-period');
        expect(column.textContent).toBe('5 hours');
    });

    /* will check whether live in grace grid contain message component*/
    it('will check whether live in grace grid contain message component', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.pending);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[4];
        expect(column.className).toBe('col-message');
        expect(column.textContent.trim()).toBe('Inbox 2');
    });

    /* will check whether live in grace grid contain exception component */
    it('will check whether live in grace grid contain exception component', () => {
        loadData(enums.GridType.detailed, enums.WorklistType.live, enums.ResponseMode.pending);
        var renderedOutput = TestUtils.renderIntoDocument(React.createElement(WorklistTableWrapper, propsCols));
        expect(renderedOutput).not.toBe(null);
        var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, "table-content-holder");
        var column = firstColumn[0].children[0].children[1].children[0].children[3];
        expect(column.className).toBe('col-notification');
        expect(column.textContent.trim()).toBe('Information 2');
    });
});