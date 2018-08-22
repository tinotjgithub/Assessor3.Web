import action = require('../base/action');
import actionType = require('../base/actiontypes');
import dataRetrievalAction = require('../base/dataretrievalaction');
import enums = require('../../components/utility/enums');
import updateESMarkGroupMarkingModeData = require('../../stores/standardisationsetup/typings/updateesmarkgroupmarkingmodedata');

/**
 * Class for ReuseRIG action
 */
class ReuseRIGAction extends action {

    private markGroupId: number;
    private markingModeId: enums.MarkingMode;

    constructor(markingModeId: enums.MarkingMode, markGroupId: number) {
        super(action.Source.View, actionType.REUSE_RIG_ACTION);
        this.markGroupId = markGroupId;
        this.markingModeId = markingModeId;
    }

    /**
     * Get Reused Mark group id
     */
    public get getReusedMarkGroupId() {
        return this.markGroupId;
    }

    /**
     * Get Reused response marking mode id
     */
    public get getReusedMarkingModeId() {
        return this.markingModeId;
    }
}
export = ReuseRIGAction;