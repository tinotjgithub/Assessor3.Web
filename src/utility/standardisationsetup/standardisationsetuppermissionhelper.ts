// Importing stores in this helper will make a circular dependency error.
import xmlHelper = require('../generic/xmlhelper');
import configurableCharacteristicsHelper = require('../configurablecharacteristic/configurablecharacteristicshelper');
import enums = require('../../components/utility/enums');
import examinerRole = require('../../stores/standardisationsetup/typings/examinerrole');
import permission = require('../../stores/standardisationsetup/typings/permissions');
import viewByClassification = require('../../stores/standardisationsetup/typings/viewbyclassification');
import view = require('../../stores/standardisationsetup/typings/view');
import classification = require('../../stores/standardisationsetup/typings/classification');
import standardisationSetupCCData = require('../../stores/standardisationsetup/typings/standardisationsetupccdata');
import Immutable = require('immutable');
import ssuStmClassificationRestriction = require('../../stores/standardisationsetup/typings/ssustmclassificationrestriction');

/**
 * Helper class for standardisation setup permission CC access.
 */
class StandardisationSetupPermissionHelper {

    /**
     * Gets Standardisation setup permission cc value.
     */
    public static getSTDSetupPermissionCCValue() {
        return configurableCharacteristicsHelper.getCharacteristicValue('StandardisationSetupPermissions');
    }

    /**
     * Gets STDSetupPermissionCC value by markscheme group id.
     */
    public static getSTDSetupPermissionCCValueByMarkSchemeGroupId(markSchemeGroupId: number) {
        return configurableCharacteristicsHelper.getCharacteristicValue('StandardisationSetupPermissions', markSchemeGroupId);
    }

    /**
     * Gets STDSetupPermission cc data ByExaminerRole.
     * @param loggedInExaminerRole 
     */
    public static getSTDSetupPermissionByExaminerRole(loggedInExaminerRole: enums.ExaminerRole,
        markSchemeGroupId: number): standardisationSetupCCData {
        let stdSetupPermissionCCValue = StandardisationSetupPermissionHelper.
            getSTDSetupPermissionCCValueByMarkSchemeGroupId(markSchemeGroupId);

        return this.generateSTDSetupPermissionData(stdSetupPermissionCCValue, loggedInExaminerRole);
    }

    /**
     * Gets STDSetupPermission data.
     * @param stdSetupPermissionCCValue
     * @param loggedInExaminerRole
     */
    public static generateSTDSetupPermissionData(stdSetupPermissionCCValue: string, loggedInExaminerRole: enums.ExaminerRole)
            : standardisationSetupCCData {
        let examinerRole: examinerRole = StandardisationSetupPermissionHelper.initializeExaminerRole();
        let viewByClassification: viewByClassification = StandardisationSetupPermissionHelper.initializeViewByClassification();
        let classification: classification = StandardisationSetupPermissionHelper.initializeClassification();
        let permission: permission = StandardisationSetupPermissionHelper.initializePermission();
        let view: view = StandardisationSetupPermissionHelper.initializeView();
        let standardisationSetupCCData: standardisationSetupCCData =
            StandardisationSetupPermissionHelper.initializeStandardisationSetupCCData();

        if (stdSetupPermissionCCValue !== '') {
            let xmlHelperObj = new xmlHelper(stdSetupPermissionCCValue);
            let allChildNodes = xmlHelperObj.getAllChildNodes();
            let childNodes;

            // fetch required child node w.r.t examinerRole.
            for (var node = 0; node < allChildNodes.length; node++) {
                if (allChildNodes && allChildNodes[node].childNodes[0].nodeName === 'Name' &&
                    StandardisationSetupPermissionHelper.
                        examinerRoleEnumFromString(allChildNodes[node].childNodes[0].firstChild.nodeValue) === loggedInExaminerRole) {
                    childNodes = allChildNodes[node].childNodes;
                }
            }

            if (childNodes) {

                // Gets examiner role name
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i].nodeName === 'Name') {
                        examinerRole.name = enums.ExaminerRole[loggedInExaminerRole];
                    }

                    // gets values in Permission nodes
                    if (childNodes[i].nodeName === 'Permissions') {
                        for (var x = 0; x < childNodes[i].childNodes.length; x++) {
                            let permissionNodeValue: string = childNodes[i].childNodes[x].firstChild.nodeValue;
                            if (permissionNodeValue !== '' && permissionNodeValue) {
                                StandardisationSetupPermissionHelper.setPermissionFlags(permission, permissionNodeValue);
                            }
                        }
                    }
                    // gets values in viewByClassification node.
                    if (childNodes[i].nodeName === 'ViewByClassification') {

                        // gets values in view nodes.
                        let viewNodes = childNodes[i].childNodes[0];
                        if (viewNodes && viewNodes.nodeName === 'Views') {
                            for (var z = 0; z < viewNodes.childNodes.length; z++) {
                                let viewNodeType: string = viewNodes.childNodes[z].firstChild.nodeValue;
                                StandardisationSetupPermissionHelper.setViewFlags(view, viewNodeType);
                            }
                        }

                        // gets values in classification nodes.
                        let classificationNodes = childNodes[i].childNodes[1];
                        if (classificationNodes && classificationNodes.nodeName === 'Classifications') {
                            for (var y = 0; y < classificationNodes.childNodes.length; y++) {
                                let classificationType: string = classificationNodes.childNodes[y].firstChild.nodeValue;
                                StandardisationSetupPermissionHelper.setClassificationFlags(classification, classificationType);
                            }
                        }
                    }
                }

                viewByClassification.classifications = classification;
                viewByClassification.views = view;
                examinerRole.permissions = permission;
                examinerRole.viewByClassification = viewByClassification;
				standardisationSetupCCData.role = examinerRole;
				standardisationSetupCCData.isLoggedInExaminerRolePresentInCC = true;
			} else {
				// If the logged in examiner role is not present in the 'StandardisationSetupPermissions' CC
                examinerRole.name = enums.ExaminerRole[loggedInExaminerRole];
                StandardisationSetupPermissionHelper.setViewFlags(view, 'Unclassified');
                examinerRole.permissions = permission;
                viewByClassification.classifications = classification;
                viewByClassification.views = view;
                examinerRole.viewByClassification = viewByClassification;
				standardisationSetupCCData.role = examinerRole;
				standardisationSetupCCData.isLoggedInExaminerRolePresentInCC = false;
            }
            return standardisationSetupCCData;
        }
    }

    /**
     * Gets SSU Classification restriction by MarkSchemeGroupId
     * @param markSchemeGroupId
     */
    public static getSsuClassificationRestrictionByMarkSchemeGroupId(markSchemeGroupId: number) {
        let stdSetupPermissionCCValue = this.getSTDSetupPermissionCCValueByMarkSchemeGroupId(markSchemeGroupId);
        let ssuStmClassificationRestriction: ssuStmClassificationRestriction
                    = StandardisationSetupPermissionHelper.initializeSsuStmClassificationRestriction();
        var xmlHelperObj = new xmlHelper(stdSetupPermissionCCValue);
        var allChildNodes = xmlHelperObj.getAllChildNodes();
        // loop roles and check if ViewByClassification - > Classifications exist for all roles
        for (var node = 0; node < allChildNodes.length; node++) {
            if (allChildNodes && allChildNodes[node].childNodes[0].nodeName === 'Name') {
                let examinerRole = this.examinerRoleEnumFromString(allChildNodes[node].childNodes[0].firstChild.nodeValue);
                let stdSetupPermissionData = this.getSTDSetupPermissionByExaminerRole(examinerRole, markSchemeGroupId);
                if (!stdSetupPermissionData.role.viewByClassification.classifications.practice) {
                    ssuStmClassificationRestriction.isPracticeRestrictedForAnyStm = true;
                }
                if (!stdSetupPermissionData.role.viewByClassification.classifications.seeding) {
                    ssuStmClassificationRestriction.isSeedingRestrictedForAnyStm = true;
                }
                if (!stdSetupPermissionData.role.viewByClassification.classifications.standardisation) {
                    ssuStmClassificationRestriction.isStandardisationRestrictedForAnyStm = true;
                }
                if (!stdSetupPermissionData.role.viewByClassification.classifications.stmStandardisation) {
                    ssuStmClassificationRestriction.isStmStandardisationeRestrictedForAnyStm = true;
                }
            }
        }

        return ssuStmClassificationRestriction;
    }

    /**
     * Sets examiner role based permissions.
     * @param value 
     */
    private static setPermissionFlags(permissions: permission, value: string) {
        switch (value) {
            case 'Complete':
                permissions.complete = true;
                break;
            case 'EditUnclassifiedNotes':
                permissions.editUnclassifiedNotes = true;
                break;
            case 'EditClassifiedNotes':
                permissions.editClassifiedNotes = true;
                break;
            case 'EditDefinitives':
                permissions.editDefinitives = true;
                break;
            case 'ViewDefinitives':
                permissions.viewDefinitives = true;
                break;
            case 'Classify':
                permissions.classify = true;
                break;
            case 'Declassify':
                permissions.declassify = true;
                break;
            case 'MultiQIGProvisionals':
                permissions.multiQIGProvisionals = true;
                break;
            case 'ReuseResponses':
                permissions.reuseResponses = true;
                break;
            case 'ViewCommonProvisionalAvailableResponses':
                permissions.viewCommonProvisionalAvailableResponses = true;
                break;
        }
    }

    /**
     * Sets examiner role based views.
     * @param view 
     */
    private static setViewFlags(view: view, viewNodeType: string) {
        switch (viewNodeType) {
            case 'Classified':
                view.classified = true;
                break;
            case 'Unclassified':
                view.unclassified = true;
                break;
        }
    }

    /**
     * Sets examiner role based classifications.
     * @param classification 
     */
    private static setClassificationFlags(classification: classification, classificationType: string) {
        switch (classificationType) {
            case 'Practice':
                classification.practice = true;
                break;
            case 'Standardisation':
                classification.standardisation = true;
                break;
            case 'STMStandardisation':
                classification.stmStandardisation = true;
                break;
            case 'Seeding':
                classification.seeding = true;
                break;
        }
    }

    /**
     * Returns enums based on ExaminerRole.
     * @param nodeName 
     */
    private static examinerRoleEnumFromString(nodeName: string): enums.ExaminerRole {
        let examinerRoleEnum: enums.ExaminerRole;
        switch (nodeName) {
            case 'Assistant Examiner':
                examinerRoleEnum = enums.ExaminerRole.assistantExaminer;
                break;
            case 'Team Leader (Examiner)':
                examinerRoleEnum = enums.ExaminerRole.teamLeader;
                break;
            case 'Principal Examiner':
                examinerRoleEnum = enums.ExaminerRole.principalExaminer;
                break;
            case 'Administrator':
                examinerRoleEnum = enums.ExaminerRole.administrator;
                break;
            case 'General Marker':
                examinerRoleEnum = enums.ExaminerRole.generalMarker;
                break;
            case 'Viewer':
                examinerRoleEnum = enums.ExaminerRole.viewer;
                break;
            case 'Assistant Principal Examiner':
                examinerRoleEnum = enums.ExaminerRole.assistantPrincipalExaminer;
                break;
            case 'Assistant Examiner (MFI SSU)':
                examinerRoleEnum = enums.ExaminerRole.assistantExaminer_MFI_SSU;
                break;
            case 'Assistant Examiner (MFI)':
                examinerRoleEnum = enums.ExaminerRole.assistantExaminer_MFI;
                break;
            case 'Subject Marker (MFI Marking Centre)':
                examinerRoleEnum = enums.ExaminerRole.subjectMarker_MFI_Marking_Centre;
                break;
            case 'Subject Marker (MFI Home)':
                examinerRoleEnum = enums.ExaminerRole.subjectMarker_MFI_Home;
                break;
            case 'Service Delivery':
                examinerRoleEnum = enums.ExaminerRole.serviceDelivery;
                break;
            case 'Super Administrator':
                examinerRoleEnum = enums.ExaminerRole.superAdministrator;
                break;
            case 'Senior Team Leader':
                examinerRoleEnum = enums.ExaminerRole.seniorTeamLeader;
                break;
            case 'Principal Moderator (Postal)':
                examinerRoleEnum = enums.ExaminerRole.principalModerator_Postal;
                break;
            case 'Auto Marker':
                examinerRoleEnum = enums.ExaminerRole.autoMarker;
                break;
            case 'Subject Marker (MFI H SSU)':
                examinerRoleEnum = enums.ExaminerRole.subjectMarker_MFI_H_SSU;
                break;
            case 'Auto-approved Senior Team Leader':
                examinerRoleEnum = enums.ExaminerRole.autoApprovedSeniorTeamLeader;
                break;
            case 'Auto Messaging':
                examinerRoleEnum = enums.ExaminerRole.autoMessaging;
                break;
            case 'Admin Remarker':
                examinerRoleEnum = enums.ExaminerRole.adminRemarker;
                break;
            case 'Assistant Examiner (Visiting)':
                examinerRoleEnum = enums.ExaminerRole.assistantExaminer_Visiting;
                break;
            default:
                examinerRoleEnum = enums.ExaminerRole.none;
                break;
        }
        return examinerRoleEnum;
    }

    /** 
     * initialize permission object.
     */
    private static initializePermission(): permission {
        let permission: permission = {
            complete: false,
            editUnclassifiedNotes: false,
            editClassifiedNotes: false,
            editDefinitives: false,
            viewDefinitives: false,
            classify: false,
            declassify: false,
            multiQIGProvisionals: false,
            reuseResponses: false,
            viewCommonProvisionalAvailableResponses: false
        };
        return permission;
    }

    /** 
     * initialize View object.
     */
    private static initializeView(): view {
        let view: view = {
            classified: undefined,
            unclassified: undefined
        };
        return view;
    }

    /** 
     * initialize Classification object.
     */
    private static initializeClassification(): classification {
        let classification: classification = {
            practice: false,
            standardisation: false,
            stmStandardisation: false,
            seeding: false
        };
        return classification;
    }

    /** 
     * initialize ExaminerRole object.
     */
    private static initializeExaminerRole(): examinerRole {
        let examinerRole: examinerRole = {
            name: '',
            permissions: undefined,
            viewByClassification: undefined,
        };
        return examinerRole;
    }

    /** 
     * initialize Viewbyclassification object.
     */
    private static initializeViewByClassification(): viewByClassification {
        let viewByClassification: viewByClassification = {
            views: undefined,
            classifications: undefined
        };
        return viewByClassification;
    }

    /** 
     * initialize standardisation setup data object.
     */
    private static initializeStandardisationSetupCCData(): standardisationSetupCCData {
        let standardisationSetupCCData: standardisationSetupCCData = {
			role: undefined,
			isLoggedInExaminerRolePresentInCC: false
        };
        return standardisationSetupCCData;
    }

    /**
     * initialize ssu stm classification restriction data object
     */
    private static initializeSsuStmClassificationRestriction(): ssuStmClassificationRestriction {
        let ssuStmClassificationRestriction: ssuStmClassificationRestriction = {
            isPracticeRestrictedForAnyStm: false,
            isSeedingRestrictedForAnyStm: false,
            isStandardisationRestrictedForAnyStm: false,
            isStmStandardisationeRestrictedForAnyStm: false
        };
        return ssuStmClassificationRestriction;
    }
}

export = StandardisationSetupPermissionHelper;