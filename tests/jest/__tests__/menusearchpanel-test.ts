import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
var localJson = require('../../../content/resources/rm-en.json');
import dispatcher = require('../../../src/app/dispatcher');
import localAction = require('../../../src/actions/locale/localeaction');
import MenuSearchPanel = require('../../../src/components/menu/menusearchpanel');

describe("Menu search panel test", function () {

    // Set the default locale
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));

    var menuSearchPanelProps = {
        
        id: 'search-panel',
        key: 'search-panel-key',
        searchText: '678596',
        qigName: 'ENGLISH AB. SL PAPER TWO in ENGLISH'
        onSearch: Function,
        onSearchClick: Function
    };

    let menuSearchPanel = MenuSearchPanel(menuSearchPanelProps);
    let menuSearchPanelDOM = TestUtils.renderIntoDocument(menuSearchPanel);

    /** To check if the Menu search panel component has been rendered or not **/
    it("check if the Menu search panel component has been rendered", () => {
        expect(menuSearchPanelDOM).not.toBeNull();
    });

   /** To check if the Menu search panel component header has been rendered or not **/
    it("check if the Menu search panel component header has been rendered", () => {
        expect(menuSearchPanelDOM.children[0].textContent).toBe('Search');
    });

    /** To check if the Menu search panel component Qig name has been rendered or not **/
    it("check if the Menu search panel component Qig name has been rendered", () => {
        expect(menuSearchPanelDOM).not.toBeNull();
        expect(menuSearchPanelDOM.children[1].children[0].
        textContent).toBe('ENGLISH AB. SL PAPER TWO in ENGLISH');
    });

   /** To check if the Menu search panel component search box placeholder has been rendered or not **/
    it("check if the Menu search panel component search box placeholder has been rendered", () => {
        expect(menuSearchPanelDOM).not.toBeNull();
        expect(menuSearchPanelDOM.children[1].children[1].children[0].children[0].
        children[0].textContent).toBe('Search for a response by ID');
    });

    /** To check if the Menu search panel component search box close button has been rendered or not **/
    it("check if the Menu search panel component search box close button has been rendered", () => {
        expect(menuSearchPanelDOM).not.toBeNull();
        expect(menuSearchPanelDOM.children[1].children[1].children[0].children[0].
        children[2].textContent).toBe('Closed');
    });
  
     /** To check if the Menu search panel component search button has been rendered or not **/
    it("check if the Menu search panel component search button has been rendered", () => {
        expect(menuSearchPanelDOM).not.toBeNull();
        expect(menuSearchPanelDOM.children[1].children[2].textContent).toBe('Search');
    });

});
