interface Permission {
    complete?: boolean;
    editUnclassifiedNotes?: boolean;
    editClassifiedNotes?: boolean;
    editDefinitives?: boolean;
    viewDefinitives?: boolean;
    classify?: boolean;
    declassify?: boolean;
    multiQIGProvisionals?: boolean;
    reuseResponses?: boolean;
    viewCommonProvisionalAvailableResponses?: boolean;
}

export = Permission;