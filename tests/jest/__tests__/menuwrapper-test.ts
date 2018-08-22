import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import MenuWrapper = require("../../../src/components/menu/menuwrapper");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");

describe("Test suite for Menu Wrapper Component", function () {
    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var menuWrapper = <MenuWrapper />;

    it("checks if menu wrapper component is rendered", () => {

        // to check component has been rendered
        var componentDOM = TestUtils.renderIntoDocument(menuWrapper);
        expect(componentDOM).not.toBeNull();
    });
}