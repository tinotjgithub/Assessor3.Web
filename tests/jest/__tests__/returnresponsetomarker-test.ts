jest.dontMock("../../../src/components/response/toolbar/supervisoricons/returnresponsetomarkericon");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import ReturnResponseToMarker = require('../../../src/components/response/toolbar/zoompanel/zoompanel');

describe("Return response to marker Component Test", () => {
    /**Return response to marker component rendering test **/

    let returnResponseToMarkerComponent = react.createElement(ReturnResponseToMarker);

    let returnResponseToMarkerComponentDOM = testUtils.renderIntoDocument(returnResponseToMarkerComponent);

    /** To check if the Return response to marker component has been loaded or not **/
    it("checks if the return response to marker component has been loaded", () => {
        expect(returnResponseToMarkerComponentDOM).not.toBeNull();
    });

});