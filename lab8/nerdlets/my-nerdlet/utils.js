import { Base64 } from 'js-base64';
import { EntityByGuidQuery } from 'nr1';

export const encodeEntityId = (accountId, domain, type, domainId) => {
  const urlSafeChars = {'+': '-', '/': '_', '=': ''};
  //id = md5(id)
  const id = `${accountId}|${domain}|${type}|${domainId}`
  const entityId = Base64.encode(id).replace(/[+=]/, (c => urlSafeChars[c]));
  return entityId;
}

/**
 * Returns an array of [accountId, domain, type, domainId]
 * @param {*} entityId
 */
export const decodeEntityId = (entityId) => {
  return Base64.decode(entityId).split("|");
}

export const loadEntity = (entityGuid) => {
  return new Promise(resolve => {
    EntityByGuidQuery.query({ entityGuid }).then(results => {
      //console.debug(results);
      resolve(results.data.actor.entities[0]);
    }).catch(error => {
      console.error(error);
    });
  });
}