import action = require('../base/action');
import actionAuditLogInfo = require('../base/auditloginfo/actionauditloginfo');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');
import mousePosition = require('../../stores/response/mouseposition');

class UpdateMousePositionAction extends action {

    private xPosition: number;
    private yPosition: number;

    /**
     * Constructor UpdateMousePositionAction
     * @param xPosition
     * @param yPosition
     */
    constructor(xPosition: number, yPosition: number) {
        super(action.Source.View, actionType.MOUSE_POSITION_UPDATE);
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.setTheActionAsNotToBeLogged();
    }

    public get mousePosition(): mousePosition {
        return new mousePosition(this.xPosition, this.yPosition);
    }
}

export = UpdateMousePositionAction;