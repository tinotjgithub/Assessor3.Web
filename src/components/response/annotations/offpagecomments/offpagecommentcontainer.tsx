import React = require('react');
import Immutable = require('immutable');
import pureRenderComponent = require('../../../base/purerendercomponent');
import PanelResizer = require('../../../utility/panelresizer/panelresizer');
import OffPageComments = require('./offpagecomments');
import OffPageCommentListHolder = require('./offpagecommentlistholder');
import colouredAnnotationsHelper = require('../../../../utility/stamppanel/colouredannotationshelper');
import enums = require('../../../utility/enums');
import responseStore = require('../../../../stores/response/responsestore');
import userOptionsHelper = require('../../../../utility/useroption/useroptionshelper');
import userOptionKeys = require('../../../../utility/useroption/useroptionkeys');
import qigStore = require('../../../../stores/qigselector/qigstore');
import markingStore = require('../../../../stores/marking/markingstore');
let classNames = require('classnames');

interface Props extends PropsBase, LocaleSelectionBase {
    isVisible: boolean;
}

interface State {
    renderedOn?: number;
    height?: number;
}

class OffPageCommentContainer extends pureRenderComponent<Props, State> {

    private containerHeight: number;
    /** variable to hold annotation color */
    private annotationColor: string;

    private panActionType: enums.PanActionType;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default state
        this.state = {
            renderedOn: 0
        };

        this.renderOffpageComments = this.renderOffpageComments.bind(this);
        this.getContainerClassName = this.getContainerClassName.bind(this);
        this.setPanelStyle = this.setPanelStyle.bind(this);
        this.onPanelResize = this.onPanelResize.bind(this);
        this.getAnnotationColor = this.getAnnotationColor.bind(this);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        return (
            <div className={this.getContainerClassName()}
                id='offpage-comment-container'
                style={this.setPanelStyle()}>
                <PanelResizer
                    id='panel-resizer'
                    key='panel-resizer'
                    resizerType={enums.ResizePanelType.OffPageComment}>
                </PanelResizer>
                <div className={'offpage-comment-wrapper'}>
                    {this.renderOffpageComments()}
                    {this.renderOffPageCommentListHolder()}
                </div>
            </div>
        );
    }

    /*
     * get container classname
     */
    private getContainerClassName = () => {
        let offPageCommentContainerClass: string = 'offpage-comment-container ';
        if (!this.props.isVisible) {
            offPageCommentContainerClass += 'hide ';
        } else if (this.panActionType === enums.PanActionType.Start) {
            offPageCommentContainerClass += 'resizing';
        }
        return offPageCommentContainerClass;
    }

    /*
     * set panel style
     */
    private setPanelStyle = () => {
        let offpageCommentHeightInUserOption: string;
        if (qigStore.instance.getSelectedQIGForTheLoggedInUser) {
            offpageCommentHeightInUserOption = userOptionsHelper.getUserOptionByName(
                userOptionKeys.OFFPAGE_COMMENT_PANEL_HEIGHT, qigStore.instance.getSelectedQIGForTheLoggedInUser.examinerRoleId);
        }
        let panelStyle: React.CSSProperties = {};
        if (this.containerHeight || offpageCommentHeightInUserOption) {
            panelStyle = {
                height: this.containerHeight ? this.containerHeight + 'px' :
                    offpageCommentHeightInUserOption ? offpageCommentHeightInUserOption + 'px' : ''
            };
        }
        return panelStyle;
    }

    /**
     * componentDidMount
     * @memberof OffPageCommentContainer
     */
    public componentDidMount() {
        responseStore.instance.addListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.onPanelResize);
    }

    /**
     * ComponentWillUnMount
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.UPDATE_OFFPAGE_COMMENT_HEIGHT_EVENT, this.onPanelResize);
    }

    /**
     * Render OffPageComments.
     * @private
     * @returns 
     * @memberof OffPageCommentsContainer
     */
    private renderOffpageComments() {
        return (<OffPageComments id={'offpage-comment-editor-holder'}
            key={'offpage-comment-editor-holder'}
            annotationColor={this.getAnnotationColor()}
            selectedLanguage={this.props.selectedLanguage}/>);
    }

	/**
	 * render offpage comment list holder
	 */
    private renderOffPageCommentListHolder() {
        return (<OffPageCommentListHolder id={'comment-list-holder'}
            key={'comment-list-holder'}
            selectedLanguage={this.props.selectedLanguage} />);
    }

    /**
     * Called once panel is resized
     * param - height
     * param - pan action type
     */
    private onPanelResize = (height: number, panActionType: enums.PanActionType): void => {
        if (height && panActionType === enums.PanActionType.Move) {
            this.containerHeight = height;
            this.setState({ height: height });
        } else {
            // set current pan action to decide whether need to add resize class to the offpagecomment ornot.
            this.panActionType = panActionType;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

	/**
	 * set border color for offpage comment
	 */
    private getAnnotationColor = () => {
        let selectedMarkgroupid: number = markingStore.instance.currentMarkGroupId;
        let allMarksAndAnnotation = markingStore.instance.allMarksAndAnnotationAgainstResponse(selectedMarkgroupid);
        if (markingStore.instance.currentResponseMode === enums.ResponseMode.closed &&
            allMarksAndAnnotation.length > 0 &&
            allMarksAndAnnotation[0].annotations.length > 0) {
            let annotations = allMarksAndAnnotation[0].annotations;
            this.annotationColor = 'rgb(' + annotations[0].red + ',' + annotations[0].green + ',' + annotations[0].blue + ')';
        } else {
            this.annotationColor = colouredAnnotationsHelper.createAnnotationStyle(null,
                enums.DynamicAnnotation.OffPageComment).fill;
        }
        return this.annotationColor;
    };

}
export = OffPageCommentContainer;