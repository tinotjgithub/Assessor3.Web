import xmlDom = require('xmldom');

/**
 * XML Utility class
 */
class XmlHelper {
    private xmlDoc: Document;

    /**
     * Constructor for xmlhelper
     * @param xml
     */
    constructor(xml: string) {
        let domParser = new xmlDom.DOMParser();
        this.xmlDoc = domParser.parseFromString(xml, 'text/xml');
    }

    /**
     * get the node value by name
     * @param {string} nodeName
     * @returns
     */
    public getNodeValueByName(nodeName: string) {
        if (this.xmlDoc !== undefined
            && this.xmlDoc.getElementsByTagName(nodeName) !== undefined
            && this.xmlDoc.getElementsByTagName(nodeName)[0] !== undefined
            && this.xmlDoc.getElementsByTagName(nodeName)[0].firstChild !== undefined) {
            return this.xmlDoc.getElementsByTagName(nodeName)[0].firstChild.nodeValue;
        }

        return undefined;
    }

    /**
     * get the child nodes with node name
     * @param {string} nodeName
     * @returns
     */
    public getChildNodes(nodeName: string) {
        return this.xmlDoc.getElementsByTagName(nodeName)[0] === undefined ? undefined
                                                                           : this.xmlDoc.getElementsByTagName(nodeName)[0].childNodes;
    }

    /**
     * get all the chode nodes
     * @returns
     */
    public getAllChildNodes() {
        return this.xmlDoc.documentElement === undefined ? undefined : this.xmlDoc.documentElement.childNodes;
    }

    /**
     * Method which retrieves an attribute value from the XML
     * @param attributeName
     */
    public getAttributeValueByName(attributeName: string) {
        if (this.xmlDoc !== undefined
            && this.xmlDoc.firstChild !== undefined
            && this.xmlDoc.firstChild.attributes !== undefined
            && this.xmlDoc.firstChild.attributes.getNamedItem(attributeName) !== undefined) {
            return this.xmlDoc.firstChild.attributes.getNamedItem(attributeName).value;
        }
    }
}

export = XmlHelper;