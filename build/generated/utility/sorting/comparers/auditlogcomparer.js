"use strict";
/**
 * This is a audit log comparere  class and method  (a sample comparer to test sorting frame work).
 * All compareres should implement the ComparerInterface
 * TODO - DELETE AFTER TESTING.
 */
var AuditLogComparer = (function () {
    function AuditLogComparer() {
    }
    /** Test comparer to sort the auditlog in ascending order of Logged date */
    AuditLogComparer.prototype.compare = function (a, b) {
        return (new Date(a.LoggedDate) > new Date(b.LoggedDate));
    };
    return AuditLogComparer;
}());
module.exports = AuditLogComparer;
//# sourceMappingURL=auditlogcomparer.js.map