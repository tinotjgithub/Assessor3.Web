import UserOption = require('./useroption');

/** UserOptionData */
interface UserOptionData {
    userOptions: Immutable.List<UserOption>;
    success: boolean;
    errorMessage: string;
    examinerRoleId: number;
    trackingId: string;
}

export = UserOptionData;