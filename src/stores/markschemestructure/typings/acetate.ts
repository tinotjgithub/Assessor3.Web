interface Acetate {
    acetateId?: number;
    acetateData: AcetateData;
    examinerRoleId: number;
    itemId: number;
    shared: boolean;
    clientToken: string;
    markingOperation: number;
    imageLinkingData?: any;
    isSaveInProgress: boolean;
    updateOn: number;
}