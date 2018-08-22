jest.dontMock('../../../src/components/response/responsescreen/unstructuredresponseimageviewer');

import react = require('react');
import reactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');

import UnStructuredResponseImageViewer = require('../../../src/components/response/responsescreen/unstructuredresponseimageviewer');

describe("Tests for unstructured image viewer component", function () {

    let renderedOutput;

    var unStructuredImageViewerProps = {
        imageUrl: 'image1',
        onImageLoaded: jest.genMockFn().mockReturnThis(),
        imageOrder:1
    };

    var unStructuredImageViewerComponent = react.createElement(UnStructuredResponseImageViewer, unStructuredImageViewerProps);
    renderedOutput = reactTestUtils.renderIntoDocument(unStructuredImageViewerComponent);

    it('Test whether the unstructured image viewer component renders', function () {
        expect(renderedOutput).not.toBeNull();
    });

    it('Test whether the unstructured image viewer class renders', function () {
        var stitchedImgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-holder');
        expect(stitchedImgDOM).not.toBeNull();
    });

    unStructuredImageViewerProps = {
        imageUrl: '',
        onImageLoaded: jest.genMockFn().mockReturnThis(),
        imageOrder: 1
    };

    unStructuredImageViewerComponent = react.createElement(UnStructuredResponseImageViewer, unStructuredImageViewerProps);
    renderedOutput = reactTestUtils.renderIntoDocument(unStructuredImageViewerComponent);

    it('Test whether the unstructured image viewer class not renders', function () {
        var stitchedImgDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'marksheet-holder');
        expect(stitchedImgDOM.length).toBe(1);
    });
});