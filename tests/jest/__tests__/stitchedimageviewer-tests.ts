jest.dontMock('../../../src/components/response/responsescreen/stitchedimageviewer');

import react = require('react');
import reactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');

import StitchedImageViewer = require('../../../src/components/response/responsescreen/stitchedimageviewer');

describe("Tests for stitched image zone component", function () {

    let renderedOutput;

    beforeEach(() => {

        var stitchedZoneProps = {
            imageZones: [
               {
                   uniqueId: 0,
                   imageClusterId: 0,
                   pageNo: 1,
                   sequence: 1,
                   leftEdge: 0,
                   topEdge: 0,
                   width: 0,
                   height: 0
                },
               {
                   uniqueId: 0,
                   imageClusterId: 0,
                   pageNo: 3,
                   sequence: 1,
                   leftEdge: 0,
                   topEdge: 0,
                   width: 0,
                   height: 0
               }
            ],
            candidateScriptId: 1,
            images: [
                'testImage1', 'testImage2'
            ],
            maxWidth: 0,
            setMaxWidth: jest.genMockFn().mockReturnThis(),
            onImageLoaded: jest.genMockFn().mockReturnThis(),
            switchViewCallback: jest.genMockFn().mockReturnThis()
        };

        var stitchedImageZoneComponent = react.createElement(StitchedImageViewer, stitchedZoneProps);
        renderedOutput = reactTestUtils.renderIntoDocument(stitchedImageZoneComponent);
    });

    it('Test whether the stitched image zone component renders', function () {
        expect(renderedOutput).not.toBeNull();
    });

    it('Test whether the stitched image zone class renders', function () {
        var stitchedImgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-holder stiched');
        expect(stitchedImgDOM).not.toBeNull();
    });

    it('Test whether the stitched image zone renders more than one image', function () {
        var scryReactComponent = reactTestUtils.scryRenderedComponentsWithType(renderedOutput, StitchedImageViewer)[0];

        var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-img');
        expect(imgDOM.length).not.toBe(2);
    });
});