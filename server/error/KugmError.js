/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
//This error type should contain information to the app user.
function KugmError({status, errorMessages}) {
  this.status        = status;
  this.errorMessages = errorMessages;
}
KugmError.prototype = Object.create(Error.prototype);
KugmError.prototype.constructor = KugmError;


function BadRequest(message) {
  KugmError.call(this,{status:400,errorMessages:[message]});
}
BadRequest.prototype = Object.create(KugmError.prototype);
BadRequest.prototype.constructor = BadRequest;


function NotFound(message) {
  KugmError.call(this,{status:404,errorMessages:[message]});
}
NotFound.prototype = Object.create(KugmError.prototype);
NotFound.prototype.constructor = NotFound;


function InternalServerError(message) {
  KugmError.call(this,{status:500,errorMessages:[message]});
}
InternalServerError.prototype = Object.create(KugmError.prototype);
InternalServerError.prototype.constructor = InternalServerError;


export {BadRequest,NotFound,InternalServerError};
export default KugmError;
