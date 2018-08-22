/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import markingStore = require('../../../stores/marking/markingstore');
import worklistStore = require('../../../stores/worklist/workliststore');
let classNames = require('classnames');
import constants = require('../../utility/constants');
import enums = require('../../utility/enums');
import GenericPopupWithRadioButton = require('../../utility/genericpopupwithradiobuttons');
import GenericButton = require('../../utility/genericbutton');
import genericRadioButtonItems = require('../../utility/genericradiobuttonitems');
import teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
import teammanagementStore = require('../../../stores/teammanagement/teammanagementstore');
import responseStore = require('../../../stores/response/responsestore');
import messageTranslationHelper = require('../../utility/message/messagetranslationhelper');
import supervisorSamplingCommentArguments = require('../../../dataservices/teammanagement/typings/supervisorsamplingcommentarguments');
import teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
import qigStore = require('../../../stores/qigselector/qigstore');
import operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
import storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
import storageAdapterFactory = require('../../../dataservices/storageadapters/storageadapterfactory');
import comparerList = require('../../../utility/sorting/sortbase/comparerlist');
import sortHelper = require('../../../utility/sorting/sorthelper');
import domManager = require('../../../utility/generic/domhelper');
import teamManagementLoggingHelper = require('../../utility/teammanagement/teammanagementlogginghelper');
import loggerConstants = require('../../utility/loggerhelperconstants');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');
import localeStore = require('../../../stores/locale/localestore');


/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    samplingRenderedOn?: number;
}

interface State {
    renderedOn?: number;
    doHide?: boolean;
    doDisable?: boolean;
}

/**
 * sampling component.
 * @param {Props} props
 * @returns
 */
class Sampling extends pureRenderComponent<Props, State> {

    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);
        this.state = {
            renderedOn: 0,
            doHide: true,
            doDisable: responseStore.instance.sampleReviewCommentCreatedBy !== 0 &&
            responseStore.instance.sampleReviewCommentCreatedBy !== teamManagementStore.instance.selectedExaminerRoleId
        };
        this._onClick = this.handleOnClick.bind(this);
    }

    private items: Array<genericRadioButtonItems>;
    private sampleReviewCommentId: enums.SampleReviewComment = enums.SampleReviewComment.None;
    private _storageAdapterHelper = new storageAdapterHelper();
    private _onClick: EventListenerObject = null;

    /**
     * To get the button name along with comment selected for the sampling button
     */
    private getSamplingButtonContentWithSelectedComment = () => {
        let childElement: Array<JSX.Element> = new Array<JSX.Element>();
        childElement.push(< span id='supervisor- review - button - text'
            className='padding-left-5 padding-right-10' > {localeStore.instance.
                TranslateText('team-management.response.mark-scheme-panel.supervisor-sampling-button')}</span >);
        // The comment id text has to be added only when there is a selected text
        if (this.sampleReviewCommentId !== enums.SampleReviewComment.None) {
            childElement.push(<span id='supervisor-review-comment-text' className='supervisor-selcted small-text'>{localeStore.instance.
                TranslateText('team-management.response.supervisor-sampling-comments.' + this.sampleReviewCommentId)}</span>);
        }

        return childElement;
    }

    /**
     * Render method
     */
    public render() {

        return (<div className=
            {classNames('supervisor-sampling-holder dropdown-wrap up white supervisor-remark-decision',
                { 'open': !this.state.doHide })} >
            <GenericButton id='supervisor-sampling'
                className='button rounded primary set-reviewed  menu-button'
                selectedLanguage={this.props.selectedLanguage}
                key='key_supervisor-sampling'
                onClick={this.onSamplingButtonClick.bind(this)}
                disabled={this.state.doDisable}
                childrens={this.getSamplingButtonContentWithSelectedComment()}
                buttonType={enums.ButtonType.Sampling} />
            <div className='menu' id='supervisor-sampling-wrapper'>
                <div className='eur-reason-options'>
                    <GenericPopupWithRadioButton
                        className='supervisor-select-options'
                        id='popup-supervisor-sampling'
                        items={this.items}
                        selectedLanguage={this.props.selectedLanguage}
                        onCheckedChange={this.onCheckedChange}
                        renderedOn={this.state.renderedOn}
                        key='key-popup-supervisor-sampling' />
                </div>
            </div>
        </div >);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        this.populateData();
        window.addEventListener('click', this._onClick);
        teammanagementStore.instance.addListener(teammanagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT,
            this.onSamplingStatusChanged);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._onClick);
        teammanagementStore.instance.removeListener(teammanagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT,
            this.onSamplingStatusChanged);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    }

    /**
     * Component will receive props
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps !== this.props) {
            this.populateData();
            this.setState({
                doDisable: responseStore.instance.sampleReviewCommentCreatedBy !== 0 &&
                responseStore.instance.sampleReviewCommentCreatedBy !== teamManagementStore.instance.selectedExaminerRoleId
            });
        }
    }

    /**
     * Handle click events on the window
     * @param {any} source - The source element
     */
    private handleOnClick = (source: any): any => {
        if (source.target !== undefined &&
            domManager.searchParentNode(source.target, function (el: any) {
                return el.id === 'supervisor-sampling-wrapper' || el.id === 'supervisor-sampling';
            }) == null) {
            if (this.state.doHide !== undefined && this.state.doHide === false) {
                this.setState({ doHide: true });
            }
        }
    };

    /**
     * handling after updating sampling status in store
     * @param isAlreadysampled
     */
    private onSamplingStatusChanged = (supervisorSamplingCommentReturn: SupervisorSamplingCommentReturn) => {

        // deleting cache data to retrieving updated data
        storageAdapterFactory.getInstance().deleteData('worklist',
            this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(
                worklistStore.instance.currentWorklistType,
                worklistStore.instance.getResponseMode,
                enums.RemarkRequestType.Unknown, operationModeHelper.examinerRoleId))
            .catch();

        let _doDisable: boolean = false;
        if (supervisorSamplingCommentReturn.isSampled) {
            this.sampleReviewCommentId = enums.SampleReviewComment.None;
            _doDisable = true;
        }
        this.setState({
            renderedOn: Date.now(),
            doDisable: _doDisable
        });
    }

    /**
     * On clicking items in radio button popup
     * @param item
     */
    private onCheckedChange = (item: genericRadioButtonItems) => {
        if (item.id !== this.sampleReviewCommentId) {
            this.updateData(item);
        }
        return false;
    }

    /**
     * On clicking sampling button
     * @param items
     */
    private onSamplingButtonClick() {
        this.setState({
            doHide: !this.state.doHide
        });
    }

    /**
     * adding items to radio buttons
     */
    private populateData() {
        this.items = new Array<genericRadioButtonItems>();
        let obj: genericRadioButtonItems;
        this.sampleReviewCommentId = responseStore.instance.sampleReviewCommentId;
        for (let item in enums.SampleReviewComment) {
            if (parseInt(item) >= 0) {
                let commentItem = parseInt(item);
                obj = new genericRadioButtonItems();
                obj.isChecked = commentItem === responseStore.instance.sampleReviewCommentId ? true : false;

                obj.name = localeStore.instance.TranslateText('team-management.response.supervisor-sampling-comments.' + commentItem);
                obj.id = commentItem;
                switch (commentItem) {
                    case enums.SampleReviewComment.None:
                        obj.sequenceNo = 1;
                        break;
                    case enums.SampleReviewComment.Sampled_Feedback_Given:
                        obj.sequenceNo = 2;
                        break;
                    case enums.SampleReviewComment.Sampled_Action_Reqd:
                        obj.sequenceNo = 3;
                        break;
                    case enums.SampleReviewComment.Sampled_OK:
                        obj.sequenceNo = 4;
                        break;
                }
                this.items.push(obj);
            }
        }
        let _sampleReviewCommentComparer = 'SampleReviewCommentComparer';
        sortHelper.sort(this.items, comparerList[_sampleReviewCommentComparer]);
    }

    /**
     * updating item to with the selected status
     */
    private updateData(item: genericRadioButtonItems) {

        // disabling the button untill the db call completes,
        // after completing button will gets enabled
        // updating the checked property
        this.updateSamplingData(item.id);

        let args: supervisorSamplingCommentArguments = {
            markGroupId: markingStore.instance.currentMarkGroupId,
            samplingCommentId: item.id,
            supervisorRoleId: teamManagementStore.instance.selectedExaminerRoleId ?
                teamManagementStore.instance.selectedExaminerRoleId : operationModeHelper.examinerRoleId,
            subordinateExaminerId: teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerId : 0,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
        };

        // update the sampling status to db
        teamManagementActionCreator.samplingStatusChange(args,
            responseStore.instance.selectedDisplayId);

        // Log supervisor sampling details
        new teamManagementLoggingHelper().logSupervisorSamplingChanges(
            loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION,
            loggerConstants.TEAMMANAGEMENT_TYPE_SUPERVISOR_SAMPLING,
            args);
    }

	/**
	 * Indicating network connection has resetted
	 */
    private networkStatusChanged = (): void => {
        // enabling the button in offline scenario if the button is in enabled mode
        if (this.state.doDisable) {
            this.updateSamplingData(responseStore.instance.sampleReviewCommentId);
        }
    };

    /**
     * update the item to be updated
     * @param itemToBeUpdated
     */
    private updateSamplingData(itemToBeUpdated: number) {
        let doUpdate = applicationStore.instance.isOnline;
        // updating the checked property if the system is in online mode
        if (doUpdate) {
            this.sampleReviewCommentId = itemToBeUpdated;
            this.items.map((i: genericRadioButtonItems) => {
                i.isChecked = i.id === itemToBeUpdated ? true : false;
            });
        }

        // disable/hide if the system is in online, donot disable/hide in offline mode
        this.setState({
            renderedOn: Date.now(),
            doHide: doUpdate,
            doDisable: doUpdate
        });
    }
}

export = Sampling;