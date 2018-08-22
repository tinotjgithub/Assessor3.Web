jest.dontMock("../../../src/components/markschemestructure/cluster");
import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import Cluster = require("../../../src/components/markschemestructure/cluster");
import treeViewItem = require("../../../src/stores/markschemestructure/typings/treeviewitem");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/overviewdata");

/**
* Test suit for the cluster
*/
describe("cluster test", () => {

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

	/**cluster component rendering test */
    it("checks if the component renderd ", () => {
        var nodeData = JSON.parse(JSON.stringify({
            "itemType": 1,
            "name": "Answer",
            "treeViewItemList": undefined,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": true,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 5,
            "markSchemeCount": 5,
            "markCount":4
        }));

        var clusterComponent = <Cluster selectedLanguage= { "en - GB"} node= {nodeData}/>;
		var clusterComponentDOM = TestUtils.renderIntoDocument(clusterComponent)

        let result = TestUtils.findRenderedDOMComponentWithClass(clusterComponentDOM, "question-item").className;
        expect(result).toBe("question-item");
    });

    it("checks if the component renderd with marked back ground ", () => {
        var nodeData = JSON.parse(JSON.stringify({
            "itemType": 1,
            "name": "Answer",
            "treeViewItemList": undefined,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": true,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 5,
            "markSchemeCount": 5,
            "markCount": 5
        }));

        var clusterComponent = <Cluster selectedLanguage= { "en - GB"} node= { nodeData } />;
        var clusterComponentDOM = TestUtils.renderIntoDocument(clusterComponent)

        let result = TestUtils.findRenderedDOMComponentWithClass(clusterComponentDOM, "question-item").className;
        expect(result).toBe("question-item marked-question");
    });

    it("checks the cluster which is not used for total ", () => {

        var nodeData = JSON.parse(JSON.stringify({
            "itemType": 1,
            "name": "Answer",
            "treeViewItemList": undefined,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": true,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 5,
            "markSchemeCount": 5,
            "markCount": 5,
            "usedInTotal": false
        }));

        var clusterComponent = <Cluster selectedLanguage= { "en - GB"} node= { nodeData } />;
        var clusterComponentDOM = TestUtils.renderIntoDocument(clusterComponent)

        let result = TestUtils.findRenderedDOMComponentWithClass(clusterComponentDOM, "mark-version cur strike-out").className;
        expect(result).toBe("mark-version cur strike-out");
    });

});