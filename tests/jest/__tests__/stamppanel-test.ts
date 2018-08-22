jest.dontMock('../../../src/components/response/toolbar/stamppanel/stamppanel');
import React = require('react');
import ReactDOM = require('react-dom');
import testUtils = require('react-dom/test-utils');
import StampPanel = require('../../../src/components/response/toolbar/stamppanel/stamppanel');
import Immutable = require("immutable");
import enums = require('../../../src/components/utility/enums');
import toolbarActionCreator = require('../../../src/actions/toolbar/toolbaractioncreator');
import stampPanelAction = require('../../../src/actions/toolbar/stamppanelaction');
import toolbarStore = require('../../../src/stores/toolbar/toolbarstore');
import dispatcher = require("../../../src/app/dispatcher");
import stampSelectAction = require('../../../src/actions/toolbar/stampselectaction');
import markerOperationModeChangedAction = require('../../../src/actions/userinfo/markeroperationmodechangedaction');
import qigSelectorDatafetchAction = require("../../../src/actions/qigselector/qigselectordatafetchaction");

toolbarActionCreator.ChangeStampPanelMode = jest.genMockFn();
toolbarActionCreator.SelectStamp = jest.genMockFn();

describe('Checking whether the StampPanel component is rendering correctly', () => {

    let renderResult;
    let overviewData: overviewData;
    let setNumberOfColumnsInFavouriteToolBarFunction = jest.genMockFn();
    let doDisableMarkingOverlay = jest.genMockFn();

    beforeEach(() => {

        let qigList = {
            "qigSummary": [
                {
                    "examinerRole": 909,
                    "markSchemeGroupId": 2,
                    "examinerQigStatus": 7,
                    "currentMarkingTarget": {
                        "markingMode": 30
                    },
                }
            ],
            "success": true,
            "ErrorMessage": null
        };

        overviewData = qigList;
        overviewData.qigSummary = Immutable.List(overviewData.qigSummary);
        dispatcher.dispatch(new qigSelectorDatafetchAction(true, 2, true, overviewData));

        /*stamp panel props */
        var favouriteStampsCollection =
            [
                {
                    'stampId': 11,
                    'name': 'Tick',
                    'displayName': 'Tick',
                    'svgImage': '<svg  viewBox="0 0 24 20" preserveAspectRatio="xMidYMid meet"><g><polygon points="8.3,18.7 6.9,15.8 20.7,2 22.9,4.1  "/><polygon points="8.3,18.7 1,11.4 3.1,9.2 10,16.1  "/></g></svg>',
                    'stampType': enums.StampType.image
                },
                {
                    'stampId': 21,
                    'name': 'Cross',
                    'displayName': 'Cross',
                    'svgImage': '<svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet"><polygon points="18.3,3.9 16.1,1.7 10,7.9 3.9,1.7 1.7,3.9 7.9,10 1.7,16.1 3.9,18.3 10,12.1 16.1,18.3 18.3,16.1 12.1,10 "/></svg>',
                    'stampType': enums.StampType.image
                },
                {
                    'stampId': 171,
                    'name': 'On Page Comment',
                    'displayName': 'On Page Comment',
                    'svgImage': '<svg viewBox="0 0 32 22" preserveAspectRatio="xMidYMid meet"><g><rect x="12" y="7" width="9" height="2"/><rect x="15" y="7.8" width="3" height="8.2"/><g><path d="M11,6H6V1h5V6z M8,4h1V3H8V4z"/></g><g><path d="M27,6h-5V1h5V6z M24,4h1V3h-1V4z"/></g><g><path d="M11,22H6v-5h5V22z M8,20h1v-1H8V20z"/></g><g><path d="M27,22h-5v-5h5V22z M24,20h1v-1h-1V20z"/></g><rect x="8" y="7" width="1" height="1"/><rect x="8" y="9" width="1" height="1"/><rect x="8" y="11" width="1" height="1"/><rect x="8" y="13" width="1" height="1"/><rect x="8" y="15" width="1" height="1"/><rect x="24" y="7" width="1" height="1"/><rect x="24" y="9" width="1" height="1"/><rect x="24" y="11" width="1" height="1"/><rect x="24" y="13" width="1" height="1"/><rect x="24" y="15" width="1" height="1"/><rect x="18" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 22 -15)" width="1" height="1"/><rect x="20" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 24 -17)" width="1" height="1"/><rect x="16" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 20 -13)" width="1" height="1"/><rect x="14" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 18 -11)" width="1" height="1"/><rect x="12" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 16 -9)" width="1" height="1"/><rect x="18" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 38 1)" width="1" height="1"/><rect x="20" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 40 -1)" width="1" height="1"/><rect x="16" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 36 3)" width="1" height="1"/><rect x="14" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 34 5)" width="1" height="1"/><rect x="12" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 32 7)" width="1" height="1"/></g></svg>',
                    'stampType': enums.StampType.dynamic
                },
                {
                    'stampId': 481,
                    'name': 'CON',
                    'displayName': 'CON',
                    'svgImage': '',
                    'stampType': enums.StampType.text
                }
            ];

        var actualStampsCollection =
            [
                {
                    'stampId': 11,
                    'name': 'Tick',
                    'displayName': 'Tick',
                    'svgImage': '<svg  viewBox="0 0 24 20" preserveAspectRatio="xMidYMid meet"><g><polygon points="8.3,18.7 6.9,15.8 20.7,2 22.9,4.1  "/><polygon points="8.3,18.7 1,11.4 3.1,9.2 10,16.1  "/></g></svg>',
                    'stampType': enums.StampType.image
                },
                {
                    'stampId': 21,
                    'name': 'Cross',
                    'displayName': 'Cross',
                    'svgImage': '<svg viewBox="0 0 20 20" preserveAspectRatio="xMidYMid meet"><polygon points="18.3,3.9 16.1,1.7 10,7.9 3.9,1.7 1.7,3.9 7.9,10 1.7,16.1 3.9,18.3 10,12.1 16.1,18.3 18.3,16.1 12.1,10 "/></svg>',
                    'stampType': enums.StampType.image
                },
                {
                    'stampId': 171,
                    'name': 'On Page Comment',
                    'displayName': 'On Page Comment',
                    'svgImage': '<svg viewBox="0 0 32 22" preserveAspectRatio="xMidYMid meet"><g><rect x="12" y="7" width="9" height="2"/><rect x="15" y="7.8" width="3" height="8.2"/><g><path d="M11,6H6V1h5V6z M8,4h1V3H8V4z"/></g><g><path d="M27,6h-5V1h5V6z M24,4h1V3h-1V4z"/></g><g><path d="M11,22H6v-5h5V22z M8,20h1v-1H8V20z"/></g><g><path d="M27,22h-5v-5h5V22z M24,20h1v-1h-1V20z"/></g><rect x="8" y="7" width="1" height="1"/><rect x="8" y="9" width="1" height="1"/><rect x="8" y="11" width="1" height="1"/><rect x="8" y="13" width="1" height="1"/><rect x="8" y="15" width="1" height="1"/><rect x="24" y="7" width="1" height="1"/><rect x="24" y="9" width="1" height="1"/><rect x="24" y="11" width="1" height="1"/><rect x="24" y="13" width="1" height="1"/><rect x="24" y="15" width="1" height="1"/><rect x="18" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 22 -15)" width="1" height="1"/><rect x="20" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 24 -17)" width="1" height="1"/><rect x="16" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 20 -13)" width="1" height="1"/><rect x="14" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 18 -11)" width="1" height="1"/><rect x="12" y="3" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 16 -9)" width="1" height="1"/><rect x="18" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 38 1)" width="1" height="1"/><rect x="20" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 40 -1)" width="1" height="1"/><rect x="16" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 36 3)" width="1" height="1"/><rect x="14" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 34 5)" width="1" height="1"/><rect x="12" y="19" transform="matrix(-1.836970e-016 1 -1 -1.836970e-016 32 7)" width="1" height="1"/></g></svg>',
                    'stampType': enums.StampType.dynamic
                },
                {
                    'stampId': 481,
                    'name': 'CON',
                    'displayName': 'CON',
                    'svgImage': '',
                    'stampType': enums.StampType.text
                }
            ];

        var stampsPanelProps = {
            favouriteStampsCollection: Immutable.List<stampData>(favouriteStampsCollection),
            actualStampsCollection: Immutable.List<stampData>(actualStampsCollection),
            setNumberOfColumnsInFavouriteToolBar: setNumberOfColumnsInFavouriteToolBarFunction,
            onDragOver: jest.genMockFn().mockReturnThis(),
            isStampPanelExpanded: true,
            isOverlayAnnotationsVisible: true,
            doDisableMarkingOverlay: doDisableMarkingOverlay
        };

        dispatcher.dispatch(new markerOperationModeChangedAction(enums.MarkerOperationMode.Marking, false));

        var stampPanelComponent = React.createElement(StampPanel, stampsPanelProps, null);
        renderResult = testUtils.renderIntoDocument(stampPanelComponent);
    });

    it("check if the stamp panel gets rendered", () => {
        expect(renderResult).not.toBeNull();
    });

    it('check if the stamps panel is collapsed', function () {
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(renderResult, 'marking-tools-panel collapsed');
        expect(imgDOM.length).toBe(1);
    });

    it('check if the static image stamps get rendered on the favourites and main panel', function () {
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(renderResult, 'Tick-icon');
        expect(imgDOM.length).toBe(2);
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(renderResult, 'Cross-icon');
        expect(imgDOM.length).toBe(2);
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(renderResult, 'Comment-icon');
        expect(imgDOM.length).toBe(2);
        var imgDOM = testUtils.scryRenderedDOMComponentsWithClass(renderResult, 'CON-icon');
        expect(imgDOM.length).toBe(2);
    });

    it('check the stamp panel expand functionality', function () {
        var expandCollapseLink = testUtils.findRenderedDOMComponentWithClass(renderResult, "expandcollapselink");
        expect(expandCollapseLink).not.toBe(null);
        dispatcher.dispatch(new stampPanelAction(true));
        testUtils.Simulate.click(expandCollapseLink);
        expect(toolbarActionCreator.ChangeStampPanelMode).toBeCalled();
        expect(toolbarStore.instance.isStampPanelExpanded).toBe(true);
    });

    it('check if the static image stamp section gets rendered once the stamp panel is expanded', function () {
        renderResult.setState({ isStampPanelExpanded: true, renderedOn: Date.now() })
        jest.runAllTicks();

        var result = testUtils.findRenderedDOMComponentWithClass(renderResult, 'static-tools');
        expect(result).not.toBeNull();

        var result = testUtils.findRenderedDOMComponentWithClass(renderResult, 'dynamic-tools');
        expect(result).not.toBeNull();

        var result = testUtils.findRenderedDOMComponentWithClass(renderResult, 'txt-tool-icons');
        expect(result).not.toBeNull();
    });

    it('check if the static dynamic stamp section gets rendered once the stamp panel is expanded', function () {
        renderResult.setState({ isStampPanelExpanded: true, renderedOn: Date.now() })
        jest.runAllTicks();

        var result = testUtils.findRenderedDOMComponentWithClass(renderResult, 'dynamic-tools');
        expect(result).not.toBeNull();
    });

    it('check if the static text stamp section gets rendered once the stamp panel is expanded', function () {
        renderResult.setState({ isStampPanelExpanded: true, renderedOn: Date.now() })
        jest.runAllTicks();

        var result = testUtils.findRenderedDOMComponentWithClass(renderResult, 'txt-tool-icons');
        expect(result).not.toBeNull();
    });

    it('check the stamp selection functionality', function () {

        var favouriteStampsCollection = [];
        var actualStampsCollection =
            [
                {
                    'stampId': 21,
                    'name': 'Cross',
                    'displayName': 'Cross',
                    'svgImage': '<g> <rect x="14.5" y="5.8" transform="matrix(0.7071 0.7071 -0.7071 0.7071 16 -6.6274)"  width="3" height="20.4"/> <rect x="14.5" y="5.8" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 38.6274 16)"  width="3" height="20.4"/></g>',
                    'stampType': enums.StampType.image
                }
            ];

        var stampsPanelProps = {
            favouriteStampsCollection: Immutable.List<stampData>(favouriteStampsCollection),
            actualStampsCollection: Immutable.List<stampData>(actualStampsCollection),
            setNumberOfColumnsInFavouriteToolBar: setNumberOfColumnsInFavouriteToolBarFunction,
            onDragOver: jest.genMockFn().mockReturnThis(),
            isStampPanelExpanded: true,
            isOverlayAnnotationsVisible: true,
            doDisableMarkingOverlay: doDisableMarkingOverlay
        };

        var stampPanelComponent = React.createElement(StampPanel, stampsPanelProps, null);
        renderResult = testUtils.renderIntoDocument(stampPanelComponent);

        var stampSelectLink = testUtils.scryRenderedDOMComponentsWithClass(renderResult, "tool-link");
        expect(stampSelectLink.length).toBe(5);
        dispatcher.dispatch(new stampSelectAction(21, true));
        testUtils.Simulate.click(stampSelectLink[3]);
        expect(toolbarActionCreator.SelectStamp).toBeCalled();
        expect(toolbarStore.instance.selectedStampId).toBe(21);
        var selectedStampLink = testUtils.findRenderedDOMComponentWithClass(renderResult, "selected");
        expect(selectedStampLink).not.toBe(null);
    });

    it('check the stamp deselection functionality', function () {

        var favouriteStampsCollection = [];
        var actualStampsCollection =
            [
                {
                    'stampId': 21,
                    'name': 'Cross',
                    'displayName': 'Cross',
                    'svgImage': '<g> <rect x="14.5" y="5.8" transform="matrix(0.7071 0.7071 -0.7071 0.7071 16 -6.6274)"  width="3" height="20.4"/> <rect x="14.5" y="5.8" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 38.6274 16)"  width="3" height="20.4"/></g>',
                    'stampType': enums.StampType.image
                }
            ];

        var stampsPanelProps = {
            favouriteStampsCollection: Immutable.List<stampData>(favouriteStampsCollection),
            actualStampsCollection: Immutable.List<stampData>(actualStampsCollection),
            setNumberOfColumnsInFavouriteToolBar: setNumberOfColumnsInFavouriteToolBarFunction,
            onDragOver: jest.genMockFn().mockReturnThis(),
            isStampPanelExpanded: true,
            isOverlayAnnotationsVisible: true,
            doDisableMarkingOverlay: doDisableMarkingOverlay
        };

        var stampPanelComponent = React.createElement(StampPanel, stampsPanelProps, null);
        renderResult = testUtils.renderIntoDocument(stampPanelComponent);

        var stampSelectLink = testUtils.scryRenderedDOMComponentsWithClass(renderResult, "tool-link");
        expect(stampSelectLink.length).toBe(5);
        dispatcher.dispatch(new stampSelectAction(21, true));
        testUtils.Simulate.click(stampSelectLink[3]);
        expect(toolbarActionCreator.SelectStamp).toBeCalled();
        expect(toolbarStore.instance.selectedStampId).toBe(21);
        var selectedStampLink = testUtils.findRenderedDOMComponentWithClass(renderResult, "selected");
        expect(selectedStampLink).not.toBe(null);

        // De-selecting the annotation
        dispatcher.dispatch(new stampSelectAction(21, false));
        testUtils.Simulate.click(stampSelectLink[3]);
        expect(toolbarActionCreator.SelectStamp).toBeCalled();
        expect(toolbarStore.instance.selectedStampId).toBe(0);
        selectedStampLink = testUtils.scryRenderedDOMComponentsWithClass(renderResult, "selected");
        expect(selectedStampLink.length).toBe(0);
    });
});