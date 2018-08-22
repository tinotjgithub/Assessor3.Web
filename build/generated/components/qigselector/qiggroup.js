"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
var QigItem = require('./qigitem');
/**
 * Class for the Qig group.
 */
var QigGroup = (function (_super) {
    __extends(QigGroup, _super);
    /**
     * @constructor
     */
    function QigGroup(props, state) {
        _super.call(this, props, state);
    }
    /**
     * Render method for Qig group.
     */
    QigGroup.prototype.render = function () {
        var _this = this;
        var qigitems = this.props.qigs.map(function (qig, index) {
            return React.createElement(QigItem, {qig: qig, qigValidationResult: _this.props.validationResults[index], selectedLanguage: _this.props.selectedLanguage, containerPage: _this.props.containerPage, id: _this.props.id + '_qig_' + (index + 1).toString(), key: 'key_' + (index + 1).toString()});
        });
        // Render the QIG Items
        return qigitems;
    };
    return QigGroup;
}(pureRenderComponent));
module.exports = QigGroup;
//# sourceMappingURL=qiggroup.js.map