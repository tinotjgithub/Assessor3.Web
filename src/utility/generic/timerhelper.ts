import htmlutilities = require('../../utility/generic/htmlutilities');
/**
 * timer helper
 */
class TimerHelper {

    // // holds the setInterval timer instance for Auto Save marks and Annotation
    // private static autoSaveTimer: number;

    /**
     * sets the interval for executing method periodically
     * @param interval
     * @param methodToExecute
     */
    public static setInterval(interval: number, methodToExecute: Function, autoSaveTimer: number): number {
        this.clearInterval(autoSaveTimer);
        autoSaveTimer = window.setInterval(methodToExecute, interval);
        return autoSaveTimer;
    }
    /**
     * clears the interval
     */
    public static clearInterval(autoSaveTimer: number) {
        window.clearInterval(autoSaveTimer);
    }

    private intr: number = null;

    /**
     * set the interval 
     * @param interval
     * @param methodToExecute
     */
    /* tslint:disable:no-reserved-keywords */
    public set(interval: number, methodToExecute: Function): void {
        this.intr = setInterval(methodToExecute, interval);
    }
    /* tslint:enable:no-reserved-keywords*/

    /**
     * to clear the interval
     */
    public clear() {
        clearInterval(this.intr);
    }

    /**
     * sets the Timeout interval for executing method in firefox.
     * @param isFireFox
     * @param interval
     * @param methodToExecute
     */
    public static handleReactUpdatesOnWindowResize( methodToExecute: Function) {
        if (htmlutilities.getUserDevice().browser === 'Firefox') {
            window.setTimeout(methodToExecute, 0);
        } else {
            methodToExecute();
        }
    }
}

export = TimerHelper;