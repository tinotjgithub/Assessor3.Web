jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/stores/base/storebase");
jest.dontMock("../../../src/stores/locale/localestore");
jest.dontMock("../../../src/components/response/annotations/dynamic/dynamicstampbase");
jest.dontMock("../../../src/components/response/annotations/dynamic/hwavyline");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import localeStore = require("../../../src/stores/locale/localestore");
import hwavyline = require("../../../src/components/response/annotations/dynamic/hwavyline");
import dynamicAnnotations = require("../../../src/components/response/annotations/dynamic/dynamicstampfactory");
import annotationData = require("../../../src/stores/response/typings/annotation");
import enums = require("../../../src/components/utility/enums");

let hWavyData: annotationData = {
    annotationId: 48543,
    examinerRoleId: 1779,
    markSchemeGroupId: 300,
    imageClusterId: 3798,
    outputPageNo: 1,
    pageNo: 0,
    dataShareLevel: 0,
    leftEdge: 83,
    topEdge: 318,
    zOrder: 0,
    width: 499,
    height: 20,
    red: 255,
    green: 0,
    blue: 0,
    transparency: 0,
    stamp: 1371,
    comment: null,
    freehand: null,
    rowVersion: "AAAAAFEjnrw=",
    clientToken: "9d0c3a7a-c270-4024-b035-794901384cac",
    markSchemeId: 3874,
    markGroupId: 25770,
    candidateScriptId: 6951,
    version: 0,
    definitiveMark: false,
    isDirty: false,
    questionTagId: 0,
    markingOperation: 0
}

var imageContainerMockElement = {
    'id':'annotationOverlay_647',
    'getBoundingClientRect': Function
}

describe("HWavy Component Test", () => {
    /**HWavy component rendering test **/
    let hwavyProps = {
         id: 'hwavy_' + hWavyData.annotationId,
         key: 'hwavy_' + hWavyData.annotationId,
         annotationData: hWavyData,
         color: hWavyData.red + "," + hWavyData.blue + "," + hWavyData.green,
        imageWidth: 200,
        imageHeight: 100,
        title: "HWavy",
        isActive: true,
        isFade: false,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => imageContainerMockElement)
    };


    let hwavyComponent = react.createElement(hwavyline, hwavyProps, null);
     let hwavyComponentDOM = testUtils.renderIntoDocument(hwavyComponent);

    /** To check if the HWavy component has been loaded or not **/
    it("checks if HWavy component has been loaded", () => {
        expect(hwavyComponentDOM).not.toBeNull();
    });

    /** To check if the first span element has been loaded or not **/
    it("checks if the first span element has been loaded", () => {
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(hwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic horizontal wavy line');

    });

    /** To check if the HWavy is rendered in the expected position or not according to the movement done **/
    it("checks if the HWavy is rendered in the expected position or not", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(hwavyComponentDOM, hwavyline)[0];
        scryReactComponent.setState({
            top: 10,
            left: 10,
            width: 20,
            height: 0
        });
        let hwavylineDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'annotation-wrap');
        expect(hwavylineDOM[0].style.top).toEqual('10%');
        expect(hwavylineDOM[0].style.left).toEqual('10%');
        expect(hwavylineDOM[0].style.width).toEqual('20%');
    });

    /** To check if the hwavyline Border is appearing while clicking or touching the hwavyline **/
    it("checks if the hwavyline is rendered with Border", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(hwavyComponentDOM, hwavyline)[0];

        /*setting the state of the hwavyline component*/
        scryReactComponent.setState({
            isShowBorder: true
        });
        
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(hwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic hover horizontal wavy line');
    });

    /** To check if the hwavyline Border is disappearing while clicking outside or over another hwavyline **/
    it("checks if the hwavyline Border is disappeared or not", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(hwavyComponentDOM, hwavyline)[0];

        /*setting the state of the hwavyline component*/
        scryReactComponent.setState({
            isShowBorder: false
        });

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(hwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic horizontal wavy line');
    });

    /** To check if the hwavyline is displayed as Faded for Uselected Responses **/
    it("checks if the hwavyline is displayed as Faded", () => {
        hwavyProps.isFade = true;
        let hwavyComponent = react.createElement(hwavyline, hwavyProps, null);
        let hwavyComponentDOM = testUtils.renderIntoDocument(hwavyComponent);
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(hwavyComponentDOM, hwavyline)[0];
        
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(hwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic inactive horizontal wavy line');
    });

    /** To check if the hwavyline is displayed as not Faded for Selected Responses **/
    it("checks if the hwavyline is displayed as not Faded", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(hwavyComponentDOM, hwavyline)[0];

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(hwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic horizontal wavy line');
    });

    /** Checks if the hwavyline component Tooltip Text has displayed while mouse hovering **/
    it("Checks if the Tooltip Text has displayed as expected", () => {
        expect(hwavyComponentDOM.props.title).toEqual("HWavy");
    });

});
