import { Base64 } from 'js-base64';
import { EntityByGuidQuery } from 'nr1';

export const encodeEntityGuid = (accountId, domain, type, domainId) => {
  const urlSafeChars = {'+': '-', '/': '_', '=': ''};
  //id = md5(id)
  const id = `${accountId}|${domain}|${type}|${domainId}`
  const entityGuid = Base64.encode(id).replace(/[+=]/, (c => urlSafeChars[c]));
  return entityGuid;
}

/**
 * Returns an array of [accountId, domain, type, domainId]
 * @param {*} entityGuid
 */
export const decodeEntityGuid = (entityGuid) => {
  return Base64.decode(entityGuid).split("|");
}

/**
 * Return object of the breakdown of the entity GUID.
 *
 * @param {string} entityGuid
 */
export const decodeEntityFromEntityGuid = (entityGuid) => {
  const decodedId = decodeEntityGuid(entityGuid);
  return {
      id: entityGuid,
      accountId: decodedId[0],
      domain: decodedId[1],
      type: decodedId[2],
      domainId: decodedId[3],
      entityType: {
        domain: decodedId[1],
        type: decodedId[2]
      }
  };
}

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
    const distance_in_minutes = Math.round(duration / 60 / 1000);
    const distance_in_seconds = Math.round(duration / 1000);

    if (distance_in_minutes >= 0 && distance_in_minutes <= 1) {
        if (!seconds) {
            if (distance_in_minutes === 0) {
                return 'less than 1 minute ago';
            }

            return `${distance_in_minutes} minutes ago`;
        }

        if (distance_in_seconds >= 0 && distance_in_seconds <= 4) {
            return 'less than 5 seconds ago';
        } else if (distance_in_seconds >= 5 && distance_in_seconds <= 9) {
            return 'less than 10 seconds ago';
        } else if (distance_in_seconds >= 10 && distance_in_seconds <= 19) {
            return 'less than 20 seconds ago';
        } else if (distance_in_seconds >= 20 && distance_in_seconds <= 39) {
            return 'less than half a minute ago';
        } else if (distance_in_seconds >= 40 && distance_in_seconds <= 59) {
            return 'less than 1 minute ago';
        }

        return '1 minute ago';
    } else if (distance_in_minutes >= 2 && distance_in_minutes <= 44) {
        return `${distance_in_minutes} minutes ago`;
    } else if (distance_in_minutes >= 45 && distance_in_minutes <= 89) {
        return 'about 1 hour ago';
    } else if (distance_in_minutes >= 90 && distance_in_minutes <= 1439) {
        return `about ${(Math.round(distance_in_minutes / 60))} hours ago`;
    } else if (distance_in_minutes >= 1440 && distance_in_minutes <= 2529) {
        return '1 day ago';
    } else if (distance_in_minutes >= 2530 && distance_in_minutes <= 43199) {
        return `${(Math.round(distance_in_minutes / 1440))} days ago`;
    } else if (distance_in_minutes >= 43200 && distance_in_minutes <= 86399) {
        return 'about 1 months ago';
    } else if (distance_in_minutes >= 86400 && distance_in_minutes <= 525599) {
        return `${(Math.round(distance_in_minutes / 43200))} months ago`;
    }

    let minutes_with_offset;

    if (from_time > 0 && toTime > 0) {
        const from_time_date = new Date(from_time);
        let fyear = from_time_date.getFullYear();
        fyear += from_time_date.getMonth() >= 3 ? 1 : 0;

        const toTime_date = new Date(toTime);
        let tyear = toTime_date.getFullYear();
        tyear -= toTime_date.getMonth() < 3 ? 1 : 0;

        const leap_years = fyear > tyear ? 0 : countLeapYears(fyear, tyear);
        const minute_offset_for_leap_year = leap_years * 1440;

        minutes_with_offset = distance_in_minutes - minute_offset_for_leap_year;
    } else {
        minutes_with_offset = distance_in_minutes;
    }

    const distance_in_years = distance_in_minutes / MINUTES_IN_YEAR;
    const remainder = minutes_with_offset % MINUTES_IN_YEAR;

    if (remainder < MINUTES_IN_QUARTER_YEAR) {
        return `about ${(Math.round(distance_in_years))} years ago`;
    } else if (remainder < MINUTES_IN_THREE_QUARTERS_YEAR) {
        return `over ${(Math.round(distance_in_years))} years ago`;
    }

    return `almost ${(Math.round(distance_in_years + 1))} years ago`;

    function countLeapYears(from_time, to_time) {
        let count = 0;

        for (let i = 0; i < to_time - from_time; i++) {
            if (leapYear(from_time + i)) {
                count++;
            }
        }

        return count;
    }

    function leapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }
}