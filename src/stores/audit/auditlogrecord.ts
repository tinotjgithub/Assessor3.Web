/// <reference path='../../../typings/userdefinedtypings/immutable/immutable-overrides.d.ts' />

import Immutable = require('immutable');

/**
 * Definition for audit log info record
 */
export const auditRecord = Immutable.Record<AuditLogInfo>({
    loggedAction: '',
    loggedDate: new Date(),
    content: '',
    markSchemeGroupId: 0,
    markGroupId: 0,
    esMarkGroupId: 0
}, 'auditLog');
