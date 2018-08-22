/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');

/* tslint:disable:variable-name */
let AdminSupport;
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
 * React component class for AdminSupportContainer
 */
class AdminSupportContainer extends pureRenderComponent<Props, State> {
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
        if (AdminSupport) {
            return (
                <AdminSupport
                    id={this.props.id}
                    key={this.props.key}
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
            './adminsupport'],
            function () {
                AdminSupport = require('./adminsupport');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = AdminSupportContainer;