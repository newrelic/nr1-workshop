import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object.isRequired
    };

    constructor(props){
        super(props);
        console.debug(props); //eslint-disable-line
        this.state = {
            entityName: "Portal"
        };
    }

    render() {
        return (<h1>Hello World lab5!</h1>);
    }
}