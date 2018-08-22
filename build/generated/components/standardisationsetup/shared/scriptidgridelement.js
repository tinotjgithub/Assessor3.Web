"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:disable:no-unused-variable */
var pureRenderComponent = require('../../base/purerendercomponent');
var localeStore = require('../../../stores/locale/localestore');
var stringHelper = require('../../../utility/generic/stringhelper');
var enums = require('../../utility/enums');
var standardisationActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');
var qigStore = require('../../../stores/qigselector/qigstore');
var imageZoneActionCreator = require('../../../actions/imagezones/imagezoneactioncreator');
var standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
var eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
var responseHelper = require('../../utility/responsehelper/responsehelper');
/**
 * React component class for Script id
 */
var ScriptIdGridElement = (function (_super) {
    __extends(ScriptIdGridElement, _super);
    /**
     * Constructor for ScriptIdGridElement
     * @param props
     * @param state
     */
    function ScriptIdGridElement(props, state) {
        _super.call(this, props, state);
        /**
         * This will initiate open response action
         */
        this.handleScriptClick = function (candidateScriptId) {
            var selectedScriptDetails = standardisationSetupStore.instance.fetchSelectedScriptDetails(parseInt(candidateScriptId));
            // Indicates whether script available to mark as provisional
            var isAvailable = selectedScriptDetails ? (!selectedScriptDetails.isAllocatedALive &&
                !selectedScriptDetails.isUsedForProvisionalMarking) : false;
            standardisationActionCreator.openStandardisationCentreScript(parseInt(candidateScriptId), isAvailable);
            if (eCourseworkHelper.isECourseworkComponent) {
                eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(parseInt(candidateScriptId), false, true);
            }
            imageZoneActionCreator.getImagezoneList(qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, // MarkSchemeGroupId
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod, true);
            responseHelper.openResponse(parseInt(candidateScriptId), // CandidateScriptId
            enums.ResponseNavigation.specific, enums.ResponseMode.closed, 0, // Passing MarkGroupId as 0, since we dont have markGroupId for the non-provisional response.
            enums.ResponseViewMode.zoneView); // Default view mode is Zone View, even if the response has unmanaged SLAO's.
        };
    }
    /**
     * Render component
     */
    ScriptIdGridElement.prototype.render = function () {
        var title = stringHelper.format(localeStore.instance.TranslateText('standardisation-setup.standardisation-setup-worklist.response-data.script-id-tooltip'), [
            this.props.displayText
                ? String(this.props.displayText)
                : String(this.props.displayId)
        ]);
        var displayContent;
        if (this.props.displayText) {
            displayContent = '1' + String(this.props.displayText);
        }
        else {
            displayContent = '1' + String(this.props.displayId);
        }
        return (React.createElement("a", {href: 'javascript:void(0)', id: 'script_' + this.props.id, key: 'res_key_' + this.props.id, title: title, onClick: this.handleScriptClick.bind(this, this.props.displayId)}, displayContent));
    };
    return ScriptIdGridElement;
}(pureRenderComponent));
module.exports = ScriptIdGridElement;
//# sourceMappingURL=scriptidgridelement.js.map