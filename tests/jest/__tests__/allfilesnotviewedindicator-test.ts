jest.dontMock("../../../src/components/worklist/shared/allfilesnotviewedindicator");

import React = require("react");
import ReactDOM = require("react-dom");
import TestUtils = require('react-dom/test-utils');
import AllFilesNotViewedIndicator = require("../../../src/components/worklist/shared/allfilesnotviewedindicator");
import dispatcher = require("../../../src/app/dispatcher");
describe("Test suite for All Files Not Viewed Indiactor", function () {

    it("checks if all files not viewed indiactor is displayed in Tile view", () => {

        var allFilesNotViewesIndicatorProps = {
            isTileView: true,
            allFilesViewed: false,
            isMarkingCompleted: true,
            isECourseworkComponent: true
        }
        var allFilesNotViewedIndicator = AllFilesNotViewedIndicator(allFilesNotViewesIndicatorProps);
        var allFilesNotViewedIndiactorDOM = TestUtils.renderIntoDocument(allFilesNotViewedIndicator);
        expect(allFilesNotViewedIndiactorDOM).not.toBeNull();
    });

    it("checks if all files not viewed indiactor is displayed in List view", () => {

        var allFilesNotViewesIndicatorProps = {
            isTileView: false,
            allFilesViewed: false,
            isMarkingCompleted: true,
            isECourseworkComponent: true
        }
        var allFilesNotViewedIndicator = AllFilesNotViewedIndicator(allFilesNotViewesIndicatorProps);
        var allFilesNotViewedIndiactorDOM = TestUtils.renderIntoDocument(allFilesNotViewedIndicator);
        expect(allFilesNotViewedIndiactorDOM).not.toBeNull();
    });

    it("checks if marking is not completed then all files not viewed indiactor is not displayed in the work list", () => {

        var allFilesNotViewesIndicatorProps = {
            isTileView: false,
            allFilesViewed: false,
            isMarkingCompleted: false,
            isECourseworkComponent: true
        }
        var allFilesNotViewedIndicator = AllFilesNotViewedIndicator(allFilesNotViewesIndicatorProps);
        expect(TestUtils.isDOMComponent(allFilesNotViewedIndicator)).not.toBe(true);
    });

    it("checks if all files are viewed and marking completed then all files not viewed indiactor is not displayed in the work list", () => {

        var allFilesNotViewesIndicatorProps = {
            isTileView: false,
            allFilesViewed: true,
            isMarkingCompleted: true,
            isECourseworkComponent: true
        }
        var allFilesNotViewedIndicator = AllFilesNotViewedIndicator(allFilesNotViewesIndicatorProps);
        expect(TestUtils.isDOMComponent(allFilesNotViewedIndicator)).not.toBe(true);
    });

    it("checks if the response is not an ecoursework component then all files not viewed indiactor component is not displayed in the work list", () => {

        var allFilesNotViewesIndicatorProps = {
            isTileView: false,
            allFilesViewed: true,
            isMarkingCompleted: true,
            isECourseworkComponent: false
        }
        var allFilesNotViewedIndicator = AllFilesNotViewedIndicator(allFilesNotViewesIndicatorProps);
        expect(TestUtils.isDOMComponent(allFilesNotViewedIndicator)).not.toBe(true);
    });
});