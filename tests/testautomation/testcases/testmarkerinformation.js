var objRepo = require("../objectrepository/objectrepository.json");
var worklistuserinformation = require("../testdata/worklistuserinformation.json");

module.exports = {

    /* Verifies whether the logged in user's name is visible. */
    TC_1493_01: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userName).to.be.visible;
    },

    /* Verifies whether the user's role is visible. */
    TC_1493_02: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userRole).to.be.visible;
    },

    /* Verifies whether the user's approval status is visible. */
    TC_1493_03: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).to.be.visible;
    },

    /* Verifies whether the user's role for an AE is displayed as expected. */
    TC_1494_01: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRoleAEText);
    },

    /* Verifies whether the user's approval status(Not Approved) displayed as expected. */
    TC_1494_02: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusNotApprovedText);
    },

    /* Verifies whether the user's approval status(Approved) and PE Role is translatable(spanish). */
    TC_1494_02_B: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusNotApprovedSpanishText);

        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRoleAESpanishText);
    },

    /* Verifies whether the user's approval status(Approved) and PE Role is translatable(french). */
    TC_1494_02_C: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusNotApprovedFrenchText);

        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRoleAEFrenchText);
    },

    /* Verifies whether the user's approval status(Not Approved) css displayed as expected. */
    TC_1494_03: function (browser) {
        browser
        .assert.cssClassPresent(objRepo.markerinformation.approvalStatusIcon, objRepo.markerinformation.notApprovedCss);
    },

    /* Verifies whether the user's role for an PE is displayed as expected. */
    TC_1494_04: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRolePEText);
    },

    /* Verifies whether the user's approval status(Approved) displayed as expected. */
    TC_1494_05: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusApprovedText);
    },

    /* Verifies whether the user's approval status(Approved) and PE Role is translatable(spanish). */
    TC_1494_05_B: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusApprovedSpanishText);

        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRolePESpanishText);
    },

    /* Verifies whether the user's approval status(Approved) and PE Role is translatable(french). */
    TC_1494_05_C: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusApprovedFrenchText);

        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRolePEFrenchText);
    },

    /* Verifies whether the user's approval status(Approved) css displayed as expected. */
    TC_1494_06: function (browser) {
        browser
        .assert.cssClassPresent(objRepo.markerinformation.approvalStatusIcon, objRepo.markerinformation.approvedCss);
    },

    /* Verifies whether the user's role for an TL is displayed as expected. */
    TC_1494_07: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRoleTLText);
    },

    /* Verifies whether the user's role for an TL is translatable(spanish). */
    TC_1494_07_B: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRoleTLSpanishText);
    },

    /* Verifies whether the user's role for an TL is translatable(french). */
    TC_1494_07_C: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userRole).text.to.equal(worklistuserinformation.markerinformation.userRoleTLFrenchText);
    },

    /* Verifies whether the user's approval status(Suspended) displayed as expected. */
    TC_1494_08: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusSuspendedText);
    },

    /* Verifies whether the user's approval status(Suspended). */
    TC_1494_08_B: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusSuspendedSpanishText);       
    },

    /* Verifies whether the user's approval status(Suspended) and TL Role is translatable(french). */
    TC_1494_08_C: function (browser) {
        browser
        .expect.element(objRepo.markerinformation.userApprovalStatus).text.to.equal(worklistuserinformation.markerinformation.userApprovalStatusSuspendedFrenchText);        
    },

    /* Verifies whether the user's approval status(Suspended) css displayed as expected. */
    TC_1494_09: function (browser) {
        browser
        .assert.cssClassPresent(objRepo.markerinformation.approvalStatusIcon, objRepo.markerinformation.suspendedCss);
    },
}