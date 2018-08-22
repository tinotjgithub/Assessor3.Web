import responseContainerHelperBase = require('./responsecontainerhelperbase');
import scriptHelper = require('../../../utility/script/scripthelper');
import responseContainerPropertyBase = require('./responsecontainerpropertybase');
import enums = require('../enums');
import messageStore = require('../../../stores/message/messagestore');
import onPageCommentHelper = require('../annotation/onpagecommenthelper');
import markingStore = require('../../../stores/marking/markingstore');
import enhancedOffPageCommentStore = require('../../../stores/enhancedoffpagecomments/enhancedoffpagecommentstore');
import qigStore = require('../../../stores/qigselector/qigstore');
import configurableCharacteristicsHelper = require('../../../utility/configurablecharacteristic/configurablecharacteristicshelper');
import configurableCharacteristicsNames = require('../../../utility/configurablecharacteristic/configurablecharacteristicsnames');

class NonDigitalContainerHelper extends responseContainerHelperBase {
    constructor(
        _responseContainerPropertyBase: responseContainerPropertyBase,
        renderedOn: number,
        selectedLanguage: string,
        _responseViewMode: enums.ResponseViewMode
    ) {
        super(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode);
    }

    /**
     * Fetch images for ecourse work script images.
     */
    public fetchUnstructuredScriptImages() {
        return this.responseContainerProperty.scriptHelper.fetchUnstructuredScriptImages();
    }

    /**
     * Get the urls for all images.
     */
    public getAllImageURLs(): Immutable.List<string> {
        return this.responseContainerProperty.scriptHelper.getAllImageURLs();
    }

    /**
     * Get the file meta data.
     */
    public getFileMetadata(): Immutable.List<FileMetadata> {
        return this.responseContainerProperty.scriptHelper.getFileMetadata();
    }

    /**
     * called for setting the side view class
     * @returns
     */
    public enableSideViewComment(isExceptionPanelVisible: boolean): boolean {
        let selectedFileMetadataList: Immutable.List<FileMetadata> = this.getFileMetadata();
        this.responseContainerProperty.hasOnPageComments = onPageCommentHelper.hasOnPageComments(selectedFileMetadataList, false,
            this.responseContainerProperty.imageZonesCollection);
        return (this.responseContainerProperty.hasOnPageComments &&
            ((!this.responseContainerProperty.isMessagePanelVisible && !isExceptionPanelVisible) ||
                (messageStore.instance.messageViewAction === enums.MessageViewAction.Minimize ||
                    this.responseContainerProperty.isExceptionPanelMinimized))
        );
    }

    /**
     * wrapper class name
     * @param isExceptionPanelVisible
     * @param isCommentsSideViewEnabled
     */
    public getResponseModeWrapperClassName(
        isExceptionPanelVisible: boolean,
        isCommentsSideViewEnabled: boolean
    ): string {
        return this.getWrapperClassName(isExceptionPanelVisible, isCommentsSideViewEnabled,
            this.enableSideViewComment(isExceptionPanelVisible));
    }

    /**
     * Return true if the component is e-course work
     */
    public get doExcludeSuppressedPage(): boolean {
        return false;
    }
}
export = NonDigitalContainerHelper;
