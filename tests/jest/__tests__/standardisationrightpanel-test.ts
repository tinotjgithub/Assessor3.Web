jest.dontMock("../../../src/components/standardisationsetup/standardisationleftcollapsiblepanel");

import React = require('react');
import reactDOM = require("react-dom");
import Immutable = require("immutable");
import Promise = require('es6-promise');
import TestUtils = require('react-dom/test-utils');
import StandardisationSetupContainer = require("../../../src/components/standardisationsetup/standardisationsetupcontainer");
import StandardisationSetup = require("../../../src/components/standardisationsetup/standardisationsetup");
import localAction = require("../../../src/actions/locale/localeaction");
import dispatcher = require("../../../src/app/dispatcher");
import enums = require('../../../src/components/utility/enums');
var localJson = require("../../../content/resources/rm-en.json");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import standardisationresponsedetailsaction = require("../../../src/actions/standardisationsetup/getstandardisationresponsedetailsaction");
import standardisationSetupTargetDetailsAction = require('../../../src/actions/standardisationsetup/getstandardisationsetuptargetdetailsaction');
import standardisationTargetDetails = require('../../../src/stores/standardisationsetup/typings/standardisationtargetdetails');
import standardisationSetupSelectWorkListAction = require('../../../src/actions/standardisationsetup/standardisationsetupworklistselectaction');
import tagGetAction = require("../../../src/actions/tag/taggetaction");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import standardisationSetupPermissionCCDataGetAction = require('../../../src/actions/standardisationsetup/standardisationsetuppermissionccdatagetaction');
import candidateScriptMetadataRetrievalAction = require('../../../src/actions/script/candidatescriptmetadataretrievalaction');
import actionType = require('../../../src/actions/base/actiontypes');

describe("Test suite for StandardisatioSetup Container Component", function () {
    // Set the default locale
     dispatcher.dispatch(new localAction(true, "en-GB", localJson));
     let overviewData: overviewData;

     let tagList = {
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
                 "markschemeGroupId": 186,
                 "markschemeGroupName": "PHIL2 Whole Paper",
                 "questionPaperName": "X An Introduction to Philosophy 2",
                 "examinerApprovalStatus": 1,
                 "questionPaperPartId": 200,
                 "assessmentCode": "PHIL2016E",
                 "componentId": "16E",
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
                 "markschemeGroupId": 186,
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
                 "markSchemeGroupId": 186,
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
                 "markSchemeGroupId": 186,
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

     let standardisationTargetDetailsListData: standardisationTargetDetails;
     let targetDetailsListData = {
         "standardisationTargetDetails":
         [{
             "markingModeId": 2,
             "markingModeName": "Practice",
             "count": 3,
             "target": 3,
             "isstmSeed": false
         },
         {
             "markingModeId": 3,
             "markingModeName": "Approval",
             "count": 5,
             "target": 5,
             "isstmSeed": false
         },
         {
             "markingModeId": 4,
             "markingModeName": "ES Team Approval",
             "count": 5,
             "target": 5,
             "isstmSeed": false
         },
         {
             "markingModeId": 70,
             "markingModeName": "Seeding",
             "count": 2,
             "target": 6,
             "isstmSeed": false
         }],
         "provisionalCount": 0,
         "unclassifiedCount": 6,
         "classifiedCount": 1
     }


	 let responseData: StandardisationSetupResponsedetailsList;
	 //let metadata: candidateResponseMetadata;
     let unClassifiedResponseList = {
         "standardisationResponses": [{
             "esMarkGroupId": 429,
             "markingModeId": 1,
             "displayId": "6980901",
             "candidateScriptId": "11271",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 6,
             "tagOrder": 1,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0109",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 429,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 429,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 429,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-02-21T06:01:50.967",
             "totalMarkValue": 9.00,
             "centreNumber": "001000"
         }, {
             "esMarkGroupId": 432,
             "markingModeId": 1,
             "displayId": "6514039",
             "candidateScriptId": "11282",
             "markingProgress": 67,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 0,
             "tagOrder": 0,
             "hasUnknownZoneContent": true,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0120",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 432,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 432,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 432,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-03-01T05:16:41.69",
             "totalMarkValue": 19.00,
             "centreNumber": "001001"
         }, {
             "esMarkGroupId": 491,
             "markingModeId": 1,
             "displayId": "6269976",
             "candidateScriptId": "11302",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 3,
             "tagOrder": 4,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0140",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 491,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 491,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 491,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-02-21T06:18:20.647",
             "totalMarkValue": 12.00,
             "centreNumber": "001002"
         }, {
             "esMarkGroupId": 492,
             "markingModeId": 1,
             "displayId": "6995209",
             "candidateScriptId": "11322",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 7,
             "tagOrder": 3,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0160",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 492,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 492,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 492,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-02-21T06:05:15.623",
             "totalMarkValue": 19.00,
             "centreNumber": "001003"
         }, {
             "esMarkGroupId": 499,
             "markingModeId": 1,
             "displayId": "6887590",
             "candidateScriptId": "11281",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 0,
             "tagOrder": 0,
             "hasUnknownZoneContent": true,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0119",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 499,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 499,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 499,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-02-21T06:18:20.303",
             "totalMarkValue": 20.00,
             "centreNumber": "001000"
         }, {
             "esMarkGroupId": 876,
             "markingModeId": 1,
             "displayId": "6357538",
             "candidateScriptId": "11323",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 0,
             "tagOrder": 0,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0161",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 876,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 876,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 876,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-02-28T13:44:26.853",
             "totalMarkValue": 10.00,
             "centreNumber": "001003"
         }, {
             "esMarkGroupId": 1031,
             "markingModeId": 1,
             "displayId": "68229",
             "candidateScriptId": "11285",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 119,
             "tagId": 3,
             "tagOrder": 4,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0123",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 1031,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 1031,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 1031,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-03-01T05:47:53.957",
             "totalMarkValue": 16.00,
             "centreNumber": "001001"
         }, {
             "esMarkGroupId": 1032,
             "markingModeId": 1,
             "displayId": "6580891",
             "candidateScriptId": "11303",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "note": "",
             "examinerRoleId": 121,
             "tagId": 6,
             "tagOrder": 1,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0141",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 1032,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 1032,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 1032,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H Q",
             "lastMarkerSurname": "Miller (Mrs) 008008",
             "updatedDate": "2018-03-01T06:00:30.24",
             "totalMarkValue": 15.00,
             "centreNumber": "001002"
         }],
         "hasNumericMark": false,
         "success": true,
         "errorMessage": null,
         "failureCode": 0
     }

     let classifiedResponseList = {
         "standardisationResponses":
         [{
             "esMarkGroupId": 296,
             "markingModeId": 2,
             "displayId": "6106608",
             "candidateScriptId": "3671",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "rigOrder": 1,
             "note": " ",
             "examinerRoleId": 540,
             "tagId": 0,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": true,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": true,
             "centreCandidateNumber": "0118",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 296,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 296,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 296,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 1,
             "hasMessages": true,
             "lastMarkerInitials": "H E",
             "lastMarkerSurname": "Graham (Mr) 002279",
             "updatedDate": "2018-02-15T09:01:33.94",
             "totalMarkValue": 43.00,
             "centreNumber": "001006",
             "candidate_No": null
         },
         {
             "esMarkGroupId": 297,
             "markingModeId": 3,
             "displayId": "6468491",
             "candidateScriptId": "3673",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "rigOrder": 3,
             "note": "",
             "examinerRoleId": 540,
             "tagId": 0,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0119",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 297,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 297,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 297,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H E",
             "lastMarkerSurname": "Graham (Mr) 002279",
             "updatedDate": "2018-02-15T09:03:31.733",
             "totalMarkValue": 26.00,
             "centreNumber": "001006",
             "candidate_No": null
         },
         {
             "esMarkGroupId": 295,
             "markingModeId": 4,
             "displayId": "6569374",
             "candidateScriptId": "3672",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "rigOrder": 4,
             "note": "",
             "examinerRoleId": 25,
             "tagId": 0,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0117",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 295,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 295,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 295,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H E",
             "lastMarkerSurname": "Graham (Mr) 002279",
             "updatedDate": "2018-02-15T09:03:31.733",
             "totalMarkValue": 26.00,
             "centreNumber": "001005",
             "candidate_No": null
         },
         {
             "esMarkGroupId": 282,
             "markingModeId": 70,
             "displayId": "6620068",
             "candidateScriptId": "3524",
             "markingProgress": 100,
             "relatedTotalMark": null,
             "mcqMarksList": null,
             "rigOrder": 2,
             "note": "",
             "examinerRoleId": 25,
             "tagId": 0,
             "hasUnknownZoneContent": false,
             "hasAllPagesAnnotated": false,
             "hasAdditionalObjects": false,
             "isAllNR": false,
             "isAllMarkSchemeCommented": false,
             "isstmSeed": false,
             "isMandateCommentEnabled": false,
             "specialistResponseType": null,
             "allFilesViewed": false,
             "centreCandidateNumber": "0104",
             "standardisationMarks": [
                 {
                     "esMarkGroupId": 282,
                     "displayLabel": "Criterion 1a",
                     "mark": "1.00",
                     "sequenceNo": 2,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 282,
                     "displayLabel": "Criterion 1b",
                     "mark": "1.00",
                     "sequenceNo": 3,
                     "usedInTotal": true
                 },
                 {
                     "esMarkGroupId": 282,
                     "displayLabel": "1c",
                     "mark": "1.00",
                     "sequenceNo": 4,
                     "usedInTotal": true
                 }
             ],
             "unreadMessagesCount": 0,
             "hasMessages": false,
             "lastMarkerInitials": "H E",
             "lastMarkerSurname": "Graham (Mr) 002279",
             "updatedDate": "2018-02-15T09:03:31.733",
             "totalMarkValue": 26.00,
             "centreNumber": "001001",
             "candidate_No": null
         }
         ],
         "hasNumericMark": false,
         "success": true,
         "errorMessage": null,
         "failureCode": 0
     }

     let ccData = {
         "configurableCharacteristics": [{
             "ccName": "StandardisationSetupPermissions",
             "ccValue": "<Roles><Role><Name>Principal Examiner</Name><Permissions><Permission>Complete</Permission><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>EditDefinitives</Permission><Permission>ViewDefinitives</Permission><Permission>Classify</Permission><Permission>Declassify</Permission><Permission>MultiQIGProvisionals</Permission><Permission>ReuseResponses</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification><Classification>Seeding</Classification></Classifications></ViewByClassification></Role><Role><Name>Assistant Principal Examiner</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>EditDefinitives</Permission><Permission>ViewDefinitives</Permission><Permission>Classify</Permission><Permission>Declassify</Permission><Permission>MultiQIGProvisionals</Permission><Permission>ReuseResponses</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification><Classification>Seeding</Classification></Classifications></ViewByClassification></Role><Role><Name>Team Leader (Examiner)</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>ViewDefinitives</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification></Classifications></ViewByClassification></Role><Role><Name>Assistant Examiner</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>ViewDefinitives</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification></Classifications></ViewByClassification></Role></Roles>",
             "valueType": 1,
             "markSchemeGroupID": 186,
             "questionPaperID": 0,
             "examSessionID": 0
         }
         ],
         "success": true,
         "errorMessage": null
     }

     let candidateResponseMetadata = [{

        "scriptImageList": [
            {
                "candidateScriptId": 211,
                "documentId": 6319,
                "isSuppressed": false,
                "pageNumber": 624,
                "rowVersion": '00-00-00-00-52-07-7E-64',
                "suppressedLimit": 0
            }
        ]
    }];


     overviewData = JSON.parse(JSON.stringify(qigList));
     overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
     dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.ExamBody, 186, ccData));
     dispatcher.dispatch(new standardisationSetupPermissionCCDataGetAction(enums.ExaminerRole.principalExaminer, 186));
     dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, overviewData,false,false,false,true,false));
     dispatcher.dispatch(new tagGetAction(true, JSON.parse(JSON.stringify(tagList))));
	 dispatcher.dispatch(new standardisationSetupTargetDetailsAction(true, 186, 25, targetDetailsListData));
     dispatcher.dispatch(new standardisationSetupSelectWorkListAction(enums.StandardisationSetup.UnClassifiedResponse,186,25,false));
	 responseData = JSON.parse(JSON.stringify(unClassifiedResponseList));
	 responseData.standardisationResponses = Immutable.List(responseData.standardisationResponses); 
     dispatcher.dispatch(new standardisationresponsedetailsaction(true, enums.STDWorklistViewType.ViewTotalMarks, responseData, false, enums.StandardisationSetup.UnClassifiedResponse, 186));

    var candidatescriptImageString = JSON.stringify(candidateResponseMetadata);
    var candidatescriptImageData = JSON.parse(candidatescriptImageString);
    var immutableList = Immutable.List(candidatescriptImageData);
    candidateResponseMetadata.scriptImageList = immutableList;
     let standardisationsetupContainerForUnclassified = (<StandardisationSetupContainer 
          standardisationSetupWorkList = { enums.StandardisationSetup.UnClassifiedResponse }
          selectedLanguage = { "en-GB" }/>);

    let standardisationsetupContainerDOM = TestUtils.renderIntoDocument(standardisationsetupContainerForUnclassified);

    dispatcher.dispatch(new candidateScriptMetadataRetrievalAction(actionType.CANDIDATE_SCRIPT_METADATA_RETRIEVED, 186, 25, candidateResponseMetadata, false, enums.StandardisationSetup.UnClassifiedResponse));

     test("checks if StandardisationSetup container component and unclassified TotalMarksView grid is rendered", () => {
             standardisationsetupContainerDOM.setState({isTotalMarkView:true});
             jest.useFakeTimers();
             jest.runAllTicks();
             var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(standardisationsetupContainerDOM, "table-header-wrap");
             console.log("firstColumn :", firstColumn);
             var column = firstColumn[0].children[0].children[0].children[0].children[0].children[0];
             expect(column.className).toBe('col-response header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[0];
             expect(column.className).toBe('col-script-id header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[1];
             expect(column.className).toBe('col-centre header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[2];
             expect(column.className).toBe('col-status');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[3];
             expect(column.className).toBe('col-candidate');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[4];
             expect(column.className).toBe('col-mark-obt');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[5];
             expect(column.className).toBe('col-last-marker');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[6];
             expect(column.className).toBe('col-note');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[7];
             expect(column.className).toBe('col-slao');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[8];
             expect(column.className).toBe('col-slao');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[9];
             expect(column.className).toBe('col-message');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[10];
             expect(column.className).toBe('col-tag');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[11];
             expect(column.className).toBe('col-modified');
    });

    test("checks if StandardisationSetup container component and unclassified QuestionMarkView grid is rendered", () => {
         standardisationsetupContainerDOM.setState({isTotalMarkView:false});
         jest.useFakeTimers();
         jest.runAllTicks();

         var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(standardisationsetupContainerDOM, "table-header-wrap");
         var column = firstColumn[0].children[0].children[0].children[0].children[0].children[0];
         expect(column.className).toBe('col-response header-col');

         var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[0];
         expect(column.className).toBe('col-mark-obt');

         var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[1];
         expect(column.className).toBe('col-status');

         var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[2];
         expect(column.className).toBe('col-note');

         var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[3];
         expect(column.className).toBe('col-question-item');

         var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[4];
         expect(column.className).toBe('col-question-item');

    });


/** CLASSIFIED WORKLIST TESTS */

         let standardisationsetupContainerForClassified = (<StandardisationSetupContainer
         standardisationSetupWorkList = { enums.StandardisationSetup.ClassifiedResponse }
         selectedLanguage = { "en-GB" }/>);
         let standardisationsetupContainerDOMClassified = TestUtils.renderIntoDocument(standardisationsetupContainerForClassified);

		 responseData = JSON.parse(JSON.stringify(classifiedResponseList));
		 responseData.standardisationResponses = Immutable.List(responseData.standardisationResponses);
         dispatcher.dispatch(new standardisationresponsedetailsaction(true, enums.STDWorklistViewType.ViewMarksByQuestion, responseData, false, enums.StandardisationSetup.ClassifiedResponse, 186));

         dispatcher.dispatch(new candidateScriptMetadataRetrievalAction(actionType.CANDIDATE_SCRIPT_METADATA_RETRIEVED, 186, 25,
             candidateResponseMetadata, false, enums.StandardisationSetup.ClassifiedResponse));

         test("checks if StandardisationSetup container component and Classified TotalMarksView grid is rendered", () => {
             standardisationsetupContainerDOMClassified.setState({isTotalMarkView:true});
             jest.useFakeTimers();
             jest.runAllTicks();
             var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(standardisationsetupContainerDOMClassified, "table-header-wrap");
             var column = firstColumn[0].children[0].children[0].children[0].children[0].children[0];
             expect(column.className).toBe('col-std-classify-items header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[0];
             expect(column.className).toBe('col-script-id header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[1];
             expect(column.className).toBe('col-centre header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[2];
             expect(column.className).toBe('col-candidate');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[3];
             expect(column.className).toBe('col-mark-obt');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[4];
             expect(column.className).toBe('col-last-marker');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[5];
             expect(column.className).toBe('col-note');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[6];
             expect(column.className).toBe('col-message');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[7];
             expect(column.className).toBe('col-tag');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[8];
             expect(column.className).toBe('col-modified');
         });

         test("checks if StandardisationSetup container component and Classified QuestionMarkView grid is rendered", () => {
             standardisationsetupContainerDOMClassified.setState({isTotalMarkView:false});
             jest.useFakeTimers();
             jest.runAllTicks();
             // to check component has been rendered

             expect(standardisationsetupContainerDOMClassified).not.toBeNull();

             var firstColumn = TestUtils.scryRenderedDOMComponentsWithClass(standardisationsetupContainerDOMClassified, "table-header-wrap");
             var column = firstColumn[0].children[0].children[0].children[0].children[0].children[0];
             expect(column.className).toBe('col-std-classify-items header-col');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[0];
             expect(column.className).toBe('col-mark-obt');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[1];
             expect(column.className).toBe('col-last-marker');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[2];
             expect(column.className).toBe('col-note');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[3];
             expect(column.className).toBe('col-question-item');

             var column = firstColumn[0].children[1].children[0].children[0].children[0].children[0].children[3];
             expect(column.className).toBe('col-question-item');
         });
});