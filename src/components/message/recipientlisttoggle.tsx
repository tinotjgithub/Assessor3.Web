import React = require('react');
import localeStore = require('../../stores/locale/localestore');

interface ToggleProps extends LocaleSelectionBase, PropsBase {
    remainingRecipientCount: number;
    onRecipientListToggleClick: Function;
}

/**
 * RecipientListToggle contain the collpase or expan view with remaining count.
 * @param props
 */
const recipientListToggle: React.StatelessComponent<ToggleProps> = (props: ToggleProps) => {
    if (props.remainingRecipientCount > 0) {
        return (
            <a className='msg-to-expand-toggler' id={props.id} onClick={() => { props.onRecipientListToggleClick(); }}>
                <span
                    className='sender-count dim-text'>
                    +{props.remainingRecipientCount} {localeStore.instance.TranslateText(
                        'messaging.message-lists.message-detail.more-recipients')}</span>
                <span className='expand-toggle-icon'>
                    <span className='sprite-icon menu-arrow-icon'></span>
                    <span className='sprite-icon menu-arrow-icon'></span>
                </span>
            </a>
        );
    } else {
        return null;
    }
};

export = recipientListToggle;