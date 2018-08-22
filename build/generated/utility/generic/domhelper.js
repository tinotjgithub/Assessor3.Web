"use strict";
/**
 * helper class with utilty methods for dom related operations - No Dom manipulations
 */
var DomHelper = (function () {
    function DomHelper() {
    }
    /**
     * returns the html element after searching the parent hierarchy in dom.
     * @param el - input element to start the search.
     * @param fn - function to match and find the parent node.
     */
    DomHelper.searchParentNode = function (el, fn) {
        while (el) {
            if (fn(el)) {
                return el;
            }
            el = el.parentNode;
        }
    };
    /**
     * find method for Immutable list is not working IE
     * @param iterator - immutable list.
     * @param fn - function for setting the item.
     */
    DomHelper.find = function (iterator, fn) {
        if (iterator.find !== undefined) {
            iterator.find(fn);
        }
        else {
            iterator.map(fn);
        }
    };
    /**
     * Returns full url
     * @param {string} base-Url
     * @param {string} parameter-index to be extracted from the base-url
     * @returns
     */
    DomHelper.getQueryStringByIndex = function (url, index) {
        var value = undefined;
        var splittedUrl = url.split('?');
        var queryString = splittedUrl.length > 1 ? splittedUrl[1].toString().split('&') : undefined;
        if (queryString) {
            var valuePair = queryString[index].toString().split('=');
            value = valuePair.length > 1 ? valuePair[1].toString() : undefined;
        }
        return value;
    };
    return DomHelper;
}());
module.exports = DomHelper;
//# sourceMappingURL=domhelper.js.map