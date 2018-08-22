import markScheme = require('./markscheme');
import cluster = require('./cluster');
interface Item {
    imageClusterId: number;
    externalImageClusterId: number;
    questionNum: string;
    questionPart?: any;
    displayLabel: string;
    externalItemNo: number;
    externalClusterNo: number;
    imageClusterName?: any;
    imageClusterZones?: any;
    acetates: any[];
    sequence: number;
    elementMarkType?: any;
    questionTag?: any;
    questionTagName?: any;
    uniqueId: number;
    questionPaperPartId: number;
    markSchemes: Immutable.List<markScheme>;
    parentClusterId: number;
    parentCluster: cluster;
}
export = Item;
