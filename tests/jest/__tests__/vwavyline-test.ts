jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/stores/base/storebase");
jest.dontMock("../../../src/stores/locale/localestore");
jest.dontMock("../../../src/components/response/annotations/dynamic/dynamicstampbase");
jest.dontMock("../../../src/components/response/annotations/dynamic/vwavyline");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import localeStore = require("../../../src/stores/locale/localestore");
import vwavyline = require("../../../src/components/response/annotations/dynamic/vwavyline");
import dynamicAnnotations = require("../../../src/components/response/annotations/dynamic/dynamicstampfactory");
import annotationData = require("../../../src/stores/response/typings/annotation");
import enums = require("../../../src/components/utility/enums");

let vWavyData: annotationData = {
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
    stamp: 1381,
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

describe("vwavy Component Test", () => {
    /**vwavy component rendering test **/
    let vwavyProps = {
         id: 'vwavy_' + vWavyData.annotationId,
         key: 'vwavy_' + vWavyData.annotationId,
         annotationData: vWavyData,
         color: vWavyData.red + "," + vWavyData.blue + "," + vWavyData.green,
        imageWidth: 200,
        imageHeight: 100,
        title: "VWavy",
        isActive: true,
        isFade: false,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => imageContainerMockElement)
    };


    let vwavyComponent = react.createElement(vwavyline, vwavyProps, null);
     let vwavyComponentDOM = testUtils.renderIntoDocument(vwavyComponent);

    /** To check if the vwavy component has been loaded or not **/
    it("checks if vwavy component has been loaded", () => {
        expect(vwavyComponentDOM).not.toBeNull();
    });

    /** To check if the first span element has been loaded or not **/
    it("checks if the first span element has been loaded", () => {
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(vwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic vertical wavy line');

    });

    /** To check if the vwavy is rendered in the expected position or not according to the movement done **/
    it("checks if the vwavy is rendered in the expected position or not", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(vwavyComponentDOM, vwavyline)[0];
        scryReactComponent.setState({
            top: 10,
            left: 10,
            width: 0,
            height: 20
        });
        let vwavylineDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'annotation-wrap');
        expect(vwavylineDOM[0].style.top).toEqual('10%');
        expect(vwavylineDOM[0].style.left).toEqual('10%');
        expect(vwavylineDOM[0].style.height).toEqual('20%');
    });

    /** To check if the vwavyline Border is appearing while clicking or touching the vwavyline **/
    it("checks if the vwavyline is rendered with Border", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(vwavyComponentDOM, vwavyline)[0];

        /*setting the state of the vwavyline component*/
        scryReactComponent.setState({
            isShowBorder: true
        });
        
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(vwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic hover vertical wavy line');
    });

    /** To check if the vwavyline Border is disappearing while clicking outside or over another vwavyline **/
    it("checks if the vwavyline Border is disappeared or not", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(vwavyComponentDOM, vwavyline)[0];

        /*setting the state of the vwavyline component*/
        scryReactComponent.setState({
            isShowBorder: false
        });

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(vwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic vertical wavy line');
    });

    /** To check if the vwavyline is displayed as Faded for Uselected Responses **/
    it("checks if the vwavyline is displayed as Faded", () => {
        vwavyProps.isFade = true;
        let vwavyComponent = react.createElement(vwavyline, vwavyProps, null);
        let vwavyComponentDOM = testUtils.renderIntoDocument(vwavyComponent);
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(vwavyComponentDOM, vwavyline)[0];
        
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(vwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic inactive vertical wavy line');
    });

    /** To check if the vwavyline is displayed as not Faded for Selected Responses **/
    it("checks if the vwavyline is displayed as not Faded", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(vwavyComponentDOM, vwavyline)[0];

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(vwavyComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic vertical wavy line');
    });

    /** Checks if the vwavyline component Tooltip Text has displayed while mouse hovering **/
    it("Checks if the Tooltip Text has displayed as expected", () => {
        expect(vwavyComponentDOM.props.title).toEqual("VWavy");
    });

});
