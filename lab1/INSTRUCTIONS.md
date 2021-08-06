# Lab 1: Chart components

The New Relic One SDK's Chart components allow you to easily add data visualizations to your New Relic One Nerdpack. The components take care of everything: from fetching data to plotting, but they can also receive data externally to support custom data sets. You can interact with the Chart components in a custom Nerdlet. In this lab, you're going to create a Nerdlet that displays data from a custom NRQL query using the Chart components. 

## Set up your environment

Before you begin with the lab, [set up your environment](../SETUP.md). 

Be sure that you've set the appropriate `nr1 profile` for the account data you'll be accessing. If you don't know which profile is your default profile, run the following command:

```bash
nr1 profiles:default
# select a default profile
```

You can also, always override the default profile by appending the command `--profile=<profile>` to the end of an `nr1` command.

> **Reminder:** Make sure that you're ready to go with the lab by ensuring you've run the following commands:

> ```bash
> # from the nr1-workshop directory
> cd lab1
> nr1 nerdpack:uuid -gf
> npm install
>```

## Create a new Nerdlet
The Nerdlet code that you create in this exercise will be accessed through a prebuilt launcher that is delivered as part of the lab. We will cover the details of launchers in a future exercise.

1. Run the `nr1 create` command by appending `--type nerdlet` as well as provide the appropriate name for your Nerdpack, Nerdlet, and launcher. See the following:

```bash
$ nr1 create --type nerdlet
 ℹ  You’re trying to create a nerdlet outside of a Nerdpack. We’ll create a Nerdpack for you...
✔ Name your nerdpack. … lab1-nerdpack
✔ Name your nerdlet. … lab1-nerdlet
✔ Name your launcher. … lab1-launcher

Installing dependencies...
npm notice created a lockfile as package-lock.json. You should commit this file.
added 8 packages from 3 contributors and audited 8 packages in 0.62s
found 0 vulnerabilities
```

This command creates a Nerdlet. Because a Nerdlet is a Nerdpack item, it creates a Nerdpack to house the Nerdlet. As a convenience, the command also gives you a launcher in case you want to use it as an entry point for your Nerdlet.
Now, change to your Nerdpack's root directory and serve your Nerdpack:

```bash
$ cd lab1-nerdpack
$ nr1 nerdpack:serve
```

You'll notice that the CLI creates three files in the _nerdlets/lab1-nerdlet_ directory: `index.js`, `styles.scss`, and a `nr1.json` configuration.

2. Assuming the the developement server is still running (via `nr1 nerdpack:serve`), navigating to https://one.newrelic.com?nerdpacks=local in your web browser. Validate that you can see the `Lab 1 Launcher` launcher and click on it.

3. Change the `displayName` property of the Nerdlet in `nerdlets/lab1-nerdlet/nr1.json` to `Lab 1 Nerdlet` and save that file. Restart your local server with `CTRL+C` and `nr1 nerdpack:serve`.

4. Check your browser. You should see the following:

![lab 1 nerdlet](../screenshots/lab1_screen01.png)

5. Next, prep your Nerdlet to generate some charts. Add the following code to your `Lab1Nerdlet` __*class*__ just above the `render` method in `nerdlets/lab1-nerdlet/index.js`.

```javascript
    constructor(props) {
        super(props);
        this.accountId = <REPLACE_WITH_YOUR_ACCOUNT_ID>;
        this.state = {
            appId: null,
            appName: null
        };
        console.debug("Nerdlet constructor", this); //eslint-disable-line
    }
```

_Note: The value of the accountId just needs to be a New Relic account to which you have access. Information on locating your account ID can be found in these [docs](https://docs.newrelic.com/docs/accounts/install-new-relic/account-setup/account-id)._

6. Save `index.js` and watch the `Lab 1 Nerdlet` reload in your Browser.
7. Ctrl+click (or right click) on the web browser screen displaying your Nerdlet and choose the menu item `Inspect`.
8. In the DevTools window now open, click on the `Console` tab at the top.
9. In the `Console` tab, choose the `verbose` option on the left hand side. (It's in the drop-down next to the 'Filter' bar.)
10. Go back to the browser window and reload the current page, and then go back to the DevTools window. You should be looking at a screen like the following:
![Dev Tools > Console > verbose](../screenshots/lab1_screen02.png)
You may get a notification at the top of your debug window indicating that you do not have the 'React DevTools' loaded. If you would like to load the [React DevTools extension](https://github.com/facebook/react-devtools), you can click on this link and load the extension for your choice of browser ([chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) or [firefox exetension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)). You can use the developer tools as a way to explore the values of your objects on the client. Take a moment now to explore the objects returned to the console.

## Explore the Chart components

1. Open the [provided documentation](https://developer.newrelic.com/client-side-sdk/index.html#components/AutoSizer).
2. Find the `TableChart` documentation and explore its Usage, Example, and Config content.
3. Find the `ScatterChart` documentation and explore its Usage, Example, and Config content.
4. Find the `LineChart` documentation and explore its Usage, Example, and Config content.
5. Find the `ChartGroup` documentation and explore its usage and example content.

In the next few sections, you're going to create an interface that explores the relationship between the volume of transactions over time and **Apdex** metric using the components you just reviewed.

## Build a table component into your Nerdlet

1. Add the following import statement near the top of `lab1/nerdlets/lab1-nerdlet/index.js`. This will bring in the `TableComponent` from the datanerd npm lirary that you named while setting up your environment.

```javascript
import { TableChart, Stack, StackItem } from 'nr1';
```

2. Add the following code to the `lab1/nerdlets/lab1-nerdlet/styles.scss` file.

```scss
.top-chart {
    padding: 10px;
    width: 100vw;
    height: 45vh;
}
.chart {
    padding: 10px;
    width: 48vw;
    height: 45vh;
}
```

3. Now, use the `TableChart` to display a simple table with **Apdex** information. Replace the `render` method of `lab1/nerdlets/lab1-nerdlet/index.js` with the following. 

```javascript
    render(){
        const { appId, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, appId limit 25`;
        //return the JSX we're rendering
        return (
            <Stack
                verticalType={Stack.VERTICAL_TYPE.FILL}
                directionType={Stack.DIRECTION_TYPE.VERTICAL}
                gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                <StackItem>
                    <TableChart query={nrql} accountId={this.accountId} className="chart" />
                </StackItem>
            </Stack>
        )
    }
```

The Nerdlet framework will recognize the `query` object that you passed as an argument into the `TableChart` in the `render` method, and will, under the covers, execute the NRQL statement as part of a GraphQL query.

Save the file, and validate that the the component renders.

4. Check your web browser to see a reloaded experience that looks something like the following.

![Table Chart](../screenshots/lab1_screen03.png)

## Add the detail charts

Now, you're going to add two detail charts and wrap them in a `ChartGroup` that will ensure synchronized effects across the charts.

1. Modify the `nr1` import statement at the top of `lab1/nerdlets/lab1-nerdlet/index.js` to the following.

```javascript
import { TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart } from 'nr1';
```

2. You're going to add several components (spelled out in the block of code further below) to the `render` method:
   - a `ChartGroup`
   - within the `ChartGroup` a `LineChart` to chart the timeseries number of transactions using the NRQL query `SELECT count(*) FROM Transaction WHERE appId = ${appId} TIMESERIES` as the source of its data.
   - within `ChartGroup` a `ScatterChart` to plot the duration of requests over time using the NRQL query `SELECT apdex(duration) FROM Transaction WHERE appId = ${appId} TIMESERIES` as the source of its data.
   - You're also going to make use of additional `Stack` and `StackItem` components. 
   
>**Note:** Just use the code for now. You'll learn more about their purpose in a future exercise.

That all results in the following block of code. Copy/reproduce the code below as the replacement for the `render` method of the `index.js` file:

```javascript
     render(){
        const { appId, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, appId limit 25`;
        const tCountNrql = `SELECT count(*) FROM Transaction WHERE appId = ${appId} TIMESERIES`;
        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE appId = ${appId} TIMESERIES`
        //return the JSX we're rendering
        return (
            <ChartGroup>
                <Stack
                    verticalType={Stack.VERTICAL_TYPE.FILL}
                    directionType={Stack.DIRECTION_TYPE.VERTICAL}
                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                    <StackItem>
                        <TableChart query={nrql} accountId={this.accountId} className="top-chart" />
                    </StackItem>
                    {appId && <StackItem>
                        <Stack
                            horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                            gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                            <StackItem>
                                <LineChart accountId={this.accountId} query={tCountNrql} className="chart"/>
                            </StackItem>
                            <StackItem>
                                <ScatterChart accountId={this.accountId} query={apdexNrql} className="chart"/>
                            </StackItem>
                        </Stack>
                    </StackItem>}
                </Stack>
            </ChartGroup>
        )
    }
```

>**Note:** that the line containing `{appId && <Stack...` ensures that the lower section of content displays **only** when an `appId` is present. You haven't set that value in the `state` of the component yet, so you won't see the second row.

3. Save the file and reload the page in the web browser.

Note that the second row of additional charts is never drawn because the `state.appId` is always NULL. There's presently no way to set its value. But you can fix that as follow.

4. Under the `contructor(props)` that we added above, add the following method to your Nerdlet React component:

```javascript
    setApplication(inAppId, inAppName) {
        this.setState({ appId: inAppId, appName: inAppName })
    }
```

5. Configure a `click` event on the table rows by adding a new attribute named `onClickTable` to the existing `TableChart`.

```javascript
<TableChart query={nrql} accountId={this.accountId} className="top-chart" onClickTable={(dataEl, row, chart) => {
    //for learning purposes, we'll write to the console.
    console.debug([dataEl, row, chart]); //eslint-disable-line
    this.setApplication(row.appId, row.appName);
}}/>
```
The `onClickTable` receives four parameters that each provide a different view of the overall data.

- dataEl: The inner contents of the specific Table element on which the user clicked.
- row: a JS object of the data that makes up the entire row of that table
- chart: the entire JS object used to generate the chart, both headings and data rows

The resulting `index.js` should look like the following:

```javascript
import React from 'react';
import { TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart } from 'nr1';

export default class Lab1Nerdlet extends React.Component {

    constructor(props) {
        super(props);
        this.accountId = <REPLACE_WITH_YOUR_ACCOUNT_ID>;
        this.state = {
            appId: null,
            appName: null
        };
        console.debug("Nerdlet constructor", this); //eslint-disable-line
    }

    setApplication(inAppId, inAppName) {
        this.setState({ appId: inAppId, appName: inAppName })
    }

    render(){
        const { appId, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, appId limit 25`;
        const tCountNrql = `SELECT count(*) FROM Transaction WHERE appId = ${appId} TIMESERIES`;
        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE appId = ${appId} TIMESERIES`
        //return the JSX we're rendering
        return (
            <ChartGroup>
                <Stack
                    verticalType={Stack.VERTICAL_TYPE.FILL}
                    directionType={Stack.DIRECTION_TYPE.VERTICAL}
                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                    <StackItem>
                            <TableChart query={nrql} accountId={this.accountId} className="top-chart" onClickTable={(dataEl, row, chart) => {
                                //for learning purposes, we'll write to the console.
                                console.debug([dataEl, row, chart]) //eslint-disable-line
                                this.setApplication(row.appId, row.appName)
                            }}/>
                    </StackItem>
                    {appId && <StackItem>
                        <Stack
                            horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                            gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                            <StackItem>
                                <LineChart accountId={this.accountId} query={tCountNrql} className="chart"/>
                            </StackItem>
                            <StackItem>
                                <ScatterChart accountId={this.accountId} query={apdexNrql} className="chart"/>
                            </StackItem>
                        </Stack>
                    </StackItem>}
                </Stack>
            </ChartGroup>
        )
    }
}
```

6. Save the file and reload the page. You should be able to click on an application and see the resulting second row of charts. :sparkles:

![Full example](../screenshots/lab1_screen04.png)

## Extra Credit: Add a second summary chart

Based on what you've executed above, apply that learning in the following:

1. **Replicate** the `Stack` and `StackItem` code from the lower part of the display (i.e. the portion containing the `ScatterChart` and `LineChart`) into the upper half of the display that currently only contains a `TableChart`.

>**Note:** We're going to add a `LineChart` next to our `TableChart`, which will require a `Stack` with in the very first `StackItem` that itself contains another `Stack` with two `StackItem` elements.

2. Within the first, **new** `StackItem` element, place the existing `TableChart`.

3. Update the `className` on the `TableChart` to `className="chart"`.

4. Next to the `TableChart` in the second `StackItem`, add a `LineChart` using the following NRQL query: 
`SELECT count(*) as 'transactions' FROM Transaction facet appName, appId limit 25 TIMESERIES`.

5. Add a `onClickLine` attribute to your `LineChart` that processes `onClick` events in the same way that the `TableChart` `onTableClick` operates (i.e. calling the `this.setApplication` method). See the following:

```javascript
<LineChart
    query={`SELECT count(*) as 'transactions' FROM Transaction facet appName, appId limit 25 TIMESERIES`}
    className="chart"
    accountId={this.accountId}
    onClickLine={(line) => {
        //more console logging for learning purposes
        console.debug(line); //eslint-disable-line
        const params = line.metadata.label.split(',');
        this.setApplication(params[1], params[0]);
    }}
/>
```

5. The resulting `index.js` should look like the following:

```javascript
    render(){
        const { appId, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, appId limit 25`;
        const tCountNrql = `SELECT count(*) FROM Transaction WHERE appId = ${appId} TIMESERIES`;
        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE appId = ${appId} TIMESERIES`
        //return the JSX we're rendering
        return (
            <ChartGroup>
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
										this.setApplication(row.appId, row.appName)
								}}/>
							</StackItem>
							<StackItem>
								<LineChart
									query={`SELECT count(*) as 'transactions' FROM Transaction facet appName, appId limit 25 TIMESERIES`}
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
                    {appId && <StackItem>
                        <Stack
                            horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                            directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                            gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                            <StackItem>
                                <LineChart accountId={this.accountId} query={tCountNrql} className="chart"/>
                            </StackItem>
                            <StackItem>
                                <ScatterChart accountId={this.accountId} query={apdexNrql} className="chart"/>
                            </StackItem>
                        </Stack>
                    </StackItem>}
                </Stack>
            </ChartGroup>
        )
    }
```

![Something like this](../screenshots/lab1_screen05.png)

## For Consideration / Discussion

- _What was the purpose of the `ChartGroup`? What is it doing for us?_
