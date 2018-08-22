import React = require('react');
import localeStore = require('../../../stores/locale/localestore');

/* tslint:disable:class-name */
interface sendMessageLinkProps extends LocaleSelectionBase, PropsBase {
    onClick: Function;
}

/**
 * Send Message Link and its click event.
 * @param props
 */
const sendMessageLink: React.StatelessComponent<sendMessageLinkProps> = (props: sendMessageLinkProps) => {
    return (
        <div className='send-message-holder small-text' id='sendMessage'>
            <a href='javascript:void(0)' title={localeStore.instance.TranslateText('marking.worklist.left-panel.send-message')
            } className='dark-link' onClick={() => { props.onClick(); }}>
                <span className='sprite-icon message-small-icon' />
                <span id='supervisor_message' className='padding-left-5'>
                    {localeStore.instance.TranslateText('marking.worklist.left-panel.send-message')}
                </span>
            </a>
        </div>
    );
};

export = sendMessageLink;