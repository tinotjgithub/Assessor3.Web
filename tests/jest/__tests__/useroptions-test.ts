jest.dontMock("../../../src/components/user/useroptions/useroptions");
import shallowRenderer = require('react-test-renderer/shallow');
import react = require("react");
import userOptions = require("../../../src/components/user/useroptions/useroptions");
import languageSelector = require("../../../src/components/utility/locale/languageselector");

describe("Test suite for Useroptions component", () => {
    var shallowRender = new shallowRenderer();
    var userOptionsProp = { selectedLanguage: "en-GB" };
    var userDetails = react.createElement(userOptions, userOptionsProp, null);
    shallowRender.render(userDetails);

    it("will check whether User options rendered", () => {
        var renderuserOptions = shallowRender.getRenderOutput();
        expect(renderuserOptions).not.toBeNull();
    });
});