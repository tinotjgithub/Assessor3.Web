/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import GridControl = require('../utility/grid/gridcontrol');
import enums = require('../utility/enums');
let classNames = require('classnames');
import localeStore = require('../../stores/locale/localestore');
import awardingCandidateDetailsHelper = require('../utility/awarding/helpers/awardingcandidatedetailshelper');
import awardingStore = require('../../stores/awarding/awardingstore');
import scriptStore = require('../../stores/script/scriptstore');
import responseStore = require('../../stores/response/responsestore');
import ccStore = require('../../stores/configurablecharacteristics/configurablecharacteristicsstore');
import TableControl = require('../utility/table/tablewrapper');
import timerHelper = require('../../utility/generic/timerhelper');
import gridRow = require('../utility/grid/gridrow');
import Immutable = require('immutable');
import AwardingTableWrapper = require('./awardingtablewrapper');
import navigationHelper = require('../utility/navigation/navigationhelper');
import loadContainerActionCreator = require('../../actions/navigation/loadcontaineractioncreator');
import responseActionCreator = require('../../actions/response/responseactioncreator');
import awardingHelper = require('../utility/awarding/awardinghelper');
import scriptActionCreator = require('../../actions/script/scriptactioncreator');
import candidateScriptInfo = require('../../dataservices/script/typings/candidatescriptinfo');
import markSchemeHelper = require('../../utility/markscheme/markschemehelper');
import stampActionCreator = require('../../actions/stamp/stampactioncreator');
import responseHelper = require('../utility/responsehelper/responsehelper');
import stampStore = require('../../stores/stamp/stampstore');
import imagezoneActionCreator = require('../../actions/imagezones/imagezoneactioncreator');
import operationModeHelper = require('../utility/userdetails/userinfo/operationmodehelper');
import qigStore = require('../../stores/qigselector/qigstore');
import ecourseWorkHelper = require('../utility/ecoursework/ecourseworkhelper');


/**
 * State of Team Management component
 */
interface State {
    renderedOn?: number;
    isBusy?: boolean;
}

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    viewType: enums.AwardingViewType;
    renderedOn: number;
    selectedGrade: string;
    selectedMark: string;
}

class AwardingCandidateDetails extends pureRenderComponent<Props, State> {

    private awardingCandidateDetailsHelper: awardingCandidateDetailsHelper;
    private awardingCandidateData: any;
    private cssRowHeaderTableStyle: React.CSSProperties;
    private cssRowHeaderHeaderTableStyle: React.CSSProperties;
    private cssContentWrapTableStyle: React.CSSProperties;
    private cssBodyWrapTableStyle: React.CSSProperties;
    private frozenHeadStyle: React.CSSProperties;
    private awardingCandidateGradeViewCollection: [Immutable.List<gridRow>, Immutable.List<gridRow>];
    private awardingTableHeaderRow: Immutable.List<gridRow>;
    private awardingFrozenTableHeaderRow: Immutable.List<gridRow>;
    private expandedItemDetails = Immutable.Map<string, Immutable.Map<string, boolean>>();

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        // initialising examiner view data helper
        this.awardingCandidateDetailsHelper = new awardingCandidateDetailsHelper();
        this.expandedItemDetails = Immutable.Map<string, Immutable.Map<string, boolean>>();
        /* getting user preference for the grid view */
        this.state = {
            isBusy: false,
            renderedOn: this.props.renderedOn
        };
    }

    /**
     * componentDidMount React lifecycle event
     */
    public componentDidMount() {
        awardingStore.instance.addListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED,
            this.candidateDataFilterUpdated);
        ccStore.instance.addListener(
            ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.reRender);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        awardingStore.instance.addListener(awardingStore.AwardingStore.SELECTED_CANDIDATE_DATA_UPDATED, this.selectedCandidateUpdated);
    }

    /**
     * componentWillUnmount React lifecycle event
     */
    public componentWillUnmount() {
        awardingStore.instance.removeListener(awardingStore.AwardingStore.AWARDING_CANDIDATE_DATA_RETRIEVED,
            this.candidateDataFilterUpdated);
        ccStore.instance.removeListener(
            ccStore.ConfigurableCharacteristicsStore.EXAM_BODY_CC_GET,
            this.reRender);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.openResponse);
        awardingStore.instance.removeListener(awardingStore.AwardingStore.SELECTED_CANDIDATE_DATA_UPDATED, this.selectedCandidateUpdated);
    }

    /**
     * Component will receive props
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props !== nextProps) {
            this.expandedItemDetails = Immutable.Map<string, Immutable.Map<string, boolean>>();
        }
    }

    /**
     * render
     */
    public render() {
        this.awardingCandidateData = this.getFilteredCandidateData();
        this.awardingFrozenTableHeaderRow = this.awardingCandidateDetailsHelper.
            generateFrozenRowHeader(enums.AwardingViewType.Totalmark, '', enums.SortDirection.Ascending, true);
        this.awardingTableHeaderRow = this.awardingCandidateDetailsHelper.generateTableHeader('', enums.SortDirection.Ascending,
            this.awardingCandidateData, enums.AwardingViewType.Grade);
        this.awardingCandidateGradeViewCollection = this.awardingCandidateDetailsHelper.
            generateAwardingGridItems(this.awardingCandidateData, this.props.viewType,
                this.expandedItemDetails, this.expandOrCollapseCallback);
        return (
            <AwardingTableWrapper
                awardingFrozenHeaderRows={this.awardingFrozenTableHeaderRow}
                awardingColumnHeaderRows={this.awardingTableHeaderRow}
                awardingCandidateGradeViewCollection={this.awardingCandidateGradeViewCollection}
            />
        );
    }

    /**
     *  reset
     */
    private candidateDataFilterUpdated = () => {
        this.expandedItemDetails = Immutable.Map<string, Immutable.Map<string, boolean>>();
        this.reRender();
    }

    /**
     * selectred candidate updated
     */
    private selectedCandidateUpdated = () => {
        let selectedCandidateData = awardingHelper.awardingSelectedCandidateData();
        let markGroupId = selectedCandidateData.responseItemGroups[0].markGroupId;
        let msgId = selectedCandidateData.responseItemGroups[0].markSchemeGroupId;
        let candidateScriptId = selectedCandidateData.responseItemGroups[0].candidateScriptId;

        // fetching candidate script meta data for ecw component
        if (ecourseWorkHelper.isECourseworkComponent) {
            let candidateScriptMetadataPromise = ecourseWorkHelper.fetchECourseWorkCandidateScriptMetadata(
                selectedCandidateData.responseItemGroups[0].displayId);
        }


        selectedCandidateData.responseItemGroups.map((x: ResponseItemGroup) => {
            imagezoneActionCreator.getImagezoneList
                (x.questionPaperId,
                x.markSchemeGroupId,
                awardingStore.instance.selectedSession.markingMethodID, false);
        });

        responseActionCreator.openResponse(
            selectedCandidateData.responseItemGroups[0].displayId,
            enums.ResponseNavigation.specific,
            enums.ResponseMode.closed,
            markGroupId,
            enums.ResponseViewMode.none,
            enums.TriggerPoint.Awarding,
            enums.SampleReviewComment.None,
            0,
            true,
            false,
            candidateScriptId,
            false,
            qigStore.instance.selectedQIGForMarkerOperation.examinerRoleId,
            false);

        /* get the marks for the selected response */
        markSchemeHelper.getMarks(selectedCandidateData.displayID, enums.MarkingMode.Sample, true);
    }

    /**
     * This will open the response item
     */
    private openResponse = (): void => {
        let selectedCandidateData = awardingHelper.awardingSelectedCandidateData();
        stampActionCreator.getStampData(selectedCandidateData.responseItemGroups[0].markSchemeGroupId,
            stampStore.instance.stampIdsForSelectedQIG, selectedCandidateData.markingMethodID,
            responseHelper.isEbookMarking, false, true, true, true);
        navigationHelper.loadResponsePage();
    };

    /**
     * set the awarding candidate details calback
     * @param expandedItemList
     */
    private expandOrCollapseCallback = (selectedItem: string,
        isExpanded: boolean, currentCilckedItem: enums.AwardingViewType,
        isParentItem: boolean, parentItemName: string) => {

        if (isExpanded) {
            if (this.expandedItemDetails.has(parentItemName)) {
                let keys = this.expandedItemDetails.get(parentItemName);
                keys = keys.set(selectedItem, isExpanded);
                this.expandedItemDetails = this.expandedItemDetails.set(parentItemName, keys);
            } else {
                let expandedItemCollection = Immutable.Map<string, boolean>();
                expandedItemCollection = expandedItemCollection.set(selectedItem, isExpanded);
                this.expandedItemDetails = this.expandedItemDetails.set(parentItemName, expandedItemCollection);
            }
        } else {
            if (isParentItem) {
                this.expandedItemDetails = this.expandedItemDetails.delete(parentItemName);
            } else {
                let keys = this.expandedItemDetails.get(parentItemName);
                keys = keys.delete(selectedItem);
                this.expandedItemDetails = this.expandedItemDetails.set(parentItemName, keys);
            }
        }

        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * setAwardingComponentsSelectin
     */
    private reRender = () => {
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * filtering the candiadte details collection based on filter values.
     */
    private getFilteredCandidateData(): Immutable.List<AwardingCandidateDetails> {
        let data = awardingStore.instance.awardingCandidateData;
        let _selectedTotalMark = this.props.selectedMark;
        let _selectedGrade = this.props.selectedGrade;

        return Immutable.List<AwardingCandidateDetails>(data.filter(x => x.totalMark.toFixed(2).toString() ===
            (_selectedTotalMark === 'All' ? x.totalMark.toFixed(2).toString() : _selectedTotalMark)
            && x.grade === (_selectedGrade === 'All' ? x.grade : _selectedGrade)));
    }
}
export = AwardingCandidateDetails;