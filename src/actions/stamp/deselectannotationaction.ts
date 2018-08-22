import action = require('../base/action');
import actionType = require('../base/actiontypes');

class DeSelectAnnotationAction extends action {
	/**
	 * Constructor
	 */
	constructor() {
    super(action.Source.View, actionType.DE_SELECT_ANNOTATION);
  }
}

export = DeSelectAnnotationAction;