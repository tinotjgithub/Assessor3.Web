/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');

/* tslint:disable:variable-name */
let QigSelectorContainer;
/* tslint:enable:variable-name */

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    isNavigatedAfterFromLogin: boolean;
}
/* tslint:disable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn: number;
}

/**
 * React component class for Login
 */
class QigSelectorBaseContainer extends pureRenderComponent<Props, State> {
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

        if (QigSelectorContainer) {
            if (this.props.isNavigatedAfterFromLogin) {
                return (<QigSelectorContainer
                    id='container_qigselector'
                    key='container_qigselector_key'
                    isNavigatedAfterFromLogin={this.props.isNavigatedAfterFromLogin}
                    selectedLanguage={this.props.selectedLanguage}
                    isOnline={this.props.isOnline}
                    setOfflineContainer={this.props.setOfflineContainer} />);
            } else {
                return (<QigSelectorContainer
							id='container_qigselector'
							key='container_qigselector_key'
                            selectedLanguage={this.props.selectedLanguage}
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
            './qigselectorcontainer'],
            function () {
                QigSelectorContainer = require('./qigselectorcontainer');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = QigSelectorBaseContainer;