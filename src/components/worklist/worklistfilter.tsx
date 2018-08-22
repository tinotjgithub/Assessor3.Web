import React = require('react');
import classNames = require('classnames');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');


interface WorklistFilterProps extends PropsBase {
    isVisible: boolean;
    selectedFilter: enums.WorklistSeedFilter;
    onFilterChanged: Function;
    markSchemeGroupId: number;
}

interface WorklistFilterItemProps extends PropsBase {
    isVisible: boolean;
    name: string;
    label: string;
    onFilterChanged: Function;
    filter: enums.WorklistSeedFilter;
    selectedFilter: enums.WorklistSeedFilter;
}

/* tslint:disable:variable-name */

const FilterItem: React.StatelessComponent<WorklistFilterItemProps> = (props: WorklistFilterItemProps) => {
    if (props.isVisible) {
        return (
            <li id={'filter' + enums.getEnumString(enums.WorklistSeedFilter, props.filter)}
                            className={props.selectedFilter === props.filter ? 'selected' : ''}>
                <input type='radio' id={props.id} name={props.name}
                    value={props.selectedFilter === props.filter ? 'selected' : ''}
                    checked={props.selectedFilter === props.filter ? true : false}>
                </input>
                <label htmlFor={props.id}
                    onClick={() => { props.onFilterChanged(props.filter); }}>
                    <span className='radio-ui'></span>
                    <span className='label-text'>{props.label}</span>
                </label>
            </li>);
    } else {
        return null;
    }
};


/**
 * Stateless component for Worklist filter
 * @param props
 */
const WorklistFilter: React.StatelessComponent<WorklistFilterProps> = (props: WorklistFilterProps) => {
    if (props.isVisible) {
        return (
            <div className='col-wrap grid-nav padding-bottom-15'>
                <ul className='worklist-radio-filter'>
                    <li className='filter-by-title'>
                        <span>{localeStore.instance.TranslateText('team-management.examiner-worklist.filters.filter-by')} </span>
                    </li>
                    <FilterItem id={'fltrAll'} key={'key-fltrAll'} name={'filterSeeds'} isVisible={true}
                        onFilterChanged={props.onFilterChanged}
                        label={localeStore.instance.TranslateText('team-management.examiner-worklist.filters.all-responses')}
                        filter={enums.WorklistSeedFilter.All} selectedFilter={props.selectedFilter} />
                    <FilterItem id={'fltrSeeds'} key={'key-fltrSeeds'} name={'filterSeeds'} isVisible={true}
                        onFilterChanged={props.onFilterChanged}
                        label={localeStore.instance.TranslateText('team-management.examiner-worklist.filters.seeds-only')}
                        filter={enums.WorklistSeedFilter.SeedsOnly} selectedFilter={props.selectedFilter} />
                    <FilterItem id={'fltrUnrevdSeeds'} key={'key-fltrUnrevdSeeds'} name={'filterSeeds'}
                        isVisible={!ccValues.seniorExaminerPool(props.markSchemeGroupId)} onFilterChanged={props.onFilterChanged}
                        label={localeStore.instance.TranslateText('team-management.examiner-worklist.filters.unreviewed-seeds-only')}
                        filter={enums.WorklistSeedFilter.UnreviewedSeedsOnly} selectedFilter={props.selectedFilter} />
                </ul>
            </div>
        );
    } else {
        return null;
    }
};

export = WorklistFilter;
/* tslint:enable */
