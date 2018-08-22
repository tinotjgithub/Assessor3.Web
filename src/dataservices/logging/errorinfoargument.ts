/// <reference path='errorinfoargumentbase.ts' />
/// <reference path='auditloginfoargument.ts' />

import AuditLogInfoArgument = require('./auditloginfoargument');
import ErrorInfoArgumentBase = require('./errorinfoargumentbase');
import Immutable = require('immutable');

class ErrorInfoArgument extends ErrorInfoArgumentBase {
    /* tslint:disable:variable-name */

    public Reason: string;
    public AuditLogInfo: Immutable.List<AuditLogInfoArgument>;

    /* tslint:disable:variable-name */
}

export = ErrorInfoArgument;