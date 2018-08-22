/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import GenericButton = require('../utility/genericbutton');
import qigStore = require('../../stores/qigselector/qigstore');
import qigInfo = require('../../stores/qigselector/typings/qigsummary');
import keyCodes = require('../../utility/keyboardacess/keycodes');
import enums = require('../utility/enums');
import worklistActionCreator = require('../../actions/worklist/worklistactioncreator');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import actiontypes = require('../../actions/base/actiontypes');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import localeStore = require('../../stores/locale/localestore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import loginStore = require('../../stores/login/loginstore');
import navigationHelper = require('../utility/navigation/navigationhelper');
import responseSearchHelper = require('../../utility/responsesearch/responsesearchhelper');
import applicationstore = require('../../stores/applicationoffline/applicationstore');
import applicationactioncreator = require('../../actions/applicationoffline/applicationactioncreator');
let classNames = require('classnames');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');

/**
 * Properties of a QigItemActionColumn
 */
interface QigItemActionColumnProps extends PropsBase, LocaleSelectionBase {
    containerPage?: enums.PageContainers;
    qigValidationResult: qigValidationResult;
    qig: qigInfo;
}

/**
 * React stateless component for QigItemActionColumn on qig selector
 */
const qigItemActionColumn = (props: QigItemActionColumnProps) => {
    /**
     * return the current qig
     */
    const getCurrentQIG = (): qigInfo => {
        return qigStore.instance.getOverviewData.qigSummary.filter((qig: qigInfo) =>
            qig.markSchemeGroupId === props.qig.markSchemeGroupId).first();
    };

    /**
     * Method which gets called on the click of My Marking button of a QIG
     */
    const navigateToWorklistOnMarkingClick = () => {

        // set the marker operation mode as Marking
        userInfoActionCreator.changeOperationMode(enums.MarkerOperationMode.Marking);

        // Reset the response mode to Open. to show the Open tab selected
        worklistActionCreator.responseModeChanged(enums.ResponseMode.open);

        // Invoke the action creator to Open the QIG
        qigSelectorActionCreator.openQIG(props.qig.markSchemeGroupId);

        navigationHelper.loadWorklist();
    };

    /**
     * Method which gets called on the click of My Marking button of a QIG
     */
    const onMarkButtonClick = (keyEvent: any) => {
        if (!applicationstore.instance.isOnline) {
            applicationactioncreator.checkActionInterrupted();
        } else {
            if (loginStore.instance.isAdminRemarker && props.qig.examinerRoleId === 0) {
                let createAdminRemarkerPromise = qigSelectorActionCreator.createAdminRemarkerRole(props.qig.markSchemeGroupId,
                    function () {
                        navigateToWorklistOnMarkingClick();
                    });
            } else {
                navigateToWorklistOnMarkingClick();
            }
        }
    };

    const onTeamManagementButtonClick = (keyEvent: any) => {
        // Open Team Management data
        if (!applicationstore.instance.isOnline) {
            applicationactioncreator.checkActionInterrupted();
        } else {
            responseSearchHelper.
                openTeamManagementQIGDetails(props.qig.examinerRoleId, props.qig.markSchemeGroupId, props.qig.questionPaperPartId, true);
        }
    };

    /**
     * return the components for the team management button
     * @param doRenderIcons
     * @param iconClass
     * @param toolTip
     */
    const getTeamManagementButtonComponents = (doRenderIcons: boolean, iconClass: string, toolTip: string): JSX.Element => {
        let teamManagementButton = <GenericButton id={'team_management_btn'}
            key={'key_team_management_btn'} className={'rounded btn-team-management'}
            title={localeStore.instance.TranslateText('home.qig-data.team-management-button')}
            content={localeStore.instance.TranslateText('home.qig-data.team-management-button')}
            disabled={false} onClick={onTeamManagementButtonClick} />;
        if (doRenderIcons) {
            return (<div className='stuck-lock-wrap'>
                {teamManagementButton}
                <span className={iconClass} title={toolTip} />
            </div>);
        }

        return teamManagementButton;
    };

    /**
     * render team management button
     */
    const renderTeamManagementButton = (): JSX.Element => {
        let stuckIconClass = 'sprite-icon stuck-indicator-icon';
        let lockIconClass = 'sprite-icon lock-indicator-icon';
        let iconClass = '';
        let toolTip = '';
        if (props.qig.hasAnyLockedExaminers) {
            iconClass = lockIconClass;
            toolTip = localeStore.instance.TranslateText('home.qig-data.team-management-button-locked-examiners-tooltip');
        } else if (props.qig.hasAnyStuckExaminers) {
            iconClass = stuckIconClass;
            toolTip = localeStore.instance.TranslateText('home.qig-data.team-management-button-stuck-examiners-tooltip');
        }

        // iconClass will be '' when we dont need to render the icons
        return getTeamManagementButtonComponents(iconClass !== '', iconClass, toolTip);
    };

	/**
	 * To check whether simulation marking is enabled with Standardisation
	 */
    const isSimulationMarkingEnabledWithStandardisation = (): boolean => {
        return props.qig.isStandardisationSetupButtonVisible && props.qig.examinerQigStatus === enums.ExaminerQIGStatus.Simulation;
    };

	/**
	 * Get the className for marking Button
	 */
    let className = classNames(
        'rounded',
        { 'primary': !isSimulationMarkingEnabledWithStandardisation()},
        {'btn-simulation-marking': isSimulationMarkingEnabledWithStandardisation()},
        {'btn-my-marking': !isSimulationMarkingEnabledWithStandardisation()}
    );

    let markingButton = props.qig.isMarkingEnabled ? (
        <GenericButton
            id={'marking_btn'}
            key={'key_marking_btn'}
            className={className}
            title={isSimulationMarkingEnabledWithStandardisation() ?
                localeStore.instance.TranslateText('home.qig-data.simulation-marking-button') :
                localeStore.instance.TranslateText('home.qig-data.my-marking-button')}
            content= {isSimulationMarkingEnabledWithStandardisation() ?
					localeStore.instance.TranslateText('home.qig-data.simulation-marking-button') :
                    localeStore.instance.TranslateText('home.qig-data.my-marking-button')}
            disabled={false}
            onClick={onMarkButtonClick} />
    ) : null;

    let teamManagementButton = props.qig.isTeamManagementEnabled ? renderTeamManagementButton() : null;

    return (
        <div className='qig-col5 shift-right qig-col vertical-middle'>
            <div className='middle-content text-center' >
                {markingButton}
                {teamManagementButton}
            </div>
        </div>
    );
};
export = qigItemActionColumn;