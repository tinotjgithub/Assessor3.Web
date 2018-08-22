"use strict";
var localeStore = require('../../stores/locale/localestore');
/**
 * helper class with utilty methods for formatting time.
 */
var TimeFormatHelper = (function () {
    function TimeFormatHelper() {
    }
    /**
     * Convert minutes in to hours
     * @param minutes
     */
    TimeFormatHelper.convertMinutesToHours = function (minutes) {
        var hours;
        hours = (minutes / 60);
        return Math.floor(hours);
    };
    /**
     * Convert minutes in to days
     * @param minutes
     */
    TimeFormatHelper.convertMinutesToDays = function (minutes) {
        var days;
        days = (minutes / (24 * 60));
        return Math.floor(days);
    };
    /**
     * Method to convert minutes to hours or days.
     */
    TimeFormatHelper.convertMinutesToHoursOrDays = function (minutes) {
        var formatedTime;
        var timeReturn;
        if (minutes <= 60) {
            formatedTime = '1 ' +
                localeStore.instance.TranslateText('generic.time-periods.hour-single');
        }
        else if (minutes < 1440) {
            timeReturn = TimeFormatHelper.convertMinutesToHours(minutes);
            formatedTime = timeReturn + ' ' +
                (timeReturn === 1 ? localeStore.instance.TranslateText('generic.time-periods.hour-single') :
                    localeStore.instance.TranslateText('generic.time-periods.hours-plural'));
        }
        else if (minutes >= 1440) {
            if (minutes === 1440) {
                formatedTime = '1 ' +
                    localeStore.instance.TranslateText('generic.time-periods.day-single');
            }
            else {
                timeReturn = TimeFormatHelper.convertMinutesToDays(minutes);
                formatedTime = timeReturn + ' ' +
                    (timeReturn === 1 ?
                        localeStore.instance.TranslateText('generic.time-periods.day-single') :
                        localeStore.instance.TranslateText('generic.time-periods.days-plural'));
            }
        }
        else {
            formatedTime = '';
        }
        return formatedTime;
    };
    return TimeFormatHelper;
}());
module.exports = TimeFormatHelper;
//# sourceMappingURL=timeformathelper.js.map