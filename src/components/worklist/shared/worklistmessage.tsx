/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import localeStore = require('../../../stores/locale/localestore');
import localeHelper = require('../../../utility/locale/localehelper');
import enums = require('../../utility/enums');
import BusyIndicator = require('../../utility/busyindicator/busyindicator');
import targetSummaryStore = require('../../../stores/worklist/targetsummarystore');
import markingTargetSummary = require('../../../stores/worklist/typings/markingtargetsummary');

/**
 * Props
 * @param {Props} props
 */
interface Props extends LocaleSelectionBase, PropsBase {
    hasResponsesAvailableInPool: boolean;
    responseConcurrentLimit?: number;
    hasTargetCompleted?: boolean;
    isSimulation?: boolean;
    isAggregateQIGTargetsON?: boolean;
}

/**
 * Class for displaying worklist message.
 */
class WorkListMessage extends pureRenderComponent<Props, any> {

    /**
     * Constructor for worklist message 
     * @param props
     */
    constructor(props: Props) {
        super(props, null);
    }


    /**
     * Render component
     * @returns
     */
    public render() {

        if (this.props.hasResponsesAvailableInPool === true) {
            if (!this.props.isSimulation) {
                // return the worklistmessage based on AggregateQIGTargets CC value
                let worklistEmptyMessage : string = this.worklistMessageBody;
                /** Replacing the message with concurrent limit */
                worklistEmptyMessage = worklistEmptyMessage.replace('{0}',
                    localeHelper.toLocaleString(this.props.responseConcurrentLimit));
                return (
                    <div className='grid-holder grid-view'>
                        <div className='grid-wrapper' id={this.props.id}>
                            <div className='message-box dark-msg info-guide callout download-resp-msg'>
                                <h4 id={this.props.id + '_messageHeader'} className='bolder padding-bottom-10'>
                                    {localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.header')}</h4>
                                <p id={this.props.id + '_messageContent'} className='message-body'>
                                    {localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.body-line-1')} <br />
                                    {worklistEmptyMessage} <br /><br />
                                    {localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.body-line-3')}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className='grid-holder grid-view'>
                        <div className='grid-wrapper' id={this.props.id}>
                            <div className='message-box text-left float-msg dark-msg info-guide callout download-resp-msg'>
                                <h4 id={this.props.id + '_messageHeader'} className='bolder padding-bottom-10'>
                                    {localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.header')}</h4>
                                <p id={this.props.id + '_messageContent1'} className='message-body'>
                                    {localeStore.instance.TranslateText('marking.worklist.simulation-helper.body-line-1')}
                                </p>
                                <p id={this.props.id + '_messageContent2'} className='message-body padding-top-10'>
                                    {localeStore.instance.TranslateText('marking.worklist.simulation-helper.body-line-2')}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            }
        } else if (this.props.hasTargetCompleted === true) {
            return (
                <div className='grid-holder grid-view'>
                    <div className='grid-wrapper' id = {this.props.id}>
                        <div className='message-box dark-msg float-msg info-guide download-resp-msg'>
            <h4 id = {this.props.id + '_messageHeader'} className='bolder padding-bottom-10'>
                                {localeStore.instance.TranslateText('marking.worklist.marking-target-complete-helper.header') }</h4>
                <p id = { this.props.id + '_messageContent' } className= 'message-body' >
                    { this.worklistMessageBody } </p >
                            </div>
                        </div>
                    </div>
            );
        } else {
            return (
                <div className='grid-holder grid-view'>
                    <div className='grid-wrapper' id = {this.props.id}>
                        <div className='message-box dark-msg info-guide download-resp-msg'>
                            <h4 id = {this.props.id + '_messageHeader'} className='bolder padding-bottom-10'>
                                {localeStore.instance.TranslateText('marking.worklist.no-responses-available-helper.header') }
                                </h4>
                            <p id = {this.props.id + '_messageContent'} className='message-body'>
                                {localeStore.instance.TranslateText('marking.worklist.no-responses-available-helper.body') }</p>
                            </div>
                        </div>
                    </div>
            );
        }
    }

    /**
     * Return corresonding worklistmessage based on condition.
     */

    private get worklistMessageBody() {
        if (this.props.hasResponsesAvailableInPool && !this.props.isSimulation) {
            if (this.props.isAggregateQIGTargetsON) {
                return localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.aggregated-body-line-2');
            } else {
                return localeStore.instance.TranslateText('marking.worklist.empty-worklist-helper.body-line-2');
            }
        } else if (this.props.hasTargetCompleted === true) {
            if (!this.props.isAggregateQIGTargetsON) {
                return localeStore.instance.TranslateText('marking.worklist.marking-target-complete-helper.body');
            } else {
                return localeStore.instance.TranslateText('marking.worklist.marking-target-complete-helper.aggregate-body');
            }
        }
    }
}

export = WorkListMessage;