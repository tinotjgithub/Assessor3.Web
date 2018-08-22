/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');

/* tslint:disable:variable-name */
let ReportsWrapper;
/* tslint:enable:variable-name */

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    reportsDidMount: Function;
}
/* tslint:disable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn: number;
}

/**
 * React component class for reports base container
 */
class ReportsBaseContainer extends pureRenderComponent<Props, State> {
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
        if (ReportsWrapper) {
            return (<ReportsWrapper
                id='container_reports'
                key='container_reports_key'
                selectedLanguage={this.props.selectedLanguage}
                isOnline={this.props.isOnline}
                setOfflineContainer={this.props.setOfflineContainer}
                reportsDidMount={this.props.reportsDidMount} />);
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
            './reportswrapper'
        ],
            function () {
                ReportsWrapper = require('./reportswrapper');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = ReportsBaseContainer;