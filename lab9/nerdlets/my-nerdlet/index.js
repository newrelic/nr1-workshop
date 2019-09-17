import React from 'react';
import { LineChart, TableChart, Grid, GridItem, Spinner, HeadingText, Button, Icon, EntityByGuidQuery, PlatformStateContext, NerdletStateContext, AutoSizer } from 'nr1';
import { distanceOfTimeInWords } from './utils';
import AddEntityModal from './add-entity-modal';

export default class MyNerdlet extends React.Component {

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
        return <PlatformStateContext.Consumer>
        {(platformUrlState) => (
          <NerdletStateContext.Consumer>
            {(nerdletUrlState) => {
                if (!nerdletUrlState || !nerdletUrlState.entityGuid) {
                    return <HeadingText>Go find a Service or Browser App to compare</HeadingText>
                }
                return <AutoSizer>
                {({height, width}) => (<EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                    {({data, loading, error}) => {
                        console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                        if (loading) {
                            return <Spinner fillContainer />;
                        }
                        if (error) {
                            return <BlockText>{error.message}</BlockText>
                        }
                        const { entities, openModal } = this.state;
                        const entity = data.entities[0];
                        if (entities.length > 0) {
                            entities.push(entity);
                        }
                        const { accountId } = entity;
                        const eventType = entity ? entity.domain == 'BROWSER' ? 'PageView' : 'Transaction' : null;
                        const label = entity.domain == 'BROWSER' ? 'Browser Apps' : 'APM Services';
                        const { duration } = platformUrlState.timeRange;
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
                                onClose={() => {
                                    this.setState({ openModal: false });
                                }}
                                onSearchSelect={this.onSearchSelect}
                            />}
                        </React.Fragment>);
                    }}
                    </EntityByGuidQuery>
                )}
                </AutoSizer>
          }}
          </NerdletStateContext.Consumer>
        )}
        </PlatformStateContext.Consumer>
    }
}