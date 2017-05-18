/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import IdArrayPropertyView          from './IdArrayPropertyView';
import StringPropertyView           from './StringPropertyView';
import BoolPropertyView             from './BoolPropertyView';
import DataURLPropertyView          from './DataURLPropertyView';
import FileUploadStatusPropertyView from './FileUploadStatusPropertyView';

const getPropertyViewConstructor = (typename) => {
  switch (typename) {
    case 'IdArrayProperty':           return IdArrayPropertyView;
    case 'LocalizedStringsProperty':
    case 'StringProperty':            return StringPropertyView;
    case 'BooleanProperty':           return BoolPropertyView;
    case 'DataURLProperty':           return DataURLPropertyView;
    case 'FileUploadStatusProperty':  return FileUploadStatusPropertyView;
    default:
      throw new Error(`Cannot make PropertView: unknown property description type ${typename}`);
  }
}

export default getPropertyViewConstructor;
