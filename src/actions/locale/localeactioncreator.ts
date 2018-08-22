import dispatcher = require('../../app/dispatcher');
import localeAction = require('./localeaction');
import localeDataService = require('../../dataservices/locale/localedataservice');

/**
 * Locale action creator helper class
 */
class LocaleActionCreator {

    /**
     * Call the locale data  service and then generate a locale action.
     * @param locale - selected locale name
     * @param awardingBody - name of the awarding body
     */
    public localeChange(locale: string, awardingBody: string): void {
         /**
          * Splitting the locale to take the langauge code only.The locale conatin both language and country code,
          * the corresponding locale json name contain only language code.
          */
        let localeCode = locale.split('-')[0];

        localeDataService.getLocaleJSON(localeCode, awardingBody, function (success: boolean, json: any, fallBackJson: any) {
            dispatcher.dispatch(new localeAction(success, locale, json, fallBackJson));
        });
    }
}

let localeActionCreator = new LocaleActionCreator();

export = localeActionCreator;
