jest.dontMock('../../../src/components/markschemestructure/supervisormarkdecision');
import React = require('react');
import ReactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');
import SupervisorMarkDecision = require('../../../src/components/markschemestructure/supervisormarkdecision');
import enums = require('../../../src/components/utility/enums.ts');

/**
* Test suit for the treeview
*/
describe('supervisor remark decision test', () => {

    let onRemarkDecisionChange = jest.genMockFn().mockReturnThis();
    let calculateAccuracy = jest.genMockFn().mockReturnThis();
    let accuracy: enums.AccuracyIndicatorType = enums.AccuracyIndicatorType.Accurate
    let decisionType: enums.SupervisorRemarkDecisionType = enums.SupervisorRemarkDecisionType.None;
    let renderedOutput;

    beforeEach(() => {
        let remarkDecisionProp = {
            amd: "2",
            tmd: "0",
            accuracy: accuracy,
            onRemarkDecisionChange: onRemarkDecisionChange,
            id: 'remarkdecision',
            calculateAccuracy: calculateAccuracy,
            supervisorRemarkDecisionType: decisionType,
            selectedLanguage: 'en-GB'
        };

        var remarkDecisionComponent = React.createElement(SupervisorMarkDecision, remarkDecisionProp);
        renderedOutput = reactTestUtils.renderIntoDocument(remarkDecisionComponent);
    });

    /** supervisor remark decision componet test */
    it('checks if the component is renderd ', () => {

        expect(renderedOutput).not.toBeNull();
        let divClass = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'eur-reason-holder icon-menu-wrap dropdown-wrap up white supervisor-remark-decision');
        expect(divClass.className).toBe('eur-reason-holder icon-menu-wrap dropdown-wrap up white supervisor-remark-decision');
    });

    /** supervisor remark decision componet test */
    it('checks if the clas success exist for accurate ', () => {

        let accuracyClass = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'eur-accuracy-mark success');
        expect(accuracyClass.className).toBe('eur-accuracy-mark success');
    });
});