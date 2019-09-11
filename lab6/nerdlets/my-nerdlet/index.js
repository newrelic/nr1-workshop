import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, Spinner, Stack, StackItem, BillboardChart, PieChart, NerdGraphQuery } from 'nr1';

export default class MyNerdlet extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        launcherUrlState: PropTypes.object
    };

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
    nrqlChartData() {
        const { duration } = this.props.launcherUrlState.timeRange;
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
            return <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL}>
                {selectedAccount &&
                    <StackItem>
                        <div>We're going to replace this with our <Dropdown></Dropdown> component</div>
                    </StackItem>
                }
                {selectedAccount &&
                    <StackItem>
                        <Stack
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                            {this.nrqlChartData().map((d, i) => <StackItem key={i} shrink={true}>
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
        } else {
            return <Spinner fillContainer />
        }
    }
}
