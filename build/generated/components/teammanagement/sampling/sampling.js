"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* tslint:disable:no-unused-variable */
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var markingStore = require('../../../stores/marking/markingstore');
var worklistStore = require('../../../stores/worklist/workliststore');
var classNames = require('classnames');
var enums = require('../../utility/enums');
var GenericPopupWithRadioButton = require('../../utility/genericpopupwithradiobuttons');
var GenericButton = require('../../utility/genericbutton');
var genericRadioButtonItems = require('../../utility/genericradiobuttonitems');
var teamManagementActionCreator = require('../../../actions/teammanagement/teammanagementactioncreator');
var teammanagementStore = require('../../../stores/teammanagement/teammanagementstore');
var responseStore = require('../../../stores/response/responsestore');
var teamManagementStore = require('../../../stores/teammanagement/teammanagementstore');
var qigStore = require('../../../stores/qigselector/qigstore');
var operationModeHelper = require('../../utility/userdetails/userinfo/operationmodehelper');
var storageAdapterHelper = require('../../../dataservices/storageadapters/storageadapterhelper');
var storageAdapterFactory = require('../../../dataservices/storageadapters/storageadapterfactory');
var comparerList = require('../../../utility/sorting/sortbase/comparerlist');
var sortHelper = require('../../../utility/sorting/sorthelper');
var domManager = require('../../../utility/generic/domhelper');
var teamManagementLoggingHelper = require('../../utility/teammanagement/teammanagementlogginghelper');
var loggerConstants = require('../../utility/loggerhelperconstants');
var applicationStore = require('../../../stores/applicationoffline/applicationstore');
var localeStore = require('../../../stores/locale/localestore');
/**
 * sampling component.
 * @param {Props} props
 * @returns
 */
var Sampling = (function (_super) {
    __extends(Sampling, _super);
    /**
     * @constructor
     */
    function Sampling(props) {
        var _this = this;
        _super.call(this, props, null);
        this.sampleReviewCommentId = enums.SampleReviewComment.None;
        this._storageAdapterHelper = new storageAdapterHelper();
        this._onClick = null;
        /**
         * To get the button name along with comment selected for the sampling button
         */
        this.getSamplingButtonContentWithSelectedComment = function () {
            var childElement = new Array();
            childElement.push(React.createElement("span", {id: 'supervisor- review - button - text', className: 'padding-left-5 padding-right-10'}, " ", localeStore.instance.
                TranslateText('team-management.response.mark-scheme-panel.supervisor-sampling-button')));
            // The comment id text has to be added only when there is a selected text
            if (_this.sampleReviewCommentId !== enums.SampleReviewComment.None) {
                childElement.push(React.createElement("span", {id: 'supervisor-review-comment-text', className: 'supervisor-selcted small-text'}, localeStore.instance.
                    TranslateText('team-management.response.supervisor-sampling-comments.' + _this.sampleReviewCommentId)));
            }
            return childElement;
        };
        /**
         * Handle click events on the window
         * @param {any} source - The source element
         */
        this.handleOnClick = function (source) {
            if (source.target !== undefined &&
                domManager.searchParentNode(source.target, function (el) {
                    return el.id === 'supervisor-sampling-wrapper' || el.id === 'supervisor-sampling';
                }) == null) {
                if (_this.state.doHide !== undefined && _this.state.doHide === false) {
                    _this.setState({ doHide: true });
                }
            }
        };
        /**
         * handling after updating sampling status in store
         * @param isAlreadysampled
         */
        this.onSamplingStatusChanged = function (supervisorSamplingCommentReturn) {
            // deleting cache data to retrieving updated data
            storageAdapterFactory.getInstance().deleteData('worklist', _this._storageAdapterHelper.getMemoryStorageKeyForWorklistData(worklistStore.instance.currentWorklistType, worklistStore.instance.getResponseMode, enums.RemarkRequestType.Unknown, operationModeHelper.examinerRoleId))
                .catch();
            var _doDisable = false;
            if (supervisorSamplingCommentReturn.isSampled) {
                _this.sampleReviewCommentId = enums.SampleReviewComment.None;
                _doDisable = true;
            }
            _this.setState({
                renderedOn: Date.now(),
                doDisable: _doDisable
            });
        };
        /**
         * On clicking items in radio button popup
         * @param item
         */
        this.onCheckedChange = function (item) {
            if (item.id !== _this.sampleReviewCommentId) {
                _this.updateData(item);
            }
            return false;
        };
        /**
         * Indicating network connection has resetted
         */
        this.networkStatusChanged = function () {
            // enabling the button in offline scenario if the button is in enabled mode
            if (_this.state.doDisable) {
                _this.updateSamplingData(responseStore.instance.sampleReviewCommentId);
            }
        };
        this.state = {
            renderedOn: 0,
            doHide: true,
            doDisable: responseStore.instance.sampleReviewCommentCreatedBy !== 0 &&
                responseStore.instance.sampleReviewCommentCreatedBy !== teamManagementStore.instance.selectedExaminerRoleId
        };
        this._onClick = this.handleOnClick.bind(this);
    }
    /**
     * Render method
     */
    Sampling.prototype.render = function () {
        return (React.createElement("div", {className: classNames('supervisor-sampling-holder dropdown-wrap up white supervisor-remark-decision', { 'open': !this.state.doHide })}, React.createElement(GenericButton, {id: 'supervisor-sampling', className: 'button rounded primary set-reviewed  menu-button', selectedLanguage: this.props.selectedLanguage, key: 'key_supervisor-sampling', onClick: this.onSamplingButtonClick.bind(this), disabled: this.state.doDisable, childrens: this.getSamplingButtonContentWithSelectedComment(), buttonType: enums.ButtonType.Sampling}), React.createElement("div", {className: 'menu', id: 'supervisor-sampling-wrapper'}, React.createElement("div", {className: 'eur-reason-options'}, React.createElement(GenericPopupWithRadioButton, {className: 'supervisor-select-options', id: 'popup-supervisor-sampling', items: this.items, selectedLanguage: this.props.selectedLanguage, onCheckedChange: this.onCheckedChange, renderedOn: this.state.renderedOn, key: 'key-popup-supervisor-sampling'})))));
    };
    /**
     * Component did mount
     */
    Sampling.prototype.componentDidMount = function () {
        this.populateData();
        window.addEventListener('click', this._onClick);
        teammanagementStore.instance.addListener(teammanagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT, this.onSamplingStatusChanged);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    };
    /**
     * Component will unmount
     */
    Sampling.prototype.componentWillUnmount = function () {
        window.removeEventListener('click', this._onClick);
        teammanagementStore.instance.removeListener(teammanagementStore.TeamManagementStore.SAMPLING_STATUS_CHANGED_EVENT, this.onSamplingStatusChanged);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.networkStatusChanged);
    };
    /**
     * Component will receive props
     */
    Sampling.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps !== this.props) {
            this.populateData();
            this.setState({
                doDisable: responseStore.instance.sampleReviewCommentCreatedBy !== 0 &&
                    responseStore.instance.sampleReviewCommentCreatedBy !== teamManagementStore.instance.selectedExaminerRoleId
            });
        }
    };
    /**
     * On clicking sampling button
     * @param items
     */
    Sampling.prototype.onSamplingButtonClick = function () {
        this.setState({
            doHide: !this.state.doHide
        });
    };
    /**
     * adding items to radio buttons
     */
    Sampling.prototype.populateData = function () {
        this.items = new Array();
        var obj;
        this.sampleReviewCommentId = responseStore.instance.sampleReviewCommentId;
        for (var item in enums.SampleReviewComment) {
            if (parseInt(item) >= 0) {
                var commentItem = parseInt(item);
                obj = new genericRadioButtonItems();
                obj.isChecked = commentItem === responseStore.instance.sampleReviewCommentId ? true : false;
                obj.name = localeStore.instance.TranslateText('team-management.response.supervisor-sampling-comments.' + commentItem);
                obj.id = commentItem;
                switch (commentItem) {
                    case enums.SampleReviewComment.None:
                        obj.sequenceNo = 1;
                        break;
                    case enums.SampleReviewComment.Sampled_Feedback_Given:
                        obj.sequenceNo = 2;
                        break;
                    case enums.SampleReviewComment.Sampled_Action_Reqd:
                        obj.sequenceNo = 3;
                        break;
                    case enums.SampleReviewComment.Sampled_OK:
                        obj.sequenceNo = 4;
                        break;
                }
                this.items.push(obj);
            }
        }
        var _sampleReviewCommentComparer = 'SampleReviewCommentComparer';
        sortHelper.sort(this.items, comparerList[_sampleReviewCommentComparer]);
    };
    /**
     * updating item to with the selected status
     */
    Sampling.prototype.updateData = function (item) {
        // disabling the button untill the db call completes,
        // after completing button will gets enabled
        // updating the checked property
        this.updateSamplingData(item.id);
        var args = {
            markGroupId: markingStore.instance.currentMarkGroupId,
            samplingCommentId: item.id,
            supervisorRoleId: teamManagementStore.instance.selectedExaminerRoleId ?
                teamManagementStore.instance.selectedExaminerRoleId : operationModeHelper.examinerRoleId,
            subordinateExaminerId: teamManagementStore.instance.examinerDrillDownData ?
                teamManagementStore.instance.examinerDrillDownData.examinerId : 0,
            markSchemeGroupId: qigStore.instance.selectedQIGForMarkerOperation.markSchemeGroupId
        };
        // update the sampling status to db
        teamManagementActionCreator.samplingStatusChange(args, responseStore.instance.selectedDisplayId);
        // Log supervisor sampling details
        new teamManagementLoggingHelper().logSupervisorSamplingChanges(loggerConstants.TEAMMANAGEMENT_REASON_SUPERVISOR_ACTION, loggerConstants.TEAMMANAGEMENT_TYPE_SUPERVISOR_SAMPLING, args);
    };
    /**
     * update the item to be updated
     * @param itemToBeUpdated
     */
    Sampling.prototype.updateSamplingData = function (itemToBeUpdated) {
        var doUpdate = applicationStore.instance.isOnline;
        // updating the checked property if the system is in online mode
        if (doUpdate) {
            this.sampleReviewCommentId = itemToBeUpdated;
            this.items.map(function (i) {
                i.isChecked = i.id === itemToBeUpdated ? true : false;
            });
        }
        // disable/hide if the system is in online, donot disable/hide in offline mode
        this.setState({
            renderedOn: Date.now(),
            doHide: doUpdate,
            doDisable: doUpdate
        });
    };
    return Sampling;
}(pureRenderComponent));
module.exports = Sampling;
//# sourceMappingURL=sampling.js.map