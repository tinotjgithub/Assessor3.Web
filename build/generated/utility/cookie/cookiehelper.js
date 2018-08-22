"use strict";
var cookie = require('react-cookie');
var SHOW_COOKIE_PAGE = 'showcookiepage';
/**
 * helper class with utilty methods for cookie
 */
var CookieHelper = (function () {
    function CookieHelper() {
    }
    /**
     * Save to cookie
     */
    CookieHelper.saveToCookie = function (key, value, expireDate) {
        var opt = {
            expires: expireDate
        };
        cookie.save(SHOW_COOKIE_PAGE, value, opt);
    };
    /**
     * Read from cookie
     * @param key The cookie key
     */
    CookieHelper.readFromCookie = function (key) {
        var _cookie = cookie.load(key, true);
        return _cookie;
    };
    return CookieHelper;
}());
module.exports = CookieHelper;
//# sourceMappingURL=cookiehelper.js.map