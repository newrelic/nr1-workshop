import React from 'react';
import { Dropdown, DropdownItem, Spinner, Stack, StackItem, BillboardChart, PieChart, NerdGraphQuery, PlatformStateContext } from 'nr1';

export default class MyNerdlet extends React.Component {

    constructor(props) {
        super(props)
        console.debug(props) // eslint-disable-line
        this.state = {
            accounts: null,
            selectedAccount: null
        }
    }

    /**
     * Build the array of NRQL statements based on the duration from the Time Picker.
     */
    nrqlChartData(platformUrlState) {
        const { duration } = platformUrlState.timeRange;
        const durationInMinutes = duration/1000/60;
        return [
            {
                title: 'Total Transactions',
                nrql: `SELECT count(*) from Transaction SINCE ${durationInMinutes} MINUTES AGO`
            },
            {
                title: 'JavaScript Errors',
                nrql: `SELECT count(*) FROM JavaScriptError SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes*2} MINUTES AGO`
            },
            {
                title: 'Mobile Users OS/Platform',
                nrql: `FROM MobileSession SELECT uniqueCount(uuid) FACET osName, osVersion SINCE ${durationInMinutes} MINUTES AGO`,
                chartType: 'pie'
            },
            {
                title: 'Infrastructure Count',
                nrql: `SELECT uniqueCount(entityGuid) as 'Host Count' from SystemSample SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes*2} MINUTES AGO`
            }
        ];
    }

    render() {
        const { accounts, selectedAccount } = this.state;

        //
        // Insert filtering logic here
        //

        if (accounts) {
            return <PlatformStateContext.Consumer>
                {(platformUrlState) => {
                    return <Stack
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}>
                        {selectedAccount &&
                            <StackItem>
                                <Stack
                                    horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                                    directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                                    {this.nrqlChartData(platformUrlState).map((d, i) => <StackItem key={i} shrink={true}>
                                        <h2>{d.title}</h2>
                                        {d.chartType == 'pie' ? <PieChart
                                            accountId={selectedAccount.id}
                                            query={d.nrql}
                                            className="chart"
                                        /> : <BillboardChart
                                            accountId={selectedAccount.id}
                                            query={d.nrql}
                                            className="chart"
                                        />}
                                    </StackItem>)}
                                </Stack>
                            </StackItem>
                        }
                    </Stack>
                }}
            </PlatformStateContext.Consumer>
        } else {
            return <Spinner/>
        }
    }
}
