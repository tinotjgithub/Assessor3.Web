import React = require('react');
import testUtils = require('react-dom/test-utils');
import Sampling = require('../../../src/components/teammanagement/sampling/sampling');
import dispatcher = require("../../../src/app/dispatcher");
import enums = require('../../../src/components/utility/enums');
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");

describe("Sampling test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var samplingComponent = <Sampling />;

    var componentDOM = testUtils.renderIntoDocument(samplingComponent);

    it("checks if sampling component is rendered", () => {

        // to check component has been rendered
        expect(componentDOM).not.toBeNull();
    });

    it("checks if sampling component has particular class", () => {

        var result = testUtils.findRenderedDOMComponentWithClass(componentDOM,
            'supervisor-sampling-holder dropdown-wrap up white supervisor-remark-decision');
        expect(result).not.toBeNull();
    });

    it("checks if sampling component has radio button popup", () => {

        componentDOM.setState({ doHide: false });
        var result = testUtils.findRenderedDOMComponentWithClass(componentDOM,
            'supervisor-sampling-holder dropdown-wrap up white supervisor-remark-decision open');
        expect(result).not.toBeNull();
    });

});