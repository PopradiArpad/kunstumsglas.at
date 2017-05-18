/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose   from 'mongoose';

function FileUploadStatus(key, options) {
  mongoose.SchemaType.call(this, key, options, 'FileUploadStatus');
}

FileUploadStatus.prototype = Object.create(mongoose.SchemaType.prototype);

// `cast()` takes a parameter that can be anything. You need to
// validate the provided `val` and throw a `CastError` if you
// can't convert it.
FileUploadStatus.prototype.cast = function(val) {
  if ((val==='UPLOADED') || (val==='NOT_UPLOADED'))
    return val;

  throw new Error('FileUploadStatus: ' + val + ' is not a possible value');
};

// Don't forget to add `Int8` to the type registry
mongoose.Schema.Types.FileUploadStatus = FileUploadStatus;
