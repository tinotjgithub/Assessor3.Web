import React = require('react');
import testUtils = require('react-dom/test-utils');
import TeamListPopup = require('../../../src/components/message/teamlistpopup');
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import getTeamAction = require("../../../src/actions/messaging/getteamaction");
var localJson = require("../../../content/resources/rm-en.json");

describe("Team List Popup test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let examinerRoleId = 1;
    let teamDetails = {
        "team": {
            "examinerId": 33,
            "examinerRoleId": 2059,
            "fullName": "A Amitha",
            "parent": {
                "examinerId": 32,
                "examinerRoleId": 2058,
                "fullName": "Raj Midhun",
                "parent": null,
                "subordinates": null
            },
            "subordinates": [
                {
                    "examinerId": 27,
                    "examinerRoleId": 2053,
                    "fullName": "P Shiny",
                    "parent": null,
                    "subordinates": []
                },
                {
                    "examinerId": 28,
                    "examinerRoleId": 2054,
                    "fullName": "S Saji",
                    "parent": null,
                    "subordinates": []
                },
                {
                    "examinerId": 30,
                    "examinerRoleId": 2056,
                    "fullName": "V Nithin",
                    "parent": null,
                    "subordinates": []
                },
                {
                    "examinerId": 31,
                    "examinerRoleId": 2057,
                    "fullName": "j Dili",
                    "parent": null,
                    "subordinates": []
                }
            ]
        },
        "success": true,
        "errorMessage": null
    };

    dispatcher.dispatch(new getTeamAction(true, teamDetails, examinerRoleId));

    var teamListPopupComp = <TeamListPopup isShowTeamListPopup={true} />;

    it("checks if teamlistpopup component is rendered", () => {

        // to check component has been rendered
        var componentDOM = testUtils.renderIntoDocument(teamListPopupComp);
        expect(componentDOM).not.toBeNull();
    });

});