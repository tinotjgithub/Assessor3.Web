jest.dontMock("../../../src/components/response/digital/ecoursework/thumbnailitem");

import React = require("react");
import reactDom = require("react-dom");
import testUtils = require('react-dom/test-utils');
import dispatcher = require("../../../src/app/dispatcher");
import ThumbnailItem = require("../../../src/components/response/digital/ecoursework/thumbnailitem");
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");

/**
* Test suite for filename indicator.
*/
describe("thumbnail item tests", () => {
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let thumbnailItemDOM;

    var props = {
        url: './Image Example.jpg',
        fileName: 'Image Example.jpg',
        fileListPanelView: 1
    };
    
    var thumbnailItemComponent = React.createElement(ThumbnailItem, props);   
    
    thumbnailItemDOM = testUtils.renderIntoDocument(thumbnailItemComponent);  
    
    it("checks if Thumbnail-item component is rendered", () => {

        expect(thumbnailItemDOM).not.toBeNull();
    });

    it("checks if the Thumbnail-item component class renderd ", () => {
        var thumbnailItemDOMClass = testUtils.findRenderedDOMComponentWithClass(thumbnailItemDOM, 'thumbnail-image');
        expect(thumbnailItemDOMClass).not.toBeNull();
    });

    it("checks if the loading indicator is diplayed ", () => {
        var loadingIndicator = testUtils.findRenderedDOMComponentWithClass(thumbnailItemDOM, 'file-pre-loader');
        expect(loadingIndicator).not.toBeNull();
    });
});