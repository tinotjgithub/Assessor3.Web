jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/stores/base/storebase");
jest.dontMock("../../../src/components/response/annotations/dynamic/dynamicstampbase");
jest.dontMock("../../../src/components/response/annotations/dynamic/highlighter");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import highlighter = require("../../../src/components/response/annotations/dynamic/highlighter");
import dynamicAnnotations = require("../../../src/components/response/annotations/dynamic/dynamicstampfactory");
import annotationData = require("../../../src/stores/response/typings/annotation");
import enums = require("../../../src/components/utility/enums");

let highlighterData: annotationData = {
    annotationId: 11402,
    examinerRoleId: 1674,
    markSchemeGroupId: 290,
    imageClusterId: 3297,
    outputPageNo: 1,
    pageNo: 0,
    leftEdge: 1126,
    topEdge: 1155,
    zOrder: 0,
    width: 32,
    height: 32,
    red: 255,
    green: 0,
    blue: 0,
    transparency: 0,
    stamp: 151,
    comment: null,
    freehand: null,
    rowVersion: null,
    clientToken: "19da37f1- 6276 - 4f71-af67 - 658331bf1302",
    markSchemeId: 3569,
    markGroupId: 1731,
    candidateScriptId: 6418,
    version: 0,
    definitiveMark: true,
    isDirty: false,
    questionTagId: 0
}

describe("Highlighter Component Test", () => {
    /**Highlighter component rendering test **/
     let highlighterProps = {
        id: 'highlighter_' + highlighterData.annotationId,
        key: 'highlighter_' + highlighterData.annotationId,
        annotationData: highlighterData,
        color: highlighterData.red + ", " + highlighterData.blue + ", " + highlighterData.green,
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        isFade: false,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };


    let highlighterComponent = react.createElement(highlighter, highlighterProps, null);
    let highlighterComponentDOM = testUtils.renderIntoDocument(highlighterComponent);

    /** To check if the Highlighter component has been loaded or not **/
    it("checks if the Highlighter component has been loaded", () => {
        expect(highlighterComponentDOM).not.toBeNull();
    });

    /** To check if the first span element has been loaded or not **/
    it("checks if the first span element has been loaded", () => {
        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(highlighterComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic');

    });

    /** To check if the Highlighter is rendered in the expected position or not according to the movement done **/
    it("checks if the Highlighter is rendered in the expected position or not", () => {

        let scryReactComponent = testUtils.scryRenderedComponentsWithType(highlighterComponentDOM, highlighter)[0];

        let style: react.CSSProperties = {};
        style.top = scryReactComponent.state.top + "%";
        style.left = scryReactComponent.state.left + "%";
        style.width = scryReactComponent.state.width + "%";
        style.height = scryReactComponent.state.height + "%";

        let highlighterDOM = testUtils.findRenderedDOMComponentWithClass(scryReactComponent, 'annotation-wrap');

        expect(reactDOM.findDOMNode(highlighterDOM).style.top).toEqual(style.top);
        expect(reactDOM.findDOMNode(highlighterDOM).style.left).toEqual(style.left);
        expect(reactDOM.findDOMNode(highlighterDOM).style.width).toEqual(style.width);
        expect(reactDOM.findDOMNode(highlighterDOM).style.height).toEqual(style.height);
    });

    /** To check if the Highlighter Border is appearing while clicking or touching the Highlighter **/
    it("checks if the Highlighter is rendered with Border", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(highlighterComponentDOM, highlighter)[0];

        /*setting the state of the highlighter component*/
        scryReactComponent.setState({
            isShowBorder: true
        });

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(highlighterComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic hover');
    });

    /** To check if the Highlighter Border is disappearing while clicking outside or over another Highlighter **/
    it("checks if the Highlighter Border is disappeared or not", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(highlighterComponentDOM, highlighter)[0];

        /*setting the state of the highlighter component*/
        scryReactComponent.setState({
            isShowBorder: false
        });

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(highlighterComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic');
    });

    /** To check if the Highlighter is displayed as Faded for Uselected Responses **/
    it("checks if the Highlighter is displayed as Faded", () => {
        highlighterProps.isFade = true;
        let highlighterComponent = react.createElement(highlighter, highlighterProps, null);
        let highlighterComponentDOM = testUtils.renderIntoDocument(highlighterComponent);
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(highlighterComponentDOM, highlighter)[0];

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(highlighterComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic inactive');
    });

    /** To check if the Highlighter is displayed as not Faded for Selected Responses **/
    it("checks if the Highlighter is displayed as not Faded", () => {
        let scryReactComponent = testUtils.scryRenderedComponentsWithType(highlighterComponentDOM, highlighter)[0];

        let scryReactElementFirstNode = testUtils.findRenderedDOMComponentWithClass(highlighterComponentDOM, 'annotation-wrap');
        expect(scryReactElementFirstNode.className).toBe('annotation-wrap dynamic');
    });

    /** Checks if the Highlighter SVG element is rendering properly **/
    it("Checks if the Tooltip Text is displaying as expected", () => {
        expect(reactDOM.findDOMNode(highlighterComponentDOM).lastChild.attributes.getNamedItem('id').value).toEqual(highlighterProps.id);
    });

    /** Checks if the Highlighter SVG Rect element color is filled as expected **/
    it("Checks if the Tooltip Text is displaying as expected", () => {
        let styleSVG: react.CSSProperties = {
            color: 'rgba(' + highlighterProps.color + ', 0.25)'
        };
        expect(testUtils.findRenderedDOMComponentWithTag(highlighterComponentDOM, 'rect').style.color).toEqual(styleSVG.color);
    });

    let addHighlighterProps = {
        annotationData: highlighterData,
        color: highlighterData.red + ", " + highlighterData.blue + ", " + highlighterData.green,
        imageWidth: 60,
        imageHeight: 30,
        isActive: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    let addHighlighterComponent = react.createElement(highlighter, highlighterProps, null);
    let dynamicAnnotationComponent = react.createElement(dynamicAnnotations, addHighlighterProps, null);

    let dynamicAnnotationComponentDOM = testUtils.renderIntoDocument(dynamicAnnotationComponent);

    let highligterInResponse = react.createElement(dynamicAnnotations, addHighlighterProps, addHighlighterComponent);
    let renderedOutput = testUtils.renderIntoDocument(highligterInResponse);

    /** To check whether the newly Added highlighter has been loaded **/
    it("checks if the newly Added highlighter has been loaded inside the response", () => {
        expect(renderedOutput.props.children).not.toBeNull();
    });
});
