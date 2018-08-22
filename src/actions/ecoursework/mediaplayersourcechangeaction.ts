import action = require('../base/action');
import actionType = require('../base/actiontypes');
import enums = require('../../components/utility/enums');

/**
 * Action class for changing source type for media player
 */
class MediaPlayerSourceChangeAction extends action {

    // Holds the source type
    private _sourceType: enums.MediaSourceType;

    // Holds Page id.
    private _docPageID: number;

    // Holds Candidate script Id.
    private _candidateScriptId: number;

    /**
     * constructor
     */
    constructor(docPageID: number, candidateScriptId: number, playerMode: enums.MediaSourceType) {
        super(action.Source.View, actionType.MEDIA_PLAYER_SOURCE_CHANGE_ACTION);
        this._sourceType = playerMode;
        this._docPageID = docPageID;
        this._candidateScriptId = candidateScriptId;
    }

    /**
     * Returns current source type
     * @returns
     */
    public get sourceType(): enums.MediaSourceType {
        return this._sourceType;
    }

    /**
     * Returns page id of selected file.
     * @returns
     */
    public get docPageID(): number {
        return this._docPageID;
    }

    /**
     * Returns candidate script id.
     * @returns
     */
    public get candidateScriptId(): number {
        return this._candidateScriptId;
    }
}

export = MediaPlayerSourceChangeAction;