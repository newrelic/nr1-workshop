import { Base64 } from 'js-base64';
import uuidv4 from 'uuid';
import randomColor from 'randomcolor';
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

export const loadEntity = (entityGuid) => {
  return new Promise(resolve => {
    EntityByGuidQuery.query({ entityGuid }).then(results => {
      //console.debug(results);
      resolve(results.data.entities[0]);
    }).catch(error => {
      console.error(error);
    });
  });
}

export const generateForecastData = (data) => {
  const forecast = {
      metadata: {
          name: 'Forecast',
          label: 'Forecast',
          id: uuidv4(),
          viz: 'main'
      },
      data: []
  };
  //loop through each point
  data.data.forEach(pt => {
      forecast.data.push({
          x: pt.x,
          y: randomForecast(pt.y)
      })
  });
  forecast.metadata.color = randomColor();

  return forecast;
}

const percentages = [0.9, 1.1, 1.03, 1.5, 2, 1.17, 0.85, 0.7, 1.7, 0.92]

const randomForecast = (x) => {
  const random = percentages[Math.floor(Math.random() * percentages.length)]
  return x * random
}