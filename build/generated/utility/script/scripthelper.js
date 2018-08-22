"use strict";
var markSchemeStructureStore = require('../../stores/markschemestructure/markschemestructurestore');
var imageZoneStore = require('../../stores/imagezones/imagezonestore');
var Immutable = require('immutable');
var responseStore = require('../../stores/response/responsestore');
var scriptStore = require('../../stores/script/scriptstore');
var URLS = require('../../dataservices/base/urls');
var qigStore = require('../../stores/qigselector/qigstore');
var sortHelper = require('../sorting/sorthelper');
var comparerList = require('../sorting/sortbase/comparerlist');
var markingStore = require('../../stores/marking/markingstore');
var scriptActionCreator = require('../../actions/script/scriptactioncreator');
var pagelinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
var markinghelper = require('../markscheme/markinghelper');
var treeviewDataHelper = require('../treeviewhelpers/treeviewdatahelper');
var pageLinkHelper = require('../../components/response/responsescreen/linktopage/pagelinkhelper');
var configurableCharacteristicsHelper = require('../../utility/configurablecharacteristic/configurablecharacteristicshelper');
var configurableCharacteristicsNames = require('../../utility/configurablecharacteristic/configurablecharacteristicsnames');
var standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
var markerOperationModeFactory = require('../../components/utility/markeroperationmode/markeroperationmodefactory');
/**
 * Helper class for the Scripts in response screen
 */
var ScriptHelper = (function () {
    /**
     * Constructor for the Script Helper class
     */
    function ScriptHelper() {
        var _this = this;
        this.imageZones = Immutable.List();
        this._zoneCollectionDetails = [];
        this.suppressedPageNos = new Array();
        /**
         * This method will return the pageNumber collection which contains one or more zones for whole response.
         * @param ids imageClusterId is passed incase of Whole response, and markSchemeId is passed incase of Ebookmarking component.
         */
        this.getPageNumbersForImageZones = function (ids) {
            if (responseStore.instance.isWholeResponse) {
                return _this.getPageNumbersForImageZonesForWholeResponse();
            }
            else {
                return _this.getPageNumberForImageZonesForSingleResponse(ids);
            }
        };
        /**
         * This method will return the pageNumber collection which contains one or more zones for whole response.
         */
        this.getPageNumbersForImageZonesForWholeResponse = function () {
            var pageNumbers = new Array();
            if (_this.imageZones) {
                _this.imageZones.map(function (x) {
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
        this.getPageNumberForImageZonesForSingleResponse = function (ids) {
            var pageNumbers = new Array();
            if (ids) {
                ids.forEach(function (elementId) {
                    _this.imageZones.forEach(function (image) {
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
        this.getImageZonesAgainstPageNo = function (pageNo) {
            return Immutable.List(_this.imageZones.filter(function (imagezone) { return imagezone.pageNo === pageNo; }));
        };
        this.treeViewHelper = new treeviewDataHelper();
        var candidateScriptId;
        if (markerOperationModeFactory.operationMode.isSelectResponsesTabInStdSetup) {
            candidateScriptId = standardisationSetupStore.instance.selectedResponseId;
            this.responseData = standardisationSetupStore.instance.fetchSelectedScriptDetails(candidateScriptId);
        }
        else if (responseStore.instance.selectedDisplayId) {
            this.responseData = markerOperationModeFactory.operationMode.openedResponseDetails(responseStore.instance.selectedDisplayId.toString());
            candidateScriptId = Number(this.responseData.candidateScriptId);
        }
        // Finding the suppressed image zones page number's
        var candidateScriptDetail = (scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId));
        if (candidateScriptDetail) {
            var scriptDetails = candidateScriptDetail.forEach(function (scriptImage) {
                if (scriptImage.isSuppressed) {
                    _this.suppressedPageNos.push(scriptImage.pageNumber);
                }
            });
        }
        // Populate Imagezone Collection
        this.resetImageZoneCollection();
        this.imageClusterId = 0;
        this.markSchemeId = 0;
        if (qigStore.instance.selectedQIGForMarkerOperation) {
            if (markSchemeStructureStore.instance.markSchemeStructure.clusters) {
                var cluster = markSchemeStructureStore.instance.markSchemeStructure.clusters[qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId];
                this.getFirstImageCluster(cluster);
            }
        }
        this._doApplyLinkingScenarios = false;
    }
    /**
     * Populate Imagezone Collection
     */
    ScriptHelper.prototype.resetImageZoneCollection = function () {
        var _this = this;
        /*for ebookmarking the imageZoneList collection would be be null and execulte the else batch with currentCandidateScriptImageZone*/
        var imageZonesCollection = new Array();
        if (imageZoneStore.instance.imageZoneList != null) {
            // Excluding  suppressed images from the imagezone collection.
            // Barcode suppression rule can apply for zones
            imageZoneStore.instance.imageZoneList.imageZones.forEach(function (imagezone) {
                if (_this.suppressedPageNos.indexOf(imagezone.pageNo) === -1) {
                    imageZonesCollection.push(imagezone);
                }
            });
        }
        else if (imageZoneStore.instance.currentCandidateScriptImageZone != null) {
            // Excluding  suppressed images from the imagezone collection.
            imageZoneStore.instance.currentCandidateScriptImageZone.forEach(function (imagezone) {
                if (_this.suppressedPageNos.indexOf(imagezone.pageNo) === -1) {
                    imageZonesCollection.push(imagezone);
                }
            });
        }
        this.imageZones = Immutable.List(imageZonesCollection);
    };
    Object.defineProperty(ScriptHelper.prototype, "getResponseData", {
        /*
         * Get the current response data
         */
        get: function () {
            return this.responseData;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the first mark scheme
     */
    ScriptHelper.prototype.getFirstImageCluster = function (cluster) {
        var that = this;
        if (cluster.answerItems != null) {
            // Loop through each answer item and find the image cluser id
            cluster.answerItems.map(function (item) {
                if (that.imageClusterId === 0 && item.imageClusterId > 0) {
                    that.imageClusterId = item.imageClusterId;
                    // as we need to get the first markable item retur if we found already.
                    return;
                }
            });
        }
        // If none of the markable item found, dig in to deeep further.
        if (cluster.childClusters != null) {
            cluster.childClusters.map(function (item) {
                // If image cluster id foud retrun
                if (that.imageClusterId > 0) {
                    return;
                }
                that.getFirstImageCluster(item);
            });
        }
    };
    Object.defineProperty(ScriptHelper.prototype, "currentImageZoneCollection", {
        /**
         * The image zones for the current items.
         */
        get: function () {
            return this.currentImageZones;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScriptHelper.prototype, "isEbookMarking", {
        get: function () {
            return (configurableCharacteristicsHelper.getExamSessionCCValue(configurableCharacteristicsNames.eBookmarking, qigStore.instance.selectedQIGForMarkerOperation.examSessionId)
                .toLowerCase() === 'true');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * get the image zones collection to render
     */
    ScriptHelper.prototype.getImageZonesCollectionForRender = function () {
        var _this = this;
        if (this.imageClusterId > 0) {
            this.currentImageZones = this.getZoneDetails(this.imageClusterId);
        }
        else if (this.isEbookMarking === true && this.markSchemeId > 0) {
            this.currentImageZones = this.getEBookMarkingZones(this.markSchemeId);
        }
        else {
            return null;
        }
        var imageZonesCollection = [];
        // Sorting the currentImageZones in increasing outputPageNo order.
        var sortedCurrentImageZones = this.currentImageZones.sort(function (zoneA, zoneB) {
            return zoneA.outputPageNo - zoneB.outputPageNo;
        });
        // Group by output page.
        // Iterate through group.
        // sort a group accordint to imageData.SequenceNo
        // If group has single image then create <SingleImageZone/>, else <StitchedImageZone>
        var groupedAccordingToOutputPageNo = sortedCurrentImageZones.groupBy(function (imageZone) {
            /* grouping based on outputpagenumber is not needed for ebookmarking*/
            return ((_this.isEbookMarking === true) ? 0 : imageZone.outputPageNo);
        });
        var keys = groupedAccordingToOutputPageNo.keySeq();
        groupedAccordingToOutputPageNo.map(function (imageZones) {
            if (imageZones.count() > 1) {
                var sortedImageZones = imageZones.sort(function (imageZoneA, imageZoneB) {
                    return imageZoneA.sequence - imageZoneB.sequence;
                }).toList();
                imageZonesCollection.push(sortedImageZones);
            }
            else {
                imageZonesCollection.push(imageZones);
            }
        });
        return imageZonesCollection;
    };
    /**
     * method helps to fetch the script images
     * @param imageZonesCollection
     */
    ScriptHelper.prototype.fetchScriptImages = function (imageZonesCollection) {
        if (imageZonesCollection != null) {
            var imagesToRender_1 = [];
            var that = this;
            imageZonesCollection.map(function (imageZones) {
                var candidateScriptId = Number(that.responseData.candidateScriptId);
                var images = [];
                imageZones.map(function (imageZone) {
                    var rowVersion = 'rowVersion';
                    var scriptDetails = scriptStore.instance.getScriptDetails(candidateScriptId, imageZone.pageNo);
                    if (scriptDetails != null && !scriptDetails.isSuppressed) {
                        rowVersion = scriptDetails.rowVersion;
                        var scriptImageUrl = that.getScriptImageURLforTheScriptImage(imageZone.pageNo, rowVersion);
                        images.push(scriptImageUrl);
                    }
                });
                if (images.length > 0) {
                    imagesToRender_1.push(images);
                }
            });
            return imagesToRender_1;
        }
    };
    /**
     * return linked pages
     * @param imgesToRenderBasedOnZones
     * @param pagesLinkedByPreviousMarkers
     */
    ScriptHelper.prototype.fetchLinkedScriptImages = function (imgesToRenderBasedOnZones, pagesLinkedByPreviousMarkers) {
        var _this = this;
        var imagesToRender = [];
        var currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        var filteredLinkAnnotations;
        if (currentQuestionItemInfo && currentQuestionItemInfo.uniqueId) {
            // get all the linked pages
            var linkedAnnotations = pagelinkHelper.getAllLinkedItems();
            var nodes = this.treeViewHelper.treeViewItem();
            var parentNodeOfCurrentQuestionItem = markinghelper.getMarkschemeParentNodeDetails(nodes, currentQuestionItemInfo.uniqueId, true);
            if (parentNodeOfCurrentQuestionItem.treeViewItemList.size >= 2) {
                var parentNodeOfCurrentQuestionItemUniqueId_1 = parentNodeOfCurrentQuestionItem.treeViewItemList.get(0).uniqueId;
                filteredLinkAnnotations = linkedAnnotations.filter(function (item, pos, self) {
                    return item.markSchemeId === parentNodeOfCurrentQuestionItemUniqueId_1;
                });
            }
            else {
                filteredLinkAnnotations = linkedAnnotations.filter(function (item, pos, self) {
                    return item.markSchemeId === currentQuestionItemInfo.uniqueId;
                });
            }
            if (filteredLinkAnnotations && filteredLinkAnnotations !== null) {
                filteredLinkAnnotations.map(function (annotation) {
                    var scriptDetails = scriptStore.instance.getScriptDetails(Number(_this.responseData.candidateScriptId), annotation.pageNo);
                    var images = [];
                    var isLinkedPageInImagesToRender = imgesToRenderBasedOnZones.filter(function (imageCollection) {
                        // we only add the linked pages if its not included in the image to render by zones
                        var isLinked = false;
                        imageCollection.map(function (image) {
                            var pageNo = image.split('/')[9];
                            if (!isLinked) {
                                isLinked = parseInt(pageNo) === annotation.pageNo;
                            }
                        });
                        return isLinked;
                    }).length > 0;
                    if (scriptDetails != null && !scriptDetails.isSuppressed && !isLinkedPageInImagesToRender) {
                        var scriptImageUrl = _this.getScriptImageURLforTheScriptImage(annotation.pageNo, scriptDetails.rowVersion);
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
                pagesLinkedByPreviousMarkers.map(function (pageNumber) {
                    var scriptDetails = scriptStore.instance.getScriptDetails(Number(_this.responseData.candidateScriptId), pageNumber);
                    var images = [];
                    var isLinkedPageInImagesToRender = imgesToRenderBasedOnZones.filter(function (imageCollection) {
                        var isLinked = false;
                        imageCollection.map(function (image) {
                            var pageNo = image.split('/')[9];
                            if (!isLinked) {
                                isLinked = parseInt(pageNo) === pageNumber;
                            }
                        });
                        return isLinked;
                    }).length > 0;
                    if (scriptDetails != null && !scriptDetails.isSuppressed && !isLinkedPageInImagesToRender) {
                        var scriptImageUrl = _this.getScriptImageURLforTheScriptImage(pageNumber, scriptDetails.rowVersion);
                        images.push(scriptImageUrl);
                    }
                    if (images.length > 0) {
                        imagesToRender.push(images);
                    }
                });
            }
        }
        return imagesToRender;
    };
    /**
     * Fetch images for unstructured response.
     */
    ScriptHelper.prototype.fetchUnstructuredScriptImages = function () {
        var _this = this;
        var imagesToRender = [];
        var images = [];
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        scriptDetails = Immutable.List(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
        if (scriptDetails) {
            scriptDetails.forEach(function (scriptImage) {
                if (scriptImage != null && !scriptImage.isSuppressed) {
                    var rowVersion = scriptImage.rowVersion;
                    var scriptImageUrl = _this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, rowVersion);
                    images.push(scriptImageUrl);
                }
            });
        }
        if (images.length > 0) {
            imagesToRender.push(images);
        }
        return imagesToRender;
    };
    /**
     * Get the zones realted to the image Cluster.
     * @param imageClusterID
     */
    ScriptHelper.prototype.getZoneDetails = function (imageClusterID) {
        return Immutable.List(this.imageZones.filter(function (imagezone) { return imagezone.imageClusterId === imageClusterID; }));
    };
    /**
     * Get the zones realted to the mark scheme for eBookmarking zones
     * @param imageClusterID
     */
    ScriptHelper.prototype.getEBookMarkingZones = function (markSchemeId) {
        return Immutable.List(this.imageZones.filter(function (imagezone) { return imagezone.markSchemeId === markSchemeId; }));
    };
    /**
     * Get the urls for all images.
     * if image is suppresed add '' for handling place holder.
     */
    ScriptHelper.prototype.getAllImageURLs = function () {
        var _this = this;
        var imageOrder = 0;
        var imageUrls = [];
        var additionalObjectFlag = Immutable.Map();
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        scriptDetails = Immutable.List(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
        scriptDetails.forEach(function (scriptImage) {
            imageOrder++;
            if (scriptImage.isSuppressed) {
                imageUrls.push('');
            }
            else {
                imageUrls.push(_this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion));
            }
            additionalObjectFlag = additionalObjectFlag.set(imageOrder, scriptImage.isAdditionalObject);
        });
        scriptActionCreator.saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
        return Immutable.List(imageUrls);
    };
    /**
     * Get the urls for all images.
     * if image is suppresed add '' for handling place holder.
     */
    ScriptHelper.prototype.getFileMetadata = function () {
        var _this = this;
        var imageOrder = 0;
        var additionalObjectFlag = Immutable.Map();
        var fileMetadataList = Immutable.List();
        var fileMetadata = [];
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        scriptDetails = Immutable.List(sortHelper.sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
        scriptDetails.forEach(function (scriptImage) {
            imageOrder++;
            if (scriptImage.isSuppressed) {
                var metadata = {
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
            }
            else {
                var metadata = {
                    url: _this.getScriptImageURLforTheScriptImage(scriptImage.pageNumber, scriptImage.rowVersion),
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
        scriptActionCreator.saveAdditionalObjectFlagCollection(additionalObjectFlag, responseStore.instance.selectedDisplayId);
        fileMetadataList = Immutable.List(fileMetadata);
        return fileMetadataList;
    };
    /**
     * Construct the Script Image Url
     * @param pageNo
     * @param rowVersion
     */
    ScriptHelper.prototype.getScriptImageURLforTheScriptImage = function (pageNo, rowVersion) {
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var documentId = this.responseData.documentId;
        return config.general.SERVICE_BASE_URL +
            URLS.SCRIPT_IMAGE_DATA_URL + '/' +
            candidateScriptId + '/' +
            documentId + '/' +
            pageNo + '/' +
            rowVersion + '/' +
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId + '/';
    };
    /**
     * set the image cluster Id.
     * @param imageClusterID
     */
    ScriptHelper.prototype.setImageClusterID = function (_imageClusterID) {
        this.imageClusterId = _imageClusterID;
    };
    /**
     * set the current selected mark scheme id
     * @param markSchemeID
     */
    ScriptHelper.prototype.setMarkSchemeID = function (markSchemeID) {
        this.markSchemeId = markSchemeID;
    };
    /**
     * Gets the count of suppressed pages.
     * @param candidateScriptId
     */
    ScriptHelper.prototype.getSuppressedPagesCount = function () {
        var suppressedCount = 0;
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        if (scriptDetails != null) {
            scriptDetails.forEach(function (scriptImage) {
                if (scriptImage.isSuppressed === true) {
                    suppressedCount++;
                }
            });
        }
        return suppressedCount;
    };
    /**
     * Gets the count of Pages excluding suppressed pages.
     * @param candidateScriptId
     */
    ScriptHelper.prototype.getPagesCountExcludingSuppressed = function () {
        var pageCount = 0;
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        if (scriptDetails != null) {
            scriptDetails.forEach(function (scriptImage) {
                if (scriptImage.isSuppressed === false) {
                    pageCount++;
                }
            });
        }
        return pageCount;
    };
    /**
     * Get suppressed offset limit of the first visible image
     * @returns
     */
    ScriptHelper.prototype.getFirstVisibleImageSuppressOffset = function () {
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        var suppressedOffSet = 0;
        if (scriptDetails != null) {
            var found_1 = false;
            scriptDetails.forEach(function (x) {
                if (!found_1) {
                    if (!x.isSuppressed) {
                        suppressedOffSet = x.suppressedLimit;
                        found_1 = true;
                    }
                }
            });
        }
        return suppressedOffSet;
    };
    /**
     * process the image zones collection to make it render for the link page sceneries
     * @param imageZonesCollection
     * @param linkedPagesByPreviousMarkers
     * @param multipleMarkSchemes
     */
    ScriptHelper.prototype.processImageZonesCollectionForLinkingScenarios = function (imageZonesCollection, linkedPagesByPreviousMarkers, multipleMarkSchemes) {
        var _this = this;
        var zonesCollection = [];
        var isZoneLinked = false;
        var stitchedZones;
        this._doApplyLinkingScenarios = false;
        var currentQuestionItemInfo;
        if (markingStore) {
            currentQuestionItemInfo = markingStore.instance.currentQuestionItemInfo;
        }
        //check if the any of the zones are linked
        if (imageZonesCollection && imageZonesCollection !== null && currentQuestionItemInfo) {
            imageZonesCollection.map(function (imageZones) {
                if (imageZones.count() > 1 && _this.isEbookMarking) {
                    var ebmZones_1 = Immutable.List();
                    imageZones.map(function (imageZone, zoneIndex) {
                        var isLinked = _this.setLinkedZone(imageZone, multipleMarkSchemes, linkedPagesByPreviousMarkers);
                        if (isLinked === true) {
                            if (!_this.zoneAlreadyExistsInCollection([ebmZones_1], imageZone)) {
                                ebmZones_1 = ebmZones_1.push(imageZone);
                            }
                        }
                        else {
                            ebmZones_1 = ebmZones_1.push(imageZone);
                        }
                    });
                    zonesCollection.push(ebmZones_1);
                }
                else if (imageZones.count() > 1) {
                    stitchedZones = Immutable.List();
                    // remove the zones in same page which are linked
                    var refinedZones_1 = Immutable.List();
                    imageZones.map(function (imageZone, zoneIndex) {
                        if (refinedZones_1.filter(function (item) { return item.pageNo === imageZone.pageNo; }).count() === 0 ||
                            !pageLinkHelper.isZoneLinked(imageZone, multipleMarkSchemes, true)) {
                            imageZone.isViewWholePageLinkVisible = false;
                            refinedZones_1 = refinedZones_1.push(imageZone);
                        }
                    });
                    // split the zones if any linked zones in the collection
                    refinedZones_1.map(function (imageZone, zoneIndex) {
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
                                stitchedZones = Immutable.List();
                            }
                            // add the linked zone as seperate collection
                            // so that it can be rendered as a single image viewer,
                            // if a zone with same image doesn't already exist in the collection.
                            if (!_this.zoneAlreadyExistsInCollection(zonesCollection, imageZone)) {
                                stitchedZones = stitchedZones.push(imageZone);
                                zonesCollection.push(stitchedZones);
                                _this._doApplyLinkingScenarios = true;
                                // clear the stitchedZones collection after adding linked zone to the main collection
                                stitchedZones = Immutable.List();
                            }
                        }
                        else {
                            // add the zone to a collection which can be rendered as stitched image viewer
                            imageZone.isViewWholePageLinkVisible = true;
                            stitchedZones = stitchedZones.push(imageZone);
                        }
                        // add rest of the zones to the ZonesCollection after link check
                        if (stitchedZones.count() > 0 && (refinedZones_1.count() === zoneIndex + 1)) {
                            zonesCollection.push(stitchedZones);
                        }
                    });
                }
                else {
                    var isZoneLinked_1 = _this.setLinkedZone(imageZones.first(), multipleMarkSchemes, linkedPagesByPreviousMarkers);
                    // To prevent duplication of output pages for a case like -
                    // if the same page is used as a single ouputpage and as part of a stitched output page then,
                    // on linking the page only one ouptutpage should be shown.
                    if (!isZoneLinked_1 || !_this.zoneAlreadyExistsInCollection(zonesCollection, imageZones.first())) {
                        // we dont need to split the zones as this will be rendered as single image viewer
                        zonesCollection.push(imageZones);
                    }
                }
            });
            this._zoneCollectionDetails = zonesCollection;
            return zonesCollection;
        }
        return null;
    };
    /**
     * Set linking props for image zone
     * @param imageZone
     * @param multipleMarkSchemes
     * @param linkedPagesByPreviousMarkers
     * @param zonesCollection
     */
    ScriptHelper.prototype.setLinkedZone = function (imageZone, multipleMarkSchemes, linkedPagesByPreviousMarkers) {
        var isZoneLinked = pageLinkHelper.isZoneLinked(imageZone, multipleMarkSchemes);
        if (isZoneLinked || linkedPagesByPreviousMarkers.indexOf(imageZone.pageNo) > -1) {
            this._doApplyLinkingScenarios = true;
            imageZone.isViewWholePageLinkVisible = false;
        }
        else if (!this.isEbookMarking) {
            imageZone.isViewWholePageLinkVisible = true;
        }
        return isZoneLinked;
    };
    /**
     * Get script image details.
     */
    ScriptHelper.prototype.getScriptImageDetails = function () {
        var candidateScriptId = Number(this.responseData.candidateScriptId);
        var scriptDetails = scriptStore.instance.
            getAllScriptDetailsForTheCandidateScript(candidateScriptId);
        scriptDetails = Immutable.List(sortHelper.
            sort(scriptDetails.toArray(), comparerList.PageNumberComparer));
        return scriptDetails;
    };
    Object.defineProperty(ScriptHelper.prototype, "doApplyLinkingScenarios", {
        /* return true if we need to apply linking scenarios. the value will be set
           only after the execution of processImageZonesCollectionForLinkingScenarios() */
        get: function () {
            return this._doApplyLinkingScenarios;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks if the zoneToBeCompared already exists in the collection.
     * @param zonesCollection
     * @param zoneToBeCompared
     */
    ScriptHelper.prototype.zoneAlreadyExistsInCollection = function (zonesCollection, zoneToBeCompared) {
        var zoneAlreadyExistsInCollection = false;
        if (zonesCollection.length > 0) {
            for (var _i = 0, zonesCollection_1 = zonesCollection; _i < zonesCollection_1.length; _i++) {
                var zoneList = zonesCollection_1[_i];
                if (zoneList.filter(function (imageZone) { return imageZone.pageNo === zoneToBeCompared.pageNo; }).count() > 0) {
                    zoneAlreadyExistsInCollection = true;
                    break;
                }
            }
        }
        return zoneAlreadyExistsInCollection;
    };
    return ScriptHelper;
}());
module.exports = ScriptHelper;
//# sourceMappingURL=scripthelper.js.map