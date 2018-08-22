import React = require('react');
import localeStore = require('../../../stores/locale/localestore');
import pureRenderComponent = require('../../base/purerendercomponent');
import worklistStore = require('../../../stores/worklist/workliststore');
import enums = require('../../utility/enums');
import Immutable = require('immutable');
import htmlUtilities = require('../../../utility/generic/htmlutilities');
import loginSession = require('../../../app/loginsession');
import messagingActionCreator = require('../../../actions/messaging/messagingactioncreator');
import markingCheckActionCreator = require('../../../actions/markingcheck/markingcheckactioncreator');
import qigStore = require('../../../stores/qigselector/qigstore');
import popupDisplayActionCreator = require('../../../actions/popupdisplay/popupdisplayactioncreator');
import constants = require('../../utility/constants');
let classNames = require('classnames');
import applicationStore = require('../../../stores/applicationoffline/applicationstore');

interface MarkingCheckPopupProps extends PropsBase, LocaleSelectionBase {
}

interface MarkingCheckPopupState {
    isMarkingCheckPopupVisible?: boolean;
    isOkButtonEnabled?: boolean;
    reRenderPopup?: number;
}

class MarkingCheckPopup extends pureRenderComponent<MarkingCheckPopupProps, MarkingCheckPopupState> {

    private recipientList: Immutable.List<MarkingCheckRecipient>;
    private markingCheckToList: Array<number>;

    /**
     * Constructor MarkingCheckPopup
     * @param markingCheckProps
     * @param markingCheckstate
     */
    constructor(markingCheckProps: MarkingCheckPopupProps, markingCheckstate: MarkingCheckPopupState) {
        super(markingCheckProps, markingCheckstate);

        this.state = {
            isMarkingCheckPopupVisible: false,
            isOkButtonEnabled: false,
            reRenderPopup: 0
        };
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        this.addEventListeners();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        this.removeEventListeners();
    }

    /**
     * Component render
     */
    public render(): JSX.Element {
        let that = this;
        let markCheckButtonOffset;

        let markingCheckButton = htmlUtilities.getElementById('marking_check_button_id');
        if (markingCheckButton) {
            markCheckButtonOffset = markingCheckButton.getBoundingClientRect().top;
        }

        let popupContentHeight: React.CSSProperties = {
            maxHeight: 'calc(100vh - ' + markCheckButtonOffset + 'px - 70px)'// 70px is the border padding
        };

        let popupWrapTop: React.CSSProperties = {
            top: markCheckButtonOffset + 'px'
        };

        let PE: JSX.Element = null;

        if (this.recipientList) {

            let pe = this.recipientList.filter((marker: MarkingCheckRecipient) => marker.isPrincipalExaminer).toArray();
            if (pe && pe.length > 0) {
                PE = (<div className='approval-options'>
                    <input id={'examiner_' + pe[0].examinerId}
                        className='checkbox show-remark'
                        type='checkbox'
                        disabled = {pe[0].hasActiveMarkingCheck || !pe[0].isEligibleForMarkingCheck}
                        checked = {pe[0].hasActiveMarkingCheck || pe[0].isChecked}
                        onChange = {() => { that.onCheckBoxClick(pe[0].examinerId, pe[0].isChecked); } }
                        />
                    <label className='remark-label'
                        htmlFor={'examiner_' + pe[0].examinerId}>{that.getMarkerLabel(pe[0]) }</label>
                </div>);
            }
        }

        let MARKERS = this.recipientList ?
            this.recipientList.map((marker: MarkingCheckRecipient) => {
                if (!marker.isPrincipalExaminer) {
                    return (<div className='approval-options'>
                        <input id={'examiner_' + marker.examinerId}
                            className='checkbox show-remark'
                            type='checkbox'
                            disabled = {marker.hasActiveMarkingCheck || !marker.isEligibleForMarkingCheck}
                            checked = {marker.hasActiveMarkingCheck || marker.isChecked}
                            onChange = {() => { that.onCheckBoxClick(marker.examinerId, marker.isChecked); } }
                            />
                        <label className='remark-label'
                            htmlFor={'examiner_' + marker.examinerId}>{that.getMarkerLabel(marker) }</label>
                    </div>);
                }
            }) : null;

        return (
            <div id='RequestMarkingCheckPopupOverlay'
                className={classNames('popup small request-marking-check popup-overlay',
                {'open': this.state.isMarkingCheckPopupVisible }) }
                role='dialog'>
                <div className='popup-wrap' id='RequestMarkingCheckPopupId' style={popupWrapTop}>
                    <div id='popup1Desc' className='popup-content' style={popupContentHeight}>
                        <p id='despt_id' className='despt'>
                            {localeStore.instance.TranslateText('marking.worklist.request-marking-check-menu.header') }</p>
                        {PE}
                        {MARKERS}
                    </div>
                    <div className='popup-footer text-right'>
                        <button className='button rounded close-button'
                            title='Cancel' onClick = {this.cancelClick}>
                            {localeStore.instance.TranslateText('generic.user-menu.profile-section.cancel-email-button') }</button>
                        <button className='button primary rounded'
                             title='Ok' onClick = {this.okClick}
                            disabled = {!this.isOkButtonEnabled() }>
                            {localeStore.instance.TranslateText('team-management.examiner-worklist.change-status.ok-button') }</button>
                    </div>
                </div>
            </div>);
    }

    /**
     * Add all event listeners here
     */
    private addEventListeners() {
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED,
            this.markingCheckButtonClicked);
    }

    /**
     * Remove all event listeners here.
     */
    private removeEventListeners() {
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARKING_CHECK_RECIPIENT_LIST_UPDATED,
            this.markingCheckButtonClicked);
    }

    /**
     * Gets the marker label to be shown in marking check popup
     * @param marker
     */
    private getMarkerLabel = (marker: MarkingCheckRecipient): string => {

        let labelText: string = marker.fullname;

        if (!marker.isEligibleForMarkingCheck) {
            if (marker.approvalStatus === enums.ExaminerApproval.Suspended && marker.hasActiveMarkingCheck) {
                labelText += ' (' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.Suspended') +
                    '-' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.CheckRequested') + ')';
            } else if (marker.approvalStatus === enums.ExaminerApproval.Suspended ||
                marker.approvalStatus === enums.ExaminerApproval.NotApproved) {
                labelText += ' (' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.' +
                    enums.ExaminerApproval[marker.approvalStatus]) + ')';
            }
        } else if (marker.hasActiveMarkingCheck) {

            labelText += ' (' + localeStore.instance.TranslateText('marking.worklist.marking-check-status.CheckRequested') + ')';
        }

        return labelText;
    }

    /**
     * Toggles the marking check popup
     */
    private toggleMarkingCheckPopup = (): void => {

        this.setState({ isMarkingCheckPopupVisible: !this.state.isMarkingCheckPopupVisible });
    }

    /**
     * Initiates the popup with latest data
     */
    private markingCheckButtonClicked = (): void => {
        this.markingCheckToList = new Array<number>();
        this.recipientList = worklistStore.instance.markingCheckRecipientList;
        if (this.recipientList && this.recipientList.count() > 0) {
            this.toggleMarkingCheckPopup();
        } else {
            markingCheckActionCreator.toggleRequestMarkingCheckButton(false);
            if (applicationStore.instance.isOnline) {
                popupDisplayActionCreator.popUpDisplay(
                    enums.PopUpType.NoMarkingCheckRequestPossible,
                    enums.PopUpActionType.Show,
                    enums.SaveAndNavigate.none,
                    { popupContent: '' } );
            }
        }
    }

    /**
     * Indicates whether the OK button is enabled
     */
    private isOkButtonEnabled = (): boolean => {
        return this.recipientList ?
            this.recipientList.some((marker: MarkingCheckRecipient) => marker.isChecked) : false;
    }

    /**
     * On Popup ok click
     */
    private onCheckBoxClick = (examinerId: number, currentState: boolean) => {

        this.recipientList.find(function (marker) {
            return marker.examinerId === examinerId;
        }).isChecked = !currentState;
        this.setState({ reRenderPopup: Date.now() });
    }

    /**
     * On Popup ok click
     */
    private okClick = () => {
        this.toggleMarkingCheckPopup();
        let that = this;
        let systemMessagePriority: number = constants.SYSTEM_MESSAGE;

        this.recipientList.map(function (marker: MarkingCheckRecipient) {
            if (marker.isChecked) {
                that.markingCheckToList.push(marker.examinerId);
            }
        });

        let questionPaperId = qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId;
        let markSchemeGroupId = qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId;
        messagingActionCreator.sendExaminerMessage(this.markingCheckToList,
            '', '', questionPaperId, null, enums.MessagePriority.Important,
            markSchemeGroupId, null, -1, -1, false, null, enums.SystemMessage.CheckMyMarks);

        messagingActionCreator.sendExaminerMessage(this.markingCheckToList,
            '', '', questionPaperId, null, systemMessagePriority,
            markSchemeGroupId, null, -1, -1, false, null, enums.SystemMessage.CheckMyMarks);
    }

    /**
     * On Popup cancel click
     */
    private cancelClick = () => {
        this.toggleMarkingCheckPopup();
        markingCheckActionCreator.toggleRequestMarkingCheckButton(false);
    }

}
export = MarkingCheckPopup;