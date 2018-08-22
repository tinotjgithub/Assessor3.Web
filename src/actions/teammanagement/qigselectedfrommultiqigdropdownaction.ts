import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import qigDetails = require('../../dataservices/teammanagement/typings/qigdetails');

class QigSelectedFromMultiQigDropDownAction extends action {
    private selectedQigDetails: qigDetails;

    constructor(qigDetail: qigDetails) {
        super(action.Source.View, actionType.QIG_SELECTED_FROM_MULI_QIG_DROP_DOWN);
        this.selectedQigDetails = qigDetail;
        this.auditLog.logContent = this.auditLog.logContent;
    }

    public get selectedQigDetail(): qigDetails {
        return this.selectedQigDetails;
    }
}

export = QigSelectedFromMultiQigDropDownAction;
