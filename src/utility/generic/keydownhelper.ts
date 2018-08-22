import moduleKeyHandler = require('./modulekeyhandler');
import modulekeys = require('./modulekeys');
import enums = require('../../components/utility/enums');

/* tslint:disable:no-bitwise */

/**
 * helper class with utilty methods for key down events
 */
class KeydownHelper {
    // This holds the value indicate the listener is activate.
    // I would suggest to use this  by only out side response view modules.
    // NB: use this only when needed, Other wise go with priority settings
    // Inside the response view can use the priority if normal case
    private currentMarkEntryDeactivators: number = 0;

    // is browser is Internet explorer
    private _isIE: boolean = false;

    // Collection of keys pressed.
    private keys: Array<KeyboardEvent> = [];

    /** Object literal to store the handlers against a key */
    private handlers: Array<moduleKeyHandler> = new Array<moduleKeyHandler>();

    /**
     * Constructor for Keydownhelper
     */
    constructor() {
        window.addEventListener('keypress', this.processKeyPress.bind(this));
        window.addEventListener('keydown', this.processKeyDown.bind(this));
        window.addEventListener('keyup', this.processKeyUp.bind(this));

        // By default this will be activated.
        this.currentMarkEntryDeactivators = 0;
        this.isIE();
    }

    /**
     * Is internet explorer
     */
    private isIE(): void {

        // If IE 11 then look for Updated user agent string.
        if (navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/)) {
            this._isIE = true;
        } else {
            this._isIE = false; //It is not IE
        }
    }

    /**
     * Process the keyboad event.
     * @param {KeyboardEvent} event
     */
    private processKeyPress(event: KeyboardEvent) {

        if (this.isKeyDownListenerActivated === false) {

            return;
        }

        // Call each key callback functions and if one module has been processed,
        // stop excecution
        let sortedResult = this.handlers.sort((a: any, b: any) => { return a.Priority - b.Priority; });
        for (let i in sortedResult) {
            if (sortedResult[i].isActive === true &&
                sortedResult[i].KeyMode === enums.KeyMode.press &&
                sortedResult[i].callBack(event) === true) {

                event.preventDefault();
                return;
            }
        }
    }

    /**
     * Process the keyboad event.
     * @param {KeyboardEvent} event
     */
    private processKeyDown(event: KeyboardEvent) {

        if (this.isKeyDownListenerActivated === false) {
            return;
        }

        if (this._isIE === true) {

            let isKeyExists = false;

            for (let j = 0; j < this.keys.length; j++) {

                if (this.keys[j].keyCode === event.keyCode
                    && this.keys[j].which === event.which) {

                    isKeyExists = true;
                }
            }

            if (isKeyExists === false) {
                this.keys.push(event);
            } else {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }

        } else if (event.repeat === true) {
            // This is to prevent multiple key press events to get executed
            event.stopPropagation();
            event.preventDefault();
            return false;
        }

        // Call each key callback functions and if one module has been processed,
        // stop excecution
        let sortedResult = this.handlers.sort((a: any, b: any) => { return a.Priority - b.Priority; });
        for (let i in sortedResult) {
            if (sortedResult[i].isActive === true &&
                sortedResult[i].KeyMode === enums.KeyMode.down &&
                sortedResult[i].callBack(event) === true) {

                event.preventDefault();
                return;
            }
        }

    }

    /**
     * Handle the key up process
     * @param {KeyboardEvent} event
     */
    private processKeyUp(event: KeyboardEvent) {

        if (this._isIE === true) {

            for (let i = 0; i < this.keys.length; i++) {

                if (this.keys[i].keyCode === event.keyCode
                    && this.keys[i].which === event.which) {

                    this.keys.splice(i, 1);
                }
            }
        }

        // Lets leave to the system to work on keys.
        if (this.isKeyDownListenerActivated === false) {
            return;
        }

        // If the modules are already added and depending on keys to perform any action,
        // we dont need work on UP keys. Specifically killing the event because, popup-button
        // click will get fired on keyup in FireFox.
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Add key to the handler collection.
     * @param {moduleKeyHandler} handler
     * 1) Check key is exists
     * 2) Even if it is exists or not check the priority. System should not allow to add most priority
     *    handlers twice. Priority-1
     * 3) if pass add/append the handler.
     */
    private addKey(handler: moduleKeyHandler): void {

        // If key exists
        if (this.isValidatePriority(handler.KeyName, handler.Priority)) {

            let isFound: boolean = false;
            if (this.handlers.length > 0) {

                this.handlers.map((item: moduleKeyHandler) => {

                    if (item.KeyName === handler.KeyName) {
                        item.isActive = handler.isActive;
                        item.setPriority = handler.Priority;

                        isFound = true;
                    }
                });
            }

            if (isFound === false) {
                this.handlers.push(handler);
            }

        } else {

            throw 'can not add multiple priority values';
        }
    }

    /**
     * Remove the key
     * @param {string} keyName
     */
    private removeKey(keyName: string): void {

        for (let i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i].KeyName === keyName) {
                this.handlers.splice(i, 1);
                return;
            }
        }
    }

    /**
     * validate whether its a valid priority
     * @param {string} keyName
     * @param {number} priority
     * @returns
     */
    private isValidatePriority(keyName: string, priority: number): boolean {

        if (this.handlers.length > 0) {
            let currentHandler = this.handlers.filter(
                (item: moduleKeyHandler) => { return item !== undefined && item.KeyName === keyName; });

            if (currentHandler.length === 0) {
                return true;
            }

            if (priority === 1) {

                let priorityHandler = currentHandler.filter(
                    (item: moduleKeyHandler) => { return item.Priority === enums.Priority.First; });
                if (priorityHandler.length === 0) {
                    return true;
                } else {

                    // Taking by index as we are only allowing one element at most priority list.
                    return priorityHandler[0].KeyName === keyName;
                }

            }
        }
        return true;
    }

    /**
     * Mount the keyhandler against a module.
     * @param {moduleKeyHandler} handler
     * @summary 'Not more than one modules has been added and
     * most priority module will be one in the list and others can share same priosrity'
     */
    public mountKeyPressHandler(handler: moduleKeyHandler): void {
        this.addKey(handler);
    }

    /**
     * Mount keydown handler to the global listener.
     * @param {moduleKeyHandler} handler
     */
    public mountKeyDownHandler(handler: moduleKeyHandler): void {
        this.addKey(handler);
    }

    /**
     * unmount the key event.
     * @param {string} key
     */
    public unmountKeyHandler(key: string): void {
        this.removeKey(key);
    }

    /**
     * Reset activation a key
     * @param key
     */
    public resetActivateHandler(key: string, isActivate: boolean): void {

        this.handlers.map((item: moduleKeyHandler) => {
            if (item.KeyName === key) {
                item.isActive = isActivate;
            }
        });

    }

    /**
     * Preventing event from propogation and prevent default
     * @param {KeyboardEvent} event
     * @param {boolean} preventDefault
     */
    public static stopEvent(event: KeyboardEvent, preventDefault: boolean = true): void {
        event.stopPropagation();

        if (preventDefault === true) {
            event.preventDefault();
        }
    }

    /**
     * Activate the event listener to listen to the events
     * @param {enums.MarkEntryDeactivator} source
     */
    public Activate(source: enums.MarkEntryDeactivator): void {
        if ((this.currentMarkEntryDeactivators & source) === source) {
            this.currentMarkEntryDeactivators ^= source;
        }
    }

    /**
     * Deactivate the event listener to listen to the events
     * @param {enums.MarkEntryDeactivator} source
     */
    public DeActivate(source: enums.MarkEntryDeactivator): void {
        if ((this.currentMarkEntryDeactivators & source) !== source) {
            this.currentMarkEntryDeactivators |= source;
        }
    }

    /**
     * Returns the current status of keydown helper listener
     * @returns
     */
    public get isKeyDownListenerActivated(): boolean {
        return this.currentMarkEntryDeactivators === enums.MarkEntryDeactivator.None;
    }

    /**
     * Reseting the MarkEntryDeactivators to none
     */
    public resetMarkEntryDeactivators() {
        this.currentMarkEntryDeactivators = enums.MarkEntryDeactivator.None;
    }
}
let instance = new KeydownHelper();
export = { instance, KeydownHelper };

/* tslint:enable */