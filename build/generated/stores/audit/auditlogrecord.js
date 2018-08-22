/// <reference path='../../../typings/userdefinedtypings/immutable/immutable-overrides.d.ts' />
"use strict";
var Immutable = require('immutable');
/**
 * Definition for audit log info record
 */
exports.auditRecord = Immutable.Record({
    loggedAction: '',
    loggedDate: new Date(),
    content: '',
    markSchemeGroupId: 0,
    markGroupId: 0,
    esMarkGroupId: 0
}, 'auditLog');
//# sourceMappingURL=auditlogrecord.js.map