import React = require('react');
import ToolbarIcon = require('../../toolbar/stamppanel/stampdefinition/toolbaricon');
let fileIconData = require('./fileicondata.json');

interface ECourseWorkDefinitionsProps extends PropsBase, LocaleSelectionBase {
}

const eCourseWorkDefinitions = (props: ECourseWorkDefinitionsProps) => {
    let style = {
        display: 'none'
    };
    return (
        <svg version='1.1' style={style} >
            <defs>
                <ToolbarIcon id='pdf-icon'
                    key='pdf-icon'
                    svgImageData={fileIconData.pdf_icon} />

                <ToolbarIcon id='document-icon'
                    key='document-icon'
                    svgImageData={fileIconData.document_icon} />

                <ToolbarIcon id='image-icon'
                    key='image-icon'
                    svgImageData={fileIconData.image_icon} />

                <ToolbarIcon id='video-icon'
                    key='video-icon'
                    svgImageData={fileIconData.video_icon} />

                <ToolbarIcon id='audio-icon'
                    key='audio-icon'
                    svgImageData={fileIconData.audio_icon} />

                <ToolbarIcon id='volume-control'
                    key='volume-control'
                    svgImageData={fileIconData.volume_control} />

                <ToolbarIcon id='unknown-file-icon'
                    key='unknown-file-icon'
                    svgImageData={fileIconData.unknown_file_icon} />

                <ToolbarIcon id='spreadsheet-icon'
                    key='spreadsheet-icon'
                    svgImageData={fileIconData.spreadsheet_icon} />

                <ToolbarIcon id='rtf-icon'
                    key='rtf-icon'
                    svgImageData={fileIconData.rtf_icon} />

                <ToolbarIcon id='ppt-icon'
                    key='ppt-icon'
                    svgImageData={fileIconData.ppt_icon} />

                <ToolbarIcon id='html-icon'
                    key='html-icon'
                    svgImageData={fileIconData.html_icon} />

                <ToolbarIcon id='excel-icon'
                    key='excel-icon'
                    svgImageData={fileIconData.excel_icon} />

                <ToolbarIcon id='convertible-icon'
                    key='convertible-icon'
                    svgImageData={fileIconData.convertible_icon} />

            </defs>
        </svg>
            );
};

export = eCourseWorkDefinitions;