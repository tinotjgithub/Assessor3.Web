import enums = require('../../../../components/utility/enums');

/**
 * interface definition for linkdata
 */
interface LinkData {
    mimeType: string;
    mediaType: enums.MediaType;
    startPage: number;
    endPage: number;
    url: string;
    cloudType: enums.CloudType;
    content: string;
    targetType: string;
    canDisplayInApplication: boolean;
    mediaFileName: string;
}

export = LinkData;