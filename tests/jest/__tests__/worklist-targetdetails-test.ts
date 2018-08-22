jest.dontMock("../../../src/components/worklist/targetsummary/targetdetails");

import ReactTestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');

import targetdetails = require("../../../src/components/worklist/targetsummary/targetdetails");
import markingTargetSummary = require("../../../src/stores/worklist/typings/markingtargetsummary");
import worklisttype = require("../../../src/components/worklist/targetsummary/worklisttype");

describe("workList left panel - Live tab target details", () => {

    var json;
    var markingtargetsummary: markingTargetSummary;

    json = {
        "examinerRoleID": 641,
        "markingModeID": 30,
        "remarkRequestTypeID": 0,
        "markingTargetDate": "01/01/2017",
        "maximumMarkingLimit": 10,
        "examinerProgress": {
            "openResponsesCount": 1,
            "closedResponsesCount": 2,
            "pendingResponsesCount": 1,
            "atypicalOpenResponsesCount?": 1
        },
        "isTargetCompleted": false,
        "targetCompletedDate": "02/01/2017"
    };

    markingtargetsummary = json;

    it("checks whether Live,Atypical and Supervisor Remark worklist is shown", () => {
        var targetdetailsProps = { markingTargetsSummary: markingtargetsummary }
        var targetdetailsComponent = React.createElement(targetdetails, targetdetailsProps);

        var renderOutput = ReactTestUtils.renderIntoDocument(targetdetailsComponent);

        var scryReactComponent = ReactTestUtils.scryRenderedComponentsWithType(renderOutput, worklisttype);

        for (var index = 0; index < scryReactComponent.length; index++) {
            if (index == 0) {
                expect(scryReactComponent[index].props.id).toBe("worklist_live");
            }
            else if (index == 1) {
                expect(scryReactComponent[index].props.id).toBe("worklist_atypical");
            }
        }
    });
});
