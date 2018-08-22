jest.dontMock("../../../src/components/response/responsescreen/tag");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import Tag = require("../../../src/components/response/responsescreen/tag");
var localJson = require("../../../content/resources/rm-en.json");
import dispatcher = require("../../../src/app/dispatcher");
import localAction = require("../../../src/actions/locale/localeaction");
import enums = require("../../../src/components/utility/enums");
import shallowRenderer = require('react-test-renderer/shallow');

describe("Test suite for Tag Component", function () {
    /* Mocking functions to pass as props */
    var onSelection = jest.genMockFn().mockReturnThis();
    var onArrowClick = jest.genMockFn().mockReturnThis();

    dispatcher.dispatch(new localAction(true, "en-GB", localJson));
    var shallowRender = new shallowRenderer();

    var tagProps = { isSelected: true, tagType: enums.TagType.Red, onArrowClick: null, onSelection: null, isInList: true };
    var tagElement = React.createElement(Tag, tagProps, null);
    shallowRender.render(tagElement);
    var renderTagComponentWithIsSelectedTrue = shallowRender.getRenderOutput();
    it("will check whethertag rendered=> It should render", () => {
        expect(renderTagComponentWithIsSelectedTrue).not.toBeNull();
    });

    tagProps = { isSelected: true, tagType: enums.TagType.Red, onArrowClick: null, onSelection: null, isInList: false };
    tagElement = React.createElement(Tag, tagProps, null);
    shallowRender.render(tagElement);
    var renderTagComponentWithIsInListFalse = shallowRender.getRenderOutput();
    it("will check whethertag rendered=> It should render", () => {
        expect(renderTagComponentWithIsInListFalse).not.toBeNull();
    });

    tagProps = { isSelected: true, tagType: enums.TagType.Empty, onArrowClick: null, onSelection: null, isInList: false };
    tagElement = React.createElement(Tag, tagProps, null);
    shallowRender.render(tagElement);
    var renderTagComponentWithTagTypeEmpty = shallowRender.getRenderOutput();
    it("will check whethertag rendered=> It should render", () => {
        expect(renderTagComponentWithTagTypeEmpty).not.toBeNull();
    });

    it("will check whether the tag is rendered with class tag-icon yellow", () => {

        tagProps = { isSelected: true, tagType: enums.TagType.Yellow, onArrowClick: onArrowClick, onSelection: onSelection, isInList: false };
        tagElement = React.createElement(Tag, tagProps);
        var renderTagComponent = TestUtils.renderIntoDocument(tagElement);
        let tagComponentClass = TestUtils.scryRenderedDOMComponentsWithClass(renderTagComponent, ' tag-icon yellow');
        expect(tagComponentClass.classNames).not.toBe(' tag-icon yellow');
    });
});