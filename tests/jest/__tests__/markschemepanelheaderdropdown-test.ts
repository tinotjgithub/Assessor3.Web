jest.dontMock("../../../src/stores/marking/markingstore");
jest.dontMock("../../../src/actions/marking/markingactioncreator");

import React = require("react");
import ReactDOM = require("react-dom");
import ReactTestUtils = require('react-dom/test-utils');
import enums = require("../../../src/components/utility/enums");
import dispatcher = require("../../../src/app/dispatcher");
import markingStore = require('../../../src/stores/marking/markingstore');
import examinerMarkData = require('../../../src/stores/response/typings/examinermarkdata');
import retrieveMarksAction = require('../../../src/actions/marking/retrievemarksaction');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import MarkSchemepanelHeaderDropdown = require('../../../src/components/markschemestructure/markschemepanelheaderdropdown');
import worklistAction = require("../../../src/actions/worklist/worklisttypeaction");

describe("Test for markschemepanel dropdown", () => {

    let examinerMarks: examinerMarkData;

    let renderedOutput;

    let examinerMarksAndAnnotation =
        {
            "examinerMarkGroupDetails": {
                "29638": {
                    "allMarksAndAnnotations": [
                        {
                            "enhancedOffPageComments": [],
                            "examinerMarksCollection": [
                                {
                                    "markId": 59923,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2109,
                                    "markGroupId": 29638,
                                    "markSchemeId": 4219,
                                    "numericMark": 1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 1,
                                    "rowVersion": "AAAAAFFoorw=",
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                },
                                {
                                    "markId": 59924,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2109,
                                    "markGroupId": 29638,
                                    "markSchemeId": 4220,
                                    "numericMark": 1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 1,
                                    "rowVersion": "AAAAAFFomV8=",
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                }
                            ],
                            "annotations": [
                                {
                                    "annotationId": 58734,
                                    "examinerRoleId": 2109,
                                    "markSchemeGroupId": 327,
                                    "imageClusterId": 3856,
                                    "outputPageNo": 1,
                                    "pageNo": 0,
                                    "dataShareLevel": 0,
                                    "leftEdge": 1282,
                                    "topEdge": 745,
                                    "zOrder": 3,
                                    "width": 0,
                                    "height": 0,
                                    "dimension": null,
                                    "red": 255,
                                    "green": 0,
                                    "blue": 0,
                                    "transparency": 0,
                                    "stamp": 2371,
                                    "comment": null,
                                    "freehand": null,
                                    "rowVersion": "AAAAAFE3Zs4=",
                                    "clientToken": "9b203f60-7569-c597-ad2b-4f87d1c93dec",
                                    "markSchemeId": 4219,
                                    "markGroupId": 29638,
                                    "candidateScriptId": 9865,
                                    "version": 0,
                                    "definitiveMark": false,
                                    "isDirty": false,
                                    "questionTagId": 0,
                                    "markingOperation": 0
                                },
                                {
                                    "annotationId": 58735,
                                    "examinerRoleId": 2109,
                                    "markSchemeGroupId": 327,
                                    "imageClusterId": 3856,
                                    "outputPageNo": 1,
                                    "pageNo": 0,
                                    "dataShareLevel": 0,
                                    "leftEdge": 1143,
                                    "topEdge": 563,
                                    "zOrder": 3,
                                    "width": 0,
                                    "height": 0,
                                    "dimension": null,
                                    "red": 255,
                                    "green": 0,
                                    "blue": 0,
                                    "transparency": 0,
                                    "stamp": 2371,
                                    "comment": null,
                                    "freehand": null,
                                    "rowVersion": "AAAAAFE3ZtE=",
                                    "clientToken": "676c913b-25e0-ca57-0d05-a5704e98df08",
                                    "markSchemeId": 4219,
                                    "markGroupId": 29638,
                                    "candidateScriptId": 9865,
                                    "version": 0,
                                    "definitiveMark": false,
                                    "isDirty": false,
                                    "questionTagId": 0,
                                    "markingOperation": 0
                                }
                            ],
                            "bookmarks": [],
                            "markedByInitials": "",
                            "markedBySurname": "",
                            "isDefault": false,
                            "absoluteMarksDifference": null,
                            "accuracyIndicator": 51,
                            "accuracyTolerance": 0,
                            "examinerMarks": [
                                {
                                    "markId": 59923,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2109,
                                    "markGroupId": 29638,
                                    "markSchemeId": 4219,
                                    "numericMark": 1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 1,
                                    "rowVersion": "AAAAAFFoorw=",
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                },
                                {
                                    "markId": 59924,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2109,
                                    "markGroupId": 29638,
                                    "markSchemeId": 4220,
                                    "numericMark": 1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 1,
                                    "rowVersion": "AAAAAFFomV8=",
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                }
                            ],
                            "maximumMarks": 0,
                            "totalMarks": 25,
                            "totalMarksDifference": null,
                            "totalTolerance": null,
                            "examinerRoleId": 2109,
                            "markGroupId": 29638,
                            "markingProgress": 43,
                            "hasMarkSchemeLevelTolerance": false,
                            "version": 18,
                            "questionItemGroup": null,
                            "totalLowerTolerance": null,
                            "totalUpperTolerance": null,
                            "seedingAMDTolerance": null,
                            "submittedDate": "0001-01-01T00:00:00",
                            "remarkRequestTypeId": 20,
                            "baseColor": "#FF067B00"
                        },
                        {
                            "enhancedOffPageComments": [],
                            "examinerMarksCollection": [
                                {
                                    "markId": 59002,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2108,
                                    "markGroupId": 29636,
                                    "markSchemeId": 4217,
                                    "numericMark": 0,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 1,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                },
                                {
                                    "markId": 59003,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2108,
                                    "markGroupId": 29636,
                                    "markSchemeId": 4218,
                                    "numericMark": -1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 21,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                }
                            ],
                            "annotations": [
                                {
                                    "annotationId": 58646,
                                    "examinerRoleId": 2108,
                                    "markSchemeGroupId": 327,
                                    "imageClusterId": 3868,
                                    "outputPageNo": 1,
                                    "pageNo": 0,
                                    "dataShareLevel": 0,
                                    "leftEdge": -333,
                                    "topEdge": 23,
                                    "zOrder": 2,
                                    "width": 842,
                                    "height": 159,
                                    "dimension": null,
                                    "red": 127,
                                    "green": 46,
                                    "blue": 234,
                                    "transparency": 0,
                                    "stamp": 171,
                                    "comment": "Vhjkkjhg",
                                    "freehand": null,
                                    "rowVersion": null,
                                    "clientToken": "c321daeb-5b2e-46b7-16a0-aae73580eebe",
                                    "markSchemeId": 4234,
                                    "markGroupId": 29636,
                                    "candidateScriptId": 9865,
                                    "version": 0,
                                    "definitiveMark": false,
                                    "isDirty": false,
                                    "questionTagId": 0,
                                    "markingOperation": 0
                                }
                            ],
                            "bookmarks": null,
                            "markedByInitials": "A",
                            "markedBySurname": "Ancy(Mrs)334789",
                            "isDefault": true,
                            "absoluteMarksDifference": null,
                            "accuracyIndicator": 0,
                            "accuracyTolerance": null,
                            "examinerMarks": [
                                {
                                    "markId": 59002,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2108,
                                    "markGroupId": 29636,
                                    "markSchemeId": 4217,
                                    "numericMark": 0,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 1,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                },
                                {
                                    "markId": 59003,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2108,
                                    "markGroupId": 29636,
                                    "markSchemeId": 4218,
                                    "numericMark": -1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 21,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                }
                            ],
                            "maximumMarks": 0,
                            "totalMarks": 0,
                            "totalMarksDifference": null,
                            "totalTolerance": null,
                            "examinerRoleId": 2108,
                            "markGroupId": 29636,
                            "markingProgress": 0,
                            "hasMarkSchemeLevelTolerance": false,
                            "version": 18,
                            "questionItemGroup": null,
                            "totalLowerTolerance": null,
                            "totalUpperTolerance": null,
                            "seedingAMDTolerance": null,
                            "submittedDate": "0001-01-01T00:00:00",
                            "remarkRequestTypeId": 18,
                            "baseColor": "#FF7F2EEA"
                        },
                        {
                            "enhancedOffPageComments": [],
                            "examinerMarksCollection": [
                                {
                                    "markId": 58890,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2101,
                                    "markGroupId": 29628,
                                    "markSchemeId": 4217,
                                    "numericMark": 0,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 0,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                },
                                {
                                    "markId": 58891,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2101,
                                    "markGroupId": 29628,
                                    "markSchemeId": 4218,
                                    "numericMark": 0,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 0,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                }
                            ],
                            "annotations": [],
                            "bookmarks": null,
                            "markedByInitials": "A",
                            "markedBySurname": "Shashank(Mr)124789",
                            "isDefault": false,
                            "absoluteMarksDifference": null,
                            "accuracyIndicator": 0,
                            "accuracyTolerance": null,
                            "examinerMarks": [
                                {
                                    "markId": 58890,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2101,
                                    "markGroupId": 29628,
                                    "markSchemeId": 4217,
                                    "numericMark": 0,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 0,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                },
                                {
                                    "markId": 58891,
                                    "candidateScriptId": 9865,
                                    "examinerRoleId": 2101,
                                    "markGroupId": 29628,
                                    "markSchemeId": 4218,
                                    "numericMark": 0,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 0,
                                    "rowVersion": null,
                                    "usedInTotal": false,
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
                                    "markingOperation": 0
                                }
                            ],
                            "maximumMarks": 0,
                            "totalMarks": 0,
                            "totalMarksDifference": null,
                            "totalTolerance": null,
                            "examinerRoleId": 2101,
                            "markGroupId": 29628,
                            "markingProgress": 0,
                            "hasMarkSchemeLevelTolerance": false,
                            "version": 18,
                            "questionItemGroup": null,
                            "totalLowerTolerance": null,
                            "totalUpperTolerance": null,
                            "seedingAMDTolerance": null,
                            "submittedDate": "0001-01-01T00:00:00",
                            "remarkRequestTypeId": 0,
                            "baseColor": null
                        }
                    ],
                    "examinerDetails": {
                        "assessor3.Gateway.Marking.Entities.ExaminerRoleMarkGroup": {
                            "examinerName": "At-Risk - A Ancy(Mrs)334789",
                            "isDefaultPreviousMarker": true,
                            "submittedDate": "0001-01-01T00:00:00",
                            "modifiedDate": "0001-01-01T00:00:00",
                            "surname": null
                        }
                    },
                    "startWithEmptyMarkGroup": true,
                    "showPreviousMarks": true,
                    "markerMessage": "",
                    "showMarkerMessage": false
                }
            },
            "wholeResponseQIGToRIGMapping": null,
            "success": true,
            "errorMessage": null
        };

    let openDirectedRemarkResponses = {
        "concurrentLimit": 0,
        "unallocatedResponsesCount": 0,
        "responses": [
            {
                "markingProgress": 39,
                "allocatedDate": "2016-07-13T04:45:11.233",
                "updatedDate": "2016-07-15T13:02:28.09",
                "markGroupId": 25840,
                "displayId": "6317468",
                "hasAllPagesAnnotated": false,
                "totalMarkValue": 9,
                "hasBlockingExceptions": true,
                "resolvedExceptionsCount": 0,
                "hasMessages": false,
                "unreadMessagesCount": 0,
                "hasExceptions": true,
                "hasAdditionalObjects": true,
                "candidateScriptId": 7029,
                "documentId": 7035
            }
        ],
        "maximumMark": 52,
        "hasNumericMark": true,
        "success": true,
        "errorMessage": null
    };

    var examinerMarksString = JSON.stringify(examinerMarksAndAnnotation);
    examinerMarks = JSON.parse(examinerMarksString);

    /* dispatching open response action to set the current mark group id */
    var openResponseAction: responseOpenAction =
        new responseOpenAction(true, 6370108, enums.ResponseNavigation.next, enums.ResponseMode.open, 29638);
    dispatcher.dispatch(openResponseAction);

    /* dispatching retrieve marks to set the predefines marks collection to the marking store */
    var getMarksAction: retrieveMarksAction = new retrieveMarksAction(examinerMarks, true, 29638);
    dispatcher.dispatch(getMarksAction);

    let openDirectedRemarkResponseList = JSON.parse(JSON.stringify(openDirectedRemarkResponses));
    dispatcher.dispatch(new worklistAction(enums.WorklistType.directedRemark, enums.ResponseMode.Closed, enums.RemarkRequestType.SeedingRemark, true, false, openDirectedRemarkResponseList));

    var markingTargetComponent = React.createElement(MarkSchemepanelHeaderDropdown);
    renderedOutput = ReactTestUtils.renderIntoDocument(markingTargetComponent);

    it('check if markschemepanel dropdown is rendered', function () {
        expect(renderedOutput).not.toBeNull();
    });

    it('check if dropdown icon is rendered', function () {
        var component = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "filter-previous-mark");
        expect(component).not.toBe(null);
    });

    it('check if dropdown content is rendered', function () {
        var component = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "remark-menu-content");
        expect(component).not.toBe(null);
    });

    it('check the dropdown item count', function () {
        var component = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedOutput, "li");
        expect(component.length).toBe(3);
    });

    it('check the dropdown item count toggle button is rendered', function () {
        var component = ReactTestUtils.scryRenderedDOMComponentsWithTag(renderedOutput, "li");
        expect(component.length).toBe(3);
    });
});