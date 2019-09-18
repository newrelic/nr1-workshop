import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, TableChart, Grid, GridItem, HeadingText, Button, Icon } from 'nr1';
import { distanceOfTimeInWords } from './utils';
import AddEntityModal from './add-entity-modal';

export default class MyNerdlet extends React.Component {

    static propTypes = {
        nerdletUrlState: PropTypes.object.isRequired,
        launcherUrlState: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        entity: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        //console for learning purposes
        console.debug(props); //eslint-disable-line
        //initiate the state
        this.state = {
            entities: [],
            openModal: false
        }
        this.onSearchSelect = this.onSearchSelect.bind(this);
    }

    /**
     * Receive an entity from the EntitySearch
     * @param {Object} entity
     */
    onSearchSelect(inEntity) {
        const { entities } = this.state;
        entities.push(inEntity);
        this.setState({ entities });
    }

    _buildNrql(base, entities) {
        const appNames = entities ? entities.map((entity, i) => `'${entity.name}'`) : null;
        let nrql = `${base} FACET appName ${appNames ? `WHERE appName in (${appNames.join(",")}) ` : ''}`;
        return nrql;
    }

    render() {
        const { entities, openModal } = this.state;
        const { entity, launcherUrlState: { timeRange: { duration }}, width, height } = this.props;
        entities.push(entity);
        const { accountId } = entity;
        const eventType = entity ? entity.domain == 'BROWSER' ? 'PageView' :    'Transaction' : null;
        const label = entity.domain == 'BROWSER' ? 'Browser Apps' : 'APM Services';
        const durationInMinutes =  duration/1000/60;
        return (<React.Fragment>
            <Grid style={{width:width}}>
                <GridItem columnStart={1} columnEnd={12} style={{padding: '10px'}}>
                <HeadingText>Performance over Time<Button sizeType={Button.SIZE_TYPE.SMALL} style={{marginLeft: '25px'}} onClick={() => { this.setState({ openModal: true }) }}><Icon type={Icon.TYPE.INTERFACE__SIGN__PLUS} /> {label}</Button></HeadingText>
                <p style={{marginBottom: '10px'}}>{distanceOfTimeInWords(duration)}</p>
                <LineChart
                    accountId={accountId}
                    query={this._buildNrql(`SELECT average(duration) from ${eventType} TIMESERIES SINCE ${durationInMinutes} MINUTES AGO `, entities)}
                    style={{height: `${height*.5}px`, width: width}}
                />
                </GridItem>
                <GridItem columnStart={1} columnEnd={12}>
                    <TableChart
                        accountId={accountId}
                        query={this._buildNrql(`SELECT count(*) as 'requests', percentile(duration, 99, 90, 50) FROM ${eventType} SINCE ${durationInMinutes} MINUTES AGO`, entities)}
                        style={{height: `${height*.5}px`, width: width}}
                    />
                </GridItem>
            </Grid>
            {openModal && <AddEntityModal
                {...this.state}
                entity={entity}
                entityType={{ type: entity.type, domain: entity.domain }}
                onClose={() => {
                    this.setState({ openModal: false });
                }}
                onSearchSelect={this.onSearchSelect}
            />}
        </React.Fragment>);
    }
}