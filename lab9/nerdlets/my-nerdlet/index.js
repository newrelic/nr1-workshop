import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, TableChart, Grid, GridItem, Spinner, HeadingText, Button, Icon, UserStorageQuery, Toast } from 'nr1';
import { loadEntity, decodeEntityFromEntityGuid, distanceOfTimeInWords } from './utils';
import AddEntityModal from './add-entity-modal';

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
            entity: null,
            entities: [],
            entityType: { domain: 'APM', type: 'APPLICATION'},
            openModal: false,
            addToast: false,
            errorToast: false
        }
        this.onSearchSelect = this.onSearchSelect.bind(this);
    }

    componentDidMount() {
        if (this.props.nerdletUrlState && this.props.nerdletUrlState.entityGuid) {
            console.debug("Calling loadState with props");
            this._loadState(this.props.nerdletUrlState.entityGuid);
        }
    }

    componentWillUpdate(nextProps) {
        if (this.props && nextProps.nerdletUrlState && nextProps.nerdletUrlState.entityGuid && nextProps.nerdletUrlState.entityGuid != this.props.nerdletUrlState.entityGuid) {
            console.debug("Calling loadState with nextProps");
            this._loadState(nextProps.nerdletUrlState.entityGuid);
        }
        return true;
    }

    /**
     * Load the entity using the loadEntity utils function, then look up if there's a entityList-v0 collection for this entity and user.
     * @param {string} entityGuid
     */
    _loadState(entityGuid) {
        loadEntity(entityGuid).then(entity => {
            UserStorageQuery.query({
                collection: 'entityList-v0',
                documentId: entity.id
            }).then(({data}) => {
                if (data.actor.nerdStorageDocument) {
                    const entities = JSON.parse(data.actor.nerdStorageDocument);
                    this.setState({ entityType: {domain: entity.domain, type: entity.type}, entity, entities });
                } else {
                    this.setState({ entityType: {domain: entity.domain, type: entity.type}, entity, entities: [ entity ] });
                }
            }).catch(error => {
                console.error(error);
                this.setState({ entityType: {domain: entity.domain, type: entity.type}, entity, entities: [ entity ], errorToast: true });
            });
        });
    }

    /**
     * Receive an entity from the EntitySearch
     * @param {Object} entity
     */
    onSearchSelect(entity) {
        const { entities } = this.state;
        entities.push(entity);
        //after the state is saved (technically asynchronously), we're going to save the list of entities to NerdStorage
        this.setState({ entities }, () => {
            const { entity, entities } = this.state;
            UserStorageQuery.mutate({
                action: UserStorageQuery.ACTION_TYPE.WRITE_DOCUMENT,
                collection: 'entityList-v0',
                documentId: entity.id,
                document: entities.map(entity => {
                    //shrink the amount of data we're storing b/c we like efficiency.
                    return {
                        id: entity.id,
                        type: entity.type,
                        domain: entity.domain,
                        accountId: entity.accountId,
                        name: entity.name
                    }
                })
            }).then(() => {
                this.setState({ addToast: true });
            });
        });
    }

    _buildNrql(base) {
        const { entities } = this.state;
        const appNames = entities ? entities.map((entity, i) => `'${entity.name}'`) : null;
        let nrql = `${base} FACET appName ${appNames ? `WHERE appName in (${appNames.join(",")}) ` : ''}`;
        return nrql;
    }

    render() {
        const { height, launcherUrlState, nerdletUrlState } = this.props;
        if (!nerdletUrlState || !nerdletUrlState.entityGuid) {
            return <AddEntityModal
                     onSearchSelect={this.onSearchSelect}
                   />;
        } else {
            //entityGuid is four-item array of accountId|domain|type|id
            const { entities, openModal } = this.state;
            const entity = decodeEntityFromEntityGuid(nerdletUrlState.entityGuid);
            const { accountId } = entity;
            const eventType = entity ? entity.domain == 'BROWSER' ? 'PageView' : 'Transaction' : null;
            const { timeRange : { duration }} = launcherUrlState;
            const durationInMinutes = duration / 1000 / 60;
            const label = entity.domain == 'BROWSER' ? 'Browser Apps' : 'APM Services';
            if (this.state.addToast) {
                Toast.showToast({
                    type: 'normal',
                    title: 'Configs saved successfully.',
                    onDestroy: () => {this.setState({addToast: false}); }
                });
            }
            if (this.state.errorToast) {
                Toast.showToast({
                    type: 'critical',
                    title: 'An error occurred loading configs.',
                    onDestroy: () => {this.setState({errorToast: false}); }
                });
            }
            return (<React.Fragment><Grid>
                    {entities && entities.length > 0 ? <React.Fragment><GridItem columnStart={1} columnEnd={12} style={{padding: '10px'}}>
                        <HeadingText>Performance over Time<Button sizeType={Button.SIZE_TYPE.SLIM} style={{marginLeft: '25px'}} onClick={() => { this.setState({ openModal: true }) }}><Icon name="interface_sign_plus" /> {label}</Button></HeadingText>
                        <p style={{marginBottom: '10px'}}>{distanceOfTimeInWords(duration)}</p>
                        {this.state.addToast && <Toast
                            type={'normal'}
                            title={'Configs saved successfully'}
                            description={''}
                            onDestroy={() => {this.setState({addToast: false})}}
                        />}
                        {this.state.errorToast && <Toast
                            type={'critical'}
                            title={'An error occurred loading configs.'}
                            description={''}
                            onDestroy={() => {this.setState({errorToast: false})}}
                        />}
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
                    </React.Fragment> : <Spinner fillContainer />}
                    {openModal && <AddEntityModal
                        openModal={openModal}
                        entities={entities}
                        onClose={() => {
                            this.setState({ openModal: false });
                        }}
                        onSearchSelect={this.onSearchSelect}
                    />}
                </Grid>
            </React.Fragment>);
        }
    }
}