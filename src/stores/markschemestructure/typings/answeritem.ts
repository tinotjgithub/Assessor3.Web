import markScheme = require('./markscheme');
interface AnswerItem {
        imageClusterId: number;
        externalImageClusterId: number;
        questionNum: string;
        questionPart?: any;
        displayLabel: string;
        externalItemNo: number;
        externalClusterNo: number;
        imageClusterName?: string;
        imageClusterZones?: Immutable.List<ImageZone>;
        sequence: number;
        elementMarkType?: string;
        questionTag?: string;
        questionTagName?: string;
        uniqueId: number;
        questionPaperPartId: number;
        markSchemes: Immutable.List<markScheme>;
        parentClusterId: number;
}
export = AnswerItem;