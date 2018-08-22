jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/components/response/annotations/dynamic/ellipse");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import ellipse = require("../../../src/components/response/annotations/dynamic/ellipse");
import annotationData = require("../../../src/stores/annotation/typings/annotationdata");
import dynamicAnnotations = require("../../../src/components/response/annotations/dynamic/dynamicstampfactory");

let ellipseData: annotationData = {
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
    stamp:1351,
    topEdge: 848,
    transparency:0,
    version:0,
    width : 266,
    zOrder:0
}

describe("Ellipse Component Test", () => {
    /**Ellipse component rendering test **/
    let ellipseProps = {
        id: 'ellipse_' + ellipseData.annotationId,
        key: 'ellipse_' + ellipseData.annotationId,
        annotationData: ellipseData,
        color: ellipseData.red + "," + ellipseData.blue + "," + ellipseData.green,
        title: "Ellipse",
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    let ellipseComponent = react.createElement(ellipse, ellipseProps, null);
    let ellipseComponentDOM = testUtils.renderIntoDocument(ellipseComponent);

    /** To check if the ellipse component has been loaded or not **/
    it("checks if the ellipse component has been loaded", () => {
        expect(ellipseComponentDOM).not.toBeNull();
    });

    /** Checks if the ellipse SVG id has rendered properly **/
    it("Checks if the ellipse SVG has rendered properly", () => {
        expect(ellipseComponentDOM.props.id).toEqual("ellipse_" + ellipseData.annotationId);

    });

    /** Checks if the ellipse component Tooltip Text has displayed while mouse hovering **/
    it("Checks if the Tooltip Text has displayed as expected", () => {
        expect(ellipseComponentDOM.props.title).toEqual("Ellipse");

    });

    /** To check if the Ellipse Border is appearing while clicking or touching the Ellipse **/
    it("checks if the Ellipse is rendered with Border", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(ellipseComponentDOM, ellipse)[0];

        /*Setting the state of the highlighter component*/
        scryReactComponent.setState({
            isShowBorder: true
        });

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(ellipseComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic hover ellipse');
    });

    /** To check if the Ellipse Border is disappearing while clicking outside or over another Ellipse **/
    it("checks if the Ellipse Border is disappeared or not", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(ellipseComponentDOM, ellipse)[0];

        /*setting the state of the highlighter component*/
        scryReactComponent.setState({
            isShowBorder: false
        });

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(ellipseComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic ellipse');
    });

    let addEllipseProps = {
        annotationData: ellipseData,
        color: ellipseData.red + "," + ellipseData.blue + "," + ellipseData.green,
        imageWidth: 60,
        imageHeight: 30,
        isActive: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    let addEllipseComponent = react.createElement(ellipse, ellipseProps, null);
    let dynamicAnnotationComponent = react.createElement(dynamicAnnotations, addEllipseProps, null);

    let dynamicAnnotationComponentDOM = testUtils.renderIntoDocument(dynamicAnnotationComponent);

    let ellipseInResponse = react.createElement(dynamicAnnotations, addEllipseProps, addEllipseComponent);
    let renderedOutput = testUtils.renderIntoDocument(ellipseInResponse);

    /** To check whether the newly Added ellipse has been loaded **/
    it("checks if the newly Added ellipse has been loaded inside the response", () => {
        expect(renderedOutput.props.children).not.toBeNull();
    });
});