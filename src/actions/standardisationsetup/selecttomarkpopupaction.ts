import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/** 
 * Select to mark button click launches a popup to 'Mark now' and 'Mark later'
 */
class SelecttomarkpopupAction extends action {
	private _popupType: enums.PopUpType;
	private _provisionalQigDetailsData: Immutable.List<ProvisionalQIGDetailsReturn>;

  constructor(popupType: enums.PopUpType, provisionalQigDetailsData: Immutable.List<ProvisionalQIGDetailsReturn>) {
    super(action.Source.View, actionType.STANDARDISATION_SELECTTOMARK_POPUP);
	this._popupType = popupType;
	this._provisionalQigDetailsData = provisionalQigDetailsData;
  }

/**
 * popup type
 */
  public get popupType() : enums.PopUpType {
    return this._popupType;
  }

/**
 * provisional qig details.
 */
  public get provisionalQigDetailsData(): Immutable.List<ProvisionalQIGDetailsReturn> {
	  return this._provisionalQigDetailsData;
  }

}

export = SelecttomarkpopupAction;
