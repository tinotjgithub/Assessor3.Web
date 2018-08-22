/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');
import enums = require('../../utility/enums');
import localeStore = require('../../../stores/locale/localestore');
import SendMessageLink = require('./sendmessagelink');
/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase {
    examinerName: string;
    examinerRole: number;
    approvalStatus: enums.ExaminerApproval;
    qualityFeedbackStatus: boolean;
    markingCheckStatus?: string;
    isTeamManagementMode: boolean;
    showMessagePopup: Function;
}


/**
 * React class for supervisor information.
 */
class PersonalInformation extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for personal information.
     */
    public render() {
        return (<div id='my_info_panel' className='my-info clearfix'>
            <div className='user-photo-holder user-medium-icon sprite-icon'/>
            <div className='user-details-holder'>
                <div id='user_name' className='user-name large-text'>{this.props.examinerName}</div>
                <div id='user_role' className='designation small-text'>{this.getRoleText() }</div>
                { this.renderSendMessageSection() }
                <div className='approve-status-holder padding-top-5'>
                    <span className={this.determineStatusClass(false) }>
                        <span id='user_approval_icon' className={this.determineStatusClass(true) } />
                        <span id='user_approval_status' className='small-text padding-left-5'>{this.getApprovalStatusText() }</span>
                        {this.props.markingCheckStatus ?
                            <span id = 'marking_check_status_id' className= 'check-request-status'>
                                {'(' + this.props.markingCheckStatus + ')'}
                            </span> : null}
                    </span>
                </div>
            </div>
        </div>);
    }

    /**
     * Render Send Message Link for Team Management
     */
    private renderSendMessageSection() {
        if (this.props.isTeamManagementMode) {
            return <SendMessageLink onClick = { this.props.showMessagePopup } id ='sendMsg' key='sendMsg' />;
        }
    }

    /**
     * Return the Approval Status text.(localized)
     */
    private getApprovalStatusText() {

        // status text for quality feedback status.
        if (this.props.qualityFeedbackStatus) {
            let approvalStatusText = '';
            approvalStatusText = 'qig-statuses.' + enums.ExaminerQIGStatus[11];
            return localeStore.instance.TranslateText('home.' + approvalStatusText);
        } else {
            let approvalStatusText = '';
            approvalStatusText = 'approval-statuses.' + enums.ExaminerApproval[this.props.approvalStatus];
            return localeStore.instance.TranslateText('generic.' + approvalStatusText);
        }
    }

    /**
     * Return the Role text.(localized)
     */
    private getRoleText() {
        let roleText = '';
        roleText = 'examiner-roles.' + enums.ExaminerRole[this.props.examinerRole];
        return localeStore.instance.TranslateText('generic.' + roleText);
    }

    /**
     * Determine the class for the approval status.
     */
    private determineStatusClass(isIcon: boolean) {
        let iconClass = 'sprite-icon {0}-small-icon';
        let bubbleClass = 'bubble show {0} no-border white-bg rounded';
        let iconClassValue = 'warning';
        let bubbleClassValue = 'warning';

        switch (this.props.approvalStatus) {
            case enums.ExaminerApproval.Approved:
                iconClassValue = 'success';
                bubbleClassValue = 'success';
                break;
            case enums.ExaminerApproval.ConditionallyApproved:
            case enums.ExaminerApproval.ApprovedReview:
                iconClassValue = 'warning';
                bubbleClassValue = 'warning';
                break;
            case enums.ExaminerApproval.NotApproved:
                iconClassValue = 'not-approved';
                bubbleClassValue = 'warning';
                break;
            case enums.ExaminerApproval.Suspended:
                iconClassValue = 'error';
                bubbleClassValue = 'error';
                break;
            default:
                iconClassValue = 'warning';
                bubbleClassValue = 'warning';
                break;
        }

        // color class for quality feedback
        if (this.props.qualityFeedbackStatus) {
            iconClassValue = 'warning';
            bubbleClassValue = 'warning';
        }

        if (isIcon) {
            return iconClass.replace('{0}', iconClassValue);
        } else {
            return bubbleClass.replace('{0}', bubbleClassValue);
        }
    }
}

export = PersonalInformation;