import React from 'react';
import PropTypes from 'prop-types';
import { TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart, Button, navigation, nerdlet } from 'nr1';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        launcherUrlState: PropTypes.object,
        nerdletUrlState: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.accountId = 1606862; //New Relic Demotron.
        this.state = {
            entityGuid: this.props.nerdletUrlState.entityGuid,
            appName: this.props.nerdletUrlState.appName
        };
        console.debug("Nerdlet props", this.props); //eslint-disable-line
        this.openEntity = this.openEntity.bind(this);
    }

    componentWillUpdate(props) {
        if (this.props && props && this.state.entityGuid != props.nerdletUrlState.entityGuid) {
            console.debug("New props", props); //eslint-disable-line
            const { entityGuid, appName } = props.nerdletUrlState;
            this.setState({ entityGuid, appName });
        }
    }

    setApplication(entityGuid, appName) {
        this.setState({ entityGuid, appName })
    }

    openEntity() {
        const { entityGuid } = this.state;
        navigation.openEntity({
            id: entityGuid,
            type: 'APPLICATION',
            domain: 'APM'
        });
        nerdlet.setUrlState(this.state);
    }

    render(){
        const { duration } = this.props.launcherUrlState.timeRange;
        const since = ` SINCE ${duration/1000/60} SECONDS AGO `;
        const { entityGuid, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, entityGuid limit 25`;
        const tCountNrql = `SELECT count(*) FROM Transaction WHERE entityGuid = ${entityGuid} TIMESERIES`;
        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE entityGuid = ${entityGuid} TIMESERIES`;
        const trxOverTime = `SELECT count(*) as 'transactions' FROM Transaction facet appName, entityGuid limit 25 TIMESERIES`;
        //return the JSX we're rendering
        return (
            <ChartGroup>
                <Stack
                    alignmentType={Stack.ALIGNMENT_TYPE.FILL}
                    directionType={Stack.DIRECTION_TYPE.VERTICAL}
                    distributionType={Stack.DISTRIBUTION_TYPE.FILL_EVENLY}
                    gapType={Stack.GAP_TYPE.TIGHT}>
                    <StackItem>
                        <h1>Reviewing Transactions in account {this.accountId}</h1>
                    </StackItem>
                    <StackItem>
                        <Stack
                            alignmentType={Stack.ALIGNMENT_TYPE.FILL}
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                            distributionType={Stack.DISTRIBUTION_TYPE.FILL_EVENLY}
                            gapType={Stack.GAP_TYPE.TIGHT}>
                            <StackItem>
                                <TableChart query={nrql+since} accountId={this.accountId} className="chart" onClickTable={(dataEl, row, chart) => {
                                    //for learning purposes, we'll write to the console.
                                    console.debug([dataEl, row, chart]) //eslint-disable-line
                                    this.setApplication(row.entityGuid, row.appName)
                                }}/>
                            </StackItem>
                            <StackItem>
                                <LineChart
                                    query={trxOverTime+since}
                                    className="chart"
                                    accountId={this.accountId}
                                    onClickLine={(line) => {
                                        //more console logging for learning purposes
                                        console.debug(line); //eslint-disable=line
                                        const params = line.metadata.label.split(",");
                                        this.setApplication(params[1], params[0]);
                                    }}
                                />
                            </StackItem>
                        </Stack>
                    </StackItem>
                    {entityGuid && <StackItem>
                        <Button onClick={this.openEntity}>Open {appName}</Button>
                    </StackItem>}
                    {entityGuid && <StackItem>
                        <Stack
                            alignmentType={Stack.ALIGNMENT_TYPE.FILL}
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                            distributionType={Stack.DISTRIBUTION_TYPE.FILL_EVENLY}
                            gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                            <StackItem>
                                <h2>Transaction counts for {appName}</h2>
                                <LineChart accountId={this.accountId} query={tCountNrql+since} className="chart"/>
                            </StackItem>
                            <StackItem>
                                <h2>Apdex for {appName}</h2>
                                <ScatterChart accountId={this.accountId} query={apdexNrql+since} className="chart"/>
                            </StackItem>
                        </Stack>
                    </StackItem>}
                </Stack>
            </ChartGroup>
        )
    }
}