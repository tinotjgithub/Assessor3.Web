import React = require('react');
import xmlHelper = require('../generic/xmlhelper');
import configurablecharacteristicshelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import enums = require('../../components/utility/enums');
import markingstore = require('../../stores/marking/markingstore');
import annotation = require('../../stores/response/typings/annotation');
import workListStore = require('../../stores/worklist/workliststore');
import qigstore = require('../../stores/qigselector/qigstore');
import stampstore = require('../../stores/stamp/stampstore');
import examinerMarksAndAnnotations = require('../../stores/response/typings/examinermarksandannotation');
import examinerAnnotations = require('../../stores/response/typings/annotation');

class ColouredAnnotationsHelper {

    private static colouredAnnotationCCOriginalColorTag: string = 'original';

    /**
     * Gets the Coloured Annotation CC Value
     */
    public static getColouredAnnotationCCValue() {
        return configurablecharacteristicshelper.getCharacteristicValue('ColouredAnnotations');
    }

    /**
     * get the colored annotation cc value by markschemegroup id
     */
    public static getColouredAnnotationCCValueByMarkSchemeGroupId() {
        let qigId = qigstore.instance.selectedQIGForMarkerOperation !== undefined ?
                                qigstore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        return configurablecharacteristicshelper.getCharacteristicValue('ColouredAnnotations', qigId);
    }

    /**
     * Gets the DefaultAnnotationColour for the QIG
     */
    public static getColouredAnnotationDefaultColourForTheQIG() {
        let colorStatus = ColouredAnnotationsHelper.getColouredAnnotationStatusForTheQIG();
        if (colorStatus !== undefined &&
            colorStatus != null &&
            (colorStatus.toLowerCase() === enums.ConfigurableCharacteristicsColorStatus[0].toLowerCase())
        ) {
            let colouredAnnotationCCValue = ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId();
            let xmlHelperObj = new xmlHelper(colouredAnnotationCCValue);
            let defaultColourAttribute: string = xmlHelperObj.getAttributeValueByName('OriginalColour');
            if (defaultColourAttribute && defaultColourAttribute.toLocaleLowerCase() === this.colouredAnnotationCCOriginalColorTag) {
                return defaultColourAttribute;
            } else {
                return xmlHelperObj.getAttributeValueByName('DefaultColour');
            }
        } else {
            return null;
        }
    }

    /**
     * Gets the Status for the QIG
     */
    public static getColouredAnnotationStatusForTheQIG() {
        let colouredAnnotationCCValue = ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId();
        let xmlHelperObj;

        if (colouredAnnotationCCValue) {
            xmlHelperObj = new xmlHelper(colouredAnnotationCCValue);
            return xmlHelperObj.getAttributeValueByName('Status');
        } else {
            return null;
        }
    }

    /**
     * Gets the AllowHighlightColourEdit for the QIG
     */
    public static getHighlighterColouredAnnotationStatusForTheQIG() {
        let colouredAnnotationCCValue = ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId();
        let xmlHelperObj;

        if (colouredAnnotationCCValue) {
            xmlHelperObj = new xmlHelper(colouredAnnotationCCValue);
            return xmlHelperObj.getAttributeValueByName('AllowHighlightColourEdit');
        } else {
            return null;
        }
    }

    /**
     * Creates the annotation style for the stamps to be rendered on the Stamp panel
     */
    public static createAnnotationStyle(_annotation: annotation = null,
        dynamicAnnotationType: enums.DynamicAnnotation): React.CSSProperties {
        return ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour(_annotation, dynamicAnnotationType);
    }

    /**
     * Creating style for default annotation colour
     */
    private static createStyleForDefaultAnnotationColour(_annotation: annotation,
        dynamicAnnotationType: enums.DynamicAnnotation): React.CSSProperties {

        // Default fill colour is RED as per requirement
        let fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(255, 0, 0, dynamicAnnotationType);
        let border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);

        if (_annotation) {
            if (ColouredAnnotationsHelper.doApplyAnnotationColour(_annotation, dynamicAnnotationType)) {
                fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(
                    _annotation.red,
                    _annotation.green,
                    _annotation.blue,
                    dynamicAnnotationType);
                border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);
                return {
                    fill: fillColour,
                    border: border
                };
            }
        }

        if (ColouredAnnotationsHelper.doApplyRemarkBaseColour(_annotation)) {
            return ColouredAnnotationsHelper.getRemarkBaseColor(dynamicAnnotationType);
        }

        // Retrieving the annotation default colour based on the ColouredAnnotation CC value
        let annotationDefaultColour = '';
        annotationDefaultColour = ColouredAnnotationsHelper.getColouredAnnotationDefaultColourForTheQIG();
        if (annotationDefaultColour !== undefined &&
            annotationDefaultColour != null &&
            ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId() !== '') {
            if (annotationDefaultColour.toLowerCase() === this.colouredAnnotationCCOriginalColorTag) {
                fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(255, 0, 0, dynamicAnnotationType);
                border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);
            } else {
                fillColour = ColouredAnnotationsHelper.convertHexToRGBA(annotationDefaultColour, dynamicAnnotationType);
                // The border colour for the annotations should also be based on the ColouredAnnotation CC value
                border = ColouredAnnotationsHelper.getAnnotationBorderStyle((annotationDefaultColour === '' ?
                    fillColour : ColouredAnnotationsHelper.convertHexToRGBA(annotationDefaultColour, dynamicAnnotationType)));
            }
        }


        // Returning back the CSS styling to be set in-line on the SVG icons
        return {
            fill: fillColour,
            border: border
        };
    }

    /**
     * Get remark default color
     * @param dynamicAnnotationType
     */
    public static getRemarkBaseColor(dynamicAnnotationType: enums.DynamicAnnotation) {
        // Default fill colour is RED as per requirement
        let fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(255, 0, 0, dynamicAnnotationType);
        let border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);

        //Added the condition to include the worklist type to get the base color of pooled remarks as well
        let baseColour: string = workListStore.instance.getRemarkBaseColour(
            markingstore.instance.currentMarkGroupId,
            markingstore.instance.currentResponseMode,
            workListStore.instance.currentWorklistType);
        if (baseColour) {
            fillColour = ColouredAnnotationsHelper.convertHexToRGBA(baseColour, dynamicAnnotationType);
            // The border colour for the annotations should also be based on the ColouredAnnotation CC value
            border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);
            return {
                fill: fillColour,
                border: border
            };
        }

        return {
            fill: fillColour,
            border: border
        };
    }

    /**
     * Updating annotation colour based on a3 settings
     * TODO - updating store direct is antipattern. change this in future.
     */
    public static updateAnnotationColourIfNeeded(markGroupId: number): boolean {
        let annotationColor: string = '';
        let annotation: examinerAnnotations;
        let red: string;
        let green: string;
        let blue: string;

        // Retrieving an annotation from the marking store collection
        let examinerMarksAndAnnotations: examinerMarksAndAnnotations =
            markingstore.instance.currentExaminerMarksAgainstResponse(markGroupId);
        if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.annotations) {
            for (let i = 0; i < examinerMarksAndAnnotations.annotations.length; i++) {
                if (examinerMarksAndAnnotations.annotations[i].markGroupId === markGroupId) {
                    annotation = examinerMarksAndAnnotations.annotations[i];
                    if (stampstore.instance.getStamp(annotation.stamp).stampId !== enums.DynamicAnnotation.Highlighter) {
                        break;
                    }
                }
            }
        }

        if (annotation) {

            // Retrieving the colour styles which would have been applied if the annotation was put through Assessor 3
            let stampName: string = enums.DynamicAnnotation[annotation.stamp];
            let annotationStyle: React.CSSProperties
                = ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour(
                    annotation,
                    enums.DynamicAnnotation[stampName]);
            [red, green, blue] = ColouredAnnotationsHelper.splitRGBA(annotationStyle.fill);
            let selectedMarkGroupId: number;

            // If the current annotation colour differs from the colour according to Assessor 3 styles
            if (annotation.red !== parseInt(red) || annotation.green !== parseInt(green) || annotation.blue !== parseInt(blue)) {

                // Looping through each of the annotations and setting the correct colour according to the Assessor 3 styles
                examinerMarksAndAnnotations.annotations.map((a: annotation) => {

                    stampName = enums.DynamicAnnotation[a.stamp];
                    let style: React.CSSProperties
                        = ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour(
                            annotation,
                            enums.DynamicAnnotation[stampName]);
                    [red, green, blue] = ColouredAnnotationsHelper.splitRGBA(annotationStyle.fill);
                    a.isDirty = true;
                    a.red = parseInt(red);
                    a.green = parseInt(green);
                    a.blue = parseInt(blue);
                    a.markingOperation = enums.MarkingOperation.updated;
                    selectedMarkGroupId = a.markGroupId;
                    markingstore.instance.updateAnnotationColourByMarkGroup(a, markGroupId);
                });

                // Update the marks and annotations save queue status to Await Queueing
                markingstore.instance.updateMarksAndAnnotationsSaveQueueingStatus(markGroupId, true);

                return true;
            }
        }

        return false;
    }

    /**
     * Converts hex code to RGBA and RGB format.
     * @param hex
     * @param dynamicAnnotationType
     * @param returnRGB?
     */
    public static convertHexToRGBA(hex: string, dynamicAnnotationType: enums.DynamicAnnotation, returnRGB?: boolean) {
        if (hex) {
            hex = hex.replace('#', '');
            let a = parseInt(hex.substring(0, 2), 16);
            let r = parseInt(hex.substring(2, 4), 16);
            let g = parseInt(hex.substring(4, 6), 16);
            let b = parseInt(hex.substring(6, 8), 16);

            // If the default annotation colour is transparent or white, paint the annotation in RED colour
            if (ColouredAnnotationsHelper.isTransparentColour(a) || ColouredAnnotationsHelper.isWhiteColour(r, g, b)) {
                return ColouredAnnotationsHelper.createRedColour();
            }

            if (returnRGB) {
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            }

            return 'rgba(' + r + ','
                + g + ','
                + b + ','
                + ColouredAnnotationsHelper.getAnnotationOpacity(dynamicAnnotationType) + ')';
        }
    }

    /**
     * Split RGBA code
     * @param rgba
     */
    public static splitRGBA(rgba: string) {

        rgba = rgba.replace('rgba(', '');
        rgba = rgba.replace(')', '');
        return rgba.split(',');
    }

    /**
     * Checks if a particular HEXCODE is white colour
     * @param red
     * @param green
     * @param blue
     */
    private static isWhiteColour(red: number, green: number, blue: number) {
        return red === 255 && green === 255 && blue === 255;
    }

    /**
     * Checks if a particular HEXCODE is transparent by passing in the alpha component of the HEXCODE
     * @param alpha
     */
    private static isTransparentColour(alpha: number): boolean {
        return alpha === 0;
    }

    /**
     * Returns the red colour
     */
    private static createRedColour(): string {
        return 'rgba(255, 0, 0, 1)';
    }

    /**
     * Returns whether the default colour of the annotation needs to be applied
     * @param _annotation
     */
    private static doApplyAnnotationColour(_annotation: annotation, dynamicAnnotation: enums.DynamicAnnotation): boolean {

        if (_annotation.isPrevious ||
            markingstore.instance.currentResponseMode === enums.ResponseMode.closed) {
            return true;
        }

        switch (dynamicAnnotation) {
            case enums.DynamicAnnotation.Highlighter:
                let colorStatus = ColouredAnnotationsHelper.getHighlighterColouredAnnotationStatusForTheQIG();
                return colorStatus === undefined ||
                    colorStatus == null ||
                    (colorStatus.toLowerCase() === enums.ConfigurableCharacteristicsHighlighterColorStatus[1].toLowerCase());
            default:
                return false;
        }
    }

    /**
     * Returns the opacity to be applied to the annotations
     * @param annotation
     */
    private static getAnnotationOpacity(annotation: enums.DynamicAnnotation): string {

        switch (annotation) {
            case enums.DynamicAnnotation.Highlighter:
                return '0.25';
            default:
                return '1';
        }
    }

    /**
     * Returns whether the remark base colour is to be applied
     * @param _annotation
     */
    private static doApplyRemarkBaseColour(_annotation: annotation): boolean {

        if (_annotation) {
            return _annotation.remarkRequestTypeId > 0;
        }

        return (workListStore.instance.currentWorklistType === enums.WorklistType.directedRemark) ||
                                (workListStore.instance.currentWorklistType === enums.WorklistType.pooledRemark);
    }

    /**
     * return rgba value for the annotation
     * @param red
     * @param green
     * @param blue
     * @param dynamicAnnotationType
     */
    private static getAnnotationFillColor(red: number, green: number, blue: number,
        dynamicAnnotationType: enums.DynamicAnnotation): string {

        return 'rgba(' + red + ', '
            + green + ', '
            + blue + ', '
            + ColouredAnnotationsHelper.getAnnotationOpacity(dynamicAnnotationType) + ')';
    }

    /**
     * return the border style for annotation
     * @param fillColour
     */
    private static getAnnotationBorderStyle(fillColour: string): string {
        return '1px solid ' + fillColour;
    }

    /**
     * gets previous remark base color
     * @param allMarksAndAnnotation
     */
    public static getPreviousRemarkBaseColor(allMarksAndAnnotation: any): string {
        let colorCode: string;
        if (allMarksAndAnnotation.remarkRequestTypeId > 0) {
            colorCode = allMarksAndAnnotation.baseColor;
        } else {
            colorCode = ColouredAnnotationsHelper.getColouredAnnotationDefaultColourForTheQIG();
        }

        let previousRemarkBaseColor: string = ColouredAnnotationsHelper.convertHexToRGBA(colorCode, enums.DynamicAnnotation.None, true);
        return previousRemarkBaseColor;
    }

    /**
     * returns tinted Rgba color string.
     * @param rgb
     */
    public static getTintedRgbColor(rgba: string, fraction: number = 0.6): string {
        let red; let green; let blue; let alpha;
        [red, green, blue, alpha] = ColouredAnnotationsHelper.splitRGBA(rgba);

        let rt: number = parseInt(red);
        let gt: number = parseInt(green);
        let bt: number = parseInt(blue);

        rt = Math.round(rt + (fraction * (255 - rt)));
        gt = Math.round(gt + (fraction * (255 - gt)));
        bt = Math.round(bt + (fraction * (255 - bt)));

        return 'rgba' + '(' + rt + ',' + gt + ',' + bt + ',' + alpha + ')';
    }
}

export = ColouredAnnotationsHelper;