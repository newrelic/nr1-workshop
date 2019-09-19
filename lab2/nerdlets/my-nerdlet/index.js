import React from 'react';
import { TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart, Button, navigation, nerdlet, PlatformStateContext, NerdletStateContext  } from 'nr1';

export default class Lab2Nerdlet extends React.Component {

    constructor(props) {
        super(props);
        this.accountId = 1606862; //New Relic Demotron.
        this.state = {
            entityGuid: null,
            appName: null
        };
        console.debug("Nerdlet constructor", this); //eslint-disable-line
    }

    setApplication(inAppId, inAppName) {
        this.setState({ entityGuid: inAppId, appName: inAppName })
    }

    render(){
        const { entityGuid, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, entityGuid limit 25`;
        const trxOverT = `SELECT count(*) as 'transactions' FROM Transaction facet appName, appId limit 25 TIMESERIES`;
        const tCountNrql = `SELECT count(*) FROM Transaction WHERE entityGuid = '${entityGuid}' TIMESERIES`;
        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE entityGuid = '${entityGuid}' TIMESERIES`;

        //return the JSX we're rendering
        return (<ChartGroup>
            <Stack
                verticalType={Stack.VERTICAL_TYPE.FILL}
                directionType={Stack.DIRECTION_TYPE.VERTICAL}
                gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                <StackItem>
                    <Stack
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                        <StackItem>
                            <TableChart query={nrql} accountId={this.accountId} className="chart" onClickTable={(dataEl, row, chart) => {
                            //for learning purposes, we'll write to the console.
                            console.debug([dataEl, row, chart]) //eslint-disable-line
                            this.setApplication(row.entityGuid, row.appName)
                        }}/>
                        </StackItem>
                        <StackItem>
                            <LineChart
                                query={trxOverT}
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
                {entityGuid  && <StackItem>
                    <Stack
                        directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                        <StackItem>
                            <h2>Transaction counts for {appName}</h2>
                            <LineChart accountId={this.accountId} query={tCountNrql} className="chart"/>
                        </StackItem>
                        <StackItem>
                            <h2>Apdex for {appName}</h2>
                            <ScatterChart accountId={this.accountId} query={apdexNrql} className="chart"/>
                        </StackItem>
                    </Stack>
                </StackItem>}
                </Stack>
            </ChartGroup>);
    }
}