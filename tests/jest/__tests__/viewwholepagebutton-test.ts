jest.dontMock('../../../src/components/response/responsescreen/linktopage/viewwholepagebutton');
import react = require('react');
import reactTestUtils = require('react-dom/test-utils');
import dispatcher = require("../../../src/app/dispatcher");
import ViewWholePageButton = require('../../../src/components/response/responsescreen/linktopage/viewwholepagebutton');
import ViewWholePageLinkAction = require('../../../src/actions/response/viewwholepagelinkaction');

describe('Test suite for view whole page button component', () => {

    it('checking if view whole page button is rendered', () => {

        let imageZone: ImageZone = {
            uniqueId: 110,
            imageClusterId: 101,
            pageNo: 1,
            sequence: 1,
            leftEdge: 0,
            topEdge: 0,
            width: 0,
            height: 0,
            isViewWholePageLinkVisible: true
        };

        let Props = {
            id: 'view-Whole-page-id',
            imageZones: {
                    uniqueId: 110,
                    imageClusterId: 101,
                    pageNo: 1,
                    sequence: 1,
                    leftEdge: 0,
                    topEdge: 0,
                    width: 0,
                    height: 0,
                    isViewWholePageLinkVisible: true
                },
            isStitched: false,
            isMouseOverEnabled: true
        };

        let viewWholePageButtonComponent = react.createElement(ViewWholePageButton, Props, null);
        let viewWholePageButtonDom = reactTestUtils.renderIntoDocument(viewWholePageButtonComponent);
        let result = reactTestUtils.findRenderedDOMComponentWithClass(viewWholePageButtonDom, 'expand-zone');
        expect(result.className).toBe('expand-zone');

        dispatcher.dispatch(new ViewWholePageLinkAction(true, imageZone));

        result = reactTestUtils.findRenderedDOMComponentWithClass(viewWholePageButtonDom, 'expand-zone');
        expect(result.className).toBe('expand-zone expand-delay');
    });
});