"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var flux = require('flux');
/**
 * The provided Flux Dispatcher is used 'as is' except that
 * it expects actions extending the Action class
 */
var Dispatcher = (function (_super) {
    __extends(Dispatcher, _super);
    function Dispatcher() {
        _super.apply(this, arguments);
    }
    return Dispatcher;
}(flux.Dispatcher));
//Export the singleton dispatcher
var dispatcher = new Dispatcher();
module.exports = dispatcher;
//# sourceMappingURL=dispatcher.js.map