import enums = require('../../../utility/enums');
import stringHelper = require('../../../../utility/generic/stringhelper');
import markingStore = require('../../../../stores/marking/markingstore');

class ZoomHelper {

    /**
     * Get the current user option value. For structured/ecoursework response consider markscheme/file value to
     * get the current value
     * @param {string} zoomUserOption
     * @returns
     */
    public static getZoomUserOption(zoomUserOption: string): any {

        let userOption = {
            'userOptionZoomValue': 0,
            'zoomPreference': enums.ZoomPreference.None,
            'zoomHeader': ''
        };

        if (zoomUserOption) {
            let optionWithValue = zoomUserOption.split(/,(.+)/);
            let zoomPreference: enums.ZoomPreference = optionWithValue && optionWithValue.length > 0 ?
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
            let userOptionZoomValue: any =
                (zoomPreference === enums.ZoomPreference.Percentage ||
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

        } else {
            userOption.zoomPreference = enums.ZoomPreference.FitWidth;
        }

        return userOption;
    }

    /**
     * Get the current zoom of the selected markscheme
     * @param {string} zoomUserOption
     * @param {number} currentQuestionItem
     * @param {courseworkDocPageID} courseworkDocPageID
     * @returns
     */
    public static getCurrentZoomPreference(zoomUserOption: string, currentImageCluster: number, courseworkDocPageID: number = 0): any {
        let userOption = ZoomHelper.getZoomUserOption(zoomUserOption);

        // If the zoom is in percentage then loop through the existing collection to get the current zoom value
        // for the selected markscheme or selected file in ecourseworks.
        if (userOption.zoomPreference === enums.ZoomPreference.Percentage) {
            userOption = this.getZoomValue(userOption, currentImageCluster, courseworkDocPageID);
        }
        return userOption;
    }

    /**
     * Update the markscheme of the current markscheme
     * @param {string} zoomUserOption
     * @param {number} currentZoom
     * @param {number} currentQuestionItem
     * @param {enums.ZoomPreference} updatedZoomPreference
     * @returns
     */
    public static updateZoomPreference(zoomUserOption: string,
        currentZoom: number,
        currentQuestionItem: number,
        updatedZoomPreference: enums.ZoomPreference,
        zoomHeader: string,
        selectedECourseworkPageID: number = 0): string {

        let zoomPreference: string = '';

        // For unstructred response we done need to maintain zoom for each markscheme.
        //current question item will be 0 for unstructured response.
        switch (updatedZoomPreference) {
            case enums.ZoomPreference.FitHeight:
            case enums.ZoomPreference.FitWidth:

                if (currentQuestionItem === 0 && selectedECourseworkPageID === 0) {
                    zoomPreference = updatedZoomPreference.toString();
                } else {
                    zoomPreference =
                        ZoomHelper.getUpdatedZoomPreference(zoomUserOption,
                            currentZoom, markingStore.instance.currentQuestionItemInfo.imageClusterId, updatedZoomPreference,
                            zoomHeader, selectedECourseworkPageID);
                }
                break;
            case enums.ZoomPreference.Percentage:

                if (currentQuestionItem === 0 && selectedECourseworkPageID === 0) {
                    zoomPreference = enums.ZoomPreference.Percentage.toString() + ',' + currentZoom;
                } else {
                    zoomPreference =
                        ZoomHelper.getUpdatedZoomPreference(zoomUserOption,
                            currentZoom, markingStore.instance.currentQuestionItemInfo.imageClusterId, updatedZoomPreference,
                            zoomHeader, selectedECourseworkPageID);
                }
                break;
        }
        return zoomPreference;
    }

    /**
     * Map and update the updated zoom values.
     * @param {string} zoomUserOption
     * @param {number} currentZoom
     * @param {number} currentQuestionItem
     * @param {enums.ZoomPreference} updatedZoomPreference
     * @returns
     */
    private static getUpdatedZoomPreference(zoomUserOption: string, currentZoom: number,
        imageClusterId: number, updatedZoomPreference: enums.ZoomPreference,
        zoomHeader: string, selectedECourseworkPageID: number): string {

        let updatedPreference: string =
            (zoomHeader === '' || zoomHeader.charAt(0) === '0') ? enums.ZoomPreference.MarkschemePercentage.toString() + ',' :
                zoomHeader + ',';

        var currentZoomPref: Array<ZoomPreferenceOption> = [];
        var preferenceExistsInCollection: boolean = false;

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
            for (let i = 0; i < currentZoomPref.length; i++) {

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
            let zoomPreference: ZoomPreferenceOption;

            if (imageClusterId > 0) {
                // structured
                zoomPreference = { m: imageClusterId, p: updatedZoomPreference, z: currentZoom };
            } else {
                // ecoursework
                zoomPreference = { f: selectedECourseworkPageID, p: updatedZoomPreference, z: currentZoom };
            }
            currentZoomPref.push(zoomPreference);
        }

        updatedPreference += JSON.stringify(currentZoomPref);
        return updatedPreference;
    }

    /**
     * Get the zoom preference and value of the current markscheme.
     * @param {string} zoomUserOption
     * @param {number} currentMarkScheme
     * @returns
     */
    private static getZoomValue(zoomUserOption: any, currentImageCluster: number, selectedECourseworkPageID: number = 0): any {

        let zoomPreference = { 'userOptionZoomValue': 0, 'zoomPreference': enums.ZoomPreference.None, 'selectedECourseworkPageID': 0 };
        let currentZoomPreference: Array<ZoomPreferenceOption> = [];

        let isZoomOptionFound: boolean = false;

        // We are checking whether the current markscheme does not contain any zoom preference other than
        // compatible for structured. This is not a likely scenario either.
        // Here the zoomUserOption.userOptionZoomValue is checked because while in team management when the
        // subordinate has structured at risk pooled worklist and atypical response in it
        // upon opening atypical response and then structured response will give zoom
        // value as undefined.
        if (zoomUserOption.userOptionZoomValue && isNaN(parseFloat(JSON.parse(JSON.stringify(zoomUserOption.userOptionZoomValue))))) {
            currentZoomPreference = JSON.parse(zoomUserOption.userOptionZoomValue);
            let zoomPreferenceOption: ZoomPreferenceOption;
            for (let i = 0; zoomPreferenceOption = currentZoomPreference[i]; i++) {
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
    }

    /**
     * return the image cluster id based on isZoomModified
     * @param isZoomModified
     */
    public static setImageClusterId(isZoomModified: boolean): number {
        let imageClusterId = undefined;

        if (isZoomModified) {
            // if zoom is modifying then return the current imageClusterId
            imageClusterId = markingStore.instance.currentQuestionItemImageClusterId;
        } else {
            // if currentQuestionItemImageClusterId is undefined then return the previousQuestionItemImageClusterId
            imageClusterId = markingStore.instance.currentQuestionItemImageClusterId ?
                markingStore.instance.currentQuestionItemImageClusterId : markingStore.instance.previousQuestionItemImageClusterId;
        }

        return imageClusterId;
    }

    /**
     * Gets atypical response zoom options
     * @param {string} zoomUserOption
     * @returns
     */
    public static getAtypicalZoomOption(zoomUserOption: string): any {

        let userOption = { 'userOptionZoomValue': 0, 'zoomPreference': enums.ZoomPreference.None };
        if (zoomUserOption) {

            let optionWithValue = zoomUserOption.split(/,(.+)/);
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
                } else {
                    userOption.zoomPreference = enums.ZoomPreference.FitWidth;
                }
            }

        } else {
            userOption.zoomPreference = enums.ZoomPreference.FitWidth;
        }

        return userOption;
    }

    /**
     * Update the atypical response zoom preference
     * @param {string} zoomUserOption
     * @param {enums.ZoomPreference} zoomPreference
     * @param {number} zoomValue
     * @returns
     */
    public static updateAtypicalZoomOption(zoomUserOption: string, zoomPreference: enums.ZoomPreference, zoomValue: number): any {

        let optionWithValue: string[] = [];
        if (zoomUserOption) {
            optionWithValue = zoomUserOption.split(/,(.+)/);
        }
        let zoomHeader: string = '';
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
    }

    /**
     * returns the marksheet view holder padding for rotated images
     * @param markSheetHolderWidth
     * @param structuredImageZone
     * @param rotatedImages
     * @param currentZoomPercentage
     * @param displayAnglesOfCurrentResponse
     */
    public static getRotatedPagePadding(markSheetHolderWidth: number,
        structuredImageZone: Array<StructuredImageZone>,
        rotatedImages: string[],
        currentZoomPercentage: number,
        displayAnglesOfCurrentResponse: Immutable.Map<string, number>): number {

        let element: StructuredImageZone;
        let marksheetViewHolderPadding = 0;
        for (let i = 0; element = structuredImageZone[i]; i++) {

            let rotatedImage = rotatedImages.filter(((x: string) => x === element.pageNo));
            let displayAngle = 0;
            let displayAngleCollection = displayAnglesOfCurrentResponse;
            if (displayAngleCollection !== undefined && displayAngleCollection.size > 0) {
                displayAngleCollection.map((angle: number, key: string) => {
                    if (key === element.pageNo) {
                        displayAngle = angle;
                    }
                });
            }
            displayAngle = this.getAngleforRotation(displayAngle);

            //Calculate the view holder padding
            if (element.pageNo === rotatedImage[0] && (displayAngle === 90 || displayAngle === 270)) {


                let imageZoneWidthInPx = ((element.zoneWidth / 100) * currentZoomPercentage);

                let rotatedAspectRatio = element.zoneHeight / element.zoneWidth;

                let viewHolderPadding = (markSheetHolderWidth - (imageZoneWidthInPx * rotatedAspectRatio)) / 2;

                if (viewHolderPadding * -1 > marksheetViewHolderPadding) {
                    marksheetViewHolderPadding = (viewHolderPadding * -1);
                }
            }
        }

        return marksheetViewHolderPadding;
    }

    /**
     * Get the actual angle while rotation.
     * @param rotatedAngle
     */
    public static getAngleforRotation(rotatedAngle: number) {
        if (typeof rotatedAngle === 'undefined') {
            rotatedAngle = 0;
        }
        if (rotatedAngle < 0) {
            rotatedAngle = rotatedAngle % enums.RotateAngle.Rotate_360;
            rotatedAngle = enums.RotateAngle.Rotate_360 + rotatedAngle;
            rotatedAngle = Math.abs(rotatedAngle);
        }
        return rotatedAngle % enums.RotateAngle.Rotate_360;
    }
}
export = ZoomHelper;