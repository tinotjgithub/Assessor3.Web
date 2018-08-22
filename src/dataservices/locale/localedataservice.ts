import dataServiceBase = require('../base/dataservicebase');
import Promise = require('es6-promise');
import constants = require('../../components/utility/constants');

class LocaleDataService extends dataServiceBase {

   /**
    * Call the locale data service and returns JSON object corresponding to the given locale.
    * @param locale - slected locale
    * @param awardingBody - name of the awarding body
    * @param callback - call back with success boolean and JSON object corresponding to locale.
    */
    public getLocaleJSON(locale: string, awardingBody: string,
        callback: ((success: boolean, json: JSON, fallbackJson: JSON) => void)): void {

         /** The locale JSON file name should be in a format of awardingbody-locale.json.
          * Populating the url based on te awarding body and locale selected.
          */
        let jsonUrl = './Content/resources/' + awardingBody + '-' + locale + '.json';
        let fallBackUrl = './Content/resources/' + constants.FALLBACK_LOCALE + '.json';
		/**  Making AJAX call to get the locale JSON */
        let localePromise = this.makeAJAXCallWithFullUrl('GET', jsonUrl);
        let fallBackLocalePromise = this.makeAJAXCallWithFullUrl('GET', fallBackUrl);
        Promise.Promise.all([localePromise, fallBackLocalePromise])
            .then(function (results: any){
            if (callback) {
                callback(true, results[0], results[1]);
            }
        }).catch(function (json: any) {
                if (callback) {
                    callback(false, undefined, undefined);
                }
        });
    }
}

let localeDataService = new LocaleDataService();


export = localeDataService;

