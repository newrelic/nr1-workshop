import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, TableChart, Grid, GridItem, Spinner, DisplayText, Button, Icon } from 'nr1';
import { loadEntity, decodeEntityFromEntityId, distanceOfTimeInWords } from './utils';
import AddEntityDialog from './add-entity-dialog';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number.isRequired,
        launcherUrlState: PropTypes.object.isRequired,
        nerdletUrlState: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        //console for learning purposes
        console.debug(props); //eslint-disable-line
        //initiate the state
        this.state = {
            entities: [],
            entityType: { domain: 'APM', type: 'APPLICATION'},
            openDialog: false
        }
        this.onSearchSelect = this.onSearchSelect.bind(this);
    }

    componentDidMount() {
        if (this.props.nerdletUrlState && this.props.nerdletUrlState.entityId) {
            loadEntity(this.props.nerdletUrlState.entityId).then(entity => {
                this.setState({ entityType: {domain: entity.domain, type: entity.type}, entities: [ entity ]});
            });
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props && nextProps.nerdletUrlState && nextProps.nerdletUrlState.entityId != this.props.nerdletUrlState.entityId) {
            loadEntity(this.props.nerdletUrlState.entityId).then(entity => {
                this.setState({ entityType: {domain: entity.domain, type: entity.type}, entities: [ entity ]});
            });
        }
        return true;
    }

    /**
     * Receive an entity from the EntitySearch
     * @param {Object} entity
     */
    onSearchSelect(entity) {
        const { entities } = this.state;
        entities.push(entity);
        this.setState({ entities });
    }

    _buildNrql(base) {
        const { entities } = this.state;
        const appNames = entities ? entities.map((entity, i) => `'${entity.name}'`) : null;
        let nrql = `${base} FACET appName ${appNames ? `WHERE appName in (${appNames.join(",")}) ` : ''}`;
        return nrql;
    }

    render() {
        const { height, launcherUrlState, nerdletUrlState } = this.props;
        if (!nerdletUrlState || !nerdletUrlState.entityId) {
            return <AddEntityDialog
                     onSearchSelect={this.onSearchSelect}
                   />;
        } else {
            //entityId is four-item array of accountId|domain|type|id
            const { entities, openDialog } = this.state;
            const entity = decodeEntityFromEntityId(nerdletUrlState.entityId);
            const { accountId } = entity;
            const eventType = entity ? entity.domain == 'BROWSER' ? 'PageView' : 'Transaction' : null;
            const { timeRange : { duration }} = launcherUrlState;
            const durationInMinutes = duration / 1000 / 60;
            const label = entity.domain == 'BROWSER' ? 'Browser Apps' : 'APM Services';
            return (<React.Fragment><Grid>
                    {entities && entities.length > 0 ? <React.Fragment><GridItem columnStart={1} columnEnd={12} style={{padding: '10px'}}>
                        <DisplayText>Performance over Time<Button sizeType={Button.SIZE_TYPE.SLIM} style={{marginLeft: '25px'}} onClick={() => { this.setState({ openDialog: true }) }}><Icon name="interface_sign_plus" /> {label}</Button></DisplayText>
                        <p style={{marginBottom: '10px'}}>{distanceOfTimeInWords(duration)}</p>
                        <LineChart
                            accountId={accountId}
                            query={this._buildNrql(`SELECT average(duration) from ${eventType} TIMESERIES SINCE ${durationInMinutes} MINUTES AGO `)}
                            style={{height: `${height*.5}px`}}
                        />
                    </GridItem>
                    <GridItem columnStart={1} columnEnd={12}>
                        <TableChart
                            accountId={accountId}
                            query={this._buildNrql(`SELECT count(*) as 'requests', percentile(duration, 99, 90, 50) FROM ${eventType} SINCE ${durationInMinutes} MINUTES AGO`)}
                            style={{height: `${height*.5}px`}}
                        />
                    </GridItem>
                    </React.Fragment> : <Spinner className="centered" />}
                    {openDialog && <AddEntityDialog
                        openDialog={openDialog}
                        entities={entities}
                        onSearchSelect={this.onSearchSelect}
                    />}
                </Grid>
            </React.Fragment>);
        }

    }
}