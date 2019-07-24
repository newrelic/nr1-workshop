import React from 'react';
import PropTypes from 'prop-types';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    render() {
        return <div>
            <h1>Lab 3: Grids, Stacks, and UI components</h1>
        </div>
    }
}
