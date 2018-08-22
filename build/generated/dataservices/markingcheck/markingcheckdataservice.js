"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dataServiceBase = require('../base/dataservicebase');
var urls = require('../base/urls');
var MarkingCheckDataService = (function (_super) {
    __extends(MarkingCheckDataService, _super);
    function MarkingCheckDataService() {
        _super.apply(this, arguments);
    }
    /**
     * Makes the ajax call and returns the data
     * @param examinerRoleId
     */
    MarkingCheckDataService.prototype.getMarkingCheckDetails = function (examinerRoleId, returnInformationCallback) {
        var url = urls.GET_MARKING_CHECK_DETAILS_URL
            .concat('/')
            .concat(examinerRoleId.toString());
        var getMarkingCheckDetailsPromise = this.makeAJAXCall('GET', url);
        getMarkingCheckDetailsPromise.then(function (jsonData) {
            if (returnInformationCallback) {
                var result = JSON.parse(jsonData);
                returnInformationCallback(true, result);
            }
        }).catch(function () {
            if (returnInformationCallback) {
                returnInformationCallback(false, undefined);
            }
        });
    };
    /**
     * Makes AJAX call to fetch required recipient list and details
     * @param returnRecipientDataCallback
     */
    MarkingCheckDataService.prototype.getMarkingCheckRecipients = function (examinerRoleId, returnRecipientsDataCallback) {
        var url = urls.GET_MARKING_CHECK_RECIPIENTS_DETAILS_URL
            .concat('/')
            .concat(examinerRoleId.toString());
        var markingCheckRecipientDataPromise = this.makeAJAXCall('GET', url);
        markingCheckRecipientDataPromise.then(function (resultData) {
            if (returnRecipientsDataCallback) {
                returnRecipientsDataCallback(JSON.parse(resultData), true);
            }
        }).catch(function (json) {
            if (returnRecipientsDataCallback) {
                returnRecipientsDataCallback(json, false);
            }
        });
    };
    /**
     * Makes the ajax call and returns merk check examiners data
     * @param msgId
     */
    MarkingCheckDataService.prototype.getMarkCheckExaminers = function (msgId, returnInformationCallback) {
        var url = urls.GET_MARK_CHECK_EXAMINERS_URL
            + '/' + msgId;
        var getMarkCheckExaminersPromise = this.makeAJAXCall('GET', url);
        getMarkCheckExaminersPromise.then(function (jsonData) {
            if (returnInformationCallback) {
                var result = JSON.parse(jsonData);
                returnInformationCallback(true, result);
            }
        }).catch(function () {
            returnInformationCallback(false, undefined);
        });
    };
    return MarkingCheckDataService;
}(dataServiceBase));
var markingCheckDataService = new MarkingCheckDataService();
module.exports = markingCheckDataService;
//# sourceMappingURL=markingcheckdataservice.js.map