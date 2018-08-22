jest.dontMock("../../../src/components/response/responsescreen/tag");
var localJson = require("../../../content/resources/rm-en.json");
import shallowRenderer = require('react-test-renderer/shallow');
import dispatcher = require("../../../src/app/dispatcher");
import MyJudgementButton = require("../../../src/components/markschemestructure/myjudgementbutton")
import React = require('react');
import ReactDOM = require('react-dom');
import localAction = require("../../../src/actions/locale/localeaction");
import awardingcandidatedetailsgetaction = require('../../../src/actions/awarding/awardingcandidatedetailsgetaction');
import setselectedcandidatedataaction = require('../../../src/actions/awarding/setselectedcandidatedataaction');
import componentandsessiongetaction = require('../../../src/actions/awarding/componentandsessiongetaction');
import awardingjudgementstatusgetaction = require('../../../src/actions/awarding/awardingjudgementstatusgetaction');

describe('Test suite for My Judgement Button and Show List', function () {

	let awardingComponentAndSessionList = {
		"awardingComponentAndSessionList": [
			{
				"sessionName": "E12",
				"sampleArchiveId": 10,
				"sampleName": "Sample for B-Awarding Leo Ecoursework-DIET AND EXE",
				"examSessionId": 152,
				"examProductId": 147,
				"assessmentCode": "B-Awarding Leo Ecoursework-DIET AND EXERCISE in ENGLISH",
				"componentId": "E2(ENG)TZ0",
				"assessmentName": "dieteXDETZ0XXXX",
				"sampleStatus": 1,
				"componentName": "dieteXDEENGTZ0XXXX",
				"examBodyId": 5,
				"markSchemeGroupId": 396,
				"questionPaperID": 152,
				"markingMethodID": 3
			}
		],
		"success": true,
		"ErrorMessage": null
	}

	/* Create qig summary json object */
	let AwardingCandidateDetailsList = {
		"awardingCandidateList": [
			{
				"awardingCandidateID": 153,
				"centreNumber": "001003",
				"centreCandidateNo": "0173",
				"sampleArchiveID": 10,
				"grade": "C",
				"totalMark": 13,
				"awardingJudgementID": 0,
				"awardingJudgementStatusID": 1,
				"awardingJudgementCount": 2,
				"markingMethodID": 3,
				"examSessionID": 152,
				"awardingJudgementStatusName": "MeetsStandard",
				"responseItemGroups": [
					{
						"candidateScriptId": 10016,
						"examinerId": 118,
						"examinerRoleId": 3628,
						"questionPaperId": 152,
						"markGroupId": 18799,
						"role": 3,
						"documentId": 19012,
						"markSchemeGroupId": 396,
						"displayId": 566208
					}
				],
			}
		]
	};

	let awardingJudgementStatusList = {
		"awardingJudgementStatusList": [{
			"awardingJudgementID": 0,
			"awardingJudgementStatusName": "disagree",
			"awardingJudgementStatusDescription": "disagree"
		},
		{
			"awardingJudgementID": 2,
			"awardingJudgementStatusName": "agree",
			"awardingJudgementStatusDescription": "agree"
		}],
		"success": true,
		"errorMessage": null
	}

	//dispatcher.dispatch(new localAction(true, "en-GB", localJson));
	//dispatcher.dispatch(new componentandsessiongetaction(true, awardingComponentAndSessionList));
	//dispatcher.dispatch(new awardingjudgementstatusgetaction(true, awardingJudgementStatusList));
	//dispatcher.dispatch(new awardingcandidatedetailsgetaction(true, AwardingCandidateDetailsList, 152));
	//dispatcher.dispatch(new setselectedcandidatedataaction(153));

	//let shallowRender = new shallowRenderer();

	//let judgementProps = { isDisabled: true };
	//let judgementElement = React.createElement(MyJudgementButton, judgementProps);
	//shallowRender.render(judgementElement);
	//let renderJudgementComponentWithIsDisabledTrue = shallowRender.getRenderOutput();
	it("will check whether myjudgmentbutton rendered=> It should render if it is disabled mode", () => {
		//expect(renderJudgementComponentWithIsDisabledTrue).not.toBeNull();
	});

	//judgementProps = { isDisabled: false };
	//judgementElement = React.createElement(MyJudgementButton, judgementProps, );
	//shallowRender.render(judgementElement);
	//let renderJudgementComponentWithIsDisabledFalse = shallowRender.getRenderOutput();
	it("will check whether myjudgementbutton rendered=> It should render if it is enabled mode", () => {
		//expect(renderJudgementComponentWithIsDisabledFalse).not.toBeNull();
	});
});