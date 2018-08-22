import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import enums = require("../../../src/components/utility/enums");
import MarksDifferenceColumn = require("../../../src/components/worklist/shared/marksdifferencecolumn");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import ccAction = require('../../../src/actions/configurablecharacteristics/configurablecharacteristicsaction');
import worklistAction = require("../../../src/actions/worklist/worklisttypeaction");
describe("Test suite for Marks difference Column", function () {

// setting default cc data
    let ccData = {
        "configurableCharacteristics": [{
            "ccName": "ShowStandardisationDefinitiveMarks",
            "ccValue": "true",
            "valueType": 1,
            "markSchemeGroupID": 0,
            "questionPaperID": 0,
            "examSessionID": 0
        }],
        "success": true,
        "errorMessage": null
    }

    // dispatch default action
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    dispatcher.dispatch(new worklistAction(enums.WorklistType.standardisation, enums.ResponseMode.closed, enums.RemarkRequestType.Unknown, true, false, null));
    dispatcher.dispatch(new ccAction(true, enums.ConfigurableCharacteristicLevel.MarkSchemeGroup, ccData));

    // setting props values to pass into component
    var absoluteMarksDifference = 5;
    var totalMarksDifference = 5;
    var accuracyIndicator = 11;
    var isTileView = true;
    var clsNameAccuracy = "tolerance-level small-text";
    var clsNameAMD = "amd small-text";
    var clsNameTMD = "tmd small-text";

    var accuracy = "In Tolerance";
    var markdifferenceAMD = "Absolute difference: ";
    var markdifferenceTMD = "Total difference: ";

    /** To check if the Marks Difference component for AMD and TMD has been loaded or not **/
    it("checks if the Marks Difference component for AMD has been loaded", () => {
        var marksDifferenceColumn = <MarksDifferenceColumn absoluteMarksDifference= { absoluteMarksDifference } totalMarksDifference= { totalMarksDifference } accuracyIndicator= { accuracyIndicator } isTileView= { isTileView } showAccuracyIndicator= { true } selectedLanguage= { "en-GB"} />;

        // to check component has been rendered
        var marksDifferenceColumnDOM = TestUtils.renderIntoDocument(marksDifferenceColumn);
        expect(marksDifferenceColumnDOM).not.toBeNull();

        // to check particular class name has been rendered for accuracy
        var marksDifferenceColumnClassName = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceColumnDOM, clsNameAccuracy).className;
        expect(marksDifferenceColumnClassName).toBe(clsNameAccuracy);

        // to check particular content has been rendered for accuracy
        var marksDifferenceColumnContent = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceColumnDOM, clsNameAccuracy).textContent;
        expect(marksDifferenceColumnContent).toBe(accuracy);

        // to check particular class name has been rendered for AMD
        var marksDifferenceColumnClassName1 = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceColumnDOM, clsNameAMD).className;
        expect(marksDifferenceColumnClassName1).toBe(clsNameAMD);

        // to check particular content has been rendered for AMD
        var marksDifferenceColumnContent1 = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceColumnDOM, clsNameAMD).textContent;
        expect(marksDifferenceColumnContent1).toBe(markdifferenceAMD + absoluteMarksDifference);

        // to check particular class name has been rendered for TMD
        var marksDifferenceColumnClassName2 = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceColumnDOM, clsNameTMD).className;
        expect(marksDifferenceColumnClassName2).toBe(clsNameTMD);

        // to check particular content has been rendered for TMD
        var marksDifferenceColumnContent2 = TestUtils.findRenderedDOMComponentWithClass(marksDifferenceColumnDOM, clsNameTMD).textContent;
        var totalMarksDifferenceDisplayContent = markdifferenceTMD + (totalMarksDifference > 0 ? '+' : '') + totalMarksDifference;
        expect(marksDifferenceColumnContent2).toBe(totalMarksDifferenceDisplayContent);

    });

});
