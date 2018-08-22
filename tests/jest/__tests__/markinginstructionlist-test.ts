jest.dontMock('../../../src/components/worklist/markerinformation/markinginstructionpanel');
jest.dontMock('../../../src/components/worklist/markerinformation/markinginstructionfilepanel');

import react = require("react");
import reactDOM = require("react-dom");
import markingInstructionPanel = require('../../../src/components/worklist/markerinformation/markinginstructionpanel');
import shallowRenderer = require('react-test-renderer/shallow');
import markingInstructionFilePanel = require('../../../src/components/worklist/markerinformation/markinginstructionfilepanel');


describe("Marking Instruction Component Test", () => {
    let componentRender = new shallowRenderer();
    var propsMarkingInstructionPanel = {
        onMarkInstructionFileClick: Function,
        onMarkInstructionPanelClick: Function,
        onMarkingInstructonClickHandler: Function
    }

    /**Marking Instruction Panel component rendering test **/
    let markingInstructionPanelComponent = react.createElement(markingInstructionPanel, propsMarkingInstructionPanel, null);
    let markingInstructionPanelComponentDOM = componentRender.render(markingInstructionPanelComponent);

    /** To check if the marking instruction panel component has been loaded or not **/
    it("checks if the marking instruction panel has been loaded", () => {
        expect(markingInstructionPanelComponentDOM).not.toBeNull();
    });

    var propsMarkingInstructionFilePanel = {
        documentId: 1,
        documentName: 'Test',
        onMarkInstructionFileClick: Function
    }

    /**Marking Instruction File Panel component rendering test **/
    let markingInstructionFilePanelComponent = react.createElement(markingInstructionFilePanel, propsMarkingInstructionFilePanel, null);
    let markingInstructionFilePanelComponentDOM = componentRender.render(markingInstructionFilePanelComponent);
    let renderedOutput = componentRender.getRenderOutput();

    /** To check if the marking instruction panel component has been loaded or not **/
    it("checks if the marking instruction file panel has been loaded", () => {
        expect(markingInstructionFilePanelComponentDOM).not.toBeNull();
    });

    it("checks if the marking instruction panel file name is rendered with proper data", () => {
        expect(markingInstructionFilePanelComponentDOM.props.title).toEqual('Test');
    });
});

