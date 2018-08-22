/** UserOption interface */

interface UserOption {
    userOptionID: number;
    userOptionName: string;
    isOverridablebyExaminer: boolean;
    value: string;
}

export = UserOption;