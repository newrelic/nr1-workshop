import React from 'react';
import PropTypes from 'prop-types';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    render() {
        return <div className="centered">
            <h1>Congratulations</h1>
            <p>You've successfully completed the setup exercise. Now let's build some <a href="https://github.com/newrelic/nr1-workshop/blob/master/README.md">Nerdlets</a>!</p>
        </div>;
    }
}
