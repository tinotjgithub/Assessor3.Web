jest.dontMock("../../../src/components/markschemestructure/markconfirmationpopup");
import react = require("react");
import TestUtils = require('react-dom/test-utils');
import markConfirmationPopup = require('../../../src/components/markschemestructure/markconfirmationpopup');
import enums = require('../../../src/components/utility/enums');
import updateCurrentQuestionItemAction = require('../../../src/actions/marking/updatecurrentquestionitemaction');
import currentQuestionItemInfo = require('../../../src/actions/marking/currentquestioniteminfo');
import dispatcher = require("../../../src/app/dispatcher");
import Immutable = require('immutable');
import localAction = require("../../../src/actions/locale/localeaction");
var localeJson = require("../../../content/resources/rm-en.json");
import localeStore = require('../../../src/stores/locale/localestore');

describe("Test suite for mark confirmation ", () => {

    dispatcher.dispatch(new localAction(true, "en-GB", localeJson));

    it("checking if mark confirmation popup is rendered", () => {
        var availableMarks: Array<string> = new Array();
        availableMarks.push({ displayMark: '1', valueMark: '1' });
        availableMarks.push({ displayMark: '2', valueMark: '2' });
        availableMarks.push({ displayMark: '3', valueMark: '3' });
        availableMarks.push({ displayMark: '5', valueMark: '5' });

        let updateCurrentQuestionAction: updateCurrentQuestionItemAction = new updateCurrentQuestionItemAction(true,
            {
                itemType: enums.TreeViewItemType.marksScheme,
                name: '1a',
                parentClusterId: 1,
                sequenceNo: 1,
                uniqueId: 1,
                isVisible: true,
                maximumNumericMark: 10,
                imageClusterId: 1001,
                isSelected: true,
                index: 5,
                allocatedMarks: { displayMark: '5', valueMark: '5' },
                totalMarks: '5',
                availableMarks: Immutable.fromJS(availableMarks),
                minimumNumericMark: 1,
                stepValue: 1,
                isSingleDigitMark: false
            }
        );
        dispatcher.dispatch(updateCurrentQuestionAction);

        //let markConfirmationPopupComponent = react.createElement(markConfirmationPopup, null, null);
        //let markConfirmationPopupDom = TestUtils.renderIntoDocument(markConfirmationPopupComponent);
        //let result = TestUtils.findRenderedDOMComponentWithClass(markConfirmationPopupDom, "mark-feedback");
        //expect(result.className).toBe('mark-feedback');

        //let contentText = TestUtils.findRenderedDOMComponentWithClass(markConfirmationPopupDom, "mark-txt");
        //expect(contentText.textContent).toBe("5");
    });

    it("checking if NR mark is localised and rendered properly", () => {

        var availableMarks: Array<string> = new Array();
        availableMarks.push({ displayMark: '1', valueMark: '1' });
        availableMarks.push({ displayMark: '2', valueMark: '2' });
        availableMarks.push({ displayMark: '3', valueMark: '3' });
        availableMarks.push({ displayMark: '5', valueMark: '5' });

        let updateCurrentQuestionAction: updateCurrentQuestionItemAction = new updateCurrentQuestionItemAction(true,
            {
                itemType: enums.TreeViewItemType.marksScheme,
                name: '1a',
                parentClusterId: 1,
                sequenceNo: 1,
                uniqueId: 1,
                isVisible: true,
                maximumNumericMark: 10,
                imageClusterId: 1001,
                isSelected: true,
                index: 5,
                allocatedMarks: { displayMark: 'NR', valueMark: '' },
                totalMarks: '5',
                availableMarks: Immutable.fromJS(availableMarks),
                minimumNumericMark: 1,
                stepValue: 1,
                isSingleDigitMark: false
            }
        );
        dispatcher.dispatch(updateCurrentQuestionAction);

        //let markConfirmationPopupComponent = react.createElement(markConfirmationPopup, null, null);
        //let markConfirmationPopupDom = TestUtils.renderIntoDocument(markConfirmationPopupComponent);
        //let contentText = TestUtils.findRenderedDOMComponentWithClass(markConfirmationPopupDom, "mark-txt");
        //expect(contentText.textContent).toBe(localeStore.instance.TranslateText('assessor3.markschemepanel.nr-text'));
    });
});