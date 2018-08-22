/*
  React component for Authorized BreadCrumb
*/
/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:enable:no-unused-variable */
import pureRenderComponent = require('../../components/base/purerendercomponent');
import enums = require('../utility/enums');
import breadCrumbHelper = require('../../utility/breadcrumb/breadcrumbhelper');
import qigStore = require('../../stores/qigselector/qigstore');
import userInfoStore = require('../../stores/userinfo/userinfostore');
import BreadCrumbItem = require('./breadcrumbitem');
import responseStore = require('../../stores/response/responsestore');
import localeStore = require('../../stores/locale/localestore');
import worklistStore = require('../../stores/worklist/workliststore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    containerPage: enums.PageContainers;
    examinerName?: string;
    renderedOn?: number;
}

/**
 * All fields optional to allow partial state updates in setState
 */
interface State {
    renderedOn?: number;
}

/**
 * React component class for BreadCrumb
 */
class BreadCrumb extends pureRenderComponent<Props, State> {

    private _loadCurrentExaminerWorklist: boolean = false;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            renderedOn: Date.now()
        };
    }

    /**
     * Render method
     */
    public render() {
        let breadcrumbStyle: React.CSSProperties;
        let next = 0;
        let prev = 0;
        let respId = 0;

        // Calculating the width of breadcrumb to adjuct dynamically with response id and on resize.
        if (this.props.containerPage === enums.PageContainers.Response) {
            if (document.getElementsByClassName('response-title').item(0)) {
                respId = document.getElementsByClassName('response-title').item(0).clientWidth;
            }
            if (document.getElementsByClassName('response-nav response-nav-next').item(0)) {
                next = document.getElementsByClassName('response-nav response-nav-next').item(0).clientWidth;
            }
            if (document.getElementsByClassName('response-nav response-nav-prev').item(0)) {
                prev = document.getElementsByClassName('response-nav response-nav-prev').item(0).clientWidth;
            }

            let resIdWidth = (respId + next + prev) / 2;

            // Here 40 pixel is used for padding
            breadcrumbStyle = {
                width: 'calc(50vw - ' + resIdWidth + 'px - 40px)'
            };
        }

        return (
            <div
                id= {this.props.id}
                key= {this.props.id + '_key'}
                className = 'breadcrumb-holder'>
                <ul
                    style={breadcrumbStyle}
                    className = 'breadcrumb'>
                    {this.renderBreadCrumbItems() }
                    </ul>
                </div>
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount() {
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.qigSelected);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ID_RENDERED_EVENT, this.reRender);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.reRender);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
    }

    /**
     * Unsubscribe events
     */
    public componentWillUnmount() {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.qigSelected);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ID_RENDERED_EVENT, this.reRender);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.reRender);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
    }

    /**
     * This will show the header icons after QIGs loaded
     */
    private qigSelected = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * rerender breadcrumb after rendering the response id.
     */
    private reRender = (): void => {
        this.setState({
            renderedOn: Date.now()
        });
    };

    /**
     * Render bread Crumb items
     */
    private renderBreadCrumbItems(): Array<JSX.Element> {
        var _breadCrumbElements: Array<JSX.Element> = new Array<JSX.Element>();
        // If it is team management worklist then examiner name should display
        if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement &&
            this.props.containerPage === enums.PageContainers.WorkList) {
            if (this.props.examinerName) {
                _breadCrumbElements = breadCrumbHelper.getBreadCrumbTrail();
            }
        } else {
            _breadCrumbElements = breadCrumbHelper.getBreadCrumbTrail();
        }

        return _breadCrumbElements;
    }
}

export = BreadCrumb;