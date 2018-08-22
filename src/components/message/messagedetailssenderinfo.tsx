import React = require('react');
import enums = require('../utility/enums');
import messageHelper = require('../utility/message/messagehelper');
import localeStore = require('../../stores/locale/localestore');
import messageTranslationHelper = require('../utility/message/messagetranslationhelper');
import MessageInfo = require('./messageinfo');
import qigStore = require('../../stores/qigselector/qigstore');
import stringHelper = require('../../utility/generic/stringhelper');

interface MessageDetailsSenderInfoProps extends LocaleSelectionBase, PropsBase {
    message: Message;
    messageDetails: MessageDetails;
    onDisplayIdClick?: Function;
    selectedTab: enums.MessageFolderType;
}

/**
 * Message Details header section which contains time , sender name and associated response details
 * @param props
 */
const messageDetailsSenderInfo: React.StatelessComponent<MessageDetailsSenderInfoProps> = (props: MessageDetailsSenderInfoProps) => {
    /**
     * Handles the Click Event of Display ID
     */
    const onDisplayIdClick = () => {

        props.onDisplayIdClick();
    };

    /**
     * Render Display Id as link Only If the examiner has access to view the script
     */
    const renderDisplayIDControl = () => {
        if (props.selectedTab !== enums.MessageFolderType.None && props.selectedTab !== enums.MessageFolderType.Deleted &&
            props.messageDetails.hasPermissionToDisplayId && props.messageDetails.hasPermissionInStdSetupWorklist) {
            return <a onClick={onDisplayIdClick} id={props.id + '-response-id'}>
                {messageHelper.getMarkingModeText(props.messageDetails.markingModeId,
                    props.messageDetails.isElectronicStandardisationTeamMember)}
                {getDisplayId()}</a>;
        } else {
            let displayIdNoLinkTooltip = stringHelper.format(
                localeStore.instance.TranslateText('assessor3.message.display-id-no-link-tooltip'),
                [String(String.fromCharCode(179))]);
            return <span title={displayIdNoLinkTooltip}
                id={props.id + '-response-id-read-only'}>
                {messageHelper.getMarkingModeText(props.messageDetails.markingModeId,
                    props.messageDetails.isElectronicStandardisationTeamMember)}
                {getDisplayId()}</span>;
        }
    };

    /**
     * Show the displayId label only if there are any associated response with the message
     */
    const renderDisplayIDArea = () => {
        let displayIdText = localeStore.instance.TranslateText('messaging.message-lists.message-detail.associated-response-id') + ' ';
        if (props.messageDetails.displayId != null) {
            return (
                <div className='msg-response-id' id={ props.id + '-response-data'}>
                    <span className='dim-text' id={ props.id + '-response-text'}>
                        {displayIdText}
                    </span>
                    {renderDisplayIDControl() }
                </div>
            );
        }
    };

    /**
     * to render message recipients list
     */
    const renderMessageRecipientList = () => {
        if (props.message && props.message != null) {
            return (<MessageInfo
                id='msg-to'
                key ='msg-to'
                selectedLanguage={props.selectedLanguage}
                message = {props.message}/>
            );
        }
    };

    return (
        <div className='msg-exp-metainfo-row2'>
            {renderMessageRecipientList() }
            {renderDisplayIDArea() }
        </div>
    );

    /**
     * This method will returns the displayId for system messages with prefix 6
     */
    function getDisplayId() {
        // If selected message is a system message then returns displayId with prefix 6
        if (props.message.examBodyMessageTypeId != null && props.message.examBodyMessageTypeId !== enums.SystemMessage.None) {
            return '6' + props.messageDetails.displayId;
        } else {
            return props.messageDetails.displayId;
        }
    }
};

export = messageDetailsSenderInfo;