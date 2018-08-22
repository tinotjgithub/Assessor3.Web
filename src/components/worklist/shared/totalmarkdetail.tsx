/* tslint:disable:no-unused-variable */
import React = require('react');
import totalMark = require('./totalmark');

/**
 * React component
 * @param {Props} props
 */
class TotalMarkDetail extends totalMark {

	/**
	 * Constructor for TotalMarkTile
	 * @param props
	 * @param state
	 */
	constructor(props: any, state: any) {
		super(props);
	}

    /**
     * Render component
     */
    public render(): JSX.Element {
        return (this.getTotalMarkOutput());
    }
}

export = TotalMarkDetail;
