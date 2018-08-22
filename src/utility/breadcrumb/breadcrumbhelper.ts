import React = require('react');
import enums = require('../../components/utility/enums');
import navigationStore = require('../../stores/navigation/navigationstore');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import qigStore = require('../../stores/qigselector/qigstore');
import BreadCrumbItem = require('../../components/breadcrumb/breadcrumbitem');
import breadCrumbItemInfo = require('./breadcrumbiteminfo');
import localeStore = require('../../stores/locale/localestore');
import examinerStore = require('../../stores/markerinformation/examinerstore');
import teamManagementStore = require('../../stores/teammanagement/teammanagementstore');
import worklistStore = require('../../stores/worklist/workliststore');
import stringFormatHelper = require('../stringformat/stringformathelper');
import standardisationSetupStore = require('../../stores/standardisationsetup/standardisationsetupstore');
import responseStore = require('../../stores/response/responsestore');
import awardingStore = require('../../stores/awarding/awardingstore');

/**
 * BreadCrumb helper
 */
class BreadCrumbHelper {

    /**
     * This method will return BreadCrumb trail object
     */
    public static getBreadCrumbTrail(): Array<JSX.Element> {

        let _breadCrumbItem: breadCrumbItemInfo = navigationStore.instance.breadCrumbItem;
        let _breadCrumbElements: Array<JSX.Element> = new Array<JSX.Element>();

        switch (_breadCrumbItem.container) {
            case enums.PageContainers.Login:
            case enums.PageContainers.QigSelector:
            case enums.PageContainers.AdminSupport:
                this.getbreadCrumbForQigSelector(_breadCrumbElements, _breadCrumbItem.container);
                break;
            case enums.PageContainers.WorkList:
                if (qigStore.instance.selectedQIGForMarkerOperation) {
                    this.getbreadCrumbForWorkList(_breadCrumbElements);
                } else {
                    this.getbreadCrumbForQigSelector(_breadCrumbElements, _breadCrumbItem.container);
                }
                break;
            case enums.PageContainers.Response:
                if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Awarding) {
                    this.getbreadCrumbForAwarding(_breadCrumbElements, _breadCrumbItem.container);
                } else if (qigStore.instance.selectedQIGForMarkerOperation) {
                    this.getbreadCrumbForResponse(_breadCrumbElements);
                }
                break;
            case enums.PageContainers.Message:
                this.getbreadCrumbForMessage(_breadCrumbElements);
                break;
            case enums.PageContainers.Reports:
                this.getbreadCrumbForReports(_breadCrumbElements);
                break;
            case enums.PageContainers.TeamManagement:
                this.getbreadCrumbForTeamManagement(_breadCrumbElements);
                break;
            case enums.PageContainers.StandardisationSetup:
                this.getbreadCrumbForStandardisationSetup(_breadCrumbElements);
                break;
            case enums.PageContainers.Awarding:
                this.getbreadCrumbForAwarding(_breadCrumbElements);
                break;
            default:
                break;
        }

        return _breadCrumbElements;
    }

    /**
     * Get Formatted QIG Name based on CC
     */
    private static getFormattedQIGName() {
        return stringFormatHelper.formatAwardingBodyQIG(
            qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupName,
            qigStore.instance.selectedQIGForMarkerOperation.assessmentCode,
            qigStore.instance.selectedQIGForMarkerOperation.sessionName,
            qigStore.instance.selectedQIGForMarkerOperation.componentId,
            qigStore.instance.selectedQIGForMarkerOperation.questionPaperName,
            qigStore.instance.selectedQIGForMarkerOperation.assessmentName,
            qigStore.instance.selectedQIGForMarkerOperation.componentName,
            stringFormatHelper.getOverviewQIGNameFormat());
    }

    /**
     * This method will push home breadcrumb item to breadCrumbElements array.
     */
    private static pushHomeBreadCrumbItem(_breadCrumbElements: Array<JSX.Element>, container: enums.PageContainers) {
        let breadCrumbProps = {
            key: 'key_breadcrumb_home',
            id: 'breadcrumb_home',
            selectedLanguage: localeStore.instance.Locale,
            container: container,
            isClickable: true,
            navigateTo: enums.PageContainers.QigSelector,
            breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.home'),
            isA3Logo: false
        };

        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for Message
     */
    private static getbreadCrumbForMessage(_breadCrumbElements: Array<JSX.Element>) {
        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.Message);

        let breadCrumbProps = {
            key: 'key_breadcrumb_message',
            id: 'breadcrumb_message',
            selectedLanguage: localeStore.instance.Locale,
            container: enums.PageContainers.Message,
            isClickable: false,
            breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.inbox'),
            navigateTo: enums.PageContainers.None,
            isA3Logo: false
        };

        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for QigSelector
     */
    private static getbreadCrumbForQigSelector(_breadCrumbElements: Array<JSX.Element>,
        container: enums.PageContainers
    ) {
        let isClickable: boolean = true;
        if (container === enums.PageContainers.Login ||
            container === enums.PageContainers.QigSelector ||
            (container === enums.PageContainers.WorkList &&
                !qigStore.instance.selectedQIGForMarkerOperation)) {
            isClickable = false;
        }
        let breadCrumbProps = {
            key: 'key_breadcrumb_qig',
            id: 'breadcrumb_qig',
            selectedLanguage: localeStore.instance.Locale,
            container: container,
            isClickable: isClickable,
            isA3Logo: true
        };

        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for TeamManagement
     */
    private static getbreadCrumbForTeamManagement(_breadCrumbElements: Array<JSX.Element>) {
        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.TeamManagement);

        let breadCrumbProps = {
            key: 'key_breadcrumb_Team',
            id: 'breadcrumb_team',
            selectedLanguage: localeStore.instance.Locale,
            container: enums.PageContainers.TeamManagement,
            isClickable: false,
            breadCrumbString: localeStore.instance.TranslateText
                ('generic.navigation-bar.breadcrumbs.team-management-for') + this.getFormattedQIGName(),
            isA3Logo: false
        };

        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for Response
     */
    private static getbreadCrumbForResponse(_breadCrumbElements: Array<JSX.Element>) {
        let breadCrumbProps: any;

        let isMarkingCheckMode = worklistStore.instance.isMarkingCheckMode;

        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.Response);

        if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Marking
            || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Awarding) {

            breadCrumbProps = {
                key: 'key_breadcrumb_response',
                id: 'breadcrumb_response',
                selectedLanguage: localeStore.instance.Locale,
                container: enums.PageContainers.Response,
                isClickable: true,
                breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.worklist'),
                navigateTo: enums.PageContainers.WorkList,
                isA3Logo: false
            };

            _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

            if (isMarkingCheckMode) {

                // Once in markingcheck worklist the breadcrumb structure will be : Home / Worklist / Marking Check
                // Marking Check will be clickable and will navigate to MarkingCheck Worklist.
                // On clicking Worklist, will navigate to logged in examiner's My Marking screen.

                breadCrumbProps = {
                    key: 'key_breadcrumb_markCheck_worklist_markingCheck',
                    id: 'breadcrumb_markCheck_worklist_markingCheck',
                    selectedLanguage: localeStore.instance.Locale,
                    container: enums.PageContainers.Response,
                    isClickable: true,
                    breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.marking-check'),
                    isA3Logo: false,
                    navigateTo: enums.PageContainers.MarkingCheckExaminersWorkList
                };

                _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));
            }

        } else if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.StandardisationSetup) {

            let breadCrumbString: string;
            let id: string;
            let navigateTo: enums.PageContainers = enums.PageContainers.StandardisationSetup;
            switch (standardisationSetupStore.instance.selectedStandardisationSetupWorkList) {
                case enums.StandardisationSetup.SelectResponse:
                    if (standardisationSetupStore.instance.selectedTabInSelectResponse === enums.StandardisationSessionTab.CurrentSession) {
                        breadCrumbString = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.select-responses');
                        id = 'breadcrumb_select_responses';
                    } else {
                        breadCrumbString = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.previous-session');
                        id = 'breadcrumb_reuse_select_responses';
                    }
                    break;
                case enums.StandardisationSetup.UnClassifiedResponse:
                    breadCrumbString = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.unclassified');
                    id = 'breadcrumb_unclassified';
                    break;
                case enums.StandardisationSetup.ClassifiedResponse:
                    breadCrumbString = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.classified');
                    id = 'breadcrumb_classified';
                    break;
                case enums.StandardisationSetup.ProvisionalResponse:
                    // If response is from searchedResponseData we have to check whether the response owner and logged in user are same
                    // If they are not we have to show the breadCrumb as Inbox
                    if (responseStore.instance.searchedResponseData &&
                        responseStore.instance.searchedResponseData.loggedInExaminerRoleId
                        !== responseStore.instance.searchedResponseData.examinerRoleId) {
                        breadCrumbString = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.inbox');
                        id = 'breadcrumb_message';
                        navigateTo = enums.PageContainers.Message;
                    } else {
                        breadCrumbString = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.provisional');
                        id = 'breadcrumb_provisional';
                    }
                    break;
            }

            breadCrumbProps = {
                key: 'key_' + id,
                id: id,
                selectedLanguage: localeStore.instance.Locale,
                container: enums.PageContainers.Response,
                isClickable: true,
                breadCrumbString: breadCrumbString,
                isA3Logo: false,
                navigateTo: navigateTo
            };

            _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        } else {
            if (teamManagementStore && teamManagementStore.instance.isRedirectFromException) {
                breadCrumbProps = {
                    key: 'key_breadcrumb_response_team',
                    id: 'breadcrumb_team_response_team',
                    selectedLanguage: localeStore.instance.Locale,
                    container: enums.PageContainers.Response,
                    isClickable: true,
                    breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.team-management'),
                    navigateTo: enums.PageContainers.TeamManagement,
                    isA3Logo: false
                };

                _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));
            } else {
                breadCrumbProps = {
                    key: 'key_breadcrumb_response_team',
                    id: 'breadcrumb_team_response_team',
                    selectedLanguage: localeStore.instance.Locale,
                    container: enums.PageContainers.Response,
                    isClickable: true,
                    breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.team'),
                    navigateTo: enums.PageContainers.TeamManagement,
                    isA3Logo: false
                };

                _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

                breadCrumbProps = {
                    key: 'key_breadcrumb_response_examiner',
                    id: 'breadcrumb_team_response_examiner',
                    selectedLanguage: localeStore.instance.Locale,
                    container: enums.PageContainers.Response,
                    isClickable: true,
                    breadCrumbString: examinerStore.instance.getMarkerInformation.formattedExaminerName,
                    navigateTo: enums.PageContainers.WorkList,
                    isA3Logo: false
                };

                _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));
            }

        }

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for WorkList
     */
    private static getbreadCrumbForWorkList(_breadCrumbElements: Array<JSX.Element>) {
        let isMarkingCheckMode = worklistStore.instance.isMarkingCheckMode;

        let breadCrumbProps;

        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.WorkList);

        if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Marking
            || userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.Awarding) {

            let worklistBreadCrumbKey: string = 'key_breadcrumb_worklist';
            let worklistBreadCrumbId: string = 'breadcrumb_worklist';
            let worklistBreadCrumbText: string = localeStore.instance.TranslateText
                ('generic.navigation-bar.breadcrumbs.worklist-for') + this.getFormattedQIGName();

            if (isMarkingCheckMode) {

                // in marking check worklist we need 'worklist' element as clickable and with different text
                worklistBreadCrumbKey = 'key_breadcrumb_markCheck_worklist';
                worklistBreadCrumbId = 'breadcrumb_markCheck_worklist';
                worklistBreadCrumbText = localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.worklist');
            }

            breadCrumbProps = {
                key: worklistBreadCrumbKey,
                id: worklistBreadCrumbId,
                selectedLanguage: localeStore.instance.Locale,
                container: enums.PageContainers.WorkList,
                isClickable: isMarkingCheckMode,
                breadCrumbString: worklistBreadCrumbText,
                isA3Logo: false,
                navigateTo: enums.PageContainers.WorkList
            };

            _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

            if (isMarkingCheckMode) {

                // Once in markingcheck worklist the breadcrumb structure will be : Home / Worklist / Marking Check
                // Marking Check will not be clickable
                // On clicking Worklist, will navigate to logged in examiner's My Marking screen.

                breadCrumbProps = {
                    key: 'key_breadcrumb_markCheck_worklist_markingCheck',
                    id: 'breadcrumb_markCheck_worklist_markingCheck',
                    selectedLanguage: localeStore.instance.Locale,
                    container: enums.PageContainers.WorkList,
                    isClickable: false,
                    breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.marking-check'),
                    isA3Logo: false
                };

                _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));
            }

        } else {

            breadCrumbProps = {
                key: 'key_breadcrumb_Team',
                id: 'breadcrumb_Team',
                selectedLanguage: localeStore.instance.Locale,
                container: enums.PageContainers.WorkList,
                isClickable: true,
                breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.team'),
                navigateTo: enums.PageContainers.TeamManagement,
                isA3Logo: false
            };

            _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

            breadCrumbProps = {
                key: 'key_breadcrumb_Team_Examiner',
                id: 'breadcrumb_Team_Examiner',
                selectedLanguage: localeStore.instance.Locale,
                container: enums.PageContainers.WorkList,
                isClickable: false,
                breadCrumbString: examinerStore.instance.getMarkerInformation.formattedExaminerName,
                isA3Logo: false
            };

            _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));
        }

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for Reports
     */
    private static getbreadCrumbForReports(_breadCrumbElements: Array<JSX.Element>) {

        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.Reports);

        let breadCrumbProps = {
            key: 'key_breadcrumb_reports',
            id: 'breadcrumb_reports',
            selectedLanguage: localeStore.instance.Locale,
            container: enums.PageContainers.Reports,
            isClickable: false,
            breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.reports'),
            navigateTo: enums.PageContainers.None,
            isA3Logo: false
        };
        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for Awarding
     */
    private static getbreadCrumbForAwarding(_breadCrumbElements: Array<JSX.Element>,
        pageContainer: enums.PageContainers = enums.PageContainers.None) {

        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.StandardisationSetup);

        let breadCrumbProps = {
            key: 'key_breadcrumb_awarding',
            id: 'breadcrumb_awarding',
            selectedLanguage: localeStore.instance.Locale,
            container: enums.PageContainers.Awarding,
            isClickable: pageContainer === enums.PageContainers.Response ? true : false,
            breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.awarding'),
            navigateTo: enums.PageContainers.Awarding,
            isA3Logo: false
        };
        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }

    /**
     * This method will return BreadCrumb for Standardisation Setup
     */
    private static getbreadCrumbForStandardisationSetup(_breadCrumbElements: Array<JSX.Element>) {

        // adding home breadCrumb item.
        this.pushHomeBreadCrumbItem(_breadCrumbElements, enums.PageContainers.StandardisationSetup);

        let breadCrumbProps = {
            key: 'key_breadcrumb_standardisationsetup',
            id: 'breadcrumb_standardisationsetup',
            selectedLanguage: localeStore.instance.Locale,
            container: enums.PageContainers.StandardisationSetup,
            isClickable: false,
            breadCrumbString: localeStore.instance.TranslateText('generic.navigation-bar.breadcrumbs.standardisation-setup-for')
                + this.getFormattedQIGName(),
            navigateTo: enums.PageContainers.None,
            isA3Logo: false
        };
        _breadCrumbElements.push(React.createElement(BreadCrumbItem, breadCrumbProps));

        return _breadCrumbElements;
    }
}

export = BreadCrumbHelper;
