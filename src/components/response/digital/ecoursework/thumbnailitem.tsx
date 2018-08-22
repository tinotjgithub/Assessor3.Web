import React = require('react');
import ReactDom = require('react-dom');
import pureRenderComponent = require('../../../base/purerendercomponent');
import LoadingIndicator = require('../../../utility/loadingindicator/loadingindicator');
import enums = require('../../../utility/enums');
let classNames = require('classnames');
import eCourseWorkFileStore = require('../../../../stores/response/digital/ecourseworkfilestore');
import htmlUtilites = require('../../../../utility/generic/htmlutilities');
import markingStore = require('../../../../stores/marking/markingstore');
import applicationStore = require('../../../../stores/applicationoffline/applicationstore');

interface Props extends PropsBase, LocaleSelectionBase {
    url: string;
    fileName: string;
    fileListPanelView: enums.FileListPanelView;
    renderedOn?: number;
    onError: Function;
    docPageId: number;
    onSuccess: Function;
}

interface State {
    isLoaded?: boolean;
    retryImageDownload?: boolean;
    renderedOn?: number;
}

class ThumbnailItem extends pureRenderComponent<Props, State> {

    /* based on this variable we will load images without cache */
    private imageForceLoadRequired: boolean = false;
    private resetThumbnailUrl: boolean = false;
    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        this.state = {
            isLoaded: false,
            retryImageDownload: false,
            renderedOn: 0
        };
        this.imageloaded = this.imageloaded.bind(this);
        this.onError = this.onError.bind(this);
        this.reRenderImage = this.reRenderImage.bind(this);
        this.onResponseNavigate = this.onResponseNavigate.bind(this);
    }

    /**
     * Render method
     */
    public render() {
        let loadingIndicator: JSX.Element = this.state.isLoaded ? null : (<LoadingIndicator
            id='loadingIndicator'
            key='loadingIndicator_key'
            isFrv={false} cssClass='file-pre-loader' />);
        let toRender: JSX.Element = this.props.fileListPanelView === enums.FileListPanelView.Thumbnail ? (
            <div className='thumbnail-image'>
                <div className={classNames('thumbnail-inner', { 'loading': !this.state.isLoaded })}>
                    <img id={'thumbImg_' + this.props.docPageId} src={this.getImageURL}
                        alt={this.props.fileName} onLoad={this.imageloaded} onError={this.onError} />
                    {loadingIndicator}
                </div>
            </div>) :
            (<div className='thumbnail-image'></div>);
        return (
            toRender
        );
    }

    /**
     * Re render after image loaded
     */
    private imageloaded = () => {
        this.setState({ isLoaded: true });
        this.props.onSuccess(this.props.docPageId);
    };

    /**
     * On Error
     */
    private onError = (evt: any) => {
        this.props.onError(this.props.docPageId);
    };

    /**
     * On Component Mount
     */
    public componentDidMount() {
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.RELOAD_FAILED_IMAGE, this.reRenderImage);
        markingStore.instance.addListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onResponseNavigate);
        applicationStore.instance.addListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
    }

    /**
     * componentWillUnmount
     */
    public componentWillUnmount() {
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.RELOAD_FAILED_IMAGE, this.reRenderImage);
        markingStore.instance.removeListener(markingStore.MarkingStore.READY_TO_NAVIGATE, this.onResponseNavigate);
        applicationStore.instance.removeListener(applicationStore.ApplicationStore.ONLINE_STATUS_UPDATED_EVENT, this.onlineStatusChanged);
    }

    /**
     * Component Will recieve props
     * @param nextProps
     */
    public componentWillReceiveProps(nextProps: Props) {
        if (nextProps.docPageId !== this.props.docPageId) {
            this.setState({ retryImageDownload: false });
        }
    }

    /**
     * Component Did Update
     */
    public componentDidUpdate() {
        this.imageForceLoadRequired = false;
        this.resetThumbnailUrl = false;
        // if the retry Image Download is true rest the flag back to false so that the 
        // url will be set to the correct url on the next re render. The current render have already set the
        // url to null so that the next change in url willtrigger the image download
        if (this.state.retryImageDownload) {
            this.setState({
                retryImageDownload: false
            });
        }
    }

    /**
     * to force rerender when the image fails to render due to low band width or any network issue
     */
    private reRenderImage() {
        if (this.state.isLoaded) {
            return;
        }

        // Set the retryImageDownload to true.
        // This will initially set the url to null and on the next re render set the url back to original value
        this.setState({
            retryImageDownload: true
        });
    }

    /**
     * This method will return the image url by appending a query string if force image load required, else it will
     * return normal url. This will return null if retryImageDownload is true.
     * resetThumbnailUrl- thumbnail url resets on response navigate.
     */
    private get getImageURL(): string {
        return this.resetThumbnailUrl ? null : this.state.retryImageDownload ? null :
            this.imageForceLoadRequired ? this.props.url.replace(/\/$/, '') + '?' + Date.now() : this.props.url;
    }

    /**
     * Reset thumbnail url on response navigate.
     */
    private onResponseNavigate() {
        this.resetThumbnailUrl = true;
        this.setState({
            renderedOn: Date.now()
        });
    }

    /**
     * We need to reload all thumbnails if any offline and online scenario occured.
     */
    public onlineStatusChanged = () => {
        /* Defect fix #60077 - We need to reload cloud images without considering cache,
         some times it's showing as partially loaded in IE and Edge, if there is a internet flickering occured 
         in chrome we need to consider offline scenario */
        if (applicationStore.instance.isOnline) {
            this.imageForceLoadRequired = true;
            this.setState({
                renderedOn: Date.now()
            });
        }
    }
}

export = ThumbnailItem;