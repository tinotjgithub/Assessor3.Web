"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var responseStore = require('../../../stores/response/responsestore');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var enums = require('../../utility/enums');
/**
 * Page number indicator component to show the page number when scrolling through the script.
 */
var PageNumberIndicator = (function (_super) {
    __extends(PageNumberIndicator, _super);
    /**
     * @constructor
     */
    function PageNumberIndicator(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._isBookletView = false;
        /** Updates the PageNumber indicator based on response scroll */
        this.onMostVisiblePageUpdated = function () {
            if (responseStore.instance.pageNoIndicatorData.mostVisiblePageNo.length > 1) {
                _this._isBookletView = true;
            }
            else {
                _this._isBookletView = false;
            }
            _this.setState({
                renderedOn: Date.now()
            });
            // Hide the page indicator after sometime.
            var that = _this;
            setTimeout(function () {
                that.setState({
                    renderedOn: 0
                });
            }, 0);
        };
        this.state = {
            renderedOn: 0
        };
    }
    /**
     * This function gets invoked when the component is about to be mounted
     */
    PageNumberIndicator.prototype.componentDidMount = function () {
        responseStore.instance.addListener(responseStore.ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT, this.onMostVisiblePageUpdated);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    PageNumberIndicator.prototype.componentWillUnmount = function () {
        responseStore.instance.removeListener(responseStore.ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT, this.onMostVisiblePageUpdated);
    };
    /**
     * Render method
     */
    PageNumberIndicator.prototype.render = function () {
        var selectedECourseWorkFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        var isImage = selectedECourseWorkFile ?
            selectedECourseWorkFile.linkData.mediaType === enums.MediaType.Image : undefined;
        if (this.isPageNumberIndicatorNotApplicable()) {
            return null;
        }
        else if (this._isBookletView) {
            return (React.createElement("div", {className: 'relative'}, (eCourseworkHelper.isECourseworkComponent && isImage) ? null :
                React.createElement("div", {id: 'pageindicator', className: classNames('page-number-marksheet', {
                    'hide': this.state.renderedOn === 0
                })}, React.createElement("div", {className: 'pn-line1'}, localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-label-booklet-view'), React.createElement("span", {className: 'pn'}, ' ' + responseStore.instance.pageNoIndicatorData.imageNo[0] + ' '), '& ', React.createElement("span", {className: 'pn'}, ' ' + responseStore.instance.pageNoIndicatorData.imageNo[1] + ' '), localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label'), ' ' + this.props.noOfImages), (eCourseworkHelper.isECourseworkComponent && !isImage) ? null :
                    React.createElement("div", {className: 'pn-line2'}, localeStore.instance.TranslateText('marking.response.page-number-indicator.page-number-label-booklet-view'), React.createElement("span", {className: 'pn-actual'}, ' ' + responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0] + ' '), '& ', React.createElement("span", {className: 'pn'}, ' ' + responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[1] + ' '), localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label'), ' ' + localeStore.instance.TranslateText('marking.response.page-number-indicator.script-label')))));
        }
        else {
            return (React.createElement("div", {className: 'relative'}, (eCourseworkHelper.isECourseworkComponent && isImage) ? null :
                React.createElement("div", {id: 'pageindicator', className: classNames('page-number-marksheet', {
                    'hide': this.state.renderedOn === 0
                })}, React.createElement("div", {className: 'pn-line1'}, localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-label'), React.createElement("span", {className: 'pn'}, ' ' + responseStore.instance.pageNoIndicatorData.imageNo[0] + ' '), localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label'), React.createElement("span", {className: 'pn-max'}, ' ' + this.props.noOfImages)), (eCourseworkHelper.isECourseworkComponent && !isImage) ? null :
                    React.createElement("div", {className: 'pn-line2'}, localeStore.instance.TranslateText('marking.response.page-number-indicator.page-number-label'), React.createElement("span", {className: 'pn-actual'}, ' ' + responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0] + ' '), localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label'), ' ' + localeStore.instance.TranslateText('marking.response.page-number-indicator.script-label')))));
        }
    };
    /**
     * Checks if the page number indicator is applicable for the images visible on the screen
     */
    PageNumberIndicator.prototype.isPageNumberIndicatorNotApplicable = function () {
        return !responseStore.instance.pageNoIndicatorData
            || !responseStore.instance.pageNoIndicatorData.imageNo[0]
            || !responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0]
            || responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0] < 1
            || responseStore.instance.pageNoIndicatorData.imageNo[0] < 1;
    };
    return PageNumberIndicator;
}(pureRenderComponent));
module.exports = PageNumberIndicator;
//# sourceMappingURL=pagenumberindicator.js.map