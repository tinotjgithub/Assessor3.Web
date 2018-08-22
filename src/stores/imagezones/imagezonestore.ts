import storeBase = require('../base/storebase');
import dispatcher = require('../../app/dispatcher');
import action = require('../../actions/base/action');
import actionType = require('../../actions/base/actiontypes');
import imageZoneAction = require('../../actions/imagezones/imagezonesaction');
import scriptZoneAction = require('../../actions/script/candidateebookmarkimagezoneretrievalaction');
import immutable = require('immutable');
import candidateEbookMarkImageZoneCollection = require('../script/typings/candidateebookmarkimagezonecollection');
import responseStore = require('../response/responsestore');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');

/**
 * Class for Image zone store
 */
class ImageZoneStore extends storeBase {

    // Image zone list.
    private _imageZoneList: ImageZoneList;

    // Ebookmarking Image Zone Collection
    private _candidateScriptImageZoneCollection: immutable.Map<number, immutable.List<ImageZone>>;

    // ImageZoneloaded event name.
    public static IMAGEZONE_LOADED_EVENT = 'ImageZoneLoadedEvent';

    // EbookMarking ImageZone loaded event name.
    public static EBOOK_IMAGEZONE_LOADED_EVENT = 'EbookMarkingImageZoneLoadedEvent';

    /**
     * @Constructor
     */
    constructor() {
        super();
        this._candidateScriptImageZoneCollection = immutable.Map<number, immutable.List<ImageZone>>();
        this.dispatchToken = dispatcher.register((action: action) => {

            if (action.actionType === actionType.IMAGEZONE_LOAD) {
                let actionResult = (action as imageZoneAction);

                if (actionResult.success) {
                    actionResult.imageZoneList.imageZones.map((x: ImageZone) => {
                        x.questionPaperId = actionResult.questionPaperId;
                    });
                    if (this._imageZoneList) {
                        // we have appended the image zone collection for multi QP                        
                        actionResult.imageZoneList.imageZones.map((x: ImageZone) => {
                            let requestedItemCount: number = this._imageZoneList.imageZones.
                            filter((y: ImageZone) => y.uniqueId === x.uniqueId
                                && y.imageClusterId === x.imageClusterId).count();
                            if (requestedItemCount === 0) {
                                this._imageZoneList.imageZones = this._imageZoneList.imageZones.push(x);
                            }
                        });
                    } else {
                        this._imageZoneList = actionResult.imageZoneList;
                    }
                } else {

                    // If a new qig has been selected and call has been failed, clear the previous selection
                    this._imageZoneList = null;
                }

                this.emit(ImageZoneStore.IMAGEZONE_LOADED_EVENT);
            } else if (action.actionType === actionType.GET_EBOOKMARK_IMAGE_ZONE) {
                // Check whetehr action to load ebookmarking image zones
                let actionResult = (action as scriptZoneAction);
                if (actionResult.success) {

                    let result = actionResult.getCandidateScriptEBookMarkImageZoneCollection;
                    result.candidateScriptImageZoneCollection.map((x: ImageZone) => {
                        x.questionPaperId = actionResult.questionPaperId;
                    });

                    // if success, get the image zone collection
                    this._candidateScriptImageZoneCollection =
                        this._candidateScriptImageZoneCollection.set(result.candidateScriptId,
                            result.candidateScriptImageZoneCollection);
                }

                this.emit(ImageZoneStore.EBOOK_IMAGEZONE_LOADED_EVENT);
            }
        });
    }

    /**
     * Get the image zone list against the current qig
     * @returns
     */
    public get imageZoneList(): ImageZoneList {
        return this._imageZoneList;
    }

    /**
     * Get the image zone list against the current QIG
     * @returns
     */
    public get candidateScriptImageZoneList(): immutable.Map<number, immutable.List<ImageZone>> {
        return this._candidateScriptImageZoneCollection;
    }

    /**
     * Get the image zone list against the current script
     * @returns
     */
    public get currentCandidateScriptImageZone(): immutable.List<ImageZone> {
        let openedResponseDetails = markerOperationModeFactory.operationMode.
            openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
        if (openedResponseDetails) {
            return this._candidateScriptImageZoneCollection.get(openedResponseDetails.candidateScriptId);
        }
    }
}

let instance = new ImageZoneStore();
export = { ImageZoneStore, instance };