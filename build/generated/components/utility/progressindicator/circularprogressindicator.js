"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*tslint:disable:no-unused-expression*/
var React = require('react');
var pureRenderComponent = require('../../base/purerendercomponent');
var CircularProgressIndicator = (function (_super) {
    __extends(CircularProgressIndicator, _super);
    function CircularProgressIndicator() {
        _super.apply(this, arguments);
    }
    /**
     * This method will return the coordinates for progress path.
     * @param r : radius
     * @param degree : degree
     */
    CircularProgressIndicator.prototype.getPoint = function (r, degree) {
        var size = this.props.size;
        var d = degree / 180 * Math.PI;
        return {
            x: r * Math.sin(d) + size / 2,
            y: this.props.trackWidth / 2 + r * (1 - Math.cos(d))
        };
    };
    /**
     * Render method for the Progress indicator.
     */
    CircularProgressIndicator.prototype.render = function () {
        var _this = this;
        var progressComponents = Array();
        var progressPaths = Array();
        var prevProgress = 0;
        var size = this.props.size;
        var r = size / 2 - this.props.trackWidth / 2;
        this.props.progress.map(function (item) {
            var progress = item.progress + prevProgress;
            var endDegree = progress * 360 / 100;
            var s = _this.getPoint(r, _this.props.startDegree);
            var e = _this.getPoint(r, endDegree);
            var progressPath = null;
            if (progress < 50) {
                progressPath = 'M ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ', 0, 0, 1, ' + e.x + ',' + e.y;
            }
            else {
                var m = _this.getPoint(r, _this.props.startDegree + 180);
                progressPath = 'M ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ', 0, 0, 1, ' + m.x + ',' + m.y + '\n        M ' + m.x + ' '
                    + m.y + ' A ' + r + ' ' + r + ', 0, 0, 1, ' + e.x + ',' + e.y;
            }
            // set the previous progress for next item
            prevProgress = progress;
            progressPaths.push({ progress: progress, progressPath: progressPath, style: item.className });
        });
        // This will create progress path components.
        // Currently IE is not supporting SVG animations so that we implemented a different logic for IE
        progressPaths.map(function (progressPathItem, i) {
            var circumference = Math.round(2 * Math.PI * r);
            var style = { strokeLinecap: 'round' };
            if (progressPathItem.progress > 0) {
                progressComponents.push(React.createElement('path', {
                    d: progressPathItem.progressPath, className: progressPathItem.style + ' path',
                    key: 'path_' + i,
                    style: style
                }));
            }
        });
        return (React.createElement("svg", {width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, className: 'target-svg'}, React.createElement("circle", {cx: size / 2, cy: size / 2, r: r, className: this.props.trackStyle}), progressComponents.reverse()));
    };
    return CircularProgressIndicator;
}(pureRenderComponent));
module.exports = CircularProgressIndicator;
//# sourceMappingURL=circularprogressindicator.js.map