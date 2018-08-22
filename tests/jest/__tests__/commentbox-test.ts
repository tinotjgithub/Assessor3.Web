import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import CommentBox = require("../../../src/components/response/annotations/comments/commentbox");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");


describe("Test suite for Comment Box Component", function () {


    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    //default value
    var wrapperObj = {
        left: 100,
        top: 100
    }
    var renderedOn = Date.now;

    var annotation = [
        {
            "annotationId": 12,
            "examinerRoleId": 909,
            "markSchemeGroupId": 100,
            "imageClusterId": 261,
            "outputPageNo": 1,
            "pageNo": 2,
            "dataShareLevel": 0,
            "leftEdge": 475,
            "topEdge": 150,
            "zOrder": 0,
            "width": 32,
            "height": 32,
            "red": 255,
            "green": 0,
            "blue": 0,
            "transparency": 0,
            "stamp": 171,
            "freehand": null,
            "rowVersion": null,
            "clientToken": "0x86AD236E6546DD4DB830674707059E4C",
            "markSchemeId": 907,
            "markGroupId": 1461,
            "candidateScriptId": 609,
            "version": 1,
            "definitiveMark": false,
            "isDirty": true,
            "questionTagId": 0,
            "markingOperation": 1
        }];

    var commentBox = <CommentBox comment={"test comment"}
                markSchemeText = { "test markSchemeText" }
                topPosition = { 100 }
                leftPosition = { 100 }
                wrapper = { wrapperObj }
                rgbColor = { "rgb(230, 69, 61)" }
                selectedLanguage = { "en-GB" }
                annotationData = { annotation }
                renderedOn = { renderedOn }
                isCommentBoxReadOnly = { true}/>;

    it("checks if comment box component is rendered", () => {

        // to check component has been rendered
        var commentBoxDOM = TestUtils.renderIntoDocument(commentBox);
        expect(commentBoxDOM).not.toBeNull();
    });
}