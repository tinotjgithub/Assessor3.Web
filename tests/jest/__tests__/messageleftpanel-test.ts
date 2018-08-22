/// <reference path="../../../src/app/references.d.ts" />

import react = require('react');
import testUtils = require('react-dom/test-utils');
import MessageLeftPanel = require('../../../src/components/message/messageleftpanel');
import dispatcher = require("../../../src/app/dispatcher");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import ccData = require('../../../src/stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import cc = require('../../../src/stores/configurablecharacteristics/typings/configurablecharacteristic');
import enums = require('../../../src/components/utility/enums');
import Immutable = require('immutable');
import messageHelper = require('../../../src/components/utility/message/messagehelper');

describe("Message priority test", () => {

    let messageLeftPanelComponent;
    let messageLeftPanelComponentDOM;

    let ccData = {
        "configurableCharacteristics": [
            {
                "ccName": "StringFormat",
                "ccValue": "<StringFormat><OverviewQIGName>{QIGName}-{AssessmentIdentifier}</OverviewQIGName><Username>{Initials} {Surname}</Username></StringFormat>",
                "valueType": 5,
                "markSchemeGroupID": 300,
                "questionPaperID": 0,
                "examSessionID": 0
            }
        ],
        "success": true,
        "errorMessage": null
    };

    let message = [{
        "subject": "Subordinate Auto Approved",
        "qigId": 0,
        "fromExaminerId": 90,
        "toExaminerId": [85],
        "priorityName": "Important",
        "relatedResponseDisplayId": 0,
        "examinerMessageId": 366,
        "markSchemeGroupName": "MTAQA Question Item Group Name S11",
        "status": 1,
        "examinerDetails": { "surname": "Humbly", "initials": "D K", "fullName": "D K Humbly" },
        "displayDate": "2016-07-29T08:34:55.44",
        "assessment_Code": "MT6AI DECS11",
        "examinerMessageBodyFirstLine": "{\\\\rtf1\\\\ansi\\\\ansicpg1252\\\\deff0\\\\deflang2057{\\\\fonttbl{\\\\f0\\\\fnil\\\\fcharset0 Microsoft Sans Serif;}}\\\\viewkind4\\\\uc1\\\\pard\\\\f0\\\\fs17 Following successful standardisation on QIG \"MTAQA",
        "messageBody": "{\\\\rtf1\\\\ansi\\\\ansicpg1252\\\\deff0\\\\deflang2057{\\\\fonttbl{\\\\f0\\\\fnil\\\\fcharset0 Microsoft Sans Serif;}}\\r\\n\\\\viewkind4\\\\uc1\\\\pard\\\\f0\\\\fs17 Following successful standardisation on QIG \"MTAQA Question Item Group Name S11\", I have been auto approved.\\\\par\\r\\n}\\r\\n",
        "assessmentName": "D&T: PROD DES (TEX)1",
        "maxMessageBodyFirstLineWords": 10,
        "markSchemeGroupId": 116,
        "componentId": "MT6CIS11  ",
        "questionPaperName": "GCE D&T: PRODUCT DES (TEX) UNIT 1",
        "sessionName": "JUNE 2016 SERIES S8E",
        "toTeam": 1,
        "toExaminerDetails": { "surname": "Humbly", "initials": "D K", "fullName": "D K Humbly" }
    }];

    let _messages: Immutable.List<Message> = Immutable.List<Message>(message);
    var _messageGroupDetails = messageHelper.getGroupedMessageObject(_messages);

    /**Message priority dropdown component rendering test **/
    beforeEach(() => {
        var messageLeftPanelProps = {
            selectedMsg: _messages.first(),
            onSelectedMessageChanged: jest.genMockFn(),
            messageGroupDetails: _messageGroupDetails,
            searchData:  {
                isVisible: true,
                isSearching: false,
                searchText: ''
            },
            onSearch: jest.genMockFn(),
            onExpandOrCollapse: jest.genMockFn(),
        }

        dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.ExamBody, ccData));

        messageLeftPanelComponent = MessageLeftPanel(messageLeftPanelProps);
        messageLeftPanelComponentDOM = testUtils.renderIntoDocument(messageLeftPanelComponent);
    });

    /** To check if the Message left panel has been rendered or not **/
    it("checks if the Message left panel has been rendered", () => {
        expect(messageLeftPanelComponentDOM).not.toBeNull();
    });

});