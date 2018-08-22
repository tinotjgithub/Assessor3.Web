jest.dontMock("../../../src/components/markschemestructure/answeritem");
import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import Answeritem = require("../../../src/components/markschemestructure/answeritem");
import treeViewItem = require("../../../src/stores/markschemestructure/typings/treeviewitem");

/**
* Test suit for the answeritem
*/
describe("answeritem test", () => {
	/**answeritem component rendering test */
    it("checks if the component renderd ", () => {
        var nodeData = JSON.parse(JSON.stringify({
            itemType: 2,
            name: "Answer",
            treeViewItemList: undefined,
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1001,
            isVisible: true,
            markSchemeTypeVariety: 1,
            maximumNumericMark: 5,
            totalMarks: 4,
            markSchemeCount: 5,
            markCount: 4
        }));
        var answeritemComponent = <Answeritem selectedLanguage= { "en - GB"} node= {nodeData}/>;
		var answeritemComponentDOM = TestUtils.renderIntoDocument(answeritemComponent)

        let result = TestUtils.findRenderedDOMComponentWithClass(answeritemComponentDOM, "question-item").className;
        expect(result).toBe("question-item");


        /** test to display mark value*/
        let mark = TestUtils.findRenderedDOMComponentWithClass(answeritemComponentDOM, "question-mark").textContent;
        expect(mark).toBe("4/5");

        var nodeData = JSON.parse(JSON.stringify({
            itemType: 2,
            name: "Answer",
            treeViewItemList: undefined,
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1001,
            isVisible: true,
            markSchemeTypeVariety: 1,
            maximumNumericMark: 5,
            totalMarks: '-',
            markSchemeCount: 5,
            markCount: 4
        }));
         answeritemComponent = <Answeritem selectedLanguage= { "en - GB"} node= { nodeData } />;
         answeritemComponentDOM = TestUtils.renderIntoDocument(answeritemComponent);

         /** test to display '-' value*/
         mark = TestUtils.findRenderedDOMComponentWithClass(answeritemComponentDOM, "question-mark").textContent;
         expect(mark).toBe("-/5");
    });

    it("checks if the component renderd ", () => {
        var nodeData = JSON.parse(JSON.stringify({
            itemType: 2,
            name: "Answer",
            treeViewItemList: undefined,
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1001,
            isVisible: true,
            markSchemeTypeVariety: 1,
            maximumNumericMark: 5,
            totalMarks: 4,
            markSchemeCount: 4,
            markCount: 4
        }));
        var answeritemComponent = <Answeritem selectedLanguage= { "en - GB"} node= { nodeData } />;
        var answeritemComponentDOM = TestUtils.renderIntoDocument(answeritemComponent)

        let result = TestUtils.findRenderedDOMComponentWithClass(answeritemComponentDOM, "question-item").className;
        expect(result).toBe("question-item marked-question");

    });

    it("checks the answer item which is not used for total ", () => {

        var nodeData = JSON.parse(JSON.stringify({
            itemType: 2,
            name: "Answer",
            treeViewItemList: undefined,
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1001,
            isVisible: true,
            markSchemeTypeVariety: 1,
            maximumNumericMark: 5,
            totalMarks: 4,
            markSchemeCount: 4,
            markCount: 4,
            usedInTotal:false,
        }));
        var answeritemComponent = <Answeritem selectedLanguage= { "en - GB"} node= { nodeData } />;
        var answeritemComponentDOM = TestUtils.renderIntoDocument(answeritemComponent)

        let result = TestUtils.findRenderedDOMComponentWithClass(answeritemComponentDOM, "mark-version cur strike-out").className;
        expect(result).toBe("mark-version cur strike-out");
    });
});