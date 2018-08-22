import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import DownLoadableFileItem = require("../../../src/components/response/digital/ecoursework/downloadablefileitem");

describe("Test suit for the downloadable file item component", function () {

    var downloadableFileItemProps = {fileName: "test"};
    var downloadableFileItemElement = DownLoadableFileItem(downloadableFileItemProps);
    var renderdownloadableFileItemComponent = TestUtils.renderIntoDocument(downloadableFileItemElement);

    it("Will check whether the downloadable file item component is visible", () => {
        expect(renderdownloadableFileItemComponent).not.toBeNull();
    });
});