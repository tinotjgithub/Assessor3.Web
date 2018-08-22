/*
  React component for Busy Indicator.
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import enums = require('../enums');
import busyIndicatorParameter = require('./busyindicatorparameter');
import busyIndicatorHelper = require('./busyindicatorhelper');
import timerHelper = require('../../../utility/generic/timerhelper');

interface Props extends LocaleSelectionBase, PropsBase {
    busyIndicatorInvoker: enums.BusyIndicatorInvoker;
    isBusy: boolean;
    // For work list busy indicator it will be undefined.
    isMarkingBusy?: boolean;
    showBackgroundScreen?: boolean;
    isOffline?: boolean;
    responseMode?: enums.ResponseMode;
	doShowDialog?: boolean;
	selfDistructAt?: number;
	initiateSelfDistruction?: Function;
}

/**
 * React component class for Busy Indicator implementation.
 */
class BusyIndicator extends pureRenderComponent<Props, any> {

	private timeInterval: number = 0;

	/**
	 * @constructor
	 * @param props
	 * @param state
	 */
	constructor(props: Props, state: any) {
		super(props, state);
		this.selfDistruct = this.selfDistruct.bind(this);
	}

    /**
     * Render component
     */
    public render() {

        if (!this.props.isBusy) {
            return null;
        }

        if (this.props.busyIndicatorInvoker === enums.BusyIndicatorInvoker.loadingResponse &&
            !this.props.doShowDialog) {
            return null;
        }

        /** decide class to be added based on the response mode */
        let wrapperClass: string = 'loading';
        let busyLoaderClass: string = 'worklist-loader vertical-middle';

        wrapperClass += busyIndicatorHelper.getResponseModeBusyClass(this.props.responseMode);

        if (!this.props.showBackgroundScreen) {
            if (this.props.isMarkingBusy) {
                wrapperClass += ' marking-wrapper';
            } else {
                wrapperClass += ' worklist-wrapper';
            }
        }

        if (this.props.isMarkingBusy) {
            busyLoaderClass = 'marking-loader vertical-middle';
        }

        let busyIndicatorParameter: busyIndicatorParameter = busyIndicatorHelper.getBusyIndicatorParameter(
            this.props.busyIndicatorInvoker,
            this.props.isOffline);
        return (
            <div className = {busyIndicatorParameter.BusyIndicatorStyle}>
                <div className = {wrapperClass}>
                    <div className = {busyLoaderClass}
                        id={this.props.id} key={ 'key_' + this.props.id}>
                        <span className = 'loader middle-content'>
                            <span className = 'dot'></span>
                            <span className = 'dot'></span>
                            <span className = 'dot'></span>
                            <div className = 'loading-text padding-top-30'>{busyIndicatorParameter.BusyIndicatorText}</div>
                        </span>
                    </div>
                </div>
            </div>
        );
	}

	/**
	 * Component did mount
	 */
	public componentDidMount() {
		this.addSelfDistruction();
	}

	/**
	 * component did update
	 */
	public componentDidUpdate() {
		this.addSelfDistruction();
	}

	/**
	 * This function gets invoked when the component is about to be unmounted
	 */
	public componentWillUnmount() {
		// clear Interval while moving out from response container
		timerHelper.clearInterval(this.timeInterval);
	}

	/**
	 * Invoke self distruction
	 */
	private selfDistruct() {
		if (this.props.initiateSelfDistruction) {
			this.props.initiateSelfDistruction();
			timerHelper.clearInterval(this.timeInterval);
		}
	}

	/**
	 * Add self discruction time
	 */
	private addSelfDistruction() {
		if (this.props.selfDistructAt === undefined) {
			return;
		}

		if (this.props.isBusy) {
			this.timeInterval = timerHelper.setInterval(this.props.selfDistructAt, this.selfDistruct, this.timeInterval);
		} else {
			timerHelper.clearInterval(this.timeInterval);
		}
	}
}

export = BusyIndicator;