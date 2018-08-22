import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import Immutable = require('immutable');
import awardingActionCreator = require('../../actions/awarding/awardingactioncreator');
import ccActionCreator = require('../../actions/configurablecharacteristics/configurablecharacteristicsactioncreator');
import awardingstore = require('../../stores/awarding/awardingstore');
import SearchPanel = require('../utility/search/searchpanel');
import localeStore = require('../../stores/locale/localestore');
import classNames = require('classnames');
import userOptionsHelper = require('../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../utility/useroption/useroptionkeys');
import awardingHelper = require('../utility/awarding/awardinghelper');
import enums = require('../utility/enums');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');

/**
 * Properties of Awarding Collapsible Panel
 */
interface Props extends PropsBase, LocaleSelectionBase {
}

interface State {
    renderedOn: number;
    hasScrollBar: boolean;
}

interface ComponentItemProps extends PropsBase, LocaleSelectionBase {
    componentName: string;
    clickHandler: Function;
    examProductId: number;
    componentId: string;
    isActive: boolean;
    markSchemeGroupId: number;
    questionPaperId: number;
}

/* tslint:disable:variable-name */
const ComponentItem: React.StatelessComponent<ComponentItemProps> = (props: ComponentItemProps) => {
    const onClickHandler = (event) => {
        if (props.clickHandler) {
            props.clickHandler(props.examProductId, props.componentId, props.componentName,
                props.markSchemeGroupId, props.questionPaperId);
        }
    };

    return (
        <li className={classNames('panel', { 'active open': props.isActive })}>
            <a href='javascript:void(0)' title={props.componentName} className='left-menu-link panel-link' onClick={onClickHandler}>
                <span className='menu-text' >{props.componentName}</span>
            </a>
        </li>
    );
};
/* tslint:enable:variable-name */

/**
 * Awarding Collapsible panel
 * @param props
 */
class AwardingComponentsPanel extends pureRenderComponent<Props, State> {
    private searchData: SearchData = { isVisible: true, isSearching: undefined, searchText: '' };
    private selectedComponentId: string;
    private selectedexamProductId: string;

	/**
	 * @constructor
	 * @param props
	 * @param state
	 */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: 0,
            hasScrollBar: false
        };
        this.onComponentClick = this.onComponentClick.bind(this);
    }

    /**
     * Render component
     */
    public render() {
        return (
            <div className={classNames('column-left', { 'hovered': this.state.hasScrollBar })}
                onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div className='column-left-inner'>
                    <div className='left-menu-holder'>
                        <ul className='left-menu panel-group' id='Component_List'>
                            {this.searchItemElement()}
                            {this.listElement()}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Life cycle event handler for did mount
     */
    public componentDidMount() {
        awardingstore.instance.addListener(awardingstore.AwardingStore.AWARDING_COMPONENT_SELECTED, this.reRenderOnComponentSelect);
    }

    /**
     * Life cycle event handler will un-mount
     */
    public componentWillmount() {
        awardingstore.instance.removeListener(awardingstore.AwardingStore.AWARDING_COMPONENT_SELECTED, this.reRenderOnComponentSelect);
    }

    /**
     * re-render . changing the state rendered on
     */
    private reRenderOnComponentSelect = () => {
        this.selectedComponentId = awardingstore.instance.selectedComponentId;
        this.selectedexamProductId = awardingstore.instance.selectedExamProductId;
        ccActionCreator.getMarkSchemeGroupCCs(awardingstore.instance.selectedSession.markSchemeGroupId,
            awardingstore.instance.selectedSession.questionPaperID);
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * re-render, on mouse enter
     */
    private onMouseEnter = () => {
        this.setState({
            hasScrollBar: true
        });
    };

    /**
     * re-render, on mouse leave
     */
    private onMouseLeave = () => {
        this.setState({
            hasScrollBar: false
        });
    };

    /**
     * Callback function for on_search functionality.
     */
    private onSearch = (searchText: string) => {
        this.searchData = { isVisible: true, isSearching: true, searchText: searchText };
        this.reRenderOnComponentSelect();
    }

    /*
     * returns the element for search text box.
     */
    private searchItemElement = (): JSX.Element => {
        return (
            <li className='search-box-wrap lite'>
                <SearchPanel
                    searchWrapClass={''}
                    isSearchResultTextVisible={false}
                    searchResultsFor={''}
                    searchPlaceHolder={localeStore.instance.TranslateText('awarding.left-panel.search-panel-placeholder')}
                    searchTooltip={localeStore.instance.TranslateText('awarding.left-panel.search-panel-placeholder')}
                    searchCancel={localeStore.instance.TranslateText('awarding.left-panel.search-close')}
                    searchClassName={'search-box-panel'}
                    onSearch={this.onSearch}
                    searchData={this.searchData}
                    selectedLanguage={this.props.selectedLanguage}
                    id={'awarding_component_search'}
                    key={'awarding_component_search_key'}
                />
            </li>
        );
    }

    /**
     * returns the component list elements - creating from the component collection in the store.
     */
    private listElement = (): JSX.Element => {
        let listElement = null;
        let counter: number = 0;
        let componentList = awardingstore.instance.componentList;
        let awardingComponentName: string;

        if (componentList) {
            /* Filtering the list based on serach text (if any) */
            componentList = (this.searchData.searchText !== '') ?
                componentList.filter(x => x.assessmentCode.toLocaleLowerCase().
                    indexOf(this.searchData.searchText.toLocaleLowerCase()) !== -1).toList() :
                componentList;
            listElement = componentList.map((item: AwardingComponentAndSession) => {

                awardingComponentName = stringFormatHelper.getFormattedAwardingComponentName(item.assessmentCode, item.componentId);

                counter++;
                return <ComponentItem
                    componentName={awardingComponentName}
                    examProductId={item.examProductId}
                    componentId={item.componentId}
                    markSchemeGroupId={item.markSchemeGroupId}
                    questionPaperId={item.questionPaperID}
                    id={'componentItem' + counter.toString()}
                    key={'componentItem' + counter.toString()}
                    selectedLanguage={this.props.selectedLanguage}
                    clickHandler={this.onComponentClick}
                    isActive={item.componentId === this.selectedComponentId
                        && item.examProductId.toString() === this.selectedexamProductId} />;
            });
        }
        return listElement;
    }

    /**
     * event handler for onclick of component.
     */
    private onComponentClick = (examProductId: number, componentId: string, assessmentCode: string,
        markSchemeGroupId: number, questionPaperId: number) => {
        if (examProductId.toString() !== awardingstore.instance.selectedExamProductId) {
            let ccPromise = ccActionCreator.getMarkSchemeGroupCCs(markSchemeGroupId, questionPaperId);
            ccPromise.then(() => {
                awardingActionCreator.selectAwardingComponent(examProductId.toString(), componentId, assessmentCode, false);
            });
        }
    };
}

export = AwardingComponentsPanel;