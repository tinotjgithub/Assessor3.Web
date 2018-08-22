jest.dontMock('../../../src/components/response/annotations/offpagecomments/offpagecommentcontainer');
import react = require('react');
import reactTestUtils = require('react-dom/test-utils');
import dispatcher = require('../../../src/app/dispatcher');
import OffPageCommentContainer = require('../../../src/components/response/annotations/offpagecomments/offpagecommentcontainer');

describe('Test suite for offpage comment container component', () => {
    it('checking the offpage comment is rendered', () => {
        let Props = {
            id: 'off-page-comments',
            isVisible: true
        };

        let offpageCommentContainerComponent = react.createElement(OffPageCommentContainer, Props, null);
        let offpageCommentContainerDom = reactTestUtils.renderIntoDocument(offpageCommentContainerComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(offpageCommentContainerDom, 'offpage-comment-editor');
        expect(result.className).toBe('offpage-comment-editor');
    });
});