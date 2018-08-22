jest.dontMock("../../../src/components/markschemestructure/markbyoption");

import react = require("react");
import reactDOM = require("react-dom");
import testUtils = require('react-dom/test-utils');
import Immutable = require("immutable");
import markByOption = require('../../../src/components/markschemestructure/markbyoption');
import dispatcher = require('../../../src/app/dispatcher');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/typings/overviewdata");

describe("Mark by option dropdown Component Test", () => {

    let overviewData: overviewData;

    /* Create qig summary json object */
    let qigList = {
        "qigSummary": [
            {
                "examinerRole": 1471,
                "markSchemeGroupId": 186,
                "examinerQigStatus": 7
            }
        ],
        "Success": true,
        "ErrorMessage": null
    };

    /*Dispatch action to set data in qig store */
    //overviewData = qigList;
    //overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
    //dispatcher.dispatch(new qigSelectorDatafetchAction(true, 58, true, overviewData));

    //let markByOptionComponent = react.createElement(markByOption);
    //let markByOptionComponentDOM = testUtils.renderIntoDocument(markByOptionComponent);

    /** To check if the Mark by option component has been loaded or not **/
    it("checks if the mark by option component has been loaded", () => {
        //expect(markByOptionComponentDOM).not.toBeNull();
    });

    /** Checks if the panel has opend on click **/
    it("Checks if the panel has opend on click", () => {
        //markByOptionComponentDOM.setState({ isOpen: true, isClickedArrowButton: true })
        //let markByOptionClass = testUtils.findRenderedDOMComponentWithClass(markByOptionComponentDOM, 'dropdown-wrap mark-by-menu').className;

        ////Checking whether the expected css class is rendered.
        //expect(markByOptionClass).toBe('dropdown-wrap mark-by-menu open ');
    });

    /** Checks if mark by options have been rendered **/
    it("Checks if mark by options hves been rendered", () => {
        //let markByOptionClass = testUtils.findRenderedDOMComponentWithClass(markByOptionComponentDOM, 'menu').className;

        ////Checking whether the expected css class is rendered.
        //expect(markByOptionClass).toBe('menu');
    });

    /** Checks if the panel has closed on outside click **/
    it("Checks if the panel has closed on outside click", () => {
        //markByOptionComponentDOM.setState({ isOpen: false, isClickedArrowButton: true })
        //let markByOptionClass = testUtils.findRenderedDOMComponentWithClass(markByOptionComponentDOM, 'dropdown-wrap mark-by-menu').className;

        ////Checking whether the expected css class is rendered.
        //expect(markByOptionClass).toBe('dropdown-wrap mark-by-menu close ');
    });
};
