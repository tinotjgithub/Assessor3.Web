import React = require('react');
import enums = require('../enums');

/* tslint:disable:variable-name */
const SortArrow = (props: { sortOption: enums.SortOption }) => {
    switch (props.sortOption) {
        case enums.SortOption.Up:
            return (< span className='sort-arrow' >
                <span className='sort-arrow-up'></span>
            </span >);
        case enums.SortOption.Down:
            return (< span className='sort-arrow' >
                < span className='sort-arrow-down' ></span >
            </span >);
        default: // enums.SortOption.both or undefined
            return (< span className='sort-arrow' >
                <span className='sort-arrow-up'></span>
                < span className='sort-arrow-down' ></span >
            </span >);
    }
};

export = SortArrow;