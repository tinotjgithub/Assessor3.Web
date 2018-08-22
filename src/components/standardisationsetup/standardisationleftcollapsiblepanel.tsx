import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import Header = require('../header');
import standardisationLink = require('./typings/standardisationlink');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import standardisationTargetDetail = require('../../stores/standardisationsetup/typings/standardisationtargetdetail');
import GenericButton = require('../utility/genericbutton');
import standardisationActionCreator = require('../../actions/standardisationsetup/standardisationactioncreator');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import qigStore = require('../../stores/qigselector/qigstore');
import standardisationSetupFactory = require('../../utility/standardisationsetup/standardisationsetupfactory');
import standardisationSetupHelper = require('../../utility/standardisationsetup/standardisationsetuphelper');

interface StandardisationLeftCollapsiblePanelProps extends PropsBase, LocaleSelectionBase {
    renderedON?: number;
    availableStandardisationSetupLinks: Array<standardisationLink>;
    standardisationTargetDetails: Immutable.List<standardisationTargetDetail>;
    onLinkClick: Function;
    isCompleteButtonDisabled?: boolean;
    completeButtonToolTip?: string;
    hasCompletePermission?: boolean;
    onCompleteButtonClick: Function;
}

/**
 * Props for the Panel Item holder
 */
interface PanelItemHolderProps extends PropsBase, LocaleSelectionBase {
    renderedON?: number;
    availableStandardisationSetupLinks: Array<standardisationLink>;
    onLinkClick: Function;
}

/**
 * Props for the Classification Summary Panel item
 */
interface ClassificationSummaryPanelItemProps extends PropsBase, LocaleSelectionBase {
    renderedOn?: number;
    isTargetMet: boolean;
    markingModeId: number;
    markingModeName: string;
    totalClassifiedCount: number;
    totalTargetCount: number;
    itemId: string;
}

/**
 * Props for the Classification Summary Panel
 */
interface ClassificationSummaryPanelProps extends PropsBase, LocaleSelectionBase {
    renderedON?: number;
    standardisationTargetDetails: Immutable.List<standardisationTargetDetail>;
}

/**
 * Props for the Complete setup button.
 */
interface CompleteSetupButtonProps extends LocaleSelectionBase {
    isDisabled: boolean;
    toolTip: string;
    isVisible: boolean;
    onClick: Function;
}

const standardisationLeftCollapsiblePanel: React.StatelessComponent<StandardisationLeftCollapsiblePanelProps> =
    (props: StandardisationLeftCollapsiblePanelProps) => {

        /* tslint:disable:variable-name */
        /**  
         * Get the Side Panel Element
         * @param props
         */
        const PanelItem: React.StatelessComponent<
            {
                standardisationSetupWorkList: enums.StandardisationSetup,
                renderedOn?: number,
                onLinkClick: Function,
                targetCount: number,
                panelItemclassName: string,
                openOrClose: string
            }>
            = (props:
                {
                    standardisationSetupWorkList: enums.StandardisationSetup,
                    renderedOn?: number,
                    onLinkClick: Function,
                    targetCount: number,
                    panelItemclassName: string,
                    openOrClose: string
                }) => {

                return (
                    <li id={getPanelClassName(props.standardisationSetupWorkList) + '_id'}
                        key={'collapsiblepanel-key' + props.standardisationSetupWorkList}
                        title = {getTextToDisplay(props.standardisationSetupWorkList) }
                        className={'panel ' + getPanelClassName(props.standardisationSetupWorkList) +
                            ' hand ' + props.openOrClose}
                        onClick={() => { props.onLinkClick(props.standardisationSetupWorkList); } }
                        >
                        <span className={props.panelItemclassName}>{props.targetCount}</span>
                        <a href='javascript:void(0);' className='left-menu-link panel-link'
                            id={getPanelId(props.standardisationSetupWorkList) }>
                            <span className='menu-text large-text'>{getTextToDisplay(props.standardisationSetupWorkList) }</span>
                        </a>
                    </li>
                );
            };

        /**
         * Get the Panel Holder with panels
         * @param props
         */
        const PanelItemHolder: React.StatelessComponent<PanelItemHolderProps> = (props: PanelItemHolderProps) => {
            var items: JSX.Element[];
            if (props.availableStandardisationSetupLinks !== undefined && props.availableStandardisationSetupLinks !== null) {

                items = props.availableStandardisationSetupLinks.map((x) => {
                    if (x.isVisible) {
                        return <PanelItem key={'panel-key' + x.linkName}
                            renderedOn={props.renderedON}
                            standardisationSetupWorkList={x.linkName}
                            targetCount = {x.targetCount}
                            onLinkClick={props.onLinkClick}
                            openOrClose={x.isSelected ? 'open active' : 'close'}
                            panelItemclassName={x.linkName === enums.StandardisationSetup.SelectResponse ?
                                'sprite-icon tick-circle-icon' : 'menu-count'} />;
                    }
                });
            } else {
                items = null;
            }
            return <ul className='left-menu panel-group'>{items}</ul>;
        };

        let classificationSummaryProgressIcon: JSX.Element;
        const ClassificationSummaryPanelItem: React.StatelessComponent<ClassificationSummaryPanelItemProps>
            = (props: ClassificationSummaryPanelItemProps) => {

                // To clear the previous data.
                classificationSummaryProgressIcon = null;
                let restrictedTargets = standardisationSetupStore.instance.restrictSSUTargetsCCData;
                let requiredTargets: Immutable.List<enums.MarkingMode>;

                let standardisationSetupHelper: standardisationSetupHelper = standardisationSetupFactory.
                    getStandardisationSetUpWorklistHelper(standardisationSetupStore.instance.selectedStandardisationSetupWorkList);
                if (standardisationSetupHelper !== undefined) {
                    requiredTargets = standardisationSetupHelper.getStandardisationSetupRequiredTargets();
                }
                let isExceeding: boolean = false;
                if (requiredTargets && requiredTargets.contains(props.markingModeId)) {
                    if (restrictedTargets && restrictedTargets.contains(props.markingModeId)
                        && props.totalClassifiedCount > props.totalTargetCount) {
                        classificationSummaryProgressIcon = (
                            <span id={'summaryProgressIcon-' + props.itemId}
                                className='sprite-icon tick-circle-waring-icon classification-progress-indicator'></span>
                        );
                    } else if (!props.isTargetMet) {
                        classificationSummaryProgressIcon = (
                            <span className='menu-count'>
                                <span id={'summaryProgressIcon-' + props.itemId}
                                    className='sprite-icon classification-progress-indicator dot-dot-dot-icon'></span>
                            </span>);
                    } else {
                        classificationSummaryProgressIcon = (
                            <span id={'summaryProgressIcon-' + props.itemId}
                                className='sprite-icon tick-circle-icon classification-progress-indicator'></span>);
                    }
                }

                let count = props.totalClassifiedCount + '/' + props.totalTargetCount;
                return (
                    <li id={'summaryItem-' + props.itemId}
                        key={'summaryItem-' + props.itemId}
                        className={'std-progress-item'}>
                        {classificationSummaryProgressIcon}
                        <span id={'summaryText-' + props.itemId} className={'classification-text'}>{props.markingModeName}</span>
                        <span id={'summaryCount-' + props.itemId} className={'classification-progress'}>{count}</span>
                    </li>
                );
            };

        /**
         * Get the Classification Summary Panel for displaying classification progress
         * @param props
         */
        const ClassificationSummaryPanel: React.StatelessComponent<ClassificationSummaryPanelProps> =
            (props: ClassificationSummaryPanelProps) => {
                let items: any;
                if (props.standardisationTargetDetails !== undefined && props.standardisationTargetDetails !== null) {
                    items = props.standardisationTargetDetails.map((x: standardisationTargetDetail, key: number) => {
                        return (<ClassificationSummaryPanelItem
                            id={'summaryPanel-' + getClassificationSummaryPanelId(x.markingModeId)}
                            key={'summaryPanel-' + getClassificationSummaryPanelId(x.markingModeId)}
                            renderedOn={props.renderedON}
                            isTargetMet={x.target <= x.count ? true : false}
                            markingModeId={x.markingModeId}
                            markingModeName={getMarkingModeName(x.markingModeId)}
                            totalClassifiedCount={x.count}
                            totalTargetCount={x.target}
                            itemId={getClassificationSummaryPanelId(x.markingModeId)}
                        />);
                    });
                } else {
                    items = null;
                }
                return <ul className='bottom-menu-group'>{items}</ul>;
            };

        /**
         * Get the class for individual links
         * @param standardisationSetUpLink
         */
        function getPanelClassName(standardisationSetUpLink: enums.StandardisationSetup): string {
            let className: string = '';
            switch (standardisationSetUpLink) {
                case enums.StandardisationSetup.SelectResponse:
                    className = 'panel select-response';
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    className = 'panel provisional';
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    className = 'panel unclassified';
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    className = 'panel classified';
                    break;
            }
            return className;
        }

        /**
         * Get the class for individual links
         * @param standardisationSetUpLink
         */
        function getPanelId(standardisationSetUpLink: enums.StandardisationSetup): string {
            let idString: string = '';
            switch (standardisationSetUpLink) {
                case enums.StandardisationSetup.SelectResponse:
                    idString = 'select-response-panel';
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    idString = 'provisional-response-panel';
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    idString = 'unclassify-response-panel';
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    idString = 'classified-response-panel';
                    break;
            }
            return idString;
        }

        /**
         * get Classification Summary item Id
         * @param markingModeId
         */
        function getClassificationSummaryPanelId(markingModeId: number): string {
            let idString: string = '';

            switch (markingModeId) {
                case 2:
                    idString = 'practice';
                    break;
                case 3:
                    idString = 'approval';
                    break;
                case 4:
                    idString = 'esTeamApproval';
                    break;
                case 70:
                    idString = 'seeding';
                    break;
            }
            return idString;
        }

        /**
         * Get the marking mode name from marking mode id
         * @param markingModeId
         */
        function getMarkingModeName(markingModeId: number): string {
            return localeStore.instance.TranslateText(
                'standardisation-setup.standardisation-setup-worklist.classification-type.' +
                enums.MarkingMode[markingModeId]);
        }

        /**
         * get the Display Text
         * @param standardisationSetUpLink
         */
        function getTextToDisplay(standardisationSetUpLink: enums.StandardisationSetup): string {
            let idString: string = '';
            switch (standardisationSetUpLink) {
                case enums.StandardisationSetup.SelectResponse:
                    idString = 'select-response-worklist';
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    idString = 'provisional-worklist';
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    idString = 'unclassified-worklist';
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    idString = 'classified-worklist';
                    break;
            }

            return localeStore.instance.TranslateText('standardisation-setup.left-panel.' + idString);
        }

        /**
         * The complete setup button component.
         * @param props
         */
        const CompleteSetupButton: React.StatelessComponent<CompleteSetupButtonProps> =
            (props: CompleteSetupButtonProps, propsparent: StandardisationLeftCollapsiblePanelProps) => {
                return (props.isVisible ?
                    <div className='text-center classification-button-holder'>
                    {(!qigStore.instance.selectedQIGForMarkerOperation.standardisationSetupComplete) ? <GenericButton
                        id= 'completeSetupButton'
                        key='key_completeSetupButton'
                        className='rounded classification-complete-button lite'
                        content={localeStore.instance.TranslateText('standardisation-setup.left-panel.complete-setup-button-text')}
                        onClick={props.onClick}
                        disabled={props.isDisabled}
                        title={props.toolTip} /> :
                        <span id='setupcompletesuccess' className='setup-btn-label success'>
                        {localeStore.instance.TranslateText
                        ('standardisation-setup.left-panel.complete-standardisation-setup-text')
                    }</span>}
                    </div> : null);
            };

        /**
         * Get the panel.
         */
        return (
            <div className='column-left'>
                <div className='column-left-inner'>
                    <div className='left-menu-holder'>
                        <PanelItemHolder
                            id='panel-items'
                            key='panel-items-key'
                            renderedON={props.renderedON}
                            availableStandardisationSetupLinks={props.availableStandardisationSetupLinks}
                            onLinkClick={props.onLinkClick} />
                    </div>
                    <div className='left-menu-holder bottom-menu-holder std-progress-holder'>
                        <ClassificationSummaryPanel
                            id='classification-summary-panel'
                            key='classification-summary-panel-key'
                            renderedON={props.renderedON}
                            standardisationTargetDetails={props.standardisationTargetDetails} />
                        <CompleteSetupButton
                            isDisabled={props.isCompleteButtonDisabled}
                            onClick={props.onCompleteButtonClick}
                            toolTip={props.completeButtonToolTip}
                            isVisible={props.hasCompletePermission} />
                    </div>
                </div>
            </div>
        );
    };
export = standardisationLeftCollapsiblePanel;

