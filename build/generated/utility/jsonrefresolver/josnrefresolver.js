"use strict";
/**
 * Class for resolving json ref
 */
var JosnRefResolver = (function () {
    function JosnRefResolver() {
    }
    /**
     * returns the resolved json.
     * @param object Json for resolving the refs
     */
    JosnRefResolver.resolveRefs = function (object) {
        var catalog = [];
        JosnRefResolver.mapObject(object, catalog);
        JosnRefResolver.resolveReferences(object, catalog);
        return object;
    };
    /**
     * Json for resolving the refs
     * @private
     * @static
     * @param {*} obj
     * @param {*} catalog
     * @memberof JosnRefResolver
     */
    JosnRefResolver.mapObject = function (obj, catalog) {
        var i;
        if (obj && typeof obj === 'object') {
            var id = obj.$id;
            if (typeof id === 'string') {
                catalog[id] = obj;
            }
            if (Object.prototype.toString.apply(obj) === '[object Array]') {
                for (i = 0; i < obj.length; i += 1) {
                    JosnRefResolver.mapObject(obj[i], catalog);
                }
            }
            else {
                for (var name_1 in obj) {
                    if (typeof obj[name_1] === 'object') {
                        JosnRefResolver.mapObject(obj[name_1], catalog);
                    }
                }
            }
        }
    };
    /**
     * Json for resolving the refs
     *
     * @private
     * @static
     * @param {*} obj
     * @param {*} catalog
     * @memberof JosnRefResolver
     */
    JosnRefResolver.resolveReferences = function (obj, catalog) {
        var i;
        var item;
        var name;
        var id;
        if (obj && typeof obj === 'object') {
            if (Object.prototype.toString.apply(obj) === '[object Array]') {
                for (i = 0; i < obj.length; i += 1) {
                    item = obj[i];
                    if (item && typeof item === 'object') {
                        id = item.$ref;
                        if (typeof id === 'string') {
                            obj[i] = catalog[id];
                        }
                        else {
                            JosnRefResolver.resolveReferences(item, catalog);
                        }
                    }
                }
            }
            else {
                for (name in obj) {
                    if (typeof obj[name] === 'object') {
                        item = obj[name];
                        if (item) {
                            id = item.$ref;
                            if (typeof id === 'string') {
                                obj[name] = catalog[id];
                            }
                            else {
                                JosnRefResolver.resolveReferences(item, catalog);
                            }
                        }
                    }
                }
            }
        }
    };
    return JosnRefResolver;
}());
module.exports = JosnRefResolver;
//# sourceMappingURL=josnrefresolver.js.map