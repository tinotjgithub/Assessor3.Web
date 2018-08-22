/*tslint:disable:no-unused-expression*/
import React = require('react');
import pureRenderComponent = require('../../base/purerendercomponent');

/**
 * Properties of a component
 */
interface Props {
    size: number;
    startDegree: number;
    endDegree: number;
    trackWidth: number;
    trackStyle: string;
    progress: Array<any>;
}

class CircularProgressIndicator extends pureRenderComponent<Props, any> {

    /**
     * This method will return the coordinates for progress path.
     * @param r : radius
     * @param degree : degree
     */
    private getPoint(r: any, degree: any): any {
        let size = this.props.size;
        let d = degree / 180 * Math.PI;

        return {
            x: r * Math.sin(d) + size / 2,
            y: this.props.trackWidth / 2 + r * (1 - Math.cos(d))
        };
    }

    /**
     * Render method for the Progress indicator.
     */
    public render() {

        let progressComponents: Array<any> = Array<any>();
        let progressPaths: Array<any> = Array<any>();

        let prevProgress: number = 0;
        let size: number = this.props.size;
        let r: number = size / 2 - this.props.trackWidth / 2;

        this.props.progress.map((item: any) => {

            let progress: number = item.progress + prevProgress;
            let endDegree: number = progress * 360 / 100;
            let s = this.getPoint(r, this.props.startDegree);
            let e = this.getPoint(r, endDegree);
            let progressPath: string = null;

            if (progress < 50) {
                progressPath = 'M ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ', 0, 0, 1, ' + e.x + ',' + e.y;
            } else {
                let m = this.getPoint(r, this.props.startDegree + 180);
                progressPath = 'M ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ', 0, 0, 1, ' + m.x + ',' + m.y + '\n        M ' + m.x + ' '
                               + m.y + ' A ' + r + ' ' + r + ', 0, 0, 1, ' + e.x + ',' + e.y;
            }

            // set the previous progress for next item
            prevProgress = progress;
            progressPaths.push({ progress: progress, progressPath: progressPath, style: item.className });
        });

        // This will create progress path components.
        // Currently IE is not supporting SVG animations so that we implemented a different logic for IE
        progressPaths.map((progressPathItem: any, i: any) => {
            let circumference: number = Math.round(2 * Math.PI * r);
            let style = { strokeLinecap: 'round' };

            if (progressPathItem.progress > 0) {
                progressComponents.push(React.createElement('path', {
                    d: progressPathItem.progressPath, className: progressPathItem.style + ' path',
                    key: 'path_' + i,
                    style: style
                }));
            }
        });

        return (
                 <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} className = 'target-svg'>
                   <circle cx={size / 2} cy={size / 2} r={r} className={this.props.trackStyle}></circle>
                   {progressComponents.reverse() }
                 </svg>
              );
    }
}

export = CircularProgressIndicator;
