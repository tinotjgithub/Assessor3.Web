"use strict";
var constants = require('../../components/utility/constants');
var $ = require('jquery');
/**
 * Utility class for useful methods.
 */
var HtmlUtilities = (function () {
    function HtmlUtilities() {
    }
    Object.defineProperty(HtmlUtilities, "currentScrollPosition", {
        /**
         * This method will return the current scroll position.
         * ScrollTop or PageYOffset
         */
        get: function () {
            var supportPageOffset = window.pageXOffset !== undefined;
            var isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat');
            return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
                document.documentElement.scrollTop : document.body.scrollTop;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isIE", {
        /**
         * This method will check whether the browser is IE or not
         */
        get: function () {
            var userAgent = window.navigator.userAgent;
            return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isEdge", {
        /**
         * This method will check whether the browser is Edge or not
         */
        get: function () {
            var userAgent = window.navigator.userAgent;
            return userAgent.indexOf('Edge') > -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isOnline", {
        /**
         * this method will check whethere is online or not
         */
        get: function () {
            return navigator.onLine;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isSessionStorageAvailable", {
        // Safari, in Private Browsing Mode, looks like it supports localStorage/session storage but all calls to setItem
        // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
        // to avoid the entire page breaking.
        // http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
        get: function () {
            var testKey = 'test';
            var storage = window.sessionStorage;
            try {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "guid", {
        /**
         * This method will generate and returns a GUID.
         */
        get: function () {
            /**
             * s4
             */
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will return the DOM element location at the position (x,y).
     */
    HtmlUtilities.getElementFromPosition = function (x, y) {
        return document.elementFromPoint(x, y);
    };
    Object.defineProperty(HtmlUtilities, "isTabletOrMobileDevice", {
        /*
        * Checks if the device is tablet/mobile.
        */
        get: function () {
            if (HtmlUtilities._isTabletOrMobileDevice === undefined) {
                HtmlUtilities._isTabletOrMobileDevice =
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            }
            return HtmlUtilities._isTabletOrMobileDevice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isAndroidDevice", {
        /**
         * Checks if the devices is android;
         */
        get: function () {
            if (HtmlUtilities._isAndroidDevice === undefined) {
                HtmlUtilities._isAndroidDevice = /Android/i.test(navigator.userAgent);
            }
            return HtmlUtilities._isAndroidDevice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isIPadDevice", {
        /*
       * Checks if the device is tablet/mobile.
       */
        get: function () {
            if (HtmlUtilities._isIPadDevice === undefined) {
                HtmlUtilities._isIPadDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            }
            return HtmlUtilities._isIPadDevice;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * This method will find the portrait and landscape height for updating metatag in android
     * We have implemented this as part of defect 27712
     */
    HtmlUtilities.findWindowSize = function () {
        var browserToolbarHeight = screen.height - window.innerHeight;
        HtmlUtilities.portraitHeight = (window.orientation === 90 || window.orientation === -90) ? window.innerHeight
            : screen.width - browserToolbarHeight;
        HtmlUtilities.landscapeHeight = (window.orientation === 90 || window.orientation === -90)
            ? screen.width - browserToolbarHeight : window.innerHeight;
    };
    /**
     * This method will update the MetaTag for Android
     * @param doAppendHeight
     */
    HtmlUtilities.updateMetaTagForAndroid = function (doAppendHeight) {
        if (navigator.userAgent.length && HtmlUtilities.isAndroidDevice) {
            // window.orientation = 0 - portrait mode
            var screenHeight = (window.orientation === 90 || window.orientation === -90) ?
                HtmlUtilities.portraitHeight : HtmlUtilities.landscapeHeight;
            var $objHead = $('head');
            $objHead.find('meta[name=viewport]').remove();
            if (doAppendHeight) {
                $objHead.prepend('<meta name="viewport" content="width=device-width, height=' +
                    screenHeight + ', initial-scale=1.0, user-scalable=no" />');
            }
            else {
                $objHead.prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />');
            }
        }
    };
    /**
     * Set Focus to the element.
     * @param elemntId
     */
    HtmlUtilities.setFocusToElement = function (elemntId) {
        $('#' + elemntId).focus();
    };
    /**
     * blur an element.
     * @param elementId
     */
    HtmlUtilities.blurElement = function (elementId) {
        $('#' + elementId).blur();
    };
    /**
     * Returns the offset top
     * @param elementIdorClass - pass elementId or class name
     */
    HtmlUtilities.getOffsetTop = function (elementIdorClass, isElementId) {
        if (isElementId === void 0) { isElementId = true; }
        var element;
        if (isElementId) {
            element = document.getElementById(elementIdorClass);
        }
        else {
            element = document.getElementsByClassName(elementIdorClass).item(0);
        }
        return element ? element.offsetTop : 0;
    };
    /**
     * Returns the offset top
     * @param elementIdorClass - pass elementId or class name
     */
    HtmlUtilities.getOffsetLeft = function (elementIdorClass, isElementId) {
        if (isElementId === void 0) { isElementId = true; }
        var element;
        if (isElementId) {
            element = document.getElementById(elementIdorClass);
        }
        else {
            element = document.getElementsByClassName(elementIdorClass).item(0);
        }
        return element ? element.offsetLeft : 0;
    };
    /**
     * set attribute to an element
     * @param elementId
     * @param attributeName
     * @param value
     */
    HtmlUtilities.setAttribute = function (elementId, attributeName, value) {
        $('#' + elementId).attr(attributeName, value);
    };
    /**
     * Scroll to the Top of the element
     * @param classNameOftheElement
     * @param scrollValue
     */
    HtmlUtilities.scrollToTopWithAnimation = function (classNameOftheElement, scrollValue) {
        $('.' + classNameOftheElement).animate({ scrollTop: scrollValue });
    };
    /**
     * set the scroll top of given element
     * @param elementId
     * @param scrollValue
     */
    HtmlUtilities.setScrollTop = function (elementId, scrollValue) {
        $('#' + elementId).scrollTop(scrollValue);
    };
    /**
     * function to add class name to body
     * @param classNameToAdd
     */
    HtmlUtilities.addClassToBody = function (classNameToAdd) {
        window.document.body.className += ' ' + classNameToAdd;
    };
    /**
     * function to remove class from body
     * @param classNameToRemove
     */
    HtmlUtilities.removeClassFromBody = function (classNameToRemove) {
        window.document.body.className = window.document.body.className.replace(classNameToRemove, '');
    };
    /**
     * to check the platform and browser of current user
     */
    HtmlUtilities.getUserDevice = function () {
        var _userAgent = navigator.userAgent;
        var _userAgentVersion = navigator.appVersion;
        var verOffset;
        var browser = '';
        var userDevice = '';
        var osVersion = '';
        var browserVersion = '';
        if (_userAgent.match(/Android/i)) {
            userDevice = 'android';
        }
        else if (_userAgent.match(/iPad/i)) {
            userDevice = 'iPad';
        }
        else if (_userAgent.match(/Mac/i)) {
            userDevice = 'Mac';
        }
        else if (_userAgentVersion.indexOf('Win') !== -1) {
            userDevice = 'windows';
            if (navigator.appVersion.indexOf('Windows NT 6.2') !== -1) {
                osVersion = '8';
            }
            else if (navigator.appVersion.indexOf('Windows NT 6.3') !== -1) {
                osVersion = '8.1';
            }
            else if (navigator.appVersion.indexOf('Windows NT 6.1') !== -1) {
                osVersion = '7';
            }
            else if (navigator.appVersion.indexOf('Windows NT 6.0') !== -1) {
                osVersion = 'Vista';
            }
            else if (navigator.appVersion.indexOf('Windows NT 5.1') !== -1) {
                osVersion = 'XP';
            }
            else if (navigator.appVersion.indexOf('Windows NT 5.0') !== -1) {
                osVersion = '2000';
            }
            else if (navigator.appVersion.indexOf('Windows NT 10.0') !== -1) {
                osVersion = '10';
            }
        }
        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        var isChromeOnIpad = /CriOS/i.test(navigator.userAgent) &&
            /ipad/i.test(navigator.userAgent);
        if (_userAgent.indexOf('MSIE ') > -1 || _userAgent.indexOf('Trident/') > -1) {
            browser = 'IE';
        }
        else if (isChromeOnIpad) {
            browser = 'ChromeiPad';
        }
        else if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
            browser = 'Chrome';
        }
        else if (isSafari) {
            browser = 'Safari';
        }
        else if ((verOffset = _userAgent.indexOf('Firefox')) !== -1) {
            browser = 'Firefox';
        }
        else if ((verOffset = _userAgent.indexOf('Edge')) !== -1) {
            browser = 'Edge';
        }
        var browserWithVersion = _userAgent.substring(_userAgent.indexOf(browser));
        browserVersion = browserWithVersion.substring(browserWithVersion.indexOf('/') + 1, browserWithVersion.indexOf(' '));
        return {
            'browser': browser,
            'userDevice': userDevice,
            'osVersion': osVersion,
            'browserVersion': browserVersion
        };
    };
    /**
     * check whether a url is refering in script tag or not
     * @param url
     */
    HtmlUtilities.isScriptLoaded = function (url) {
        if (url) {
            var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length; i--;) {
                if (scripts[i].src === url) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Returns full url
     * @param {string} url
     * @returns
     */
    HtmlUtilities.getFullUrl = function (url) {
        return (config.general.SERVICE_BASE_URL + url).toLowerCase();
    };
    /**
     * Returns parent element having a specific class
     * @param el
     * @param classname
     */
    HtmlUtilities.findAncestor = function (el, className) {
        var element = el;
        if (el !== null && el !== undefined && el.className !== undefined) {
            while (el !== null && el !== undefined && (el = (el.parentElement || el.parentNode))) {
                if (typeof el.className === 'string' && el.className.indexOf(className) >= 0) {
                    break;
                }
                else {
                    continue;
                }
            }
        }
        if (el === null) {
            el = element ? element : el;
        }
        return el;
    };
    /**
     * Iterates accross the element to find the parentElement having a particular id
     * @param elem
     * @param holderElement
     * @param iteration
     */
    HtmlUtilities.getParentElement = function (element, holderElement, iteration) {
        /** The function being a recursive one, to prevent unnecessary traversals, an iteration limit was fixed to 8 */
        if (iteration < constants.ITERATION_LIMIT) {
            if (element) {
                if (element.id) {
                    if (element.id.indexOf('annotationoverlay_') === -1) {
                        return this.getParentElement(element.parentNode, holderElement, iteration + 1);
                    }
                    else {
                        return element;
                    }
                }
                else {
                    return this.getParentElement(element.parentNode, holderElement, iteration + 1);
                }
            }
            else {
                return holderElement;
            }
        }
        else {
            return holderElement;
        }
    };
    /**
     * Returns parent element having a specific class
     * @param holderElement
     * @param event
     */
    HtmlUtilities.findCurrentHolder = function (holderElement, x, y) {
        var htmlElement = this.getElementFromPosition(x, y);
        if (htmlElement) {
            if (htmlElement !== null || htmlElement !== undefined) {
                if (htmlElement) {
                    return this.getParentElement(htmlElement, holderElement, 1);
                }
                else {
                    return holderElement;
                }
            }
            else {
                return holderElement;
            }
        }
        else {
            return holderElement;
        }
    };
    Object.defineProperty(HtmlUtilities, "IsCookiesEnabled", {
        /**
         * Checks whether cookies are enabled in the browser
         */
        get: function () {
            return navigator.cookieEnabled;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Calculating the pixel value of rendered string
     * @param {string} classname
     * @param {string} content
     * @returns the pixel length of the  content
     */
    HtmlUtilities.pixelLength = function (classname, content) {
        var length = 0;
        var obj = $('<span class=' + classname + ' id="composer" style="visibility: hidden; white-space: nowrap;"></span>');
        obj.append(content);
        $('body').append(obj);
        length = obj.width();
        $('#composer').remove();
        return length;
    };
    Object.defineProperty(HtmlUtilities, "isIE11", {
        /**
         * Check whether the browser is IE11 or not
         * @returns true if IE11
         */
        get: function () {
            return /Trident.*rv[ :]*11\./.test(navigator.userAgent);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isChrome", {
        /**
         * Check whether the browser is Chrome or not
         * @returns true if Chrome
         */
        get: function () {
            return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isSafari", {
        /**
         * Check whether the browser is safari or not
         * @returns true if safari
         */
        get: function () {
            return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HtmlUtilities, "isFirefox", {
        /**
         * Check whether the browser is firefox or not.
         */
        get: function () {
            return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Check whether the browser is Chrome or not
     * @returns true if Chrome
     */
    HtmlUtilities.isAndroidChrome = function () {
        return HtmlUtilities.isAndroidDevice && HtmlUtilities.isChrome;
    };
    /**
     * Check whether browser is android firefox or not.
     * @static
     * @returns {isBoolean}
     */
    HtmlUtilities.isAndroidFirefox = function () {
        return HtmlUtilities.isAndroidDevice && HtmlUtilities.isFirefox;
    };
    /**
     * get element by its class name
     * @param {string} classname
     * @returns the list of elements
     */
    HtmlUtilities.getElementsByClassName = function (classname) {
        return document.getElementsByClassName(classname);
    };
    /**
     * get element by its Id
     * @param {string} id
     * @returns the element
     */
    HtmlUtilities.getElementById = function (id) {
        return document.getElementById(id);
    };
    /**
     * GetBoundingClientRect of element.
     *
     * @static
     * @memberof HtmlUtilities
     */
    HtmlUtilities.getBoundingClientRect = function (elementIdOrClassname, isElementId) {
        if (isElementId === void 0) { isElementId = false; }
        var element;
        if (isElementId) {
            element = document.getElementById(elementIdOrClassname);
        }
        else {
            element = document.getElementsByClassName(elementIdOrClassname)[0];
        }
        return element ? element.getBoundingClientRect() : null;
    };
    HtmlUtilities._isTabletOrMobileDevice = undefined;
    HtmlUtilities._isAndroidDevice = undefined;
    HtmlUtilities._isIPadDevice = undefined;
    /**
     * This will remove the unwanted selection (script image) from Document before dragging the element
     */
    HtmlUtilities.removeSelectionFromDocument = function () {
        if (window.getSelection() && !window.getSelection().isCollapsed) {
            window.getSelection().removeAllRanges();
        }
    };
    return HtmlUtilities;
}());
module.exports = HtmlUtilities;
//# sourceMappingURL=htmlutilities.js.map