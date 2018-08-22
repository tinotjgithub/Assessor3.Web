/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import BusyIndicator = require('../utility/busyindicator/busyindicator');
import enums = require('../utility/enums');

/* tslint:disable:variable-name */
let WorkList;
/* tslint:enable:variable-name */

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    isFromMenu: boolean;
}
/* tslint:disable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn: number;
}


/**
 * React component class for Worklist base container
 */
class WorklistBaseContainer extends pureRenderComponent<Props, State> {

    /**
     * Constructor WorklistBaseContainer
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }

    /**
     * Render
     */
    public render() {

        if (WorkList) {
            if (this.props.isFromMenu) {
                return (<WorkList
                    id='container_worklist'
                    key='container_worklist_key'
                    selectedLanguage={this.props.selectedLanguage}
                    isFromMenu={this.props.isFromMenu}
                    renderedOn={this.state.renderedOn}
                    isOnline={this.props.isOnline}
                    setOfflineContainer={this.props.setOfflineContainer} />);
            } else {
                return (<WorkList
                    id='container_worklist'
                    key='container_worklist_key'
                    selectedLanguage={this.props.selectedLanguage}
                    renderedOn={this.state.renderedOn}
                    isOnline={this.props.isOnline}
                    setOfflineContainer={this.props.setOfflineContainer} />);
            }
        } else {
            return (<BusyIndicator
                id='modulesLoadingBusyIndicator'
                key='modulesLoadingBusyIndicator'
                isBusy={true}
                busyIndicatorInvoker={enums.BusyIndicatorInvoker.loadingModules} />);
        }
    }

    /**
     * Subscribe to component did mount event
     */
    public componentDidMount() {
        this.loadDependencies();
    }

    /**
     *  This will load the dependencies dynamically during component mount.
     */
    private loadDependencies() {
        require.ensure([
            './worklist'],
            function () {
                WorkList = require('./worklist');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = WorklistBaseContainer;