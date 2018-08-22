"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var bannerBase = require('../../utility/banner/bannerbase');
var localeStore = require('../../../stores/locale/localestore');
var classNames = require('classnames');
/**
 *  Quality feedback banner
 */
var QualityFeedbackBanner = (function (_super) {
    __extends(QualityFeedbackBanner, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function QualityFeedbackBanner(props, state) {
        _super.call(this, props, state);
        /**
         * On quality feedback banner click
         */
        this.onQualityFeedbackBannerClickHandler = function (event) {
            event.stopPropagation();
        };
    }
    /**
     * Render component
     */
    QualityFeedbackBanner.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", {onClick: function (e) { return _this.onQualityFeedbackBannerClickHandler(e); }, className: 'message-box text-left float-msg dark-msg info-guide callout marking-approved-msg'}, React.createElement("p", {className: 'message-body'}, localeStore.instance.TranslateText(this.props.message))));
    };
    return QualityFeedbackBanner;
}(bannerBase));
module.exports = QualityFeedbackBanner;
//# sourceMappingURL=qualityfeedbackbanner.js.map