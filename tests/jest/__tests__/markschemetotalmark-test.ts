jest.dontMock('../../../src/components/markschemestructure/markschemetotalmark')
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import MarkschemeTotalMark = require('../../../src/components/markschemestructure/markschemetotalmark');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/overviewdata");

describe('Checking whether the markschemeTotalMark component is rendering correctly', () => {
	
	let overviewData: overviewData;

	/* Create qig summary json object */
	let qigList = {
		"qigSummary": [
			{
				"examinerRole": 1471,
				"markSchemeGroupId": 186,
				"examinerQigStatus": 7,
				"currentMarkingTarget": {
					"markingMode": 30
				},
			}
		],
		"success": true,
		"ErrorMessage": null
	};

	/*Dispatch action to set data in qig store */
	overviewData = qigList;
	overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
	dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, overviewData));

    it("check if the props assigned to the markschemeTotalMark works", () => {

        var renderResult;
        var totalMarksProps = { actualMark: 50, maximumMark: 100 };
        var totalMarkComponent = React.createElement(MarkschemeTotalMark, totalMarksProps, null);
        renderResult = TestUtils.renderIntoDocument(totalMarkComponent);

        // Checking the total mark.
        var totalMark = TestUtils.findRenderedDOMComponentWithClass(renderResult, "marks-obtained");
        expect(parseInt(totalMark.textContent)).toBe(50);

        // Checking the maximum mark.
        var maximumMark = TestUtils.findRenderedDOMComponentWithClass(renderResult, "max-marks");
        expect(parseInt(maximumMark.textContent)).toBe(100);
    });
});