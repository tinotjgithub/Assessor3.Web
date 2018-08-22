import React = require('react');
import stampData = require('../../../../../../stores/stamp/typings/stampdata');
import annotation = require('../../../../../../stores/response/typings/annotation');
import enums = require('../../../../../utility/enums');

interface StampBaseProps extends LocaleSelectionBase, PropsBase {
    uniqueId?: string;
    clientToken?: string;
    stampData?: stampData;
    annotationData?: annotation;
    leftPos?: number;
    topPos?: number;
    wrapperStyle?: React.CSSProperties;
    isActive?: boolean;
    isDisplayingInScript?: boolean;
    toolTip?: string;
    onContextMenu?: Function;
    imageZones?: ImageZone;
    onPanStart?: Function;
    onPanEnd?: Function;
    onPanMove?: Function;
    onTouchHold?: Function;
    imageWidth?: number;
    imageHeight?: number;
    getAnnotationOverlayElement?: Function;
    getMarkSheetContainerProperties?: Function;
    isRemoveBorder?: boolean;
    drawDirection?: enums.DrawDirection;
    isDrawEnd?: boolean;
    isVisible?: boolean;
    isInFullResponseView?: boolean;
}

export = StampBaseProps;