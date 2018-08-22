"use strict";
var userOptionsHelper = require('../../../utility/useroption/useroptionshelper');
var userOptionKeys = require('../../../utility/useroption/useroptionkeys');
var enums = require('../enums');
var AwardingHelper = (function () {
    function AwardingHelper() {
    }
    /**
     * Save the awarding filters in user option
     * @param componentId
     * @param session
     * @param grade
     * @param totalMark
     * @param groupByGrade
     */
    AwardingHelper.saveAwardingFilters = function (componentId, sessionId, grade, totalMark, groupByGrade, examProductId) {
        var awardingFilters = {
            'componentId': componentId,
            'sessionId': sessionId,
            'grade': grade,
            'totalMark': totalMark,
            'groupByGrade': groupByGrade,
            'examProductID': examProductId
        };
        userOptionsHelper.save(userOptionKeys.AWARDING_FILTER_SELECTION, JSON.stringify(awardingFilters));
    };
    /**
     * Method to get the user options for awarding
     */
    AwardingHelper.getUserOptionData = function (filter) {
        var awardingFilters = userOptionsHelper.getUserOptionByName(userOptionKeys.AWARDING_FILTER_SELECTION);
        if (awardingFilters !== '' && awardingFilters !== undefined) {
            var jsonAwardingFilters = JSON.parse(awardingFilters);
            switch (filter) {
                case enums.AwardingFilters.ExamSessionId:
                    return jsonAwardingFilters.sessionId.toString();
                case enums.AwardingFilters.Grade:
                    return jsonAwardingFilters.grade;
                case enums.AwardingFilters.TotalMark:
                    return jsonAwardingFilters.totalMark;
                case enums.AwardingFilters.GroupByGrade:
                    return jsonAwardingFilters.groupByGrade.toString();
                case enums.AwardingFilters.ComponentId:
                    return jsonAwardingFilters.componentId;
                case enums.AwardingFilters.examProductId:
                    return jsonAwardingFilters.examProductID;
            }
        }
        else {
            return '';
        }
    };
    return AwardingHelper;
}());
module.exports = AwardingHelper;
//# sourceMappingURL=awardinghelper.js.map