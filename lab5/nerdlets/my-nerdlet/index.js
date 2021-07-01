import React, { Fragment } from 'react';
import { NerdGraphQuery, EntityByGuidQuery, EntitiesByNameQuery, EntitiesByDomainTypeQuery, EntityCountQuery, Spinner, Stack, StackItem, HeadingText, BlockText, NerdletStateContext } from 'nr1';

export default class MyNerdlet extends React.Component {

    constructor(props) {
        super(props);
        console.debug(props); //eslint-disable-line
        this.state = {
            entityName: "Portal"
        };
    }

    render() {
        return (
            <NerdGraphQuery query={`{actor {user {name email}}}`}>
                {({ loading, error, data }) => {
                    console.debug([loading, data, error]); //eslint-disable-line
                    return null
                }}
            </NerdGraphQuery>
        )
    }

}
