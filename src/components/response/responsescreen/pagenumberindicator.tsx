/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import responseStore = require('../../../stores/response/responsestore');
import localeStore = require('../../../stores/locale/localestore');
let classNames = require('classnames');
import eCourseworkHelper = require('../../utility/ecoursework/ecourseworkhelper');
import enums = require('../../utility/enums');
import eCourseworkFile = require('../../../stores/response/digital/typings/courseworkfile');

/**
 * Properties of the component
 */
interface Props extends LocaleSelectionBase {
    noOfImages: number;
}

interface State {
    renderedOn: number;
}

/**
 * Page number indicator component to show the page number when scrolling through the script.
 */
class PageNumberIndicator extends pureRenderComponent<Props, State> {
    private _isBookletView: boolean = false;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            renderedOn: 0
        };
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        responseStore.instance.addListener(responseStore.ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT, this.onMostVisiblePageUpdated);
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        responseStore.instance.removeListener(responseStore.ResponseStore.MOST_VISIBLE_PAGE_UPDATED_EVENT, this.onMostVisiblePageUpdated);
    }

    /**
     * Render method
     */
    public render() {
        let selectedECourseWorkFile: eCourseworkFile = eCourseworkHelper.getSelectedECourseworkImageFile();
        let isImage = selectedECourseWorkFile ?
            selectedECourseWorkFile.linkData.mediaType === enums.MediaType.Image : undefined;
        if (this.isPageNumberIndicatorNotApplicable()) {
            return null;
        } else if (this._isBookletView) {
            return (
                <div className='relative'>
                    {(eCourseworkHelper.isECourseworkComponent && isImage) ? null :
                        <div id='pageindicator' className={ classNames('page-number-marksheet',
                            {
                                'hide': this.state.renderedOn === 0
                            }) }>
                            <div className='pn-line1'>
                                { localeStore.instance.TranslateText
                                    ('marking.response.page-number-indicator.image-number-label-booklet-view') }
                                <span className='pn'>{' ' + responseStore.instance.pageNoIndicatorData.imageNo[0] + ' '}</span>
                                { '& ' }
                                <span className='pn'>{' ' + responseStore.instance.pageNoIndicatorData.imageNo[1] + ' '}</span>
                                { localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label') }
                                { ' ' + this.props.noOfImages }
                            </div>
                            {(eCourseworkHelper.isECourseworkComponent && !isImage) ? null :
                                <div className='pn-line2'>
                                    { localeStore.instance.TranslateText
                                        ('marking.response.page-number-indicator.page-number-label-booklet-view') }
                                    <span className='pn-actual'>
                                        {' ' + responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0] + ' '}</span>
                                    { '& ' }
                                    <span className='pn'>
                                        {' ' + responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[1] + ' '}</span>
                                    { localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label') }
                                    { ' ' + localeStore.instance.TranslateText('marking.response.page-number-indicator.script-label') }
                                </div>}
                        </div>
                    }
                </div>
            );
        } else {
            return (
                <div className='relative'>
                    {(eCourseworkHelper.isECourseworkComponent && isImage) ? null :
                        <div id='pageindicator' className={ classNames('page-number-marksheet',
                            {
                                'hide': this.state.renderedOn === 0
                            }) }>
                            <div className='pn-line1'>
                                { localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-label') }
                                <span className='pn'>{' ' + responseStore.instance.pageNoIndicatorData.imageNo[0] + ' '}</span>
                                { localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label') }
                                <span className='pn-max'>{' ' + this.props.noOfImages}</span>
                            </div>
                            {(eCourseworkHelper.isECourseworkComponent && !isImage) ? null :
                                <div className='pn-line2'>
                                    { localeStore.instance.TranslateText('marking.response.page-number-indicator.page-number-label') }
                                    <span className='pn-actual'>
                                        {' ' + responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0] + ' '}</span>
                                    { localeStore.instance.TranslateText('marking.response.page-number-indicator.image-number-of-label') }
                                    { ' ' + localeStore.instance.TranslateText('marking.response.page-number-indicator.script-label') }
                                </div>}
                        </div> }
             </div>
            );
        }
    }

    /**
     * Checks if the page number indicator is applicable for the images visible on the screen
     */
    private isPageNumberIndicatorNotApplicable(): boolean {
        return !responseStore.instance.pageNoIndicatorData
            || !responseStore.instance.pageNoIndicatorData.imageNo[0]
            || !responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0]
            || responseStore.instance.pageNoIndicatorData.mostVisiblePageNo[0] < 1
            || responseStore.instance.pageNoIndicatorData.imageNo[0] < 1;
    }

    /** Updates the PageNumber indicator based on response scroll */
    private onMostVisiblePageUpdated = (): void => {
        if (responseStore.instance.pageNoIndicatorData.mostVisiblePageNo.length > 1) {
            this._isBookletView = true;
        } else {
            this._isBookletView = false;
        }

        this.setState({
            renderedOn: Date.now()
        });

        // Hide the page indicator after sometime.
        let that = this;
        setTimeout(() => {
            that.setState({
                renderedOn: 0
            });
        }, 0);
    };
}

export = PageNumberIndicator;


