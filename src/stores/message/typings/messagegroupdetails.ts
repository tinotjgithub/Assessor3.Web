/**
 * Keeps the Structure of Grouped Message Items along with total messages
 */
interface MessageGroupDetails {
    // Represent the Group which have mark scheme group header and messages against that group
    MessageGroupObjects: MessageGroupData[];

    // Holds all messages for the related Tab
    messages: Immutable.List<Message>;
}