import React = require('react');
import enums = require('../utility/enums');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import markingHelper = require('../../utility/markscheme/markinghelper');
import markingActionCreator = require('../../actions/marking/markingactioncreator');
import userInfoActionCreator = require('../../actions/userinfo/userinfoactioncreator');
import worklistStore = require('../../stores/worklist/workliststore');
import messagingActionCreator = require('../../actions/messaging/messagingactioncreator');
import messageStore = require('../../stores/message/messagestore');
import responseStore = require('../../stores/response/responsestore');
import exceptionStore = require('../../stores/exception/exceptionstore');
import exceptionActionCreator = require('../../actions/exception/exceptionactioncreator');
import applicationActionCreator = require('../../actions/applicationoffline/applicationactioncreator');
import popupDisplayActionCreator = require('../../actions/popupdisplay/popupdisplayactioncreator');
import navigationHelper = require('../utility/navigation/navigationhelper');
import qigStore = require('./../../stores/qigselector/qigstore');
import LocksInQigPopup = require('./../qigselector/locksinqigpopup');
import qigActionCreator = require('./../../actions/qigselector/qigselectoractioncreator');

/**
 * Properties of a component
 */
/* tslint:disable:no-empty-interfaces */
interface Props extends LocaleSelectionBase {
}
/* tslint:enable:no-empty-interfaces */

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    loggedInUsername?: string;
    isLogoutConfirmationIsDisplaying?: boolean;
}

class Logout extends pureRenderComponent<Props, State> {

    /**
     * Constructor Logout
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isLogoutConfirmationIsDisplaying: false
        };
    }

    /**
     * Render component
     * @returns
     */
    public render() {
        return (
                <button onClick={navigationHelper.showLogoutConfirmation.bind(this) }
                    className='primary rounded logout-btn'
                    id= 'logout-button'>
                    {localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button') }
                </button>
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        messageStore.instance.addListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        messageStore.instance.removeListener(messageStore.MessageStore.POPUP_DISPLAY_EVENT, this.onPopUpDisplayEvent);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.EXCEPTION_DISCARD_POPUP_DISPLAY_EVENT,
             this.onPopUpDisplayEvent);
    }

    /**
     * if discard popup is displaying.
     */
    private onPopUpDisplayEvent = (popUpType: enums.PopUpType, popUpActionType: enums.PopUpActionType): void => {
        if ((popUpType === enums.PopUpType.DiscardMessageNavigateAway || popUpType === enums.PopUpType.DiscardExceptionNavigateAway)
            && popUpActionType === enums.PopUpActionType.Close) {
            qigActionCreator.getLocksInQigs(true);
        }
    };
}

export = Logout;