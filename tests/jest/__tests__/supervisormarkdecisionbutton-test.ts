jest.dontMock('../../../src/components/markschemestructure/supervisormarkdecisionbutton');
import React = require('react');
import ReactDOM = require('react-dom');
import reactTestUtils = require('react-dom/test-utils');
import SupervisorMarkDecisionButton = require('../../../src/components/markschemestructure/supervisormarkdecisionbutton');
import enums = require('../../../src/components/utility/enums.ts');

/**
* Test suit for the treeview
*/
describe('supervisor remark decision test', () => {

    let onRemarkDecisionButtonClick = jest.genMockFn().mockReturnThis();
    let renderedOutput;

    /** supervisor remark decision componet test */
    it('checks if the component is renderd ', () => {
        let remarkDecisionProp = {
            isReadonly: true,
            onButtonClick: onRemarkDecisionButtonClick
        };

        var remarkDecisionComponent = React.createElement(SupervisorMarkDecisionButton, remarkDecisionProp);
        renderedOutput = reactTestUtils.renderIntoDocument(remarkDecisionComponent);

        expect(renderedOutput).not.toBeNull();
        let divClass = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'sprite-icon edit-box-icon');
        expect(divClass.className).toBe('sprite-icon edit-box-icon');
    });

    /** supervisor remark decision componet test */
    it('checks if the clas success exist for accurate ', () => {

        let remarkDecisionProp = {
            isReadonly: false,
            onButtonClick: onRemarkDecisionButtonClick
        };

        var remarkDecisionComponent = React.createElement(SupervisorMarkDecisionButton, remarkDecisionProp);
        renderedOutput = reactTestUtils.renderIntoDocument(remarkDecisionComponent);

        let accuracyClass = reactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, 'sprite-icon edit-box-yellow-icon');
        expect(accuracyClass.className).toBe('sprite-icon edit-box-yellow-icon');
    });
});