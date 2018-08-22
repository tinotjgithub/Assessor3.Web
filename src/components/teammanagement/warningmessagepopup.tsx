import React = require('react');
import enums = require('../utility/enums');
import pureRenderComponent = require('../base/purerendercomponent');
import GenericDialog = require('../utility/genericdialog');
import warningMessagePopupHelper = require('../../utility/teammanagement/helpers/warningmessagepopuphelper');
import warningMessageStore = require('../../stores/teammanagement/warningmessagestore');
import teamManagementActionCreator = require('../../actions/teammanagement/teammanagementactioncreator');
import qigStore = require('../../stores/qigselector/qigstore');

interface Props extends LocaleSelectionBase, PropsBase {
    buttonText: string;
}

interface State {
    doShowWarningPopup?: boolean;
}

/**
 * WarningMessagePopup contain message content and ok button.
 * @param props
 * @param state
 */
class WarningMessagePopup extends pureRenderComponent<Props, State> {

    //Warning message popup helper
    private _warningMessagePopupHelper: warningMessagePopupHelper;

    //Failure code
    private failureCode: enums.FailureCode;

    //Warnig message action
    private warningMessageAction: enums.WarningMessageAction;

    /**
     * Constructor WarningMessagePopup
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);

        // Set the default states
        this.state = {
            doShowWarningPopup: false
        };

        this._warningMessagePopupHelper = new warningMessagePopupHelper();
        this.onOkButtonClick = this.onOkButtonClick.bind(this);
    }

    /**
     * Render component
     * @returns
     */
    public render(): JSX.Element {
        let genericWarningPopup = this.state.doShowWarningPopup ? (
            <GenericDialog
                content={this._warningMessagePopupHelper.warningPopupContent}
                header={this._warningMessagePopupHelper.warningPopupTitle}
                displayPopup={this.state.doShowWarningPopup}
                okButtonText={this.props.buttonText }
                onOkClick={this.onOkButtonClick}
                id= {this.props.id}
                key={this.props.id}
                popupDialogType={enums.PopupDialogType.none} />
        ) : null;

        return (<div>
            {genericWarningPopup}
        </div>);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        this.addEventListeners();
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        this.removeEventListeners();
    }

    /**
     * Add all event listeners for warning message.
     */
    private addEventListeners() {
        warningMessageStore.instance.addListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.handleWarningMessageActions);
    }

    /**
     * Remove all event listeners for warning message.
     */
    private removeEventListeners() {
        warningMessageStore.instance.removeListener(
            warningMessageStore.WarningMessageStore.WARNING_MESSAGE_EVENT, this.handleWarningMessageActions);
    }

    /**
     * Method to handle the warning message actions.
     */
    private handleWarningMessageActions = (failureCode: enums.FailureCode,
        warningMessageAction: enums.WarningMessageAction, args?: any): void => {

        this.failureCode = failureCode;
        this.warningMessageAction = warningMessageAction;
        this._warningMessagePopupHelper.bindWarningMessagePopupContent(failureCode);

        this.setState({ doShowWarningPopup: true });
    }

    /**
     * Ok button click event to handle the failure action navigation.
     */
    private onOkButtonClick() {
        if (this.failureCode === enums.FailureCode.Withdrawn){
            if (qigStore.instance.selectedQIGForMarkerOperation) {
				teamManagementActionCreator.removeHistoryItem(
					qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
				);
			}
        }
        teamManagementActionCreator.warningMessageNavigation(
            this.failureCode, this.warningMessageAction);
        this.setState({ doShowWarningPopup: false });
    }
}

export = WarningMessagePopup;