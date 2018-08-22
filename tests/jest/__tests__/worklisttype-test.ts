jest.dontMock("../../../src/components/worklist/targetsummary/worklisttype");

import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import worklisttype = require("../../../src/components/worklist/targetsummary/worklisttype");
import enums = require("../../../src/components/utility/enums");
import localAction = require("../../../src/actions/locale/localeaction");
import localStore = require("../../../src/stores/locale/localestore");
import dispatcher = require("../../../src/app/dispatcher");
var localJson = require("../../../content/resources/rm-en.json");
import worklistActionCreator = require("../../../src/actions/worklist/worklistactioncreator");
import qigselectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import OverviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import Immutable = require("immutable");

describe("worklist selection changed test", function () {
    var worklistTypeProps = { selectedLanguage: "en-GB", targetCount: 10, worklistType: enums.WorklistType.live };
    var renderResult = undefined;

    let overviewData: OverviewData;

    let qigList = {
        "qigSummary": [
            {
                "examinerRole": 1471,
                "markSchemeGroupId": 186,
                "markSchemeGroupName": "PHIL2 Whole Paper",
                "questionPaperName": "AQAMATH",
                "examinerApprovalStatus": 1,
                "questionPaperPartId": 196,
                "assessmentCode": "AQAM1",
                "componentId": "AQAM1               ",
                "sessionId": 7,
                "sessionName": "2013 July (Non-live Pilot)",
                "isESTDEnabled": true,
                "standardisationSetupComplete": false,
                "isESTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": true,
                "hasSTMSimulationMode": false,
                "isMarkFromPaper": false,
                "inSimulationMode": true,
                "status": 10,
                "currentMarkingTarget": {
                    "markingMode": 90,
                    "markingCompletionDate": "1753-01-01T00:00:00",
                    "maximumMarkingLimit": 9999,
                    "remarkRequestType": 0,
                    "submittedResponsesCount": 0,
                    "openResponsesCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0
                },
                "MarkingTargets": [
                    {
                        "markingMode": 2,
                        "markingCompletionDate": "2013-09-13T23:59:00.59",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 3,
                        "markingCompletionDate": "2013-09-15T23:59:00.59",
                        "maximumMarkingLimit": 1,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 30,
                        "markingCompletionDate": "2013-09-20T18:14:03.52",
                        "maximumMarkingLimit": 100,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    },
                    {
                        "markingMode": 90,
                        "markingCompletionDate": "1753-01-01T00:00:00",
                        "maximumMarkingLimit": 9999,
                        "remarkRequestType": 0,
                        "submittedResponsesCount": 0,
                        "openResponsesCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0
                    }
                ]
            }
        ],
        "success": true,
        "errorMessage": null
    };

    overviewData = JSON.parse(JSON.stringify(qigList));
    overviewData.qigSummary = Immutable.List(overviewData.qigSummary);

    beforeEach(() => {
        // Set the default locale
        dispatcher.dispatch(new localAction(true, "en-GB", localJson));
        dispatcher.dispatch(new qigselectorDatafetchAction(true, 186, true, overviewData));
        worklistActionCreator.notifyWorklistTypeChange = jest.genMockFn();
        var workListTypeElement = react.createElement(worklisttype, worklistTypeProps, null);
        renderResult = reactTestUtils.renderIntoDocument(workListTypeElement);
    });

    afterEach(() => {
        renderResult = undefined;
    });

    it("will render the component and check the worklist type name and count", () => {

        var markingModeName = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "left-submenu-item");
        expect(markingModeName.textContent).toContain("Live");

        var targetCount = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "menu-count");
        expect(targetCount.textContent).toBe("10");
    });

    it("Will call the mocked action creator method on worklist type changes", () => {
        var markingModeButton = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "left-submenu-item");
        reactTestUtils.Simulate.click(markingModeButton);
        expect(worklistActionCreator.notifyWorklistTypeChange).toBeCalled();
    });
});
