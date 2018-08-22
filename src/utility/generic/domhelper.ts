/**
 * helper class with utilty methods for dom related operations - No Dom manipulations
 */
class DomHelper {

    /**
     * returns the html element after searching the parent hierarchy in dom.
     * @param el - input element to start the search.
     * @param fn - function to match and find the parent node.
     */
    public static searchParentNode(el: any, fn: any): any {
        while (el) {
            if (fn(el)) {
                return el;
            }

            el = el.parentNode;
        }
    }

    /**
     * find method for Immutable list is not working IE
     * @param iterator - immutable list.
     * @param fn - function for setting the item.
     */
    public static find(iterator: any, fn: any): any {

        if (iterator.find !== undefined) {
            iterator.find(fn);
        } else {
            iterator.map(fn);
        }
    }

    /**
     * Returns full url
     * @param {string} base-Url
     * @param {number} parameter-index to be extracted from the base-url
     * @param {number} parameter-value index to be extracted from the base-url
     * @returns
     */
    public static getQueryStringByIndex(url: string, index: number, valueIndex: number): string {
        var value: string = undefined;
        var splittedUrl = url.split('?');
        var queryString = splittedUrl.length > 1 ?
            splittedUrl[valueIndex] ? splittedUrl[valueIndex].toString().split('&') : undefined : undefined;
        if (queryString) {
            var valuePair = queryString[index].toString().split('=');
            value = valuePair.length > 1 ? valuePair[1].toString() : undefined;
        }
        return value;
    }
}

export = DomHelper;