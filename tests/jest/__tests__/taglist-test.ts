import enums = require("../../../src/components/utility/enums");
jest.dontMock("../../../src/components/response/responsescreen/taglist");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import TagList = require("../../../src/components/response/responsescreen/taglist");
import Tag = require("../../../src/components/response/responsescreen/tag");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import localeStore = require('../../../src/stores/locale/localestore');
import immutable = require('immutable');

tagLists = JSON.parse(JSON.stringify(tagLists));
let tags: immutable.List<Tag> = new immutable.List<Tag>(tagLists);

describe("Test suite for Tag list Component", function () {
    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var tagListProps = { selectedTagId: 3, tagList: tags, renderedOn: Date.now() };
    var tagListElement = React.createElement(TagList, tagListProps, null);
    var renderTagListComponent = TestUtils.renderIntoDocument(tagListElement);

    it("will check whether the tag list panel is visible", () => {
        renderTagListComponent.setState({ isExpanded: true });
        jest.runAllTicks();
        let tagListView = TestUtils.findRenderedDOMComponentWithClass(renderTagListComponent, "tag dropdown-wrap open");
        expect(tagListView).not.toBeNull();
    });

    it("will check whether the tag list panel is not visible", () => {
        renderTagListComponent.setState({ isExpanded: false });
        jest.runAllTicks();
        let tagListView = TestUtils.findRenderedDOMComponentWithClass(renderTagListComponent, "tag dropdown-wrap close");
        expect(tagListView).not.toBeNull();
    });
});