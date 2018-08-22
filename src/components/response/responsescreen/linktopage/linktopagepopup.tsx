/* tslint:disable:no-unused-variable */
import React = require('react');
import Reactdom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import localeStore = require('../../../../stores/locale/localestore');
import treeViewItem = require('../../../../stores/markschemestructure/typings/treeviewitem');
import treeViewDatahelper = require('../../../../utility/treeviewhelpers/treeviewdatahelper');
import enums = require('../../../utility/enums');
import moduleKeyHandler = require('../../../../utility/generic/modulekeyhandler');
import modulekeys = require('../../../../utility/generic/modulekeys');
import keyDownHelper = require('../../../../utility/generic/keydownhelper');
import responseStore = require('../../../../stores/response/responsestore');
import LinkToPageTreeNode = require('./linktopagetreenode');
import pageLinkHelper = require('./pagelinkhelper');
import constants = require('../../../utility/constants');

/**
 * Properties of the component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    doOpen: boolean;
    onLinkToPageCancelClick: Function;
    onLinkToPageOkClick: Function;
    linkToPageButtonLeft: number;
    currentPageNumber: number;
    addLinkAnnotation: Function;
    removeLinkAnnotation: Function;
    isKeyBoardSupportEnabled: boolean;
}

/**
 * State of a component
 */
interface State {
    renderedOn?: number;
}

/**
 * React component class for Link to question popup.
 */
class LinkToPagePopup extends pureRenderComponent<Props, any> {

    // node collection for the markscheme
    private _treeNodes: treeViewItem;

    private isOkButtonFoussed: boolean = true;

    // tree view data helper
    private _treeViewDatahelper: treeViewDatahelper;

    // flag to check if component rendered for the first time
    private isRenderedForTheFirstTime: boolean = true;

    private doShowHeader: boolean = false;

    /**
     * Constructor
     * @param props
     * @param state
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this._treeViewDatahelper = new treeViewDatahelper();
        this.onOrientationChange = this.onOrientationChange.bind(this);
        this.keyHandler = this.keyHandler.bind(this);
        this.state = {
            renderedOn: Date.now()
        };
    }

    /**
     * component did mount of link to page popup
     */
    public componentDidMount() {
        window.addEventListener('orientationchange', this.onOrientationChange);
        responseStore.instance.addListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.resetTreeNodes);
    }

    /**
     * component will unmount of link to page popup
     */
    public componentWillUnmount() {
        window.removeEventListener('orientationchange', this.onOrientationChange);
        responseStore.instance.removeListener(responseStore.ResponseStore.RESPONSE_CHANGED, this.resetTreeNodes);
    }

    /** refs */
    public refs: {
        cancelButton: (HTMLButtonElement);
        okButton: (HTMLButtonElement);
    };

    /**
     * renders the component
     */
    public render() {

        if (this.props.isKeyBoardSupportEnabled) {
            let keyDownHandler: moduleKeyHandler = new moduleKeyHandler(
                modulekeys.POPUP_KEY_DOWN,
                enums.Priority.Second,
                true,
                this.keyHandler,
                enums.KeyMode.down);
            keyDownHelper.instance.mountKeyDownHandler(keyDownHandler);

            let keyPressHandler: moduleKeyHandler = new moduleKeyHandler(
                modulekeys.POPUP_KEY_PRESS,
                enums.Priority.Second,
                true,
                this.keyHandler,
                enums.KeyMode.press);
            keyDownHelper.instance.mountKeyPressHandler(keyPressHandler);
        }

        if (this.isRenderedForTheFirstTime && this.props.onLinkToPageOkClick) {
            this.isRenderedForTheFirstTime = false;
            return null;
        }

        if (!this._treeNodes && this.props.doOpen) {
            this._treeNodes = this._treeViewDatahelper.getMarkSchemeStructureNodeCollection();
        }

        let style = this.getStyle();

        return (<div id={this.props.id} key={this.props.key}
            className={this.getClassName} role='dialog' aria-describedby='Linkpage'>
            <div className='popup-wrap' id='linktopage-popupwrap' style={style}>
                {this.getPopupHeader}
                {this.getPopupContent}
                {this.getPopupFooter}
            </div>
        </div>);
    }

    /**
     * return the style for the popup
     */
    private getStyle(): React.CSSProperties {
        let style: React.CSSProperties;
        let popup = Reactdom.findDOMNode(this);
        if (popup === null || popup === undefined) {
            this.setState({
                renderedOn: Date.now()
            });
        }

        let popupWrap = document.getElementById('linktopage-popupwrap');

        if (popupWrap && (popupWrap.clientWidth + this.props.linkToPageButtonLeft > document.body.clientWidth)) {
            style = {
                right: 50,
                left: 'auto',
                width: popupWrap.clientWidth
            };
        } else if (popupWrap) {
            style = {
                left: this.props.linkToPageButtonLeft,
                width: popupWrap.clientWidth
            };
        }
        return style;
    }

    /**
     * Handle keydown.
     * @param {KeyboardEvent} event
     * @returns
     */
    private keyHandler(event: KeyboardEvent): boolean {
        let key = event.keyCode || event.charCode;
        // Handling the tab key for toggling the yes and no button focus.
        if (key === enums.KeyCode.tab) {
            this.isOkButtonFoussed ? this.refs.cancelButton.focus() : this.refs.okButton.focus();
            this.isOkButtonFoussed = !this.isOkButtonFoussed;
        }
        // If enter key pressed firing action based on focused element.
        if (key === enums.KeyCode.enter) {
            if (this.isOkButtonFoussed) {
                this.props.onLinkToPageOkClick();
            } else {
                this.props.onLinkToPageCancelClick();

            }
        } else if (key === enums.KeyCode.backspace) {

            keyDownHelper.KeydownHelper.stopEvent(event);
            return true;
        }
        /** to disbale the response navigation on confirmation popups (reset marks and annotation) */
        if (key === enums.KeyCode.left || key === enums.KeyCode.right) {
            keyDownHelper.KeydownHelper.stopEvent(event);
        }
        return true;
    }

    /* return the popup header */
    private get getPopupHeader() {
        if (!this.doShowHeader) {
            this.doShowHeader = true;
            this.setState({
                renderedOn: Date.now()
            });
            return null;
        } else {
            let headerText: string = localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.header');
            return (<div className='popup-header'>
                <p className='dim-text'>{headerText}</p>
            </div>);
        }
    }

    /* returns the popup content */
    private get getPopupContent() {
        return (<div className='popup-content' id='popupcontent'>
			<ul id='question-group-container' className='question-group-container expandable'>
                {this.getLinkToQuestionTreeNodes()}
            </ul>
        </div>);
    }

    /**
     * construct the tree nodes to show in the popup
     */
    private getLinkToQuestionTreeNodes() {
        if (this._treeNodes) {
            let counter = 0;
            let that = this;
            let nodes = this._treeNodes.treeViewItemList.map(function (node: treeViewItem) {
                counter++;
                if (node.itemType === enums.TreeViewItemType.marksScheme) {
                    return null;
                }
                return <LinkToPageTreeNode id={'item' + counter.toString()}
                    key={'link_to_question_tree_node_key_' + counter.toString()} node={node}
                    children={node.treeViewItemList} renderedOn={Date.now()}
                    currentPageNumber={that.props.currentPageNumber} addLinkAnnotation={that.props.addLinkAnnotation}
                    removeLinkAnnotation={that.props.removeLinkAnnotation} />;
            });

            return nodes;
        }
    }

    /* returns the popup footer */
    private get getPopupFooter() {
        let cancelText: string = localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.ok-button');
        let okText: string = localeStore.instance.TranslateText('marking.full-response-view.page-linking-popup.cancel-button');
        return (<div className='popup-footer text-right'>
            <button className='button rounded close-button' ref={'cancelButton'}
                onClick={() => { this.props.onLinkToPageCancelClick(); this.onClickHandler(); }} title='Cancel'>{cancelText}</button>
            <button className='button primary rounded' ref={'okButton'}
                onClick={() => { this.props.onLinkToPageOkClick(); this.onClickHandler(); }} title='Save'>{okText}</button>
        </div>);
    }

    /* return the class name for the main popup wrapper*/
    private get getClassName(): string {
        return 'popup small link-to-page-popup in-page-popout popup-overlay ' +
            (this.doShowPopup ? 'open' : 'close');
    }

    /* determines if we need to open the link to question modal */
    private get doShowPopup(): boolean {
        return this.props.doOpen;
    }

    /* called when the device orientation is changed */
    public onOrientationChange = (): void => {
        if (this.props.doOpen === true) {
            setTimeout(() => {
                this.setState({
                    renderedOn: Date.now()
                });
            }, constants.LINK_TO_PAGE_POPUP_ANIMATION_TIME);
        }
    };

     /* called to unmount keyboard handler  */
    private onClickHandler = (): void => {

        if (this.props.isKeyBoardSupportEnabled) {
            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_DOWN);

            // Unmount the event to give others the priority
            keyDownHelper.instance.unmountKeyHandler(modulekeys.POPUP_KEY_PRESS);
        }
    }

    /* reset treeNodes details, inorder to reconstruct the treeNode on response navigaion 
       i.e from Whole response to single response and vice versa  */
    public resetTreeNodes = (): void => {
        this._treeNodes = undefined;
    };
}

export = LinkToPagePopup;