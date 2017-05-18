/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import KugmError from './KugmError';

const responseWithError = (res) => (err) => {
  if (err instanceof KugmError) {
    console.log("responseWithError: KugmError:",JSON.stringify(err));

    let status = err.status;
    if (! status)
      status = 500;

    let errorMessages = err.errorMessages;
    if (! errorMessages)
      errorMessages = [];

    res.status(status).send({errorMessages});
  } else if (err instanceof Error) {
    if (err.name==='ValidationError') {
      let errorMessages = [];
      for(let e in err.errors)
        errorMessages.push(err.errors[e].message);
      res.status(400).send({errorMessages:errorMessages});
    } else {
      console.log("responseWithError: Error:", err);
      res.status(500).send({errorMessages:[err.message]});
    }
  } else {
    console.log("responseWithError: Not an Error object:", err);

    res.status(500).send({errorMessages:[]});
  }
}

export default responseWithError;
