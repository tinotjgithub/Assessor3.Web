/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');

/* tslint:disable:variable-name */
let TeamManagement;
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
 * React component class for teammanagement base container
 */
class TeamManagementBaseContainer extends pureRenderComponent<Props, State> {
    /**
     * Constructor LoginForm
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

        if (TeamManagement) {
            if (this.props.isFromMenu) {
                return (<TeamManagement
					id='container_team_management'
                    key='container_team_management_key'
                    selectedLanguage={this.props.selectedLanguage}
                    renderedOn={this.state.renderedOn}
                    isFromMenu={this.props.isFromMenu}
                    isOnline={this.props.isOnline}
                    setOfflineContainer={this.props.setOfflineContainer} />);
            } else {
                return (<TeamManagement
                    id='container_team_management'
                    key='container_team_management_key'
                    selectedLanguage={this.props.selectedLanguage}
                    renderedOn={this.state.renderedOn}
                    isOnline={this.props.isOnline}
                    setOfflineContainer={this.props.setOfflineContainer} />);
            }
        } else {
            return null;
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
            './teammanagement'],
            function () {
                TeamManagement = require('./teammanagement');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = TeamManagementBaseContainer;