import xmlHelper = require('../generic/xmlhelper');
import configurablecharacteristicshelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import qiginformation = require('../../stores/qigselector/typings/qigsummary');
import stringFormatKeys = require('./stringformatkeys');

class StringFormatHelper {
    /**
     * Get's the string format from the Configurable Characteristic list
     */
    public static getStringFormat() {
        return configurablecharacteristicshelper.getCharacteristicValue('StringFormat');
    }

    /**
     * Get's the Overview QIG format from String Format
     */
    public static getOverviewQIGNameFormat() {
        let stringFormat = StringFormatHelper.getStringFormat();
        let xmlHelperObj = new xmlHelper(stringFormat);

        return xmlHelperObj.getNodeValueByName(stringFormatKeys.OverviewQIGName);
    }

    /**
     * Get's the username format from String Format
     */
    public static getUserNameFormat(): string {
        let stringFormat = StringFormatHelper.getStringFormat();
        // set the default user name format in case the format comes empty
        let userNameFormat: string = '{initials} {surname}';
        if (stringFormat) {
            let xmlHelperObj = new xmlHelper(stringFormat);
            userNameFormat = xmlHelperObj.getNodeValueByName(stringFormatKeys.Username);
        }
        return userNameFormat;
    }

    /**
     * Formats the string according to the pattern
     */
    public static format(src: string[], stringFormat: string) {
        if (src === undefined) {
            return undefined;
        }

        let formattedString = stringFormat;
        let stringFormatMatches = formattedString.match(/[^{]+(?=\})/g);

        for (let i = 0; i < src.length; i++) {
            formattedString = formattedString.replace(stringFormatMatches[i], src[i]);
        }

        return formattedString.replace(/{/g, '').replace(/}/g, '');
    }

    /**
     * Get the Formatted text.
     * @param markSchemeGroupName
     * @param assessmentCode
     * @param sessionName
     * @param componentId
     * @param questionPaperName
     * @param stringFormat
     */
    public static formatAwardingBodyQIG
        (markSchemeGroupName: string,
        assessmentCode: string,
        sessionName: string,
        componentId: string,
        questionPaperName: string,
        assessmentName: string,
        componentName: string,
        stringFormat: string) {

        let formattedString = stringFormat;
        let stringFormatMatches = formattedString.match(/[^{]+(?=\})/g);

        for (let i = 0; i < stringFormatMatches.length; i++) {
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
    }

    /**
     * Returns the formatted examiner name
     * @param initials
     * @param surname
     */
    public static getFormattedExaminerName(initials: string, surname: string): string {
        let formattedString: string = this.getUserNameFormat().toLowerCase();
        formattedString = formattedString.replace('{initials}', initials);
        formattedString = formattedString.replace('{surname}', surname);
        return formattedString;
    }

    /**
     * Returns the formatted Awarding Component Name
     * @param assessmentIdentifier
     * @param componentIdentifier
     */
    public static getFormattedAwardingComponentName(assessmentIdentifier: string, componentIdentifier: string): string {

        // set the default awarding component format in case the format comes empty
        let awardingComponentFormat: string = '{assessmentidentifier}';

        let stringFormatCC = StringFormatHelper.getStringFormat();

        if (stringFormatCC) {

            let xmlHelperObj = new xmlHelper(stringFormatCC);
            let componentNameFormat: string = xmlHelperObj.getNodeValueByName(stringFormatKeys.AwardingComponentName);

            if (componentNameFormat) {
                awardingComponentFormat = componentNameFormat.toLowerCase();
            }
        }

        awardingComponentFormat = awardingComponentFormat.replace('{assessmentidentifier}', assessmentIdentifier);
        awardingComponentFormat = awardingComponentFormat.replace('{componentidentifier}', componentIdentifier);

        return awardingComponentFormat;
    }
}

export = StringFormatHelper;