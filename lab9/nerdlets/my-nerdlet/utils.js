import { EntityByGuidQuery } from 'nr1';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);

export const loadEntity = (entityGuid) => {
  return new Promise(resolve => {
    EntityByGuidQuery.query({ entityGuid }).then(results => {
      //console.debug(results);
      resolve(results.data.actor.entities[0]);
    }).catch(error => {
      console.error(error); //eslint-disable-line
    });
  });
}

/**
 * Colors based on the following values:
 * CRITICAL
 * WARNING
 * NOT_ALERTING
 * NOT_CONFIGURED
 * NOT_REPORTING
 * @param {*} e
 */
export const alertSeverityToColor = (e) => {
    const alertSeverity = e && e.alertSeverity ? e.alertSeverity : e;
    switch (alertSeverity) {
        case "WARNING":
            return 'yellow';
        case "CRITICAL":
            return 'red';
        case "NOT_CONFIGURED":
            return 'lightgrey';
        case "NOT_REPORTING":
            return 'grey';
        case "NOT_ALERTING":
            return 'lightgreen';
        default:
            return 'green';
    }
}

/**
 * Copied shamelessly from https://source.datanerd.us/dataviz/vizco-core/blob/master/src/js/utils/time-distance.js
 * @param {number} duration: milliseconds
 */
export const distanceOfTimeInWords = (duration) => {
    return moment.duration(duration).format();
}