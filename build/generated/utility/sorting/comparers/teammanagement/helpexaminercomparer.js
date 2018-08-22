"use strict";
var loginSession = require('../../../../app/loginsession');
/**
 * This comparer is used for default sorting in Help Examiners Grid.
 */
var HelpExaminerComparer = (function () {
    function HelpExaminerComparer() {
    }
    /**
     * By default examiners locked by logged in examiner shall be displayed first, with highest lock duration on top.
     * Sort order of the remaining examiners will be based on Time in current state, with highest time in current state column on top
     */
    HelpExaminerComparer.prototype.compare = function (a, b) {
        // if a is locked by current examiner or b is locked by current examiner
        if (a.lockedByExaminerId === loginSession.EXAMINER_ID || b.lockedByExaminerId === loginSession.EXAMINER_ID) {
            // if a and b are locked by current examiner then sort items with locked time.
            if (a.lockedByExaminerId === loginSession.EXAMINER_ID && b.lockedByExaminerId === loginSession.EXAMINER_ID) {
                if (new Date(a.lockTimeStamp.toString()) > new Date(b.lockTimeStamp.toString())) {
                    return 1;
                }
                else if (new Date(a.lockTimeStamp.toString()) < new Date(b.lockTimeStamp.toString())) {
                    return -1;
                }
            }
            else if (a.lockedByExaminerId === loginSession.EXAMINER_ID) {
                return -1;
            }
            else {
                return 1;
            }
        }
        else if (new Date(a.workflowStateTimeStamp.toString()) > new Date(b.workflowStateTimeStamp.toString())) {
            return 1;
        }
        else if (new Date(a.workflowStateTimeStamp.toString()) < new Date(b.workflowStateTimeStamp.toString())) {
            return -1;
        }
        return 0;
    };
    return HelpExaminerComparer;
}());
module.exports = HelpExaminerComparer;
//# sourceMappingURL=helpexaminercomparer.js.map