/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
//To let browserHistory use in test env
export default class SessionStorageMock {
  constructor() {
    this.length = 0;
  }
  setItem(k, v) {
    this[k] = v;
    this.length = Object.keys(this).length - 1;
  }
  getItem(k) {
    return this[k];
  }
  removeItem(k) {
    delete this[k];
    this.length = Object.keys(this).length - 1;
  }
}
