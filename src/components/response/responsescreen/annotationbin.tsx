/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../base/purerendercomponent');
let classNames = require('classnames');
import toolbarStore = require('../../../stores/toolbar/toolbarstore');

interface State {
    isVisible?: boolean;
    renderedOn?: number;
}

/**
 * React component class for AnnotationBin.
 */
class AnnotationBin extends pureRenderComponent<any, State> {

    private locationStyle: React.CSSProperties = {};

    /**
     * @constructor
     */
    constructor(props: any, state: State) {
        super(props, state);

        this.state = {
            renderedOn: 0,
            isVisible: false
        };
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.PAN_STAMP_TO_DELETION_AREA, this.onStampPanToDeleteArea);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {

        return (
            <div className={classNames('annotation-bin', { 'open': this.state.isVisible }) }
                id='annotationbin'
                style={ this.locationStyle }>
                <span className='svg-icon'>
                    <svg viewBox='0 0 32 32' className='icon-bin'>
                        <use xlinkHref='#icon-bin'></use>
                    </svg>
                </span>
            </div>
        );
    }

    /**
     * Invoked on stamp pan to an area where deletion of the annotation dragged is possible
     */
    private onStampPanToDeleteArea = (canDelete: boolean, xPos: number, yPos: number): void => {
        this.locationStyle = {
            'top': yPos,
            'left': xPos
        };

        /* Defect Fix: #56738 Unwanted rerendering occured due to renderedOn state has been corrected
           we don't need to re-render bin icon if bin icon is not displaying for avoiding performance issues */
        if (!canDelete) {
            this.setState({
                isVisible: false
            });
        } else {
            this.setState({
                isVisible: true,
                renderedOn: Date.now()
            });
        }
    };
}

export = AnnotationBin;