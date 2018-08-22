/**
 * Interface for classes that hold notification data
 * @interface
 */
interface NotificationInfo {
    // Holds the number of the unread user message count 
    getExceptionMessageCount: number;
    getUnreadMessageCount: number;
    getUnreadMandatoryMessageCount: number;
    setUnreadMandatoryMessageCount: number;
    setUnreadMessageCount: number;
    setExceptionMessageCount: number;
}
