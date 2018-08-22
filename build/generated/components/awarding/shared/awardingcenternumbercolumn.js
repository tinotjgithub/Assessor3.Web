"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
/**
 * React component class forthe grid column responseid and last updated date
 */
var AwardingCenterNumberColumn = (function (_super) {
    __extends(AwardingCenterNumberColumn, _super);
    /**
     * Constructor for ResponseIdColumn
     * @param props
     * @param state
     */
    function AwardingCenterNumberColumn(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     */
    AwardingCenterNumberColumn.prototype.render = function () {
        return (React.createElement("a", {href: 'javascript:void(0)', id: this.props.key, key: 'awardingcenterNumber'}, this.props.centerNumber));
    };
    return AwardingCenterNumberColumn;
}(pureRenderComponent));
module.exports = AwardingCenterNumberColumn;
//# sourceMappingURL=awardingcenternumbercolumn.js.map