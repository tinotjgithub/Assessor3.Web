import React = require("react");
import reactDom = require("react-dom");
import testUtils = require('react-dom/test-utils');
import dispatcher = require("../../../src/app/dispatcher");
import Multiline = require("../../../src/components/response/acetates/multiline");
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");

/**
* Test suite for multiline.
*/
describe("multiline tests", () => {
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let multilineDOM;
    var accetate = {
        acetateId: 1,
        acetateData: {
            acetateLines: [{
                colour: -65536,
                lineType: 1,
                points: [{ x: 1, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 6 }, { x: 7, y: 8 }]
            }, {
                colour: -65536,
                lineType: 1,
                points: [{ x: 11, y: 12 }, { x: 13, y: 14 }, { x: 15, y: 16 }, { x: 17, y: 18 }]
            }],
            backColour: -256,
            outputPageNumber: 0,
            shadeBackGround: false,
            toolType: 2,
            wholePageNumber: 1
        },
        examinerRoleId: 1,
        itemId: 1,
        shared: false,
        clientToken: "clientToken_clientToken",
        markingOperation: 0
    };

    var props = {
        acetateDetails: accetate,
        renderedOn: Date.now(),
        imageProps: {
            naturalHeight: 2315,
            naturalWidth: 1609,
            outputPageNo: 0
        },
        getAnnotationOverlayElement: undefined,
        linkingScenarioProps: {
            topAboveCurrentZone: false,
            zoneTop: 1,
            zoneLeft: 2,
            zoneHeight: 3,
            skippedZones: false
        },
        doApplyLinkingScenarios: true
    };

    var multilineComponent = React.createElement(Multiline, props);   
    
    multilineDOM = testUtils.renderIntoDocument(multilineComponent);  
    
    it("checks if multiline component is rendered", () => {

        expect(multilineDOM).not.toBeNull();
    });

    it("checks if the path(line) is renderd ", () => {
        var multilineDOMClass1 = testUtils.findRenderedDOMComponentWithClass(multilineDOM, 'overlay-element-svg');
        expect(multilineDOMClass1).not.toBeNull();
        var multilineDOMClass2 = testUtils.findRenderedDOMComponentWithClass(multilineDOM, 'overlay-hit-element-svg');
        expect(multilineDOMClass2).not.toBeNull();
    });

    it("checks if the points are rendered ", () => {
        var multilineDOMClass1 = testUtils.findRenderedDOMComponentWithClass(multilineDOM, 'overlay-plus-svg p_0_0');
        expect(multilineDOMClass1[0]).not.toBeNull();
    });
});