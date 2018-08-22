declare let config: any;
import constants = require('../../components/utility/constants');
import $ = require('jquery');
/**
 * Utility class for useful methods.
 */
class HtmlUtilities {

    // variables for saving portrait and landscapes heights
    private static portraitHeight: number;
    private static landscapeHeight: number;
    private static _isTabletOrMobileDevice = undefined;
    private static _isAndroidDevice = undefined;
    private static _isIPadDevice = undefined;

    /**
     * This method will return the current scroll position.
     * ScrollTop or PageYOffset
     */
    public static get currentScrollPosition(): number {
        let supportPageOffset = window.pageXOffset !== undefined;
        let isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
        return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
            document.documentElement.scrollTop : document.body.scrollTop;
    }

    /**
     * This method will check whether the browser is IE or not
     */
    public static get isIE(): boolean {
        let userAgent = window.navigator.userAgent;
        return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
    }

    /**
     * This method will check whether the browser is Edge or not
     */
    public static get isEdge(): boolean {
        let userAgent = window.navigator.userAgent;
        return userAgent.indexOf('Edge') > -1;
    }

    /**
     * this method will check whethere is online or not
     */
    public static get isOnline(): boolean {
        return navigator.onLine;
    }

    // Safari, in Private Browsing Mode, looks like it supports localStorage/session storage but all calls to setItem
    // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
    // to avoid the entire page breaking.
    // http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
    public static get isSessionStorageAvailable() {
        let testKey = 'test';
        let storage = window.sessionStorage;
        try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * This method will generate and returns a GUID.
     */
    public static get guid() {
        /**
         * s4
         */
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /**
     * This method will return the DOM element location at the position (x,y).
     */
    public static getElementFromPosition(x: number, y: number): Element {
        return document.elementFromPoint(x, y);
    }

    /*
    * Checks if the device is tablet/mobile.
    */
    public static get isTabletOrMobileDevice() {
        if (HtmlUtilities._isTabletOrMobileDevice === undefined) {
            HtmlUtilities._isTabletOrMobileDevice =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        return HtmlUtilities._isTabletOrMobileDevice;
    }

    /**
     * Checks if the devices is android;
     */
    public static get isAndroidDevice() {
        if (HtmlUtilities._isAndroidDevice === undefined) {
            HtmlUtilities._isAndroidDevice = /Android/i.test(navigator.userAgent);
        }

        return HtmlUtilities._isAndroidDevice;
    }

    /*
   * Checks if the device is tablet/mobile.
   */
    public static get isIPadDevice() {
        if (HtmlUtilities._isIPadDevice === undefined) {
            HtmlUtilities._isIPadDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        }

        return HtmlUtilities._isIPadDevice;
    }

    /**
     * This method will find the portrait and landscape height for updating metatag in android
     * We have implemented this as part of defect 27712
     */
    public static findWindowSize() {
        let browserToolbarHeight: number = screen.height - window.innerHeight;
        HtmlUtilities.portraitHeight = (window.orientation === 90 || window.orientation === -90) ? window.innerHeight
            : screen.width - browserToolbarHeight;
        HtmlUtilities.landscapeHeight = (window.orientation === 90 || window.orientation === -90)
            ? screen.width - browserToolbarHeight : window.innerHeight;
    }

    /**
     * This method will update the MetaTag for Android
     * @param doAppendHeight 
     */
    public static updateMetaTagForAndroid(doAppendHeight: boolean) {
        if (navigator.userAgent.length && HtmlUtilities.isAndroidDevice) {
            // window.orientation = 0 - portrait mode
            let screenHeight: number = (window.orientation === 90 || window.orientation === -90) ?
                HtmlUtilities.portraitHeight : HtmlUtilities.landscapeHeight;
            let $objHead = $('head');
            $objHead.find('meta[name=viewport]').remove();
            if (doAppendHeight) {
                $objHead.prepend('<meta name="viewport" content="width=device-width, height=' +
                screenHeight + ', initial-scale=1.0, user-scalable=no" />');
            } else {
                $objHead.prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />');
            }
        }
    }

    /**
     * Set Focus to the element.
     * @param elemntId
     */
    public static setFocusToElement(elemntId: string) {
        $('#' + elemntId).focus();
    }

    /**
     * blur an element.
     * @param elementId
     */
    public static blurElement(elementId: string) {
        $('#' + elementId).blur();
    }

    /**
     * Returns the offset top
     * @param elementIdorClass - pass elementId or class name
     */
    public static getOffsetTop(elementIdorClass: string, isElementId: boolean = true) {
        let element;
        if (isElementId) {
            element = document.getElementById(elementIdorClass);
        } else {
            element = document.getElementsByClassName(elementIdorClass).item(0);
        }
        return element ? element.offsetTop : 0;
    }

    /**
     * Returns the offset top
     * @param elementIdorClass - pass elementId or class name
     */
    public static getOffsetLeft(elementIdorClass: string, isElementId: boolean = true) {
        let element;
        if (isElementId) {
            element = document.getElementById(elementIdorClass);
        } else {
            element = document.getElementsByClassName(elementIdorClass).item(0);
        }
        return element ? element.offsetLeft : 0;
    }

    /**
     * set attribute to an element
     * @param elementId
     * @param attributeName
     * @param value
     */
    public static setAttribute(elementId: string, attributeName: string, value: string) {
        $('#' + elementId).attr(attributeName, value);
    }

    /**
     * Scroll to the Top of the element
     * @param classNameOftheElement
     * @param scrollValue
     */
    public static scrollToTopWithAnimation(classNameOftheElement: string, scrollValue: number) {
        $('.' + classNameOftheElement).animate({ scrollTop: scrollValue });
    }

    /**
     * set the scroll top of given element
     * @param elementId
     * @param scrollValue
     */
    public static setScrollTop(elementId: string, scrollValue: number) {
        $('#' + elementId).scrollTop(scrollValue);
    }

    /**
     * function to add class name to body
     * @param classNameToAdd
     */
    public static addClassToBody(classNameToAdd: string) {
        window.document.body.className += ' ' + classNameToAdd;
    }

    /**
     * function to remove class from body
     * @param classNameToRemove
     */
    public static removeClassFromBody(classNameToRemove: string) {
        window.document.body.className = window.document.body.className.replace(classNameToRemove, '');
    }

    /**
     * to check the platform and browser of current user
     */

    public static getUserDevice() {
        let _userAgent: string = navigator.userAgent;
        let _userAgentVersion = navigator.appVersion;
        let verOffset;
        let browser = '';
        let userDevice = '';
        let osVersion: string = '';
        let browserVersion: string = '';

        if (_userAgent.match(/Android/i)) {
            userDevice = 'android';
        } else if (_userAgent.match(/iPad/i)) {
            userDevice = 'iPad';
        } else if (_userAgent.match(/Mac/i)) {
            userDevice = 'Mac';
        } else if (_userAgentVersion.indexOf('Win') !== -1) {
            userDevice = 'windows';
            if (navigator.appVersion.indexOf('Windows NT 6.2') !== -1) {
                osVersion = '8';
            } else if (navigator.appVersion.indexOf('Windows NT 6.3') !== -1) {
                osVersion = '8.1';
            } else if (navigator.appVersion.indexOf('Windows NT 6.1') !== -1) {
                osVersion = '7';
            } else if (navigator.appVersion.indexOf('Windows NT 6.0') !== -1) {
                osVersion = 'Vista';
            } else if (navigator.appVersion.indexOf('Windows NT 5.1') !== -1) {
                osVersion = 'XP';
            } else if (navigator.appVersion.indexOf('Windows NT 5.0') !== -1) {
                osVersion = '2000';
            } else if (navigator.appVersion.indexOf('Windows NT 10.0') !== -1) {
                osVersion = '10';
            }
        }

        let isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        let isChromeOnIpad = /CriOS/i.test(navigator.userAgent) &&
            /ipad/i.test(navigator.userAgent);

        if (_userAgent.indexOf('MSIE ') > -1 || _userAgent.indexOf('Trident/') > -1) {
            browser = 'IE';
        } else if (isChromeOnIpad) {
            browser = 'ChromeiPad';
        } else if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) { //Chrome
            browser = 'Chrome';
        } else if (isSafari) { //Safari
            browser = 'Safari';
        } else if ((verOffset = _userAgent.indexOf('Firefox')) !== -1) { // Firefox
            browser = 'Firefox';
        } else if ((verOffset = _userAgent.indexOf('Edge')) !== -1) {
            browser = 'Edge';
        }

        let browserWithVersion: string = _userAgent.substring(_userAgent.indexOf(browser));
        browserVersion = browserWithVersion.substring(browserWithVersion.indexOf('/') + 1, browserWithVersion.indexOf(' '));

        return {
            'browser': browser,
            'userDevice': userDevice,
            'osVersion': osVersion,
            'browserVersion': browserVersion
        };
    }

    /**
     * check whether a url is refering in script tag or not
     * @param url
     */
    public static isScriptLoaded(url: string) {
        if (url) {
            let scripts = document.getElementsByTagName('script');
            for (let i = scripts.length; i--; ) {
                if (scripts[i].src === url) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns full url
     * @param {string} url
     * @returns
     */
    public static getFullUrl(url: string) {
        return (config.general.SERVICE_BASE_URL + url).toLowerCase();
    }

    /**
     * Returns parent element having a specific class
     * @param el
     * @param classname
     */
    public static findAncestor(el: any, className: string) {
        let element: Element = el;

        if (el !== null && el !== undefined && el.className !== undefined) {
            while (el !== null && el !== undefined && (el = (el.parentElement || el.parentNode))) {
                if (typeof el.className === 'string' && el.className.indexOf(className) >= 0) {
                    break;
                } else {
                    continue;
                }
            }
        }

        if (el === null) {
            el = element ? element : el;
        }

        return el;
    }



    /**
     * Iterates accross the element to find the parentElement having a particular id
     * @param elem
     * @param holderElement
     * @param iteration
     */
    private static getParentElement(element: any, holderElement: Element, iteration: number) {
        /** The function being a recursive one, to prevent unnecessary traversals, an iteration limit was fixed to 8 */
        if (iteration < constants.ITERATION_LIMIT) {
            if (element) {
                if (element.id) {
                    if (element.id.indexOf('annotationoverlay_') === -1) {
                        return this.getParentElement(element.parentNode, holderElement, iteration + 1);
                    } else {
                        return element;
                    }
                } else {
                    return this.getParentElement(element.parentNode, holderElement, iteration + 1);
                }
            } else {
                return holderElement;
            }
        } else {
            return holderElement;
        }
    }

    /**
     * Returns parent element having a specific class
     * @param holderElement
     * @param event
     */
    public static findCurrentHolder(holderElement: Element, x: number, y: number) {
        let htmlElement: Element = this.getElementFromPosition(x, y);
        if (htmlElement) {
            if (htmlElement !== null || htmlElement !== undefined) {
                if (htmlElement) {
                    return this.getParentElement(htmlElement, holderElement, 1);
                } else {
                    return holderElement;
                }
            } else {
                return holderElement;
            }
        } else {
            return holderElement;
        }
    }


    /**
     * Checks whether cookies are enabled in the browser
     */
    public static get IsCookiesEnabled(): boolean {
        return navigator.cookieEnabled;
    }

    /**
     * Calculating the pixel value of rendered string
     * @param {string} classname
     * @param {string} content
     * @returns the pixel length of the  content
     */
    public static pixelLength(classname: string, content: string): number {

        let length: number = 0;
        let obj = $('<span class=' + classname + ' id="composer" style="visibility: hidden; white-space: nowrap;"></span>');
        obj.append(content);
        $('body').append(obj);
        length = obj.width();
        $('#composer').remove();
        return length;
    }

    /**
     * Check whether the browser is IE11 or not
     * @returns true if IE11
     */
    public static get isIE11(): boolean {
        return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    }

    /**
     * Check whether the browser is Chrome or not
     * @returns true if Chrome
     */
    public static get isChrome(): boolean {
        return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    }

    /**
     * Check whether the browser is safari or not
     * @returns true if safari
     */
    public static get isSafari(): boolean {
        return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    }

    /**
     * Check whether the browser is firefox or not.
     */
    public static get isFirefox(): boolean {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    /**
     * Check whether the browser is Chrome or not
     * @returns true if Chrome
     */
    public static isAndroidChrome(): boolean {
        return HtmlUtilities.isAndroidDevice && HtmlUtilities.isChrome;
    }

    /**
     * Check whether browser is android firefox or not.
     * @static
     * @returns {isBoolean} 
     */
    public static isAndroidFirefox(): Boolean {
        return HtmlUtilities.isAndroidDevice && HtmlUtilities.isFirefox;
    }

    /**
     * get element by its class name
     * @param {string} classname
     * @returns the list of elements
     */
    public static getElementsByClassName(classname: string): NodeListOf<Element> {
        return document.getElementsByClassName(classname);
    }

    /**
     * get element by its Id
     * @param {string} id
     * @returns the element
     */
    public static getElementById(id: string): Element {
        return document.getElementById(id);
    }

    /**
     * GetBoundingClientRect of element.
     * 
     * @static
     * @memberof HtmlUtilities
     */
    public static getBoundingClientRect(elementIdOrClassname: string, isElementId: boolean = false) {
        let element;
        if (isElementId) {
            element = document.getElementById(elementIdOrClassname);
        } else {
            element = document.getElementsByClassName(elementIdOrClassname)[0];
        }
        return element ? element.getBoundingClientRect() : null;
    }


    /**
     * This will remove the unwanted selection (script image) from Document before dragging the element
     */
    public static removeSelectionFromDocument = (): void => {
        if (window.getSelection() && !window.getSelection().isCollapsed) {
            window.getSelection().removeAllRanges();
        }
    };
}

export = HtmlUtilities;