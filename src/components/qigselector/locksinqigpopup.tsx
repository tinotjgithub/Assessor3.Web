import React = require('react');
import Immutable = require('immutable');
import enums = require('../utility/enums');
import locksInQigDetailsList = require('../../stores/qigselector/typings/locksinqigdetailslist');
import qigStore = require('../../stores/qigselector/qigstore');
import qigSelectorActionCreator = require('../../actions/qigselector/qigselectoractioncreator');
import localeStore = require('../../stores/locale/localestore');
import stringFormatHelper = require('../../utility/stringformat/stringformathelper');

/**
 * Props for the Left Panel
 */
interface LocksInQigPopupProps extends LocaleSelectionBase, PropsBase {
    showLocksInQigPopUp?: boolean;
    fromLogout?: boolean;
    onCancelClickOfLocksInQigPopup?: Function;
    onLogoutClickOfLocksInQigPopup?: Function;
}

const locksInQigPopup = (props: LocksInQigPopupProps) => {

    /**
     * Handles the Click Event of locked qig
     */
    const openQigFromLockedList = (qigId: number) => {
        qigSelectorActionCreator.qigSelectedFromLockedList(qigId);
    };
    if (props.showLocksInQigPopUp) {
    return (
        <div
            className='popup medium popup-overlay fixed-hf examiner-locked open'
            id='examinerLocked' role='dialog'>
            <div className='popup-wrap'>
                <div className='popup-header'>
                    <h4 id='popup17Title'>{localeStore.instance.TranslateText(
                        'team-management.help-examiners.locks-in-qig-dialog.header')}</h4>
                </div>
                <div className='popup-content' id='popup16Desc'>
                    <p
                        className='login-nav-msg padding-bottom-10'
                        >{localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.body')}</p>
                    <p className='login-nav-action padding-bottom-10'
                        >{(props.fromLogout) ? localeStore.instance.TranslateText(
                            'team-management.help-examiners.locks-in-qig-dialog.body-logout') : localeStore.instance.TranslateText(
                            'team-management.help-examiners.locks-in-qig-dialog.select-a-qig') }</p>
                    {getLocksInQigList()}
                </div>
                {renderLogoutSection()}
            </div>
        </div>
    );
    } else {
        return null;
    }

    /**
     * Returns the list of qigs with no of locks
     */
    function getLocksInQigList() {
        let locksInQigDetailsList: Immutable.List<LocksInQigDetails> = Immutable.List<LocksInQigDetails>();
        locksInQigDetailsList = qigStore.instance.getLocksInQigList.locksInQigDetailsList;
        let toRender = locksInQigDetailsList.map((_locksInQigDetails: LocksInQigDetails , key: number) => {
            let formattedQigName = stringFormatHelper.formatAwardingBodyQIG(
                _locksInQigDetails.qigName,
                _locksInQigDetails.assessmentCode,
                _locksInQigDetails.sessionName,
                _locksInQigDetails.componentId,
                _locksInQigDetails.questionPaperName,
                _locksInQigDetails.assessmentName,
                _locksInQigDetails.componentName,
                stringFormatHelper.getOverviewQIGNameFormat());

            return (
                <a key={'lock-' + key} className='locked-link table-row' onClick={openQigFromLockedList.bind(
                    this,
                    _locksInQigDetails.qigId) }>
                    <span className='lock-msg table-cell bolder'>
                        <span className='lock-count'>{_locksInQigDetails.noOfLocks}</span>
                        <span className='lock-text'>
                           { (_locksInQigDetails.noOfLocks > 1) ? localeStore.instance.TranslateText(
                            'team-management.help-examiners.locks-in-qig-dialog.locks-plural') : localeStore.instance.TranslateText(
                            'team-management.help-examiners.locks-in-qig-dialog.lock-single') }</span>
                    </span>
                    <span className='lock-hyphen table-cell'>-</span>
                    <span className='lock-qig-name table-cell'>{formattedQigName}</span>
                </a>
            );
        });

        return (
            <div className='lock-list-wrapper'>
                <div id='lock-list-table' className='lock-list table'>
                    {toRender}
                </div>
            </div>
        );

    }


    /**
     * renders the logout button portion if needed
     */
    function renderLogoutSection() {
        if (props.fromLogout) {
            return (
                <div className='popup-footer text-right'>
             	<button id='lockslogoutbutton'className ='button rounded'
                            title={localeStore.instance.TranslateText('generic.user-menu.profile-section.logout-button')}
                            onClick={() => { props.onLogoutClickOfLocksInQigPopup(); }}>{localeStore.instance.TranslateText(
                            'generic.user-menu.profile-section.logout-button')}</button>
                  <button id='lockscancelbutton' className='button primary rounded'
                        title={localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.cancel-button') }
                        onClick={() => { props.onCancelClickOfLocksInQigPopup(); }}>
                        { localeStore.instance.TranslateText('team-management.help-examiners.locks-in-qig-dialog.cancel-button')}</button>
             </div>
            );
        } else {
            return null;
        }
    }
};

export = locksInQigPopup;