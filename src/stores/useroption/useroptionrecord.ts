import userOption = require('./typings/useroption');

/** UserOptionData */
class UserOptionRecord implements userOption {
    public userOptionID: number;
    public userOptionName: string;
    public isOverridablebyExaminer: boolean;
    public value: string;
}

export = UserOptionRecord;