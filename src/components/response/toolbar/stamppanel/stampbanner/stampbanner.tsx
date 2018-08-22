/* tslint:disable:no-unused-variable */
import React = require('react');
import ReactDom = require('react-dom');
/* tslint:enable:no-unused-variable */
import bannerBase = require('../../../../utility/banner/bannerbase');
import localeStore = require('../../../../../stores/locale/localestore');
import enums = require('../../../../utility/enums');
import stampStore = require('../../../../../stores/stamp/stampstore');
let classNames = require('classnames');
import toolbarStore = require('../../../../../stores/toolbar/toolbarstore');
import messageStore = require('../../../../../stores/message/messagestore');
import exceptionStore = require('../../../../../stores/exception/exceptionstore');
import markingStore = require('../../../../../stores/marking/markingstore');
import responsestore = require('../../../../../stores/response/responsestore');
import eCourseworkHelper = require('../../../../utility/ecoursework/ecourseworkhelper');
import responseHelper = require('../../../../utility/responsehelper/responsehelper');

/**
 * Stamp banner component
 */
class StampBanner extends bannerBase {

    /* variable for holding stamp banner class*/
    private currentStampBannerClass: string;
    /* variable for holding visibility status of a variable*/
    private isStampBannerVisible: boolean = false;
    /* variable will set to true once we displayed the shrink expanded banner */
    private isShrinkExpandedBannerDisplayed: boolean = false;
    /* variable will set to true while we close the toolbar */
    private resetShowClass: boolean = false;
    private resetHideClass: boolean = false;
    private isInitialRender: boolean = true;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: any, state: any) {
        super(props, state);
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        stampStore.instance.addListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED,
            this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.addListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        messageStore.instance.addListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onResetHideClass);
        exceptionStore.instance.addListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.onResetHideClass);
        markingStore.instance.addListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.setStampBannerVisiblityOnQigChange);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount() {
        stampStore.instance.removeListener(stampStore.StampStore.STAMP_BANNER_VISIBILITY_MODE_CHANGED,
            this.onStampBannerVisibilityModeUpdated);
        toolbarStore.instance.removeListener(toolbarStore.ToolbarStore.STAMP_PANEL_MODE_CHANGED, this.onStampPanelModeChanged);
        messageStore.instance.removeListener(messageStore.MessageStore.MESSAGE_OPEN_EVENT, this.onResetHideClass);
        exceptionStore.instance.removeListener(exceptionStore.ExceptionStore.OPEN_EXCEPTION_WINDOW, this.onResetHideClass);
        markingStore.instance.removeListener(markingStore.MarkingStore.QIG_CHANGED_IN_WHOLE_RESPONSE_EVENT,
            this.setStampBannerVisiblityOnQigChange);
    }

    /**
     * Render method
     */
    public render(): JSX.Element {
        // if there are no stamps against current qig then there is no need to show stamp banner
        if (this.state.renderedOn === 0 ||
            stampStore.instance.stampsAgainstCurrentQig(responsestore.instance.isWholeResponse).count() === 0) {
            return null;
        }

        this.isStampBannerVisible = stampStore.instance.currentStampBannerType === this.props.bannerType;

        /* we don't need to add hide class to ShrinkExpandedBanner if it's not rendered yet, other wise it will flashes on the screen */
        if (this.isStampBannerVisible && this.props.bannerType === enums.BannerType.ShrinkExpandedBanner
            && !this.isShrinkExpandedBannerDisplayed) {
            this.isShrinkExpandedBannerDisplayed = true;
        }

        this.currentStampBannerClass = this.props.bannerType === enums.BannerType.CustomizeToolBarBanner ?
            'cutomise-toolbar-msg1' : 'cutomise-toolbar-msg triggered';
        let markingOverlayClass: string;
        if (this.props.bannerType === enums.BannerType.CustomizeToolBarBanner) {
            markingOverlayClass = 'fav-message-box ';
        }
        /* We need to remove 'show' and 'hide' classes to avoid annotation clarity banner flashing issue */
        let classToApply = classNames(
            'message-box text-left float-msg dark-msg left info-guide callout ',
            this.currentStampBannerClass,
            markingOverlayClass,
            { 'show': this.isStampBannerVisible === true && !this.resetShowClass },
            {
                'hide': (this.resetHideClass || this.isInitialRender) ? false :
                    (this.props.bannerType === enums.BannerType.ShrinkExpandedBanner ?
                        (this.isShrinkExpandedBannerDisplayed && this.isStampBannerVisible === false) : !this.isStampBannerVisible)
            }
        );

        // reseting hide class flag
        this.isInitialRender = false;

        return (
            <div className={classToApply}
                role={this.props.role}
                id={this.props.id}
                aria-hidden={this.props.isAriaHidden}>

                <h4 id='bannerHeader' className='bolder padding-bottom-10'>
                    {localeStore.instance.TranslateText(this.props.header)}
                </h4>
                <p id='bannerBody' className='message-body'>
                    {localeStore.instance.TranslateText(this.props.message)}
                </p>
                {this.getOverlayBannerBody()}
            </div>);
    }

    /**
     * On stamp banner visibility mode updated event, we are not using isBannerVisible variable here but provided for a generic approach.
     */
    private onStampBannerVisibilityModeUpdated = (stampBannerType: enums.BannerType, isBannerVisibile: boolean): void => {
        if (stampStore.instance.isFavouriteToolbarEmpty) {
            this.resetShowClass = false;
        }
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Re-renders the Stamp Banner, when the favorite toolbar is empty.
     */
    private setStampBannerVisiblityOnQigChange = () => {
		if (stampStore.instance.isFavouriteToolbarEmpty &&
			responsestore.instance.isWholeResponse === true) {
            this.setState({
                renderedOn: Date.now()
            });
        }
    }

    /* We need to remove 'show' and 'hide' classes to avoid annotation clarity banner flashing issue */
    private onStampPanelModeChanged = () => {
        if (!toolbarStore.instance.isStampPanelExpanded) {
            this.resetShowClass = true;
            this.resetHideClass = true;
            this.setState({
                renderedOn: Date.now()
            });
        }
    };

    /* We need to remove 'hide' class to avoid annotation clarity banner flashing issue */
    private onResetHideClass = () => {
        this.resetHideClass = true;
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Retruns text for Overlay tools.
     */
    private getOverlayBannerBody = (): JSX.Element => {
        if (this.props.bannerType === enums.BannerType.CustomizeToolBarBanner) {
            return ((eCourseworkHelper && eCourseworkHelper.isECourseworkComponent) || responseHelper.isEbookMarking) ? null : <p><br />
                {localeStore.instance.TranslateText('marking.response.annotation-toolbar-helper.body-before-adding-stamp-with-overlays')}
            </p>;
        }
    }

}

export = StampBanner;