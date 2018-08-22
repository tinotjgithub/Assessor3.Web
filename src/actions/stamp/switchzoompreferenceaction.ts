import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

class SwitchZoomPreferenceAction extends action {

  private _zoomPreference: enums.ZoomPreference;
/**
 * Creates an instance of SwitchZoomPreferenceAction.
 *
 * @memberof SwitchZoomPreferenceAction
 */
  constructor(zoomPreference: enums.ZoomPreference) {
    super(action.Source.View, actionType.SWITCH_ZOOM_PREFERENCE);
    this._zoomPreference = zoomPreference;
  }

  /**
   * zoom Preference
   *
   * @readonly
   * @type {boolean}
   * @memberof SwitchZoomPreferenceAction
   */
  public get zoomPreference(): enums.ZoomPreference {
      return this._zoomPreference;
  }
}

export = SwitchZoomPreferenceAction;
