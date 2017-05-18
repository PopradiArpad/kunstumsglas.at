/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {fetchGraphQL} from '../api'
import Process        from './Process'
import getEntityPropertyValuesRequests from '../components/propertyViews/getEntityPropertyValuesRequests';

const GetEntityDescription = `
query ($id: Identity!) {
  GetEntityDescription(identity: $id) {
    removable
    propertyDescriptions {
      __typename
      title
      property
      ... on IdArrayProperty {
        ids
        referredDbModel
        reordeingAllowed
        createNewItemAllowed
        removeItemAllowed
      }
      ... on StringProperty {
        string
        multiline
      }
      ... on BooleanProperty {
        bool
      }
      ... on DataURLProperty {
        dataurl
      }
      ... on FileUploadStatusProperty {
        uploadStatus
        fileExtension
      }
      ... on TranslatedStringsProperty {
        translatedStrings {
          id
          localizedStrings {
            locale
            string
          }
          removable
        }
      }
      ... on LocalizedStringsProperty {
        localizedStrings {
          locale
          string
        }
        multiline
      }
    }
  }
}`;

const GetEntityPropertyValues = `
query ($epvsrs:[EntityPropertyValuesRequest]) {
  GetEntityPropertyValues(entityPropertyValuesRequests: $epvsrs){
    id
    propertyValues {
      property
      value
    }
  }
}`

function LoadEntityProcess() {
  Process.call(this);
}

LoadEntityProcess.prototype = Object.create(Process.prototype);
LoadEntityProcess.prototype.constructor = LoadEntityProcess;
LoadEntityProcess.processName = 'LoadEntityProcess';

LoadEntityProcess.prototype.start = function(identity,entityOverviews) {
  if (!identity)
    return this.dispatchNullEntity();

  return this.getEntityDescription(identity,entityOverviews);
}

LoadEntityProcess.prototype.dispatchNullEntity = function() {
    Promise.resolve({entityDescription:null,entityOverviews:{}})
    .then(this.dispatchProcessFinishedOk.bind(this));
}

LoadEntityProcess.prototype.getEntityDescription = function(identity,entityOverviews) {
  return fetchGraphQL(GetEntityDescription, {id:identity})
          .then(this.graphQLErrorAPI.bind(this))
          .then(this.addEntityDescription.bind(this,identity))
          .then(this.addEntityPropertyValues.bind(this,entityOverviews))
          .then(this.dispatchProcessFinishedOk.bind(this))
          .catch(this.dispatchProcessFinishedError.bind(this));
}

LoadEntityProcess.prototype.addEntityDescription = function(identity,graphQLResult) {
  let GetEntityDescription = graphQLResult.data.GetEntityDescription;

  return {
          entityDescription:{
            identity,
            removable:GetEntityDescription.removable,
            propertyDescriptions:GetEntityDescription.propertyDescriptions,
            translatedMessages:GetEntityDescription.translatedMessages
         }};
}

LoadEntityProcess.prototype.addEntityPropertyValues = function(entityOverviews,{entityDescription}) {
  let entityPropertyValuesRequests = this.getEntityPropertyValuesRequests(entityOverviews,entityDescription);

  return (entityPropertyValuesRequests.length)
         ? fetchGraphQL(GetEntityPropertyValues, {epvsrs:entityPropertyValuesRequests})
           .then(this.graphQLErrorAPI.bind(this))
           .then(this.addEntityOverviews.bind(this,entityDescription))
         : {entityDescription};
}

LoadEntityProcess.prototype.getEntityPropertyValuesRequests = function(entityOverviews,entityDescription) {
  let entityPropertyValuesRequests = entityDescription.propertyDescriptions.reduce((a,pd)=>{
    let requests = getEntityPropertyValuesRequests(pd,entityOverviews);

    return (requests.length) ? a.concat(requests) : a;
    },[]);

  return entityPropertyValuesRequests;
}

LoadEntityProcess.prototype.addEntityOverviews = function(entityDescription,graphQLResult) {
  let entityPropertyValues = graphQLResult.data.GetEntityPropertyValues;

  let entityOverviews = entityPropertyValues.reduce((a,epv)=>{
    a[epv.id] = new EntityOverview(epv.propertyValues);
    return a;
  },{});

  return {
          entityDescription,
          entityOverviews
         };
}


//TODO: expose this type in entity reducer
function EntityOverview(propertyValues) {
  propertyValues.forEach(pv=>this[pv.property]=pv.value);
}


export default LoadEntityProcess;
