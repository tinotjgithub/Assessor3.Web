import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import Header = require('../header');
import Footer = require('../footer');
import enums = require('../utility/enums');
import userInfoStore = require('../../stores/userinfo/userinfostore');
declare let config: any;

/* tslint:disable:no-empty-interfaces */
/**
 * Properties of TeamManagement component.
 */
interface Props extends LocaleSelectionBase {
    reportsDidMount: Function;
}

/* tslint:disable:no-empty-interfaces */
/**
 * State of a component
 */
interface State {
    isLogoutConfirmationPopupDisplaying?: boolean;
}

/**
 * React component for reports
 */
class ReportsWrapper extends pureRenderComponent<Props, State> {

    /**
     * Constructor for ReportsWrapper class
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isLogoutConfirmationPopupDisplaying: false
        };
        this.showLogoutConfirmation = this.showLogoutConfirmation.bind(this);
    }

    /**
     * Rendering class
     */
    public render(): JSX.Element {
        let header = (
            <Header selectedLanguage={this.props.selectedLanguage}
                containerPage={enums.PageContainers.Reports} />);

        let footer = (<Footer selectedLanguage={this.props.selectedLanguage}
            id={'footer_reports'} key={'footer_reports_key'}
            footerType={enums.FooterType.Reports}
            isLogoutConfirmationPopupDisplaying={this.state.isLogoutConfirmationPopupDisplaying}
            resetLogoutConfirmationSatus={this.resetLogoutConfirmationStatus} />);

        return (
            <div className='reports-wrapper'>
                {header}
                <div className='content-wrapper'>
                    <iframe id='reportsframe' className='report-frame' src={config.general.AI_URL} >
                    </iframe>
                </div>
                {footer}
            </div >);
    }

    /**
     * Subscribe to language change event
     */
    public componentDidMount() {
        userInfoStore.instance.addListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
        this.props.reportsDidMount();
    }

    /**
     * Unsubscribe language change event
     */
    public componentWillUnmount() {
        userInfoStore.instance.removeListener(userInfoStore.UserInfoStore.SHOW_LOGOUT_POPUP_EVENT, this.showLogoutConfirmation);
    }

    /**
     * this will shows the confirmation popup on logout based on the ask on logout value.
     */
    private showLogoutConfirmation = (): void => {
        this.setState({ isLogoutConfirmationPopupDisplaying: true });
    };

    /**
     * Reseting the confirmation dialog's state to make it invisible.
     */
    private resetLogoutConfirmationStatus = (): void => {
        this.setState({ isLogoutConfirmationPopupDisplaying: false });
    }
}
export = ReportsWrapper;