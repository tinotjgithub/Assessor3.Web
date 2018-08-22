jest.dontMock("../../../src/components/response/digital/ecoursework/downloadicon");
import shallowRenderer  = require('react-test-renderer/shallow');
import React = require('react');
import ReactDOM = require('react-dom');
import DownloadIcon = require("../../../src/components/response/digital/ecoursework/downloadicon");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import enums = require("../../../src/components/utility/enums");

var source = '';
describe("Test suite for Download icon component", function () {
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();
    it("will check whether download icon rendered=? It should render", () => {
        var downloadiconprops = {src: "Test source" };
        var downloadIcon = React.createElement(DownloadIcon, downloadiconprops);
        shallowRender.render(downloadIcon);
        var renderDownloadIconRendered = shallowRender.getRenderOutput();
        expect(renderDownloadIconRendered).not.toBeNull();
    });  
})