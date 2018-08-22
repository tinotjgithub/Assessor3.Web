/**
 * Discard provisional response argument
 */
interface DiscardStandardisationResponseArgument {
    rigIds: Array<Number>;
    isSendMandatoryMessage:  boolean;
    examinerRoleId: number;
    markSchemeGroupId: number;
    responseIds: Array<Number>;
    isDiscardMFPImages: boolean;
}
export = DiscardStandardisationResponseArgument;