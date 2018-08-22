"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
    React component for allocated date of a response
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var GenericDate = require('./genericdate');
/**
 * React component class for allocated date of a response
 */
var AllocatedDate = (function (_super) {
    __extends(AllocatedDate, _super);
    /**
     * Constructor for Allocated date
     * @param props
     * @param state
     */
    function AllocatedDate(props, state) {
        _super.call(this, props, state);
        this.dateText = '';
        this.elementId = '';
    }
    /**
     * Render component
     */
    AllocatedDate.prototype.render = function () {
        return ((this.props.showAllocatedDate) ?
            (React.createElement("div", {style: this.props.width}, React.createElement(GenericDate, {dateValue: this.props.dateValue, id: 'dtalloc_' + this.props.id, key: 'dtalloc_' + this.props.id, className: 'dim-text txt-val small-text'}))) : null);
    };
    return AllocatedDate;
}(pureRenderComponent));
module.exports = AllocatedDate;
//# sourceMappingURL=allocateddate.js.map