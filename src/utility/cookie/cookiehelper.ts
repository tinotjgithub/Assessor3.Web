import cookie = require('react-cookie');
const SHOW_COOKIE_PAGE = 'showcookiepage';
/**
 * helper class with utilty methods for cookie
 */
class CookieHelper {

    /**
     * Save to cookie
     */
    public static saveToCookie(key: string, value: Object, expireDate: Date) {
        let opt = {
            expires: expireDate
        };

        cookie.save(SHOW_COOKIE_PAGE, value, opt);
    }

    /**
     * Read from cookie
     * @param key The cookie key
     */
    public static readFromCookie(key: string) {
        let _cookie = cookie.load(key, true);
        return _cookie;
    }
}

export = CookieHelper;