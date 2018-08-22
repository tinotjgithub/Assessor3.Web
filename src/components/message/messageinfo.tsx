import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import RecipientListToggle = require('./recipientlisttoggle');
import messageTranslationHelper = require('../utility/message/messagetranslationhelper');
import htmlUtilities = require('../../utility/generic/htmlutilities');
let classNames = require('classnames');
import constants = require('../utility/constants');
import messageStore = require('../../stores/message/messagestore');
interface Props extends LocaleSelectionBase, PropsBase {
    message: Message;
}

interface State {
    isExpanded: boolean;
    isClassUpdated: boolean;
}

/**
 * Message info section contain message type, recipients list and remaining recipients count.
 * @param props
 */

class MessageInfo extends pureRenderComponent<Props, State> {

    private recipientListSpan: NodeListOf<Element>;

    // holds the remaining RecipientCount
    private remainingRecipientCount: number = 0;

    // holds the examinerName with SemiColon
    private examiners: Array<string>;

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isExpanded: false,
            isClassUpdated: false
        };
        this.examiners = new Array<string>();
        this.onRecipientListToggle = this.onRecipientListToggle.bind(this);
        this.calculateRecipientCount = this.calculateRecipientCount.bind(this);
        this.appendExaminerWithSemiColon();
    }

    /**
     * Render method
     */

    public render(): JSX.Element {
        let toRender: JSX.Element;

        if (this.props.message.messageFolderType === enums.MessageFolderType.Inbox) {
            toRender = (
                <div className='msg-sender'>
                    <div className='dim-text msg-from-label' id = 'msg_from_label'>
                        {
                            localeStore.instance.TranslateText(
                                'messaging.message-lists.message-detail.' +
                                enums.getEnumString(enums.MessageFolderType, this.props.message.messageFolderType).toLowerCase())
                        }
                    </div>
                    <div className='msg-from-address' id = 'msg_from_address'>
                        { messageTranslationHelper.getExaminerName(this.props.message) }
                    </div>
                </div>
            );
        } else {
            this.appendExaminerWithSemiColon();
            toRender = (
                <div className={classNames('msg-to',
                    this.state.isExpanded ? 'expanded' : '') }>
                    <div className='msg-to-label dim-text'>
                        {
                            localeStore.instance.TranslateText(
                                'messaging.message-lists.message-detail.' +
                                enums.getEnumString(enums.MessageFolderType, this.props.message.messageFolderType).toLowerCase())
                        }
                    </div>
                    <div className='msg-to-address' id={this.props.id} >
                        {
                            !this.props.message.toTeam ?
                                this.examiners.map((item: string) =>
                                    <span className='msg-address'>
                                        {item}
                                    </span>) :
                                <span className='msg-address' id= 'msg-address-entire-team'>
                                    {
                                        localeStore.instance.TranslateText('messaging.compose-message.recipient-selector.entire-team')
                                    }
                                </span>
                        }
                    </div>
                    <RecipientListToggle
                        id = 'msg-to-expand-toggler'
                        key='msg-to-expand-toggler'
                        selectedLanguage={this.props.selectedLanguage}
                        remainingRecipientCount = {this.remainingRecipientCount}
                        onRecipientListToggleClick = {this.onRecipientListToggle} />
                </div>
            );
        }
        return (
            toRender
        );
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */

    public componentDidMount() {
        window.addEventListener('resize', this.calculateRecipientCount);
        let messagePanel: HTMLElement = document.getElementById('messaging-panel');
        if (messagePanel) {
            messagePanel.addEventListener('transitionend', this.calculateRecipientCount);
            messagePanel.addEventListener('webkitTransitionEnd', this.calculateRecipientCount);
        }
        this.calculateRecipientCount();
        messageStore.instance.addListener(messageStore.MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT, this.calculateRecipientCount);
    }

    /**
     * This function gets invoked when the component is about to be un mounted
     */

    private componentWillUnMount() {
        window.removeEventListener('resize', this.calculateRecipientCount);
        let messagePanel: HTMLElement = document.getElementById('messaging-panel');
        if (messagePanel) {
            messagePanel.removeEventListener('transitionend', this.calculateRecipientCount);
            messagePanel.removeEventListener('webkitTransitionEnd', this.calculateRecipientCount);
        }
        messageStore.instance.removeListener(messageStore.MessageStore.CALCULATE_RECIPIENT_COUNT_EVENT, this.calculateRecipientCount);
    }

    /**
     * This function gets invoked when the component receives props
     */

    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.message !== nextProps.message) {
            this.remainingRecipientCount = 0;
        }
    }

    /**
     * Handle toggle event of recipient list.
     *
     */
    private onRecipientListToggle = () => {

        this.setState({
            isExpanded: !this.state.isExpanded,
            isClassUpdated: this.state.isClassUpdated
        });
    };

    /**
     * append examiners with semicolon
     */

    private appendExaminerWithSemiColon(props?: Props) {
        let index: number = 0;
        this.examiners = new Array<string>();
        let _props: Props = props ? props : this.props;
        if (_props.message && _props.message.toExaminerDetails != null) {
            _props.message.toExaminerDetails.map((item: Examiner) => {
                this.examiners.push(item.fullName + ';');
            });
            index = this.examiners.length - 1;

            // replacing semicolon for last item
            if (index >= 0) {
                this.examiners[index] = this.examiners[index].toString().replace(';', '');
            }
        } else {
            this.examiners.push(_props.message.examinerDetails.fullName);
        }
    }

    /**
     * Calculate recipients count.
     */
    private calculateRecipientCount = (event?: any): void => {
        if (event && (event.type === 'transitionend' || event.type === 'webkitTransitionEnd') && event.propertyName !== 'width') {
            return;
        }
        if (this.props.message &&
            this.props.message.messageFolderType === enums.MessageFolderType.Sent) {
            let lastAddressItem = htmlUtilities.getElementsByClassName('first-row-last')[0];
            if (lastAddressItem) {
                if (lastAddressItem.classList.contains('first-row-last')) {
                    lastAddressItem.classList.remove('first-row-last');
                }
            }

            // If message send for an entire team then set remaining recipient count as 0.
            if (this.props.message.toTeam) {
                this.remainingRecipientCount = 0;
                this.setState({
                    isExpanded: false,
                    isClassUpdated: !this.state.isClassUpdated
                });
            } else {
                let remainingRecipientCountUpdated: number = 0;
                let wrapperWidthParent: number = (htmlUtilities.getElementsByClassName('msg-to')[0]) ?
                    htmlUtilities.getElementsByClassName('msg-to')[0].clientWidth : 0;
                let wrapperWidthTo: number = (htmlUtilities.getElementsByClassName('msg-to-label dim-text')[0]) ?
                    htmlUtilities.getElementsByClassName('msg-to-label dim-text')[0].clientWidth : 0;
                let wrapperWidthMore: number = (htmlUtilities.getElementsByClassName('msg-to-expand-toggler')[0]) ?
                    htmlUtilities.getElementsByClassName('msg-to-expand-toggler')[0].clientWidth : constants.RECIPIENT_MORE_LINK;
                let totalWidth: number = wrapperWidthParent - (wrapperWidthTo + wrapperWidthMore);
                this.recipientListSpan = htmlUtilities.getElementsByClassName('msg-address');
                let spanwidth: number = 0;
                remainingRecipientCountUpdated = this.remainingRecipientCount;
                for (let i = 0; i < this.recipientListSpan.length; i++) {
                    spanwidth += this.recipientListSpan[i].clientWidth;

                    if (i === this.recipientListSpan.length - 1) {
                        totalWidth = totalWidth + wrapperWidthMore;
                    }

                    if (spanwidth < totalWidth) {
                        this.remainingRecipientCount = 0;
                    } else {
                        if (i !== 0) {

                            this.recipientListSpan[i - 1].className += ' first-row-last';
                        }
                        if (this.recipientListSpan.length === 1 && spanwidth === totalWidth) {
                            this.remainingRecipientCount = 0;
                        } else {
                            this.remainingRecipientCount = this.recipientListSpan.length - i;
                        }
                        break;
                    }
                }
                if (remainingRecipientCountUpdated !== this.remainingRecipientCount) {
                    this.setState({
                        isExpanded: this.state.isExpanded,
                        isClassUpdated: !this.state.isClassUpdated
                    });
                }
            }
        }
    };
}
export = MessageInfo;