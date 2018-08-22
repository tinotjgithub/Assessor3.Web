jest.dontMock('../../../src/components/response/responsescreen/cursor/stampcursor');
import React = require('react');
import ReactDOM = require('react-dom');
import testUtils = require('react-dom/test-utils');
import StampCursor = require('../../../src/components/response/responsescreen/cursor/stampcursor');

describe('Checking whether the StampCursor component is rendering correctly', () => {

    let renderResult;

    beforeEach(() => {

        var stampCursorProps = {
            xCoord: 100,
            yCoord: 100
        };

        var stampCursorComponent = React.createElement(StampCursor, stampCursorProps, null);
        renderResult = testUtils.renderIntoDocument(stampCursorComponent);
    });

    it("check if the stamp cursor gets rendered", () => {
        expect(renderResult).not.toBeNull();
    });
});