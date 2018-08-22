/**
 * Arguments required to request a remark
 */

interface RequestRemarkArguments {
    markGroupIds: Array<number>;
    examinerRoleId: number;
    remarkTypeId: number;
    examinerId: number;
    worklistType: number;
    responseMode: number;
    remarkRequestType: number;
    isWholeResponseRemarkRequest: boolean;
}