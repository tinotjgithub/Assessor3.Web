import React = require('react');
import ReactDOM = require('react-dom');
import TestUtils = require('react-dom/test-utils');
import MediaErrorDialog = require('../../../src/components/logging/mediaerrordialog');
import enums = require('../../../src/components/utility/enums');
import dispatcher = require('../../../src/app/dispatcher');
import Immutable = require('immutable');
import markerInformationAction = require('../../../src/actions/markerinformation/markerinformationaction');
import qigSelectorDataFetchAction = require('../../../src/actions/qigselector/qigselectordatafetchaction');
import worklistDataFetchAction = require('../../../src/actions/worklist/worklistdatafetchaction');

describe("Test suite for Media Error dialog", function () {

    let mediaErrorProps = {
        content: 'Test',
        viewMoreContent: '',
        isOpen: true,
        isCustomError: false,
        header: 'Test',
        isTranscodedExists: false,
        candidateScriptId: 4001,
        markGroupId: 104,
        isQuickLinkVisible: false
    };

    let qigData = {
        'qigSummary': [{
			'examinerRoleId': 300,
			"markSchemeGroupId": 1,
            'standardisationSetupComplete': true,
            'hasQualityFeedbackOutstanding': false,
            'hasSimulationMode': false,
            'currentMarkingTarget': [{
                'markingMode': 30
            }],
        }],
        'success': true
    }

    let OverviewData = JSON.parse(JSON.stringify(qigData));
    OverviewData.qigSummary = Immutable.List(OverviewData.qigSummary);
    dispatcher.dispatch(new qigSelectorDataFetchAction(true, 1, true, OverviewData, false, false, false, true));

    let  markerProgress = {
        'markingTargets': [{
            'examinerRoleID': 300,
            'markingModeID': 30,
            'examinerProgress': [{
                'openResponsesCount': 1
            }],
            'maximumMarkingLimit': 20,
            'isCurrentTarget': true
        }],
        'success': true
    };

    let markerProgressData = JSON.parse(JSON.stringify(markerProgress));
    dispatcher.dispatch(new worklistDataFetchAction(true, markerProgressData));

    let examiner = {
        'initials': 'AA',
        'surname': 'Test',
        'approvalStatus': enums.ExaminerApproval.Approved,
        'markerRoleID': 100,
        'supervisorInitials': 'BB',
        'supervisorSurname': 'Test',
        'supervisorExaminerId': 101,
        'examinerId': 200,
        'examinerRoleId': 300,
        'currentExaminerApprovalStatus': enums.ExaminerApproval.Approved,
        'supervisorExaminerRoleId': 401
    }
    let markerDetails = JSON.parse(JSON.stringify(examiner));
    dispatcher.dispatch(new markerInformationAction(true, markerDetails));
    let mediaErrorComponent = React.createElement(MediaErrorDialog, mediaErrorProps);
    let mediaErrorDOM = TestUtils.renderIntoDocument(mediaErrorComponent);

    it("checks if media error dialog component is rendered", () => {

        expect(mediaErrorDOM).not.toBeNull();

    });

    it("checks if media error dialog component is rendered with appropriate props", () => {
        let errorPopUp = TestUtils.findRenderedDOMComponentWithClass(mediaErrorDOM, 'error-popup');
        expect(errorPopUp.className).toBe('popup small popup-overlay close-button error-popup open');
    });

    // To get the html node with given id
    function findRenderedDOMComponentsWithId(tree, id) {
        return TestUtils.findAllInRenderedTree(tree, function (inst) {
            return TestUtils.isDOMComponent(inst) && inst.getAttribute("id") === id;
        });
    }

    it("checks if media error dialog component is rendered with quick link to download", () => {
        expect(findRenderedDOMComponentsWithId(mediaErrorDOM, 'downloadquicklink')).not.toBe(null);
    });

    it("checks if media error dialog component is rendered with quick link to raise exception", () => {
        expect(findRenderedDOMComponentsWithId(mediaErrorDOM, 'raiseException')).not.toBe(null);
    });

    it("checks if media error dialog component is rendered with quick link to play alternate file", () => {
        expect(findRenderedDOMComponentsWithId(mediaErrorDOM, 'playAlternateFile')).not.toBe(null);
    });

    it("checks if media error dialog component is rendered with text which was given as content props", () => {
        let content = TestUtils.findRenderedDOMComponentWithClass(mediaErrorDOM, "popup-content").textContent;
        expect(content).toBe("Test");
    });
});