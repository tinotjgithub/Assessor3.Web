"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
/**
 * React component
 * @param {Props} props
 */
var TotalMark = (function (_super) {
    __extends(TotalMark, _super);
    /**
     * Constructor for total mark
     * @param props
     */
    function TotalMark(props) {
        _super.call(this, props, null);
    }
    /**
     * getTotalMarkOutput
     */
    TotalMark.prototype.getTotalMarkOutput = function () {
        var result = React.createElement("span", null);
        if (this.props.markingProgress === 0) {
            result = (React.createElement("span", {className: 'large-text dark-link', id: 'totalMark_' + this.props.id}, "--"));
        }
        else if (this.props.isNonNumericMark) {
            result = (React.createElement("span", {className: 'large-text dark-link', id: 'totalMark_' + this.props.id}, "N/A"));
        }
        else {
            var totalmark = this.props.totalMark.toLocaleString(localeStore.instance.Locale);
            result = (React.createElement("span", {className: 'large-text dark-link', id: 'totalMark_' + this.props.id}, totalmark));
        }
        return result;
    };
    Object.defineProperty(TotalMark.prototype, "currentLocale", {
        /*
         * Get the locale
        */
        get: function () {
            return localeStore.instance.Locale;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Translate the text
     * @param value
     * @returns Localised string
     */
    TotalMark.prototype.getTranslated = function (value) {
        return localeStore.instance.TranslateText(value);
    };
    return TotalMark;
}(pureRenderComponent));
module.exports = TotalMark;
//# sourceMappingURL=totalmark.js.map