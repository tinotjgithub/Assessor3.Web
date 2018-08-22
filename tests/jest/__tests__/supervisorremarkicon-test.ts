jest.dontMock("../../../src/components/response/toolbar/supervisoricons/supervisorremarkicon")

import react = require("react");
import testUtils = require('react-dom/test-utils');
import SupervisorRemarkIcon = require("../../../src/components/response/toolbar/supervisoricons/supervisorremarkicon")


describe("Toolbar panel Component Test", () => {
    /**SupervisorRemarkIcon component rendering test **/
    let supervisorRemarkIconComponent;
    let supervisorRemarkIconComponentDOM;

    beforeEach(() => {
        var superVisorRemarkIconProps = {
            isOpen: false,
            isSupervisorRemarkButtonVisible: true,
            onRemarkButtonClicked: jest.genMockFn().mockReturnThis(),
            onMarkNowButtonClicked: jest.genMockFn().mockReturnThis(),
            onMarkLaterButtonClicked: jest.genMockFn().mockReturnThis()
        }

        supervisorRemarkIconComponent = SupervisorRemarkIcon(superVisorRemarkIconProps);
        supervisorRemarkIconComponentDOM = testUtils.renderIntoDocument(supervisorRemarkIconComponent);
    });

    /** To check if the SupervisorRemarkIcon component has been loaded or not **/
    it("checks if the toolbarpanel component has been loaded", () => {
        expect(supervisorRemarkIconComponentDOM).not.toBeNull();
    });



});