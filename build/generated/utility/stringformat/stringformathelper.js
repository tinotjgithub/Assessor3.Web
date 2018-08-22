"use strict";
var xmlHelper = require('../generic/xmlhelper');
var configurablecharacteristicshelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
var stringFormatKeys = require('./stringformatkeys');
var StringFormatHelper = (function () {
    function StringFormatHelper() {
    }
    /**
     * Get's the string format from the Configurable Characteristic list
     */
    StringFormatHelper.getStringFormat = function () {
        return configurablecharacteristicshelper.getCharacteristicValue('StringFormat');
    };
    /**
     * Get's the Overview QIG format from String Format
     */
    StringFormatHelper.getOverviewQIGNameFormat = function () {
        var stringFormat = StringFormatHelper.getStringFormat();
        var xmlHelperObj = new xmlHelper(stringFormat);
        return xmlHelperObj.getNodeValueByName(stringFormatKeys.OverviewQIGName);
    };
    /**
     * Get's the username format from String Format
     */
    StringFormatHelper.getUserNameFormat = function () {
        var stringFormat = StringFormatHelper.getStringFormat();
        // set the default user name format in case the format comes empty
        var userNameFormat = '{initials} {surname}';
        if (stringFormat) {
            var xmlHelperObj = new xmlHelper(stringFormat);
            userNameFormat = xmlHelperObj.getNodeValueByName(stringFormatKeys.Username);
        }
        return userNameFormat;
    };
    /**
     * Formats the string according to the pattern
     */
    StringFormatHelper.format = function (src, stringFormat) {
        if (src === undefined) {
            return undefined;
        }
        var formattedString = stringFormat;
        var stringFormatMatches = formattedString.match(/[^{]+(?=\})/g);
        for (var i = 0; i < src.length; i++) {
            formattedString = formattedString.replace(stringFormatMatches[i], src[i]);
        }
        return formattedString.replace(/{/g, '').replace(/}/g, '');
    };
    /**
     * Get the Formatted text.
     * @param markSchemeGroupName
     * @param assessmentCode
     * @param sessionName
     * @param componentId
     * @param questionPaperName
     * @param stringFormat
     */
    StringFormatHelper.formatAwardingBodyQIG = function (markSchemeGroupName, assessmentCode, sessionName, componentId, questionPaperName, assessmentName, componentName, stringFormat) {
        var formattedString = stringFormat;
        var stringFormatMatches = formattedString.match(/[^{]+(?=\})/g);
        for (var i = 0; i < stringFormatMatches.length; i++) {
            switch (stringFormatMatches[i]) {
                case stringFormatKeys.QIGName:
                    formattedString = formattedString.replace(stringFormatKeys.QIGName, markSchemeGroupName.trim());
                    break;
                case stringFormatKeys.AssessmentIdentifier:
                    formattedString = formattedString.replace(stringFormatKeys.AssessmentIdentifier, assessmentCode.trim());
                    break;
                case stringFormatKeys.SessionName:
                    formattedString = formattedString.replace(stringFormatKeys.SessionName, sessionName.trim());
                    break;
                case stringFormatKeys.ComponentIdentifier:
                    formattedString = formattedString.replace(stringFormatKeys.ComponentIdentifier, componentId.trim());
                    break;
                case stringFormatKeys.QuestionPaperName:
                    formattedString = formattedString.replace(stringFormatKeys.QuestionPaperName, questionPaperName.trim());
                    break;
                case stringFormatKeys.AssessmentName:
                    formattedString = formattedString.replace(stringFormatKeys.AssessmentName, assessmentName.trim());
                    break;
                case stringFormatKeys.ComponentName:
                    formattedString = formattedString.replace(stringFormatKeys.ComponentName, componentName.trim());
                    break;
            }
        }
        return formattedString.replace(/{/g, '').replace(/}/g, '');
    };
    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    StringFormatHelper.getFormattedExaminerName = function (initials, surname) {
        var formattedString = this.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    };
    return StringFormatHelper;
}());
module.exports = StringFormatHelper;
//# sourceMappingURL=stringformathelper.js.map