"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var totalMark = require('./totalmark');
/**
 * React component
 * @param {Props} props
 */
var TotalMarkDetail = (function (_super) {
    __extends(TotalMarkDetail, _super);
    /**
     * Constructor for TotalMarkTile
     * @param props
     * @param state
     */
    function TotalMarkDetail(props, state) {
        _super.call(this, props);
    }
    /**
     * Render component
     */
    TotalMarkDetail.prototype.render = function () {
        return (this.getTotalMarkOutput());
    };
    return TotalMarkDetail;
}(totalMark));
module.exports = TotalMarkDetail;
//# sourceMappingURL=totalmarkdetail.js.map