jest.dontMock("../../../src/components/response/toolbar/zoompanel/zoompanel")
jest.dontMock("../../../src/components/response/annotations/dynamic/highlighter");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import dispatcher = require("../../../src/app/dispatcher");
import zoomPanel = require("../../../src/components/response/toolbar/zoompanel/zoompanel")
import singleImageViewer = require("../../../src/components/response/responsescreen/singleimageviewer")
import highlighter = require("../../../src/components/response/annotations/dynamic/highlighter");
import updtaeDisplayAngleAction = require('../../../src/actions/response/updatedisplayangleofresponseaction');
import responseStore = require('../../../src/stores/response/responsestore');

describe("Zoom panel Component Test", () => {
    /**Zoom panel component rendering test **/

    let zoomPanelComponent = react.createElement(zoomPanel);

    let zoomPanelComponentDOM = testUtils.renderIntoDocument(zoomPanelComponent);

    /** To check if the Zoompanel component has been loaded or not **/
    it("checks if the zoompanel component has been loaded", () => {
        expect(zoomPanelComponentDOM).not.toBeNull();
    });

    /** Checks if the panel has opend on click **/
    it("Checks if the panel has opend on click", () => {
        zoomPanelComponentDOM.setState({ isZoomOptionOpen: true })
        let zoomOptionClass = testUtils.findRenderedDOMComponentWithClass(zoomPanelComponentDOM, 'mrk-zoom-icon dropdown-wrap').className;

        //Checking whether the expected css class is rendered.
        expect(zoomOptionClass).toBe('mrk-zoom-icon dropdown-wrap open');
    });

    /** Checks if Zoom In component has been rendered **/
    it("Checks if Zoom In component has been rendered", () => {
        let zoomInClass = testUtils.findRenderedDOMComponentWithClass(zoomPanelComponentDOM, 'border-button increase-zoom').className;

        //Checking whether the expected css class is rendered.
        expect(zoomInClass).toBe('border-button increase-zoom');
    });

    /** Checks if Zoom Out component has been rendered **/
    it("Checks if Zoom Out component has been rendered", () => {
        let zoomOutClass = testUtils.findRenderedDOMComponentWithClass(zoomPanelComponentDOM, 'border-button decrease-zoom').className;

        //Checking whether the expected css class is rendered.
        expect(zoomOutClass).toBe('border-button decrease-zoom');
    });

    /** Checks if Zoom Percentage component has been rendered **/
    it("Checks if Zoom Percentage component has been rendered", () => {
        let zoomPercentageClass = testUtils.findRenderedDOMComponentWithClass(zoomPanelComponentDOM, 'border-button zoom-level').className;

        //Checking whether the expected css class is rendered.
        expect(zoomPercentageClass).toBe('border-button zoom-level');
    });


    var scryReactComponent;
    var imageContainerMockElement = {
        'element': {
            'childElementCount': 1
        }
    }
    beforeEach(() => {
        var singleImageZoneProps = {
        currentImageZones: [{
            uniqueId: 0,
            imageClusterId: 0,
            pageNo: 1,
            sequence: 1,
            leftEdge: 0,
            topEdge: 0,
            width: 100,
            height: 200
        }],
        imageZone: {
            uniqueId: 0,
            imageClusterId: 0,
            pageNo: 1,
            sequence: 1,
            leftEdge: 0,
            topEdge: 10,
            width: 20,
            height: 40
        },
        image: "testImage",
        setMaxWidth: jest.genMockFn().mockReturnThis(),
        maxWidth: 500,
        onImageLoaded: jest.genMockFn().mockReturnThis(),
        switchViewCallback: jest.genMockFn().mockReturnThis(),
        getMarkSheetContainerProperties: jest.genMockFn().mockImplementation(() => imageContainerMockElement)
    };


    let singleImageViewerComponent = react.createElement(singleImageViewer, singleImageZoneProps);
    let singleImageViewerComponentDOM = testUtils.renderIntoDocument(singleImageViewerComponent);
    scryReactComponent = testUtils.scryRenderedComponentsWithType(singleImageViewerComponentDOM, singleImageViewer)[0];
    });
    /*Checks rotate clockwise functionality for a response*/
    it("Checks rotate clockwise functionality for a response", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 90, zoomPreference: 0 })
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent,'marksheet-wrapper');
        expect(imgDOM[0].style.transform).toBe('translate3d(-50% , -50%, 0) rotate(90deg)');
    });

    /*Checks rotate anti clockwise functionality for a response*/
    it("Checks rotate anti clockwise functionality for a response", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: -90, zoomPreference: 0 })
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-wrapper');
        expect(imgDOM[0].style.transform).toBe('translate3d(-50% , -50%, 0) rotate(-90deg)');
    });

    /** Checks if the response is loading as per the user option for Fit Width**/
    it("Checks if the response is loading as per the user option for Fit Width", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 0, zoomPreference: 0 })
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-holder');
        expect(imgDOM[0].style.width).toBe('100%');
    }
    );

    /** Checks if the response is loading as per the user option for Fit Height**/
    it("Checks if the response is loading as per the user option for Fit Height", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 0, zoomPreference: 1 })
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-holder');
        expect(imgDOM[0].style.width).not.toBe('100%');
    });

    /** Checks if the response is maintaining fit to width option on rotation**/
    it("Checks if the response is maintaining fit to width option on rotation", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 180, zoomPreference: 0 })
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-holder');
        expect(imgDOM[0].style.width).toBe('100%');
    }
    );

    /** Checks if the response is maintaining fit to height option on rotation**/
    it("Checks if the response is maintaining fit to height option on rotation", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 180, zoomPreference: 1 })
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-holder');
        expect(imgDOM[0].style.width).not.toBe('100%');
    });

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

    /**Highlighter Component rendering test after rotation**/
    let highlighterProps = {
        id: 'highlighter_' + highlighterData.annotationId,
        key: 'highlighter_' + highlighterData.annotationId,
        annotationData: highlighterData,
        color: highlighterData.red + "," + highlighterData.blue + "," + highlighterData.green,
        imageWidth: 200,
        imageHeight: 100,
        isActive: true,
        getMarkSheetContainerProperties: Function,
        isRemoveBorder: true,
        setCurrentAnnotationElement: Function,
        getAnnotationOverlayElement: jest.genMockFn().mockImplementation(() => { return undefined; })
    };


    let highlighterComponent = react.createElement(highlighter, highlighterProps, null);
    let highlighterComponentDOM = testUtils.renderIntoDocument(highlighterComponent);

    let scryHighligterComponent = testUtils.scryRenderedComponentsWithType(highlighterComponentDOM, highlighter)[0];

    let style: react.CSSProperties = {};
    style.top = scryHighligterComponent.state.top + "%";
    style.left = scryHighligterComponent.state.left + "%";
    style.width = scryHighligterComponent.state.width + "%";
    style.height = scryHighligterComponent.state.height + "%";

    let highlighterDOM = testUtils.findRenderedDOMComponentWithClass(scryHighligterComponent, 'annotation-wrap');

    it("checks if the Highlighter is rendered in the expected position or not after clockwise rotation", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 90, zoomPreference: 0 })
        expect(reactDOM.findDOMNode(highlighterDOM).style.top).toEqual(style.top);
        expect(reactDOM.findDOMNode(highlighterDOM).style.left).toEqual(style.left);
        expect(reactDOM.findDOMNode(highlighterDOM).style.width).toEqual(style.width);
        expect(reactDOM.findDOMNode(highlighterDOM).style.height).toEqual(style.height);
    });

    it("checks if the Highlighter is rendered in the expected position or not after anti-clockwise rotation", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: -90, zoomPreference: 0 })
        expect(reactDOM.findDOMNode(highlighterDOM).style.top).toEqual(style.top);
        expect(reactDOM.findDOMNode(highlighterDOM).style.left).toEqual(style.left);
        expect(reactDOM.findDOMNode(highlighterDOM).style.width).toEqual(style.width);
        expect(reactDOM.findDOMNode(highlighterDOM).style.height).toEqual(style.height);
    });

    it("checks if the Highlighter is rendered in the expected position or not after 180 degree rotation", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 180, zoomPreference: 0 })
        expect(reactDOM.findDOMNode(highlighterDOM).style.top).toEqual(style.top);
        expect(reactDOM.findDOMNode(highlighterDOM).style.left).toEqual(style.left);
        expect(reactDOM.findDOMNode(highlighterDOM).style.width).toEqual(style.width);
        expect(reactDOM.findDOMNode(highlighterDOM).style.height).toEqual(style.height);
    });

    it("checks if rotation angles against response is updated", () => {
        scryReactComponent.setState({ renderedOn: Date.now(), rotateAngle: 180, zoomPreference: 0 })
        dispatcher.dispatch(new updtaeDisplayAngleAction(scryReactComponent.state.rotateAngle, 'img_1', false));
        let displayAngleCollection = responseStore.instance.displayAnglesOfCurrentResponse;
        let angle: number;
        displayAngleCollection.map((x) => {
            angle = x;
        })
        expect(angle).toBe(scryReactComponent.state.rotateAngle);
    });

});