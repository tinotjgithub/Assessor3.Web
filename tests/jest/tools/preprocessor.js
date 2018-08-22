var ts = require('ntypescript');

module.exports = {
    process: function (src, path) {

        if (path.match(/\.(ts|tsx)$/) && !path.match(/\.d\.ts$/)) {

            return ts.transpile(src, { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS,
             });
        }

        return src;
    },
};