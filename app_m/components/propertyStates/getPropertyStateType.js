/**
*  Copyright (c) 017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import IdArrayPropertyState from './IdArrayPropertyState';
import BoolPropertyState from './BoolPropertyState';
import DataURLPropertyState from './DataURLPropertyState';
import StringPropertyState from './StringPropertyState';
import LocalizedStringsPropertyState from './LocalizedStringsPropertyState';
import FileUploadStatusPropertyState from './FileUploadStatusPropertyState';

const getPropertyStateType = typename => {
  switch (typename) {
    case 'IdArrayProperty':
      return IdArrayPropertyState;
    case 'BooleanProperty':
      return BoolPropertyState;
    case 'DataURLProperty':
      return DataURLPropertyState;
    case 'StringProperty':
      return StringPropertyState;
    case 'LocalizedStringsProperty':
      return LocalizedStringsPropertyState;
    case 'FileUploadStatusProperty':
      return FileUploadStatusPropertyState;
    default:
      throw new Error(`No External Content State for ${typename}`);
  }
};

export default getPropertyStateType;
