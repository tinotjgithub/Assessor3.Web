/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import stringHelper = require('../../utility/generic/stringhelper');
import localeStore = require('../../stores/locale/localestore');
import constants = require('../utility/constants');
import ConfirmationDialog = require('../utility/confirmationdialog');
import enums = require('../utility/enums');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import qigStore = require('../../stores/qigselector/qigstore');
import acceptQualityFeedbackActionCreator = require('../../actions/response/acceptqualityfeedbackactioncreator');
import worklistStore = require('../../stores/worklist/workliststore');
import responseStore = require('../../stores/response/responsestore');
import markingHelper = require('../../utility/markscheme/markinghelper');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import messageStore = require('../../stores/message/messagestore');
/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    onClick?: Function;
}

/**
 * State of a component
 */
interface State {
    reRenderedOn: number;
    isConfirmationPopupDisplaying?: boolean;
    showConfiramtionDialog?: boolean;
}

/**
 * Marking button.
 * @param {Props} props
 * @returns
 */
class QualityFeedbackButton extends pureRenderComponent<Props, State> {

    /* check whether Message panel id closed on discard*/
    private _isAwaitingMessagePanelClose: boolean = false;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        /* Set initial state */
        this.state = {
            reRenderedOn: Date.now(),
            isConfirmationPopupDisplaying: false,
            showConfiramtionDialog: false
        };

        this.onClick = this.onClick.bind(this);
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.onMessagePanelClose);
    }

    /**
     * Render method
     */
    public render() {
        let showConfirmationDialog = null;

        return (
            <div className='feedback-btn-holder'>
                <button id = 'qualityFeedback' className='button rounded primary accept-feedback'
                    onClick={this.onClick}>
                    {this.getResourceText('marking.response.mark-scheme-panel.accept-quality-feedback-button') }
                </button>
            </div>
        );
    }

    /**
     * gets text from resource file
     * @param resourceKey
     */
    private getResourceText(resourceKey: string) {
        return stringHelper.format(localeStore.instance.TranslateText(resourceKey),
            [constants.NONBREAKING_HYPHEN_UNICODE]);
    }

    /**
     * Click event of Quality Feedback Button
     */
    private onClick() {
        let navigatePossible: boolean = true;
        let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
            markingHelper.canNavigateAwayFromCurrentResponse();
        responseNavigationFailureReasons.map((canNavigateAway: enums.ResponseNavigateFailureReason) => {
            if (canNavigateAway === enums.ResponseNavigateFailureReason.UnSentMessage &&
                responseNavigationFailureReasons.length === 1) {
                navigatePossible = false;
                // we have to display discard message warning if failure condition is unsendmessage only.
                // if multiple failure reasons are there then we will handle on that messages
                messagingActionCreator.messageAction(enums.MessageViewAction.NavigateAway, enums.MessageType.ResponseCompose,
                    enums.SaveAndNavigate.toResponse, enums.SaveAndNavigate.fromQualityFeedback);
                this._isAwaitingMessagePanelClose = true;
            }
        });
        if (navigatePossible) {
            if (this.props.onClick != null) {
                this.props.onClick();
            }
        }
    }

    /**
     * This method will show confirmation dialog when mesage panel is closed on discarding
     */
    private onMessagePanelClose = () => {
        if (this._isAwaitingMessagePanelClose) {
            this._isAwaitingMessagePanelClose = false;
            if (this.props.onClick != null) {
                this.props.onClick();
            }
        }
    };
}

export = QualityFeedbackButton;
