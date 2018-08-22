"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var totalMark = require('./totalmark');
/**
 * React component
 * @param {Props} props
 */
var TotalMarkTile = (function (_super) {
    __extends(TotalMarkTile, _super);
    /**
     * Constructor for TotalMarkTile
     * @param props
     * @param state
     */
    function TotalMarkTile(props, state) {
        _super.call(this, props);
    }
    /**
     * Render component
     */
    TotalMarkTile.prototype.render = function () {
        if (this.props.isNonNumericMark || this.props.markingProgress === 0) {
            return null;
        }
        var totalmark = this.props.totalMark.toLocaleString(this.currentLocale);
        var result = (React.createElement("span", {className: 'large-text', id: 'totalMark_' + this.props.id}, totalmark));
        return (React.createElement("p", {className: 'resp-mark small-text'}, React.createElement("span", {className: 'dim-text'}, this.getTranslated('marking.worklist.list-view-column-headers.total-mark') + ':'), result));
    };
    return TotalMarkTile;
}(totalMark));
module.exports = TotalMarkTile;
//# sourceMappingURL=totalmarktile.js.map