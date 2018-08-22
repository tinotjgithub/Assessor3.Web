/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import navigationHelper = require('../utility/navigation/navigationhelper');
import enums = require('../utility/enums');
import popupHelper = require('../utility/popup/popuphelper');
import markingStore = require('../../stores/marking/markingstore');
import markingHelper = require('../../utility/markscheme/markinghelper');
import responseStore = require('../../stores/response/responsestore');
import markingActionCreator = require('../../actions/marking/markingactioncreator');


/**
 * Properties of awarding notification indicator component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    hasAwardingJudgement: boolean;
}

/**
 * Represents the Awarding notification indicator component
 */
class AwardingIndicator extends pureRenderComponent<Props, any>{

    /**
     * @constructor
     */
    constructor(properties: Props, state: any) {
        super(properties, state);
    }

    /**
     * Render method
     */
    public render() {
        return (
            <li role='menuitem'>
                <a id={this.props.id}
                    href='javascript:void(0)'
                    title={localeStore.instance.TranslateText('awarding.generic.awarding')}
                    onClick={ this.onAwardingIndicatorClick}>
                    <span className='relative'>
                        <span id='awardingNotification'
                            className={this.props.hasAwardingJudgement ? 'notification-dot notify' : 'notification-dot'}>
                            <span className='sprite-icon awarding-star-icon'></span>
                        </span>
                        <span className='nav-text'>{localeStore.instance.TranslateText('awarding.generic.awarding-text')}</span>
                    </span>
                </a>
            </li>
        );
    }

    /**
     * on Awarding Indicator Click method
     */
    private onAwardingIndicatorClick = () => {
        let responseNavigationFailureReasons: Array<enums.ResponseNavigateFailureReason> =
            markingHelper.canNavigateAwayFromCurrentResponse();
        if (responseNavigationFailureReasons.length > 0) {
            popupHelper.navigateAwayFromResponse(responseNavigationFailureReasons, enums.SaveAndNavigate.toAwarding);
        } else {
            if (markingStore.instance.isMarkingInProgress ||
                responseStore.instance.selectedResponseViewMode === enums.ResponseViewMode.fullResponseView) {
                /* Save the selected mark scheme mark to the mark collection on response move */
                markingActionCreator.saveAndNavigate(enums.SaveAndNavigate.toAwarding);
            } else {
                navigationHelper.loadAwardingPage(false);
            }
        }
    }
}

export = AwardingIndicator;