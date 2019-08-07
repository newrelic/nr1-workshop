import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import get from 'lodash.get';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    constructor(props){
        super(props)
        this.state = {
            entityName: "Portal",
            hideModal: true,
            showToast: false,
        }
        this.accountId = 1606862; //New Relic Demotron.
    }

    render() {
        return <h1>Welcome to lab5</h1>
 }
}