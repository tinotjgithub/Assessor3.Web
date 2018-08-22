jest.dontMock("../../../src/components/utility/treeview/treenode");
import React = require("react");
import ReactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import Treenode = require("../../../src/components/utility/treeview/treenode");
import LinkToPagePopup = require("../../../src/components/response/responsescreen/linktopage/linktopagepopup");
import Immutable = require("immutable");

/**
* Test suit for the treenode
*/
describe("linktopage popup test", () => {

    it("checks if the component is popup is rendered ", () => {
        let treenodeComponent = <LinkToPagePopup selectedLanguage= { "en - GB"} doOpen= { false} linkToPageButtonLeft= { 50} currentPageNumber= { 1}/>;
        let popupComponentDOM = reactTestUtils.renderIntoDocument(treenodeComponent)
        expect(popupComponentDOM).not.toBeNull();

        let result = reactTestUtils.findRenderedDOMComponentWithClass(popupComponentDOM, 'popup small link-to-page-popup in-page-popout popup-overlay close').className;
        expect(result).toBe("popup small link-to-page-popup in-page-popout popup-overlay close");
    });

    it("checks if popup header is rendered ", () => {
        let treenodeComponent = <LinkToPagePopup selectedLanguage= { "en - GB"} doOpen= { false} linkToPageButtonLeft= { 50}/>;
        let popupComponentDOM = reactTestUtils.renderIntoDocument(treenodeComponent)
        expect(popupComponentDOM).not.toBeNull();
        popupComponentDOM.setState({ renderedOn: Date.now() });
        jest.runAllTicks();

        let result = reactTestUtils.findRenderedDOMComponentWithClass(popupComponentDOM, 'popup-header').className;
        expect(result).toBe("popup-header");
    });

    it("checks if popup content section is rendered ", () => {
        let treenodeComponent = <LinkToPagePopup selectedLanguage= { "en - GB"} doOpen= { false} linkToPageButtonLeft= { 50} currentPageNumber= { 1}/>;
        let popupComponentDOM = reactTestUtils.renderIntoDocument(treenodeComponent)
        expect(popupComponentDOM).not.toBeNull();

        let result = reactTestUtils.findRenderedDOMComponentWithClass(popupComponentDOM, 'popup-content').className;
        expect(result).toBe("popup-content");
    });

    it("checks if popup footer is rendered ", () => {
        let treenodeComponent = <LinkToPagePopup selectedLanguage= { "en - GB"} doOpen= { false} linkToPageButtonLeft= { 50} currentPageNumber= { 1}/>;
        let popupComponentDOM = reactTestUtils.renderIntoDocument(treenodeComponent)
        expect(popupComponentDOM).not.toBeNull();

        let result = reactTestUtils.findRenderedDOMComponentWithClass(popupComponentDOM, 'popup-footer text-right').className;
        expect(result).toBe("popup-footer text-right");
    });
});