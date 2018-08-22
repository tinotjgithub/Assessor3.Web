import localeStore = require('../../stores/locale/localestore');
/**
 * helper class with utilty methods for formatting time.
 */
class TimeFormatHelper {
    /**
     * Convert minutes in to hours
     * @param minutes
     */
    public static convertMinutesToHours(minutes: number): number {
        let hours: number;
        hours = (minutes / 60);
        return Math.floor(hours);
    }

    /**
     * Convert minutes in to days
     * @param minutes
     */
    public static convertMinutesToDays(minutes: number): number {
        let days: number;
        days = (minutes / (24 * 60));
        return Math.floor(days);
    }

    /**
     * Method to convert minutes to hours or days.
     */
    public static convertMinutesToHoursOrDays(minutes: number): string {
        let formatedTime: string;
        let timeReturn: number;
        if (minutes <= 60) {
            formatedTime = '1 ' +
                localeStore.instance.TranslateText('generic.time-periods.hour-single');
        } else if (minutes < 1440) {
            timeReturn = TimeFormatHelper.convertMinutesToHours(minutes);
            formatedTime = timeReturn + ' ' +
                (timeReturn === 1 ? localeStore.instance.TranslateText('generic.time-periods.hour-single') :
                    localeStore.instance.TranslateText('generic.time-periods.hours-plural'));
        } else if (minutes >= 1440) {
            if (minutes === 1440) {
                formatedTime = '1 ' +
                    localeStore.instance.TranslateText('generic.time-periods.day-single');
            } else {
                timeReturn = TimeFormatHelper.convertMinutesToDays(minutes);
                formatedTime = timeReturn + ' ' +
                    (timeReturn === 1 ?
                        localeStore.instance.TranslateText('generic.time-periods.day-single') :
                        localeStore.instance.TranslateText('generic.time-periods.days-plural'));
            }
        } else {
            formatedTime = '';
        }
        return formatedTime;
    }
}

export = TimeFormatHelper;