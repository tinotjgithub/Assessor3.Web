"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDom = require('react-dom');
var enums = require('../../../utility/enums');
var pureRenderComponent = require('../../../base/purerendercomponent');
var markingStore = require('../../../../stores/marking/markingstore');
var colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
var DynamicMovingElement = (function (_super) {
    __extends(DynamicMovingElement, _super);
    /**
     * @constructor
     */
    function DynamicMovingElement(props, state) {
        var _this = this;
        _super.call(this, props, state);
        /** This method sets the elements position and dimensions accrodingly
         * @param elementProperties
         */
        this.onMove = function (elementProperties) {
            if (elementProperties.visible) {
                if (_this.props.annotationOverlayId === elementProperties.holderElement.id) {
                    var stampName = enums.DynamicAnnotation[elementProperties.stamp];
                    _this.currentElement.innerHTML = elementProperties.innerHTML;
                    _this.setState({
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
                        elementClass: _this.setClassName(elementProperties.stamp)
                    });
                }
            }
            else {
                _this.currentElement.innerHTML = '';
                _this.setState({
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
        this.setClassName = function (stamp) {
            var className = '';
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
    DynamicMovingElement.prototype.componentDidMount = function () {
        markingStore.instance.addListener(markingStore.MarkingStore.DYNAMIC_ANNOTATION_MOVE, this.onMove);
        this.currentElement = ReactDom.findDOMNode(this);
    };
    /**
     * This function gets invoked when the component is about to be unmounted
     */
    DynamicMovingElement.prototype.componentWillUnmount = function () {
        markingStore.instance.removeListener(markingStore.MarkingStore.DYNAMIC_ANNOTATION_MOVE, this.onMove);
    };
    /**
     * Render method
     */
    DynamicMovingElement.prototype.render = function () {
        return (React.createElement("span", {className: 'annotation-wrap dynamic hover' + this.state.elementClass, "data-type": 'dynamicannotationmoving', style: this.state.elementStyle}));
    };
    return DynamicMovingElement;
}(pureRenderComponent));
module.exports = DynamicMovingElement;
//# sourceMappingURL=dynamicmovingelement.js.map