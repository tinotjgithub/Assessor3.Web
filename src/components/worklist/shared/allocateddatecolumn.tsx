/*
  React component for login header
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import SLAOAnnotationIndicator = require('./slaoannotationindicator');
import AllPAgeAnnotationIndicator = require('./allpageannotationindicator');
import AllocatedDateComponent = require('./worklistdate');
import GracePeriodTime = require('./graceperiodtime');
import enums = require('../../utility/enums');
let classNames = require('classnames');
/**
 * Properties of allocated date grid column component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    dateValue?: Date;
    isResponseHasSLAO: boolean;
    isAllAnnotated?: boolean;
    markingProgress: number;
    showAllocatedDate: boolean;
    showTimeToEndofGracePeriod?: boolean;
    timeToEndOfGracePeriod?: number;
    isTileView?: boolean;
    renderedOn?: number;
    markSchemeGroupId: number;
}

/**
 * React component class for the grid column allocated date
 */
class AllocatedDateColumn extends pureRenderComponent<Props, any> {

    /**
     * Constructor for Allocated Date
     * @param props
     * @param state
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render component
     */
    public render() {
        let isMarkingCompleted: boolean = (this.props.markingProgress === 100) ? true : false;
        let allocatedDate: JSX.Element = this.props.showAllocatedDate ? (<AllocatedDateComponent
                                                                            id={this.props.id}
                                                                            key={'alcDate_' + this.props.id}
                                                                            selectedLanguage={this.props.selectedLanguage}
                                                                            dateType={enums.WorkListDateType.allocatedDate}
                                                                            dateValue={this.props.dateValue}
                                                                            renderedOn = {this.props.renderedOn} />) : null;
        /** 
         * component to display the time to end of grace period - visible based on condition
         */
        let gracePeriodTime: JSX.Element = this.props.showTimeToEndofGracePeriod ?
                                            (<GracePeriodTime
                                                id={this.props.id}
                                                key={'graceDate_' + this.props.id}
                                                selectedLanguage={this.props.selectedLanguage}
                                                timeToEndOfGracePeriod={this.props.timeToEndOfGracePeriod}
                                                isTileView={this.props.isTileView}/>) : null;

        return (
            <div className={classNames('col', { 'wl-grace-period': this.props.showTimeToEndofGracePeriod ? true : false },
                                              { 'wl-allocated-date': this.props.showAllocatedDate ? true : false }) }>
            <div className='col-inner'>
                    <SLAOAnnotationIndicator selectedLanguage={this.props.selectedLanguage}
                        isResponseHasSLAO={this.props.isResponseHasSLAO}
                        key={'slao_' + this.props.id}
                        id={this.props.id}
                        isAllAnnotated={this.props.isAllAnnotated}
                        isMarkingCompleted={isMarkingCompleted}
                        isTileView={this.props.isTileView}
                        markSchemeGroupId={this.props.markSchemeGroupId} />
                <AllPAgeAnnotationIndicator selectedLanguage={this.props.selectedLanguage}
                    isAllAnnotated={this.props.isAllAnnotated}
                    key={'apa_' + this.props.id}
                    id={this.props.id}
                    isMarkingCompleted={isMarkingCompleted}
                    isTileView={this.props.isTileView}
                    markSchemeGroupId={this.props.markSchemeGroupId}/>
                    {allocatedDate}
                    {gracePeriodTime}
                </div>
                </div>
        );
    }
}

export = AllocatedDateColumn;