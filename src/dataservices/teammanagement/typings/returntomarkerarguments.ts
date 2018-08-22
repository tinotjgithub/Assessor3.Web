import enums = require('../../../components/utility/enums');
interface ReturnToMarkerArguments {
    currentExaminerRoleId: number;
    selectedExaminerRoleId: number;
    markGroupId: number;
    markSchemeGroupId: number;
    markingModeId: enums.MarkingMode;
    selectedExaminerId: number;
}

export = ReturnToMarkerArguments;