jest.dontMock('../../../src/components/response/responsescreen/pageoptions');
import react = require('react');
import reactTestUtils = require('react-dom/test-utils');
import PageOptions = require('../../../src/components/response/responsescreen/pageoptions');
import retrieveMarksAction = require('../../../src/actions/marking/retrievemarksaction');
import examinerMarkData = require('../../../src/stores/response/typings/examinermarkdata');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import Immutable = require('immutable');
import enums = require('../../../src/components/utility/enums');
import dispatcher = require('../../../src/app/dispatcher');
import qigStore = require('../../../src/stores/qigselector/qigstore');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/overviewdata");

describe('Test suite for page options component', () => {

    /* The new examiner mark and annotations data */
    let examinerMarksAndAnnotations: examinerMarkData;

    /* Create qig summary json object */
    let qigList = {
        "qigSummary": [
            {
                "examinerRole": 909,
                "markSchemeGroupId": 2,
                "examSessionId": 7,
                "currentMarkingTarget": {
                    "markingMode": 30
                },
            }
        ],
        "success": true,
        "ErrorMessage": null
    };

    /* The examiner marks collection */
    let examinerMarksAndAnnotationsData =
        {
            "examinerMarkGroupDetails": {
                "33099": {
                    "allMarksAndAnnotations": [{
                        "enhancedOffPageComments": [],
                        "examinerMarksCollection": [],
                        "annotations": [
                            {
                                "annotationId": 12,
                                "examinerRoleId": 909,
                                "markSchemeGroupId": 100,
                                "imageClusterId": 261,
                                "outputPageNo": 1,
                                "pageNo": 2,
                                "dataShareLevel": 0,
                                "leftEdge": 475,
                                "topEdge": 150,
                                "zOrder": 0,
                                "width": 32,
                                "height": 32,
                                "red": 255,
                                "green": 0,
                                "blue": 0,
                                "transparency": 0,
                                "stamp": 11,
                                "freehand": null,
                                "rowVersion": null,
                                "clientToken": "0x86AD236E6546DD4DB830674707059E4C",
                                "markSchemeId": 907,
                                "markGroupId": 33099,
                                "candidateScriptId": 609,
                                "version": 1,
                                "definitiveMark": false,
                                "isDirty": true,
                                "questionTagId": 0,
                                "markingOperation": 1
                            },
                            {
                                "annotationId": 13,
                                "examinerRoleId": 909,
                                "markSchemeGroupId": 100,
                                "imageClusterId": 261,
                                "outputPageNo": 1,
                                "pageNo": 2,
                                "dataShareLevel": 0,
                                "leftEdge": 850,
                                "topEdge": 216,
                                "zOrder": 0,
                                "width": 32,
                                "height": 32,
                                "red": 255,
                                "green": 0,
                                "blue": 0,
                                "transparency": 0,
                                "stamp": 11,
                                "freehand": null,
                                "rowVersion": null,
                                "clientToken": "0x86AD236E6546DD4DB830674707059E4C",
                                "markSchemeId": 907,
                                "markGroupId": 33099,
                                "candidateScriptId": 609,
                                "version": 1,
                                "definitiveMark": false,
                                "isDirty": true,
                                "questionTagId": 0,
                                "markingOperation": 1
                            }],

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
                        "markGroupId": 33099,
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
            "wholeResponseQIGToRIGMapping": undefined,
            "success": true,
            "errorMessage": null,
        };

    let response = {
        responses: [{
            "markingProgress": 0,
            "allocatedDate": "2016-01-18T11:44:59.61",
            "updatedDate": "2016-01-18T11:44:59.617",
            "seedTypeId": 0,
            "unactionedExceptionCount": 0,
            "markGroupId": 16317,
            "displayId": "6370108",
            "esDisplayId": null,
            "hasAllPagesAnnotated": false,
            "totalMarkValue": 0.00,
            "hasBlockingExceptions": false,
            "resolvedExceptionsCount": 0,
            "hasMessages": false,
            "unreadMessagesCount": 0,
            "hasExceptions": false,
            "hasAdditionalObjects": false,
            "candidateScriptId": 4001,
            "documentId": 2914,
            "accuracyIndicatorTypeID": null,
            "absoluteMarksDifference": null,
            "totalMarksDifference": null,
            "baseColor": null,
            "startWithEmptyMarkGroup": null,
            "showOriginalMarkerName": null,
            "originalMarkerInitials": null,
            "originalMarkerSurname": null,
            "centreNumber": null,
            "centreCandidateNumber": null,
            "markChangeReasonVisible": null,
            "markChangeReason": null,
            "isReviewed": false,
            "setAsReviewedCommentId": 0,
            "sampleCommentId": 0,
            "sampleReviewCommentId": 0,
            "sampleReviewCommentCreatedBy": 0,
            "atypicalStatus": 0,
            "supervisorRemarkFinalMarkSetID": 0,
            "supervisorRemarkMarkChangeReasonID": 0,
            "originalMarkTotal": null,
            "tagId": 0,
            "tagOrder": 0,
            "isPirate": null,
            "isPromotedToReuseBucket": null,
            "candidateResponseTotalarkGroupID": 0,
            "allFilesViewed": false,
            "isWholeResponse": false,
            "candidateScriptMarkGroupId": 1996,
            "relatedRIGDetails": null
        }
        ],
        "maximumMark": 29,
        "hasNumericMark": true,
        "hasSeedTargets": false
    }


    var examinerMarksAndAnnotationsString = JSON.stringify(examinerMarksAndAnnotationsData);
    examinerMarksAndAnnotations = JSON.parse(examinerMarksAndAnnotationsString);
    /* dispatching retrieve marks to set the predefines marks and annotations collection to the marking store */
    var getMarksAction: retrieveMarksAction = new retrieveMarksAction(examinerMarksAndAnnotations, true, 33099);
    dispatcher.dispatch(getMarksAction);

    let responseList = JSON.parse(JSON.stringify(response));
    responseList.responses = Immutable.List(responseList.responses);

    // open response
    dispatcher.dispatch(
        new responseOpenAction(
            true,
            6370108,
            enums.ResponseNavigation.specific,
            enums.ResponseMode.open,
            33099,
            enums.ResponseViewMode.fullResponseView,
            enums.TriggerPoint.None,
            null, 0, 0));

    /*Dispatch action to set data in qig store */
    let overviewData = qigList;
    overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
    dispatcher.dispatch(new qigSelectorDatafetchAction(true, 2, true, overviewData));

    it('checking if page option is rendered', () => {
        let pageOptionsProps = { pageNumber: 5, markThisButtonClickCallback: jest.genMockFn(), 
                                 updatePageOptionButtonPositionCallback: jest.genMockFn(), 
                                 pageOptionElementRefCallback: jest.genMockFn(),
                                 optionButtonWrapperElementRefCallback: jest.genMockFn(),
                                 isPageOptionButtonsShown: true
                               }
        let pageOptionComponent = react.createElement(PageOptions, pageOptionsProps, null);
        let pageOptionsDom = reactTestUtils.renderIntoDocument(pageOptionComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(pageOptionsDom, 'page-options');
        expect(result.className).toBe('page-options hovered');
    });
});