import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, TableChart, PieChart, BillboardChart, BarChart } from 'nr1';

export default class JavaScriptErrorSummary extends Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    entity: PropTypes.object.isRequired,
    accountId: PropTypes.any.isRequired,
    launcherUrlState: PropTypes.object.isRequired
  }

  render() {
    const { accountId, entity, launcherUrlState: { timeRange: { duration }}, height } = this.props;
    const appName = entity.name;
    const durationInMinutes = duration/1000/60;
    const chartHeight = 250;
    return (
      <Grid className="details">
        <GridItem columnStart={1} columnEnd={12}>
          <h1>Summary</h1>
        </GridItem>
        <GridItem columnStart={1} columnEnd={3}>
          <h4>Total</h4>
          <BillboardChart style={{ height: `${chartHeight}px`}} accountId={accountId} query={`SELECT count(*) FROM JavaScriptError WHERE appName = '${entity.name}' SINCE ${durationInMinutes} MINUTES AGO`}></BillboardChart>
        </GridItem>
        <GridItem columnStart={4} columnEnd={6}>
          <h4>Requests</h4>
          <PieChart style={{ height: `${chartHeight}px`}} accountId={accountId} query={`SELECT count(requestUri) FROM JavaScriptError WHERE appName = '${entity.name}' FACET requestUri SINCE ${durationInMinutes} MINUTES AGO`}/>
        </GridItem>
        <GridItem columnStart={7} columnEnd={9}>
          <h4>Browsers</h4>
          <PieChart style={{ height: `${chartHeight}px`}} accountId={accountId} query={`SELECT count(userAgentName) FROM JavaScriptError WHERE appName = '${entity.name}' FACET userAgentName SINCE ${durationInMinutes} MINUTES AGO`}/>
        </GridItem>
        <GridItem columnStart={10} columnEnd={12}>
          <h4>Error Messages</h4>
          <BarChart style={{ height: `${chartHeight}px`}} accountId={accountId} query={`SELECT count(errorMessage) FROM JavaScriptError WHERE appName = '${entity.name}' FACET errorMessage SINCE ${durationInMinutes} MINUTES AGO`}/>
        </GridItem>
        <GridItem columnStart={1} columnEnd={12} style={{marginTop: '20px'}}>
          <TableChart
              style={{height: height-chartHeight-50, width: '100%'}}
              accountId={accountId}
              query={`SELECT * from JavaScriptError WHERE appName = '${appName}' SINCE ${durationInMinutes} MINUTES AGO LIMIT 2000 `}
          />
        </GridItem>
      </Grid>
    )
  }
}
