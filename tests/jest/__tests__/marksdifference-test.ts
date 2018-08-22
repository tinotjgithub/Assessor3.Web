import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require("../../../src/components/utility/enums");
import MarksDifference = require("../../../src/components/worklist/shared/marksdifference");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");


describe("Test suite for Marks difference", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var clsName = "amd small-text";
    var marksDifferenceText = "marking.worklist.tile-view-labels.amd";
    var marksDifferenceTextOutput = "Absolute difference:";
    var mDifferenceValue = 5;

    /** To check if the Marks Difference component for AMD has been loaded or not **/
    it("checks if the Marks Difference component for AMD has been loaded", () => {
        var marksDifference = <MarksDifference title= { "title" } className= { clsName } marksDifference= { mDifferenceValue } marksDifferenceText= { marksDifferenceText } selectedLanguage= { "en-GB"} />;

        // to check component has been rendered
        var marksDifferenceDOM = TestUtils.renderIntoDocument(marksDifference);
        expect(marksDifferenceDOM).not.toBeNull();

        // to check particular class name has been rendered for AMD
        var marksDifferenceClassName = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceDOM, clsName).className;
        expect(marksDifferenceClassName).toBe(clsName);

        // to check particular content has been rendered for AMD
        var marksDifferenceContent = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceDOM, clsName).textContent;
        expect(marksDifferenceContent).toBe(marksDifferenceTextOutput + " " + mDifferenceValue);
    });

    /** To check if the Marks Difference component for TMD has been loaded or not **/
    it("checks if the Marks Difference component for TMD has been loaded", () => {
        clsName = "tmd small-text";
        marksDifferenceText = "marking.worklist.tile-view-labels.tmd";
        marksDifferenceTextOutput = "Total difference:";
        mDifferenceValue = 5;

        var marksDifference = <MarksDifference title= { "title" } className= { clsName } marksDifference= { mDifferenceValue } marksDifferenceText= { marksDifferenceText } selectedLanguage= { "en-GB"} />;

        // to check component has been rendered
        var marksDifferenceDOM = TestUtils.renderIntoDocument(marksDifference);
        expect(marksDifferenceDOM).not.toBeNull();

        // to check particular class name has been rendered for TMD
        var marksDifferenceClassName = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceDOM, clsName).className;
        expect(marksDifferenceClassName).toBe(clsName);

        // to check particular content has been rendered for TMD
        var marksDifferenceContent = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceDOM, clsName).textContent;
        expect(marksDifferenceContent).toBe(marksDifferenceTextOutput + " " + mDifferenceValue);

    });
});
