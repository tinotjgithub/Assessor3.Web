import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');

class RefreshImageRotationSettingsAction extends action {

    /**
     * Initialise a new instance of RefreshImageRotationSettingsAction
     */
    constructor() {
        super(action.Source.View, actionType.REFRESH_IMAGE_ROTATION_SETTINGS);
    }
}
export = RefreshImageRotationSettingsAction;
