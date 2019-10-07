import React from 'react';

export default class MyNerdlet extends React.Component {

    render() {
        return <div className="centered">
            <h1>Congratulations</h1>
            <p>You've successfully completed the setup exercise. Now let's build some <a href="https://github.com/newrelic/nr1-workshop/blob/master/README.md">Nerdlets</a>!</p>
        </div>;
    }
}
