/* tslint:disable:no-unused-variable */
import React = require('react');
import TabContent = require('./tabcontent');
import pureRenderComponent = require('../../base/purerendercomponent');

/**
 * Properties of Tab content container component
 */
interface Props extends LocaleSelectionBase {
    tabContents: Array<any>;
    renderedOn?: number;
}

/**
 * Represents the Tab content container Compoent
 */
class TabContentContainer extends pureRenderComponent<Props, any> {
    /**
     * @constructor
     */
    constructor(props: Props, state: any) {
        super(props, state);
    }

    /**
     * Render method for Tab content container.
     */
    public render() {

        let tabContents: JSX.Element[] = [];
        this.props.tabContents.map((tabItem: any) => {

            tabContents.push(<TabContent renderedOn={this.props.renderedOn}
                                index={tabItem.index}
                                key= { 'tabContentItem_' + tabItem.index }
                                class= {tabItem.class}
                                isSelected= {tabItem.isSelected}
                                id = {tabItem.id}
                                content = {tabItem.content} />);
        });

        return (
            <div className='tab-content-holder'
                key = { 'tab_container_key'}
                id = {'tab_container'}>
                { tabContents }
            </div>
        );
    }
}
export = TabContentContainer;