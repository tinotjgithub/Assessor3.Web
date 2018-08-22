import returnBase = require('../../../dataservices/base/returnbase');

interface SimulationModeExitedQigList extends returnBase {
    qigList: Immutable.List<SimulationModeExitedQig>;
}

export = SimulationModeExitedQigList;