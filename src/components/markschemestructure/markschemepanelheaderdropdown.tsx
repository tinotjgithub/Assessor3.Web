import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
let classNames = require('classnames');
import stringHelper = require('../../utility/generic/stringhelper');
import constants = require('../utility/constants');
import localeStore = require('../../stores/locale/localestore');
import markingStore = require('../../stores/marking/markingstore');
import worklistStore = require('../../stores/worklist/workliststore');
import enums = require('../utility/enums');
import MarkschemepanelHeaderDropdownItem = require('./markschemepanelheaderdropdownitem');
import marksandannotationsvisibilityinfo = require('../utility/annotation/marksandannotationsvisibilityinfo');
import domManager = require('../../utility/generic/domhelper');
import colouredannotationshelper = require('../../utility/stamppanel/colouredannotationshelper');
import responseStore = require('../../stores/response/responsestore');
import responseHelper = require('../utility/responsehelper/responsehelper');
import marksAndAnnotationsVisibilityHelper = require('../utility/marking/marksandannotationsvisibilityhelper');
import marksAndAnnotationsVisibilityInfo = require('../utility/annotation/marksandannotationsvisibilityinfo');
import examinerMarksAndAnnotation = require('../../stores/response/typings/examinermarksandannotation');
import markSchemeStructureActionCreator = require('../../actions/markschemestructure/markschemestructureactioncreator');
import examinerMarkData = require('../../stores/response/typings/examinermarkdata');
import markerOperationModeFactory = require('../utility/markeroperationmode/markeroperationmodefactory');
interface Props extends LocaleSelectionBase, PropsBase {
    renderedOnMarksAndAnnotationVisibility?: number;
    hideAnnotationToggleButton?: boolean;
}

interface State {
    isPreviousMarksDropdownOpen?: boolean;
    renderedOn?: number;
}
/**
 * stateless componenet for showing the markscheme panel header dropdown for remarks
 * @param props
 */
class MarkschemepanelHeaderDropdown extends pureRenderComponent<Props, State> {

    private _boundHandleOnClick: EventListenerObject = null;
    private isDropdownOpen: boolean = false;

    /**
     * @Constrctor
     * @param {Props} props
     * @param {any} state
     */
    constructor(props: Props, state: any) {
        super(props, state);

        this.state = {
            isPreviousMarksDropdownOpen: false
        };

        this._boundHandleOnClick = this.handleOnClick.bind(this);
    }

    /**
     * Get dropdown items
     */
    private getDropdownItems() {
        let allMarksAndAnnotations = markingStore.instance.getAllMarksAndAnnotations();

        // If marks not downloaded yet. wait the component from rendering, It will re render after loading the marks.
        if (allMarksAndAnnotations == null) {
            return;
        }

        let marksAndAnnotationVisibilityDetails = markingStore.instance.getMarksAndAnnotationVisibilityDetails;
        let visibilityInfos: Immutable.Map<number, marksAndAnnotationsVisibilityInfo> =
            marksAndAnnotationsVisibilityHelper.getMarksAndAnnotationVisibilityInfo(marksAndAnnotationVisibilityDetails,
                markingStore.instance.currentMarkGroupId);
        let currentMarkGroupId = markingStore.instance.currentMarkGroupId;
        let responseMode = responseStore.instance.selectedResponseMode;
        // to ge the remark count removing the current marking
        let allMarksAndAnnotationsCount: number = allMarksAndAnnotations.length - 1;
        let remarkBaseColor = colouredannotationshelper.getRemarkBaseColor(enums.DynamicAnnotation.None).fill;
        let examinerMarksAgainstResponse: Array<examinerMarkData> = markingStore.instance.getExaminerMarksAgainstResponse;
        let counter = 0;
        let items = allMarksAndAnnotations.map((item: Immutable.List<examinerMarksAndAnnotation>) => {
            let allMarksAndAnnotation = examinerMarksAgainstResponse[markingStore.instance.currentMarkGroupId]
                .examinerMarkGroupDetails[markingStore.instance.currentMarkGroupId]
                .allMarksAndAnnotations[counter];
            let previousRemarkBaseColor: string = colouredannotationshelper.getPreviousRemarkBaseColor(allMarksAndAnnotation);
            let markSchemeHeaderItems: Immutable.Map<string, any> = marksAndAnnotationsVisibilityHelper.
                getMarkSchemePanelColumnHeaderAttributes(
                counter,
                item,
                allMarksAndAnnotationsCount,
                visibilityInfos,
                responseHelper.isClosedEurSeed,
                responseHelper.isClosedLiveSeed,
                remarkBaseColor,
                responseMode,
                responseHelper.getCurrentResponseSeedType(),
                markingStore.instance.currentMarkGroupId,
                worklistStore.instance.currentWorklistType,
                allMarksAndAnnotation,
                previousRemarkBaseColor,
                markerOperationModeFactory.operationMode.canRenderPreviousMarksInStandardisationSetup);
            let remarkRequestTypeId = allMarksAndAnnotations[counter].remarkRequestTypeId;
            let dropdownItem = <MarkschemepanelHeaderDropdownItem
                id={this.props.id + '_remark_dropdown_item_' + remarkRequestTypeId + '_' + counter.toString()}
                key={this.props.id + '_remark_dropdown_item_' + remarkRequestTypeId + '_' + counter.toString()}
                label={markSchemeHeaderItems.get('label')}
                showCheckBox={markSchemeHeaderItems.get('showCheckbox')}
                isCheckboxSelected={markSchemeHeaderItems.get('isMarksVisible')}
                isToggleButtonSelected={markSchemeHeaderItems.get('isAnnotationVisible')}
                style={markSchemeHeaderItems.get('style')}
                index={counter}
                isDefinitive={markSchemeHeaderItems.get('isDefinitive')}
                selectedLanguage={this.props.selectedLanguage}
                isCommentButtonSelected={markSchemeHeaderItems.get('isEnhancedOffpageCommentVisible')}
                remarkHeaderText={markSchemeHeaderItems.get('header') }
                hideAnnotationToggleButton={this.props.hideAnnotationToggleButton}/>;
            counter++;

            return dropdownItem;
        });

        return items;
    }

    /**
     * Check to add class if dropdown open
     */
    private isOpen() {
        return classNames(
            { 'open': this.state.isPreviousMarksDropdownOpen === true && this.isDropdownOpen },
            { 'close': this.state.isPreviousMarksDropdownOpen === false && this.isDropdownOpen },
            { '': this.state.isPreviousMarksDropdownOpen === undefined }
        );
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        return (
            <div id='remark_dropdown_menu' className='filter-previous-mark'>
                <div className={'dropdown-wrap align-right remark-menu ' + this.isOpen()}>
                    <a href='javascript:void(0)' className='menu-button'
                        title={localeStore.instance.TranslateText('marking.response.previous-marks.people-icon')}
                        onClick={() => { this.onPreviousMarksDropdownClick(); }}>
                        <span className='sprite-icon people-icon'>
                            {localeStore.instance.TranslateText('marking.response.previous-marks.people-icon')}
                        </span>
                        <span className='sprite-icon menu-arrow-icon'>
                            {localeStore.instance.TranslateText('marking.response.previous-marks.people-icon')}
                        </span>
                    </a>
                    <div className='menu'>
                        <div className='remark-menu-header clearfix'>
                            <div className='label-display-marks shift-left'>
                                {stringHelper.format(
                                    localeStore.instance.TranslateText('marking.response.previous-marks.display-marks-header'),
                                    [constants.NONBREAKING_HYPHEN_UNICODE])}
                            </div>
                            {this.props.hideAnnotationToggleButton ? null :
                                <div className='label-show-annotations shift-right'>
                                    {stringHelper.format(
                                        localeStore.instance.TranslateText
                                            ('marking.response.previous-marks.display-annotations-header'),
                                        [constants.NONBREAKING_HYPHEN_UNICODE]) }
                                </div>}
                            {this.renderCommentsColumn()}
                        </div>
                        <ul className='remark-menu-content'>
                            {this.getDropdownItems()}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Returns Comments Column element.
     */
    private renderCommentsColumn = (): JSX.Element => {
        let isEnhancedOffpageCommentVisible = markerOperationModeFactory.operationMode.isEnhancedOffPageCommentVisible;
        return isEnhancedOffpageCommentVisible ? (<div className='label-show-comments shift-right'>
            {stringHelper.format(localeStore.instance.TranslateText('marking.response.previous-marks.comments'),
                [constants.NONBREAKING_HYPHEN_UNICODE])} </div>) : null;
    }

    /**
     * Clicking on PreviousMarksDropdown
     */
    private onPreviousMarksDropdownClick = () => {
        if (this.state.isPreviousMarksDropdownOpen === undefined) {
            this.setState({
                isPreviousMarksDropdownOpen: true
            });
        } else {
            this.setState({
                isPreviousMarksDropdownOpen: !this.state.isPreviousMarksDropdownOpen
            });
        }

        this.isDropdownOpen = true;
    };

    /**
     * Method which handles the click event of window
     */
    private handleOnClick = (e: MouseEvent | TouchEvent): any => {
        if (e.target !== undefined &&
            domManager.searchParentNode(e.target, function (el: any) { return el.id === 'remark_dropdown_menu'; }) == null) {
            if (this.state.isPreviousMarksDropdownOpen !== undefined) {
                this.setState({ isPreviousMarksDropdownOpen: undefined });
            }
        }

        // both touchend and click event is fired one after other, 
        // this avoid resetting store in touchend
        if (e.type !== 'touchend') {
            markSchemeStructureActionCreator.markSchemeHeaderDropDown(this.state.isPreviousMarksDropdownOpen);
        }
    };

    /**
     * The method to rerender.
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        window.addEventListener('touchend', this._boundHandleOnClick);
        window.addEventListener('click', this._boundHandleOnClick);
        markingStore.instance.addListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.reRender);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        window.removeEventListener('click', this._boundHandleOnClick);
        window.removeEventListener('touchend', this._boundHandleOnClick);
        markingStore.instance.removeListener(markingStore.MarkingStore.OPEN_RESPONSE_EVENT, this.reRender);
    }
}

export = MarkschemepanelHeaderDropdown;