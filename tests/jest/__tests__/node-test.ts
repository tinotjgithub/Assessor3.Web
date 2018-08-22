import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import Node = require("../../../src/components/response/responsescreen/linktopage/node");
import treeViewItem = require("../../../src/stores/markschemestructure/typings/treeviewitem");
import enums = require("../../../src/components/utility/enums");
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import retrieveMarksAction = require("../../../src/actions/marking/retrievemarksaction");
import examinerMarkData = require("../../../src/stores/response/typings/examinermarkdata");
import dispatcher = require("../../../src/app/dispatcher");

/**
* Test suit for the answeritem
*/
describe("link to page node test", () => {

    var nodeProps = {
        selectedLanguage: "en - GB",
        id: "item1-1",
        node: {
            name: "1a",
            itemType: 5,
            parentClusterId: null,
            sequenceNo: 11001,
            markTypeVariety: 0,
            uniqueId: 1283,
            isVisible: true,
            maximumNumericMark: 2,
            index: 3,
            allocatedMarks: null,
            stepValue: 1,
            minimumNumericMark: 0,
            imageClusterId: 1082,
            availableMark: null,
            isSingleDigitMark: true,
            usedInTotal: true,
            nextIndex: 3,
            previousIndex: 0,
            previousMarks: null,
            markSchemeCount: 1,
            allowableDifference: null,
            positiveTolerance: 0,
            negativeTolerance: 0,
            allowNR: true,
            answerItemId: 1259,
            isUnZonedItem: false,
            markSchemeGroupId: 0,
            bIndex: 1,
            markCount: 0
        },
        isChildrenSkipped: false,
        renderedOn: 1519127004599,
        childNodes: null,
        currentPageNumber: 4,
        addLinkAnnotation: null,
        removeLinkAnnotation: null
    }

    /* The examiner marks collection */
    var examinerMarksAndAnnotation =
        {
            "examinerMarkGroupDetails": {
                "1612": {
                    "allMarksAndAnnotations": [
                        {
                            "enhancedOffPageComments": [],
                            "examinerMarksCollection": [],
                            "annotations": [
                                {
                                    "annotationId": 4636,
                                    "examinerRoleId": 2049,
                                    "markSchemeGroupId": 268,
                                    "imageClusterId": 1082,
                                    "outputPageNo": 0,
                                    "pageNo": 4,
                                    "dataShareLevel": 0,
                                    "leftEdge": 60,
                                    "topEdge": 60,
                                    "zOrder": 0,
                                    "width": 7,
                                    "height": 7,
                                    "dimension": null,
                                    "red": 255,
                                    "green": 0,
                                    "blue": 0,
                                    "transparency": 0,
                                    "stamp": 161,
                                    "comment": null,
                                    "freehand": null,
                                    "rowVersion": "AAAAAFIe9lw=",
                                    "clientToken": "af424cb7-1739-2457-70e3-6062e4dcb86a",
                                    "markSchemeId": 1283,
                                    "markGroupId": 1612,
                                    "candidateScriptId": 5989,
                                    "version": 0,
                                    "definitiveMark": false,
                                    "isDirty": false,
                                    "questionTagId": 0,
                                    "markingOperation": 0,
                                    "addedBySystem": false,
                                    "uniqueId": null
                                },
                                {
                                    "annotationId": 4635,
                                    "examinerRoleId": 2049,
                                    "markSchemeGroupId": 268,
                                    "imageClusterId": 1095,
                                    "outputPageNo": 0,
                                    "pageNo": 21,
                                    "dataShareLevel": 0,
                                    "leftEdge": 60,
                                    "topEdge": 60,
                                    "zOrder": 0,
                                    "width": 7,
                                    "height": 7,
                                    "dimension": null,
                                    "red": 255,
                                    "green": 0,
                                    "blue": 0,
                                    "transparency": 0,
                                    "stamp": 161,
                                    "comment": null,
                                    "freehand": null,
                                    "rowVersion": "AAAAAFIe89E=",
                                    "clientToken": "09ae60e2-585c-d15b-09aa-e6e3b5d04a64",
                                    "markSchemeId": 1287,
                                    "markGroupId": 1612,
                                    "candidateScriptId": 5989,
                                    "version": 0,
                                    "definitiveMark": false,
                                    "isDirty": false,
                                    "questionTagId": 0,
                                    "markingOperation": 0,
                                    "addedBySystem": false,
                                    "uniqueId": null
                                }
                            ],
                            "bookmarks": [],
                            "markedByInitials": null,
                            "markedBySurname": null,
                            "isDefault": false,
                            "absoluteMarksDifference": null,
                            "accuracyIndicator": 0,
                            "accuracyTolerance": 5.00,
                            "examinerMarks": [

                            ],
                            "maximumMarks": 0.0,
                            "totalMarks": 0.00,
                            "totalMarksDifference": null,
                            "totalTolerance": 5.00,
                            "examinerRoleId": 2049,
                            "markGroupId": 1612,
                            "markingProgress": 0,
                            "hasMarkSchemeLevelTolerance": false,
                            "version": 155,
                            "questionItemGroup": null,
                            "totalLowerTolerance": null,
                            "totalUpperTolerance": null,
                            "seedingAMDTolerance": null,
                            "submittedDate": "0001-01-01T00:00:00",
                            "remarkRequestTypeId": 0,
                            "baseColor": null,
                            "pooled": false,
                            "directed": false,
                            "originalMarkGroupId": 0,
                            "totalToleranceRemark": 0.0
                        }
                    ],
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
            "failureCode": 0
        };
    var examinerMarksString = JSON.stringify(examinerMarksAndAnnotation);
    var examinerMarks = JSON.parse(examinerMarksString);
    /* dispatching retrieve marks to set the predefines marks collection to the marking store */
    var getMarksAction: retrieveMarksAction = new retrieveMarksAction(examinerMarks, true, 1612);
    dispatcher.dispatch(getMarksAction);
    var openResponseAction: responseOpenAction =
        new responseOpenAction(true, 6717226, enums.ResponseNavigation.next, enums.ResponseMode.open, 1612, enums.ResponseViewMode.none,
            enums.TriggerPoint.Response);
    dispatcher.dispatch(openResponseAction);



    var nodeitemComponent = React.createElement(Node, nodeProps);
    var nodeitemComponentDOM = TestUtils.renderIntoDocument(nodeitemComponent)

    /**answeritem component rendering test */
    it("checks if the component rendered ", () => {
        let result = TestUtils.findRenderedDOMComponentWithClass(nodeitemComponentDOM, "question-item").className;
        expect(result).not.toBe(null);
    });

    it("checks if the question item is rendered ", () => {
        let result = TestUtils.findRenderedDOMComponentWithClass(nodeitemComponentDOM, "question-item selected-question").className;
        expect(result).toBe("question-item selected-question");
    });

    it("checks if link icon is rendered ", () => {
        let result = TestUtils.findRenderedDOMComponentWithClass(nodeitemComponentDOM, "question-link").className;
        expect(result).toBe("question-link");
    });
});