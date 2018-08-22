import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import marksandannotationsvisibilityinfo = require('../utility/annotation/marksandannotationsvisibilityinfo');
import localeStore = require('../../stores/locale/localestore');
import stringHelper = require('../../utility/generic/stringhelper');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import constants = require('../utility/constants');
import ToggleButton = require('../utility/togglebutton');
import markingStore = require('../../stores/marking/markingstore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import marksAndAnnotationsVisibilityHelper = require('../../components/utility/marking/marksandannotationsvisibilityhelper');
import enhancedOffpageCommentStore = require('../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
import enhancedOffPageCommentActionCreator = require('../../actions/enhancedoffpagecomments/enhancedoffpagecommentactioncreator');
interface Props extends LocaleSelectionBase, PropsBase {
    showCheckBox: boolean;
    label: string;
    style?: React.CSSProperties;
    isCheckboxSelected: boolean;
    isToggleButtonSelected: boolean;
    index: number;
    isDefinitive: boolean;
    isCommentButtonSelected?: boolean;
    remarkHeaderText?: string;
    hideAnnotationToggleButton?: boolean;
}

/* tslint:disable:no-empty-interfaces */
interface State {
    renderedOn?: number;
}
/* tslint:disable:no-empty-interfaces */

/**
 * componenet for showing the markscheme panel dropdown items
 * @param props
 */
class MarkschemepanelHeaderDropdownItem extends pureRenderComponent<Props, State> {

    /**
     * Constructor
     * @param props
     */
    constructor(props: Props, state: State) {
        super(props, state);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        return (
            <li className='remark-menu-item'>
                {this.props.showCheckBox ? <input type='checkbox'
                    id={this.props.id}
                    key={this.props.id}
                    readOnly={true}
                    className='checkbox show-remark'
                    checked={this.props.isCheckboxSelected}
                    aria-label={this.getTitleText()}
                    data-value={this.props.isCheckboxSelected} /> : ''}
                <label className='remark-label' id='remark-label' title={this.getTitleText()}
                    onClick={() => { this.onDropdownItemClick(); }}>
                    {this.props.label}
                </label>
                {this.props.hideAnnotationToggleButton ? null :
                    <ToggleButton title={this.getToggleButtonTitle()}
                        id={this.props.id}
                        key={this.props.id + '-toggle'}
                        selectedLanguage={this.props.selectedLanguage}
                        isChecked={this.props.isToggleButtonSelected}
                        index={this.props.index}
                        onChange={this.onToggleButtonClick}
                        style={this.props.style}
                        onText={localeStore.instance.TranslateText('generic.toggle-button-states.on')}
                        offText={localeStore.instance.TranslateText('generic.toggle-button-states.off')}/>}
                {this.renderRadioButtons()}
            </li>
        );
    }

    /**
     * ComponentDidMount life cycle method
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    public componentDidMount() {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            enhancedOffpageCommentStore.instance.addListener(
                enhancedOffpageCommentStore.EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS,
                this.switchComments);
        }
    }

    /**
     * ComponentWillUnmount life cycle method
     * 
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    public componentWillUnmount() {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            enhancedOffpageCommentStore.instance.removeListener(
                enhancedOffpageCommentStore.EnhancedOffPageCommentStore.SWITCH_ENHANCED_OFFPAGE_COMMENTS,
                this.switchComments);
        }
    }

    /**
     * Gets the title text
     */
    private getTitleText() {
        if (this.props.index > 0) {
            let toolTipText = this.props.isDefinitive ? 'definitive-marks' : 'previous-marks';
            return this.props.isCheckboxSelected ? stringHelper.format(localeStore.instance.TranslateText
                ('marking.response.previous-marks.' + toolTipText + '-checkbox-tooltip-hide'),
                [constants.NONBREAKING_HYPHEN_UNICODE]) :
                stringHelper.format(localeStore.instance.TranslateText
                    ('marking.response.previous-marks.' + toolTipText + '-checkbox-tooltip-show'),
                    [constants.NONBREAKING_HYPHEN_UNICODE]);
        }
    }

    /**
     * Get the toggle button title
     */
    private getToggleButtonTitle() {
        if (this.props.index === 0) {
            return this.props.isToggleButtonSelected ?
                stringHelper.format(localeStore.instance.TranslateText
                    ('marking.response.mark-scheme-panel.annotations-switch-tooltip-hide'),
                    [constants.NONBREAKING_HYPHEN_UNICODE]) :
                stringHelper.format(localeStore.instance.TranslateText
                    ('marking.response.mark-scheme-panel.annotations-switch-tooltip-show'),
                    [constants.NONBREAKING_HYPHEN_UNICODE]);
        } else {
            let toolTipText = this.props.isDefinitive ? 'definitive-annotations' : 'previous-annotations';
            return this.props.isToggleButtonSelected ?
                stringHelper.format(localeStore.instance.TranslateText
                    ('marking.response.previous-marks.' + toolTipText + '-switch-tooltip-hide'),
                    [constants.NONBREAKING_HYPHEN_UNICODE]) :
                stringHelper.format(localeStore.instance.TranslateText
                    ('marking.response.previous-marks.' + toolTipText + '-switch-tooltip-show'),
                    [constants.NONBREAKING_HYPHEN_UNICODE]);
        }
    }

    /**
     * Clicking dropdown item.
     */
    private onDropdownItemClick = () => {
        let index = this.props.index;
        if (index > 0) {
            let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
            let currentVisibilityInfo: marksandannotationsvisibilityinfo = marksAndAnnotationsVisibilityHelper.
                getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
                markingStore.instance.currentMarkGroupId).get(index);
            let visibilityInfo: marksandannotationsvisibilityinfo = new marksandannotationsvisibilityinfo();
            visibilityInfo.markGroupId = currentVisibilityInfo.markGroupId;
            visibilityInfo.isMarkVisible = !this.props.isCheckboxSelected;
            visibilityInfo.isAnnotationVisible = !this.props.isCheckboxSelected;
            visibilityInfo.isEnhancedOffpageCommentVisible = currentVisibilityInfo.isEnhancedOffpageCommentVisible;
            let selectedCommentIndex: number = enhancedOffpageCommentStore.instance.currentEnhancedOffpageCommentIndex;
            let isEnchancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
            //update default markscheme panel width
            markSchemeHelper.updateDefaultMarkSchemePanelWidth(visibilityInfo.isMarkVisible);
            markingActionCreator.updateMarksAndAnnotationVisibility(index, visibilityInfo,
                isEnchancedOffpageCommentVisible, selectedCommentIndex);
        }
    };

    /**
     * Clicking toggle button
     */
    private onToggleButtonClick = (index: number, isChecked: boolean): void => {
        let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let currentVisibilityInfo: marksandannotationsvisibilityinfo = marksAndAnnotationsVisibilityHelper.
            getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
            markingStore.instance.currentMarkGroupId).get(index);
        let visibilityInfo: marksandannotationsvisibilityinfo = new marksandannotationsvisibilityinfo();
        visibilityInfo.markGroupId = currentVisibilityInfo.markGroupId;
        visibilityInfo.isMarkVisible = currentVisibilityInfo.isMarkVisible;
        visibilityInfo.isAnnotationVisible = isChecked;
        visibilityInfo.isEnhancedOffpageCommentVisible = currentVisibilityInfo.isEnhancedOffpageCommentVisible;
        let selectedCommentIndex: number = enhancedOffpageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        // enhancedoffpageCommentVisiblity set as false to avoid rendering comments on toggle change
        markingActionCreator.updateMarksAndAnnotationVisibility(index, visibilityInfo,
            false, selectedCommentIndex);
    };

    /**
     * Method to render Radio buttons.
     * 
     * @private
     * @returns 
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    private renderRadioButtons() {
        if (markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible) {
            let commentIndex: number = this.props.index;
            return (
                <div className='comments-radio'>
                    <input type='radio' value='selected' id={(commentIndex).toString() + '_Comment'}
                        name='shoComments'
                        checked={this.props.isCommentButtonSelected ? true : false}
                        onChange={this.onCheckedChange.bind(this)} />
                    <label htmlFor={(commentIndex).toString() + '_Comment'}
                        title={this.toolTipForRadioButton}>
                        <span className='radio-ui'></span>
                        <span className='label-text'>{'Comment'}</span>
                    </label>
                </div>
            );
        } else {
            return null;
        }
    }

    /**
     * on Radio button click
     */
    private onCheckedChange = (event?: any) => {
        // If the comment is not edited then we can switch the comments otherwise we need to show discard popup
        if (enhancedOffpageCommentStore.instance.isEnhancedOffPageCommentEdited === false) {
            this.switchComments();
        } else {
            // This will display discard popup
            enhancedOffPageCommentActionCreator.switchEnhancedOffPageComments(true);
        }
    }

    /**
     * switch comments while clicking on radio button
     * @private
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    private switchComments = () => {
        let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let currentVisibilityInfo: marksandannotationsvisibilityinfo = marksAndAnnotationsVisibilityHelper.
            getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
            markingStore.instance.currentMarkGroupId).get(this.props.index);
        let visibilityInfo: marksandannotationsvisibilityinfo = new marksandannotationsvisibilityinfo();
        visibilityInfo.markGroupId = currentVisibilityInfo.markGroupId;
        visibilityInfo.isMarkVisible = currentVisibilityInfo.isMarkVisible;
        visibilityInfo.isAnnotationVisible = currentVisibilityInfo.isAnnotationVisible;
        visibilityInfo.isEnhancedOffpageCommentVisible = !this.props.isCommentButtonSelected;

        markingActionCreator.updateEnhancedOffpageCommentData(this.props.index,
            markingStore.instance.currentMarkGroupId, this.props.style, this.props.remarkHeaderText);
        let isEnchancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
        let selectedCommentIndex: number = enhancedOffpageCommentStore.instance.currentEnhancedOffpageCommentIndex;
        markingActionCreator.updateMarksAndAnnotationVisibility(this.props.index, visibilityInfo,
            isEnchancedOffpageCommentVisible, selectedCommentIndex);
    }

    /**
     * This will return the localised tooltip for comments radio button
     * @readonly
     * @private
     * @memberof MarkschemepanelHeaderDropdownItem
     */
    private get toolTipForRadioButton() {
        return this.props.index === 0 ? localeStore.instance.TranslateText
            ('marking.response.previous-marks.current-comments-radio-button-tooltip') :
            this.props.isDefinitive ? localeStore.instance.TranslateText
                ('marking.response.previous-marks.definitive-comments-radio-button-tooltip')
                : localeStore.instance.TranslateText('marking.response.previous-marks.previous-comments-radio-button-tooltip');
    }
}

export = MarkschemepanelHeaderDropdownItem;