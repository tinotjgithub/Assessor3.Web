/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import qigInfo = require('../../stores/qigselector/typings/qigsummary');
import enums = require('../utility/enums');
import QigName = require('./qigname');
import MarkingTarget = require('./markingtarget');
import markingTarget = require('../../stores/qigselector/typings/markingtarget');
import Immutable = require('immutable');
import QigItemActionColumn = require('./qigitemactioncolumn');
import TargetDate = require('./targetdate');
import qigValidationResult = require('../../stores/qigselector/qigvalidationresult');
import qigSelectorValidationHelper = require('../utility/qigselector/qigselectorvalidationhelper');
import qigStore = require('../../stores/qigselector/qigstore');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    qig: qigInfo;
    qigValidationResult: qigValidationResult;
    containerPage?: enums.PageContainers;
}

class QigItem extends pureRenderComponent<Props, any> {

    private _directedRemarkTargets: Array<markingTarget> = [];

    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for Qig item.
     */
    public render() {

        this.filterDirectedRemarks();
            return (
                <div className='qig-wrapper' id={this.props.id} key={'qigWrapper_' + this.props.id}>
                    <div className='qig-col1 qig-col vertical-middle'>
                        <div className='middle-content'>
                            <QigName id={this.props.id} key={this.props.id} qigname={this.qigName}></QigName>
                            {this.renderTargetDateComponent()}
                        </div>
                    </div>
                    <MarkingTarget id={this.props.id} key={'qigsummary_' + this.props.id}
                        selectedLanguage={this.props.selectedLanguage}
                        currentMarkingTarget={this.props.qig.currentMarkingTarget}
                        qigValidationResult={this.props.qigValidationResult}
                        directedRemarkMarkingTargets={Immutable.List<markingTarget>(this._directedRemarkTargets)}
                        markSchemeGroupId={this.props.qig.markSchemeGroupId}
                        examinerRoleId={this.props.qig.examinerRoleId}
                        isStandardisationSetupButtonVisible={ this.props.qig.isStandardisationSetupButtonVisible}
                        isStandardisationSetupLinkVisible={ this.props.qig.isStandardisationSetupLinkVisible}
                        questionPaperPartId={this.props.qig.questionPaperPartId}
                        isAggregatedTarget={this.props.qig.groupId > 0}
                        hasBrowsePermissionOnly={this.props.qig.isStandardisationSetupAvaliable &&
                            qigStore.instance.isQigHasBrowseScriptPermissionOnly(this.props.qig)}
                        standardisationInProgress={!this.props.qig.standardisationSetupComplete} />
                    <QigItemActionColumn
                        id={this.props.id}
                        key={'QigItemActionColumn_' + this.props.id}
                        containerPage={this.props.containerPage}
                        qigValidationResult={this.props.qigValidationResult}
                        qig={this.props.qig}
                    ></QigItemActionColumn>
                </div>
        );
    }

    /**
     * checks if marking targets contains any directed remarks
     */
    private filterDirectedRemarks() {

        this._directedRemarkTargets = [];
        if (this.props.qig.markingTargets != null) {
            this.props.qig.markingTargets.map((remark: markingTarget) => {
                if (remark.isDirectedRemark === true) {
                    this._directedRemarkTargets.push(remark);
                }
            });
        }
    }

    /**
     * Render the target Date section
     */
    private renderTargetDateComponent() {
        if (this.props.qig.currentMarkingTarget != null) {
            return (
                <TargetDate id={this.props.id}
                    key={this.props.id + '_TargetDateKey'}
                    selectedLanguage={this.props.selectedLanguage}
                    displayTargetDate={this.props.qigValidationResult.displayTargetDate}
                    markingCompletionDate={this.props.qig.currentMarkingTarget.markingCompletionDate}>
                </TargetDate>);
        }
    }

    /**
     * Returns the qig name.
     */
    private get qigName(): string {
        if (this.props.qig.groupId > 0) {
            // That is if the qig has aggregated targets.
            return this.props.qig.componentId;
        } else {
            return this.props.qig.markSchemeGroupName;
        }
    }
}

export = QigItem;