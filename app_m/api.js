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

//TODO add right CSRF prevention: using JSON is not enough
//See https://www.owasp.org/index.php/Reviewing_code_for_Cross-Site_Request_Forgery_issues

//TODO -> fetchGetUser
export const fetchIsLoggedIn = () => {
  return fetch(`/auth/user`, {
            method:       'get',
            credentials:  'same-origin'//To send cookies (session data)
          })
         .then(errorAPI)
         .then(response=>response.json())
         .then(json   =>({
           userName:           json.userName,
           registeringAllowed: json.registeringAllowed
         }));
}


export const fetchLogout = () => {
  return fetch(`/auth/logout`, {
            method:       'post',
            credentials:  'same-origin'//To send cookies (session data)
          })
         .then(errorAPI)
         .then(extractRegisteringAllowed);
}

export const fetchLogin = (username, password) => {
  return fetch(`/auth/login`, {
            method:       'post',
            credentials:  'same-origin',//To send cookies (session data)
            headers:      {'Content-Type': 'application/json'},
            body:         JSON.stringify({username, password})
          })
         .then(errorAPI)
         .then(response=>response.json())
         .then(json   =>({
           userName:  json.userName,
         }));
}

export const fetchSignup = (username, password) => {
  return fetch(`/auth/signup`, {
            method:       'post',
            credentials:  'same-origin',//To send cookies (session data)
            headers:      {'Content-Type': 'application/json'},
            body:         JSON.stringify({username, password})
          })
         .then(errorAPI);
}

export const fetchSetNewPassword = (password,newPassword) => {
  return fetch(`/auth/setNewPassword`, {
            method:       'post',
            credentials:  'same-origin',//To send cookies (session data)
            headers:      {'Content-Type': 'application/json'},
            body:         JSON.stringify({password,newPassword})
          })
         .then(errorAPI)
         .then(extractRegisteringAllowed);
}


export const fetchGraphQL = (query,variables) => {//GraphQL calls it query even for mutation
  return fetch(`/graphql`, {
            method:       'post',
            credentials:  'same-origin',//To send cookies (session data)
            headers:      {'Content-Type': 'application/json'},
            body:         JSON.stringify({query,variables})
          })
         .then(errorAPI)
         .then(response=>response.json());
}


const extractRegisteringAllowed = (response) => {
  return response.json()
         .then(json   =>({
                          registeringAllowed: json.registeringAllowed
                        })
       );
}


function errorAPI(response) {
  return (response.status===200)
         ? Promise.resolve(response)
         : response.json()
           //We are on the error branch anyway therefore this function must return a rejected Promise,
           //but is there some message to show the user?
           .then(({errorMessages})=>Promise.reject(errorMessages))
           .catch(errorMessages=>{
             throw {errorMessages: Array.isArray(errorMessages) ? errorMessages : [`HTTP Status ist ${response.status}`] };
           });
}
