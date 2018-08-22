jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/components/response/annotations/dynamic/highlighter");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import horizontalLine = require("../../../src/components/response/annotations/dynamic/horizontalline");
import annotationData = require("../../../src/stores/annotation/typings/annotationdata");
import dynamicAnnotations = require("../../../src/components/response/annotations/dynamic/dynamicstampfactory");

let hlineData: annotationData = {
    annotationId : 13668,
    blue: 0,
    candidateScriptId   :  6930,
    clientToken:  "1388554b-54f1-4dcb-af6c-c46393b876cf",
    comment:  null,
    dataShareLevel:  0,
    definitiveMark :  false,
    dimension:  null,
    daexaminerRoleId :  1777,
    freehand:  null,
    green:  0,
    height:  20,
    imageClusterId: 3797,
    isDirty : false,
    leftEdge: 915,
    markGroupId : 25795,
    markSchemeGroupId: 300,
    markSchemeId: 3873,
    markingOperation: 0,
    outputPageNo: 1,
    pageNo : 0,
    questionTagId : 0,
    red : 255,
    rowVersion: "AAAAAFEEEls=",
    stamp:1361,
    topEdge: 848,
    transparency:0,
    version:0,
    width : 266,
    zOrder:0
}

describe("Highlighter Component Test", () => {
    /**Horizontal line component rendering test **/
    let hlineProps = {
        id: 'highlighter_' + hlineData.annotationId,
        key: 'highlighter_' + hlineData.annotationId,
        annotationData: hlineData,
        color: hlineData.red + "," + hlineData.blue + "," + hlineData.green,
        title: "HLine",
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        //getAnnotationOverlayElement: Function,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    let hlineComponent = react.createElement(horizontalLine, hlineProps, null);
    let hlineComponentDOM = testUtils.renderIntoDocument(hlineComponent);

    /** To check if the HLine component has been loaded or not **/
    it("checks if the horizontal line component has been loaded", () => {
        expect(hlineComponentDOM).not.toBeNull();
    });

    /** Checks if the Line SVG id has rendered properly **/
    it("Checks if the Line SVG has rendered properly", () => {
        expect(hlineComponentDOM.props.id).toEqual("highlighter_" + hlineData.annotationId);

    });

    /** Checks if the HLine component Tooltip Text has displayed while mouse hovering **/
    it("Checks if the Tooltip Text has displayed as expected", () => {
        expect(hlineComponentDOM.props.title).toEqual("HLine");

    });
    /**
     * Hline props
     */
    let addHLiineProps = {
        annotationData: hlineData,
        color: hlineData.red + "," + hlineData.blue + "," + hlineData.green,
        imageWidth: 60,
        imageHeight: 30,
        isActive: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    let addEllipseComponent = react.createElement(horizontalLine, hlineProps, null);
    let dynamicAnnotationComponent = react.createElement(dynamicAnnotations, addHLiineProps, null);

    let dynamicAnnotationComponentDOM = testUtils.renderIntoDocument(dynamicAnnotationComponent);

    let hLineInResponse = react.createElement(dynamicAnnotations, addHLiineProps, addEllipseComponent);
    let renderedOutput = testUtils.renderIntoDocument(hLineInResponse);

    /** To check whether the newly Added horizontal line has been loaded **/
    it("checks if the newly Added horizontal line has been loaded inside the response", () => {
        expect(renderedOutput.props.children).not.toBeNull();
    });

});