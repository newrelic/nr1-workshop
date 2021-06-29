Lab 2: navigation and timeRange
===========================================================

The purpose of this lab is explore more of the built-in capabilities of the `props` passed into a Nerdlet as well as the `navigation` class in the `nr1` library.

After completing this lab you should:

* Have a grasp on the navigation paradigms in New Relic One and how the SDK exposes them.
* Be able to incorporate the `timeRange` fields that are set by the New Relic One time picker into your Nerdlets.

![Time Picker](../screenshots/lab2_timepicker_example.png)

## Step 0: Setup and Prerequisites

Load the prequisites and follow the setup instructions in [Setup](../SETUP.md).

**Reminder**: Make sure that you're ready to go with your `lab2` by ensuring you've run the following commands:

```bash
# from the nr1-workshop directory
cd lab2
nr1 nerdpack:uuid -gf
npm install
```

## Step 1: Verifying our Nerdlet and reviewing the [Nerdlet API docs](http://nr3.nr-assets.net.s3.amazonaws.com/docs/index.html)

![Nerdlet 2 Launcher](../screenshots/lab2_screen00.png)

1. Open `lab2/nerdlets/my-nerdlet/index.js`. In the　Nerdlet's constructor, change the value of `this.accountId` to an account you want to review.

_Note: we're going to cover how to **not** hardcode the accountIds for NRQL queries later._

2.
```bash
#And if it's not already running, execute the following
nr1 nerdpack:serve
```

3. Open a browser and check out the `Lab 2 Nerdlet` by going to the homepage and clicking on `Lab 2 Launcher`. Click around and verify that it's working. You should see something like this:
![Lab2 Nerdlet Open for Business](../screenshots/lab2_screen01.png)


## Step 2: Implementing the time picker

1. Go back to the [Nerdlet interface](https://one.newrelic.com/launcher/lab2.my-launcher?nerdpacks=local), and change the value of the Time Window in the top right corner of the UI. <img src="../screenshots/lab2_screen03.png" width="200" align="right" style="margin:10px" />

Notice that the time windows and charts in the Nerdlet do not refresh and do not respond to changes in the time window. (_Hint: That's because we haven't told them to use the selected time range yet!_) Let's do something about that.

2. Open the `lab2/nerdlets/my-nerdlet/index.js` file and find the `render` method. We're going to modify it. Find the `return` call and wrap the `ChartGroup` component in the following:

```javascript
//code above here in the render method
return <PlatformStateContext.Consumer>
  {(platformUrlState) => {
      //console.debug here for learning purposes
      console.debug(platformUrlState); //eslint-disable-line
      const { duration } = platformUrlState.timeRange;
      const since = ` SINCE ${duration/60/1000} MINUTES AGO`;

      return (<ChartGroup>
        //the rest of the original return code here, and don't repeat the ChartGroup
      </ChartGroup>); //
  }}
</PlatformStateContext.Consumer>

```

3. Now, we're going to make `duration` part of each of the four query objects.
* `TableComponent`: `query={nrql+since}`
* upper `LineChart`: `query={trxOverT+since}`
* lower `LineChart`: `query={tCountNrql+since}`
* `ScatterChart`: `query={apdexNrql+since}`

4. Save the file and reload. Now try to change the time window again. You should see your charts reading and re-rendering based on the `timeRange`.

## Step 3: Load and display an Entity

In this portion of the pageant, we're going to call another Nerdlet, specifically the overview experience for an APM Service, using the `navigation` object to open a predefined portion of New Relic One. We're also going to utilize the `Button` component.

We need to start by adding a `Button` to the screen.

1. Notice that we _already_ imported the `Button` component near the top of the `lab2/nerdlets/my-nerdlet/index.js` file.

```javascript
//look with your eyes at the Button
import { TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart, Button, navigation, nerdlet } from 'nr1';
```

2. Adjust the following code in the `render` method to include the new `StackItem` and `Button` components. In between the first and second "rows" of content within the `render` `return` statement, add the following:

```javascript
{appName && <StackItem>
    <Button onClick={this.openEntity}>Open {appName}</Button>
</StackItem>}
```

3. And then add the following method to the nerdlet in `lab2/nerdlets/my-nerdlet/index.js`. Note that we're using the `navigation` object's `openEntity`.

```javascript
    openEntity() {
        const { entityGuid } = this.state;
        if (entityGuid) {
            navigation.openEntity(entityGuid);
        }
    }
```

4. Add the following line to the nerdlet's `constructor` method.

```javascript
    this.openEntity = this.openEntity.bind(this);
```

5. Save the file and reload. Click on an `App Name` in the first table. You should see something like the following:
![Buttons](../screenshots/lab2_screen04.png)

6. Click on the button titled `Open <<App Name>>`. You should see a stacked nerdlet open containing the APM Overview screen.
![APM Overview](../screenshots/lab2_screen05.png)

_Note: Alternatively, you can call the `navigation.openStackedEntity` **thusly**, which will open a stacked nerdlet UI vs. replace the entire Nerdlet context:_

```javascript
    openEntity() {
        const { entityGuid } = this.state;
        if (entityGuid) {
            navigation.openStackedEntity(entityGuid);
        }
    }
```

## Step 4: Save the Nerdlet state

We have one remaining issue with the navigation flow of this example. After you click on the Button that takes you to the APM Overview nerdlet, a click on your browser back arrow takes you (correctly) to the Lab 2 Nerdlet; however (incorrectly) back to an empty state (i.e. not displaying the 2nd row). Let's fix that.

1. Let's make a call to the `nerdlet.setUrlState` to save the `entityGuid` and `appName` before navigating away. To do this, let's change the `openEntity` method and add a call to `nerdlet.setUrlState`.

```javascript
    openEntity() {
        const { entityGuid, appName } = this.state;
        nerdlet.setUrlState({ entityGuid, appName });
        navigation.openEntity(entityGuid);
    }
```

2. We're going to wrap the last two `StackItem` components of the display (the `Button` and the bottom `StackItem` containing the lower charts) in a `NerdletStateContext` component to be able to read the `nerdletUrlState.entityGuid` and the `nerdletUrlState.appName`. That render method looks like this.

```javascript
    render(){
        const { entityGuid, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, entityGuid limit 25`;
        const trxOverT = `SELECT count(*) as 'transactions' FROM Transaction facet appName, appId limit 25 TIMESERIES`;
        //return the JSX we're rendering
        return (
            <PlatformStateContext.Consumer>
              {(platformUrlState) => {
                  //console.debug here for learning purposes
                  console.debug(platformUrlState); //eslint-disable-line
                  const { duration } = platformUrlState.timeRange;
                  const since = ` SINCE ${duration/60/1000} MINUTES AGO`;
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
                                    <TableChart query={nrql + since} accountId={this.accountId} className="chart" onClickTable={(dataEl, row, chart) => {
                                    //for learning purposes, we'll write to the console.
                                    console.debug([dataEl, row, chart]) //eslint-disable-line
                                    this.setApplication(row.entityGuid, row.appName)
                                }}/>
                                </StackItem>
                                <StackItem>
                                    <LineChart
                                        query={trxOverT + since}
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
                        <NerdletStateContext.Consumer>
                                {(nerdletUrlState) => {
                                    if (entityGuid) {
                                        const tCountNrql = `SELECT count(*) FROM Transaction WHERE entityGuid = '${entityGuid}' TIMESERIES`;
                                        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE entityGuid = '${entityGuid}' TIMESERIES`;

                                        return <React.Fragment>
                                            <StackItem>
                                                <Button onClick={this.openEntity}>Open {appName}</Button>
                                            </StackItem>
                                            <StackItem>
                                                <Stack
                                                    directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
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
                                            </StackItem>
                                        </React.Fragment>
                                    } else if (nerdletUrlState && nerdletUrlState.entityGuid) {
                                        const tCountNrql = `SELECT count(*) FROM Transaction WHERE entityGuid = '${nerdletUrlState.entityGuid}' TIMESERIES`;
                                        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE entityGuid = '${nerdletUrlState.entityGuid}' TIMESERIES`;
                                        return <React.Fragment>
                                            <StackItem>
                                                <Button onClick={this.openEntity}>Open {nerdletUrlState.appName}</Button>
                                            </StackItem>
                                            <StackItem>
                                                <Stack
                                                    directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                                                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                                                    <StackItem>
                                                        <h2>Transaction counts for {nerdletUrlState.appName}</h2>
                                                        <LineChart accountId={this.accountId} query={tCountNrql+since} className="chart"/>
                                                    </StackItem>
                                                    <StackItem>
                                                        <h2>Apdex for {nerdletUrlState.appName}</h2>
                                                        <ScatterChart accountId={this.accountId} query={apdexNrql+since} className="chart"/>
                                                    </StackItem>
                                                </Stack>
                                            </StackItem>
                                        </React.Fragment>
                                    }
                                    return null;
                                }}
                                </NerdletStateContext.Consumer>
                    </Stack>
                </ChartGroup>); //
              }}
            </PlatformStateContext.Consumer>
        )
    }
```

3. Save the file and reload. Click on an `Application` in the `Lab 2 Nerdlet` table, click the `Button` (navigating away), and click back. You should see your context maintained in `Lab 2 Nerdlet`

## Summary

In the end, your `index.js` should look like this.

```javascript
import React from 'react';
import { TableChart, Stack, StackItem, ChartGroup, LineChart, ScatterChart, Button, navigation, nerdlet, PlatformStateContext, NerdletStateContext  } from 'nr1';

export default class Lab2Nerdlet extends React.Component {

    constructor(props) {
        super(props);
        this.accountId = <REPLACE_WITH_YOUR_ACCOUNT_ID>;
        this.state = {
            entityGuid: null,
            appName: null
        };
        console.debug("Nerdlet constructor", this); //eslint-disable-line
        this.openEntity = this.openEntity.bind(this);
    }

    setApplication(inAppId, inAppName) {
        this.setState({ entityGuid: inAppId, appName: inAppName })
    }

    openEntity() {
        const { entityGuid, appName } = this.state;
        nerdlet.setUrlState({ entityGuid, appName });
        navigation.openEntity(entityGuid);
    }

    render(){
        const { entityGuid, appName } = this.state;
        const nrql = `SELECT count(*) as 'transactions', apdex(duration) as 'apdex', percentile(duration, 99, 90, 70) FROM Transaction facet appName, entityGuid limit 25`;
        const trxOverT = `SELECT count(*) as 'transactions' FROM Transaction facet appName, appId limit 25 TIMESERIES`;
        //return the JSX we're rendering
        return (
            <PlatformStateContext.Consumer>
              {(platformUrlState) => {
                  //console.debug here for learning purposes
                  console.debug(platformUrlState); //eslint-disable-line
                  const { duration } = platformUrlState.timeRange;
                  const since = ` SINCE ${duration/60/1000} MINUTES AGO`;
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
                                    <TableChart query={nrql + since} accountId={this.accountId} className="chart" onClickTable={(dataEl, row, chart) => {
                                    //for learning purposes, we'll write to the console.
                                    console.debug([dataEl, row, chart]) //eslint-disable-line
                                    this.setApplication(row.entityGuid, row.appName)
                                }}/>
                                </StackItem>
                                <StackItem>
                                    <LineChart
                                        query={trxOverT + since}
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
                        <NerdletStateContext.Consumer>
                                {(nerdletUrlState) => {
                                    if (entityGuid) {
                                        const tCountNrql = `SELECT count(*) FROM Transaction WHERE entityGuid = '${entityGuid}' TIMESERIES`;
                                        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE entityGuid = '${entityGuid}' TIMESERIES`;

                                        return <React.Fragment>
                                            <StackItem>
                                                <Button onClick={this.openEntity}>Open {appName}</Button>
                                            </StackItem>
                                            <StackItem>
                                                <Stack
                                                    directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
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
                                            </StackItem>
                                        </React.Fragment>
                                    } else if (nerdletUrlState && nerdletUrlState.entityGuid) {
                                        const tCountNrql = `SELECT count(*) FROM Transaction WHERE entityGuid = '${nerdletUrlState.entityGuid}' TIMESERIES`;
                                        const apdexNrql = `SELECT apdex(duration) FROM Transaction WHERE entityGuid = '${nerdletUrlState.entityGuid}' TIMESERIES`;
                                        return <React.Fragment>
                                            <StackItem>
                                                <Button onClick={this.openEntity}>Open {nerdletUrlState.appName}</Button>
                                            </StackItem>
                                            <StackItem>
                                                <Stack
                                                    directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
                                                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}>
                                                    <StackItem>
                                                        <h2>Transaction counts for {nerdletUrlState.appName}</h2>
                                                        <LineChart accountId={this.accountId} query={tCountNrql+since} className="chart"/>
                                                    </StackItem>
                                                    <StackItem>
                                                        <h2>Apdex for {nerdletUrlState.appName}</h2>
                                                        <ScatterChart accountId={this.accountId} query={apdexNrql+since} className="chart"/>
                                                    </StackItem>
                                                </Stack>
                                            </StackItem>
                                        </React.Fragment>
                                    }
                                    return null;
                                }}
                                </NerdletStateContext.Consumer>
                    </Stack>
                </ChartGroup>); //
              }}
            </PlatformStateContext.Consumer>
        )
    }
}
```

# For Consideration / Discussion

* Why would we want to "hand craft" the usage of the time picker? Can you think of a scenario where you'd want the control over how the time elements of a custom experience would be implemented?
* Have you drawn the connection between what we're building with these React tools and the fact that a currated experience in the product, like the APM Overview screen, is made of the exact same stuff? What are the benefits of that type of approach to programmability?
