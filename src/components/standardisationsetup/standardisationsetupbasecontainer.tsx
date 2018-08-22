/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');

/* tslint:disable:variable-name */
let StandardisationSetup;
/* tslint:enable:variable-name */

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
}
/* tslint:disable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn: number;
}

/**
 * React component class for standardisationsetup base container
 */
class StandardisationSetupBaseContainer extends pureRenderComponent<Props, State> {
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
        if (StandardisationSetup) {
            return (<StandardisationSetup
                        id='container_standardisationsetup'
                        key='container_standardisationsetup_key'
                        renderedOn={this.state.renderedOn}
                        selectedLanguage={this.props.selectedLanguage}
                        isOnline={this.props.isOnline} />);
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
            './standardisationsetup'
        ],
            function () {
                StandardisationSetup = require('./standardisationsetup');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = StandardisationSetupBaseContainer;