import dataServiceBase = require('../base/dataservicebase');
import urls = require('../base/urls');
import Immutable = require('immutable');
import enums = require('../../components/utility/enums');

/**
 * Class for getting acetates details
 */
class AcetatesDataSevice extends dataServiceBase {

    /**
     * Converts acetatereturn collection to an immutable list
     * @param data
     */
    private getImmutableAcetates(data: any): Immutable.List<Acetate> {
        return Immutable.List<Acetate>(data.tools);
    }

    /**
     * Converts acetatereturn collection to an immutable list
     * @param data
     */
    private getImmutableAcetatesAfterSave(data: any): Immutable.List<Acetate> {
        return Immutable.List<Acetate>(data.acetatesReturnList);
    }

    /**
     * Loads the acetates data
     * @param callback
     * @param questionPaperID
     * @param markSchemeGroupId
     * @param includeRelatedQigs
     */
    public loadAcetates(callback: ((success: boolean, json: Immutable.List<Acetate>) => void),
        questionPaperID: number, markSchemeGroupId: number, includeRelatedQigs: boolean) {
        let url = urls.LOAD_ACETATES_URL + '/' + questionPaperID + '/' + markSchemeGroupId + '/' + includeRelatedQigs;

        /** Makes AJAX call to get acetates   */
        let getAcetatesPromise = this.makeAJAXCall('GET', url, '', false, false);
        let that = this;
        getAcetatesPromise.then(function (data: any) {
            let acetatesList = that.getImmutableAcetates(JSON.parse(data));
            if (callback) {
                callback(true, acetatesList);
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, data);
            }
        });
    }

    /**
     * Save acetates details. AcetatesReturnList
     * @param saveAcetatesArgs
     * @param callback
     */
    public saveAcetates(callback: ((success: boolean, json: Immutable.List<Acetate>) => void), args: SaveAcetatesArguments){
        let url = urls.SAVE_ACETATES_URL;
        let saveacetatesJson = JSON.stringify(args);

        /**  Making AJAX call to save the marks and annotations */
        let saveAcetatesPromise = this.makeAJAXCall('POST', url, saveacetatesJson);
        let that = this;

        saveAcetatesPromise.then(function (data: any) {
            let acetatesList = that.getImmutableAcetatesAfterSave(JSON.parse(data));
            if (callback) {
                callback(true, acetatesList);
            }
        }).catch(function (data: any) {
            if (callback) {
                callback(false, JSON.parse(data));
            }
        });
    }
}

let acetatesDataService = new AcetatesDataSevice();
export = acetatesDataService;