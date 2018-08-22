import React = require('react');
import ReactDom = require('react-dom');

interface Props extends PropsBase, LocaleSelectionBase {
    url: string;
    className: string;
    onLoadFn: Function;
    iframeID: string;
}

/**
 * React wrapper component for html viewer
 */
const htmlviewer = (props: Props) => {
    return (
        <iframe className={props.className} id={props.iframeID}
            frameBorder='0' src={props.url}
            onLoad={props.onLoadFn()}
        >
        </iframe>
    );
};

export = htmlviewer;