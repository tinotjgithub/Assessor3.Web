/// <reference path='typings/tabheaderdata.ts' />
/* tslint:disable:no-unused-variable */
import React = require('react');
import TabHeader = require('./tabheader');
import pureRenderComponent = require('../../base/purerendercomponent');

/**
 * Properties of TabControl component
 */
interface Props extends LocaleSelectionBase {
    tabHeaders: Array<TabHeaderData>;
    selectTab: Function;
}

/**
 * Represents the TabControl Compoent
 */
class TabControl extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for TabControl.
     */
    public render() {

        let tabHeaders: JSX.Element[] = [];
        this.props.tabHeaders.map((tabItem: any) => {

            tabHeaders.push(<TabHeader index={tabItem.index}
                                        key ={'tabHeaderItem_' + tabItem.key }
                                        id={'tabHeaderItem_' + tabItem.id }
                                        class= {tabItem.class}
                                        isSelected= {tabItem.isSelected}
                                        isDisabled= {tabItem.isDisabled}
                                        tabNavigation = {tabItem.tabNavigation}
                                        headerCount = {tabItem.headerCount === undefined ? 0 : tabItem.headerCount}
                                        isHeaderCountNotRequired={tabItem.isHeaderCountNotRequired === undefined
                                            ? false : tabItem.isHeaderCountNotRequired}
                                        headerText = { tabItem.headerText }
                                        selectTab = { this.props.selectTab }/>);
        });

        return (
            <ul className='tab-nav' role='tablist'>
               {tabHeaders}
            </ul>
        );
    }
}
export = TabControl;