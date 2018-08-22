/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import treeViewItem = require('../../stores/markschemestructure/typings/treeviewitem');
import localeStore = require('../../stores/locale/localestore');
import constants = require('../utility/constants');
import treeViewDataHelper = require('../../utility/treeviewhelpers/treeviewdatahelper');
import Mark = require('./mark');
import markingStore = require('../../stores/marking/markingstore');
import enums = require('../utility/enums');
import marksAndAnnotationsVisibilityHelper = require('../utility/marking/marksandannotationsvisibilityhelper');
import responseStore = require('../../stores/response/responsestore');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import Immutable = require('immutable');

/**
 * Properties of mark scheme base component.
 */
interface Props extends LocaleSelectionBase, PropsBase {
    node?: treeViewItem;
    navigateToMarkScheme?: Function;
    onMarkSchemeSelected?: Function;
    reload?: number;
    isNonNumeric: boolean;
    isOpen?: boolean;
    linkedItems: Immutable.List<number>;
}

/**
 * base component class for marckshceme panel child nodes .
 */
class MarkSchemeBase extends pureRenderComponent<Props, any> {

    protected STRIKE_CLASS: string = ' strike-out';
    protected title: string;
    private treeViewHelper: treeViewDataHelper;

    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
        this.title = this.props.node.name;
        this.treeViewHelper = new treeViewDataHelper();
    }


    /**
     * get the strike out class name for those nodes not used in total
     */
    protected getClassForNotUsedInTotal(mark: string): string {
        if (this.props.node.usedInTotal === false && this.props.isNonNumeric !== true && mark !== '-' && mark !== '') {

            this.title = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.optionality-tooltip');
            return this.STRIKE_CLASS;
        }
        this.title = this.props.node.name;
        return '';
    }


    /**
     * get the marked cluster/answeritem class if all markschemes under this cluster is marked
     */
    protected getClassForMarkedCluster() {
        let className = '';
        if (this.props.node.markSchemeCount === this.props.node.markCount) {
            className = ' marked-question';
        }

        return className;
    }

    /**
     * Render the previous marks.
     */
    protected renderPreviousMarks() {
        if (this.treeViewHelper.canRenderPreviousMarks()) {
            let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            let visiblityInfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
                markingStore.instance.currentMarkGroupId);
            if (this.props.node.previousMarks != null
                && (this.props.node.itemType === enums.TreeViewItemType.marksScheme
                    || this.props.isNonNumeric !== true)) {
                /*Previous Marks only need to shown for expanded qigs in markschemepanel
                 for whole response according to US-57116 Re-marking of pooled atypical whole response from any QIG*/
                let previousMarks = responseStore.instance.isWholeResponse && markingStore.instance.currentQuestionItemInfo &&
                    markingStore.instance.currentQuestionItemInfo.markSchemeGroupId ===
                    this.props.node.markSchemeGroupId;
                let counter = 0;
                let previousMarkItems = this.props.node.previousMarks.map((previousMark: PreviousMark) => {
                    counter++;
                    // render the mark only if the isMarkVisible is true
                    if (visiblityInfo.get(counter) && visiblityInfo.get(counter).isMarkVisible === true) {
                        return (
                            <Mark id={this.props.id + 'remarks-cluster-item' + counter.toString()}
                                key={this.props.id + 'remarks-cluster-item' + counter.toString()}
                                mark={previousMarks ? previousMark.mark.displayMark :
                                    !responseStore.instance.isWholeResponse ? previousMark.mark.displayMark : ''}
                                showMarksChangedIndicator={this.hasMarksChanged(this.props.node, previousMark.mark.displayMark)}
                                usedInTotal={previousMark.usedInTotal}
                                isNonNumeric={this.props.isNonNumeric}
                            />
                        );
                    }
                });

                return previousMarkItems;
            }
        }
    }

    /**
     * Returns whether the marks has changed comparing the current mark with the previous mark
     * @param treeNode
     * @param previousMarkValue
     */
    private hasMarksChanged(treeNode: treeViewItem, previousMarkValue: string): boolean {

        if (this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Practice ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Standardisation ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Secondstandardisation ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.Seed ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.DirectedRemark ||
            this.treeViewHelper.getPreviousMarksColumnType() === enums.PreviousMarksColumnType.PooledRemark ||
            this.treeViewHelper.canRenderPreviousMarksInStandardisationSetup) {
            let currentMark: string;

            switch (treeNode.itemType) {
                case enums.TreeViewItemType.cluster:
                case enums.TreeViewItemType.answerItem:
                    if (treeNode.markCount === treeNode.markSchemeCount) {
                        currentMark = treeNode.totalMarks === undefined ||
                            treeNode.totalMarks == null ? constants.NOT_MARKED : treeNode.totalMarks.trim();
                    } else {
                        return false;
                    }
                    break;
                default:
                    currentMark = treeNode.allocatedMarks === undefined ||
                        treeNode.allocatedMarks == null ? constants.NOT_MARKED : treeNode.allocatedMarks.displayMark;
                    break;
            }

            if (isNaN(parseFloat(currentMark))) {
                if (currentMark === constants.NOT_ATTEMPTED) {
                    return currentMark !== previousMarkValue;
                } else if (currentMark === constants.NOT_MARKED) {
                    return false;
                }
            } else {
                return isNaN(parseFloat(previousMarkValue)) ? true : parseFloat(currentMark) !== parseFloat(previousMarkValue);
            }
        }

        return false;
    }

    /**
     * return whether the display mark is visible or not
     */
    protected isMarkVisible(): boolean {
        return ((this.props.isNonNumeric === true) ? false : true);
    }

    /**
     * return whether to display the total mark.
     */
    protected isTotalMarkVisible(): boolean {
        return !(standardisationSetupStore.instance.isSelectResponsesWorklist);
    }

    /**
     * return the unzoned indicator
     */
    protected renderUnzonedIndicator(): JSX.Element {
        return (<span className='unzone-indication' title={localeStore.instance.
            TranslateText('marking.response.mark-scheme-panel.unzoned-indicator-tooltip')}>
            <span className='svg-icon unzoned-icon'>
                <svg viewBox='0 0 18 22' className='unzoned-content-icon'>
                    <use xlinkHref='#unzoned-content'></use>
                </svg>
            </span>
        </span>);
    }

    /**
     * return jsx element for link indicator
     */
    protected renderLinkIndicator(): JSX.Element {
        if (this.props.linkedItems && this.props.linkedItems.contains(this.props.node.uniqueId)) {
            let toolTip = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.link-indicator-tooltip');
            let linkIndicatorId = 'markscheme_panel_link_icon_' + this.props.node.bIndex.toString();
            return markSchemeHelper.renderLinkIndicator(linkIndicatorId, toolTip);
        }

        return null;
    }
}

export = MarkSchemeBase;
