import userOptionRecord = require('./useroptionrecord');
import userOptionData = require('./typings/useroptiondata');

class UserOptionDataRecord implements userOptionData {
    public userOptions: Immutable.List<userOptionRecord>;
    public success: boolean;
    public errorMessage: string;
    public examinerRoleId: number;
    public trackingId: string;
}

export = UserOptionDataRecord;