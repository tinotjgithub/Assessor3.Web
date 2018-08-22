/// <reference path='gridtogglebutton.tsx' />
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');

/**
 * Props
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    isVisible: boolean;
}

/**
 * Class for displaying worklist message.
 */
class PendingWorklistBanner extends pureRenderComponent<Props, any> {

    /**
     * Constructor for worklist message 
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }

    /**
     * Render component
     */
    public render(): JSX.Element {
        if (this.props.isVisible) {
            return (<div
                className='message-bar'>
                <span
                    className='message-content'>
                    <div className='text-left' id='pendingWorklistBannerId'>
                    {localeStore.instance.TranslateText('marking.worklist.submitted-editable-worklist-helper')}
                </div>
                </span>
            </div>);
        } else {
            return null;
        }
    }
}
export = PendingWorklistBanner;