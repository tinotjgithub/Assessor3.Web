jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/components/response/annotations/stampbase");
jest.dontMock('../../../src/components/response/annotations/dynamic/dynamicstampbase');
jest.dontMock('../../../src/components/response/annotations/dynamic/highlighter');
jest.dontMock("../../../src/stores/response/typings/annotation");
jest.dontMock("../../../src/stores/stamp/typings/stampdata");
jest.dontMock("../../../src/components/utility/enums");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import enums = require("../../../src/components/utility/enums");
import dynamicAnnotations = require("../../../src/components/response/annotations/dynamic/dynamicstampfactory");
import highlighter = require('../../../src/components/response/annotations/dynamic/highlighter');
import horizontalline = require('../../../src/components/response/annotations/dynamic/horizontalline');
let annotation =[ {
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
},
    {
        annotationId: 13668,
        blue: 0,
        candidateScriptId: 6930,
        clientToken: "1388554b-54f1-4dcb-af6c-c46393b876cf",
        comment: null,
        dataShareLevel: 0,
        definitiveMark: false,
        dimension: null,
        daexaminerRoleId: 1777,
        freehand: null,
        green: 0,
        height: 20,
        imageClusterId: 3797,
        isDirty: false,
        leftEdge: 915,
        markGroupId: 25795,
        markSchemeGroupId: 300,
        markSchemeId: 3873,
        markingOperation: 0,
        outputPageNo: 1,
        pageNo: 0,
        questionTagId: 0,
        red: 255,
        rowVersion: "AAAAAFEEEls=",
        stamp: 1361,
        topEdge: 848,
        transparency: 0,
        version: 0,
        width: 266,
        zOrder: 0
    }
]


describe("Dynamic Stamp Base Component Test", () => {
    /**Dynamic Stamp Base rendering test */

    let dynamicAnnotationProps = {
        imageWidth: 200,
        imageHeight: 100,
        annotationData: annotation[0],
        isActive: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };


    let dynamicAnnotationComponent = react.createElement(dynamicAnnotations, dynamicAnnotationProps, null);

    /**
     * highlighter properties
     */
    let highlighterProps = {
        id: 'highlighter_' + annotation[0].annotationId,
        key: 'highlighter_' + annotation[0].annotationId,
        annotationData: annotation[0],
        color: annotation[0].red + "," + annotation[0].blue + "," + annotation[0].green,
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    /**
     * create highter and render into the response
     */
    let highlighterComponent = react.createElement(highlighter, highlighterProps, null);

    let dynamicAnnotationComponentDOM = testUtils.renderIntoDocument(dynamicAnnotationComponent);

    let highligterInResponse = react.createElement(dynamicAnnotations, dynamicAnnotationProps, highlighterComponent);
    let renderedOutput = testUtils.renderIntoDocument(highligterInResponse);

    /** To check whether the Dynamic Stamp Base Component along with its Child Components has been loaded **/
    it("checks if the Dynamic annotations has been loaded inside the response", () => {
        expect(renderedOutput.props.children).not.toBeNull();
    });

    it("checks if the rendered component is a highlighter", () => {
        expect(renderedOutput.props.children.props.annotationData.stamp).toBe(151);
    });

    let hlineProps = {
        id: 'highlighter_' + annotation[1].annotationId,
        key: 'highlighter_' + annotation[1].annotationId,
        annotationData: annotation[1],
        color: annotation[1].red + "," + annotation[1].blue + "," + annotation[1].green,
        title: "HLine",
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };


  /**
 * create hline and render into the response
 */
    let hlineComponent = react.createElement(horizontalline, hlineProps, null);
    let hlineInResponse = react.createElement(dynamicAnnotations, dynamicAnnotationProps, hlineComponent);
    let hlineOutput = testUtils.renderIntoDocument(hlineInResponse);

    /** To check whether the Dynamic Stamp Base Component along with its Child Components has been loaded **/
    it("checks if the Dynamic Stamp Base component has been loaded", () => {
        expect(hlineOutput.props.children).not.toBeNull();
    });

    it("checks if the rendered component is a hline", () => {
        expect(hlineOutput.props.children.props.annotationData.stamp).toBe(1361);
    });

});

