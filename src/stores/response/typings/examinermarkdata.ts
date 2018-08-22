import examinerMarkGroupDetails = require('./examinermarkgroupdetails');
import examinerRoleMarkGroupDetails = require('./examinerrolemarkgroupdetails');
import enums = require('../../../components/utility/enums');

/** ExaminerMarkData */
interface ExaminerMarkData {
    examinerMarkGroupDetails: Immutable.Map<number, examinerMarkGroupDetails>;
    wholeResponseQIGToRIGMapping: Immutable.Map<number, examinerRoleMarkGroupDetails>;
    success: boolean;
    errorMessage: string;
    IsAwaitingToBeQueued: boolean;
    IsBackGroundSave: boolean;
    errorType: enums.SaveMarksAndAnnotationErrorCode;
}

export = ExaminerMarkData;