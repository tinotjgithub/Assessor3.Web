import answerItem = require('./answeritem');
import markScheme = require('./markscheme');
import cluster = require('./cluster');
interface ResponseItem extends answerItem {
        uniqueId: number;
        questionPaperPartId: number;
        markSchemes: Immutable.List<markScheme>;
        parentClusterId: number;
        parentCluster: cluster;
}
export = ResponseItem;
