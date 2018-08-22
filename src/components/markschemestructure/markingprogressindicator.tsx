/* tslint:disable:no-unused-variable */
import React = require('react');
import pureRenderComponent = require('../base/purerendercomponent');
import localeStore = require('../../stores/locale/localestore');
import markingStore = require('../../stores/marking/markingstore');
import eCourseWorkFileStore = require('../../stores/response/digital/ecourseworkfilestore');

/**
 * Properties of a component
 */
interface Props extends LocaleSelectionBase, PropsBase {
    progressPercentage: number;
    isVisible: boolean;
    checkIsSubmitVisible: Function;
    renderedOn?: number;
}

/**
 * Marking progress component.
 * @param {Props} props
 * @returns
 */
class MarkingProgressIndicator extends pureRenderComponent<Props, any> {

    private isVisible: boolean;

    /**
     * @constructor
     */
    constructor(props: Props) {
        super(props, null);
        this.isVisible = this.props.isVisible;
    }

    /**
     * Render method
     */
   public render() {
        if (this.isVisible) {
            return (<div className='mark-percentage-holder'>
            <span className='inline-bubble pink'>{this.props.progressPercentage + '%'}</span>
                </div>);
        } else {
            return null;
        }
    }

   /**
    * componentDidMount
    */
   public componentDidMount() {
       markingStore.instance.addListener(markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED, this.showHideMarkChangeReason);
       eCourseWorkFileStore.instance.addListener(
           eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED,
           this.fileReadStatusUpdated);
    }

    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        markingStore.instance.removeListener(
            markingStore.MarkingStore.MARK_CHANGE_REASON_VISIBILITY_UPDATED,
            this.showHideMarkChangeReason);
        eCourseWorkFileStore.instance.removeListener(
            eCourseWorkFileStore.ECourseWorkFileStore.FILE_READ_STATUS_UPDATED,
            this.fileReadStatusUpdated);
    }

   /**
    * Comparing the props to check the updats are made by self
    * @param {Props} nextProps
    */
    public componentWillReceiveProps(nextProps: Props) {
        this.isVisible = nextProps.isVisible;
    }

   /**
    * Change visibility of mark change reason
    */
    private showHideMarkChangeReason = (): void => {
        if (this.props.checkIsSubmitVisible()) {
            this.isVisible = false;
            this.setState({ reRender: Date.now() });
        } else {
            this.isVisible = true;
            this.setState({ reRender: Date.now() });
        }
    };

    /**
     * File read status updated event.
     */
    private fileReadStatusUpdated = (): void => {
        this.isVisible = !this.props.checkIsSubmitVisible();
        this.setState({ reRender: Date.now() });
    };
}

export = MarkingProgressIndicator;
