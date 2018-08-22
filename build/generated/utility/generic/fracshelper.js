"use strict";
var $ = require('jquery');
/**
 * Fracs helper class.
 */
var FracsHelper = (function () {
    function FracsHelper() {
    }
    /**
     * return fracs for an element w.r.t window
     * @param element
     */
    FracsHelper.getFracs = function (element) {
        return element.fracs();
    };
    /**
     * return fracs values w.r.t a container
     * @param fracsAction
     * @param element
     * @param container
     */
    FracsHelper.getFracsWithRespectToContainer = function (fracsAction, element, container) {
        return element.fracs(fracsAction, container);
    };
    /**
     * return fracs values w.r.t a container using rect
     * @param elementRect
     * @param containerRect
     */
    FracsHelper.getFracsWithRespectToContainerByRect = function (elementRect, containerRect) {
        return FracsHelper.jquery.fracs(elementRect, containerRect);
    };
    /**
     * return fracs Rect
     * @param left
     * @param top
     * @param width
     * @param height
     */
    FracsHelper.fracsRect = function (left, top, width, height) {
        return new FracsHelper.jquery.fracs.Rect(left, top, width, height);
    };
    FracsHelper.jquery = $;
    return FracsHelper;
}());
module.exports = FracsHelper;
//# sourceMappingURL=fracshelper.js.map