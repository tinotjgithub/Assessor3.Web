"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var markSchemeScrollHelperBase = require('./markschemescrollhelperbase');
var enums = require('../../components/utility/enums');
var navigationHelper = require('../../components/utility/navigation/navigationhelper');
var markSchemeHelper = require('./markschemehelper');
var responseStore = require('../../stores/response/responsestore');
var responseHelper = require('../../components/utility/responsehelper/responsehelper');
var MarkSchemeScrollHelper = (function (_super) {
    __extends(MarkSchemeScrollHelper, _super);
    /**
     * Constructor
     * @param {Function} up
     * @param {Function} down
     * @param {Function} enter
     */
    function MarkSchemeScrollHelper(up, down, enter) {
        _super.call(this, up, down);
        this.enterKeyPress = enter;
        this.markHelper = new markSchemeHelper();
    }
    /**
     * Scroll the markscheme value
     * @param {enums.KeyCode} keyCode
     * @param {boolean} isFirstMarkScheme
     * @param {boolean} isLastMarkScheme
     * @returns
     */
    MarkSchemeScrollHelper.prototype.doScroll = function (keyCode, isFirstMarkScheme, isLastMarkScheme) {
        var handled = false;
        switch (keyCode) {
            case enums.KeyCode.up:
                // If the first ms has reached and user tries to scroll up
                // do not freeze the ms.
                if (isFirstMarkScheme === false) {
                    this.resetScroll(true);
                }
                _super.prototype.scroll.call(this, enums.KeyCode.up);
                handled = true;
                break;
            case enums.KeyCode.down:
                // If the last ms has reached and user tries to scroll down
                // do not freeze the ms.
                if (isLastMarkScheme === false) {
                    this.resetScroll(true);
                }
                _super.prototype.scroll.call(this, enums.KeyCode.down);
                handled = true;
                break;
            case enums.KeyCode.left:
                handled = true;
                break;
            case enums.KeyCode.right:
                handled = true;
                break;
            case enums.KeyCode.enter:
                // If the user has reached last ms and tries to scroll on demand using enter key
                // do not freeze the textbox
                this.navigateMarkSchemeOnDemand(isLastMarkScheme === false);
                handled = true;
                break;
        }
        return handled;
    };
    /**
     * Reset the scrolling.
     * @param {boolean} isScrolling
     */
    MarkSchemeScrollHelper.prototype.resetScroll = function (isScrolling) {
        this.isMarkSchemeScrollingSet = isScrolling;
    };
    /**
     * Navigating markscheme ondemand
     * eg: enter button click
     * @param isNextOrPreviousMarkSchemeAvailable is markscheme next/prev available for marking
     */
    MarkSchemeScrollHelper.prototype.navigateMarkSchemeOnDemand = function (isNextOrPreviousMarkSchemeAvailable, markingProgress) {
        // Setting the scroll as enabled to prevent
        // further mark entry and make the textbox busy
        this.resetScroll(isNextOrPreviousMarkSchemeAvailable);
        // if in mbq mode in open/closed worklist with more than one response, then navigate to next response
        if (responseHelper.isMbQSelected &&
            responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
            (!this.markHelper.isSingleResponse ||
                (this.markHelper.isSingleResponse && this.markHelper.isLastResponseLastQuestion))) {
            navigationHelper.handleResponseNavigation(markingProgress);
        }
        else {
            this.enterKeyPress();
        }
    };
    return MarkSchemeScrollHelper;
}(markSchemeScrollHelperBase));
module.exports = MarkSchemeScrollHelper;
//# sourceMappingURL=markschemescrollhelper.js.map