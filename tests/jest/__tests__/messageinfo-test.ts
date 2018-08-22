import React = require('react');
import testUtils = require('react-dom/test-utils');
import MessageInfo = require('../../../src/components/message/messageinfo');
import dispatcher = require("../../../src/app/dispatcher");
import enums = require('../../../src/components/utility/enums');
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");

describe("Message info test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let message = {
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
        "toExaminerDetails": [{ "surname": "Humbly", "initials": "D K", "fullName": "D K Humbly" }],
        "messageFolderType": 1
    };

    var messageInfoComp = <MessageInfo message={message} />;

    it("checks if messageInfo component is rendered", () => {

        // to check component has been rendered
        var commentBoxDOM = testUtils.renderIntoDocument(messageInfoComp);
        expect(commentBoxDOM).not.toBeNull();
    });

});