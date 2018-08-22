jest.dontMock('../../../src/components/worklist/targetsummary/liveorpooledremarktargetitem');

import react = require('react');
import reactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');
import LiveTargetItem = require('../../../src/components/worklist/targetsummary/liveorpooledremarktargetitem');

describe("Unit test fot Target Item", () => {
    let renderedOutput;

    beforeEach(() => {
        var targetItemProps = {
            target: {
                examinerRoleID: 1,
                markingModeID: 30,
                markingTargetDate: new Date(2016, 3, 24),
                maximumMarkingLimit: 30,
                isTargetCompleted: false,
                targetCompletedDate: new Date(),
                maximumConcurrentLimit: 5,
                isCurrentTarget: true,
                examinerProgress: {
                    openResponsesCount: 10,
                    closedResponsesCount: 20,
                    pendingResponsesCount: 0,
                    atypicalOpenResponsesCount: 10,
                    atypicalPendingResponsesCount: 5,
                    atypicalClosedResponsesCount: 0,
                    supervisorRemarkOpenResponsesCount: 0,
                    conditionalApprovalConcurrentLimit: 0,
                }
            },
            isDisabled: false,
            isSelected: true,
            onClickCallback: null
        };

        var targetItemComponent = react.createElement(LiveTargetItem, targetItemProps);
        renderedOutput = reactTestUtils.renderIntoDocument(targetItemComponent);
    });

    it('Test whether the live target item component renders', function () {
        expect(renderedOutput).not.toBeNull();
    });

    it('Test whether the progress radial renders for live target.', function () {
        var radialProgressDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'radial-progress-holder');
        expect(radialProgressDOM).not.toBeNull();
    });

    it('Test whether the summary count is as expected.', function () {
        var summaryTextDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'large-text');
        expect(summaryTextDOM[0].textContent).toBe('25/30');
    });

    it('Test whether the target panel renders for live target.', function () {
        var targetPanelDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'panel-content clearfix');
        expect(targetPanelDOM).not.toBeNull();
    });

    it('Test whether the live target panel count is rendered as expected.', function () {
        var targetPanelDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'menu-count');
        expect(targetPanelDOM[1].textContent.trim()).toBe('10');
    });
    
    it('Test whether the target date section is rendering expected date', function () {
        var targetDateDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'date-text');
        expect(targetDateDOM.textContent).toBe('4/24/2016');
    });
});