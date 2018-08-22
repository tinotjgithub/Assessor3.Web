import markSchemeScrollHelperBase = require('./markschemescrollhelperbase');
import enums = require('../../components/utility/enums');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import popupHelper = require('../../components/utility/popup/popuphelper');
import markingHelper = require('./markinghelper');
import navigationHelper = require('../../components/utility/navigation/navigationhelper');
import markSchemeHelper = require('./markschemehelper');
import responseStore = require('../../stores/response/responsestore');
import responseHelper = require('../../components/utility/responsehelper/responsehelper');

class MarkSchemeScrollHelper extends markSchemeScrollHelperBase {

    /* handling enter key */
    private enterKeyPress: Function;

    private markHelper: markSchemeHelper;

    /**
     * Constructor
     * @param {Function} up
     * @param {Function} down
     * @param {Function} enter
     */
    constructor(up: Function, down: Function, enter: Function) {
        super(up, down);
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
    public doScroll(keyCode: enums.KeyCode, isFirstMarkScheme: boolean, isLastMarkScheme: boolean): boolean {

        let handled: boolean = false;
        switch (keyCode) {
            case enums.KeyCode.up:

                // If the first ms has reached and user tries to scroll up
                // do not freeze the ms.
                if (isFirstMarkScheme === false) {
                    this.resetScroll(true);
                }

                super.scroll(enums.KeyCode.up);
                handled = true;
                break;
            case enums.KeyCode.down:

                // If the last ms has reached and user tries to scroll down
                // do not freeze the ms.
                if (isLastMarkScheme === false) {
                    this.resetScroll(true);
                }

                super.scroll(enums.KeyCode.down);
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
    }

    /**
     * Reset the scrolling.
     * @param {boolean} isScrolling
     */
    public resetScroll(isScrolling: boolean) {
        this.isMarkSchemeScrollingSet = isScrolling;
    }

    /**
     * Navigating markscheme ondemand
     * eg: enter button click
     * @param isNextOrPreviousMarkSchemeAvailable is markscheme next/prev available for marking
     */
    public navigateMarkSchemeOnDemand(isNextOrPreviousMarkSchemeAvailable: boolean, markingProgress?: number) {
        // Setting the scroll as enabled to prevent
        // further mark entry and make the textbox busy
        this.resetScroll(isNextOrPreviousMarkSchemeAvailable);
        // if in mbq mode in open/closed worklist with more than one response, then navigate to next response
        if (responseHelper.isMbQSelected &&
            responseStore.instance.selectedResponseMode !== enums.ResponseMode.closed &&
            (!this.markHelper.isSingleResponse ||
                (this.markHelper.isSingleResponse && this.markHelper.isLastResponseLastQuestion))) {
            navigationHelper.handleResponseNavigation(markingProgress);
        } else {
            this.enterKeyPress();
        }
    }
}
export = MarkSchemeScrollHelper;