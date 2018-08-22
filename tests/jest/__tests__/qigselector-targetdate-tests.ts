import React = require('react');
import testUtils = require('react-dom/test-utils');
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import TargetDate = require("../../../src/components/qigselector/targetdate.tsx");
var localJson = require("../../../content/resources/rm-en.json");

describe("Test for checking the target date in QigItem", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var targetDateComp = <TargetDate 
                          displayTargetDate = {true}
                          markingCompletionDate = { Date.now() } />;

    it("checks if TargetDate component is rendered", () => {

        // to check component has been rendered
        var componentDOM = testUtils.renderIntoDocument(targetDateComp);
        expect(componentDOM).not.toBeNull();
    });

});