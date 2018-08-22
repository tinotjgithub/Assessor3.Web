jest.dontMock("../../../src/components/worklist/shared/slaoannotationindicator");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import SLAOAnnotationIndicator = require("../../../src/components/worklist/shared/slaoannotationindicator");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import enums = require("../../../src/components/utility/enums");
import dispatcher = require("../../../src/app/dispatcher");
describe("Test suite for SLAO Annotation Indiactor", function () {

    let ccData = {
        "configurableCharacteristics": [{
            "ccName": "ForceAnnotationOnEachPage",
            "ccValue": "true",
            "valueType": 1,
            "markSchemeGroupID": 0,
            "questionPaperID": 0,
            "examSessionID": 0
        },
            {
                "ccName": "SLAOForcedAnnotations",
                "ccValue": "true",
                "valueType": 1,
                "markSchemeGroupID": 0,
                "questionPaperID": 0,
                "examSessionID": 0
            }],
        "success": true,
        "errorMessage": null
    };

    let ccData1 = {
        "configurableCharacteristics": [{
            "ccName": "ForceAnnotationOnEachPage",
            "ccValue": "false",
            "valueType": 1,
            "markSchemeGroupID": 0,
            "questionPaperID": 0,
            "examSessionID": 0
        },
            {
                "ccName": "SLAOForcedAnnotations",
                "ccValue": "true",
                "valueType": 1,
                "markSchemeGroupID": 0,
                "questionPaperID": 0,
                "examSessionID": 0
            }],
        "success": true,
        "errorMessage": null
    };

    dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));

    /** Rendering SLAO annotation indiactor component */
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon ", () => {
        var slaoPageAnnotationIndiactor = <SLAOAnnotationIndicator selectedLanguage= { "en-GB"} isResponseHasSLAO= { false } isAllAnnotated= { true } isMarkingCompleted= { false} isTileView = {false}/>;
        var slaoPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(slaoPageAnnotationIndiactor);
         expect(slaoPageAnnotationIndiactorDOM).not.toBeNull();
    });

    /** To check whether the correct icon is rendering - expected icon - none */
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon ", () => {
        var slaoPageAnnotationIndiactor = <SLAOAnnotationIndicator selectedLanguage= { "en-GB"} isResponseHasSLAO= { true } isAllAnnotated= { true } isMarkingCompleted= { false} isTileView = { true }/>;
        var slaoPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(slaoPageAnnotationIndiactor);
        expect(TestUtils.isDOMComponent(slaoPageAnnotationIndiactorDOM)).not.toBe(true);
    });

    /** To check whether the correct icon is rendering - expected icon - without cross */
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon ", () => {
        var slaoPageAnnotationIndiactor = <SLAOAnnotationIndicator selectedLanguage= { "en-GB"} isResponseHasSLAO= { true} isAllAnnotated= { true }  isMarkingCompleted= { false} isTileView = { false } />;
        var slaoPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(slaoPageAnnotationIndiactor);
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(slaoPageAnnotationIndiactorDOM,"sprite-icon").className;
        expect(responseIdClassName).toBe("sprite-icon bundle-icon");
    });

    /** To check whether the correct icon is rendering - expected icon - without cross */
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon ", () => {
        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData1));
        var slaoPageAnnotationIndiactor = <SLAOAnnotationIndicator selectedLanguage= { "en-GB"} isResponseHasSLAO= { true} isAllAnnotated= { true} isMarkingCompleted= { false} isTileView = { false } />;
        var slaoPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(slaoPageAnnotationIndiactor);
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(slaoPageAnnotationIndiactorDOM, "sprite-icon").className;
        expect(responseIdClassName).toBe("sprite-icon bundle-icon");
    });

    ///** To check whether the correct icon is rendering - expected icon - with cross AC-Point-2*/
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon ", () => {
        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup,0, ccData1));
        var slaoPageAnnotationIndiactor = <SLAOAnnotationIndicator selectedLanguage= { "en-GB"} isResponseHasSLAO= { true} isAllAnnotated= { false} isMarkingCompleted= { true} isTileView = { true } />;
        var slaoPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(slaoPageAnnotationIndiactor);
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(slaoPageAnnotationIndiactorDOM, "sprite-icon").className;
        expect(responseIdClassName).toBe("sprite-icon bundle-icon-cross");
    });

    /** To check whether the correct icon is rendering - expected icon - with out cross  (If all page cc is on SLAO cc is considered as off (AC - point-6)*/
    it("checks if the SLAO Annotation Indiactor component renderd and displays the correct icon ", () => {
        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup,0, ccData));
        var slaoPageAnnotationIndiactor = <SLAOAnnotationIndicator selectedLanguage= { "en-GB"} isResponseHasSLAO= { true} isAllAnnotated= { false} isMarkingCompleted= { false} isTileView = { false } />;
        var slaoPageAnnotationIndiactorDOM = TestUtils.renderIntoDocument(slaoPageAnnotationIndiactor);
        var responseIdClassName = TestUtils.findRenderedDOMComponentWithClass(slaoPageAnnotationIndiactorDOM, "sprite-icon").className;
        expect(responseIdClassName).toBe("sprite-icon bundle-icon");
    });

});