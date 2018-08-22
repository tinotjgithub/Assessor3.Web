jest.dontMock("../../../src/components/utility/treeview/treeview");
import React = require("react");
import ReactDOM = require("react-dom");
import shallowRenderer = require('react-test-renderer/shallow');
import Treeview = require("../../../src/components/utility/treeview/treeview");
import treeViewItem = require("../../../src/stores/markschemestructure/typings/treeviewitem");
import Immutable = require("immutable");

/**
* Test suit for the treeview
*/
describe("treeview test", () => {

    var navigateToMarkScheme = jest.genMockFn().mockReturnThis();
    var onMarkSchemeSelected = jest.genMockFn().mockReturnThis();
	/**treeview component rendering test */
    it("checks if the component is renderd ", () => {

        let shallowRender = new shallowRenderer();

        let treeView = [{
            itemType: 1,
            name: "Question1",
            treeViewItemList: [{
                itemType: 3,
                name: "1a",
                treeViewItemList: undefined,
                parentClusterId: 1,
                sequenceNo: 1,
                uniqueId: 1001,
                isVisible: true,
                markSchemeTypeVariety: 1,
                maximumNumericMark: 5,
                allocatedMarks: 2,
                totalMarks: 0
            }, {
                    itemType: 3,
                    name: "1b",
                    treeViewItemList: undefined,
                    parentClusterId: 2,
                    sequenceNo: 2,
                    uniqueId: 1002,
                    isVisible: true,
                    markSchemeTypeVariety: 1,
                    maximumNumericMark: 6,
                    allocatedMarks: 3,
                    totalMarks: 0
                }
            ],
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1001,
            isVisible: true,
            markSchemeTypeVariety: 1,
            maximumNumericMark: 0
        }];

        let treeViewRoot: treeViewItem = JSON.parse(JSON.stringify(treeView));
        let immutableList = Immutable.List(treeViewRoot.treeViewItemList);
        treeViewRoot.treeViewItemList = immutableList;

        let treeviewComponent = <Treeview selectedLanguage= { "en-GB" }
                                    treeNodes = { treeViewRoot }
                                    offset = { 25}
                                    navigateToMarkScheme = { navigateToMarkScheme }
                                    onMarkSchemeSelected = { onMarkSchemeSelected}/>;

        shallowRender.render(treeviewComponent);
        let treeviewComponentDOM = shallowRender.getRenderOutput();

        expect(treeviewComponentDOM).not.toBeNull();

        expect(treeviewComponentDOM.props.className).toBe("question-group-align-holder");

	});
});