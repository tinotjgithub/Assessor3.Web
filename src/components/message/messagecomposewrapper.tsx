import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import navigationStore = require('../../stores/navigation/navigationstore');
import applicationStore = require('../../stores/applicationoffline/applicationstore');
import enums = require('../utility/enums');

/* tslint:disable:variable-name */
let MessagePopup;
/* tslint:enable:variable-name */

let qigStore;
let messagingActionCreator;
let htmlUtilities;
let messageHelper;
let messageStore;
let operationModeHelper;
let examinerStore;
let ccActionCreator;

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
}

/**
 * State of a component
 */
interface State {
    renderedOn: number;
}

interface Item {
    id: number;
    name: string;
    parentExaminerDisplayName: string;
    parentExaminerId: number;
    questionPaperPartId: number;
    examinerRoleId: number;
}

class MessageComposeWrapper extends pureRenderComponent<Props, State> {
    private isMessagePopupVisible = false;
    private priorityDropdownSelectedItem: enums.MessagePriority = enums.MessagePriority.Standard;
    private isOnline: boolean = false;
    private isDependenciesLoaded: boolean = false;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.loadDependencies = this.loadDependencies.bind(this);
        this.networkStatusChanged = this.networkStatusChanged.bind(this);
    }

    /**
     * render method
     */
    public render() {

        if (!this.isMessagePopupVisible) {
            return null;
        }

        return (
            <MessagePopup isOpen = { true }
                closeMessagePanel={this.onCloseMessagePopup }
                messageType = { enums.MessageType.TeamCompose }
                selectedLanguage={this.props.selectedLanguage}
                selectedQigItemId = { qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId }
                selectedQigItem = { messageHelper.getCurrentQIGName() }
                qigItemsList = { new Array<Item>() }
                supervisorId = { operationModeHelper.subExaminerId }
                qigName = { messageHelper.getCurrentQIGName() }
                supervisorName = { examinerStore.instance.getMarkerInformation.formattedExaminerName }
                priorityDropDownSelectedItem = { this.priorityDropdownSelectedItem }
                onQigItemSelected = { qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId }
                messageBody = { messageHelper.getMessageContent(enums.MessageType.TeamCompose) }
                questionPaperPartId = { qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId }
                />
        );

    }

    /**
     * componentDidMount
     */
    public componentDidMount() {
        navigationStore.instance.addListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.onContainerChange);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    }

    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        navigationStore.instance.removeListener(navigationStore.NavigationStore.CONTAINER_CHANGE__EVENT, this.onContainerChange);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
        if (messageStore) {
            messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
        }
    }

    /**
     * Invoked while changing the container
     */
    private onContainerChange = (): void => {
        // If team management is loaded, load the modules if not loaded
        if (messageStore === undefined && (navigationStore.instance.containerPage === enums.PageContainers.TeamManagement
        || navigationStore.instance.containerPage === enums.PageContainers.WorkList
        || navigationStore.instance.containerPage === enums.PageContainers.StandardisationSetup)) {
            this.loadDependencies();
        }

        // Container changed. close the message panel
        if (this.isMessagePopupVisible) {
            messagingActionCreator.messageAction(enums.MessageViewAction.Close);
            this.isMessagePopupVisible = false;
            this.setState({ renderedOn: Date.now() });
        }
    }

    /**
     * Load required classess for the component
     */
    private loadDependencies(retryWhenOnline: boolean = false) {
        let ensurePromise: any = require.ensure(
            [
                './messagepopup',
                '../../stores/qigselector/qigstore',
                '../../actions/messaging/messagingactioncreator',
                '../../utility/generic/htmlutilities',
                '../utility/message/messagehelper',
                '../../stores/message/messagestore',
                '../utility/userdetails/userinfo/operationmodehelper',
                '../../stores/markerinformation/examinerstore',
                '../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator'
            ],
            () => {
                MessagePopup = require('./messagepopup');
                qigStore = require('../../stores/qigselector/qigstore');
                messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
                htmlUtilities = require('../../utility/generic/htmlutilities');
                messageHelper = require('../utility/message/messagehelper');
                messageStore = require('../../stores/message/messagestore');
                operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
                examinerStore = require('../../stores/markerinformation/examinerstore');
                ccActionCreator =
                require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');

                // Offline Team management Scenario - when back online , load the failed call after bundle load
                if (retryWhenOnline && qigStore.instance.selectedQIGForMarkerOperation) {
                    ccActionCreator.getMarkSchemeGroupCCs
                    (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                        qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
                }

                this.addEventListeners();
                this.isDependenciesLoaded = true;
            }
        );
        ensurePromise.catch((e) => {
            this.isDependenciesLoaded = false;
        });
    }

    /**
     * Add event Listeners
     */
    private addEventListeners() {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onMessagePanelOpen);
    }

    /**
     * network status changed callback
     */
    private networkStatusChanged(): void {
        this.isOnline = applicationStore.instance.isOnline;
        if (this.isOnline) {
            if (!this.isDependenciesLoaded) {
                this.loadDependencies(true);
            } else if (qigStore.instance.selectedQIGForMarkerOperation) {
                ccActionCreator.getMarkSchemeGroupCCs
                (qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId,
                    qigStore.instance.selectedQIGForMarkerOperation.questionPaperPartId);
            }
        }
    }

    /**
     * This method will call on message open
     */
    private onMessagePanelOpen = (messageType: enums.MessageType) => {
        if (messageType === enums.MessageType.TeamCompose) {
            this.isMessagePopupVisible = true;
            this.setState({ renderedOn: Date.now() });
        }
    };

    /**
     * Callback function for message panel close
     */
    private onCloseMessagePopup = (messageNavigationArguments: MessageNavigationArguments) => {
        this.isMessagePopupVisible = false;
        this.priorityDropdownSelectedItem = enums.MessagePriority.Standard;
        messagingActionCreator.messageAction(enums.MessageViewAction.Close);
        this.setState({ renderedOn: Date.now() });
    };
}

export = MessageComposeWrapper;