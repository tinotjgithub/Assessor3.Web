jest.dontMock("../../../src/components/worklist/shared/totalmarkdetail");

import react = require("react");
import reactDOM = require("react-dom");
import reactTestUtils = require('react-dom/test-utils');
import totalmark = require("../../../src/components/worklist/shared/totalmarkdetail");
import Immutable = require("immutable");
import dispatcher = require("../../../src/app/dispatcher");
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");
import overviewData = require("../../../src/stores/qigselector/overviewdata");


describe("Totalmark display", () => {
    let overviewData: overviewData;

    /* Create qig summary json object */
    let qigList = {
        "qigSummary": [
            {
                "examinerRole": 1471,
                "markSchemeGroupId": 186,
                "examinerQigStatus": 7,
                "currentMarkingTarget": {
                    "markingMode": 30
                },
            }
        ],
        "success": true,
        "ErrorMessage": null
    };

    /*Dispatch action to set data in qig store */
    overviewData = qigList;
    overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
    dispatcher.dispatch(new qigSelectorDatafetchAction(true, 186, true, overviewData));

    var renderResult = undefined;

    beforeEach(() => {
        renderResult = undefined;
    });

    it("will render : Check numeric mark and total is displaying", ()=> {

        setTotalMark(false, 10, 100, 10);

        // Checking the total mark.
        var totalMark = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "large-text dark-link");
         expect(parseInt(totalMark.textContent)).toBe(10);
         
    });


    it("will render : Check not displaying any values incase of marking progress 0", () => {
        setTotalMark(false, 0, 0, 0);

        // Checking the total mark is not displayed.
        var totalMark = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "large-text dark-link");
         expect(totalMark.textContent).toMatch(/^\W{2}$/);
    });

    it("will render : Check not displaying any values incase of non-numeric mark and marking progress 0", () => {
        setTotalMark(true, 0, 0, 0);

        // Checking the total mark is not displayed.
        var totalMark = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "large-text dark-link");
         expect(totalMark.textContent).toMatch(/^\W{2}$/);
    });

    it("will render : Check not displaying any values incase of non-numeric mark and marking progress is gt than 0", () => {
        setTotalMark(true, 10, 0, 0);

        // Checking the total mark as '--'
        var totalMark = reactTestUtils.findRenderedDOMComponentWithClass(renderResult, "large-text dark-link");
         expect(totalMark.textContent).toBe("N/A");
    });

    /**
     * Setting the props and rerender the total mark element.
     * @param isNonNumericMark
     * @param markingProgress
     * @param maximumMark
     * @param totalMark
     */
    function setTotalMark(isnonnumericmark: boolean, markingprogress: number, maximummark: number, total: number) {

       var totalMarkProps = {
            selectedLanguage: "en-GB",
            isNonNumericMark: isnonnumericmark,
            maximumMark: maximummark,
            totalMark: total,
            markingProgress: markingprogress
        }

       var totalMarkElement = react.createElement(totalmark, totalMarkProps, null);
       renderResult = reactTestUtils.renderIntoDocument(totalMarkElement);
    }
});

