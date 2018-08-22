jest.dontMock("../../../src/components/worklist/shared/responseidgridelement");
import TestUtils = require('react-dom/test-utils');
import React = require("react");
import ReactDOM = require("react-dom");
import ResponseIdGridElement = require("../../../src/components/worklist/shared/responseidgridelement");

/**
* Test suit for the response id component of worklist columns.
*/
describe("Response id component test", () => {

    /** rendering response id component */
    it("checks if the value assigned to the allocatedandlastupdated date component renderd -- Tile View", () => {
        var responseIdComponent = <ResponseIdGridElement selectedLanguage= { "en-GB"} responseId= { "5000"} isTileView = {true}/>;
        var responseIdComponentDOM = TestUtils.renderIntoDocument(responseIdComponent);
        expect(responseIdComponentDOM).not.toBeNull();

        /** To test whether the correct component is rendered for responseid by checking the class name of the rendered div*/
         var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(responseIdComponentDOM, "resp-id").className;
         expect(responseIdClassName).toBe("resp-id response-display-id");
    });

    /** rendering response id component */
    it("checks if the value assigned to the allocatedandlastupdated date component renderd -- List View", () => {
        var responseIdComponent = <ResponseIdGridElement selectedLanguage= { "en-GB"} responseId= { "5000"} isTileView = { false }/>;
        var responseIdComponentDOM = TestUtils.renderIntoDocument(responseIdComponent);
        
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(responseIdComponentDOM, "response-display-id").className;
        expect(responseIdClassName).toBe("response-display-id resp-id");
    });
});
