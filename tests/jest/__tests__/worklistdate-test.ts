jest.dontMock("../../../src/components/worklist/shared/worklistdate");

import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import AllocatedAndLastUpdatedDate = require("../../../src/components/worklist/shared/worklistdate");
import enums = require("../../../src/components/utility/enums");

describe("Work List date component test", () => {

    /** rendering allocatedandlastupdateddate component for allocated date */
    it("checks if the value assigned to the allocatedandlastupdated date component renderd ", () => {
        var dateComponent = <AllocatedAndLastUpdatedDate dateType= { enums.WorkListDateType.allocatedDate }  dateValue={new Date()} selectedLanguage= { "en-GB"} />;
        var dateComponentDOM = TestUtils.renderIntoDocument(dateComponent);
        expect(dateComponentDOM).not.toBeNull();

        /** To test whether the correct component is rendered for allocated date*/
        var allocatedDateClassName = TestUtils.findRenderedDOMComponentWithClass(dateComponentDOM, "resp-allocated-date small-text").className;
        expect(allocatedDateClassName).toBe("resp-allocated-date small-text");
    });
});
