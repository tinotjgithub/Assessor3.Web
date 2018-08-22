import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class MarkSchemeHeaderDropDownAction extends action {

    private _headerDropDownOpen: boolean;

    /**
     * Constructor
     * @param headerDropDownOpen
     */
    constructor(headerDropDownOpen: boolean) {
        super(action.Source.View, actionType.MARK_SCHEME_HEADER_DROP_DOWN_ACTION);
                this.auditLog.logContent = this.auditLog.logContent.replace('{0}', headerDropDownOpen ?
                                                                headerDropDownOpen.toString() : 'undefined');
        this._headerDropDownOpen = headerDropDownOpen;
    }

    public get isheaderDropDownOpen(): boolean {
        return this._headerDropDownOpen;
    }
}
    export = MarkSchemeHeaderDropDownAction;