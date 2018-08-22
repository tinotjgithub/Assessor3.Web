import auditLogInfoArgument = require('../../../dataservices/logging/auditloginfoargument');
import comparerInterface = require('../sortbase/comparerinterface');

/**
 * This is a audit log comparere  class and method  (a sample comparer to test sorting frame work).
 * All compareres should implement the ComparerInterface
 * TODO - DELETE AFTER TESTING.
 */
class AuditLogComparer implements comparerInterface {
    /** Test comparer to sort the auditlog in ascending order of Logged date */
    public compare(a: auditLogInfoArgument, b: auditLogInfoArgument) {
        return (new Date(a.LoggedDate) > new Date(b.LoggedDate));
    }
}

export = AuditLogComparer;