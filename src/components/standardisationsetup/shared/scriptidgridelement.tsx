/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import stringHelper = require('../../../utility/generic/stringhelper');
import enums = require('../../utility/enums');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import applicationActionCreator = require('../../../actions/applicationoffline/applicationactioncreator');
import standardisationActionCreator = require('../../../actions/standardisationsetup/standardisationactioncreator');
import markSchemeStructureActionCreator = require('../../../actions/markschemestructure/markschemestructureactioncreator');
import qigStore = require('../../../stores/qigselector/qigstore');
import imageZoneActionCreator = require('../../../actions/imagezones/imagezoneactioncreator');
import scriptActionCreator = require('../../../actions/script/scriptactioncreator');
import standardisationSetupStore = require('../../../stores/standardisationsetup/standardisationsetupstore');
import candidateScriptInfo = require('../../../dataservices/script/typings/candidatescriptinfo');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');
import Immutable = require('immutable');
import Promise = require('es6-promise');
import responseHelper = require('../../utility/responsehelper/responsehelper');

/**
 * Properties of response id column
 */
interface Props extends LocaleSelectionBase, PropsBase {
    displayId?: string;
    displayText?: string;
    isClickable?: boolean;
}

/**
 * React component class for Script id
 */
class ScriptIdGridElement extends pureRenderComponent<Props, any> {
    private actualDisplayId: string;

    /**
     * Constructor for ScriptIdGridElement
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        let title = stringHelper.format(
            localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.response-data.script-id-tooltip'
            ),
            [
                this.props.displayText
                    ? String(this.props.displayText)
                    : String(this.props.displayId)
            ]
        );

        let displayContent: string;
        if (this.props.displayText) {
            displayContent = '1' + String(this.props.displayText);
        } else {
            displayContent = '1' + String(this.props.displayId);
        }
        return (
            <a
                href='javascript:void(0)'
                id={'script_' + this.props.id}
                key={'res_key_' + this.props.id}
                title={title}
                onClick={this.handleScriptClick.bind(this, this.props.displayId)}>
                {displayContent}
            </a>
        );
    }

    /**
     * This will initiate open response action
     */
    private handleScriptClick = (candidateScriptId: string) => {

        let selectedScriptDetails: StandardisationScriptDetails = standardisationSetupStore.instance.fetchSelectedScriptDetails(
            parseInt(candidateScriptId)
		);

		// Indicates whether script available to mark as provisional
		let isAvailable = selectedScriptDetails ? (!selectedScriptDetails.isAllocatedALive &&
			!selectedScriptDetails.isUsedForProvisionalMarking) : false;

        standardisationActionCreator.openStandardisationCentreScript(
            parseInt(candidateScriptId),
            isAvailable
        );

        if (eCourseworkHelper.isECourseworkComponent) {
            eCourseworkHelper.fetchECourseWorkCandidateScriptMetadata(
                parseInt(candidateScriptId),
                false,
                true
            );
        }

        imageZoneActionCreator.getImagezoneList(
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId, // QuestionPaperId
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId, // MarkSchemeGroupId
            qigStore.instance.selectedQIGForMarkerOperation.markingMethod,
            true
        );

        responseHelper.openResponse(
            parseInt(candidateScriptId), // CandidateScriptId
            enums.ResponseNavigation.specific,
            enums.ResponseMode.closed,
            0, // Passing MarkGroupId as 0, since we dont have markGroupId for the non-provisional response.
            enums.ResponseViewMode.zoneView
        ); // Default view mode is Zone View, even if the response has unmanaged SLAO's.

    };
}

export = ScriptIdGridElement;
