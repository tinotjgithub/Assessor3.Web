jest.dontMock('../../../src/components/response/toolbar/stamppanel/acetate/overlayicon');
import React = require('react');
import testUtils = require('react-dom/test-utils');
import enums = require('../../../src/components/utility/enums');
import toolbarActionCreator = require('../../../src/actions/toolbar/toolbaractioncreator');
import toolbarStore = require('../../../src/stores/toolbar/toolbarstore');
import dispatcher = require("../../../src/app/dispatcher");
import OverlayIcon = require('../../../src/components/response/toolbar/stamppanel/acetate/overlayicon');
import selectAcetateAction = require('../../../src/actions/acetates/selectacetateaction');

toolbarActionCreator.selectAcetate = jest.genMockFn();

describe('Checking whether the OverlayIcon component is rendering correctly', () => {

    let renderResult;
    let setNumberOfColumnsInFavouriteToolBarFunction = jest.genMockFn();

    it("check if the  overlay icon got rendered", () => {
        expect(renderResult).not.toBeNull();
    });

    it('check the overlay icon selection functionality', function () {

        var overlayIconProps = {
            overlayIcon: 'ruler'
        };

        var overlayIconComponent = React.createElement(OverlayIcon, overlayIconProps, null);
        renderResult = testUtils.renderIntoDocument(overlayIconComponent);

        var overlayIcons = testUtils.scryRenderedDOMComponentsWithClass(renderResult, "tool-wrap dt");
        expect(overlayIcons.length).toBe(1);        
        testUtils.Simulate.click(overlayIcons[0]);
        dispatcher.dispatch(new selectAcetateAction(enums.ToolType.ruler));
        expect(toolbarStore.instance.selectedAcetate).toBe(enums.ToolType.ruler);
    });
});