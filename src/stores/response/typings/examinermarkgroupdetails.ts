import examinerMarksAndAnnotation = require('./examinermarksandannotation');
import examinerRoleMarkGroup = require('./examinerrolemarkgroup');
import examinerDetails = require('./examinerdetails');

interface ExaminerMarkGroupDetails {
    AllMarksAndAnnotations: Immutable.List<examinerMarksAndAnnotation>;
    ExaminerDetails: Immutable.Map<examinerRoleMarkGroup, examinerDetails>;
    StartWithEmptyMarkGroup: boolean;
    ShowPreviousMarks: boolean;
    MarkerMessage?: string;
    ShowMarkerMessage: boolean;
}
export = ExaminerMarkGroupDetails;