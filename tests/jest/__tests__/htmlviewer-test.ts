import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import HtmlViewer = require('../../../src/components/digital/html/htmlviewer');

describe("Html viewer test", function () {

    var htmlViwerProps = {
        url: 'cbt-response/Cand1Q1.html',
        id: 'html-viewer',
        key: 'key-html-viewer',
        className: 'cbt-content-holder active',
        onLoadFn: Function,
        iframeID: 'iframe_HTML'
    };

    let htmlViewer = HtmlViewer(htmlViwerProps);
    let htmlViewerDOM = TestUtils.renderIntoDocument(htmlViewer);

    /** To check if the html viewer component has been rendered or not **/
    it("checks if the html viewer component has been rendered", () => {
        expect(htmlViewerDOM).not.toBeNull();
    });

    /** To check if the html viewer component has been rendered with proper class **/
    it("checks if the html viewer component has been rendered with proper class", () => {
        expect(htmlViewerDOM.className).toBe("cbt-content-holder active");
    });
});
