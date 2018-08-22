jest.dontMock('../../../src/components/utility/tab/tabcontrol');
jest.dontMock('../../../src/components/utility/tab/tabcontentcontainer');

import react = require('react');
import reactDOM = require('react-dom');
import testUtils = require('react-dom/test-utils');

import TabControl = require('../../../src/components/utility/tab/tabcontrol');
import TabHeader = require('../../../src/components/utility/tab/tabheader');
import TabContentContainer = require('../../../src/components/utility/tab/tabcontentcontainer');
import TabContent = require('../../../src/components/utility/tab/tabcontent');
import enums = require('../../../src/components/utility/enums');

describe("Test case for Tab control", () => {

    var renderTabControlResult, renderTabContainerResult = undefined;

    afterEach(() => {
        renderTabControlResult, renderTabContainerResult = undefined;
    });

    it("Check whether tab control is rendered or not", function () {
        renderTab(enums.ResponseMode.open, 13, 10, 20, true);
        expect(renderTabControlResult).not.toBeNull();
        expect(renderTabContainerResult).not.toBeNull();
    });

    it("Check whether open, in Grace and closed tabs are rendered or not", function () {
        renderTab(enums.ResponseMode.open, 13, 10, 20, true);
        // check whether open tab is rendered or not
        var openTab = testUtils.findRenderedDOMComponentWithClass(renderTabControlResult, 'arrow-tab resp-open');
        expect(openTab).not.toBeNull();

        // check whether grace tab is rendered or not
        var inGraceTab = testUtils.findRenderedDOMComponentWithClass(renderTabControlResult, 'arrow-tab resp-grace');
        expect(inGraceTab).not.toBeNull();

        // check whether closed tab is rendered or not
        var closedTab = testUtils.findRenderedDOMComponentWithClass(renderTabControlResult, 'arrow-tab resp-closed');
        expect(closedTab).not.toBeNull();

    });

    it("Check In-Grace tab is rendering based on the boolean field", function () {
        renderTab(enums.ResponseMode.open, 13, 10, 20, false);

        //check grace tab is not rendering
        var scryTabHeaderComponent = testUtils.scryRenderedComponentsWithType(renderTabControlResult, TabHeader);

        for (var index = 0; index < scryTabHeaderComponent.length; index++) {
                expect(scryTabHeaderComponent[index].props.headerText).not.toBe("In Grace");
            }
    });

    it("Check tab contents are rendered or not", function () {

        renderTab(enums.ResponseMode.open, 13, 10, 20, true);
        //check grace tab is not rendering
        var scryTabContentComponent = testUtils.scryRenderedComponentsWithType(renderTabControlResult, TabContent);

        // This will check content and id of each tab item
        for (var index = 0; index < scryTabContentComponent.length; index++) {
            expect(scryTabContentComponent[index].props.id).toBe('responseTab' + index + 1);
            expect(scryTabContentComponent[index].props.content).not.toBeNull();
        }
    });

   /**
     * This will returns the tab header data
     */
    function getTabHeaderData(selectedTab: enums.ResponseMode, openCount: number, inGraceCount: number, closedCount: number, isGraceTabVisible: boolean): Array<TabHeaderData> {

        let tabHeader: Array<TabHeaderData> = [];
        // isGraceTabVisible will show the Grace tab, if the selected qig has a grace period value > 0 or any responses are available in pending state

       tabHeader.push({
            index: enums.ResponseMode.open,
            class: 'arrow-tab resp-open',
            isSelected: selectedTab === enums.ResponseMode.open,
            tabNavigation: 'responseTab1',
            headerCount: openCount,
            headerText: 'Open for marking',
            id: 'TabHeader_Open',
            key: 'TabHeader_Open'
        });
        if(isGraceTabVisible) {
                tabHeader.push({
                    index: enums.ResponseMode.pending,
                    class: 'arrow-tab resp-grace',
                    isSelected: selectedTab === enums.ResponseMode.pending,
                    tabNavigation: 'responseTab2',
                    headerCount: inGraceCount,
                    headerText: "Submitted - editable",
                    id: 'TabHeader_Grace',
                    key: 'TabHeader_Grace'
                });
        }

        tabHeader.push({
            index: enums.ResponseMode.closed,
            class: 'arrow-tab resp-closed',
            isSelected: selectedTab === enums.ResponseMode.closed,
            tabNavigation: 'responseTab3',
            headerCount: closedCount,
            headerText: "Submitted - closed",
            id: 'TabHeader_Closed',
            key: 'TabHeader_Closed'
         });

        return tabHeader;
    }

     /**
     * This will returns the tab contents
     */
    function getTabData(selectedTab: enums.ResponseMode, isGraceTabVisible: boolean): Array < any > {
        let tabContents: Array<any> = [];
        tabContents.push({
            index: enums.ResponseMode.open,
            class: 'tab-content resp-open',
            isSelected: selectedTab === enums.ResponseMode.open,
            id: 'responseTab1',
            content: '<div>Content</div>'
        });
        if (isGraceTabVisible) {
            tabContents.push({
                    index: enums.ResponseMode.pending,
                    class: 'wrapper tab-content resp-grace',
                    isSelected: selectedTab === enums.ResponseMode.pending,
                    id: 'responseTab2',
                    content: null
                });
        }
        tabContents.push({
                    index: enums.ResponseMode.closed,
                    class: 'wrapper tab-content resp-closed',
                    isSelected: selectedTab === enums.ResponseMode.closed,
                    id: 'responseTab3',
                    content: '<div>Content</div>'
                });
        return tabContents;
   }

    // Method to render tab control
   function renderTab(selectedTab: enums.ResponseMode, openCount: number, inGraceCount: number, closedCount: number, isGraceTabVisible: boolean) {
        var tabControlProps = {
            tabHeaders: getTabHeaderData(selectedTab, openCount, inGraceCount, closedCount, isGraceTabVisible),
            selectTab: jest.genMockFn().mockReturnThis()
        }

        var tabControl = react.createElement(TabControl, tabControlProps, null);
        renderTabControlResult = testUtils.renderIntoDocument(tabControl);

        var tabContentContainerProps = {
            tabContents: getTabData(selectedTab, isGraceTabVisible)
        }

        var tabContentContainer = react.createElement(TabContentContainer, tabContentContainerProps, null);
        renderTabContainerResult = testUtils.renderIntoDocument(tabContentContainer);

    }
});