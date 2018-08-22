import enums = require('../enums');
import localeStore = require('../../../stores/locale/localestore');
import qigStore = require('../../../stores/qigselector/qigstore');
import qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
import loginStore = require('../../../stores/login/loginstore');

/**
 * Helper class for creating worklist tab
 */
class TabHelper {
    /**
     * returns the tab header data.
     * @param worklistTabDetails - tab details
     * @param selectedTab - selected tab
     */
    public static getTabHeaderData(
                                    worklistTabDetails: Array<WorklistTabDetails>,
                                    selectedTab: enums.ResponseMode): Array<TabHeaderData> {
        let tabHeader: Array<TabHeaderData> = [];
        let tabToBeSelectedBasedOnQualityFeedback: enums.ResponseMode = qualityFeedbackHelper.getResponseModeBasedOnQualityFeedback();
        let tabToBeSelected: enums.ResponseMode = tabToBeSelectedBasedOnQualityFeedback !== undefined ?
            tabToBeSelectedBasedOnQualityFeedback : selectedTab;

        /* set the corresponding response count on the tab */
        if (worklistTabDetails !== undefined && worklistTabDetails.length > 0) {
            worklistTabDetails.map((item: WorklistTabDetails) => {
                switch (item.responseMode) {
                        case enums.ResponseMode.closed:
                            tabHeader.push({
                                index: enums.ResponseMode.closed,
                                class: 'arrow-tab resp-closed',
                                isSelected: selectedTab === enums.ResponseMode.closed,
                                isDisabled:
                                qualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback(tabToBeSelectedBasedOnQualityFeedback,
                                    enums.ResponseMode.closed),
                                tabNavigation: 'responseTab_Closed',
                                headerCount: item.responseCount,
                                headerText: localeStore.instance.TranslateText('marking.worklist.submitted-closed-tab'),
                                id: 'Closed',
                                key: 'Closed'
                            });
                        break;
                        case enums.ResponseMode.pending:
                        let isGraceTabVisible = (qigStore.instance.selectedQIGForMarkerOperation.hasGracePeriod ||
                            item.responseCount > 0) && !loginStore.instance.isAdminRemarker;
                            if ( isGraceTabVisible ) {
                                tabHeader.push({
                                    index: enums.ResponseMode.pending,
                                    class: 'arrow-tab resp-grace',
                                    isSelected: selectedTab === enums.ResponseMode.pending,
                                    isDisabled:
                                    qualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback(tabToBeSelectedBasedOnQualityFeedback,
                                        enums.ResponseMode.pending),
                                    tabNavigation: 'responseTab_Pending',
                                    headerCount: item.responseCount,
                                    headerText: localeStore.instance.TranslateText('marking.worklist.submitted-editable-tab'),
                                    id: 'Pending',
                                    key: 'Pending'
                                });
                            }
                        break;
                        case enums.ResponseMode.open:
                            tabHeader.push({
                                index: enums.ResponseMode.open,
                                class: 'arrow-tab resp-open',
                                isSelected: selectedTab === enums.ResponseMode.open,
                                isDisabled:
                                qualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback(tabToBeSelectedBasedOnQualityFeedback,
                                    enums.ResponseMode.open),
                                tabNavigation: 'responseTab_Open',
                                headerCount: item.responseCount,
                                headerText: localeStore.instance.TranslateText('marking.worklist.open-for-marking-tab'),
                                id: 'Open',
                                key: 'Open'
                            });
                        break;
                    default:
                        break;
                }
            });
        }

        return tabHeader;
    }
}

export = TabHelper;

