import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');
import messageStore = require('../../stores/message/messagestore');
import htmlUtilities = require('../../utility/generic/htmlutilities');

interface Props extends PropsBase, LocaleSelectionBase {
    outerClass: string;
    refName: string;
    hasFocus: boolean;
    className: string;
    placeHolder?: string;
    maxLength: number;
    value: string;
    onChange: Function;
    callback?: Function;
    isVisible: boolean;
}

class Subject extends pureRenderComponent<Props, any> {
    /* private variable to manage event listeners for messaging panel*/
    private messagingPanel: Element;

    /**
     * constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
    }

    /**
     * Event on animation end
     * @param event
     */
    private onAnimationEnd(event: Event) {
        // If any child element has triggered the transion-end ignore it
        let element: any = event.srcElement || event.target;
        if (element.id !== 'messaging-panel') {
            return;
        }

        // setting scroll top - fix for ipad issue #49587
        if (htmlUtilities.isIPadDevice) {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
        }
        this.setFocusOnSubject();
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        return (
            <div className={this.props.outerClass}>
                <input type='text' ref={this.props.refName} id={this.props.id} aria-label='Subject'
                    placeholder={this.props.placeHolder} className={this.props.className}
                    maxLength={this.props.maxLength} value={this.props.value} onInput={this.onChange} />
            </div>);
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.closeMessage);

        // While creating a message from worklist and Inbox, set the focus to subject
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.setFocusOnSubject);
        this.messagingPanel = document.getElementsByClassName('messaging-panel').item(0);
        if (this.messagingPanel) {
            // While creating a message inside the response, set the focus to subject
            this.messagingPanel.addEventListener('transitionend', this.onAnimationEnd);
        }

        // While composing a message from Team management. Set focus to subject
        this.setFocusOnSubject();
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_CLOSE_EVENT, this.closeMessage);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.setFocusOnSubject);
        if (this.messagingPanel) {
            this.messagingPanel.removeEventListener('transitionend', this.onAnimationEnd);
        }
    }

    /**
     * seting focus back to subject on message close for fixing cursor and onscreen keyboard displaying issue in ipad
     * Defect: 24608
     */
    private closeMessage = () => {
        if (this.props.hasFocus && htmlUtilities.isIPadDevice) {
            this.setFocusOnSubject();
            ((this.refs[this.props.refName]) as HTMLInputElement).blur();
        }

        // close message callback function called
        if (this.props.callback) {
            this.props.callback();
        }
    };

    /**
     * This method will call on subject onChange event
     */
    private onChange = (event: any) => {
        this.props.onChange(event.target.value);
    };

    /**
     * Set Focus to the input field if necessary
     */
    private setFocusOnSubject = () => {
        if (this.props.hasFocus) {
            ((this.refs[this.props.refName]) as HTMLInputElement).blur();
            ((this.refs[this.props.refName]) as HTMLInputElement).focus();
        }
    }
}

export = Subject;
