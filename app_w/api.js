/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import 'whatwg-fetch';//safari 10.0 needs it

//About the  difference between fetch and request
//
//Fetch is only the communication to the server.
//Request is the goal of that communication.
//Therefore a request can fail with a successfully fetch (e.g the server refuse the request or otherwise not possible to accomplish the request)
//That is the way how whatwg-fetch sees the communication (https://github.com/github/fetch#caveats)

export const fetchLocale = (locale) => {
  return fetch(`/locale?locale=${locale}`, {
            method:       'get',
            credentials:  'same-origin'
          })
         .then(errorAPI)
         .then(response=>response.json());
}

export const fetchProductGroup = (id,locale) => {
  return fetch(`/getProductGroup?id=${id}&locale=${locale}`, {
            method:       'get',
            credentials:  'same-origin'
          })
         .then(errorAPI)
         .then(response=>response.json());
}

export const fetchProduct = (id,locale) => {
  return fetch(`/getProduct?id=${id}&locale=${locale}`, {
            method:       'get',
            credentials:  'same-origin'
          })
         .then(errorAPI)
         .then(response=>response.json());
}

export const fetchArtist = (name,locale) => {
  return fetch(`/getArtist?name=${name}&locale=${locale}`, {
            method:       'get',
            credentials:  'same-origin'
          })
         .then(errorAPI)
         .then(response=>response.json());
}



function errorAPI(response) {
  return (response.status===200)
         ? Promise.resolve(response)
         : Promise.reject();
}
