import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class for pausing the media player when required
 */
class MediaPlayerPauseAction extends action {

    /**
     * constructor
     */
    constructor() {
        super(action.Source.View, actionType.MEDIA_PLAYER_PAUSE_ACTION);
    }
}

export = MediaPlayerPauseAction;