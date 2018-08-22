jest.dontMock('../../../src/components/response/responsescreen/singleimageviewer');

import react = require('react');
import reactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');

import SingleImageViewer = require('../../../src/components/response/responsescreen/singleimageviewer');

describe("Tests for single image zone component", function () {

    let renderedOutput;
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
                topEdge: 0,
                width: 100,
                height: 200
            },
            image: "testImage",
            setMaxWidth: jest.genMockFn().mockReturnThis(),
            maxWidth: 500,
            onImageLoaded: jest.genMockFn().mockReturnThis(),
            switchViewCallback: jest.genMockFn().mockReturnThis(),
            getMarkSheetContainerProperties: jest.genMockFn().mockImplementation(() => imageContainerMockElement)
        };

        var singleImageZoneComponent = react.createElement(SingleImageViewer, singleImageZoneProps);
        renderedOutput = reactTestUtils.renderIntoDocument(singleImageZoneComponent);
    });

    it('Test whether the single image zone component renders', function () {
        expect(renderedOutput).not.toBeNull();
    });

    it('Test whether the single image zone renders only one image', function () {
        var scryReactComponent = reactTestUtils.scryRenderedComponentsWithType(renderedOutput, SingleImageViewer)[0];

        scryReactComponent.setState({
            renderedOn: Date.now()
        });

        var imgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(scryReactComponent, 'marksheet-img');
        expect(imgDOM.length).toBe(1);
    });
});