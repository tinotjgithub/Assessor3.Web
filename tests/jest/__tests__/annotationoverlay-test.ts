
jest.dontMock('../../../src/components/response/responsescreen/annotationoverlay');

import React = require('react');
import ReactDOM = require('react-dom');
import testUtils = require('react-dom/test-utils');
import dispatcher = require('../../../src/app/dispatcher');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import updateCurrentQuestionItemAction = require('../../../src/actions/marking/updatecurrentquestionitemaction');
import dataRetrievalAction = require('../../../src/actions/base/dataretrievalaction');
import retrieveMarksAction = require('../../../src/actions/marking/retrievemarksaction');
import AnnotationOverlay = require('../../../src/components/response/responsescreen/annotationoverlay');
import Immutable = require('immutable');
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import enums = require("../../../src/components/utility/enums");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/overviewdata");

describe('Checking whether the AnnotationOverlay component is rendering correctly', () => {

    let renderResult;
    let overviewData: overviewData;

    beforeEach(() => {

        /* Create qig summary json object */
        let qigList = {
            "qigSummary": [
                {
                    "examinerRole": 909,
                    "markSchemeGroupId": 2,
                    "examinerQigStatus": 7,
                    "currentMarkingTarget": {
                        "markingMode": 30
                    },
                }
            ],
            "success": true,
            "ErrorMessage": null
        };

        let ccData = {
            "configurableCharacteristics": [
                {
                    "ccName": "ColouredAnnotations",
                    "ccValue": "<ColouredAnnotation Status=\"On\" DefaultColour=\"#FFFF0000\"/>",
                    "valueType": 5,
                    "markSchemeGroupID": 2,
                    "questionPaperID": 0,
                    "examSessionID": 0
                }
            ],
            "success": true,
            "errorMessage": null
        }

        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));

        var examinerMarkDetails = {
            "examinerMarkGroupDetails": {
                "2": {
                    "allMarksAndAnnotations": [
                        {
                            "enhancedOffPageComments": [],
                            "examinerMarksCollection": [
                                {
                                    "markId": 6186,
                                    "candidateScriptId": 605,
                                    "examinerRoleId": 909,
                                    "markGroupId": 2,
                                    "markSchemeId": 907,
                                    "numericMark": 1,
                                    "markStatus": null,
                                    "markingComplete": true,
                                    "examinerComment": null,
                                    "shareLevel": 0,
                                    "accuracyIndicator": 0,
                                    "rowVersion": "AAAAAEe02LE=",
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
                                    "markingOperation": 0
                                }
                            ],
                            "annotations": [],
                            "bookmarks": [],
                            "absoluteMarksDifference": null,
                            "accuracyIndicator": 0,
                            "accuracyTolerance": 2,
                            "examinerMarks": null,
                            "maximumMarks": 0,
                            "totalMarks": 28,
                            "totalMarksDifference": null,
                            "totalTolerance": 4,
                            "examinerRoleId": 909,
                            "markGroupId": 2,
                            "markingProgress": 100,
                            "hasMarkSchemeLevelTolerance": false,
                            "version": 10,
                            "questionItemGroup": null,
                            "totalLowerTolerance": null,
                            "totalUpperTolerance": null,
                            "seedingAMDTolerance": null,
                            "submittedDate": "0001-01-01T00:00:00",
                            "remarkRequestTypeId": 0
                        }
                    ],
                    "examinerDetails": null,
                    "startWithEmptyMarkGroup": false,
                    "showPreviousMarks": false,
                    "markerMessage": null,
                    "showMarkerMessage": false
                }
            },
            "wholeResponseQIGToRIGMapping": [{
                "2": {
                    "authenticatedExaminerRoleId": 1650,
                    "examinerRoleId": 909,
                    "isRetained": true,
                    "markGroupId": 2,
                    "markSchemeGroupId": 2
                }
            }],
            "success": true,
            "errorMessage": null
        }

        /*Dispatch action to set data in qig store */
        overviewData = qigList;
        overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 2, true, overviewData));

        var retrieveAction = new retrieveMarksAction(examinerMarkDetails, true, 2);
        dispatcher.dispatch(retrieveAction);
        dispatcher.dispatch(new responseOpenAction(true, 12, 1, 1, 2));

        var current = {
            itemType: 1,
            name: '',
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1,
            answerItemId: 1,
            isVisible: true,
            maximumNumericMark: 1,
            hasChild: true,
            imageClusterId: null,
            isSelected: true,
            index: 1,
            allocatedMarks: '',
            totalMarks: '',
            markingProgress: 1,
            availableMarks: null,
            stepValue: 1,
            minimumNumericMark: 1,
            markSchemeGroupId: 2
        };

        dispatcher.dispatch(new updateCurrentQuestionItemAction(true, current));

        var overlayProps = {
            imageClusterId: 1,
            outputPageNo: 1,
            pageNo: 1,
            currentImageMaxWidth: 1,
            currentOutputImageHeight: 1,
            onMouseMove: jest.genMockFn,
            onContextMenu: jest.genMockFn
            getImageNaturalDimension: jest.genMockFn
        };

        var annotationOverlayComponent = React.createElement(AnnotationOverlay, overlayProps, null);
        renderResult = testUtils.renderIntoDocument(annotationOverlayComponent);
    });

    it("check if the annotation holder gets rendered", () => {
        var annotationHolderDOM = testUtils.findRenderedDOMComponentWithClass(renderResult, 'annotation-holder');
        expect(annotationHolderDOM).not.toBeNull();
    });
});