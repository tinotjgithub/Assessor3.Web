jest.dontMock('../../../src/components/qigselector/aggregatedqig');

import React = require("react");
import ReactTestUtils = require('react-dom/test-utils');
import AggregatedQig = require("../../../src/components/qigselector/aggregatedqig");
import OverviewData = require("../../../src/stores/qigselector/overviewdata");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");

describe("Test suite for aggregated qig component", () => {
    var renderedOutput;
    var overviewData: OverviewData;
    var aggregatedQigProps;
    let ccValue: string = "<Roles><Role><Name>Principal Examiner</Name><Permissions><Permission>Complete</Permission><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>EditDefinitives</Permission><Permission>ViewDefinitives</Permission><Permission>Classify</Permission><Permission>Declassify</Permission><Permission>MultiQIGProvisionals</Permission><Permission>ReuseResponses</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification><Classification>Seeding</Classification></Classifications></ViewByClassification></Role><Role><Name>Assistant Principal Examiner</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>EditDefinitives</Permission><Permission>ViewDefinitives</Permission><Permission>Classify</Permission><Permission>Declassify</Permission><Permission>MultiQIGProvisionals</Permission><Permission>ReuseResponses</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification><Classification>Seeding</Classification></Classifications></ViewByClassification></Role><Role><Name>Team Leader (Examiner)</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>ViewDefinitives</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification></Classifications></ViewByClassification></Role><Role><Name>Assistant Examiner</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>ViewDefinitives</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification></Classifications></ViewByClassification></Role></Roles>";

    var qigList = {
        "qigs": [
            {
                "examinerRoleId": 100,
                "role": 1,
                "markSchemeGroupId": 29,
                "markSchemeGroupName": "Reading Part A",
                "questionPaperName": "Reading",
                "examinerApprovalStatus": 4,
                "questionPaperPartId": 21,
                "assessmentCode": "1020/02 Reading",
                "assessmentName": "1020/02 Reading",
                "componentId": "Version1  ",
                "componentName": "Reading",
                "sessionId": 5,
                "sessionName": "2014",
                "isestdEnabled": true,
                "standardisationSetupComplete": true,
                "hasSecondStandardisationResponseClassified": false,
                "isElectronicStandardisationTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": false,
                "hasSTMSimulationMode": false,
                "hasGracePeriod": true,
                "isMarkFromPaper": false,
                "isForAdminRemark": false,
                "inSimulationMode": false,
                "examinerQigStatus": 7,
                "currentMarkingTarget": {
                    "examinerRoleId": 100,
                    "markingMode": 30,
                    "markingCompletionDate": "2020-07-15T23:00:00Z",
                    "maximumMarkingLimit": 10,
                    "remarkRequestType": 0,
                    "closedResponsesCount": 1,
                    "pendingResponsesCount": 0,
                    "openResponsesCount": 0,
                    "overAllocationCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 10,
                    "submittedResponsesCount": 1,
                    "isDirectedRemark": false
                },
                "markingTargets": [
                    {
                        "examinerRoleId": 100,
                        "markingMode": 30,
                        "markingCompletionDate": "2020-07-15T23:00:00Z",
                        "maximumMarkingLimit": 10,
                        "remarkRequestType": 0,
                        "closedResponsesCount": 1,
                        "pendingResponsesCount": 0,
                        "openResponsesCount": 0,
                        "overAllocationCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 10,
                        "submittedResponsesCount": 1,
                        "isDirectedRemark": false
                    }
                ],
                "markingMethod": 2,
                "standardisationSetupCompletedDate": "2018-03-15T13:49:58.62Z",
                "examSessionId": 21,
                "qualityFeedbackOutstandingSeedTypeId": 0,
                "isMarkingEnabled": true,
                "isTeamManagementEnabled": false,
                "hasMarkingInstructions": false,
                "markSchemeGroupStatusId": 0,
                "hasAnyStuckExaminers": false,
                "hasAnyLockedExaminers": false,
                "hasPermissionInRelatedQIGs": false,
                "relatedQIGCount": 1,
                "centreScriptAvaliabityCount": 1,
                "isStandardisationSetupAvaliable": true,
                "zonedScriptAvailabilityCount": 0,
                "isMarkedAsProvisional": true,
                "standardisationSetupPermissionCCValue": ccValue,
                "aggregateQIGTargets": true,
                "groupId": 111
            },
            {
                "examinerRoleId": 110,
                "role": 1,
                "markSchemeGroupId": 31,
                "markSchemeGroupName": "Reading Part A",
                "questionPaperName": "Reading",
                "examinerApprovalStatus": 4,
                "questionPaperPartId": 22,
                "assessmentCode": "1020/02 Reading",
                "assessmentName": "1020/02 Reading",
                "componentId": "Version2  ",
                "componentName": "Reading",
                "sessionId": 5,
                "sessionName": "2014",
                "isestdEnabled": true,
                "standardisationSetupComplete": true,
                "hasSecondStandardisationResponseClassified": false,
                "isElectronicStandardisationTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": false,
                "hasSTMSimulationMode": false,
                "hasGracePeriod": true,
                "isMarkFromPaper": false,
                "isForAdminRemark": false,
                "inSimulationMode": false,
                "examinerQigStatus": 7,
                "currentMarkingTarget": {
                    "examinerRoleId": 110,
                    "markingMode": 30,
                    "markingCompletionDate": "2013-10-30T00:00:00Z",
                    "maximumMarkingLimit": 10,
                    "remarkRequestType": 0,
                    "closedResponsesCount": 0,
                    "pendingResponsesCount": 0,
                    "openResponsesCount": 0,
                    "overAllocationCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0,
                    "submittedResponsesCount": 0,
                    "isDirectedRemark": false
                },
                "markingTargets": [
                    {
                        "examinerRoleId": 110,
                        "markingMode": 30,
                        "markingCompletionDate": "2013-10-30T00:00:00Z",
                        "maximumMarkingLimit": 10,
                        "remarkRequestType": 0,
                        "closedResponsesCount": 0,
                        "pendingResponsesCount": 0,
                        "openResponsesCount": 0,
                        "overAllocationCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0,
                        "submittedResponsesCount": 0,
                        "isDirectedRemark": false
                    }
                ],
                "markingMethod": 2,
                "standardisationSetupCompletedDate": "2018-03-15T13:52:03.533Z",
                "examSessionId": 22,
                "qualityFeedbackOutstandingSeedTypeId": 0,
                "isMarkingEnabled": true,
                "isTeamManagementEnabled": false,
                "hasMarkingInstructions": false,
                "markSchemeGroupStatusId": 0,
                "hasAnyStuckExaminers": false,
                "hasAnyLockedExaminers": false,
                "hasPermissionInRelatedQIGs": false,
                "relatedQIGCount": 1,
                "centreScriptAvaliabityCount": 1,
                "isStandardisationSetupAvaliable": true,
                "zonedScriptAvailabilityCount": 0,
                "isMarkedAsProvisional": true,
                "standardisationSetupPermissionCCValue": ccValue,
                "aggregateQIGTargets": true,
                "groupId": 111
            },
            {
                "examinerRoleId": 120,
                "role": 1,
                "markSchemeGroupId": 33,
                "markSchemeGroupName": "Reading Part A",
                "questionPaperName": "Reading",
                "examinerApprovalStatus": 4,
                "questionPaperPartId": 23,
                "assessmentCode": "1020/02 Reading",
                "assessmentName": "1020/02 Reading",
                "componentId": "Version3  ",
                "componentName": "Reading",
                "sessionId": 5,
                "sessionName": "2014",
                "isestdEnabled": true,
                "standardisationSetupComplete": true,
                "hasSecondStandardisationResponseClassified": false,
                "isElectronicStandardisationTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": false,
                "hasSTMSimulationMode": false,
                "hasGracePeriod": true,
                "isMarkFromPaper": false,
                "isForAdminRemark": false,
                "inSimulationMode": false,
                "examinerQigStatus": 7,
                "currentMarkingTarget": {
                    "examinerRoleId": 120,
                    "markingMode": 30,
                    "markingCompletionDate": "2013-10-30T00:00:00Z",
                    "maximumMarkingLimit": 10,
                    "remarkRequestType": 0,
                    "closedResponsesCount": 0,
                    "pendingResponsesCount": 0,
                    "openResponsesCount": 0,
                    "overAllocationCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0,
                    "submittedResponsesCount": 0,
                    "isDirectedRemark": false
                },
                "markingTargets": [
                    {
                        "examinerRoleId": 120,
                        "markingMode": 30,
                        "markingCompletionDate": "2013-10-30T00:00:00Z",
                        "maximumMarkingLimit": 10,
                        "remarkRequestType": 0,
                        "closedResponsesCount": 0,
                        "pendingResponsesCount": 0,
                        "openResponsesCount": 0,
                        "overAllocationCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0,
                        "submittedResponsesCount": 0,
                        "isDirectedRemark": false
                    }
                ],
                "markingMethod": 2,
                "standardisationSetupCompletedDate": "2018-03-15T13:53:19.517Z",
                "examSessionId": 23,
                "qualityFeedbackOutstandingSeedTypeId": 0,
                "isMarkingEnabled": true,
                "isTeamManagementEnabled": false,
                "hasMarkingInstructions": false,
                "markSchemeGroupStatusId": 0,
                "hasAnyStuckExaminers": false,
                "hasAnyLockedExaminers": false,
                "hasPermissionInRelatedQIGs": false,
                "relatedQIGCount": 1,
                "centreScriptAvaliabityCount": 1,
                "isStandardisationSetupAvaliable": true,
                "zonedScriptAvailabilityCount": 0,
                "isMarkedAsProvisional": true,
                "standardisationSetupPermissionCCValue": ccValue,
                "aggregateQIGTargets": true,
                "groupId": 111
            },
            {
                "examinerRoleId": 130,
                "role": 1,
                "markSchemeGroupId": 35,
                "markSchemeGroupName": "Reading Part A",
                "questionPaperName": "Reading",
                "examinerApprovalStatus": 4,
                "questionPaperPartId": 24,
                "assessmentCode": "1020/02 Reading",
                "assessmentName": "1020/02 Reading",
                "componentId": "Version4  ",
                "componentName": "Reading",
                "sessionId": 5,
                "sessionName": "2014",
                "isestdEnabled": true,
                "standardisationSetupComplete": true,
                "hasSecondStandardisationResponseClassified": false,
                "isElectronicStandardisationTeamMember": false,
                "hasQualityFeedbackOutstanding": false,
                "isOpenForMarking": true,
                "hasSimulationMode": false,
                "hasSTMSimulationMode": false,
                "hasGracePeriod": true,
                "isMarkFromPaper": false,
                "isForAdminRemark": false,
                "inSimulationMode": false,
                "examinerQigStatus": 7,
                "currentMarkingTarget": {
                    "examinerRoleId": 130,
                    "markingMode": 30,
                    "markingCompletionDate": "2013-10-30T00:00:00Z",
                    "maximumMarkingLimit": 10,
                    "remarkRequestType": 0,
                    "closedResponsesCount": 0,
                    "pendingResponsesCount": 0,
                    "openResponsesCount": 0,
                    "overAllocationCount": 0,
                    "targetComplete": false,
                    "areResponsesAvailableToBeDownloaded": true,
                    "markingProgress": 0,
                    "submittedResponsesCount": 0,
                    "isDirectedRemark": false
                },
                "markingTargets": [
                    {
                        "examinerRoleId": 130,
                        "markingMode": 30,
                        "markingCompletionDate": "2013-10-30T00:00:00Z",
                        "maximumMarkingLimit": 10,
                        "remarkRequestType": 0,
                        "closedResponsesCount": 0,
                        "pendingResponsesCount": 0,
                        "openResponsesCount": 0,
                        "overAllocationCount": 0,
                        "targetComplete": false,
                        "areResponsesAvailableToBeDownloaded": true,
                        "markingProgress": 0,
                        "submittedResponsesCount": 0,
                        "isDirectedRemark": false
                    }
                ],
                "markingMethod": 2,
                "standardisationSetupCompletedDate": "2018-03-15T13:54:29.443Z",
                "examSessionId": 24,
                "qualityFeedbackOutstandingSeedTypeId": 0,
                "isMarkingEnabled": true,
                "isTeamManagementEnabled": false,
                "hasMarkingInstructions": false,
                "markSchemeGroupStatusId": 0,
                "hasAnyStuckExaminers": false,
                "hasAnyLockedExaminers": false,
                "hasPermissionInRelatedQIGs": false,
                "relatedQIGCount": 1,
                "centreScriptAvaliabityCount": 1,
                "isStandardisationSetupAvaliable": true,
                "zonedScriptAvailabilityCount": 0,
                "isMarkedAsProvisional": true,
                "standardisationSetupPermissionCCValue": ccValue,
                "aggregateQIGTargets": true,
                "groupId": 111
            }
        ]
    };

    beforeEach(() => {
        overviewData = JSON.parse(JSON.stringify(qigList));
        overviewData.qigSummary = Immutable.List(overviewData.qigs);
        overviewData.success = true;
        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 0, true, overviewData));
        aggregatedQigProps = {
            qigs: overviewData.qigSummary,
            aggregatedQigvalidationResult: {
                "displayTargetDate": false,
                "displayOpenResponseIndicator": false,
                "displayResponseAvailableIndicator": true,
                "displayRemarkOpenResponseIndicator": false,
                "displayRemarkAvailableResponseIndicator": false,
                "displayTarget": true,
                "displayAggregatedStatusText": true,
                "statusText": "Live Marking",
                "displayProgressBar": true,
                "aggregatedMaxMarkingLimit": 40,
                "aggregatedOpenResponsesCount": 0,
                "aggregatedPendingResponsesCount": 0,
                "aggregatedClosedResponsesCount": 1,
                "aggregatedSubmittedResponsesCount": 1
            },
            normalQigvalidationResults: [
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                }
            ],
            containerPage: 2
        };

        var AggregatedQigComponent = React.createElement(AggregatedQig, aggregatedQigProps);
        renderedOutput = ReactTestUtils.renderIntoDocument(AggregatedQigComponent);
    })

    it("tests if the component had rendered correctly.", () => {
        expect(renderedOutput).not.toBe(null);
    })

    it("tests if the show/hide qig versions link is rendered.", () => {
        var showOrHideVersionsLink = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "panel-link");
        expect(showOrHideVersionsLink).not.toBeNull();
    })

    it("tests if the sub qigs or different versions of the aggregated qig are rendered.", () => {
        var versions = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "panel-content");
        // Expecting 4 versions.
        expect(versions.childElementCount).toBe(4);

        // Checking if correct versions are rendered.
        overviewData.qigSummary.map((qig: OverviewData, index: number) => {
            var textContent = versions.children[index].textContent;
            // Check for version number.
            expect(textContent).toContain(qig.componentId);
            // Check for target status.
            expect(textContent).toContain('Live Marking');
        });
    })

    it("tests if the progress indicator and status text is shown correctly.", () => {
        var progressIndicator = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "linear-progress-holder");
        expect(progressIndicator).not.toBeNull();
        if (progressIndicator) {
            // If there is a progress indicator then the status should be Live marking.
            var progressText = ReactTestUtils.scryRenderedDOMComponentsWithClass(
                renderedOutput, "progress-title-text");
            expect(progressText[0].textContent).toBe('Live Marking');
        }
    })

    it("tests if the live response indicator is shown against aggregated qig", () => {
        if (aggregatedQigProps.aggregatedQigvalidationResult.displayResponseAvailableIndicator) {
            var responseAvailableIndicator = ReactTestUtils.scryRenderedDOMComponentsWithClass(
                renderedOutput, "sprite-icon download-indicator-icon not-clickable");
            expect(responseAvailableIndicator.length).toBe(5);
        }

        var newProps = {
            qigs: overviewData.qigSummary,
            aggregatedQigvalidationResult: {
                "displayTargetDate": false,
                "displayOpenResponseIndicator": true,
                "displayResponseAvailableIndicator": false,
                "displayRemarkOpenResponseIndicator": false,
                "displayRemarkAvailableResponseIndicator": false,
                "displayTarget": true,
                "displayAggregatedStatusText": true,
                "statusText": "Live Marking",
                "displayProgressBar": true,
                "aggregatedMaxMarkingLimit": 40,
                "aggregatedOpenResponsesCount": 0,
                "aggregatedPendingResponsesCount": 0,
                "aggregatedClosedResponsesCount": 1,
                "aggregatedSubmittedResponsesCount": 1
            },
            normalQigvalidationResults: [
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": false,
                    "displayOpenResponseIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                }
            ],
            containerPage: 2
        };
        var AggregatedQigComponent2 = React.createElement(AggregatedQig, newProps);
        var renderedOutput2 = ReactTestUtils.renderIntoDocument(AggregatedQigComponent2);
        var responseOpenIndicator = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            renderedOutput2, "sprite-icon downloaded-indicator-icon not-clickable");
        expect(responseOpenIndicator.length).toBe(2);
    })

    it("tests if the submitted count is calculated considering the total counts in respective versions.", () => {
        var submittedText = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            renderedOutput, "submitted-holder small-text middle-content-right")[0].textContent;
        var aggregatedQigData = aggregatedQigProps.aggregatedQigvalidationResult;
        expect(submittedText).toContain(
            aggregatedQigData.aggregatedSubmittedResponsesCount + '/' + aggregatedQigData.aggregatedMaxMarkingLimit);
    })

    it("tests if the remark response indicator is shown against aggregated qig", () => {
        var newProps = {
            qigs: overviewData.qigSummary,
            aggregatedQigvalidationResult:{
                "displayTargetDate": false,
                "displayOpenResponseIndicator": false,
                "displayResponseAvailableIndicator": false,
                "displayRemarkOpenResponseIndicator": true,
                "displayRemarkAvailableResponseIndicator": false,
                "displayTarget": true,
                "displayAggregatedStatusText": true,
                "statusText": "Live Marking",
                "displayProgressBar": true,
                "aggregatedMaxMarkingLimit": 40,
                "aggregatedOpenResponsesCount": 0,
                "aggregatedPendingResponsesCount": 0,
                "aggregatedClosedResponsesCount": 1,
                "aggregatedSubmittedResponsesCount": 1
            },
            normalQigvalidationResults: [
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                },
                {
                    "statusColourClass": "",
                    "displayTargetDate": true,
                    "displayProgressBar": false,
                    "displayTarget": true,
                    "displayResponseAvailableIndicator": true,
                    "statusText": "Live Marking",
                    "openResponsesCount": 0
                }
            ],
            containerPage: 2
        };

        // checking if remarks text and idicator is renderd.
        var AggregatedQigComponent2 = React.createElement(AggregatedQig, newProps);
        var renderedOutput2 = ReactTestUtils.renderIntoDocument(AggregatedQigComponent2);
        var responseOpenIndicator = ReactTestUtils.scryRenderedDOMComponentsWithClass(
            renderedOutput2, "sprite-icon downloaded-indicator-icon not-clickable");
        expect(responseOpenIndicator.length).toBe(1);
    })
});