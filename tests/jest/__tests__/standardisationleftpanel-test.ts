jest.dontMock("../../../src/components/standardisationsetup/standardisationleftcollapsiblepanel");

import React = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import standardisationlink = require("../../../src/components/standardisationsetup/typings/standardisationlink");
import StandardisationLeftCollapsiblePanel = require("../../../src/components/standardisationsetup/standardisationleftcollapsiblepanel");
import standardisationTargetDetail = require("../../../src/stores/standardisationsetup/typings/standardisationtargetdetail");
import enums = require("../../../src/components/utility/enums");
import localeAction = require("../../../src/actions/locale/localeaction");
import localeStore = require("../../../src/stores/locale/localestore");
import dispatcher = require("../../../src/app/dispatcher");
var localeJson = require("../../../content/resources/rm-en.json");
import Immutable = require("immutable");


describe("classified link in task menu test", function () {
    let renderedOutput;
    var items: JSX.Element[];
    let availableStandardisationSetupLinks: Array<standardisationlink> = new Array<standardisationlink>();
    //var standardisationTargetDetailList: Immutable.List<standardisationTargetDetail>;
    let standardisationLeftCollapsiblePanelProps;
    let standardisationLeftPanelComponent;



    var standardisationTargetDetail =
        [
            {
                'markingModeId': enums.MarkingMode.Practice,
                'markingModeName': "Practice",
                'count': 0,
                'target': 0,
                'isstmSeed': 0
                },
            {
                'markingModeId': enums.MarkingMode.Approval,
                'markingModeName': "Standardisation",
                'count': 1,
                'target': 1,
                'isstmSeed': 0
                },
            {
                'markingModeId': enums.MarkingMode.ES_TeamApproval,
                'markingModeName': "2nd Standardisation",
                'count': 2,
                'target': 2,
                'isstmSeed': 0
                }
        ];

    var standardisationTargetDetailList: Immutable.List<standardisationTargetDetail>(standardisationTargetDetail);

    dispatcher.dispatch(new localeAction(true, "en-GB", localeJson));

    beforeEach(() => {
        let standardisationLeftPanelSelectResponseItem = {
            linkName: enums.StandardisationSetup.SelectResponse;
            targetCount: 1;
            isVisible: true;
            isSelected: false;
        };
        var standardisationLeftPanelProvisionalItem = {
            linkName: enums.StandardisationSetup.ProvisionalResponse;
            targetCount: 2;
            isVisible: true;
            isSelected: false;
        };

        var standardisationLeftPanelUnClassifiedItem = {
            linkName: enums.StandardisationSetup.UnClassifiedResponse;
            targetCount: 3;
            isVisible: true;
            isSelected: false;
        };
        var standardisationLeftPanelClassifiedItem = {
            linkName: enums.StandardisationSetup.ClassifiedResponse;
            targetCount: 4;
            isVisible: true;
            isSelected: true;
        };

        availableStandardisationSetupLinks.push(standardisationLeftPanelSelectResponseItem);
        availableStandardisationSetupLinks.push(standardisationLeftPanelProvisionalItem);
        availableStandardisationSetupLinks.push(standardisationLeftPanelUnClassifiedItem);
        availableStandardisationSetupLinks.push(standardisationLeftPanelClassifiedItem);

        //standardisationLeftCollapsiblePanelProps = {
        //    renderedON?: Date.now(),
        //    availableStandardisationSetupLinks: availableStandardisationSetupLinks,
        //    standardisationTargetDetails: standardisationTargetDetailList,
        //    onLinkClick: jest.fn()
        //}
   
        standardisationLeftPanelComponent = <div>
            <StandardisationLeftCollapsiblePanel 
            renderdOn = { Date.now() }
            availableStandardisationSetupLinks = { availableStandardisationSetupLinks }
            standardisationTargetDetails = { standardisationTargetDetailList }
            onLinkClick = {()=> { }} /></div>;

        renderedOutput = reactTestUtils.renderIntoDocument(standardisationLeftPanelComponent);
    });

it("will render the component and check the Standardisation Setup type name and count", () => {
        var classifiedTabPanelCssClass = reactDOM.findDOMNode(renderedOutput).children[0].children[0].children[0].children[0].children[3].className;
        expect(classifiedTabPanelCssClass).toContain("classified");

        var targetCount = reactDOM.findDOMNode(renderedOutput).children[0].children[0].children[0].children[0].children[3].textContent;
        expect(targetCount).toBe("4Classified");

        var StandardisationCount = reactDOM.findDOMNode(renderedOutput).children[0].children[0].children[1].children[0].children[1].textContent;
        expect(StandardisationCount).toBe("Standardisation1/1");
    });
    //tick-circle-icon
}
