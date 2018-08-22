jest.dontMock('../../../src/components/response/digital/ecoursework/audioplayer');
import React = require('react');
import ReactDOM = require('react-dom');
import TestUtils = require('react-dom/test-utils');
import dispatcher = require("../../../src/app/dispatcher");
import AudioPlayer = require("../../../src/components/response/digital/ecoursework/audioplayer");
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");
import actionType = require('../../../src/actions/base/actiontypes');
import Immutable = require('immutable');
import enums = require('../../../src/components/utility/enums');
import worklistAction = require("../../../src/actions/worklist/worklisttypeaction");
import responseOpenAction = require("../../../src/actions/response/responseopenaction");


describe("Test suite for Audio Player", function () {
    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var responseLiveOpenData: any;
    let worklistBase = {
        "responses": [{
            "displayId": "6370108",
            "markingProgress": 2,
            "allocatedDate": "2016-01-18T11:44:59.61",
            "updatedDate": "2016-01-18T11:44:59.617",
            "hasAllPagesAnnotated": false,
            "totalMarkValue": 2,
            "hasBlockingExceptions": false,
            "exceptionsCount": 0,
            "tagId": 1,
            "tagOrder": 5,
            "isDefinitiveResponse": false,
            "candidateScriptId": 4001
        }],
        "concurrentLimit": 5,
        "maximumMark": 29,
        "unallocatedResponsesCount": 658,
        "hasNumericMark": true,
        "success": true,
        "errorMessage": null
    }

    let responseList = JSON.parse(JSON.stringify(worklistBase));
    responseList.responses = Immutable.List(responseList.responses);
    dispatcher.dispatch(new responseOpenAction(true, 6370108, enums.ResponseNavigation.first,
        enums.ResponseMode.open, 50, enums.ResponseViewMode.none, enums.TriggerPoint.None, null, 1, 1));
    dispatcher.dispatch(new worklistAction(enums.WorklistType.live, enums.ResponseMode.open, enums.RemarkRequestType.Unknown, false, true, false, responseList, 186, 100, 101));
    let audioProps = {
        src: '1',
        alternateFileSource: null
    };


    let audioComponent = React.createElement(AudioPlayer, audioProps);
    let audioPlayerDOM = TestUtils.renderIntoDocument(audioComponent);


    it("checks if Audio Player component is rendered", () => {

        expect(audioPlayerDOM).not.toBeNull();

    });

    it("checks the play/pause button is present", () => {

        let playButton = TestUtils.findRenderedDOMComponentWithClass(audioPlayerDOM, "playback-icon");
        expect(playButton).not.toBeNull();
    });

    it("checks the slider control is present", () => {

        let slider = TestUtils.findRenderedDOMComponentWithClass(audioPlayerDOM, "slider-input time");
        expect(slider).not.toBeNull();
    });

    it("checks the volume control is present", () => {

        let volumeSlider = TestUtils.findRenderedDOMComponentWithClass(audioPlayerDOM, "player-control volume");
        expect(volumeSlider).not.toBeNull();
    });
});
