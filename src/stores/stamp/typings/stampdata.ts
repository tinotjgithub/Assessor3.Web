import enums = require('../../../components/utility/enums');
/*
* Interface for holding stampdata.
*/
interface StampData {
    stampId : number;
    name : string;
    displayName : string;
    svgImage: string;
    stampType: enums.StampType;
    numericValue: number;
    color?: string;
    count?: number;
    addedBySystem: boolean;
}

export = StampData;
