import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import MetaData = require("../../../src/components/response/digital/ecoursework/metadata");
import immutable = require('immutable');

describe("Test suit for the metadata component", function () {

    var metaData = [{
        "Key": "Test",
        "Value": "Test",
        "Sequence": 0
    }];

    let metadataDetail: immutable.List<CoverSheetMetaData> = new immutable.List<CoverSheetMetaData>(metaData);
    var metaWrapperRefCallback = jest.genMockFn();
    var metaDataProps = {
        metadata: metadataDetail,
        title: "Test title",
        isFilelistPanelCollapsed: false,
        metaWrapperRefCallback: metaWrapperRefCallback
    };
    var metaDataElement = React.createElement(MetaData, metaDataProps);
    var renderMetaDataComponent = TestUtils.renderIntoDocument(metaDataElement);

    it("Will check whether the metadata component is visible", () => {
        let metaDataItem = TestUtils.findRenderedDOMComponentWithClass(renderMetaDataComponent, "meta-item");
        expect(metaDataItem).not.toBeNull();
        let metaDataItems = TestUtils.findRenderedDOMComponentWithClass(renderMetaDataComponent, "file-meta-inner");
        expect(metaDataItems).not.toBeNull();
    });
});