"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var markingStore = require('../../stores/marking/markingstore');
var eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');
/**
 * Marking progress component.
 * @param {Props} props
 * @returns
 */
var MarkingProgressIndicator = (function (_super) {
    __extends(MarkingProgressIndicator, _super);
    /**
     * @constructor
     */
    function MarkingProgressIndicator(props) {
        var _this = this;
        _super.call(this, props, null);
        /**
         * Change visibility of mark change reason
         */
        this.showHideMarkChangeReason = function () {
            if (_this.props.checkIsSubmitVisible()) {
                _this.isVisible = false;
                _this.setState({ reRender: Date.now() });
            }
            else {
                _this.isVisible = true;
                _this.setState({ reRender: Date.now() });
            }
        };
        /**
         * File read status updated event.
         */
        this.fileReadStatusUpdated = function () {
            _this.isVisible = !_this.props.checkIsSubmitVisible();
            _this.setState({ reRender: Date.now() });
        };
        this.isVisible = this.props.isVisible;
    }
    /**
     * Render method
     */
    MarkingProgressIndicator.prototype.render = function () {
        if (this.isVisible) {
            return (React.createElement("div", {className: 'mark-percentage-holder'}, React.createElement("span", {className: 'inline-bubble pink'}, this.props.progressPercentage + '%')));
        }
        else {
            return null;
        }
    };
    /**
     * componentDidMount
     */
    MarkingProgressIndicator.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED, this.fileReadStatusUpdated);
    };
    /**
     * componentWillUnmount
     */
    MarkingProgressIndicator.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED, this.fileReadStatusUpdated);
    };
    /**
     * Comparing the props to check the updats are made by self
     * @param {Props} nextProps
     */
    MarkingProgressIndicator.prototype.componentWillReceiveProps = function (nextProps) {
        this.isVisible = nextProps.isVisible;
    };
    return MarkingProgressIndicator;
}(pureRenderComponent));
module.exports = MarkingProgressIndicator;
//# sourceMappingURL=markingprogressindicator.js.map