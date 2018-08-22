/*
React component for Set As Review Button
*/

/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import enums = require('../utility/enums');
import genericRadioButtonItems = require('../utility/genericradiobuttonitems');
import messageTranslationHelper = require('../utility/message/messagetranslationhelper');
import GenericPopupWithRadioButton = require('../utility/genericpopupwithradiobuttons');
import GenericButton = require('../utility/genericbutton');
import sortHelper = require('../../utility/sorting/sorthelper');
import comparerList = require('../../utility/sorting/sortbase/comparerlist');
import domManager = require('../../utility/generic/domhelper');
import responseStore = require('../../stores/response/responsestore');
import ccValues = require('../../utility/configurablecharacteristic/configurablecharacteristicsvalues');
import worklistStore = require('../../stores/worklist/workliststore');
let classNames = require('classnames');

/**
 * Properties of a component
 */
interface Props extends PropsBase, LocaleSelectionBase {
    isDisabled: boolean;
    setAsReviewedComment: enums.SetAsReviewedComment;
    onReviewButtonClick?: Function;
}

interface State {
    renderedOn?: number;
    doHide?: boolean;
    doDisable?: boolean;
}

class SetAsReviewedButton extends pureRenderComponent<Props, State> {

    private items: Array<genericRadioButtonItems>;
    private _onClick: EventListenerObject = null;
    private selectedReviewComment: enums.SetAsReviewedComment = enums.SetAsReviewedComment.None;

    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);
        this.selectedReviewComment = this.props.setAsReviewedComment;
        this.state = {
            renderedOn: 0,
            doHide: true,
            doDisable: this.props.isDisabled
        };
        this._onClick = this.handleOnClick.bind(this);
    }

    /**
     * To get the button name along with comment selected for the set as reviewed button
     */
    private getSetAsReviewedButtonContentWithSelectedComment = () => {
        let childElement: Array<JSX.Element> = new Array<JSX.Element>();
        let content = this.state.doDisable ?
            localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.reviewed-button') :
            localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.set-as-reviewed-button');

        childElement.push(< span id='supervisor- review - button - text'
            className='padding-left-5 padding-right-10' > {content}</span >);
        // The comment id text has to be added only when there is a selected text
        if (this.selectedReviewComment !== enums.SetAsReviewedComment.None) {
            childElement.push(<span id='supervisor-review-comment-text' className='supervisor-selcted small-text'>{localeStore.instance.
                TranslateText('team-management.response.review-comments.' + this.selectedReviewComment)}</span>);
        }

        return childElement;
    }
    /**
     * Render method
     */
    public render() {
        let buttonTooltip = this.props.isDisabled ?
                localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.reviewed-button-tooltip') :
           localeStore.instance.TranslateText('team-management.response.mark-scheme-panel.set-as-reviewed-button-tooltip');

        return (
            <div className={classNames('setreview-btn-holder dropdown-wrap up white supervisor-remark-comment',
                { 'open': !this.state.doHide })} >
                <GenericButton id={this.props.id + 'ID'}
                    disabled={this.state.doDisable}
                    key={this.props.id + 'Key'}
                    title={buttonTooltip}
                    className={classNames('button rounded primary set-reviewed', { 'disabled': this.state.doDisable })}
                    onClick={() => { this.onButtonClick(); }}
                    childrens={this.getSetAsReviewedButtonContentWithSelectedComment()}
                    buttonType={enums.ButtonType.SetAsReviewed} />
                <div className='menu' id='setasreviewed-wrapper'>
                    <div className='review-options'>
                        <GenericPopupWithRadioButton
                            className='supervisor-select-options'
                            id='popup-setasreviewed'
                            items={this.items}
                            selectedLanguage={this.props.selectedLanguage}
                            onCheckedChange={this.onCheckedChange}
                            renderedOn={this.state.renderedOn}
                            key='key-popup-supervisor-sampling' />
                    </div>
                </div>

            </div>
        );
    }




    /**
     * Component did mount
     */
   public componentDidMount() {
       this.populateData();
       window.addEventListener('click', this._onClick);
       responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_OPENED, this.onResponseChanged);
       responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
       worklistStore.instance.addListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.onResponseReviewed);
   }

   /**
    * Component will unmount
    */
   public componentWillUnmount() {
       window.removeEventListener('click', this._onClick);
       responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_OPENED, this.onResponseChanged);
       responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.onResponseChanged);
       worklistStore.instance.removeListener(worklistStore.WorkListStore.RESPONSE_REVIEWED, this.onResponseReviewed);
   }

   /**
    * adding items to radio buttons
    */
   private populateData() {
       this.items = new Array<genericRadioButtonItems>();
       let obj: genericRadioButtonItems;
       for (let item in enums.SetAsReviewedComment) {
           if (parseInt(item) > 0) {
               let commentItem = parseInt(item);
               obj = new genericRadioButtonItems();
               obj.isChecked = false;
               obj.name = localeStore.instance.TranslateText('team-management.response.review-comments.' + commentItem);
               obj.id = commentItem;
               switch (commentItem) {
                   case enums.SetAsReviewedComment.AllCorrect:
                       obj.sequenceNo = 1;
                       break;
                   case enums.SetAsReviewedComment.Good:
                       obj.sequenceNo = 2;
                       break;
                   case enums.SetAsReviewedComment.AcceptableNoFeedback:
                       obj.sequenceNo = 3;
                       break;
                   case enums.SetAsReviewedComment.AcceptableGiveFeedback:
                       obj.sequenceNo = 4;
                       break;
                   case enums.SetAsReviewedComment.CausingConcernGiveFeedback:
                       obj.sequenceNo = 5;
                       break;
                   case enums.SetAsReviewedComment.UnAcceptableConsultPE:
                       obj.sequenceNo = 6;
                       break;
               }
               this.items.push(obj);
           }
       }
       let _sampleReviewCommentComparer = 'SampleReviewCommentComparer';
       sortHelper.sort(this.items, comparerList[_sampleReviewCommentComparer]);
   }

   /**
    * On Set as reviewed button is clicked
    */
   private onButtonClick = () => {
       if (ccValues.supervisorReviewComments) {
           this.setState({
               doHide: !this.state.doHide
           });
       } else {
           this.props.onReviewButtonClick(enums.SetAsReviewedComment.None);
       }
   }


    /**
     * Handle click events on the window
     * @param {any} source - The source element
     */
    private handleOnClick = (source: any): any => {
       if (source.target !== undefined &&
           domManager.searchParentNode(source.target, function (el: any) {
           return el.id === 'setasreviewed-wrapper' || el.id === 'setAsReviewedButtonID';
           }) == null) {
           if (this.state.doHide !== undefined && this.state.doHide === false) {
               this.setState({ doHide: true });
           }
       }
   };

    /**
     * On clicking items in radio button popup
     * @param item
     */
    private onCheckedChange = (item: genericRadioButtonItems) => {
        if (item.id !== this.selectedReviewComment && !this.state.doHide) {
            // updating the checked property
                this.items.map((i: genericRadioButtonItems) => {
                    i.isChecked = i.id === item.id ? true : false;
                    if (i.isChecked === true) {
                        this.props.onReviewButtonClick(i.id);
                        i.isChecked = false;
                    }
            });
                // disabling the button. After selecting a comment the button will get disabled
                this.setState({
                    renderedOn: Date.now(),
                    doHide: true
                });
        }
    }

    /**
     * When response is changed reset the variables
     */
    private onResponseChanged = () => {
        this.selectedReviewComment = this.props.setAsReviewedComment;
        this.setState({
            renderedOn: Date.now(),
            doHide: true,
            doDisable: this.props.isDisabled
        });
    }

    /**
     * When response is reviewed
     */
    private onResponseReviewed = (reviewResponseDetails: ReviewedResponseDetails) => {
        this.selectedReviewComment = reviewResponseDetails.setAsReviewedCommentId;
        // disabling the button. After selecting a comment the button will get disabled
        this.setState({
            renderedOn: Date.now(),
            doDisable: true
        });
    }
}

export = SetAsReviewedButton;