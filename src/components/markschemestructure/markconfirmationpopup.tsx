/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import markingStore = require('../../stores/marking/markingstore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import localeStore = require('../../stores/locale/localestore');
import constants = require('../utility/constants');
import enums = require('../utility/enums');
import navigationHelper = require('../utility/navigation/navigationhelper');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
}

/**
 * State of a component
 */
interface State {
    renderedOn: number;
}

/**
 * MarkConfirmationPopup button.
 * @param {Props} props
 * @returns
 */
class MarkConfirmationPopup extends pureRenderComponent<Props, State> {
    private _className: string;
    private markConfirmationPopupClass: string;
    private mark: string;
    private navigationInProgress: boolean;
    private isEnterKeyPress: boolean;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.markConfirmationPopupClass = 'mark-feedback';
        this.navigationInProgress = false;
        this.navigateAfterConfirmation = this.navigateAfterConfirmation.bind(this);
        this.showMarkConfirmationPopupOnEnter = this.showMarkConfirmationPopupOnEnter.bind(this);
        if (markingStore.instance.currentQuestionItemInfo) {
            this.mark = (markingStore.instance.currentQuestionItemInfo.allocatedMarks) ?
                (markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark) : '';
            if (this.mark.trim() === constants.NOT_ATTEMPTED) {
                this.mark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
            }
        }
        this.state = {
            renderedOn: Date.now()
        };
    }

    /**
     * The render method
     */
    public render() {
        return (
            <div id='markfeedback' className={this.markConfirmationPopupClass}>
                <div className='feedback-bubble'>
                    <div className='mark-txt'>{this.mark}</div>
                    <div className='scaler'></div>
                </div>
            </div>
        );
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        markingStore.instance.addListener(markingStore.MarkingStore.MARK_SAVED, this.markChanged);
        markingStore.instance.addListener(markingStore.MarkingStore.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_EVENT,
            this.showMarkConfirmationPopupOnEnter);
        let markConfirmationPopupElement: HTMLElement = document.getElementById('markfeedback');
        if (markConfirmationPopupElement) {
            markConfirmationPopupElement.addEventListener('animationend', this.navigateAfterConfirmation );
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(markingStore.MarkingStore.MARK_SAVED, this.markChanged);
        markingStore.instance.removeListener(markingStore.MarkingStore.SHOW_MARK_CONFIRMATION_POPUP_ON_ENTER_EVENT,
            this.showMarkConfirmationPopupOnEnter);
        let markConfirmationPopupElement: HTMLElement = document.getElementById('markfeedback');
        if (markConfirmationPopupElement) {
            markConfirmationPopupElement.removeEventListener('animationend', this.navigateAfterConfirmation );
        }
    }

    /**
     * Method to perform navigation after on screen confirmation.
     */
    private navigateAfterConfirmation  = (event?: any): void => {
        if (event && (event.type === 'animationend') && (event.animationName === 'showAtTop')
            && event.target.id === 'markfeedback') {
            this.navigationInProgress = false;

            // removing animation from markconfirmationpopup class
            this.markConfirmationPopupClass = 'mark-feedback';

            // Checking whether we need to show mbq confirmation popup.
            navigationHelper.checkForMbqConfirmationPopup(enums.ResponseNavigation.markScheme);
            markingActionCreator.markSchemeScrollReset();

            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /**
     * Show mark confirmation popup with animation
     */
    private showPopup = () => {
        if (markingStore.instance.currentQuestionItemInfo) {
            this.mark = markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark;
            this.markConfirmationPopupClass = 'mark-feedback animate ' + 'digit-' + this.mark.length;
            if (this.mark.trim() === constants.NOT_ATTEMPTED) {
                this.mark = localeStore.instance.TranslateText('marking.response.mark-scheme-panel.no-response');
            }
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * This method will show the on screen mark confirmation popup.
     */
    private markChanged = () => {
        if (markingStore.instance.currentQuestionItemInfo) {
            this.mark = markingStore.instance.currentQuestionItemInfo.allocatedMarks.displayMark;

            if ((this.mark && (this.mark.trim() === constants.NOT_MARKED ||
                this.mark.trim() === constants.NO_MARK)) ||
                (!markingStore.instance.isEdited && !this.isEnterKeyPress)) {
                // Checking whether we need to show mbq confirmation popup.
                navigationHelper.checkForMbqConfirmationPopup(enums.ResponseNavigation.markScheme);
            } else {
                this.showMarkConfirmationPopup();
            }
        }

        // Reset enter key press flag to false if it is true.
        if (this.isEnterKeyPress) {
            this.isEnterKeyPress = false;
        }
    };

    /**
     * This method will trigger navigation after popup hide.
     */
    private markConfirmationPopupHide = () => {
        this.markConfirmationPopupClass = 'mark-feedback';
        this.mark = ''; // This is for fixing issues in IE - Defect 19111
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Method to show the popup when we click on enter key
     */
    private showMarkConfirmationPopupOnEnter = () => {
        this.isEnterKeyPress = true;
        this.showMarkConfirmationPopup();
    }

    /**
     * Method to show the popup when we click on enter key/save trigger
     */
    private showMarkConfirmationPopup() {
        if (this.navigationInProgress) {
            return;
        }
        this.navigationInProgress = true;
        this.markConfirmationPopupHide();

        // remove the animate class and then add it again to show the confirmation.
        let that = this;
        setTimeout(that.showPopup, 15);
    }
}

export = MarkConfirmationPopup;
