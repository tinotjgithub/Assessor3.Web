/* tslint:disable:no-unused-variable */
import React = require('react');
import reactDom = require('react-dom');
import pureRenderComponent = require('../base/purerendercomponent');
import enums = require('../utility/enums');

/* tslint:disable:variable-name */
let EcourseWorkContainer;
let NonDigitalContainer;
let HtmlContainer;
/* tslint:enable:variable-name */

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    containerPageType: enums.PageContainersType;
}
/* tslint:disable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn: number;
}

/**
 * React component class for Response base container
 */
class ResponseBaseContainer extends pureRenderComponent<Props, State> {
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
        let renderContainer;
        switch (this.props.containerPageType) {
            case enums.PageContainersType.HtmlView:
                if (HtmlContainer) {
                    renderContainer = (<HtmlContainer
                        id='container_response'
                        key='container_response_key'
                        selectedLanguage={this.props.selectedLanguage}
                        isOnline={this.props.selectedLanguage}
                        setOfflineContainer={this.props.setOfflineContainer} />);

                } else {
                    renderContainer = null;
                }
                break;
            case enums.PageContainersType.ECourseWork:
                if (EcourseWorkContainer) {
                    renderContainer = (<EcourseWorkContainer
                        id='container_response'
                        key='container_response_key'
                        selectedLanguage={this.props.selectedLanguage}
                        isOnline={this.props.selectedLanguage}
                        setOfflineContainer={this.props.setOfflineContainer} />);
                } else {
                    renderContainer = null;
                }
                break;
            default:
                if (EcourseWorkContainer) {
                    renderContainer = (<NonDigitalContainer
                        id='container_response'
                        key='container_response_key'
                        selectedLanguage={this.props.selectedLanguage}
                        isOnline={this.props.isOnline}
                        setOfflineContainer={this.props.setOfflineContainer} />);
                } else {
                    renderContainer = null;
                }
                break;
        }
        return renderContainer;
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
            './nondigital/nondigitalcontainer',
            './digital/ecoursework/ecourseworkcontainer',
            './digital/htmlcontainer'
        ],
            function () {
                NonDigitalContainer = require('./nondigital/nondigitalcontainer');
                EcourseWorkContainer = require('./digital/ecoursework/ecourseworkcontainer');
                HtmlContainer = require('./digital/htmlcontainer');
                this.setState({ renderedOn: Date.now() });
            }.bind(this));
    }
}

export = ResponseBaseContainer;