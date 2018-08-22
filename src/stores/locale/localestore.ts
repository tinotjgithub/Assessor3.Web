import dispatcher = require('../../app/dispatcher');
import Action = require('../../actions/base/action');
import LocaleAction = require('../../actions/locale/localeaction');
let counterpart = require('counterpart');
import storeBase = require('../base/storebase');
import ActionType = require('../../actions/base/actiontypes');
import constants = require('../../components/utility/constants');

/**
 * Store fore locale.
 */
class LocaleStore extends storeBase {

    public static LOCALE_CHANGE_EVENT = 'localeChanged';
    private success: boolean;
    private locale: string;
    private localeJson: Object;

    /**
     * @constructor
     */
    constructor() {
        super();
        this.dispatchToken = dispatcher.register((action: Action) => {
            if (action.actionType === ActionType.LOCALE) {
                this.success = (action as LocaleAction).success;
                if (this.success) {
                    /** registering the JSON corresponding to the selected locale and setting the same as current locale. */
                    this.locale = (action as LocaleAction).getLocale;
                    this.localeJson = (action as LocaleAction).getLocaleJson;
                    let getFallbackJson = (action as LocaleAction).getFallbackJson;
                    counterpart.registerTranslations(this.locale, this.localeJson);
                    counterpart.registerTranslations(constants.FALLBACK_LOCALE, getFallbackJson);
                    counterpart.setLocale(this.locale);
                    counterpart.setFallbackLocale(constants.FALLBACK_LOCALE);
                    this.emit(LocaleStore.LOCALE_CHANGE_EVENT);
                }
            }
        });
    }

   /**
    * returns the translated text based on the current locale.
    */
    public TranslateText(text: string): string {
        /** If the corresponding language has not been downloaded return empty */
        if (this.locale !== undefined) {
            return counterpart.translate(text);
        } else {
            return '';
        }
    }

   /**
    * returns the current locale
    */
    public get Locale() {
        return this.locale;
    }

   /**
    * returns the JSON objcet corresponding to current locale
    */
    public get LocaleJson() {
        return this.localeJson;
    }

}

let instance = new LocaleStore();

export = { LocaleStore, instance };
