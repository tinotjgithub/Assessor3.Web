jest.dontMock("../../../src/components/response/annotations/enhancedoffpagecomments/enhancedoffpagecommentdetailview");
import TestUtils = require('react-dom/test-utils');
import React = require('react');
import ReactDOM = require('react-dom');
import EnhancedOffpageCommentDetailView = require("../../../src/components/response/annotations/enhancedoffpagecomments/enhancedoffpagecommentdetailview");
import responseStore = require("../../../src/stores/response/responsestore");
import enums = require("../../../src/components/utility/enums");

describe('Enhanced offpage comment detail view', () => {
    let deleteButtonClass;
    let cancelButtonClass;
    let saveButtonClass;

    var enhancedOffPageCommentDetailProps = {
        id: 'offpage-comments-detail-view',
        key: 'offpage-comments-detail-key',
        commentText: 'test',
        responseMode: enums.ResponseMode.open,
        enhancedOffPageCommentClientToken: '0x30007800340044004500440032003500';
        selectedCommentQuestionId: 2991,
        selectedFileId: 178081,
        textAreaChanged: jest.fn(),
        onQuestionItemOrFileChanged: jest.fn(),
        onButtonClick: jest.fn()

    };

    EnhancedOffpageCommentDetailView = React.createElement(EnhancedOffpageCommentDetailView, enhancedOffPageCommentDetailProps, null)
    let EnhancedOffpageCommentDetailViewDOM = TestUtils.renderIntoDocument(EnhancedOffpageCommentDetailView);

    /** checks if the enhanced off-page comment detail view is rendered or not **/
    it('checks if the enhanced off-page comment detail view is rendered or not', () => {
        expect(EnhancedOffpageCommentDetailViewDOM).not.toBeNull();
    });

    it('checks if delete button rendered or not', function () {
        var component = TestUtils.scryRenderedDOMComponentsWithTag(EnhancedOffpageCommentDetailViewDOM, 'deleteCommentRow');
        expect(component).not.toBe(null);
    });

    it('checks if cancel button rendered or not', function () {
        var component = TestUtils.scryRenderedDOMComponentsWithTag(EnhancedOffpageCommentDetailViewDOM, 'CancelCommmentDetailView');
        expect(component).not.toBe(null);
    });

    it('checks if save button rendered or not', function () {
        var component = TestUtils.scryRenderedDOMComponentsWithTag(EnhancedOffpageCommentDetailViewDOM, 'rounded primary');
        expect(component).not.toBe(null);
    });