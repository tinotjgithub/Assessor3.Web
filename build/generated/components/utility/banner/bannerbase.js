"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
/**
 * Banner base class
 */
var BannerBase = (function (_super) {
    __extends(BannerBase, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function BannerBase(props, state) {
        _super.call(this, props, state);
        this.state = {
            renderedOn: 0,
            isVisible: this.props.isVisible
        };
    }
    return BannerBase;
}(pureRenderComponent));
module.exports = BannerBase;
//# sourceMappingURL=bannerbase.js.map