/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import { fetchGraphQL } from '../api';
import Process from './Process';
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
}`;

const LoadEntityProcess = {
  processName: 'LoadEntityProcess',

  create() {
    let process = Object.create(LoadEntityProcess);
    process.initProcess(LoadEntityProcess.processName);
    return process;
  },

  start(identity, entityOverviews) {
    if (!identity) {
     return this.dispatchNullEntity();
    }

    return this.getEntityDescription(identity, entityOverviews);
  },

  dispatchNullEntity() {
    Promise.resolve({ entityDescription: null, entityOverviews: {} })
    .then(this.dispatchProcessFinishedOk);
  },

  getEntityDescription(identity, entityOverviews) {
    return fetchGraphQL(GetEntityDescription, { id: identity })
      .then(this.graphQLErrorAPI)
      .then(graphQLResult => this.addEntityDescription(identity,graphQLResult))
      .then(entityDescription => this.addEntityPropertyValues(entityOverviews,entityDescription))
      .then(this.dispatchProcessFinishedOk)
      .catch(this.dispatchProcessFinishedError);
  },

  addEntityDescription(identity, graphQLResult) {
    let GetEntityDescription = graphQLResult.data.GetEntityDescription;

    return {
      entityDescription: {
        identity,
        removable: GetEntityDescription.removable,
        propertyDescriptions: GetEntityDescription.propertyDescriptions,
        translatedMessages: GetEntityDescription.translatedMessages
      }
    };
  },

  addEntityPropertyValues(entityOverviews, { entityDescription }) {
    let entityPropertyValuesRequests = this.getEntityPropertyValuesRequests(
      entityOverviews,
      entityDescription
    );

    return entityPropertyValuesRequests.length
      ? fetchGraphQL(GetEntityPropertyValues, {
          epvsrs: entityPropertyValuesRequests
        })
          .then(this.graphQLErrorAPI)
          .then(graphQLResult => this.addEntityOverviews(entityDescription,graphQLResult))
      : { entityDescription };
  },

  getEntityPropertyValuesRequests(entityOverviews, entityDescription) {
    let entityPropertyValuesRequests = entityDescription.propertyDescriptions.reduce(
      (a, pd) => {
        let requests = getEntityPropertyValuesRequests(pd, entityOverviews);

        return requests.length ? a.concat(requests) : a;
      },
      []
    );

    return entityPropertyValuesRequests;
  },

  addEntityOverviews(entityDescription, graphQLResult) {
    let entityPropertyValues = graphQLResult.data.GetEntityPropertyValues;

    let entityOverviews = entityPropertyValues.reduce((a, epv) => {
      a[epv.id] = new EntityOverview(epv.propertyValues);
      return a;
    }, {});

    return {
      entityDescription,
      entityOverviews
    };
  }
};
Object.setPrototypeOf(LoadEntityProcess, Process);

function EntityOverview(propertyValues) {
  propertyValues.forEach(pv => (this[pv.property] = pv.value));
}

export default LoadEntityProcess;
