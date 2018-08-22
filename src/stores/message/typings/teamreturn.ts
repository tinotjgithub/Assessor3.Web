import ReturnBase = require('../../../dataservices/base/returnbase');

interface TeamReturn extends ReturnBase {
    team: ExaminerInfo;
}
export = TeamReturn;