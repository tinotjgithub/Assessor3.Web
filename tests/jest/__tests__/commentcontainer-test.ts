import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import CommentContainer = require("../../../src/components/response/annotations/comments/commentcontainer");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");


describe("Test suite for Comment Container Component", function () {


    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var commentContainer = <CommentContainer selectedLanguage = { "en-GB" }/>;

    it("checks if comment container component is rendered", () => {

        // to check component has been rendered
        var commentContainerDOM = TestUtils.renderIntoDocument(commentContainer);
        expect(commentContainerDOM).not.toBeNull();
    });
}