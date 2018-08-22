"use strict";
var xmlHelper = require('../generic/xmlhelper');
var configurablecharacteristicshelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
var enums = require('../../components/utility/enums');
var markingstore = require('../../stores/marking/markingstore');
var workListStore = require('../../stores/worklist/workliststore');
var qigstore = require('../../stores/qigselector/qigstore');
var stampstore = require('../../stores/stamp/stampstore');
var ColouredAnnotationsHelper = (function () {
    function ColouredAnnotationsHelper() {
    }
    /**
     * Gets the Coloured Annotation CC Value
     */
    ColouredAnnotationsHelper.getColouredAnnotationCCValue = function () {
        return configurablecharacteristicshelper.getCharacteristicValue('ColouredAnnotations');
    };
    /**
     * get the colored annotation cc value by markschemegroup id
     */
    ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId = function () {
        var qigId = qigstore.instance.selectedQIGForMarkerOperation !== undefined ?
            qigstore.instance.selectedQIGForMarkerOperation.markSchemeGroupId : 0;
        return configurablecharacteristicshelper.getCharacteristicValue('ColouredAnnotations', qigId);
    };
    /**
     * Gets the DefaultAnnotationColour for the QIG
     */
    ColouredAnnotationsHelper.getColouredAnnotationDefaultColourForTheQIG = function () {
        var colorStatus = ColouredAnnotationsHelper.getColouredAnnotationStatusForTheQIG();
        if (colorStatus !== undefined &&
            colorStatus != null &&
            (colorStatus.toLowerCase() === enums.ConfigurableCharacteristicsColorStatus[0].toLowerCase())) {
            var colouredAnnotationCCValue = ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId();
            var xmlHelperObj = new xmlHelper(colouredAnnotationCCValue);
            var defaultColourAttribute = xmlHelperObj.getAttributeValueByName('OriginalColour');
            if (defaultColourAttribute && defaultColourAttribute.toLocaleLowerCase() === this.colouredAnnotationCCOriginalColorTag) {
                return defaultColourAttribute;
            }
            else {
                return xmlHelperObj.getAttributeValueByName('DefaultColour');
            }
        }
        else {
            return null;
        }
    };
    /**
     * Gets the Status for the QIG
     */
    ColouredAnnotationsHelper.getColouredAnnotationStatusForTheQIG = function () {
        var colouredAnnotationCCValue = ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId();
        var xmlHelperObj;
        if (colouredAnnotationCCValue) {
            xmlHelperObj = new xmlHelper(colouredAnnotationCCValue);
            return xmlHelperObj.getAttributeValueByName('Status');
        }
        else {
            return null;
        }
    };
    /**
     * Gets the AllowHighlightColourEdit for the QIG
     */
    ColouredAnnotationsHelper.getHighlighterColouredAnnotationStatusForTheQIG = function () {
        var colouredAnnotationCCValue = ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId();
        var xmlHelperObj;
        if (colouredAnnotationCCValue) {
            xmlHelperObj = new xmlHelper(colouredAnnotationCCValue);
            return xmlHelperObj.getAttributeValueByName('AllowHighlightColourEdit');
        }
        else {
            return null;
        }
    };
    /**
     * Creates the annotation style for the stamps to be rendered on the Stamp panel
     */
    ColouredAnnotationsHelper.createAnnotationStyle = function (_annotation, dynamicAnnotationType) {
        if (_annotation === void 0) { _annotation = null; }
        return ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour(_annotation, dynamicAnnotationType);
    };
    /**
     * Creating style for default annotation colour
     */
    ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour = function (_annotation, dynamicAnnotationType) {
        // Default fill colour is RED as per requirement
        var fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(255, 0, 0, dynamicAnnotationType);
        var border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);
        if (_annotation) {
            if (ColouredAnnotationsHelper.doApplyAnnotationColour(_annotation, dynamicAnnotationType)) {
                fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(_annotation.red, _annotation.green, _annotation.blue, dynamicAnnotationType);
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
        var annotationDefaultColour = '';
        annotationDefaultColour = ColouredAnnotationsHelper.getColouredAnnotationDefaultColourForTheQIG();
        if (annotationDefaultColour !== undefined &&
            annotationDefaultColour != null &&
            ColouredAnnotationsHelper.getColouredAnnotationCCValueByMarkSchemeGroupId() !== '') {
            if (annotationDefaultColour.toLowerCase() === this.colouredAnnotationCCOriginalColorTag) {
                fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(255, 0, 0, dynamicAnnotationType);
                border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);
            }
            else {
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
    };
    /**
     * Get remark default color
     * @param dynamicAnnotationType
     */
    ColouredAnnotationsHelper.getRemarkBaseColor = function (dynamicAnnotationType) {
        // Default fill colour is RED as per requirement
        var fillColour = ColouredAnnotationsHelper.getAnnotationFillColor(255, 0, 0, dynamicAnnotationType);
        var border = ColouredAnnotationsHelper.getAnnotationBorderStyle(fillColour);
        //Added the condition to include the worklist type to get the base color of pooled remarks as well
        var baseColour = workListStore.instance.getRemarkBaseColour(markingstore.instance.currentMarkGroupId, markingstore.instance.currentResponseMode, workListStore.instance.currentWorklistType);
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
    };
    /**
     * Updating annotation colour based on a3 settings
     * TODO - updating store direct is antipattern. change this in future.
     */
    ColouredAnnotationsHelper.updateAnnotationColourIfNeeded = function (markGroupId) {
        var annotationColor = '';
        var annotation;
        var red;
        var green;
        var blue;
        // Retrieving an annotation from the marking store collection
        var examinerMarksAndAnnotations = markingstore.instance.currentExaminerMarksAgainstResponse(markGroupId);
        if (examinerMarksAndAnnotations && examinerMarksAndAnnotations.annotations) {
            for (var i = 0; i < examinerMarksAndAnnotations.annotations.length; i++) {
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
            var stampName_1 = enums.DynamicAnnotation[annotation.stamp];
            var annotationStyle_1 = ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour(annotation, enums.DynamicAnnotation[stampName_1]);
            _a = ColouredAnnotationsHelper.splitRGBA(annotationStyle_1.fill), red = _a[0], green = _a[1], blue = _a[2];
            var selectedMarkGroupId_1;
            // If the current annotation colour differs from the colour according to Assessor 3 styles
            if (annotation.red !== parseInt(red) || annotation.green !== parseInt(green) || annotation.blue !== parseInt(blue)) {
                // Looping through each of the annotations and setting the correct colour according to the Assessor 3 styles
                examinerMarksAndAnnotations.annotations.map(function (a) {
                    stampName_1 = enums.DynamicAnnotation[a.stamp];
                    var style = ColouredAnnotationsHelper.createStyleForDefaultAnnotationColour(annotation, enums.DynamicAnnotation[stampName_1]);
                    _a = ColouredAnnotationsHelper.splitRGBA(annotationStyle_1.fill), red = _a[0], green = _a[1], blue = _a[2];
                    a.isDirty = true;
                    a.red = parseInt(red);
                    a.green = parseInt(green);
                    a.blue = parseInt(blue);
                    a.markingOperation = enums.MarkingOperation.updated;
                    selectedMarkGroupId_1 = a.markGroupId;
                    markingstore.instance.updateAnnotationColourByMarkGroup(a, markGroupId);
                    var _a;
                });
                // Update the marks and annotations save queue status to Await Queueing
                markingstore.instance.updateMarksAndAnnotationsSaveQueueingStatus(markGroupId, true);
                return true;
            }
        }
        return false;
        var _a;
    };
    /**
     * Converts hex code to RGBA and RGB format.
     * @param hex
     * @param dynamicAnnotationType
     * @param returnRGB?
     */
    ColouredAnnotationsHelper.convertHexToRGBA = function (hex, dynamicAnnotationType, returnRGB) {
        if (hex) {
            hex = hex.replace('#', '');
            var a = parseInt(hex.substring(0, 2), 16);
            var r = parseInt(hex.substring(2, 4), 16);
            var g = parseInt(hex.substring(4, 6), 16);
            var b = parseInt(hex.substring(6, 8), 16);
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
    };
    /**
     * Split RGBA code
     * @param rgba
     */
    ColouredAnnotationsHelper.splitRGBA = function (rgba) {
        rgba = rgba.replace('rgba(', '');
        rgba = rgba.replace(')', '');
        return rgba.split(',');
    };
    /**
     * Checks if a particular HEXCODE is white colour
     * @param red
     * @param green
     * @param blue
     */
    ColouredAnnotationsHelper.isWhiteColour = function (red, green, blue) {
        return red === 255 && green === 255 && blue === 255;
    };
    /**
     * Checks if a particular HEXCODE is transparent by passing in the alpha component of the HEXCODE
     * @param alpha
     */
    ColouredAnnotationsHelper.isTransparentColour = function (alpha) {
        return alpha === 0;
    };
    /**
     * Returns the red colour
     */
    ColouredAnnotationsHelper.createRedColour = function () {
        return 'rgba(255, 0, 0, 1)';
    };
    /**
     * Returns whether the default colour of the annotation needs to be applied
     * @param _annotation
     */
    ColouredAnnotationsHelper.doApplyAnnotationColour = function (_annotation, dynamicAnnotation) {
        if (_annotation.isPrevious ||
            markingstore.instance.currentResponseMode === enums.ResponseMode.closed) {
            return true;
        }
        switch (dynamicAnnotation) {
            case enums.DynamicAnnotation.Highlighter:
                var colorStatus = ColouredAnnotationsHelper.getHighlighterColouredAnnotationStatusForTheQIG();
                return colorStatus === undefined ||
                    colorStatus == null ||
                    (colorStatus.toLowerCase() === enums.ConfigurableCharacteristicsHighlighterColorStatus[1].toLowerCase());
            default:
                return false;
        }
    };
    /**
     * Returns the opacity to be applied to the annotations
     * @param annotation
     */
    ColouredAnnotationsHelper.getAnnotationOpacity = function (annotation) {
        switch (annotation) {
            case enums.DynamicAnnotation.Highlighter:
                return '0.25';
            default:
                return '1';
        }
    };
    /**
     * Returns whether the remark base colour is to be applied
     * @param _annotation
     */
    ColouredAnnotationsHelper.doApplyRemarkBaseColour = function (_annotation) {
        if (_annotation) {
            return _annotation.remarkRequestTypeId > 0;
        }
        return (workListStore.instance.currentWorklistType === enums.WorklistType.directedRemark) ||
            (workListStore.instance.currentWorklistType === enums.WorklistType.pooledRemark);
    };
    /**
     * return rgba value for the annotation
     * @param red
     * @param green
     * @param blue
     * @param dynamicAnnotationType
     */
    ColouredAnnotationsHelper.getAnnotationFillColor = function (red, green, blue, dynamicAnnotationType) {
        return 'rgba(' + red + ', '
            + green + ', '
            + blue + ', '
            + ColouredAnnotationsHelper.getAnnotationOpacity(dynamicAnnotationType) + ')';
    };
    /**
     * return the border style for annotation
     * @param fillColour
     */
    ColouredAnnotationsHelper.getAnnotationBorderStyle = function (fillColour) {
        return '1px solid ' + fillColour;
    };
    /**
     * gets previous remark base color
     * @param allMarksAndAnnotation
     */
    ColouredAnnotationsHelper.getPreviousRemarkBaseColor = function (allMarksAndAnnotation) {
        var colorCode;
        if (allMarksAndAnnotation.remarkRequestTypeId > 0) {
            colorCode = allMarksAndAnnotation.baseColor;
        }
        else {
            colorCode = ColouredAnnotationsHelper.getColouredAnnotationDefaultColourForTheQIG();
        }
        var previousRemarkBaseColor = ColouredAnnotationsHelper.convertHexToRGBA(colorCode, enums.DynamicAnnotation.None, true);
        return previousRemarkBaseColor;
    };
    /**
     * returns tinted Rgba color string.
     * @param rgb
     */
    ColouredAnnotationsHelper.getTintedRgbColor = function (rgba, fraction) {
        if (fraction === void 0) { fraction = 0.6; }
        var red;
        var green;
        var blue;
        var alpha;
        _a = ColouredAnnotationsHelper.splitRGBA(rgba), red = _a[0], green = _a[1], blue = _a[2], alpha = _a[3];
        var rt = parseInt(red);
        var gt = parseInt(green);
        var bt = parseInt(blue);
        rt = Math.round(rt + (fraction * (255 - rt)));
        gt = Math.round(gt + (fraction * (255 - gt)));
        bt = Math.round(bt + (fraction * (255 - bt)));
        return 'rgba' + '(' + rt + ',' + gt + ',' + bt + ',' + alpha + ')';
        var _a;
    };
    ColouredAnnotationsHelper.colouredAnnotationCCOriginalColorTag = 'original';
    return ColouredAnnotationsHelper;
}());
module.exports = ColouredAnnotationsHelper;
//# sourceMappingURL=colouredannotationshelper.js.map