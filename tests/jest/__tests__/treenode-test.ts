jest.dontMock("../../../src/components/utility/treeview/treenode");
import React = require("react");
import ReactDOM = require("react-dom");
import shallowRenderer = require('react-test-renderer/shallow');
import Treenode = require("../../../src/components/utility/treeview/treenode");
import treeViewItem = require("../../../src/stores/markschemestructure/typings/treeviewitem");
import Immutable = require("immutable");

/**
* Test suit for the treenode
*/
describe("treenode test", () => {

    let navigateToMarkSchemeMock = jest.genMockFn();
    let onMarkSchemeSelectedMock = jest.genMockFn();

    /**treenode component rendering test */
    it("checks if the component is renderd ", () => {
        let treeNode = {
            itemType: 3,
            name: "1a",
            treeViewItemList: [{
                itemType: 3,
                name: "Answer",
                treeViewItemList: undefined,
                parentClusterId: 1,
                sequenceNo: 1,
                uniqueId: 1001,
                isVisible: true,
                markSchemeTypeVariety: 1,
                maximumNumericMark: 5
            }
            ],
            parentClusterId: 1,
            sequenceNo: 1,
            uniqueId: 1001,
            isVisible: true,
            markSchemeTypeVariety: 1,
            maximumNumericMark: 0
        };

        let shallowRender = new shallowRenderer();
        let rootNode: treeViewItem = JSON.parse(JSON.stringify(treeNode));
        let immutableList = Immutable.List(rootNode.treeViewItemList);
        rootNode.treeViewItemList = immutableList;

        let treenodeComponent = <Treenode selectedLanguage= { "en - GB"} children= { rootNode.treeViewItemList } node= { rootNode }
        navigateToMarkScheme = { navigateToMarkSchemeMock } onMarkSchemeSelected= { onMarkSchemeSelectedMock }  isWholeResponse= { false}/>;

        shallowRender.render(treenodeComponent);
        let treeviewComponentDOM = shallowRender.getRenderOutput();

        expect(treeviewComponentDOM).not.toBeNull();
        expect(treeviewComponentDOM.props.className).toBe("question-list has-sub open");
    });

    it("checks if the component is not rendered when is visible is false ", () => {

        let shallowRender = new shallowRenderer();

        let treeNode = {
            "itemType": 2,
            "name": "1a",
            "treeViewItemList": null,
            "parentClusterId": 1,
            "sequenceNo": 1,
            "uniqueId": 1001,
            "isVisible": false,
            "markSchemeTypeVariety": 1,
            "maximumNumericMark": 0
        };

        let rootNode: treeViewItem = JSON.parse(JSON.stringify(treeNode));

        let treenodeComponent = <Treenode selectedLanguage= { "en - GB"} children= { null } node= { rootNode }
        navigateToMarkScheme = { navigateToMarkSchemeMock } onMarkSchemeSelected= { onMarkSchemeSelectedMock } />;
        shallowRender.render(treenodeComponent);
        let renderTreenodeComponent = shallowRender.getRenderOutput();
        expect(renderTreenodeComponent).toBeNull();
    });

});