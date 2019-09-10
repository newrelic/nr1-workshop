import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import appropriate NR1 components, include spark lines! (shout out to Ed Tutfe)
import { Stack, StackItem, SparklineChart, BillboardChart, HeadingText } from 'nr1';

export default class SummaryBar extends Component {
  static propTypes = {
    regionCode: PropTypes.string,
    countryCode: PropTypes.string,
    accountId: PropTypes.any.isRequired,
    appName: PropTypes.string.isRequired,
    launcherUrlState: PropTypes.object.isRequired
  }

  render() {
    //get props, including nested props
    const { accountId, countryCode, regionCode, appName, launcherUrlState: { timeRange: { duration } } } = this.props;
    //compute the duration in minutes
    const durationInMinutes = duration/1000/60;
    //generate the appropriate NRQL where fragment for countryCode and regionCode
    const nrqlWhere = countryCode ? ` WHERE countryCode  = '${countryCode}' ${regionCode ? ` AND regionCode = '${regionCode}' ` : '' }` : '';
    //output a series of micro-charts to show overall KPI's
    return (
      <Stack
          directionType={Stack.DIRECTION_TYPE.HORIZONTAL}
          gapType={Stack.GAP_TYPE.TIGHT}>
          <StackItem className="inline">
            {countryCode ? <HeadingText>{regionCode ? `${regionCode}, ` : ''}{countryCode} Stats</HeadingText> : <HeadingText>Overall</HeadingText> }
          </StackItem>
          <StackItem className="inline">
              <BillboardChart className="microchart" accountId={accountId} query={`FROM PageView SELECT count(*) as 'Page Views' SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
              <SparklineChart className="microchart" accountId={accountId} query={`FROM PageView SELECT count(*) TIMESERIES SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
          </StackItem>
          <StackItem className="inline">
              <BillboardChart className="microchart" accountId={accountId} query={`FROM PageView SELECT average(duration) as 'Performance' SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
              <SparklineChart className="microchart" accountId={accountId} query={`FROM PageView SELECT average(duration) TIMESERIES SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
          </StackItem>
          <StackItem className="inline">
              <BillboardChart className="microchart" accountId={accountId} query={`FROM PageView SELECT average(networkDuration) as 'Network Avg.' SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
              <SparklineChart className="microchart" accountId={accountId} query={`FROM PageView SELECT average(networkDuration) TIMESERIES SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
          </StackItem>
          <StackItem className="inline" grow={true}>
              <BillboardChart className="microchart" accountId={accountId} query={`FROM PageView SELECT average(backendDuration) as 'Backend Avg.' SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
              <SparklineChart className="microchart" accountId={accountId} query={`FROM PageView SELECT average(backendDuration) TIMESERIES SINCE ${durationInMinutes} MINUTES AGO WHERE appName = '${appName}' ${nrqlWhere}`}/>
          </StackItem>
      </Stack>
    )
  }
}
