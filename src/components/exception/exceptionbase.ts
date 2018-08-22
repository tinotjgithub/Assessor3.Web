import pureRenderComponent = require('../base/purerendercomponent');
import ReactDom = require('react-dom');
import enums = require('../utility/enums');
import localeStore = require('../../stores/locale/localestore');
import popupHelper = require('../utility/popup/popuphelper');
import popUpDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import exceptionStore = require('../../stores/exception/exceptionstore');
import exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import keyDownHelper = require('../../utility/generic/keydownhelper');

class ExceptionBase extends pureRenderComponent<any, any> {
    /** refs */
    public refs: {
        [key: string]: (Element);
        commentTextBox: (HTMLInputElement);
    };

    protected navigateTo: enums.SaveAndNavigate = enums.SaveAndNavigate.none;
    protected _questionName: string = '';
	protected _questionId: number = undefined;
	protected _markSchemeGroup: number = undefined;

    /**
     * Constructor ExceptionBase
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
    }



    /**
     * Method fired when the exception panel is minimized.
     */
    protected onMinimize = () => {
        keyDownHelper.instance.Activate(enums.MarkEntryDeactivator.Exception);
        exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Minimize);
    };

    /**
     * Method fired when the exception panel is maximized.
     */
    protected onMaximize = () => {
        keyDownHelper.instance.DeActivate(enums.MarkEntryDeactivator.Exception);
        if (this.props.isNewException && this.refs.commentTextBox !== undefined) {
            this.refs.commentTextBox.focus();
        }
        exceptionActionCreator.exceptionWindowAction(enums.ExceptionViewAction.Maximize);
    };

    /**
     * Reset message panel and close
     */
    protected resetAndCloseExceptionPanel = (): void => {
        this.props.closeExceptionPanel();
    };

    /**
     * Method fired when discard message is confirmed.
     */
    protected onDiscardExceptionConfirmed = () => {
        // Close the Message Panel.
        this.resetAndCloseExceptionPanel();
        // on message close navigate away from response scenario
        if (this.navigateTo !== enums.SaveAndNavigate.none && this.navigateTo !== enums.SaveAndNavigate.exceptionWithInResponse) {
            // if navigate away from Resposne then close the response and move to worklist.
            popupHelper.navigateAway(this.navigateTo);
            this.navigateTo = enums.SaveAndNavigate.none;
        }

        if (exceptionStore.instance.navigateFrom === enums.SaveAndNavigate.submit) {
            markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.submit);
        }
    };

    /**
     * Method fired when discard exception is cancelled.
     */
    protected onDiscardExceptionCancelled = () => {
        if (this.props.isExceptionPanelEdited) {
            this.props.validateException(null, false);
        }
        // reset navigate away from response
        this.navigateTo = enums.SaveAndNavigate.none;
    };

}

export = ExceptionBase;