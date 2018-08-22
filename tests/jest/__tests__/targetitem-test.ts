jest.dontMock('../../../src/components/worklist/targetsummary/targetitem');

import react = require('react');
import reactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');
import TargetItem = require('../../../src/components/worklist/targetsummary/targetitem');

describe("Unit test fot Target Item", () => {
    let renderedOutput;

    beforeEach(() => {
        var targetItemProps = {
            target: {
                examinerRoleID: 1,
                markingModeID: 2,
                markingTargetDate: new Date(2016, 3, 24),
                maximumMarkingLimit: 10,
                isTargetCompleted: false,
                targetCompletedDate: new Date(),
                maximumConcurrentLimit: 5,
                isCurrentTarget: true
            },
            isDisabled: false,
            isSelected: true,
            onClickCallback: null
        };

        var targetItemComponent = react.createElement(TargetItem, targetItemProps);
        renderedOutput = reactTestUtils.renderIntoDocument(targetItemComponent);
    });

    it('Test whether the target item component renders', function () {
        expect(renderedOutput).not.toBeNull();
    });

    it('Test whether the target item is in open state', function () {
        var panelOpenDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'panel open');
        expect(panelOpenDOM).not.toBeNull();
    });

    it('Test whether the target item is not in disabled state', function () {
        var panelDisabledDOM = reactTestUtils.scryRenderedDOMComponentsWithClass(renderedOutput, 'panel disabled');
        expect(panelDisabledDOM[0]).toBeUndefined();
    });

    it('Test whether the days until section is displayed', function () {
        var remainingDateDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'remaining-date');
        expect(remainingDateDOM).not.toBeNull();
    });

    it('Test whether the target date section is rendered', function () {
        var targetDateDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'date-text');
        expect(targetDateDOM).not.toBeNull();
    });

    it('Test whether the target date section is rendering expected date', function () {
        var targetDateDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'date-text');
        expect(targetDateDOM.textContent).toBe('4/24/2016');
    });

    it('Test whether the current target class is set', function () {
        var currentTargetDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'sprite-icon pencil-icon');
        expect(currentTargetDOM).not.toBeNull();
    });

    it('Test whether the target item is in disabled state', function () {
        var targetItemProps = {
            target: {
                examinerRoleID: 1,
                markingModeID: 2,
                markingTargetDate: new Date(2016, 3, 24),
                maximumMarkingLimit: 10,
                isTargetCompleted: false,
                targetCompletedDate: new Date(),
                maximumConcurrentLimit: 5,
                isCurrentTarget: true
            },
            isDisabled: true,
            isSelected: true,
            onClickCallback: null
        };

        var targetItemComponent = react.createElement(TargetItem, targetItemProps);
        renderedOutput = reactTestUtils.renderIntoDocument(targetItemComponent);

        var panelDisabledDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'panel disabled');
        expect(panelDisabledDOM).not.toBeNull();
    });

    it('Test whether the completed target class is set for a completed target', function () {

        var targetItemProps = {
            target: {
                examinerRoleID: 1,
                markingModeID: 2,
                markingTargetDate: new Date(2016, 3, 24),
                maximumMarkingLimit: 10,
                isTargetCompleted: true,
                targetCompletedDate: new Date(2016, 3, 30),
                maximumConcurrentLimit: 5,
                isCurrentTarget: false
            },
            isDisabled: true,
            isSelected: true,
            onClickCallback: null
        };

        var targetItemComponent = react.createElement(TargetItem, targetItemProps);
        renderedOutput = reactTestUtils.renderIntoDocument(targetItemComponent);

        var targetCompletedDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'sprite-icon tick-circle-icon');
        expect(targetCompletedDOM).not.toBeNull();
    });

    it('Test whether the future state class is set for a target in future', function () {

        var targetItemProps = {
            target: {
                examinerRoleID: 1,
                markingModeID: 2,
                markingTargetDate: new Date(2017, 10, 24),
                maximumMarkingLimit: 10,
                isTargetCompleted: false,
                targetCompletedDate: new Date(),
                maximumConcurrentLimit: 5,
                isCurrentTarget: false
            },
            isDisabled: true,
            isSelected: false,
            onClickCallback: null
        };

        var targetItemComponent = react.createElement(TargetItem, targetItemProps);
        renderedOutput = reactTestUtils.renderIntoDocument(targetItemComponent);

        var targetCompletedDOM = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'sprite-icon dot-dot-dot-icon');
        expect(targetCompletedDOM).not.toBeNull();
    });
});