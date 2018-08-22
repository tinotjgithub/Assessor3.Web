/* tslint:disable:no-unused-variable */
import React = require('react');
/* tslint:disable:no-unused-variable */
import pureRenderComponent = require('../../base/purerendercomponent');
import responseStore = require('../../../stores/response/responsestore');
import localeStore = require('../../../stores/locale/localestore');
let classNames = require('classnames');
import eCourseWorkFileStore = require('../../../stores/response/digital/ecourseworkfilestore');

/**
 * Properties of the component
 */
/* tslint:disable:no-empty-interfaces */
interface Props extends LocaleSelectionBase {
    renderedOn?: number;
}

interface State {
    renderedOn: number;
    fileName?: string;
}

/**
 * Page number indicator component to show the page number when scrolling through the script.
 */
class FileNameIndicator extends pureRenderComponent<Props, State> {

    /**
     * @constructor
     */
    constructor(props: Props, state: State) {
        super(props, state);
        let fileName: string = eCourseWorkFileStore.instance.lastSelectedECourseworkFile ?
                               eCourseWorkFileStore.instance.lastSelectedECourseworkFile.title : '';
        this.state = {
            renderedOn: 0,
            fileName: fileName
        };
    }

    /**
     * This function gets invoked when the component is about to be mounted
     */
    public componentDidMount() {
        eCourseWorkFileStore.instance.addListener(eCourseWorkFileStore.ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT,
            this.onFileNameDisplay);
        let fileNameElement: HTMLElement = document.getElementById('response-file-name');
        if (fileNameElement) {
            fileNameElement.addEventListener('animationend', this.removeFileNameIndicator);
        }
    }

    /**
     * This function gets invoked when the component is about to be unmounted
     */
    public componentWillUnmount() {
        eCourseWorkFileStore.instance.removeListener(eCourseWorkFileStore.ECourseWorkFileStore.DISPLAY_FILE_NAME_EVENT,
            this.onFileNameDisplay);
        let fileNameElement: HTMLElement = document.getElementById('response-file-name');
        if (fileNameElement) {
            fileNameElement.removeEventListener('animationend', this.removeFileNameIndicator);
        }
    }

    /**
     * Render method
     */
    public render() {
        return (
            <div id='response-file-name' className={classNames('response-file-name',
                { 'show': eCourseWorkFileStore.instance.isFilelistPanelCollapsed && this.state.fileName !== '' }) }>
                <div className='pn-line1'>{ localeStore.instance.TranslateText('marking.response.media-player.file-name') }</div>
                <div id='file-name-indicator' className='pn-line2'>{this.state.fileName}</div>
            </div>
        );
    }

    /**
     * Method to add class and set filename
     */
    private onFileNameDisplay = (fileName): void => {
        let element = document.getElementById('response-file-name');
        if (element) {
            element.classList.add('show');
        }
        this.setState({
            renderedOn: Date.now(),
            fileName: fileName
        });
    }

    /**
     * Method to remove file name indicator after animation end
     */
    private removeFileNameIndicator = (event?: any): void => {
        if (event && (event.type === 'animationend') && (event.animationName === 'fade-out')
            && event.target.id === 'response-file-name') {
            // To show the animation effect, need to make change in html
            // So removing class name 'show' and adding the same in render method
            document.getElementById('response-file-name').classList.remove('show');
        }
    };
}

export = FileNameIndicator;


