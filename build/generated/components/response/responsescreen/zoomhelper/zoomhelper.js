"use strict";
var enums = require('../../../utility/enums');
var markingStore = require('../../../../stores/marking/markingstore');
var ZoomHelper = (function () {
    function ZoomHelper() {
    }
    /**
     * Get the current user option value. For structured/ecoursework response consider markscheme/file value to
     * get the current value
     * @param {string} zoomUserOption
     * @returns
     */
    ZoomHelper.getZoomUserOption = function (zoomUserOption) {
        var userOption = {
            'userOptionZoomValue': 0,
            'zoomPreference': enums.ZoomPreference.None,
            'zoomHeader': ''
        };
        if (zoomUserOption) {
            var optionWithValue = zoomUserOption.split(/,(.+)/);
            var zoomPreference = optionWithValue && optionWithValue.length > 0 ?
                parseInt(optionWithValue[0].split(':')[0]) : enums.ZoomPreference.FitWidth;
            /* Zoom value stored in below formats in user options
                i)  - Unstructed {Excluding Ecoursework}  => value,zoomvalue

                ii) - Structured  => value,[{"m":{imageclusterId},"p":{zoomprefecrence},"z":{actualvalue}}]
                        Example 1. => 3,[{"m":8,"p":2,"z":53.87}]
                        Example 2. => 3,[{"m":7,"p":0,"z":0}]

                        3  -> Represents the mark scheme Zoom Preference enum value

                        'm' -> Represents mark scheme
                                Stores the image cluster Id
                        'p' -> Represents the zoom preference type.
                                Fit width value   - 0
                                Fit Height value  - 1
                                Custom Zoom value - 2
                        'z' -> Represents Zoom
                                Stores Actual zoom value

                iii) - Ecoursework  => value,[{"f":{docstorePageId},"p":{zoomprefecrence},"z":{actualvalue}}]
                        Example 1. => 4,[{"f":8,"p":2,"z":53.87}]
                        Example 2. => 4,[{"m":7,"p":0,"z":0}]

                        'f' -> Represents File
                                Stores the Docstore page Id
                        'p' -> Represents the zoom preference type.
                                Fit width value   - 0
                                Fit Height value  - 1
                                Custom Zoom value - 2
                        'z' -> Represents Zoom
                                Stores Actual zoom value

            */
            // Get the array from the user option, Eg: if user option is 4,[{"f":8,"p":2,"z":53.87}] value is [{"f":8,"p":2,"z":53.87}]
            var userOptionZoomValue = (zoomPreference === enums.ZoomPreference.Percentage ||
                zoomPreference === enums.ZoomPreference.MarkschemePercentage ||
                zoomPreference === enums.ZoomPreference.FilePercentage)
                ? optionWithValue[1] :
                0;
            // Even if the user option object having differnt percentage, UI has 3 preference. Get the UI Zoom preference 
            switch (zoomPreference) {
                case enums.ZoomPreference.FitHeight:
                    userOption.zoomPreference = enums.ZoomPreference.FitHeight;
                    break;
                case enums.ZoomPreference.FitWidth:
                    userOption.zoomPreference = enums.ZoomPreference.FitWidth;
                    break;
                case enums.ZoomPreference.Percentage:
                case enums.ZoomPreference.MarkschemePercentage:
                case enums.ZoomPreference.FilePercentage:
                    userOption.zoomPreference = enums.ZoomPreference.Percentage;
                    break;
            }
            userOption.userOptionZoomValue = userOptionZoomValue;
            userOption.zoomHeader = optionWithValue[0];
        }
        else {
            userOption.zoomPreference = enums.ZoomPreference.FitWidth;
        }
        return userOption;
    };
    /**
     * Get the current zoom of the selected markscheme
     * @param {string} zoomUserOption
     * @param {number} currentQuestionItem
     * @param {courseworkDocPageID} courseworkDocPageID
     * @returns
     */
    ZoomHelper.getCurrentZoomPreference = function (zoomUserOption, currentImageCluster, courseworkDocPageID) {
        if (courseworkDocPageID === void 0) { courseworkDocPageID = 0; }
        var userOption = ZoomHelper.getZoomUserOption(zoomUserOption);
        // If the zoom is in percentage then loop through the existing collection to get the current zoom value
        // for the selected markscheme or selected file in ecourseworks.
        if (userOption.zoomPreference === enums.ZoomPreference.Percentage) {
            userOption = this.getZoomValue(userOption, currentImageCluster, courseworkDocPageID);
        }
        return userOption;
    };
    /**
     * Update the markscheme of the current markscheme
     * @param {string} zoomUserOption
     * @param {number} currentZoom
     * @param {number} currentQuestionItem
     * @param {enums.ZoomPreference} updatedZoomPreference
     * @returns
     */
    ZoomHelper.updateZoomPreference = function (zoomUserOption, currentZoom, currentQuestionItem, updatedZoomPreference, zoomHeader, selectedECourseworkPageID) {
        if (selectedECourseworkPageID === void 0) { selectedECourseworkPageID = 0; }
        var zoomPreference = '';
        // For unstructred response we done need to maintain zoom for each markscheme.
        //current question item will be 0 for unstructured response.
        switch (updatedZoomPreference) {
            case enums.ZoomPreference.FitHeight:
            case enums.ZoomPreference.FitWidth:
                if (currentQuestionItem === 0 && selectedECourseworkPageID === 0) {
                    zoomPreference = updatedZoomPreference.toString();
                }
                else {
                    zoomPreference =
                        ZoomHelper.getUpdatedZoomPreference(zoomUserOption, currentZoom, markingStore.instance.currentQuestionItemInfo.imageClusterId, updatedZoomPreference, zoomHeader, selectedECourseworkPageID);
                }
                break;
            case enums.ZoomPreference.Percentage:
                if (currentQuestionItem === 0 && selectedECourseworkPageID === 0) {
                    zoomPreference = enums.ZoomPreference.Percentage.toString() + ',' + currentZoom;
                }
                else {
                    zoomPreference =
                        ZoomHelper.getUpdatedZoomPreference(zoomUserOption, currentZoom, markingStore.instance.currentQuestionItemInfo.imageClusterId, updatedZoomPreference, zoomHeader, selectedECourseworkPageID);
                }
                break;
        }
        return zoomPreference;
    };
    /**
     * Map and update the updated zoom values.
     * @param {string} zoomUserOption
     * @param {number} currentZoom
     * @param {number} currentQuestionItem
     * @param {enums.ZoomPreference} updatedZoomPreference
     * @returns
     */
    ZoomHelper.getUpdatedZoomPreference = function (zoomUserOption, currentZoom, imageClusterId, updatedZoomPreference, zoomHeader, selectedECourseworkPageID) {
        var updatedPreference = (zoomHeader === '' || zoomHeader.charAt(0) === '0') ? enums.ZoomPreference.MarkschemePercentage.toString() + ',' :
            zoomHeader + ',';
        var currentZoomPref = [];
        var preferenceExistsInCollection = false;
        // If none of the zoom option has been added yet. Add to the collection. Otherwise
        // update
        // If the user option not saved and saving for the first time fitwidth will be default.
        // Here the zoomUserOption is checked because while in team management when the
        // subordinate has structured at risk pooled worklist and atypical response in it
        // upon opening atypical response and then structured response will give zoom
        // value as undefined.
        if (zoomUserOption && isNaN(parseFloat(JSON.parse(JSON.stringify(zoomUserOption))))) {
            currentZoomPref = JSON.parse(zoomUserOption);
            // Find already zoom exists for the selected markscheme/ selected file in ecoursework. 
            // Otherwise add new zoom preference to the collection for the current markscheme / file in ecoursework.
            for (var i = 0; i < currentZoomPref.length; i++) {
                if (imageClusterId > 0 && currentZoomPref[i].m === imageClusterId ||
                    currentZoomPref[i].f === selectedECourseworkPageID) {
                    currentZoomPref[i].z = currentZoom;
                    currentZoomPref[i].p = updatedZoomPreference;
                    preferenceExistsInCollection = true;
                    break;
                }
            }
        }
        // If no match found in collection add to existing collection as new preference.
        // If the user has opened for the first time and update the zoom then also this will add as new preference
        // to the collection.
        if (!preferenceExistsInCollection) {
            var zoomPreference = void 0;
            if (imageClusterId > 0) {
                // structured
                zoomPreference = { m: imageClusterId, p: updatedZoomPreference, z: currentZoom };
            }
            else {
                // ecoursework
                zoomPreference = { f: selectedECourseworkPageID, p: updatedZoomPreference, z: currentZoom };
            }
            currentZoomPref.push(zoomPreference);
        }
        updatedPreference += JSON.stringify(currentZoomPref);
        return updatedPreference;
    };
    /**
     * Get the zoom preference and value of the current markscheme.
     * @param {string} zoomUserOption
     * @param {number} currentMarkScheme
     * @returns
     */
    ZoomHelper.getZoomValue = function (zoomUserOption, currentImageCluster, selectedECourseworkPageID) {
        if (selectedECourseworkPageID === void 0) { selectedECourseworkPageID = 0; }
        var zoomPreference = { 'userOptionZoomValue': 0, 'zoomPreference': enums.ZoomPreference.None, 'selectedECourseworkPageID': 0 };
        var currentZoomPreference = [];
        var isZoomOptionFound = false;
        // We are checking whether the current markscheme does not contain any zoom preference other than
        // compatible for structured. This is not a likely scenario either.
        // Here the zoomUserOption.userOptionZoomValue is checked because while in team management when the
        // subordinate has structured at risk pooled worklist and atypical response in it
        // upon opening atypical response and then structured response will give zoom
        // value as undefined.
        if (zoomUserOption.userOptionZoomValue && isNaN(parseFloat(JSON.parse(JSON.stringify(zoomUserOption.userOptionZoomValue))))) {
            currentZoomPreference = JSON.parse(zoomUserOption.userOptionZoomValue);
            var zoomPreferenceOption = void 0;
            for (var i = 0; zoomPreferenceOption = currentZoomPreference[i]; i++) {
                // If zoom preference exists for current markscheme // selected file then return the value.
                if ((currentImageCluster > 0 && zoomPreferenceOption.m === currentImageCluster) ||
                    (zoomPreferenceOption.f === selectedECourseworkPageID)) {
                    zoomPreference.selectedECourseworkPageID = zoomPreferenceOption.f;
                    zoomPreference.userOptionZoomValue = zoomPreferenceOption.z;
                    zoomPreference.zoomPreference = zoomPreferenceOption.p;
                    isZoomOptionFound = true;
                    break;
                }
            }
        }
        // If no current preference is found, Consider the default zoom as FITWidth
        if (!isZoomOptionFound) {
            zoomPreference.userOptionZoomValue = 0;
            zoomPreference.zoomPreference = enums.ZoomPreference.FitWidth;
        }
        return zoomPreference;
    };
    /**
     * return the image cluster id based on isZoomModified
     * @param isZoomModified
     */
    ZoomHelper.setImageClusterId = function (isZoomModified) {
        var imageClusterId = undefined;
        if (isZoomModified) {
            // if zoom is modifying then return the current imageClusterId
            imageClusterId = markingStore.instance.currentQuestionItemImageClusterId;
        }
        else {
            // if currentQuestionItemImageClusterId is undefined then return the previousQuestionItemImageClusterId
            imageClusterId = markingStore.instance.currentQuestionItemImageClusterId ?
                markingStore.instance.currentQuestionItemImageClusterId : markingStore.instance.previousQuestionItemImageClusterId;
        }
        return imageClusterId;
    };
    /**
     * Gets atypical response zoom options
     * @param {string} zoomUserOption
     * @returns
     */
    ZoomHelper.getAtypicalZoomOption = function (zoomUserOption) {
        var userOption = { 'userOptionZoomValue': 0, 'zoomPreference': enums.ZoomPreference.None };
        if (zoomUserOption) {
            var optionWithValue = zoomUserOption.split(/,(.+)/);
            userOption.zoomPreference = optionWithValue && optionWithValue.length > 0 ?
                parseInt(optionWithValue[0].split(':')[0]) : enums.ZoomPreference.FitWidth;
            if (optionWithValue && optionWithValue.length > 0) {
                // If none of the zoom value added for the atypical response, set the default as
                // FitWidth. Otherwise get from the original.
                if (optionWithValue.length > 0 && optionWithValue[0].split(':').length > 1) {
                    switch (parseInt(optionWithValue[0].split(':')[1])) {
                        case enums.ZoomPreference.FitWidth:
                            userOption.zoomPreference = enums.ZoomPreference.FitWidth;
                            break;
                        case enums.ZoomPreference.FitHeight:
                            userOption.zoomPreference = enums.ZoomPreference.FitHeight;
                            break;
                        default:
                            userOption.zoomPreference = enums.ZoomPreference.Percentage;
                            userOption.userOptionZoomValue = parseFloat(optionWithValue[0].split(':')[1]);
                            break;
                    }
                }
                else {
                    userOption.zoomPreference = enums.ZoomPreference.FitWidth;
                }
            }
        }
        else {
            userOption.zoomPreference = enums.ZoomPreference.FitWidth;
        }
        return userOption;
    };
    /**
     * Update the atypical response zoom preference
     * @param {string} zoomUserOption
     * @param {enums.ZoomPreference} zoomPreference
     * @param {number} zoomValue
     * @returns
     */
    ZoomHelper.updateAtypicalZoomOption = function (zoomUserOption, zoomPreference, zoomValue) {
        var optionWithValue = [];
        if (zoomUserOption) {
            optionWithValue = zoomUserOption.split(/,(.+)/);
        }
        var zoomHeader = '';
        switch (zoomPreference) {
            case enums.ZoomPreference.FitWidth:
                zoomHeader = enums.ZoomPreference.MarkschemePercentage.toString() + ':' + enums.ZoomPreference.FitWidth;
                break;
            case enums.ZoomPreference.FitHeight:
                zoomHeader = enums.ZoomPreference.MarkschemePercentage.toString() + ':' + enums.ZoomPreference.FitHeight;
                break;
            default:
                zoomHeader = enums.ZoomPreference.MarkschemePercentage.toString() + ':' + zoomValue;
                break;
        }
        if (optionWithValue.length > 0) {
            // If the user has opened the response for the first time and is Atypical, then for structured responses
            // zoom preference is not set. So intializing a new collection for the firsttime.
            zoomHeader += ',' + (optionWithValue[1] === undefined ? '[]' : optionWithValue[1]);
        }
        return zoomHeader;
    };
    /**
     * returns the marksheet view holder padding for rotated images
     * @param markSheetHolderWidth
     * @param structuredImageZone
     * @param rotatedImages
     * @param currentZoomPercentage
     * @param displayAnglesOfCurrentResponse
     */
    ZoomHelper.getRotatedPagePadding = function (markSheetHolderWidth, structuredImageZone, rotatedImages, currentZoomPercentage, displayAnglesOfCurrentResponse) {
        var element;
        var marksheetViewHolderPadding = 0;
        var _loop_1 = function(i) {
            var rotatedImage = rotatedImages.filter((function (x) { return x === element.pageNo; }));
            var displayAngle = 0;
            var displayAngleCollection = displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map(function (angle, key) {
                    if (key === element.pageNo) {
                        displayAngle = angle;
                    }
                });
            }
            displayAngle = this_1.getAngleforRotation(displayAngle);
            //Calculate the view holder padding
            if (element.pageNo === rotatedImage[0] && (displayAngle === 90 || displayAngle === 270)) {
                var imageZoneWidthInPx = ((element.zoneWidth / 100) * currentZoomPercentage);
                var rotatedAspectRatio = element.zoneHeight / element.zoneWidth;
                var viewHolderPadding = (markSheetHolderWidth - (imageZoneWidthInPx * rotatedAspectRatio)) / 2;
                if (viewHolderPadding * -1 > marksheetViewHolderPadding) {
                    marksheetViewHolderPadding = (viewHolderPadding * -1);
                }
            }
        };
        var this_1 = this;
        for (var i = 0; element = structuredImageZone[i]; i++) {
            _loop_1(i);
        }
        return marksheetViewHolderPadding;
    };
    /**
     * Get the actual angle while rotation.
     * @param rotatedAngle
     */
    ZoomHelper.getAngleforRotation = function (rotatedAngle) {
        if (typeof rotatedAngle === 'undefined') {
            rotatedAngle = 0;
        }
        if (rotatedAngle < 0) {
            rotatedAngle = rotatedAngle % enums.RotateAngle.Rotate_360;
            rotatedAngle = enums.RotateAngle.Rotate_360 + rotatedAngle;
            rotatedAngle = Math.abs(rotatedAngle);
        }
        return rotatedAngle % enums.RotateAngle.Rotate_360;
    };
    return ZoomHelper;
}());
module.exports = ZoomHelper;
//# sourceMappingURL=zoomhelper.js.map