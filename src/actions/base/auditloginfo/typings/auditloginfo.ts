/**
 * Interface for classes that hold and process Audit log information to be sent to server
 * @interface
 */
interface AuditLogInfo {

    // Holds the name of the action needs to get logged
    loggedAction: string;

    // Holds date and time of the action happened.
    loggedDate: Date;

    // Holds audit log message.
    content: string;

    // Holds current selected mark scheme groupid
    markSchemeGroupId?: number;

    // Holds selected Mark group id
    markGroupId?: number;

    // Holds selected standardisation RIG id.
    esMarkGroupId?: number;
}
