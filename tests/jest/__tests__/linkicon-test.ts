import react = require("react");
import testUtils = require('react-dom/test-utils');
import LinkIcon = require("../../../src/components/response/responsescreen/linktopage/linkicon");

/**
 * Test suit for the link icon
 */
describe("link icon test", () => {
    let linkIconComponent = react.createElement(LinkIcon, null, null);
       
    it("checks if link icon is rendered ", () => {
        expect(linkIconComponent).not.toBeNull();
    });
});