import action = require('../base/action');
import actionType = require('../base/actiontypes');

/**
 * Action class to save the user preference for media player
 */
class MediaPlayerUserPreferenceSaveAction extends action {

    // Holds the last played volume for the media file
    private _lastPlayedVolume: number;

    // Holds the last played time for the media file
    private _lastPlayedMediaTime: number;

    // Holds the Doc page id of the file for which preference are saved.
    private _docPageID: number;

    // Constructor
    constructor(docPageId: number, lastPlayedVolume: number, lastPlayedMediaTime: number) {

        super(action.Source.View, actionType.MEDIA_PLAYER_USER_PREFERENCE_SAVE_ACTION);

        this._docPageID = docPageId;

        this._lastPlayedVolume = lastPlayedVolume;

        this._lastPlayedMediaTime = lastPlayedMediaTime;
    }

    /**
     * Returns file's last played volume
     * @returns
     */
    public get lastPlayedVolume(): number {
        return this._lastPlayedVolume;
    }

    /**
     * Returns file's last played media time
     * @returns
     */
    public get lastPlayedMediaTime(): number {
        return this._lastPlayedMediaTime;
    }

    /**
     * Returns page id of selected file.
     * @returns
     */
    public get docPageID(): number {
        return this._docPageID;
    }
}

export = MediaPlayerUserPreferenceSaveAction;