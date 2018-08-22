jest.dontMock("../../../src/components/base/purerendercomponent");
jest.dontMock("../../../src/stores/base/storebase");
jest.dontMock("../../../src/stores/locale/localestore");
jest.dontMock("../../../src/components/response/annotations/dynamic/dynamicstampbase");
jest.dontMock("../../../src/components/response/annotations/dynamic/highlighter");
jest.dontMock("../../../src/components/response/toolbar/stamppanel/stamptype/dynamicstamp");


import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import localeStore = require("../../../src/stores/locale/localestore");
import highlighter = require("../../../src/components/response/annotations/dynamic/highlighter");
import annotationData = require("../../../src/stores/response/typings/annotation");
import dynamicStamp = require("../../../src/components/response/toolbar/stamppanel/stamptype/dynamicstamp");
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
    red: 0,
    green: 0,
    blue: 255,
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

let stamp: any = {
    stampId: 151
}

describe("Highlighter Component Test", () => {
    /**Highlighter component rendering test **/
    let highlighterProps = {
        id: 'highlighter_' + highlighterData.annotationId,
        key: 'highlighter_' + highlighterData.annotationId,
        annotationData: highlighterData,
        color: highlighterData.red + ", " + highlighterData.green + ", "  + highlighterData.blue,
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };

    let dynamicStampProps = {
        id: 'highlight-icon',
        key: 'highlight-icon',
        color: 'rgb(' + highlighterData.red + "," + highlighterData.green + ","  + highlighterData.blue + ')',
        toolTip: 'highlight',
        dropHandler: Function,
        stampData: stamp
    };

    let highlighterComponent = react.createElement(highlighter, highlighterProps, null);
    let highlighterComponentDOM = testUtils.renderIntoDocument(highlighterComponent);

    let dynamicStampComponent = react.createElement(dynamicStamp, dynamicStampProps, null);
    let dynamicStampComponentDOM = testUtils.renderIntoDocument(dynamicStampComponent);

    /** To check if the Highlighter component has been loaded or not **/
    it("checks if the Highlighter component has been loaded", () => {
        expect(highlighterComponentDOM).not.toBeNull();
    });

    /** To check if the dyanmic stamp component has been loaded or not **/
    it("checks if the Dynamic stamp component has been loaded", () => {
        expect(dynamicStampComponent).not.toBeNull();
    });

    it("checks if the response highlighter color is changed", () => {
        let styleSVG: react.CSSProperties = {
            color: 'rgba(' + highlighterProps.color + ', 0.25)'
        };
        expect(testUtils.findRenderedDOMComponentWithTag(highlighterComponentDOM, 'rect').style.color).toEqual(styleSVG.color);
    });

    it("checks if the toolbar highlighter stamp color is changed", () => {
        let styleSVG: react.CSSProperties = {
            fill: dynamicStampProps.color
        };
        expect(testUtils.findRenderedDOMComponentWithTag(dynamicStampComponentDOM, 'g').attributes.getNamedItem('fill').value);
    });

});
