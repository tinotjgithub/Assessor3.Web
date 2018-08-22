import React = require('react');
import testUtils = require('react-dom/test-utils');
import TeamListPopup = require('../../../src/components/message/teamlistpopup');
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import getLocksInQigsAction = require("../../../src/actions/qigselector/getlocksinqigsaction");
var localJson = require("../../../content/resources/rm-en.json");
import LocksInQigPopup = require('../../../src/components/qigselector/locksinqigpopup');
import ccData = require('../../../src/stores/configurablecharacteristics/typings/configurablecharacteristicsdata');
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import enums = require('../../../src/components/utility/enums');
import ReactDOM = require('react-dom');

describe(" Locks in qig popup test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let _locksInQigDetailsList: any;

    let ccData = {
        "configurableCharacteristics": [
            {
                "ccName": "StringFormat",
                "ccValue": "<StringFormat><OverviewQIGName>{QIGName}-{AssessmentIdentifier}</OverviewQIGName><Username>{Initials} {Surname}</Username></StringFormat>",
                "valueType": 5,
                "markSchemeGroupID": 0,
                "questionPaperID": 0,
                "examSessionID": 0
            }
        ],
        "success": true,
        "errorMessage": null
    };

    dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.ExamBody,0, ccData));
    
    let locksInQigDetailsListData = {
        ErrorMessage: null,
        Success: true,
        "locksInQigDetailsList":
        [
            {
                "qigId": 27,
                "noOfLocks": 2,
                "qigName": "qigName1",
                "assessmentCode" : "01",
                "questionPaperName": "questionPaperName",
                "componentId": "cs2014",
                "sessionName": "s1"
            },
            {
                "qigId": 22,
                "noOfLocks": 1,
                "qigName": "qigName2",
                "assessmentCode": "02",
                "questionPaperName": "questionPaperName",
                "componentId": "cs2014",
                "sessionName": "s1"
            }
        ]

    };

    _locksInQigDetailsList = JSON.parse(JSON.stringify(locksInQigDetailsListData));

    dispatcher.dispatch(new getLocksInQigsAction(true, _locksInQigDetailsList));

    var propsCols = {};

    propsCols = {
        showLocksInQigPopUp: false,
        id: 'LocksInQigPopup',
        key: 'LocksInQigPopup'
    };

    var locksInQigPopupComp = <div><LocksInQigPopup showLocksInQigPopUp= {true} /></div>;
    var locksInQigPopupDOM = testUtils.renderIntoDocument(locksInQigPopupComp);

    it("checks if qig popup component is rendered", () => {

        // to check component has been rendered
        expect(locksInQigPopupDOM).not.toBeNull();
    });

    it("checks if qig popup component is rendered with proper content", () => {
        let content: string = ReactDOM.findDOMNode(locksInQigPopupDOM).children[0].children[0].textContent;
        expect(content).toBe('Examiner(s) requiring feedbackYou currently have the following lock(s).Please select a question group to manage.2locks-qigName1-011lock-qigName2-02');
    });
});

