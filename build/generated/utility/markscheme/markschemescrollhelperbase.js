"use strict";
var enums = require('../../components/utility/enums');
var MarkSchemeScrollHelperBase = (function () {
    /**
     * Constructor
     * @param {Function} up
     * @param {Function} down
     */
    function MarkSchemeScrollHelperBase(up, down) {
        // Indicating currenlty the mark scheme panel is busy
        // on scrolling.
        this._isScrolling = false;
        this.scrollDown = down;
        this.scrollUp = up;
    }
    /**
     * Scroll the markscheme panel to the given direction.
     * @param {enums.KeyCode} scrollTo
     */
    MarkSchemeScrollHelperBase.prototype.scroll = function (scrollTo) {
        switch (scrollTo) {
            case enums.KeyCode.down:
                this.scrollDown();
                break;
            case enums.KeyCode.up:
                this.scrollUp();
                break;
        }
    };
    Object.defineProperty(MarkSchemeScrollHelperBase.prototype, "isMarkSchemeScrolling", {
        /**
         * Gets a value indicating whether the markscheme is scrolling.
         * @returns
         */
        get: function () {
            return this._isScrolling;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkSchemeScrollHelperBase.prototype, "isMarkSchemeScrollingSet", {
        /**
         * Setting a value indicating whether the markscheme is scrolling/
         * Finished.
         * @param {boolean} isScrolling
         */
        set: function (isScrolling) {
            this._isScrolling = isScrolling;
        },
        enumerable: true,
        configurable: true
    });
    return MarkSchemeScrollHelperBase;
}());
module.exports = MarkSchemeScrollHelperBase;
//# sourceMappingURL=markschemescrollhelperbase.js.map