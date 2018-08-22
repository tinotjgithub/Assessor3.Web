jest.dontMock("../../../src/components/response/toolbar/supervisoricons/promoteresponseicons");

import react = require("react");
import testUtils = require('react-dom/test-utils');
import promoteResponseIcons = require("../../../src/components/response/toolbar/supervisoricons/promoteresponseicons")


describe("Promote to seed icon test", () => {
    /**SupervisorRemarkIcon component rendering test **/
    let promoteToSeedIconComponent;
    let promoteToSeedIconComponentDOM;

    beforeEach(() => {
        var promoteResponseIconsProps = {
            isVisible: true,
            onClick: jest.genMockFn().mockReturnThis(),
            isPromotToSeedVisible: true,
            isPromotToReuseBucketVisible: true
        }

        promoteToSeedIconComponent = promoteResponseIcons(promoteResponseIconsProps);
        promoteToSeedIconComponentDOM = testUtils.renderIntoDocument(promoteToSeedIconComponent);
    });

    /** To check if the PromoteToSeedIcon component has been loaded or not **/
    it("checks if the promote to seed icon is loaded or not", () => {
        expect(promoteToSeedIconComponentDOM).not.toBeNull();
    });
});