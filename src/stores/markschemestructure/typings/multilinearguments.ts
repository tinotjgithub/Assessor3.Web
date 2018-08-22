import enums = require('../../../components/utility/enums');
interface Multilinearguments {
    Id?: number;
    LineIndex: number;
    PointIndex: number;
    Xcordinate: number;
    Ycordinate: number;
    MultilineItem: enums.MultiLineItems;
    DefaultAcetatePoints: Array<AcetatePoint>;
    overlayHolderId: string;
    noOfPoints: number;
    noOfLines: number;
    LineType?: enums.LineType;
    LineColor?: enums.OverlayColor;
    isShared: boolean;
}
export = Multilinearguments;
