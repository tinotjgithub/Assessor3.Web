import react = require('react');
import testUtils = require('react-dom/test-utils');
import SearchPanel = require('../../../src/components/utility/search/searchpanel');

describe('Message search panel test', () => {
    let searchPanelComponent;
    let searchPanelComponentDOM;

    it('check if searchpanel is rendered', () => {
        var searchPanelProps = {
            onSearch: jest.genMockFn(),
            searchData: {
                isVisible: true,
                isSearching: false,
                searchText: ''
            }
        };
        searchPanelComponent = SearchPanel(searchPanelProps);
        searchPanelComponentDOM = testUtils.renderIntoDocument(searchPanelComponent);
        expect(searchPanelComponentDOM).not.toBeNull();
    });
});
