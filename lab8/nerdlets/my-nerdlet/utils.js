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