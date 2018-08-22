import ccHelper = require('./configurablecharacteristicshelper');
import ccNames = require('./configurablecharacteristicsnames');

/**
 *  Class for specifying CC values
 */
class ConfigurableCharacteristicsValues {

   /**
    * Return true if ExaminerCenterExclusivity CC is on else return false.
    */
    public static get examinerCentreExclusivity(): boolean {
        return ccHelper.getCharacteristicValue(ccNames.ExaminerCentreExclusivity).toLowerCase() === 'true';
    }

   /**
    * get the value of senior examiner pool cc.
    */
    public static seniorExaminerPool(markSchemeGroupId: number): boolean {
        return ccHelper.getCharacteristicValue(ccNames.SeniorExaminerPool, markSchemeGroupId).toLowerCase() === 'true';
    }

    /**
     * Get the value of the request marking check
     * @type {boolean}
     */
    public static requestMarkingCheck(markSchemeGroupdId: number): boolean {
        return ccHelper.getCharacteristicValue(ccNames.RequestMarkingCheck, markSchemeGroupdId).toLowerCase() === 'true';
    }

    /* return true if the component is e-course work */
    public static get isECourseworkComponent(): boolean {
        return ccHelper.getCharacteristicValue(ccNames.ECoursework).toLowerCase() === 'true';
    }

    /**
     * Returns supervisor review comments cc value
     * @readonly
     * @static
     * @type {boolean}
     * @memberof ConfigurableCharacteristicsValues
     */
    public static get supervisorReviewComments() : boolean {
        return ccHelper.getCharacteristicValue(ccNames.SupervisorReviewComments).toLowerCase() === 'true';
    }

    /**
     * get the value of SEPQuestionPaperManagement cc.
     */
    public static get sepQuestionPaperManagement(): boolean {
        return ccHelper.getCharacteristicValue(ccNames.SEPQuestionPaperManagement).toLowerCase() === 'true';
    }

}

export = ConfigurableCharacteristicsValues;