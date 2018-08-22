jest.dontMock("../../../src/components/markschemestructure/markbuttonscontainer");
import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import marksButtonContainer = require('../../../src/components/markschemestructure/markbuttonscontainer');
import updateCurrentQuestionItemAction = require("../../../src/actions/marking/updatecurrentquestionitemaction");
import currentQuestionItemInfo = require("../../../src/actions/marking/currentquestioniteminfo");
import retrieveMarksAction = require('../../../src/actions/marking/retrievemarksaction');
import enums = require('../../../src/components/utility/enums');
import responseOpenAction = require('../../../src/actions/response/responseopenaction');
import dispatcher = require('../../../src/app/dispatcher');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/overviewdata");
import Immutable = require("immutable");
import shallowRenderer  = require('react-test-renderer/shallow');

describe("Test suite for mark buttons container", () => {
    var shallowRender = new shallowRenderer();
    let overviewData: overviewData;
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

    let currentQuestionItem: currentQuestionItemInfo = {
        allocatedMarks: { displayMark: '2', valueMark: '2' },
        answerItemId: 1,
        allowNR: true,
        availableMarks: Immutable.List.of(
            { displayMark: '0', valueMark: '0' },
            { displayMark: '1', valueMark: '1' },
            { displayMark: '2', valueMark: '2' },
            { displayMark: '3', valueMark: '3' },
            { displayMark: '4', valueMark: '4' },
            { displayMark: '5', valueMark: '5' },
            { displayMark: '6', valueMark: '6' },
            { displayMark: '7', valueMark: '7' },
            { displayMark: '8', valueMark: '8' }),
        hasChild: false,
        imageClusterId: 87,
        index: 1,
        isSelected: true,
        isVisible: true,
        itemType: enums.TreeViewItemType.marksScheme,
        markingProgress: 100,
        maximumNumericMark: 8,
        name: '1a',
        parentClusterId: 23,
        sequenceNo: 4,
        totalMarks: 100,
        uniqueId: 365,
        markSchemeGroupId: 2
    };

    dispatcher.dispatch(new updateCurrentQuestionItemAction(true, currentQuestionItem));

    it("checking if marksbuttoncontainer is rendered when there is selected item in markscheme panel", () => {

        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 500 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        let marksButtonContainerDom = reactTestUtils.renderIntoDocument(marksButtonContainerComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-container").className;
        expect(result).toBe('mark-button-container');
    });

    it("checking the number of marks button to be rendered according to the height", () => {

        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 500 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        let marksButtonContainerDom = reactTestUtils.renderIntoDocument(marksButtonContainerComponent);
        let result = reactTestUtils.scryRenderedDOMComponentsWithClass(marksButtonContainerDom, "mark-button").length;
        expect(result).toBe(10);
    });

    /*it("checking if the down button is disabled and up button is enabled if the selected mark is present in the first set of marks to show", () => {

        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 500 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        let marksButtonContainerDom = reactTestUtils.renderIntoDocument(marksButtonContainerComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-nav down disabled").className
        expect(result).toBe('mark-button-nav down disabled');

        result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-nav up").className
        expect(result).toBe('mark-button-nav up');

    });*/

    it("checking if the down button is enabled and up button is disabled if the selected mark is present in the last set of marks to show", () => {
        currentQuestionItem.allocatedMarks = { displayMark: '8', valueMark: '8' };
        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 500 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        let marksButtonContainerDom = reactTestUtils.renderIntoDocument(marksButtonContainerComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-nav down").className
        expect(result).toBe('mark-button-nav down');
        result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-nav up").className
        expect(result).toBe('mark-button-nav up disabled');

    });

    it("checking if both up and down button are enabled if the selected mark is present in the middle set of marks to show", () => {
        currentQuestionItem.allocatedMarks = { displayMark: '7', valueMark: '7' };
        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 500 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        let marksButtonContainerDom = reactTestUtils.renderIntoDocument(marksButtonContainerComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-nav down").className
        expect(result).toBe('mark-button-nav down');

        result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button-nav up").className
        expect(result).toBe('mark-button-nav up');

    });

    it("checking if the selected mark is highlighted", () => {
        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 500 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        let marksButtonContainerDom = reactTestUtils.renderIntoDocument(marksButtonContainerComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(marksButtonContainerDom, "mark-button end-view active").textContent
        expect(result).toBe('7');
    });

    it("checking if marksbuttoncontainer is not rendered when there is no selected item in markscheme panel", () => {
        dispatcher.dispatch(new updateCurrentQuestionItemAction(true, null));
        let marksButtonContainerProps = { renderedOn: Date.now(), parentHeight: 740 }
        let marksButtonContainerComponent = react.createElement(marksButtonContainer, marksButtonContainerProps, null);
        shallowRender.render(marksButtonContainerComponent);
        let result = shallowRender.getRenderOutput();
        expect(result).toBeNull();
    });
});