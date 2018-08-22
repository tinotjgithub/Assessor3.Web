"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var PureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var enums = require('../../utility/enums');
var constants = require('../../utility/constants');
var MarksDifference = (function (_super) {
    __extends(MarksDifference, _super);
    /**
     * Constructor for MarksDifference
     * @param props
     */
    function MarksDifference(props) {
        _super.call(this, props, null);
    }
    /**
     * Render component
     */
    MarksDifference.prototype.render = function () {
        if (this.props.isTileView === false) {
            return (React.createElement("div", {id: this.props.id, className: this.props.className, title: localeStore.instance.TranslateText(this.props.title)}, React.createElement("span", {className: 'dim-text txt-val'}, this.getMarkDifferenceValueInStringFormat())));
        }
        else {
            return (React.createElement("div", {id: this.props.id, className: this.props.className, title: localeStore.instance.TranslateText(this.props.title)}, React.createElement("span", {className: 'ex-dim-text txt-label'}, localeStore.instance.TranslateText(this.props.marksDifferenceText), " "), React.createElement("span", {className: 'dim-text txt-val'}, this.getMarkDifferenceValueInStringFormat())));
        }
    };
    /**
     * Get mark difference value in string format.
     */
    MarksDifference.prototype.getMarkDifferenceValueInStringFormat = function () {
        var displayMarkDifferenceValue = '';
        var markDifferenceValue = this.props.marksDifference !== undefined ? this.props.marksDifference : 0;
        switch (this.props.marksDifferenceType) {
            case enums.MarksDifferenceType.TotalMarksDifference:
                displayMarkDifferenceValue = this.props.marksDifference > 0
                    ? (constants.PLUS_SIGN + this.props.marksDifference) : markDifferenceValue.toString();
                break;
            default:
                displayMarkDifferenceValue = markDifferenceValue.toString();
        }
        return displayMarkDifferenceValue;
    };
    return MarksDifference;
}(PureRenderComponent));
module.exports = MarksDifference;
//# sourceMappingURL=marksdifference.js.map