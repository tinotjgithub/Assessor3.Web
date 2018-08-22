jest.dontMock('../../../src/components/response/digital/ecoursework/playermodeicon');
import React = require('react');
import ReactDOM = require('react-dom');
import TestUtils = require('react-dom/test-utils');
import dispatcher = require('../../../src/app/dispatcher');
import PlayerModeIcon = require('../../../src/components/response/digital/ecoursework/playermodeicon');
import localAction = require('../../../src/actions/locale/localeaction');
import enums  =  require('../../../src/components/utility/enums');
import candidateECourseWorkMetadataRetrievalAction = require('../../../src/actions/script/candidateecourseworkmetadataretrievalaction');
import actionType = require('../../../src/actions/base/actiontypes');
import Immutable = require('immutable');
import eCourseWorkFileSelectAction = require('../../../src/actions/ecoursework/ecourseworkfileselectaction');
var localJson = require('../../../content/resources/rm-en.json');

describe('Test suite for Player mode icon', function () {

    let props = {
         isVisible: true,
        candidateScriptId: 4001,
        isAudioPlayer: true,
        playerMode: enums.MediaSourceType.OriginalFile,
    };

    beforeEach(() => {

        dispatcher.dispatch(new localAction(true, 'en-GB', localJson));

        let candidateECourseWorkMetadataJSON = {
            'files': [{
                'title': 'Audio 1',
                'docPageID': 1,
                'linkData': {
                    'mimeType': 'audio/mp4',
                    'mediaType': enums.MediaType.Audio,
                    'startPage': '1',
                    'endPage': '5',
                    'url': 'url',
                    'cloudType':  enums.CloudType.None,
                    'content': '',
                    'targetType': '',
                    'canDisplayInApplication': true,
                    'mediaFileName': 'Audio1.mp4'
                },
                'readStatus': true,
                'pageType': enums.PageType.Page,
                'linkType': 'string',
                'docPermission': 1,
                'alternateLink': [{
                    'title': 'Audio 1',
                    'docPageID': 2,
                    'linkData': {
                        'mimeType': 'audio/mp4',
                        'mediaType': enums.MediaType.Audio,
                        'startPage': '1',
                        'endPage': '5',
                        'url': 'url',
                        'cloudType':  enums.CloudType.None,
                        'content': '',
                        'targetType': '',
                        'canDisplayInApplication': true,
                        'mediaFileName': 'Audio1.mp4'
                    },
                    'readStatus': true,
                    'pageType': enums.PageType.Page,
                    'linkType': 'string',
                    'docPermission': 1,
                    'alternateLink': {},
                    'processed': true,
                    'convertedDocumentId': 10,
                    'rowVersion': '0XXC4',
                    'readProgressStatus': true,
                    'playerMode': enums.MediaSourceType.OriginalFile
                }],
                'processed': true,
                'convertedDocumentId': 10,
                'rowVersion': '0XXC4',
                'readProgressStatus': true,
                'playerMode': enums.MediaSourceType.OriginalFile
            }],
            'candidateScriptId': '4001',
            'markGroupId': '10'
        };

        let candidateECourseWorkMetadata = JSON.parse(JSON.stringify(candidateECourseWorkMetadataJSON));
        candidateECourseWorkMetadata.files = Immutable.List(candidateECourseWorkMetadata.files);

        dispatcher.dispatch(new eCourseWorkFileSelectAction(
                    candidateECourseWorkMetadata.files.first(), true, true));
    });

    it('checks player mode component is rendered', () => {

        let playerModeComponent = React.createElement(PlayerModeIcon, props);
        let videoPlayerDOM = TestUtils.renderIntoDocument(playerModeComponent);

        expect(videoPlayerDOM).not.toBeNull();
    });

    it('checks player mode classnames of rendered component based on state', () => {
        let playerModeComponent = React.createElement(PlayerModeIcon, props);
        let videoPlayerDOM = TestUtils.renderIntoDocument(playerModeComponent);

        var playerModeIcon = TestUtils.findRenderedDOMComponentWithClass(videoPlayerDOM, 'transcoded-file dropdown-wrap');
        expect(playerModeIcon.className).toBe('transcoded-file dropdown-wrap');

        videoPlayerDOM.setState({ isOpen: false});

        playerModeIcon = TestUtils.findRenderedDOMComponentWithClass(videoPlayerDOM,
            'transcoded-file dropdown-wrap close');
        expect(playerModeIcon.className).toBe('transcoded-file dropdown-wrap close');

        videoPlayerDOM.setState({ isOpen: true});

        playerModeIcon = TestUtils.findRenderedDOMComponentWithClass(videoPlayerDOM,
            'transcoded-file dropdown-wrap open');
        expect(playerModeIcon.className).toBe('transcoded-file dropdown-wrap open');
    });

    it('checks correct player mode is selected', () => {
        let playerModeComponent = React.createElement(PlayerModeIcon, props);
        let videoPlayerDOM = TestUtils.renderIntoDocument(playerModeComponent);

        var playerModeIcon = TestUtils.findRenderedDOMComponentWithClass(videoPlayerDOM, 'transcoded-file dropdown-wrap');
        playerModeIcon = TestUtils.findRenderedDOMComponentWithClass(videoPlayerDOM,
            'menu-item selected');
        expect(playerModeIcon.textContent).toBe('Play original file');
    });
});