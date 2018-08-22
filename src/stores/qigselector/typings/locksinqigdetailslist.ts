import returnBase = require('../../../dataservices/base/returnbase');

interface LocksInQigDetailsList extends returnBase {
    locksInQigDetailsList: Immutable.List<LocksInQigDetails>;
}

export = LocksInQigDetailsList;