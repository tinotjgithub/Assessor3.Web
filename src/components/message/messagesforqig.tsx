import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import Immutable = require('immutable');
let classNames = require('classnames');
import Messages = require('./messages');
import MessageQIGHeader = require('./messageqigheader');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    messages: Immutable.List<Message>;
    qigName: string;
    unReadMessages: number;
    selectedMsgId: number;
    onSelectedMessageChanged: Function;
    qigId: number;
    isOpen: boolean;
    onExpandOrCollapse: Function;
}

class MessagesForQig extends pureRenderComponent<Props, any> {

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * Render the Group Header and details.
     */
    public render() {
        return (
            <li className={ classNames('msg-group msg-item', { 'open': this.props.isOpen }) }
                id = {'grp-' + this.props.id} >
                <MessageQIGHeader
                    qigName = { this.props.qigName }
                    unReadMessages = {this.props.unReadMessages}
                    id = {'header-' + this.props.id}
                    key = {'header-' + this.props.id}
                    headerClick = {this.onClick} >
                </MessageQIGHeader>
                <div id = {'grp-ul-' + this.props.id} className='msg-group-items'>
                    <Messages
                        messages= { this.props.messages }
                        selectedMsgId = {this.props.selectedMsgId}
                        id = {this.props.id}
                        key = {this.props.id}
                        selectedLanguage={this.props.selectedLanguage}
                        unReadMessages = {this.props.unReadMessages}
                        onSelectedMessageChanged = { this.props.onSelectedMessageChanged } >
                    </ Messages>
                </div>
            </li>
        );
    }

    /**
     * Handles the click event for expand or collapse
     * @param evnt
     */
    private onClick(evnt: any) {
        this.props.onExpandOrCollapse(this.props.qigId, !this.props.isOpen);
    }
}

export = MessagesForQig;