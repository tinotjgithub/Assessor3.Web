"use strict";
var enums = require('../enums');
var localeStore = require('../../../stores/locale/localestore');
var qigStore = require('../../../stores/qigselector/qigstore');
var qualityFeedbackHelper = require('../../../utility/qualityfeedback/qualityfeedbackhelper');
var loginStore = require('../../../stores/login/loginstore');
/**
 * Helper class for creating worklist tab
 */
var TabHelper = (function () {
    function TabHelper() {
    }
    /**
     * returns the tab header data.
     * @param worklistTabDetails - tab details
     * @param selectedTab - selected tab
     */
    TabHelper.getTabHeaderData = function (worklistTabDetails, selectedTab) {
        var tabHeader = [];
        var tabToBeSelectedBasedOnQualityFeedback = qualityFeedbackHelper.getResponseModeBasedOnQualityFeedback();
        var tabToBeSelected = tabToBeSelectedBasedOnQualityFeedback !== undefined ?
            tabToBeSelectedBasedOnQualityFeedback : selectedTab;
        /* set the corresponding response count on the tab */
        if (worklistTabDetails !== undefined && worklistTabDetails.length > 0) {
            worklistTabDetails.map(function (item) {
                switch (item.responseMode) {
                    case enums.ResponseMode.closed:
                        tabHeader.push({
                            index: enums.ResponseMode.closed,
                            class: 'arrow-tab resp-closed',
                            isSelected: selectedTab === enums.ResponseMode.closed,
                            isDisabled: qualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback(tabToBeSelectedBasedOnQualityFeedback, enums.ResponseMode.closed),
                            tabNavigation: 'responseTab_Closed',
                            headerCount: item.responseCount,
                            headerText: localeStore.instance.TranslateText('marking.worklist.submitted-closed-tab'),
                            id: 'Closed',
                            key: 'Closed'
                        });
                        break;
                    case enums.ResponseMode.pending:
                        var isGraceTabVisible = (qigStore.instance.selectedQIGForMarkerOperation.hasGracePeriod ||
                            item.responseCount > 0) && !loginStore.instance.isAdminRemarker;
                        if (isGraceTabVisible) {
                            tabHeader.push({
                                index: enums.ResponseMode.pending,
                                class: 'arrow-tab resp-grace',
                                isSelected: selectedTab === enums.ResponseMode.pending,
                                isDisabled: qualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback(tabToBeSelectedBasedOnQualityFeedback, enums.ResponseMode.pending),
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
                            isDisabled: qualityFeedbackHelper.isTabDisabledBasedOnQualityFeedback(tabToBeSelectedBasedOnQualityFeedback, enums.ResponseMode.open),
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
    };
    return TabHelper;
}());
module.exports = TabHelper;
//# sourceMappingURL=tabhelper.js.map