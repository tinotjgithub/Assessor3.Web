
interface MarkingCheckRecipient {
    examinerId: number;
    isPrincipalExaminer: boolean;
    surname: string;
    initials: string;
    fullname: string;
    approvalStatus: number;
    hasActiveMarkingCheck: boolean;
    isEligibleForMarkingCheck: boolean;
    isChecked: boolean;
}