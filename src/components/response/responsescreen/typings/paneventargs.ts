import enums = require('../../../utility/enums');

interface PanEventArgs {
    elementId: string;
    xPos: number;
    yPos: number;
    panSource: enums.PanSource;
    stampId: number;
    draggedAnnotationClientToken: string;
    isAnnotationOverlapped: boolean;
    isAnnotationPlacedInGreyArea: boolean;
}

export = PanEventArgs;