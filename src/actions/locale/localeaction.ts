import action = require('../base/action');
import dataRetrievalAction = require('../base/dataretrievalaction');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

/**
 * Action class for Locale.
 */
class LocaleAction extends dataRetrievalAction {

    private locale: string;
    private localeJson: Object;
    private fallbackJson: Object;
    /**
     * @constructor
     */
    constructor(success: boolean, locale: string, localeJson: Object, fallbackJson: Object) {
        super(action.Source.View, actionType.LOCALE, success);

        this.locale = locale;
        this.localeJson = localeJson;
        this.fallbackJson = fallbackJson;
        this.auditLog.logContent = this.auditLog.logContent.replace(/{success}/g, success.toString());
    }

    /**
     * returns the locale
     */
    get getLocale() {
        return this.locale;
    }

    /**
     * returns the json objcet corresponding to currently selected locale
     */
    get getLocaleJson() {
        return this.localeJson;
    }

    /**
     * returns the json objcet corresponding to fallback locale
     */
    get getFallbackJson() {
        return this.fallbackJson;
    }
}
export = LocaleAction;