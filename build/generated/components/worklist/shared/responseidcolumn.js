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
var ResponseIdGridElement = require('./responseidgridelement');
var LastUpdatedDate = require('./worklistdate');
var ResponseTypeLabel = require('./responsetypelabel');
var TotalMarkTile = require('./totalmarktile');
/**
 * React component class forthe grid column responseid and last updated date
 */
var ResponseIdColumn = (function (_super) {
    __extends(ResponseIdColumn, _super);
    /**
     * Constructor for ResponseIdColumn
     * @param props
     * @param state
     */
    function ResponseIdColumn(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render component
     */
    ResponseIdColumn.prototype.render = function () {
        return (React.createElement("div", {className: 'col wl-id'}, React.createElement("div", {className: 'col-inner'}, React.createElement(ResponseIdGridElement, {selectedLanguage: this.props.selectedLanguage, displayId: this.props.displayId, isClickable: this.props.isResponseIdClickable, id: this.props.id, key: 'key_response_id_grid_element_' + this.props.id, isTileView: this.props.isTileView}), React.createElement(ResponseTypeLabel, {id: this.props.id + '_Seed', key: this.props.id + '_Seed', isResponseTypeLabelVisible: this.props.isResponseTypeLabelVisible, responseType: this.props.responseType}), React.createElement(TotalMarkTile, {id: this.props.id + '_totalmarktile', key: this.props.id + '_totalmarktilekey', selectedLanguage: this.props.selectedLanguage, isNonNumericMark: !this.props.hasNumericMark, maximumMark: 0, totalMark: this.props.totalMarkValue, markingProgress: this.props.markingProgress}), React.createElement(LastUpdatedDate, {selectedLanguage: this.props.selectedLanguage, dateType: this.props.worklistDateType, dateValue: this.props.dateValue, id: this.props.id, isTileView: this.props.isTileView, key: 'key_last_updated_date_' + this.props.id}))));
    };
    return ResponseIdColumn;
}(pureRenderComponent));
module.exports = ResponseIdColumn;
//# sourceMappingURL=responseidcolumn.js.map