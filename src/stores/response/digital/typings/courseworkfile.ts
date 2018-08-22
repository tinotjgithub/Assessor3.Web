import enums = require('../../../../components/utility/enums');
import linkData = require('./linkdata');

/**
 * interface definition for courseworkfile
 */
interface CourseWorkFile {
    title: string;
    docPageID: number;
    linkData: linkData;
    readStatus: boolean;
    pageType: enums.PageType;
    linkType: string;
    docPermission: number;
    alternateLink: CourseWorkFile;
    processed: boolean;
    convertedDocumentId: number;
    rowVersion: string;
    readProgressStatus: boolean;
    playerMode: enums.MediaSourceType;
    // Stores the last played volume of a media file within one response
    lastPlayedVolume: number;
    // Stores the last played time of a media file within one response
    lastPlayedMediaTime: number;
    isSelected: boolean;
}

export = CourseWorkFile;