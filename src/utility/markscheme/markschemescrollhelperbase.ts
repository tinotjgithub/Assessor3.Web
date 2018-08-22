import enums = require('../../components/utility/enums');
class MarkSchemeScrollHelperBase {

    // Holds poiter to scroll to top of the markscheme
    private scrollUp: Function;

    // Holds poiter to scroll to down of the markscheme
    private scrollDown: Function;

    // Indicating currenlty the mark scheme panel is busy
    // on scrolling.
    private _isScrolling: boolean = false;

    /**
     * Constructor
     * @param {Function} up
     * @param {Function} down
     */
    constructor(up: Function, down: Function) {
        this.scrollDown = down;
        this.scrollUp = up;
    }

    /**
     * Scroll the markscheme panel to the given direction.
     * @param {enums.KeyCode} scrollTo
     */
    protected scroll(scrollTo: enums.KeyCode): void {
        switch (scrollTo) {
            case enums.KeyCode.down:
                this.scrollDown();
                break;
            case enums.KeyCode.up:
                this.scrollUp();
                break;
        }
    }

    /**
     * Gets a value indicating whether the markscheme is scrolling.
     * @returns
     */
    public get isMarkSchemeScrolling(): boolean {
        return this._isScrolling;
    }

    /**
     * Setting a value indicating whether the markscheme is scrolling/
     * Finished.
     * @param {boolean} isScrolling
     */
    protected set isMarkSchemeScrollingSet(isScrolling: boolean) {
        this._isScrolling = isScrolling;
    }
}
export = MarkSchemeScrollHelperBase;