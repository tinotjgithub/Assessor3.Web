import React = require('react');
import testUtils = require('react-dom/test-utils');
import TeamListTreeView = require('../../../src/components/message/teamlisttreeview');
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
var localJson = require("../../../content/resources/rm-en.json");

describe("TeamList TreeView test", () => {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    let addressList = [{
        "examinerId": 33,
        "examinerRoleId": 2059,
        "surname": "Amitha",
        "initials": "A",
        "fullName": "A Amitha",
        "parent": {
            "examinerId": 32,
            "examinerRoleId": 2058,
            "surname": "Midhun",
            "initials": "Raj",
            "fullName": "Raj Midhun",
            "parent": null,
            "subordinates": null
        },
        "subordinates": [
            {
                "examinerId": 27,
                "examinerRoleId": 2053,
                "surname": "Shiny",
                "initials": "P",
                "fullName": "P Shiny",
                "parent": null,
                "subordinates": []
            },
            {
                "examinerId": 28,
                "examinerRoleId": 2054,
                "surname": "Saji",
                "initials": "S",
                "fullName": "S Saji",
                "parent": null,
                "subordinates": []
            },
            {
                "examinerId": 30,
                "examinerRoleId": 2056,
                "surname": "Nithin",
                "initials": "V",
                "fullName": "V Nithin",
                "parent": null,
                "subordinates": []
            },
            {
                "examinerId": 31,
                "examinerRoleId": 2057,
                "surname": "Dili",
                "initials": "j",
                "fullName": "j Dili",
                "parent": null,
                "subordinates": []
            }
        ],
        "success": true,
        "isOpen": true,
        "isCurrentExaminer": true,
        "isChecked": true,
        "toTeam": true
    }];

    var teamListTreeViewComp = <TeamListTreeView addressList={addressList} />;

    it("checks if teamlist treeview component is rendered", () => {

        // to check component has been rendered
        var componentDOM = testUtils.renderIntoDocument(teamListTreeViewComp);
        expect(componentDOM).not.toBeNull();
    });

});