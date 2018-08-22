jest.dontMock("../../../src/components/qigselector/visualqiggroup");
jest.dontMock("../../../src/components/utility/enums.ts");

import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import Immutable = require("immutable");

import visualQigGroup = require("../../../src/components/qigselector/visualqiggroup");
import dispatcher = require("../../../src/app/dispatcher");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");
import enums = require("../../../src/components/utility/enums");

describe("worklist selection changed test", function () {

    let overviewData: overviewData;
    let renderedOutput;
    let value: string = "<Roles><Role><Name>Principal Examiner</Name><Permissions><Permission>Complete</Permission><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>EditDefinitives</Permission><Permission>ViewDefinitives</Permission><Permission>Classify</Permission><Permission>Declassify</Permission><Permission>MultiQIGProvisionals</Permission><Permission>ReuseResponses</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification><Classification>Seeding</Classification></Classifications></ViewByClassification></Role><Role><Name>Assistant Principal Examiner</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>EditDefinitives</Permission><Permission>ViewDefinitives</Permission><Permission>Classify</Permission><Permission>Declassify</Permission><Permission>MultiQIGProvisionals</Permission><Permission>ReuseResponses</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification><Classification>Seeding</Classification></Classifications></ViewByClassification></Role><Role><Name>Team Leader (Examiner)</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>ViewDefinitives</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification></Classifications></ViewByClassification></Role><Role><Name>Assistant Examiner</Name><Permissions><Permission>EditUnclassifiedNotes</Permission><Permission>EditClassifiedNotes</Permission><Permission>ViewDefinitives</Permission></Permissions><ViewByClassification><Views><View>Unclassified</View><View>Classified</View></Views><Classifications><Classification>Practice</Classification><Classification>Standardisation</Classification><Classification>STMStandardisation</Classification></Classifications></ViewByClassification></Role></Roles>";

    beforeEach(function () {
        let qigList = [
            {
                examinerQigStatus: enums.ExaminerQIGStatus.LiveMarking,
                hasGracePeriod: true,
                markSchemeGroupId: 186,
                currentMarkingTarget: {
                    markingMode: 30,
                    markingCompletionDate: new Date(2016, 2, 25),
                    maximumMarkingLimit: 100,
                    closedResponsesCount: 10,
                    pendingResponsesCount: 10,
                    openResponsesCount: 10,
                    targetComplete: false,
                    areResponsesAvailableToBeDownloaded: true,
                    isActive: true,
                    markingProgress: 10
                },
                markingTargets: [
                    {
                        examinerRoleId: 1220,
                        markingMode: 30,
                        markingCompletionDate: "2015-01-05T12:03:02.833",
                        maximumMarkingLimit: 1,
                        remarkRequestType: 0,
                        closedResponsesCount: 1,
                        pendingResponsesCount: 0,
                        openResponsesCount: 10,
                        overAllocationCount: 0,
                        targetComplete: false,
                        areResponsesAvailableToBeDownloaded: false,
                        markingProgress: 100.0,
                        submittedResponsesCount: 1
                    }
                ],
                isAggregateQIGTargetsON: false,
                groupId: 0,
                standardisationSetupPermissionCCValue: value
        ];

         let data: overviewData = {
            qigSummary: Immutable.List(qigList),
            success: true,
            errorMessage: null,
            failureCode: enums.FailureCode.None
        };

        var props = {
            containerPage: enums.PageContainers,
            qigs: qigList
        };


        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, data));

        var visualGroupComponent = react.createElement(visualQigGroup, props);

        renderedOutput = reactTestUtils.renderIntoDocument(visualGroupComponent);
    });

    it("Check if the component group loads correctly", () => {
        expect(renderedOutput).not.toBe(null);
    });

    it("Tests if the progress bar renders", function () {
        var progressBarDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-track");
        expect(progressBarDOMElement).not.toBeNull();
    });

    it("Tests if the progress displays expected value for open responses", function () {
        var progressBarOpenDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress progress1 open");
        expect(progressBarOpenDOMElement.getAttribute('style')).toContain('30%');
    });

    it("Tests if the progress displays expected value for grace period responses", function () {
        var progressBarInGraceDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress progress2 ingrace");
        expect(progressBarInGraceDOMElement.getAttribute('style')).toContain('20%');
    });

    it("Tests if the progress displays expected value for closed responses", function () {
        var progressBarClosedDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress progress3 closed");
        expect(progressBarClosedDOMElement.getAttribute('style')).toContain('10%');
    });

    it("Tests if the submitted count renders", function () {
        var submittedDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "submitted-holder small-text middle-content-right");
        expect(submittedDOMElement).not.toBeNull();
    });

    it("Tests if the submitted count is displaying expected value", function () {
        var submittedDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "submitted-holder small-text middle-content-right");
        expect(submittedDOMElement.textContent.trim()).toEqual("20/100");
    });

    it("Tests if the available response indicator renders", function () {
        let qigList = [
                        {
                            examinerQigStatus: enums.ExaminerQIGStatus.LiveMarking,
                            hasGracePeriod: true,
                            standardisationSetupPermissionCCValue: value,
                            markSchemeGroupId: 186,
                            currentMarkingTarget: {
                                markingMode: 30,
                                markingCompletionDate: new Date(2016, 2, 25),
                                maximumMarkingLimit: 100,
                                closedResponsesCount: 10,
                                pendingResponsesCount: 10,
                                openResponsesCount: 0,
                                targetComplete: false,
                                areResponsesAvailableToBeDownloaded: false,
                                isActive: true,
                                markingProgress: 10
                            },
                            markingTargets: [
                                {
                                    examinerRoleId: 1220,
                                    markingMode: 30,
                                    markingCompletionDate: "2015-01-05T12:03:02.833",
                                    maximumMarkingLimit: 1,
                                    remarkRequestType: 0,
                                    closedResponsesCount: 1,
                                    pendingResponsesCount: 0,
                                    openResponsesCount: 10,
                                    overAllocationCount: 0,
                                    targetComplete: false,
                                    areResponsesAvailableToBeDownloaded: true,
                                    markingProgress: 100.0,
                                    submittedResponsesCount: 1
                                }
                            ]
                        }
                    ];

        var props = {
            containerPage: enums.PageContainers,
            qigs: qigList
        };
        let data: overviewData = {
        qigSummary: Immutable.List(qigList),
        success: true,
        errorMessage: null,
        failureCode: enums.FailureCode.None
        };

        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, data));

        var componentGroupComponent = react.createElement(visualQigGroup, props);

        var renderedOutput = reactTestUtils.renderIntoDocument(componentGroupComponent);

        var responseIndicatorDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "sprite-icon download-indicator-icon not-clickable");
        expect(responseIndicatorDOMElement).not.toBeNull();
    });

    it("Test whether the QIG component is rendered even if the marking targets are not exists.", function () {
        let qigList = [
            {
                examinerRoleId: 1219,
                role: 2,
                markSchemeGroupId: 186,
                markSchemeGroupName: "GCE AS D&T: PRODUCT DESIGN UNIT 1",
                questionPaperName: "GCE D&T: PRODUCT DES (TEX) UNIT 1",
                examinerApprovalStatus: 1,
                questionPaperPartId: 15,
                assessmentCode: "146A-TEXT1",
                componentId: "TEXT1     ",
                sessionId: 5,
                sessionName: "JUNE 2014 SERIES 6A",
                isestdEnabled: true,
                standardisationSetupComplete: true,
                isesTeamMember: true,
                hasQualityFeedbackOutstanding: false,
                isOpenForMarking: true,
                hasSimulationMode: true,
                hasSTMSimulationMode: false,
                hasGracePeriod: true,
                isMarkFromPaper: false,
                inSimulationMode: false,
                examinerQigStatus: 0,
                currentMarkingTarget: [
                    {
                        examinerRoleId: 1220,
                        markingMode: 2,
                        markingCompletionDate: "2015-01-05T12:03:02.833",
                        maximumMarkingLimit: 1,
                        remarkRequestType: 0,
                        closedResponsesCount: 1,
                        pendingResponsesCount: 0,
                        openResponsesCount: 0,
                        overAllocationCount: 0,
                        targetComplete: false,
                        areResponsesAvailableToBeDownloaded: false,
                        markingProgress: 100.0,
                        submittedResponsesCount: 1
                    }
                ],
                markingTargets: null,
                markingMethod: 2,
                standardisationSetupCompletedDate: "2016-03-21T19:12:17.13",
                standardisationSetupPermissionCCValue: value
            }
        ];

        var props = {
            containerPage: enums.PageContainers,
            qigs: qigList
        };

        let data: overviewData = {
            qigSummary: Immutable.List(qigList),
            success: true,
            errorMessage: null,
            failureCode: enums.FailureCode.None
        };

        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, data));
        var componentGroupComponent = react.createElement(visualQigGroup, props);
        var renderedOutput = reactTestUtils.renderIntoDocument(componentGroupComponent);
        var targetNameDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-title");
        expect(targetNameDOMElement).not.toBeNull();
    });

    /**
     * 
     * TODO: Commenting this because the  current target going null functionality is yet to develop
     */

    // it("Test whether the QIG component is rendered, if current target is null when the live target is not exists and other targets exists.", function () {
    //     let qigList = [
    //             {
    //                 examinerRoleId: 1219,
    //                 role: 2,
    //                 markSchemeGroupId: 186,
    //                 markSchemeGroupName: "GCE AS D&T: PRODUCT DESIGN UNIT 1",
    //                 questionPaperName: "GCE D&T: PRODUCT DES (TEX) UNIT 1",
    //                 examinerApprovalStatus: 1,
    //                 questionPaperPartId: 15,
    //                 assessmentCode: "146A-TEXT1",
    //                 componentId: "TEXT1     ",
    //                 sessionId: 5,
    //                 sessionName: "JUNE 2014 SERIES 6A",
    //                 isestdEnabled: true,
    //                 standardisationSetupComplete: true,
    //                 isesTeamMember: true,
    //                 hasQualityFeedbackOutstanding: false,
    //                 isOpenForMarking: true,
    //                 hasSimulationMode: true,
    //                 hasSTMSimulationMode: false,
    //                 hasGracePeriod: true,
    //                 isMarkFromPaper: false,
    //                 inSimulationMode: false,
    //                 examinerQigStatus: 0,
    //                 currentMarkingTarget: [
    //                     {
    //                         examinerRoleId: 1220,
    //                         markingMode: 2,
    //                         markingCompletionDate: "2015-01-05T12:03:02.833",
    //                         maximumMarkingLimit: 1,
    //                         remarkRequestType: 0,
    //                         closedResponsesCount: 1,
    //                         pendingResponsesCount: 0,
    //                         openResponsesCount: 0,
    //                         overAllocationCount: 0,
    //                         targetComplete: false,
    //                         areResponsesAvailableToBeDownloaded: false,
    //                         markingProgress: 100.0,
    //                         submittedResponsesCount: 1
    //                     }
    //                 ],
    //                 markingTargets: [
    //                     {
    //                         examinerRoleId: 1220,
    //                         markingMode: 2,
    //                         markingCompletionDate: "2015-01-05T12:03:02.833",
    //                         maximumMarkingLimit: 1,
    //                         remarkRequestType: 0,
    //                         closedResponsesCount: 1,
    //                         pendingResponsesCount: 0,
    //                         openResponsesCount: 0,
    //                         overAllocationCount: 0,
    //                         targetComplete: false,
    //                         areResponsesAvailableToBeDownloaded: false,
    //                         markingProgress: 100.0,
    //                         submittedResponsesCount: 1
    //                     }
    //                 ],
    //                 markingMethod: 2,
    //                 standardisationSetupCompletedDate: "2016-03-21T19:12:17.13",
    //                 MarkingMode: enums.MarkingMode.None,
    //                 standardisationSetupPermissionCCValue: value
    //             }
    //         ];
    //         let data: overviewData = {
    //             qigSummary: Immutable.List(qigList),
    //             success: true,
    //             errorMessage: null,
    //             failureCode: enums.FailureCode.None
    //         };
    //     var props = {
    //         containerPage: enums.PageContainers,
    //         qigs: qigList
    //     };

    //     dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, data));
    //     var componentGroupComponent = react.createElement(visualQigGroup, props);
    //     var renderedOutput = reactTestUtils.renderIntoDocument(componentGroupComponent);
    //     var targetNameDOMElement = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "progress-title");
    //     expect(targetNameDOMElement).not.toBeNull();
    // });
});