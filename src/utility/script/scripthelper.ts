import markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
import imageZoneStore = require('../../stores/imagezones/imagezonestore');
import Immutable = require('immutable');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import scriptStore = require('../../stores/script/scriptstore');
import URLS = require('../../dataservices/base/urls');
declare let config: any;
import markScheme = require('../../stores/markschemestructure/typings/markscheme');
import item = require('../../stores/markschemestructure/typings/item');
import cluster = require('../../stores/markschemestructure/typings/cluster');
import answerItem = require('../../stores/markschemestructure/typings/answeritem');
import qigStore = require('../../stores/qigselector/qigstore');
import sortHelper = require('../sorting/sorthelper');
import comparerList = require('../sorting/sortbase/comparerlist');
import markingStore = require('../../stores/marking/markingstore');
import examinerAnnotation = require('../../stores/response/typings/annotation');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import pagelinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
import annotation = require('../../stores/response/typings/annotation');
import annotationHelper = require('../../components/utility/annotation/annotationhelper');
import markinghelper = require('../markscheme/markinghelper');
import treeviewDataHelper = require('../treeviewhelpers/treeviewdatahelper');
import treeviewitem = require('../../stores/markschemestructure/typings/treeviewitem');
import enums = require('../../components/utility/enums');
import pageLinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
import markingHelper = require('../markscheme/markinghelper');
import configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
import awardingHelper = require('../../components/utility/awarding/awardinghelper');

/**
 * Helper class for the Scripts in response screen
 */
class ScriptHelper {
    private imageZones: Immutable.List<ImageZone> = Immutable.List<ImageZone>();
    private currentImageZones: Immutable.List<ImageZone>;
    private responseData: ResponseBase;
    private imageClusterId: number;
    private markSchemeId: number;
    private treeViewHelper: treeviewDataHelper;
    private _doApplyLinkingScenarios: boolean;
    private _zoneCollectionDetails: Immutable.List<ImageZone>[] = [];
    private suppressedPageNos: Array<number> = new Array<number>();
    private candidateScriptId: number;
    private documentId: number;
    private responseItemGroups: Immutable.List<ResponseItemGroup>;

    /**
     * Constructor for the Script Helper class
     */
    constructor() {
        this.treeViewHelper = new treeviewDataHelper();
        let selectedAwardingCandidateData: AwardingCandidateDetails;

        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            selectedAwardingCandidateData = awardingHelper.awardingSelectedCandidateData();
            this.responseItemGroups = selectedAwardingCandidateData.responseItemGroups;
            this.candidateScriptId = this.responseItemGroups[0].candidateScriptId;
            this.documentId = this.responseItemGroups[0].documentID;
            let previousScriptId;
            selectedAwardingCandidateData.responseItemGroups.map((x: ResponseItemGroup) => {
                // restricting to create the image url if same candidate script id comes for the QIG
                if (previousScriptId !== x.candidateScriptId) {
                    this.updateSupressedPageNo(x.candidateScriptId);
                    previousScriptId = x.candidateScriptId;
                }
            });
        } else {
            let candidateScriptId: number;
            if (standardisationSetupStore.instance.isSelectResponsesWorklist) {
                candidateScriptId = standardisationSetupStore.instance.selectedResponseId;
                this.responseData = standardisationSetupStore.instance.fetchSelectedScriptDetails(candidateScriptId);
            } else if (responseStore.instance.selectedDisplayId) {
                this.responseData = markerOperationModeFactory.operationMode.openedResponseDetails
                    (responseStore.instance.selectedDisplayId.toString());
                candidateScriptId = Number(this.responseData.candidateScriptId);
            }

            this.updateSupressedPageNo(candidateScriptId);
        }

        // Populate Imagezone Collection
        this.resetImageZoneCollection();

        this.imageClusterId = 0;
        this.markSchemeId = 0;
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            if (markSchemeStructureStore.instance.markSchemeStructure.clusters) {
                let cluster =
                    markSchemeStructureStore.instance.markSchemeStructure.clusters
                    [qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId];
                this.getFirstImageCluster(cluster);
            }
        }
        this._doApplyLinkingScenarios = false;
    }

    /**
     * Populate Imagezone Collection
     */
    public resetImageZoneCollection() {
        /*for ebookmarking the imageZoneList collection would be be null and execulte the else batch with currentCandidateScriptImageZone*/
        let imageZonesCollection: Array<ImageZone> = new Array<ImageZone>();
        if (imageZoneStore.instance.imageZoneList != null) {
            // Excluding  suppressed images from the imagezone collection.
            // Barcode suppression rule can apply for zones
            imageZoneStore.instance.imageZoneList.imageZones.forEach((imagezone: ImageZone) => {
                if (this.suppressedPageNos.indexOf(imagezone.pageNo) === -1) {
                    imageZonesCollection.push(imagezone);
                }
            });
        } else if (imageZoneStore.instance.currentCandidateScriptImageZone != null) {
            // Excluding  suppressed images from the imagezone collection.
            imageZoneStore.instance.currentCandidateScriptImageZone.forEach((imagezone: ImageZone) => {
                if (this.suppressedPageNos.indexOf(imagezone.pageNo) === -1) {
                    imageZonesCollection.push(imagezone);
                }
            });
        }
        this.imageZones = Immutable.List<ImageZone>(imageZonesCollection);
    }

    /*
     * Get the current response data
     */
    public get getResponseData(): any {
        return this.responseData;
    }

    /**
     * Get the first mark scheme
     */
    public getFirstImageCluster(cluster: cluster): void {
        let that = this;

        if (cluster.answerItems != null) {

            // Loop through each answer item and find the image cluser id
            cluster.answerItems.map(function (item: answerItem) {
                if (that.imageClusterId === 0 && item.imageClusterId > 0) {
                    that.imageClusterId = item.imageClusterId;

                    // as we need to get the first markable item retur if we found already.
                    return;
                }
            });
        }

        // If none of the markable item found, dig in to deeep further.
        if (cluster.childClusters != null) {
            cluster.childClusters.map(function (item: cluster) {
                // If image cluster id foud retrun
                if (that.imageClusterId > 0) {
                    return;
                }

                that.getFirstImageCluster(item);
            });
        }
    }

    /**
     *  method to update the suppressed page number
     * @param candidateScriptId
     */
    private updateSupressedPageNo(candidateScriptId: number) {
        // Finding the suppressed image zones page number's
        let candidateScriptDetail = (scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId));
        if (candidateScriptDetail) {
            let scriptDetails = candidateScriptDetail.forEach((scriptImage: ScriptImage) => {
                if (scriptImage.isSuppressed) {
                    this.suppressedPageNos.push(scriptImage.pageNumber);
                }
            });
        }
    }

    /**
     * The image zones for the current items.
     */
    public get currentImageZoneCollection() {
        return this.currentImageZones;
    }

    private get isEbookMarking() {
        return (configurableCharacteristicsHelper.getExamSessionCCValue
            (configurableCharacteristicsNames.eBookmarking,
            qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
            .toLowerCase() === 'true');
    }

    /**
     * get the image zones collection to render
     */
    public getImageZonesCollectionForRender() {

        if (this.imageClusterId > 0) {
            this.currentImageZones = this.getZoneDetails(this.imageClusterId);
        } else if (this.isEbookMarking === true && this.markSchemeId > 0) {
            this.currentImageZones = this.getEBookMarkingZones(this.markSchemeId);
        } else {
            return null;
        }

        let imageZonesCollection: Immutable.List<ImageZone>[] = [];

        // Sorting the currentImageZones in increasing outputPageNo order.
        let sortedCurrentImageZones = this.currentImageZones.sort((zoneA: ImageZone, zoneB: ImageZone) => {
            return zoneA.outputPageNo - zoneB.outputPageNo;
        });

        // Group by output page.
        // Iterate through group.
        // sort a group accordint to imageData.SequenceNo
        // If group has single image then create <SingleImageZone/>, else <StitchedImageZone>
        let groupedAccordingToOutputPageNo = sortedCurrentImageZones.groupBy((imageZone: ImageZone) => {
            /* grouping based on outputpagenumber is not needed for ebookmarking*/
            return ((this.isEbookMarking === true) ? 0 : imageZone.outputPageNo);
        });

        let keys = groupedAccordingToOutputPageNo.keySeq();
        groupedAccordingToOutputPageNo.map((imageZones: Immutable.List<ImageZone>) => {
            if (imageZones.count() > 1) {
                let sortedImageZones = imageZones.sort((imageZoneA: ImageZone, imageZoneB: ImageZone) => {
                    return imageZoneA.sequence - imageZoneB.sequence;
                }).toList();
                imageZonesCollection.push(sortedImageZones);
            } else {
                imageZonesCollection.push(imageZones);
            }
        });

        return imageZonesCollection;
    }

    /**
     * method helps to fetch the script images
     * @param imageZonesCollection
     */
    public fetchScriptImages(imageZonesCollection: Immutable.List<ImageZone>[]) {
        if (imageZonesCollection != null) {
            let imagesToRender: string[][] = [];
            let candidateScriptId: number = 0;
            let images: string[] = [];
            if (markerOperationModeFactory.operationMode.isAwardingMode) {
                let previousScriptId;
                this.responseItemGroups.map((x: ResponseItemGroup) => {
                    var that = this;
                    let renderedImages: string[][] = [];
                    // filter the image zone for the selected question paper id
                    let filteredImageZone = imageZonesCollection.map((y: any) => {
                        return y.filter((z: ImageZone) => z.questionPaperId === x.questionPaperId);
                    });
                    // restricting to create the image url if same candidate script id comes for the QIG
                    if (previousScriptId !== x.candidateScriptId) {
                        imagesToRender = that.generateImagesToRender(filteredImageZone,
                            x.candidateScriptId,
                            imagesToRender,
                            x.documentId,
                            x.markSchemeGroupId, );
                        previousScriptId = x.candidateScriptId;
                    }
                });
            } else {
                imagesToRender = [];
                let generatedImages: string[] = [];
                candidateScriptId = Number(this.responseData.candidateScriptId);
                var that = this;
                imagesToRender = that.generateImagesToRender(imageZonesCollection,
                    candidateScriptId, imagesToRender);
            }

            return imagesToRender;
        }
    }

    /**
     * return linked pages
     * @param imgesToRenderBasedOnZones
     * @param pagesLinkedByPreviousMarkers
     */
    public fetchLinkedScriptImages(imgesToRenderBasedOnZones: string[][], pagesLinkedByPreviousMarkers: number[]) {
        let imagesToRender: string[][] = [];
        let currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        let filteredLinkAnnotations;
        let candidateScriptId: number;
        let selectedAwardingCandidateData: AwardingCandidateDetails;

        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            candidateScriptId = this.candidateScriptId;
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
        }
        if (currentQuestionItemInfo && currentQuestionItemInfo.uniqueId) {
            // get all the linked pages
            let linkedAnnotations = pagelinkHelper.getAllLinkedItems();
            let nodes = this.treeViewHelper.treeViewItem();
            let parentNodeOfCurrentQuestionItem = markinghelper.getMarkschemeParentNodeDetails
                (nodes, currentQuestionItemInfo.uniqueId, true);
            if (parentNodeOfCurrentQuestionItem.treeViewItemList.size >= 2) {
                let parentNodeOfCurrentQuestionItemUniqueId = parentNodeOfCurrentQuestionItem.treeViewItemList.get(0).uniqueId;
                filteredLinkAnnotations = linkedAnnotations.filter(function (item: annotation, pos: number, self) {
                    return item.markSchemeId === parentNodeOfCurrentQuestionItemUniqueId;
                });
            } else {
                filteredLinkAnnotations = linkedAnnotations.filter(function (item: annotation, pos: number, self) {
                    return item.markSchemeId === currentQuestionItemInfo.uniqueId;
                });
            }

            if (filteredLinkAnnotations && filteredLinkAnnotations !== null) {
                filteredLinkAnnotations.map((annotation: annotation) => {
                    let scriptDetails = scriptStore.instance.getScriptDetails
                        (Number(candidateScriptId), annotation.pageNo);
                    let images: string[] = [];
                    let isLinkedPageInImagesToRender = imgesToRenderBasedOnZones.filter(function (imageCollection: string[]) {
                        // we only add the linked pages if its not included in the image to render by zones
                        let isLinked = false;
                        imageCollection.map((image: string) => {
                            let pageNo = image.split('/')[9];
                            if (!isLinked) {
                                isLinked = parseInt(pageNo) === annotation.pageNo;
                            }
                        });
                        return isLinked;
                    }).length > 0;

                    if (scriptDetails != null && !scriptDetails.isSuppressed && !isLinkedPageInImagesToRender) {
                        let scriptImageUrl = this.getScriptImageURLforTheScriptImage(annotation.pageNo, scriptDetails.rowVersion);
                        images.push(scriptImageUrl);
                    }

                    if (images.length > 0) {
                        imagesToRender.push(images);
                    }
                });
            }

            imgesToRenderBasedOnZones = imgesToRenderBasedOnZones.concat(imagesToRender);

            // get the images linked by previous marker which are not in the image zones
            if (pagesLinkedByPreviousMarkers && pagesLinkedByPreviousMarkers.length > 0) {
                pagesLinkedByPreviousMarkers.map((pageNumber: number) => {
                    let scriptDetails = scriptStore.instance.getScriptDetails
                        (Number(candidateScriptId), pageNumber);
                    let images: string[] = [];
                    let isLinkedPageInImagesToRender = imgesToRenderBasedOnZones.filter(function (imageCollection: string[]) {
                        let isLinked = false;
                        imageCollection.map((image: string) => {
                            let pageNo = image.split('/')[9];
                            if (!isLinked) {
                                isLinked = parseInt(pageNo) === pageNumber;
                            }
                        });
                        return isLinked;
                    }).length > 0;

                    if (scriptDetails != null && !scriptDetails.isSuppressed && !isLinkedPageInImagesToRender) {
                        let scriptImageUrl = this.getScriptImageURLforTheScriptImage(pageNumber, scriptDetails.rowVersion);
                        images.push(scriptImageUrl);
                    }

                    if (images.length > 0) {
                        imagesToRender.push(images);
                    }
                });
            }
        }

        return imagesToRender;
    }

    /**
     * Fetch images for unstructured response.
     */
    public fetchUnstructuredScriptImages() {
        let imagesToRender: string[][] = [];
        let images: string[] = [];
        let selectedAwardingCandidateData: AwardingCandidateDetails;
        let candidateScriptId: number;
        let scriptDetails;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            let previousScriptId: number;
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                let that = this;
                // restricting to create the image url if same candidate script id comes for the QIG
                if (previousScriptId !== x.candidateScriptId) {
                    let renderedImages: string[] = [];
                    renderedImages = that.getUnstructuredImages(x.candidateScriptId,
                        x.documentId,
                        x.markSchemeGroupId);
                    images = images.concat(renderedImages);
                    previousScriptId = x.candidateScriptId;
                }
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            images = this.getUnstructuredImages(candidateScriptId);
        }

        if (images.length > 0) {
            imagesToRender.push(images);
        }
        return imagesToRender;
    }

    /**
     * method to get the rendered image zone for structured
     * @param imageZonesCollection 
     * @param candidateScriptId 
     * @param documentId 
     * @param markSchemeGroupId 
     */
    private generateImagesToRender(imageZonesCollection: Immutable.List<ImageZone>[], candidateScriptId: number,
        imagesToRender: string[][], documentId: number = 0, markSchemeGroupId: number = 0): string[][] {
        var that = this;
        let images: string[] = [];
        imageZonesCollection.map((imageZones: Immutable.List<ImageZone>) => {
            images = [];
            imageZones.map((imageZone: ImageZone) => {

                let rowVersion = 'rowVersion';
                let scriptDetails = scriptStore.instance.getScriptDetails(candidateScriptId, imageZone.pageNo);
                if (scriptDetails != null && !scriptDetails.isSuppressed) {
                    rowVersion = scriptDetails.rowVersion;

                    let scriptImageUrl = that.getScriptImageURLforTheScriptImage(imageZone.pageNo, rowVersion,
                        candidateScriptId,
                        documentId,
                        markSchemeGroupId);

                    images.push(scriptImageUrl);
                }
            });
            if (images.length > 0) {
                imagesToRender.push(images);
            }
        });

        return imagesToRender;
    }


    /**
     * method to get the unstructured script images
     * @param candidateScriptId 
     * @param documentId 
     * @param markSchemeGroupId 
     */
    private getUnstructuredImages(candidateScriptId: number, documentId: number = 0, markSchemeGroupId: number = 0): string[] {
        let images: string[] = [];
        let scriptDetails;
        scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        scriptDetails = Immutable.List<ScriptImage>(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
        if (scriptDetails) {
            scriptDetails.forEach((scriptImage: ScriptImage) => {
                if (scriptImage != null && !scriptImage.isSuppressed) {
                    let rowVersion = scriptImage.rowVersion;
                    let scriptImageUrl = this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, rowVersion,
                        candidateScriptId,
                        documentId,
                        markSchemeGroupId);
                    images.push(scriptImageUrl);
                }
            });
        }
        return images;
    }

    /**
     * Get the zones realted to the image Cluster.
     * @param imageClusterID
     */
    private getZoneDetails(imageClusterID: number): Immutable.List<ImageZone> {
        return Immutable.List<ImageZone>(this.imageZones.filter((imagezone: ImageZone) => imagezone.imageClusterId === imageClusterID));
    }

    /**
     * Get the zones realted to the mark scheme for eBookmarking zones
     * @param imageClusterID
     */
    private getEBookMarkingZones(markSchemeId: number): Immutable.List<ImageZone> {
        return Immutable.List<ImageZone>(this.imageZones.filter((imagezone: ImageZone) => imagezone.markSchemeId === markSchemeId));
    }

    /**
     * Get the urls for all images.
     * if image is suppresed add '' for handling place holder.
     */
    public getAllImageURLs(): Immutable.List<string> {
        let imageOrder: number = 0;
        let imageUrls: string[] = [];
        let additionalObjectFlag = Immutable.Map<number, boolean>();
        let candidateScriptId: number;
        let selectedAwardingCandidateData: AwardingCandidateDetails;

        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                let that = this;
                let resultData: [string[], Immutable.Map<number, boolean>];
                resultData = that.generateImageUrl(x.candidateScriptId,
                    x.documentId,
                    x.markSchemeGroupId);
                imageUrls = imageUrls.concat(resultData[0]);
                additionalObjectFlag = additionalObjectFlag.merge(resultData[1]);
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            let that = this;
            let resultData: [string[], Immutable.Map<number, boolean>];
            resultData = that.generateImageUrl(candidateScriptId, 0, 0);
            imageUrls = imageUrls.concat(resultData[0]);
            additionalObjectFlag = additionalObjectFlag.merge(resultData[1]);
        }
        scriptActionCreator.saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
        return Immutable.List<string>(imageUrls);
    }

    /**
     * Get the urls for all images.
     * if image is suppresed add '' for handling place holder.
     */
    public getFileMetadata(): Immutable.List<FileMetadata> {
        let imageOrder: number = 0;
        let additionalObjectFlag = Immutable.Map<number, boolean>();
        let fileMetadataList = Immutable.List<FileMetadata>();
        let fileMetadata = [];
        let candidateScriptId: number;
        let selectedAwardingCandidateData: AwardingCandidateDetails;
        let scriptDetails;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            //candidateScriptId = this.candidateScriptId;
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(x.candidateScriptId);
                scriptDetails = Immutable.List<ScriptImage>(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
                scriptDetails.forEach((scriptImage: ScriptImage) => {
                    imageOrder++;
                    if (scriptImage.isSuppressed) {
                        let metadata: FileMetadata = {
                            url: '',
                            name: '',
                            // For non digital component the page id always be zero.
                            pageId: 0,
                            isSuppressed: scriptImage.isSuppressed,
                            pageNumber: scriptImage.pageNumber,
                            linkType: '',
                            isConvertible: true,
                            isImage: true
                        };
                        fileMetadata.push(metadata);
                    } else {
                        let metadata: FileMetadata = {
                            url: this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion,
                                x.candidateScriptId,
                                x.documentId,
                                x.markSchemeGroupId),
                            name: '',
                            // For non digital component the page id always be zero.
                            pageId: 0,
                            isSuppressed: scriptImage.isSuppressed,
                            pageNumber: scriptImage.pageNumber,
                            linkType: '',
                            isConvertible: true,
                            isImage: true
                        };
                        fileMetadata.push(metadata);
                    }
                    additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
                });
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
            scriptDetails = Immutable.List<ScriptImage>(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
            scriptDetails.forEach((scriptImage: ScriptImage) => {
                imageOrder++;
                if (scriptImage.isSuppressed) {
                    let metadata: FileMetadata = {
                        url: '',
                        name: '',
                        // For non digital component the page id always be zero.
                        pageId: 0,
                        isSuppressed: scriptImage.isSuppressed,
                        pageNumber: scriptImage.pageNumber,
                        linkType: '',
                        isConvertible: true,
                        isImage: true
                    };
                    fileMetadata.push(metadata);
                } else {
                    let metadata: FileMetadata = {
                        url: this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion),
                        name: '',
                        // For non digital component the page id always be zero.
                        pageId: 0,
                        isSuppressed: scriptImage.isSuppressed,
                        pageNumber: scriptImage.pageNumber,
                        linkType: '',
                        isConvertible: true,
                        isImage: true
                    };
                    fileMetadata.push(metadata);
                }
                additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
            });
        }

        scriptActionCreator.saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
        fileMetadataList = Immutable.List(fileMetadata);
        return fileMetadataList;
    }

    /**
     * Construct the Script Image Url
     * @param pageNo
     * @param rowVersion
     */
    public getScriptImageURLforTheScriptImage(pageNo: number, rowVersion: string,
        awdCandidateScriptId: number = 0,
        awdDocumentId: number = 0,
        awdMarkSchemeGroupId: number = 0) {
        let candidateScriptId: number;
        let documentId: number = 0;
        let markSchemeGroupID = 0;

        let isAwarding: boolean = markerOperationModeFactory.operationMode.isAwardingMode;
        let suppressPagesInAwarding: boolean = false;

        if (isAwarding) {
            candidateScriptId = awdCandidateScriptId;
            documentId = awdDocumentId;
            markSchemeGroupID = awdMarkSchemeGroupId;
            suppressPagesInAwarding = configurableCharacteristicsHelper.getCharacteristicValue(
                configurableCharacteristicsNames.SuppressPagesInAwarding).toLowerCase() === 'true';
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            documentId = this.responseData.documentId;
            markSchemeGroupID = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        }

        return config.general.SERVICE_BASE_URL +
            URLS.SCRIPT_IMAGE_DATA_URL + '/' +
            candidateScriptId + '/' +
            documentId + '/' +
            pageNo + '/' +
            rowVersion + '/' +
            markSchemeGroupID + '/' +
            isAwarding + '/' +
            suppressPagesInAwarding;
    }

    /**
     * set the image cluster Id.
     * @param imageClusterID
     */
    public setImageClusterID(_imageClusterID: number) {
        this.imageClusterId = _imageClusterID;
    }

    /**
     * set the current selected mark scheme id
     * @param markSchemeID
     */
    public setMarkSchemeID(markSchemeID: number) {
        this.markSchemeId = markSchemeID;
    }

    /**
     * Gets the count of suppressed pages.
     * @param candidateScriptId
     */
    public getSuppressedPagesCount(): number {
        let suppressedCount: number = 0;
        let candidateScriptId: number;
        let scriptDetails;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(x.candidateScriptId);
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        }

        if (scriptDetails != null) {
            scriptDetails.forEach((scriptImage: ScriptImage) => {
                if (scriptImage.isSuppressed === true) {
                    suppressedCount++;
                }
            });
        }
        return suppressedCount;
    }

    /**
     * Gets the count of Pages excluding suppressed pages.
     * @param candidateScriptId
     */
    public getPagesCountExcludingSuppressed(): number {
        let pageCount: number = 0;
        let candidateScriptId: number;
        let scriptDetails;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            //candidateScriptId = this.candidateScriptId;
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(x.candidateScriptId);
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        }

        if (scriptDetails != null) {
            scriptDetails.forEach((scriptImage: ScriptImage) => {
                if (scriptImage.isSuppressed === false) {
                    pageCount++;
                }
            });
        }
        return pageCount;
    }

    /**
     * Get suppressed offset limit of the first visible image
     * @returns
     */
    public getFirstVisibleImageSuppressOffset(): number {

        let candidateScriptId: number;
        let scriptDetails: Immutable.List<ScriptImage>;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(x.candidateScriptId);
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            scriptDetails =
                scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        }

        let suppressedOffSet: number = 0;

        if (scriptDetails != null) {

            let found: boolean = false;
            scriptDetails.forEach((x: ScriptImage) => {

                if (!found) {

                    if (!x.isSuppressed) {
                        suppressedOffSet = x.suppressedLimit;
                        found = true;
                    }
                }
            });
        }

        return suppressedOffSet;
    }

    /**
     * This method will return the pageNumber collection which contains one or more zones for whole response.
     * @param ids imageClusterId is passed incase of Whole response, and markSchemeId is passed incase of Ebookmarking component.
     */
    public getPageNumbersForImageZones = (ids: Array<number>): Array<number> => {
        if (responseStore.instance.isWholeResponse) {
            return this.getPageNumbersForImageZonesForWholeResponse();
        } else {
            return this.getPageNumberForImageZonesForSingleResponse(ids);
        }
    }

    /**
     * method to return the image url
     * @param candidateScriptId 
     * @param documentId 
     * @param markSchemeGroupId 
     */
    private generateImageUrl(candidateScriptId: number, documentId: number, markSchemeGroupId: number):
        [string[], Immutable.Map<number, boolean>] {
        let imageOrder: number = 0;
        let imageUrls: string[] = [];
        let additionalObjectFlag = Immutable.Map<number, boolean>();
        let scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        scriptDetails = Immutable.List<ScriptImage>(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
        scriptDetails.forEach((scriptImage: ScriptImage) => {
            imageOrder++;
            if (scriptImage.isSuppressed) {
                imageUrls.push('');
            } else {
                imageUrls.push(this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion,
                    candidateScriptId,
                    documentId,
                    markSchemeGroupId));
            }
            additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
        });
        return [imageUrls, additionalObjectFlag];
    }

    /**
     * This method will return the pageNumber collection which contains one or more zones for whole response.
     */
    private getPageNumbersForImageZonesForWholeResponse = (): Array<number> => {
        let pageNumbers: Array<number> = new Array<number>();
        if (this.imageZones) {
            this.imageZones.map((x: ImageZone) => {
                if (pageNumbers.indexOf(x.pageNo) === -1) {
                    pageNumbers.push(x.pageNo);
                }
            });
        }

        return pageNumbers;
    };

    /**
     * This method will return the pageNumber collection which contains one or more zones for single response.
     */
    private getPageNumberForImageZonesForSingleResponse = (ids: Array<number>): Array<number> => {
        let pageNumbers: Array<number> = new Array<number>();
        if (ids) {
            ids.forEach((elementId: number) => {
                this.imageZones.forEach((image: ImageZone) => {
                    // markSchemeId will be available, only for ebookmarking response.
                    if ((image.markSchemeId ? image.markSchemeId === elementId : image.imageClusterId === elementId) &&
                        pageNumbers.indexOf(image.pageNo) === -1) {
                        pageNumbers.push(image.pageNo);
                    }
                });
            });
        }
        return pageNumbers;
    };


    /**
     * This method will returns the ImageZones against a page number.
     * @param: pageNo - page number
     */
    public getImageZonesAgainstPageNo = (pageNo: number): Immutable.List<ImageZone> => {
        return Immutable.List<ImageZone>(this.imageZones.filter((imagezone: ImageZone) => imagezone.pageNo === pageNo));
    };

    /**
     * process the image zones collection to make it render for the link page sceneries
     * @param imageZonesCollection
     * @param linkedPagesByPreviousMarkers
     * @param multipleMarkSchemes
     */
    public processImageZonesCollectionForLinkingScenarios(imageZonesCollection: Immutable.List<ImageZone>[],
        linkedPagesByPreviousMarkers: number[], multipleMarkSchemes: treeviewitem) {
        let zonesCollection: Immutable.List<ImageZone>[] = [];
        let isZoneLinked: boolean = false;
        let stitchedZones: Immutable.List<ImageZone>;
        this._doApplyLinkingScenarios = false;
        let currentQuestionItemInfo;
        if (markingStore) {
            currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        }
        //check if the any of the zones are linked
        if (imageZonesCollection && imageZonesCollection !== null && currentQuestionItemInfo) {
            imageZonesCollection.map((imageZones: Immutable.List<ImageZone>) => {
                if (imageZones.count() > 1 && this.isEbookMarking) {
                    let ebmZones = Immutable.List<ImageZone>();
                    imageZones.map((imageZone: ImageZone, zoneIndex: number) => {
                        let isLinked = this.setLinkedZone(imageZone, multipleMarkSchemes, linkedPagesByPreviousMarkers);
                        if (isLinked === true) {
                            if (!this.zoneAlreadyExistsInCollection([ebmZones], imageZone)) {
                                ebmZones = ebmZones.push(imageZone);
                            }
                        } else {
                            ebmZones = ebmZones.push(imageZone);
                        }
                    });
                    zonesCollection.push(ebmZones);
                } else if (imageZones.count() > 1) {
                    stitchedZones = Immutable.List<ImageZone>();
                    // remove the zones in same page which are linked
                    let refinedZones = Immutable.List<ImageZone>();
                    imageZones.map((imageZone: ImageZone, zoneIndex: number) => {
                        if (refinedZones.filter(item => item.pageNo === imageZone.pageNo).count() === 0 ||
                            !pageLinkHelper.isZoneLinked(imageZone, multipleMarkSchemes, true)) {
                            imageZone.isViewWholePageLinkVisible = false;
                            refinedZones = refinedZones.push(imageZone);
                        }
                    });
                    // split the zones if any linked zones in the collection
                    refinedZones.map((imageZone: ImageZone, zoneIndex: number) => {
                        // check if the zone is linked.
                        isZoneLinked = pageLinkHelper.isZoneLinked(imageZone, multipleMarkSchemes);
                        // check if the current zone is linked or zone is linked by any previous marker
                        if (isZoneLinked || linkedPagesByPreviousMarkers.indexOf(imageZone.pageNo) > -1) {
                            if (stitchedZones.count() > 0) {
                                // add the zones which are not linked to the main collection
                                // so that it can be rendered as stitched image view
                                imageZone.isViewWholePageLinkVisible = false;
                                zonesCollection.push(stitchedZones);
                                // clear the collection as its no longer needed
                                stitchedZones = Immutable.List<ImageZone>();
                            }
                            // add the linked zone as seperate collection
                            // so that it can be rendered as a single image viewer,
                            // if a zone with same image doesn't already exist in the collection.
                            if (!this.zoneAlreadyExistsInCollection(zonesCollection, imageZone)) {
                                stitchedZones = stitchedZones.push(imageZone);
                                zonesCollection.push(stitchedZones);
                                this._doApplyLinkingScenarios = true;
                                // clear the stitchedZones collection after adding linked zone to the main collection
                                stitchedZones = Immutable.List<ImageZone>();
                            }
                        } else {
                            // add the zone to a collection which can be rendered as stitched image viewer
                            imageZone.isViewWholePageLinkVisible = true;
                            stitchedZones = stitchedZones.push(imageZone);
                        }
                        // add rest of the zones to the ZonesCollection after link check
                        if (stitchedZones.count() > 0 && (refinedZones.count() === zoneIndex + 1)) {
                            zonesCollection.push(stitchedZones);
                        }
                    });
                } else {
                    let isZoneLinked = this.setLinkedZone(imageZones.first(), multipleMarkSchemes, linkedPagesByPreviousMarkers);
                    // To prevent duplication of output pages for a case like -
                    // if the same page is used as a single ouputpage and as part of a stitched output page then,
                    // on linking the page only one ouptutpage should be shown.
                    if (!isZoneLinked || !this.zoneAlreadyExistsInCollection(zonesCollection, imageZones.first())) {
                        // we dont need to split the zones as this will be rendered as single image viewer
                        zonesCollection.push(imageZones);
                    }
                }
            });
            this._zoneCollectionDetails = zonesCollection;
            return zonesCollection;
        }
        return null;
    }

    /**
     * Set linking props for image zone
     * @param imageZone
     * @param multipleMarkSchemes
     * @param linkedPagesByPreviousMarkers
     * @param zonesCollection
     */
    private setLinkedZone(imageZone: ImageZone, multipleMarkSchemes: any, linkedPagesByPreviousMarkers: any): boolean {
        let isZoneLinked = pageLinkHelper.isZoneLinked(imageZone, multipleMarkSchemes);
        if (isZoneLinked || linkedPagesByPreviousMarkers.indexOf(imageZone.pageNo) > -1) {
            this._doApplyLinkingScenarios = true;
            imageZone.isViewWholePageLinkVisible = false;
        } else if (!this.isEbookMarking) {
            imageZone.isViewWholePageLinkVisible = true;
        }

        return isZoneLinked;
    }

    /**
     * Get script image details.
     */
    public getScriptImageDetails() {
        let candidateScriptId: number;
        let scriptDetails;
        if (markerOperationModeFactory.operationMode.isAwardingMode) {
            this.responseItemGroups.map((x: ResponseItemGroup) => {
                scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(x.candidateScriptId);
            });
        } else {
            candidateScriptId = Number(this.responseData.candidateScriptId);
            scriptDetails = scriptStore.instance.
                getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        }

        scriptDetails = Immutable.List<ScriptImage>(sortHelper.
            sort(scriptDetails.toArray(), comparerList.PageNumberComparer));

        return scriptDetails;
    }

    /* return true if we need to apply linking scenarios. the value will be set
       only after the execution of processImageZonesCollectionForLinkingScenarios() */
    public get doApplyLinkingScenarios(): boolean {
        return this._doApplyLinkingScenarios;
    }

    /**
     * Checks if the zoneToBeCompared already exists in the collection.
     * @param zonesCollection
     * @param zoneToBeCompared
     */
    private zoneAlreadyExistsInCollection(zonesCollection: Immutable.List<ImageZone>[], zoneToBeCompared: ImageZone): boolean {
        let zoneAlreadyExistsInCollection: boolean = false;
        if (zonesCollection.length > 0) {
            for (let zoneList of zonesCollection) {
                if (zoneList.filter((imageZone: ImageZone) => imageZone.pageNo === zoneToBeCompared.pageNo).count() > 0) {
                    zoneAlreadyExistsInCollection = true;
                    break;
                }
            }
        }
        return zoneAlreadyExistsInCollection;
    }
}

export = ScriptHelper;