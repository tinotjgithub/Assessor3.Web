"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
  React component for Authorized BreadCrumb
*/
/* tslint:disable:no-unused-variable */
var React = require('react');
/* tslint:enable:no-unused-variable */
var pureRenderComponent = require('../../components/base/purerendercomponent');
var enums = require('../utility/enums');
var breadCrumbHelper = require('../../utility/breadcrumb/breadcrumbhelper');
var qigStore = require('../../stores/qigselector/qigstore');
var userInfoStore = require('../../stores/userinfo/userinfostore');
var responseStore = require('../../stores/response/responsestore');
var worklistStore = require('../../stores/worklist/workliststore');
/**
 * React component class for BreadCrumb
 */
var BreadCrumb = (function (_super) {
    __extends(BreadCrumb, _super);
    /**
     * Constructor
     * @param props
     * @param state
     */
    function BreadCrumb(props, state) {
        var _this = this;
        _super.call(this, props, state);
        this._loadCurrentExaminerWorklist = false;
        /**
         * This will show the header icons after QIGs loaded
         */
        this.qigSelected = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        /**
         * rerender breadcrumb after rendering the response id.
         */
        this.reRender = function () {
            _this.setState({
                renderedOn: Date.now()
            });
        };
        this.state = {
            renderedOn: Date.now()
        };
    }
    /**
     * Render method
     */
    BreadCrumb.prototype.render = function () {
        var breadcrumbStyle;
        var next = 0;
        var prev = 0;
        var respId = 0;
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
            var resIdWidth = (respId + next + prev) / 2;
            // Here 40 pixel is used for padding
            breadcrumbStyle = {
                width: 'calc(50vw - ' + resIdWidth + 'px - 40px)'
            };
        }
        return (React.createElement("div", {id: this.props.id, key: this.props.id + '_key', className: 'breadcrumb-holder'}, React.createElement("ul", {style: breadcrumbStyle, className: 'breadcrumb'}, this.renderBreadCrumbItems())));
    };
    /**
     * Component did mount
     */
    BreadCrumb.prototype.componentDidMount = function () {
        qigStore.instance.addListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.qigSelected);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_ID_RENDERED_EVENT, this.reRender);
        worklistStore.instance.addListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.reRender);
        worklistStore.instance.addListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
    };
    /**
     * Unsubscribe events
     */
    BreadCrumb.prototype.componentWillUnmount = function () {
        qigStore.instance.removeListener(qigStore.QigStore.QIG_SELECTED_EVENT, this.qigSelected);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_ID_RENDERED_EVENT, this.reRender);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.WORKLIST_MARKING_MODE_CHANGE, this.reRender);
        worklistStore.instance.removeListener(worklistStore.WorkListStore.MARK_CHECK_EXAMINERS_DATA_RETRIVED, this.reRender);
    };
    /**
     * Render bread Crumb items
     */
    BreadCrumb.prototype.renderBreadCrumbItems = function () {
        var _breadCrumbElements = new Array();
        // If it is team management worklist then examiner name should display
        if (userInfoStore.instance.currentOperationMode === enums.MarkerOperationMode.TeamManagement &&
            this.props.containerPage === enums.PageContainers.WorkList) {
            if (this.props.examinerName) {
                _breadCrumbElements = breadCrumbHelper.getBreadCrumbTrail();
            }
        }
        else {
            _breadCrumbElements = breadCrumbHelper.getBreadCrumbTrail();
        }
        return _breadCrumbElements;
    };
    return BreadCrumb;
}(pureRenderComponent));
module.exports = BreadCrumb;
//# sourceMappingURL=breadcrumb.js.map