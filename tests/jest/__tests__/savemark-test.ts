jest.dontMock("../../../src/stores/marking/markingstore");
jest.dontMock("../../../src/actions/marking/markingactioncreator");
jest.dontMock("../../../src/actions/marking/savemarkaction");
import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import examinerMarkData = require('../../../src/stores/response/typings/examinermarkdata');
import markingStore = require('../../../src/stores/marking/markingstore');
import retrieveMarksAction = require('../../../src/actions/marking/retrievemarksaction');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import enums = require('../../../src/components/utility/enums');
import dispatcher = require("../../../src/app/dispatcher");
import saveMarkAction = require('../../../src/actions/marking/savemarkaction');
import markChangeDetails = require('../../../src/actions/marking/markchangedetails');
import examinerMark = require('../../../src/stores/response/typings/examinermark');
import OverviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import qigSelectorDataFetchAction = require('../../../src/actions/qigselector/qigselectordatafetchaction');
import Immutable = require("immutable");
import mark = require('../../../src/components/utility/marking/mark');
import marksManagementHelper = require('../../../src/components/utility/marking/marksmanagementhelper');
import marksAndAnnotationsManagementBase = require('../../../src/components/utility/marking/marksandannotationsmanagementbase');
import worklistTypeAction = require('../../../src/actions/worklist/worklisttypeaction');


/**
* Test suit for Save mark
*/
describe("Save mark test", () => {
    /* The new examiner mark data */
    let examinerMarks: examinerMarkData;
    /* The available marks for the current response */
    let availableMarks: Array<examinerMark>;
    /* The overview data for qigSelectorDataFetchAction */
    let overviewData: OverviewData;
    /* class which initiates saving mark action */
    let manageMarks: marksAndAnnotationsManagementBase;
    /* live open response details */
    let responseLiveOpenData: WorklistBase;

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
            }
        ]
    }

    //overviewData = JSON.parse(JSON.stringify(qigList));
    //overviewData.qigSummary = Immutable.List(overviewData.qigSummary);

    //let qigDataFetchAction: qigSelectorDataFetchAction = new qigSelectorDataFetchAction(true, 1, true, overviewData);
    ///* to set the selected qig. The only the examiner role id will be available in the amrking stopre to add a new mark */
    //dispatcher.dispatch(qigDataFetchAction);

    /* The examiner marks collection */
    let examinerMarksAndAnnotation =
        {
            "examinerMarkGroupDetails": {
                "25742": {
                    "allMarksAndAnnotations": [{
                        "enhancedOffPageComments": [],
                        "examinerMarksCollection": [{
                            "markId": 23905,
                            "candidateScriptId": 6908,
                            "examinerRoleId": 1773,
                            "markGroupId": 25742,
                            "markSchemeId": 3865,
                            "numericMark": 1,
                            "markStatus": null,
                            "markingComplete": true,
                            "examinerComment": null,
                            "shareLevel": 0,
                            "accuracyIndicator": 0,
                            "rowVersion": "AAAAAFEFv7Y=",
                            "usedInTotal": true,
                            "esCandidateScriptMarkSchemeGroup": 0,
                            "definitiveMark": false,
                            "lowerTolerance": null,
                            "upperTolerance": null,
                            "markSchemeForMark": null,
                            "nonnumericMark": null,
                            "notAttempted": false,
                            "markScheme": null,
                            "version": 0,
                            "isDirty": false,
                            "markingOperation": enums.MarkingOperation.none
                        }, {
                                "markId": 23906,
                                "candidateScriptId": 6908,
                                "examinerRoleId": 1773,
                                "markGroupId": 25742,
                                "markSchemeId": 3866,
                                "numericMark": 2,
                                "markStatus": null,
                                "markingComplete": true,
                                "examinerComment": null,
                                "shareLevel": 0,
                                "accuracyIndicator": 0,
                                "rowVersion": "AAAAAFEFv7c=",
                                "usedInTotal": true,
                                "esCandidateScriptMarkSchemeGroup": 0,
                                "definitiveMark": false,
                                "lowerTolerance": null,
                                "upperTolerance": null,
                                "markSchemeForMark": null,
                                "nonnumericMark": null,
                                "notAttempted": false,
                                "markScheme": null,
                                "version": 0,
                                "isDirty": true,
                                "markingOperation": enums.MarkingOperation.updated
                            }],
                        "annotations": [],
                        "bookmarks": [],
                        "absoluteMarksDifference": null,
                        "accuracyIndicator": 0,
                        "accuracyTolerance": 0,
                        "examinerMarks": null,
                        "maximumMarks": 0,
                        "totalMarks": 15,
                        "totalMarksDifference": null,
                        "totalTolerance": null,
                        "examinerRoleId": 1773,
                        "markGroupId": 25742,
                        "markingProgress": 100,
                        "hasMarkSchemeLevelTolerance": false,
                        "version": 1,
                        "questionItemGroup": null,
                        "totalLowerTolerance": null,
                        "totalUpperTolerance": null,
                        "seedingAMDTolerance": null,
                        "submittedDate": "0001-01-01T00:00:00",
                        "remarkRequestTypeId": 0
                    }],
                    "examinerDetails": null,
                    "startWithEmptyMarkGroup": false,
                    "showPreviousMarks": false,
                    "markerMessage": null,
                    "showMarkerMessage": false
                }
            },
            "wholeResponseQIGToRIGMapping": null,
            "success": true,
            "errorMessage": null,
        };
    //var examinerMarksString = JSON.stringify(examinerMarksAndAnnotation);
    //examinerMarks = JSON.parse(examinerMarksString);
    ///* dispatching retrieve marks to set the predefines marks collection to the marking store */
    //var getMarksAction: retrieveMarksAction = new retrieveMarksAction(examinerMarks, true);
    //dispatcher.dispatch(getMarksAction);

    ///* dispatching open response action to set the current mark group id */
    //var openResponseAction: responseOpenAction = new responseOpenAction(true, 6370108, enums.ResponseNavigation.next, enums.ResponseMode.open, 25742);
    //dispatcher.dispatch(openResponseAction);

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
                "candidateScriptId":211
            }

        ],
        "concurrentLimit": 5,
        "maximumMark": 50,
        "unallocatedResponsesCount": 18,
        "hasNumericMark": true,
        "success": true,
        "errorMessage": null
    };

    /* Creating immutable collection for live open */
    //var liveOpenResponsesString = JSON.stringify(liveOpenResponses);
    //responseLiveOpenData = JSON.parse(liveOpenResponsesString);
    //var immutableList = Immutable.List(responseLiveOpenData.responses);
    //responseLiveOpenData.responses = immutableList;

    //dispatcher.dispatch(new worklistTypeAction(enums.WorklistType.live, enums.ResponseMode.open, enums.RemarkRequestType.Unknown, false, true, false, responseLiveOpenData));

    //availableMarks = markingStore.instance.examinerMarksAgainstCurrentResponse.
    //    examinerMarkGroupDetails[25742].allMarksAndAnnotations[0].examinerMarksCollection;

    ///* Collection of marks at the time of opening a response */
    //let originalMarks: Array<mark> = [];
    //originalMarks.push(new mark {
    //    isDirty: false,
    //    mark: { displayMark: '1', valueMark: '1' },
    //    markId: 23905,
    //    markSchemeId: 3865,
    //    usedInTotal: true
    //});

    ///* This is to check the scenario for the already edited mark when opening the response */
    //originalMarks.push(new mark {
    //    isDirty: true,
    //    mark: { displayMark: '2', valueMark: '2' },
    //    markId: 23906,
    //    markSchemeId: 3866,
    //    usedInTotal: true
    //});

    //this.manageMark = new marksManagementHelper(originalMarks);

    it("checks if mark is added ", () => {
        //var _allocatedMark = { displayMark: '13', valueMark: '13' };
        //this.manageMark.processMark(_allocatedMark, 231, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();
        ///* Check if the amrk is added to the collection */
        //expect(availableMarks.filter(x=> x.markId === 0).length).toBe(1);
        ///* Checking if the added mark is 13 */
        //expect(availableMarks.filter(x=> x.markId === 0)[0].numericMark).toBe(13);
        ///* Checking if the marking operation is 'added' */
        //expect(availableMarks.filter(x=> x.markId === 0)[0].markingOperation).toBe(enums.MarkingOperation.added);

        ///* Checking if dirty flag is set */
        //expect(availableMarks.filter(x=> x.markId === 0)[0].isDirty).toBe(true);
    });

    it("checks if the newly added mark is updated", () => {
        //var _allocatedMark = { displayMark: '14', valueMark: '14' };
        //this.manageMark.processMark(_allocatedMark, 231, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();
        ///* Checking if the added mark is 14 */
        //expect(availableMarks.filter(x=> x.markId === 0)[0].numericMark).toBe(14);
        ///* Checking if the marking operation is 'added' */
        //expect(availableMarks.filter(x=> x.markId === 0)[0].markingOperation).toBe(enums.MarkingOperation.added);

        ///* Checking if dirty flag is set */
        //expect(availableMarks.filter(x=> x.markId === 0)[0].isDirty).toBe(true);
    });

    it("checks if the newly added mark is deleted", () => {
        //var _allocatedMark = { displayMark: '-', valueMark: '' };
        //this.manageMark.processMark(_allocatedMark, 231, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();
        ///* Check if the newly added mark is deleted from the collection */
        //expect(availableMarks.filter(x=> x.markId === 0).length).toBe(0);
    });

    it("checks if already added mark is unchanged if same mark is entered", () => {
        //var _allocatedMark = { displayMark: '1', valueMark: '1' };
        //this.manageMark.processMark(_allocatedMark, 3865, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();

        ///* Checking if the updated mark is 1 */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].numericMark).toBe(1);
        ///* Checking if the marking operation is 'none' */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].markingOperation).toBe(enums.MarkingOperation.none);

        ///* Checking if dirty flag is not set */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].isDirty).toBe(false);
    });

    it("checks if already added mark is updated", () => {
        //var _allocatedMark = { displayMark: '10', valueMark: '10' };
        //this.manageMark.processMark(_allocatedMark, 3865, 10, 1, 10, false, false, false, true, true);;
        //jest.runAllTimers();

        ///* Checking if the updated mark is 10 */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].numericMark).toBe(10);
        ///* Checking if the marking operation is 'updated' */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].markingOperation).toBe(enums.MarkingOperation.updated);

        ///* Checking if dirty flag is set */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].isDirty).toBe(true);
    });

    it("checks if already added mark is deleted", () => {
        //var _allocatedMark = { displayMark: '-', valueMark: '' };
        //this.manageMark.processMark(_allocatedMark, 3865, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();

        ///* Checking if the marking operation is 'deleted' */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].markingOperation).toBe(enums.MarkingOperation.deleted);

        ///* Checking if dirty flag is set */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].isDirty).toBe(true);
    });

    it("checks if the same mark is added with no change after the deletion of the already added mark", () => {
        //var _allocatedMark = { displayMark: '1', valueMark: '1' };
        //this.manageMark.processMark(_allocatedMark, 3865, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();

        ///* Checking if the updated mark is 1 */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].numericMark).toBe(1);

        ///* Checking if the marking operation is 'deleted' */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].markingOperation).toBe(enums.MarkingOperation.none);

        ///* Checking if dirty flag is set */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3865)[0].isDirty).toBe(false);
    });

    it("checks if already edited mark on opening response is never set to unchanged status", () => {
        //var _allocatedMark = { displayMark: '2', valueMark: '2' };
        //this.manageMark.processMark(_allocatedMark, 3866, 10, 1, 10, false, false, false, true, true);
        //jest.runAllTimers();

        ///* Checking if the updated mark is 2 */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3866)[0].numericMark).toBe(2);

        ///* Checking if the marking operation is 'deleted' */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3866)[0].markingOperation).toBe(enums.MarkingOperation.updated);

        ///* Checking if dirty flag is set */
        //expect(availableMarks.filter(x=> x.markSchemeId === 3866)[0].isDirty).toBe(true);
    });
});