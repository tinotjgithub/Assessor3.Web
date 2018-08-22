import React = require('react');
import ReactDom = require('react-dom');
import enums = require('../utility/enums');
let classNames = require('classnames');
import GenericButton = require('../utility/genericbutton');

interface Props extends PropsBase, LocaleSelectionBase {
    header: string;
    content: string;
    onYesClick: Function;
    onNoClick: Function;
    yesButtonText: string;
    noButtonText: string;
}

/**
 * React wrapper component for multi qig navigation confirmation dialog
 */
const multiQigNavigationConfirmationDialog = (props: Props) => {
    return (
        <div className='popup small popup-overlay close-button popup-open open'
            id={this.id}
            role='dialog'
            aria-labelledby='popup4Title'
            aria-describedby='popup4Desc'>
            <div className='popup-wrap'>
                <div className='popup-header'>
                    <h4 id='multi-qig-navigation-header'>{props.header}</h4>
                </div>
                <div className='popup-content' id='multi-qig-navigation-description'>
                    <p>{props.content}</p>
                </div>
                <div className='popup-footer text-right'>
                    <GenericButton
                        id={'multi-qig-navigate-no-button'}
                        key={'key_multi-qig-navigate-no-button'}
                        className={'button rounded close-button primary'}
                        title={props.noButtonText}
                        content={props.noButtonText}
                        disabled={false}
                        onClick={() => { props.onNoClick(); }} />

                    <GenericButton
                        id={'multi-qig-navigate-yes-button'}
                        key={'key-multi-qig-navigate-yes-button'}
                        className={'button rounded'}
                        title={props.yesButtonText}
                        content={props.yesButtonText}
                        disabled={false}
                        onClick={() => { props.onYesClick(); }} />
                </div>
            </div>
        </div>);
};

export = multiQigNavigationConfirmationDialog;