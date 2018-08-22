"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../base/purerendercomponent');
/**
 * Class for the Qig Name.
 */
var QigName = (function (_super) {
    __extends(QigName, _super);
    function QigName() {
        _super.apply(this, arguments);
    }
    /**
     * Render method for Qig Name.
     */
    QigName.prototype.render = function () {
        return (React.createElement("span", {id: this.props.id + '_name', key: this.props.id + '_name', className: 'qig-name'}, this.props.qigname));
    };
    return QigName;
}(pureRenderComponent));
module.exports = QigName;
//# sourceMappingURL=qigname.js.map