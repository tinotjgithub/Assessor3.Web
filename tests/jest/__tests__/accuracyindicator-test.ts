import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require("../../../src/components/utility/enums");
import AccuracyIndicator = require("../../../src/components/worklist/shared/accuracyindicator");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");

describe("Test suite for Accuracy Indicator", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    //default value
    var className = "tolerance-level small-text";
    var accuracy = "Accurate";
    var accuracyIndicator = 1;
    var isTileView = false;
    var accuracyIndicator = <AccuracyIndicator accuracyIndicator= { accuracyIndicator } isTileView= { isTileView } selectedLanguage= { "en-GB"} />;


    it("checks if Accuracy Indicator component is rendered with correct class in Tile View For Accurate", () => {
    
        // to check component has been rendered
        var acuracyIndicatorDOM = TestUtils.renderIntoDocument(accuracyIndicator);
        expect(acuracyIndicatorDOM).not.toBeNull();

        // to check particular class name has been rendered
        var accuracyIndicatorClassName = TestUtils.findRenderedDOMComponentWithClass(acuracyIndicatorDOM, className).className;
        expect(accuracyIndicatorClassName).toBe(className);

        // to check particular content has been rendered
        var accuracyIndicatorText = TestUtils.findRenderedDOMComponentWithClass(acuracyIndicatorDOM, className).textContent;
        expect(accuracyIndicatorText).toBe(accuracy);
    });

    it("checks if Accuracy Indicator component is rendered with correct class in Tile View for In Tolerance", () => {

        //default value
        className = "tolerance-level small-text";
        accuracy = "In Tolerance";
        accuracyIndicator = 11;
        isTileView = false;
        accuracyIndicator = <AccuracyIndicator accuracyIndicator= { accuracyIndicator } isTileView= { isTileView } selectedLanguage= { "en-GB"} />;

        // to check component has been rendered
        var acuracyIndicatorDOM = TestUtils.renderIntoDocument(accuracyIndicator);
        expect(acuracyIndicatorDOM).not.toBeNull();

        // to check particular class name has been rendered
        var accuracyIndicatorClassName = TestUtils.findRenderedDOMComponentWithClass(acuracyIndicatorDOM, className).className;
        expect(accuracyIndicatorClassName).toBe(className);

        // to check particular content has been rendered
        var accuracyIndicatorText = TestUtils.findRenderedDOMComponentWithClass(acuracyIndicatorDOM, className).textContent;
        expect(accuracyIndicatorText).toBe(accuracy);
    });

    it("checks if Accuracy Indicator component is rendered with correct class in Tile View for Inaccurate", () => {

        //default value
        className = "tolerance-level small-text";
        accuracy = "Inaccurate";
        accuracyIndicator = 21;
        isTileView = false;
        accuracyIndicator = <AccuracyIndicator accuracyIndicator= { accuracyIndicator } isTileView= { isTileView } selectedLanguage= { "en-GB"} />;

        // to check component has been rendered
        var acuracyIndicatorDOM = TestUtils.renderIntoDocument(accuracyIndicator);
        expect(acuracyIndicatorDOM).not.toBeNull();

        // to check particular class name has been rendered
        var accuracyIndicatorClassName = TestUtils.findRenderedDOMComponentWithClass(acuracyIndicatorDOM, className).className;
        expect(accuracyIndicatorClassName).toBe(className);

        // to check particular content has been rendered
        var accuracyIndicatorText = TestUtils.findRenderedDOMComponentWithClass(acuracyIndicatorDOM, className).textContent;
        expect(accuracyIndicatorText).toBe(accuracy);
    });

});
