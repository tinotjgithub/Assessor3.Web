import React = require("react");
import reactDom = require("react-dom");
import testUtils = require('react-dom/test-utils');
import FileNameIndicator = require("../../../src/components/response/responsescreen/filenameindicator");
import dispatcher = require("../../../src/app/dispatcher");
import displayFileNameAction = require('../../../src/actions/ecoursework/filenamedisplayaction');
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");

/**
* Test suite for filename indicator.
*/
describe("filename indicator tests", () => {
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let fileNameIndicatorDOM;

    var props = {
        renderedOn: Date.now()
    };

    var fileNameInfo = 'Image Example.jpg';

    var fileNameIndicatorComponent = React.createElement(FileNameIndicator, props);   
    
    fileNameIndicatorDOM = testUtils.renderIntoDocument(fileNameIndicatorComponent);  
    
    it("checks if filename indicator component is rendered", () => {

        expect(fileNameIndicatorDOM).not.toBeNull();
    });

    it("checks if the filename indicator component class renderd ", () => {
        var fileNameIndicatorDOMClass = testUtils.findRenderedDOMComponentWithClass(fileNameIndicatorDOM, 'response-file-name');
        expect(fileNameIndicatorDOMClass).not.toBeNull();
    });

    it("checks if the filename is diplayed in indicator ", () => {
        dispatcher.dispatch(new displayFileNameAction(fileNameInfo));
    });

    it("checking the translate ", () => {
        var fileNameIndicatorDOMClass = testUtils.findRenderedDOMComponentWithClass(fileNameIndicatorDOM, 'pn-line1');        
        expect(fileNameIndicatorDOMClass.textContent).toEqual('File name');       
    });
});