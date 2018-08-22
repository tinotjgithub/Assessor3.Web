"use strict";
var xmlDom = require('xmldom');
/**
 * XML Utility class
 */
var XmlHelper = (function () {
    /**
     * Constructor for xmlhelper
     * @param xml
     */
    function XmlHelper(xml) {
        var domParser = new xmlDom.DOMParser();
        this.xmlDoc = domParser.parseFromString(xml, 'text/xml');
    }
    /**
     * get the node value by name
     * @param {string} nodeName
     * @returns
     */
    XmlHelper.prototype.getNodeValueByName = function (nodeName) {
        if (this.xmlDoc !== undefined
            && this.xmlDoc.getElementsByTagName(nodeName) !== undefined
            && this.xmlDoc.getElementsByTagName(nodeName)[0].firstChild !== undefined) {
            return this.xmlDoc.getElementsByTagName(nodeName)[0].firstChild.nodeValue;
        }
        return undefined;
    };
    /**
     * get the child nodes with node name
     * @param {string} nodeName
     * @returns
     */
    XmlHelper.prototype.getChildNodes = function (nodeName) {
        return this.xmlDoc.getElementsByTagName(nodeName)[0] === undefined ? undefined
            : this.xmlDoc.getElementsByTagName(nodeName)[0].childNodes;
    };
    /**
     * get all the chode nodes
     * @returns
     */
    XmlHelper.prototype.getAllChildNodes = function () {
        return this.xmlDoc.documentElement === undefined ? undefined : this.xmlDoc.documentElement.childNodes;
    };
    /**
     * Method which retrieves an attribute value from the XML
     * @param attributeName
     */
    XmlHelper.prototype.getAttributeValueByName = function (attributeName) {
        if (this.xmlDoc !== undefined
            && this.xmlDoc.firstChild !== undefined
            && this.xmlDoc.firstChild.attributes !== undefined
            && this.xmlDoc.firstChild.attributes.getNamedItem(attributeName) !== undefined) {
            return this.xmlDoc.firstChild.attributes.getNamedItem(attributeName).value;
        }
    };
    return XmlHelper;
}());
module.exports = XmlHelper;
//# sourceMappingURL=xmlhelper.js.map