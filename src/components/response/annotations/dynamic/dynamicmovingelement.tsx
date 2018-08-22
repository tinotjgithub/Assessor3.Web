import React = require('react');
import ReactDom = require('react-dom');
import enums = require('../../../utility/enums');
import pureRenderComponent = require('../../../base/purerendercomponent');
import markingStore = require('../../../../stores/marking/markingstore');
import dynamicElementProperties = require('../../annotations/typings/dynamicelementproperties');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');

interface DynamicMovingElementProps {
    annotationOverlayId: string;
}


class DynamicMovingElement extends pureRenderComponent<DynamicMovingElementProps, any> {
    private currentElement: Element;

    /**
     * @constructor
     */
    constructor(props: DynamicMovingElementProps, state: any) {
        super(props, state);
        this.state = {
            visible: false,
            elementStyle: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                position: 'absolute',
                display: 'none'
            },
            elementClass: ''
        };
    }

    /**
     * This function gets invoked when the component is mounted
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.DYNAMIC_ANNOTATION_MOVE, this.onMove);
        this.currentElement = ReactDom.findDOMNode(this);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.DYNAMIC_ANNOTATION_MOVE, this.onMove);
    }

    /** This method sets the elements position and dimensions accrodingly 
     * @param elementProperties
     */
    private onMove = (elementProperties: dynamicElementProperties) => {
        if (elementProperties.visible) {
            if (this.props.annotationOverlayId === elementProperties.holderElement.id) {
                let stampName: string = enums.DynamicAnnotation[elementProperties.stamp];
                this.currentElement.innerHTML = elementProperties.innerHTML;
                this.setState({
                    visible: true,
                    elementStyle: {
                        left: elementProperties.clientRect.left + '%',
                        top: elementProperties.clientRect.top + '%',
                        width: elementProperties.clientRect.width + '%',
                        height: elementProperties.clientRect.height + '%',
                        position: 'absolute',
                        display: 'block',
                        color: colouredAnnotationsHelper.createAnnotationStyle(null, enums.DynamicAnnotation[stampName]).fill
                    },
                    elementClass: this.setClassName(elementProperties.stamp)
                });
            }
        } else {
            this.currentElement.innerHTML = '';
            this.setState({
                elementStyle: {
                    display: 'none'
                },
                elementClass: ''
            });
        }
    };

    /** This method sets the class names for the particular annotation
     * @param stamp
     */
    private setClassName = (stamp: number) => {
        let className = '';
        switch (stamp) {
            case enums.DynamicAnnotation.HorizontalLine:
                className += ' horizontal line';
                break;
            case enums.DynamicAnnotation.Ellipse:
                className += ' ellipse';
                break;
            case enums.DynamicAnnotation.HWavyLine:
                className += ' horizontal wavy line';
                break;
            case enums.DynamicAnnotation.VWavyLine:
                className += ' vertical wavy line';
                break;
        }

        return className;
    };

    /**
     * Render method
     */
    public render(): JSX.Element {

        return (<span className={'annotation-wrap dynamic hover' + this.state.elementClass}
            data-type='dynamicannotationmoving'
            style={this.state.elementStyle}>
        </span>);
    }
}

export = DynamicMovingElement;