jest.dontMock("../../../src/components/qigselector/qigname.tsx");
jest.dontMock("../../../src/components/utility/enums.ts");

import React = require("react");
import ReactDOM = require("react-dom");
import ReactTestUtils = require('react-dom/test-utils');
import QigName = require("../../../src/components/qigselector/qigname");
import enums = require("../../../src/components/utility/enums");

describe("Test suite for QIG name component", function () {
    let renderedOutput;

    beforeEach(() => {
        var qigNameProps = {
            qigname: "Tarzan"
        }

        var qigNameComponent = React.createElement(QigName, qigNameProps);
        renderedOutput = ReactTestUtils.renderIntoDocument(qigNameComponent);
    });

    it("Tests if the qig name component renders", function () {
        expect(renderedOutput).not.toBeNull();
    });

    it("Tests if the qig name is displaying the expected value", function () {
        var qigNameDOMElement = ReactTestUtils.findRenderedDOMComponentWithClass(renderedOutput, "qig-name");
        expect(qigNameDOMElement.textContent.trim()).toEqual("Tarzan");
    });
});