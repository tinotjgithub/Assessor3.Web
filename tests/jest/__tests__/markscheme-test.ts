jest.dontMock("../../../src/components/markschemestructure/markscheme");
import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import Markscheme = require("../../../src/components/markschemestructure/markscheme");
import treeViewItem = require("../../../src/stores/markschemestructure/typings/treeviewitem");

/**
* Test suit for the markscheme
*/
describe("markscheme test", () => {

    var navigateToMarkScheme = jest.genMockFn();
    var onMarkSchemeSelected = jest.genMockFn();

	/**markscheme component rendering test */
    it("checks if the component renderd ", () => {
        var allocatedMarks = {
            displayMark: '-';
            valueMark: '';
        }

        var nodeData = JSON.parse(JSON.stringify({
            "itemType": 3,
            "name": "Answer",
            "treeViewItemList": undefined,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": true,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 5,
            "allocatedMarks": allocatedMarks
        }));
        var markschemeComponent = <Markscheme selectedLanguage= { "en - GB"}  node= { nodeData } navigateToMarkScheme= {
            navigateToMarkScheme} onMarkSchemeSelected = { onMarkSchemeSelected } />;
        var markschemeComponentDOM = TestUtils.renderIntoDocument(markschemeComponent);

        let result = TestUtils.findRenderedDOMComponentWithClass(markschemeComponentDOM, "question-mark").className;
        expect(result).toBe("question-mark");

        /** test for the display mark value*/
        let mark = TestUtils.findRenderedDOMComponentWithClass(markschemeComponentDOM, "question-mark").textContent;
        expect(mark).toBe("-/5");
    });

    it("checks the marked question ", () => {
        var allocatedMarks = {
            displayMark: '2';
            valueMark: '';
        }

        var nodeData = JSON.parse(JSON.stringify({
            "itemType": 3,
            "name": "Answer",
            "treeViewItemList": undefined,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": true,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 5,
            "allocatedMarks": allocatedMarks
        }));
        var markschemeComponent = <Markscheme selectedLanguage= { "en - GB"}  node= { nodeData } navigateToMarkScheme= {
            navigateToMarkScheme} onMarkSchemeSelected = { onMarkSchemeSelected } />;
        var markschemeComponentDOM = TestUtils.renderIntoDocument(markschemeComponent);

        let result = TestUtils.findRenderedDOMComponentWithClass(markschemeComponentDOM, "question-item marked-question").className;
        expect(result).toBe("question-item marked-question");

        /** test for the display mark value*/
        let mark = TestUtils.findRenderedDOMComponentWithClass(markschemeComponentDOM, "question-mark").textContent;
        expect(mark).toBe("2/5");
    });

    it("checks the marked question which is not used for total ", () => {

        var nodeData = JSON.parse(JSON.stringify({
            "itemType": 3,
            "name": "Answer",
            "treeViewItemList": undefined,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": true,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 5,
            "allocatedMarks": {},
            "usedInTotal": false
        }));
        var markschemeComponent = <Markscheme selectedLanguage= { "en-GB"}  node= { nodeData } navigateToMarkScheme= {
            navigateToMarkScheme
        } onMarkSchemeSelected = { onMarkSchemeSelected } />;
        var markschemeComponentDOM = TestUtils.renderIntoDocument(markschemeComponent);

        let result = TestUtils.findRenderedDOMComponentWithClass(markschemeComponentDOM, "mark-version cur strike-out").className;
        expect(result).toBe("mark-version cur strike-out");
    });
});