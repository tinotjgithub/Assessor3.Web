jest.dontMock("../../../src/components/worklist/shared/allpageannotationindicator");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import AllPageAnnotationIndicator = require("../../../src/components/worklist/shared/allpageannotationindicator");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import enums = require("../../../src/components/utility/enums");
import dispatcher = require("../../../src/app/dispatcher");
describe("Test suite for All Page Annotation Indiactor", function () {

    let ccData = {
        "configurableCharacteristics": [{
            "ccName": "ForceAnnotationOnEachPage",
            "ccValue": "true",
            "valueType": 1,
            "markSchemeGroupID": 0,
            "questionPaperID": 0,
            "examSessionID": 0
        }],
        "success": true,
        "errorMessage": null
    };

    dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup,0, ccData));
    /** Rendering All Page Annotation Indiactor component */
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon -- Tile View", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { true } isAllAnnotated= { false}  isMarkingCompleted= { false} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
          expect(allPageAnnotationIndiactorDOM).not.toBeNull();
    });

    /** Rendering All Page Annotation Indiactor component */
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon -- List View", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { false } isAllAnnotated= { false}  isMarkingCompleted= { false} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
        expect(allPageAnnotationIndiactorDOM).not.toBeNull();
    });

    /** To test whether the correct icon is rendered for SAll Page Annotation Indiactor - no icon in this case*/
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon -- Tile View", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { true } isAllAnnotated= { false}  isMarkingCompleted= { false} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
         expect(TestUtils.isDOMComponent(allPageAnnotationIndiactorDOM)).not.toBe(true);
    });

    /** To test whether the correct icon is rendered for SAll Page Annotation Indiactor - no icon in this case*/
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon -- List View", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { false } isAllAnnotated= { false}  isMarkingCompleted= { false} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
        expect(TestUtils.isDOMComponent(allPageAnnotationIndiactorDOM)).not.toBe(true);
    });

    /** To check whether the correct icon is rendering - expected icon - with cross */
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon-- Tile View ", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { true }  isAllAnnotated= { false} isMarkingCompleted= { true} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(allPageAnnotationIndiactorDOM, "sprite-icon").className;
        expect(responseIdClassName).toBe("sprite-icon note-and-cross-icon");
    });

    /** To check whether the correct icon is rendering - expected icon - with cross */
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon -- List View ", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { false }  isAllAnnotated= { false} isMarkingCompleted= { true} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(allPageAnnotationIndiactorDOM, "sprite-icon").className;
        expect(responseIdClassName).toBe("sprite-icon note-and-cross-icon");
    });

    /** To test whether the correct icon is rendered for SAll Page Annotation Indiactor - no icon in this case*/
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon-- Tile View ", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { true} isAllAnnotated= { true}  isMarkingCompleted= { true} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
         expect(TestUtils.isDOMComponent(allPageAnnotationIndiactorDOM)).not.toBe(true);
    });

    /** To test whether the correct icon is rendered for SAll Page Annotation Indiactor - no icon in this case*/
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon --List View ", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { false } isAllAnnotated= { true}  isMarkingCompleted= { true} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
        expect(TestUtils.isDOMComponent(allPageAnnotationIndiactorDOM)).not.toBe(true);
    });

    /** To test whether the correct icon is rendered for SAll Page Annotation Indiactor - no icon in this case*/
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon--Tile View ", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { true } isAllAnnotated= { true}  isMarkingCompleted= { false} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
         expect(TestUtils.isDOMComponent(allPageAnnotationIndiactorDOM)).not.toBe(true);
    });

    /** To test whether the correct icon is rendered for SAll Page Annotation Indiactor - no icon in this case*/
    it("checks if the All Page Annotation Indiactor component is renderd and displays the correct icon-- List View ", () => {
        var allPageAnnotationIndiactor = <AllPageAnnotationIndicator selectedLanguage= { "en-GB"} isTileView= { false } isAllAnnotated= { true}  isMarkingCompleted= { false} />;
        var allPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(allPageAnnotationIndiactor);
        expect(TestUtils.isDOMComponent(allPageAnnotationIndiactorDOM)).not.toBe(true);
    });
});