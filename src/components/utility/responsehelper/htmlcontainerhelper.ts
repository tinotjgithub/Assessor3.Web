import enums = require('../enums');
import responseContainerHelperBase = require('./responsecontainerhelperbase');
import responseContainerPropertyBase = require('./responsecontainerpropertybase');
import htmlviewerhelper = require('./htmlviewerhelper');
class HtmlContainerHelper extends responseContainerHelperBase {

    constructor(_responseContainerPropertyBase: responseContainerPropertyBase, renderedOn: number, selectedLanguage: string,
        _responseViewMode: enums.ResponseViewMode) {
        super(_responseContainerPropertyBase, renderedOn, selectedLanguage, _responseViewMode);
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
        return this.getWrapperClassName(isExceptionPanelVisible, isCommentsSideViewEnabled, false);
    }
}
export = HtmlContainerHelper;